import json
from swarm import Agent
from cdp import *
from typing import List, Dict, Any
import os
from openai import OpenAI
from decimal import Decimal
from typing import Union
from web3 import Web3
from web3.exceptions import ContractLogicError
from cdp.errors import ApiError, UnsupportedAssetError
from dotenv import load_dotenv

load_dotenv()

# Get configuration from environment variables
API_KEY_NAME = os.environ.get("CDP_API_KEY_NAME")
PRIVATE_KEY = os.environ.get("CDP_API_KEY_PRIVATE_KEY", "").replace('\\n', '\n')
WALLET_ID = os.environ.get("WALLET_ID")
WALLET_DATA = os.environ.get("WALLET_DATA")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Read abi json for aave and usdc
with open('abi/aave_v3.json', 'r') as f:
    aave_abi = json.load(f)

with open('abi/usdc.json', 'r') as f:
    usdc_abi = json.load(f)

AAVE_POOL_ADDRESS = "0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b"
USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"

# Configure CDP with environment variables
Cdp.configure(API_KEY_NAME, PRIVATE_KEY)

# Create a new wallet on the Base Sepolia testnet
# You could make this a function for the agent to create a wallet on any network
# If you want to use Base Mainnet, change Wallet.create() to Wallet.create(network_id="base-mainnet")
# see https://docs.cdp.coinbase.com/mpc-wallet/docs/wallets for more information

# read the wallet_data as json and get the seed
wallet_seed = json.loads(WALLET_DATA)[WALLET_ID]

dict = WalletData.from_dict(dict({
    "wallet_id": WALLET_ID,
    "seed": wallet_seed['seed']
}))

agent_wallet = Wallet.import_data(dict)
address = agent_wallet.default_address

print(f"Agent's wallet imported: {agent_wallet}")
print(f"Agent's wallet default address: {agent_wallet.default_address.address_id}")

def get_default_address():
    """
    Get the address of the agent's wallet.
    
    Returns:
        str: The agent's wallet address.
    """

    return f"My wallet is {agent_wallet.default_address.address_id} on Ethereum."

# Function to transfer assets
def transfer_asset(amount, asset_id, destination_address):
    """
    Transfer an asset to a specific address.
    
    Args:
        amount (Union[int, float, Decimal]): Amount to transfer
        asset_id (str): Asset identifier ("eth", "usdc") or contract address of an ERC-20 token
        destination_address (str): Recipient's address
    
    Returns:
        str: A message confirming the transfer or describing an error
    """
    try:
        # Check if we're on Base Mainnet and the asset is USDC for gasless transfer
        is_mainnet = agent_wallet.network_id == "base-mainnet"
        is_usdc = asset_id.lower() == "usdc"
        gasless = is_mainnet and is_usdc

        # For ETH and USDC, we can transfer directly without checking balance
        if asset_id.lower() in ["eth", "usdc"]:
            transfer = agent_wallet.transfer(amount,
                                             asset_id,
                                             destination_address,
                                             gasless=gasless)
            transfer.wait()
            gasless_msg = " (gasless)" if gasless else ""
            return f"Transferred {amount} {asset_id}{gasless_msg} to {destination_address}"

        # For other assets, check balance first
        try:
            balance = agent_wallet.balance(asset_id)
        except UnsupportedAssetError:
            return f"Error: The asset {asset_id} is not supported on this network. It may have been recently deployed. Please try again in about 30 minutes."

        if balance < amount:
            return f"Insufficient balance. You have {balance} {asset_id}, but tried to transfer {amount}."

        transfer = agent_wallet.transfer(amount, asset_id, destination_address)
        transfer.wait()
        return f"Transferred {amount} {asset_id} to {destination_address}"
    except Exception as e:
        return f"Error transferring asset: {str(e)}. If this is a custom token, it may have been recently deployed. Please try again in about 30 minutes, as it needs to be indexed by CDP first."


# Function to get the balance of a specific asset
def get_balance(asset_id):
    """
    Get the balance of a specific asset in the agent's wallet.
    
    Args:
        asset_id (str): Asset identifier ("eth", "usdc") or contract address of an ERC-20 token
    
    Returns:
        str: A message showing the current balance of the specified asset
    """
    balance = agent_wallet.balance(asset_id)
    return f"Current balance of {asset_id}: {balance}"


# Function to request ETH from the faucet (testnet only)
def request_eth_from_faucet():
    """
    Request ETH from the Base Sepolia testnet faucet.
    
    Returns:
        str: Status message about the faucet request
    """
    if agent_wallet.network_id == "base-mainnet":
        return "Error: The faucet is only available on Base Sepolia testnet."

    faucet_tx = agent_wallet.faucet()
    return f"Requested ETH from faucet. Transaction: {faucet_tx}"

# Aave pool deployed on base sepolia
AAVE_POOL_ADDRESS = "0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b"
# USDC deployed on base sepolia
USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"

# Load ABIs (assuming you have these JSON files)
with open('abi/aave_v3.json', 'r') as f:
    aave_abi = json.load(f)

with open('abi/usdc.json', 'r') as f:
    usdc_abi = json.load(f)

# Supply USDC to Aave
def supply_usdc_to_aave(amount):
    """
    Supply USDC to Aave after approving the spend
    
    Args:
        amount (str): Amount to supply
        
    Returns:
        dict: Transaction hash of the supply operation
    """
    amount_to_supply = parse_units(amount, 6)

    # First approve USDC spend
    approve_invocation = agent_wallet.invoke_contract(
        contract_address=USDC_ADDRESS,
        method="approve",
        args={
            "spender": AAVE_POOL_ADDRESS,
            "value": amount_to_supply
        },
        abi=usdc_abi
    )
    
    approve_result = approve_invocation.wait()
    print('USDC spend approved:', approve_result)

    # Supply to Aave
    supply_invocation = agent_wallet.invoke_contract(
        contract_address=AAVE_POOL_ADDRESS,
        method="supply",
        args={
            "asset": USDC_ADDRESS,
            "amount": amount_to_supply,
            "onBehalfOf": address.address_id,
            "referralCode": "0"
        },
        abi=aave_abi
    )
    
    supply_result = supply_invocation.wait()
    print('USDC supplied to Aave:', supply_result)

    return {"txHash": supply_result.transaction_hash}

# Borrow USDC from Aave
def borrow_usdc_from_aave(amount):
    """
    Borrow USDC from Aave
    
    Args:
        amount (str): Amount to borrow
        
    Returns:
        dict: Transaction status and hash
    """
    try:
        amount_to_borrow = parse_units(amount, 6)
        borrow_invocation = agent_wallet.invoke_contract(
            contract_address=AAVE_POOL_ADDRESS,
            method="borrow",
            args={
                "asset": USDC_ADDRESS,
                "amount": amount_to_borrow,
                "interestRateMode": "2",  # Variable rate
                "referralCode": "0",
                "onBehalfOf": address.address_id
            },
            abi=aave_abi
        )

        borrow_result = borrow_invocation.wait()
        print('Borrow transaction completed:', borrow_result)

        return {"success": True, "txHash": borrow_result.transaction_hash}

    except Exception as e:
        print(f"Failed to borrow: {e}")
        raise Exception(status_code=500, detail=str(e))

# Withdraw USDC from Aave
def withdraw_usdc_from_aave(amount):
    """
    Withdraw USDC from Aave
    
    Args:
        amount (str): Amount to withdraw
        
    Returns:
        dict: Transaction status and hash
    """
    try:
        amount_to_withdraw = parse_units(amount, 6)

        withdraw_invocation = agent_wallet.invoke_contract(
            contract_address=AAVE_POOL_ADDRESS,
            method="withdraw",
            args={
                "asset": USDC_ADDRESS,
                "amount": amount_to_withdraw,
                "to": address.address_id
            },
            abi=aave_abi
        )

        withdraw_result = withdraw_invocation.wait()
        print('Withdraw transaction completed:', withdraw_result)

        return {"success": True, "txHash": withdraw_result.transaction_hash}

    except Exception as e:
        print(f"Failed to withdraw: {e}")
        raise Exception(status_code=500, detail=str(e))


# Repay USDC loan to Aave
def repay_usdc_to_aave(amount):
    """
    Repay USDC loan to Aave
    
    Args:
        amount (str): Amount to repay
        
    Returns:
        dict: Transaction status and hash
    """
    try:
        amount_to_repay = parse_units(amount, 6)

        # First approve USDC spend
        approve_invocation = agent_wallet.invoke_contract(
            contract_address=USDC_ADDRESS,
            method="approve",
            args={
                "spender": AAVE_POOL_ADDRESS,
                "value": amount_to_repay
            },
            abi=usdc_abi
        )
        
        approve_result = approve_invocation.wait()
        print('USDC spend approved for repayment:', approve_result)

        # Repay the loan
        repay_invocation = agent_wallet.invoke_contract(
            contract_address=AAVE_POOL_ADDRESS,
            method="repay",
            args={
                "asset": USDC_ADDRESS,
                "amount": amount_to_repay,
                "interestRateMode": "2",  # Variable rate
                "onBehalfOf": address.address_id
            },
            abi=aave_abi
        )

        repay_result = repay_invocation.wait()
        print('USDC repaid to Aave:', repay_result)

        return {"success": True, "txHash": repay_result.transaction_hash}

    except Exception as e:
        print(f"Failed to repay loan: {e}")
        raise Exception(status_code=500, detail=str(e))
    
def parse_units(amount: str, decimals: int) -> str:
    """Convert human readable amount to wei"""
    return str(int(Decimal(amount) * Decimal(10 ** decimals)))

# Create the Reputation Agent with all available functions
reputation_agent = Agent(
    name="Reputation Agent",
    instructions=
    "You are a helpful agent that can interact onchain on the Base Layer 2 using the Coinbase Developer Platform SDK. If you ever need funds, you can request them from the faucet. Your main goal is going to be helping other agents find their onchain reputation by checking their onchain activity. If someone asks you to do something you can't do, you can say so, and encourage them to implement it themselves using the CDP SDK, recommend they go to docs.cdp.coinbase.com for more informaton. You can also offer to help them implement it by writing the function and telling them to add it to the agents.py file and within your list of callable functions. You can also interact with aave protocol.",
    functions=[
        transfer_asset,
        get_balance,
        request_eth_from_faucet,
        get_default_address,
        supply_usdc_to_aave,
        borrow_usdc_from_aave,
        withdraw_usdc_from_aave,
        repay_usdc_to_aave
    ],
)
