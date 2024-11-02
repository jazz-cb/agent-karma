from typing import Dict, Any
from web3 import Web3
from decimal import Decimal
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Compound III comet ABI (simplified version with just the methods we need)
COMPOUND_ABI = json.loads('''[
    {
        "inputs": [{"internalType": "address","name": "asset","type": "address"},
                   {"internalType": "uint256","name": "amount","type": "uint256"}],
        "name": "supply",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSupplyRate",
        "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]''')

CHAINLINK_ABI = json.loads('''[
    {
        "inputs": [],
        "name": "latestAnswer",
        "outputs": [{"internalType": "int256","name": "","type": "int256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{"internalType": "uint8","name": "","type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    }
]''')

class LendingAgent:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(os.getenv('BASE_SEPOLIA_RPC')))
        self.private_key = os.getenv('PRIVATE_KEY')
        self.account = self.w3.eth.account.from_key(self.private_key)
        self.wallet_address = self.account.address
        
        # Contract addresses
        self.price_feeds = {
            'ETH': '0x7D9457550CC58d12d53B50B09F6Af11100B8012D',  # Base Sepolia ETH/USD
            'BTC': '0xC8CCEF06f38B140C4A8D23B8F0cA9C00fE44E8A8'   # Base Sepolia BTC/USD
        }
        
        self.lending_pools = {
            'ETH': {
                'address': '0x571621Ce60Cebb0c1D442B5afb38B1663C6Bf017',  # cUSDCv3
                'token': '0x4200000000000000000000000000000000000006',    # WETH
                'decimals': 18,
                'risk_level': 'low'
            },
            'BTC': {
                'address': '0x46e6b214b524310239732D51387075E0e70970bf',  # cUSDCv3
                'token': '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',    # WBTC
                'decimals': 8,
                'risk_level': 'low'
            }
        }

    def get_price(self, asset: str) -> float:
        """Get current price from Chainlink price feeds"""
        try:
            price_feed = self.w3.eth.contract(
                address=self.w3.to_checksum_address(self.price_feeds[asset]),
                abi=CHAINLINK_ABI
            )
            
            latest_price = price_feed.functions.latestAnswer().call()
            decimals = price_feed.functions.decimals().call()
            
            return float(latest_price) / (10 ** decimals)
        except Exception as e:
            print(f"Error getting price for {asset}: {str(e)}")
            return 0

    async def get_pools(self) -> Dict[str, Any]:
        """Get all available lending pools and their current rates"""
        pools = []
        
        for asset, pool_info in self.lending_pools.items():
            try:
                # Get price from Chainlink
                price = self.get_price(asset)
                if price == 0:
                    print(f"Skipping {asset} due to price feed error")
                    continue
                
                # Get pool data from Compound
                pool_contract = self.w3.eth.contract(
                    address=self.w3.to_checksum_address(pool_info['address']),
                    abi=COMPOUND_ABI
                )
                
                try:
                    # Get supply rate (convert to APY)
                    supply_rate = pool_contract.functions.getSupplyRate().call()
                    blocks_per_year = 2_102_400  # ~2s blocks
                    apy = ((1 + (supply_rate / 1e18) / blocks_per_year) ** blocks_per_year - 1) * 100
                except Exception as e:
                    print(f"Error calculating APY for {asset}: {str(e)}")
                    apy = 0
                
                # Get total supply and TVL
                total_supply = pool_contract.functions.totalSupply().call()
                tvl = float(total_supply) * price / (10 ** pool_info['decimals'])
                
                pools.append({
                    'asset': asset,
                    'apy': round(apy, 2),
                    'protocol': 'Compound III',
                    'available': float(total_supply) / (10 ** pool_info['decimals']),
                    'tokenAddress': pool_info['token'],
                    'poolAddress': pool_info['address'],
                    'priceUSD': price,
                    'riskLevel': pool_info['risk_level'],
                    'tvl': round(tvl, 2)
                })
            except Exception as e:
                print(f"Error getting pool data for {asset}: {str(e)}")
                continue
        
        if not pools:
            raise Exception("No pools could be loaded")
            
        return {'pools': pools}

    async def lend(self, asset: str, token_amount: float, pool_address: str) -> Dict[str, Any]:
        """Execute lending transaction"""
        try:
            pool_contract = self.w3.eth.contract(
                address=self.w3.to_checksum_address(pool_address),
                abi=COMPOUND_ABI
            )
            
            # Convert amount to Wei
            amount_wei = self.w3.to_wei(token_amount, 'ether')
            
            # Build transaction
            tx = pool_contract.functions.supply(
                self.w3.to_checksum_address(self.lending_pools[asset]['token']),
                amount_wei
            ).build_transaction({
                'from': self.wallet_address,
                'gas': 300000,
                'maxFeePerGas': self.w3.eth.gas_price * 2,
                'maxPriorityFeePerGas': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(self.wallet_address)
            })
            
            # Sign and send transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            # Wait for transaction receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {
                'success': True,
                'transaction_hash': tx_hash.hex(),
                'block_number': receipt['blockNumber']
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }