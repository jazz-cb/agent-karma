'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface LendingPool {
  asset: string
  apy: number
  protocol: string
  available: number
  tokenAddress: string
  poolAddress: string
  priceUSD: number
  riskLevel: 'low' | 'medium' | 'high'
  tvl: number
}

// Hardcoded lending pools data
const MOCK_LENDING_POOLS: LendingPool[] = [
  {
    asset: 'ETH',
    apy: 3.8,
    protocol: 'Compound III',
    available: 1000,
    tokenAddress: '0x4200000000000000000000000000000000000006',
    poolAddress: '0x571621Ce60Cebb0c1D442B5afb38B1663C6Bf017',
    priceUSD: 2500,
    riskLevel: 'low',
    tvl: 50000000
  },
  {
    asset: 'BTC',
    apy: 2.5,
    protocol: 'Compound III',
    available: 100,
    tokenAddress: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
    poolAddress: '0x571621Ce60Cebb0c1D442B5afb38B1663C6Bf017',
    priceUSD: 45000,
    riskLevel: 'low',
    tvl: 100000000
  }
]

const RiskBadge = ({ level }: { level: 'low' | 'medium' | 'high' }) => {
  const colors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
    </span>
  )
}

export default function BuffetStrategyPage() {
  const [selectedPool, setSelectedPool] = useState<string>('')
  const [usdAmount, setUsdAmount] = useState<string>('')
  const [tokenAmount, setTokenAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPoolsLoading, setIsPoolsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lendingPools, setLendingPools] = useState<LendingPool[]>([])

  useEffect(() => {
    const fetchPools = async () => {
      try {
        setIsPoolsLoading(true)
        setError(null)
        const response = await fetch('/api/lending/pools')
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }
        
        setLendingPools(data.pools)
      } catch (err) {
        console.error('Failed to fetch pools:', err)
        setError('Failed to load lending pools. Using cached data.')
        setLendingPools(MOCK_LENDING_POOLS)
      } finally {
        setIsPoolsLoading(false)
      }
    }

    fetchPools()
  }, [])

  // Convert USD amount to token amount when user inputs USD
  useEffect(() => {
    if (!selectedPool || !usdAmount) {
      setTokenAmount('')
      return
    }

    const pool = lendingPools.find(p => p.asset === selectedPool)
    if (!pool) return

    const calculatedTokens = parseFloat(usdAmount) / pool.priceUSD
    setTokenAmount(calculatedTokens.toFixed(6))
  }, [usdAmount, selectedPool, lendingPools])

  const handleLend = async () => {
    setIsLoading(true)
    try {
      // For now, just show an alert
      alert(`Would lend ${tokenAmount} ${selectedPool} (${usdAmount} USD)`)
    } catch (error) {
      console.error('Error:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800 p-8">
            <div className="relative">
              <h1 className="text-3xl font-bold text-white mb-2">
                Buffet Strategy
              </h1>
              <p className="text-blue-100">
                Value-focused lending in stable assets
              </p>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300">
                {error}
              </div>
            )}

            {isPoolsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 text-gray-400">Loading pools...</span>
              </div>
            ) : (
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Lending Pool
                  </label>
                  <div className="space-y-4">
                    {lendingPools.map((pool) => (
                      <div 
                        key={pool.asset}
                        className={`p-4 rounded-lg border ${
                          selectedPool === pool.asset 
                            ? 'border-blue-500 bg-blue-900/20' 
                            : 'border-gray-700 hover:border-gray-600'
                        } cursor-pointer transition-colors`}
                        onClick={() => setSelectedPool(pool.asset)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-medium">{pool.asset}</h3>
                            <p className="text-sm text-gray-400">{pool.protocol}</p>
                          </div>
                          <RiskBadge level={pool.riskLevel} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <p className="text-gray-400">APY</p>
                            <p className="font-medium text-green-400">{pool.apy}%</p>
                          </div>
                          <div>
                            <p className="text-gray-400">TVL</p>
                            <p className="font-medium">${(pool.tvl / 1000000).toFixed(1)}M</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPool && (
                  <div className="mt-8 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount to Lend (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          className="w-full bg-gray-700 rounded-lg p-3 pl-8 text-white"
                          value={usdAmount}
                          onChange={(e) => setUsdAmount(e.target.value)}
                          placeholder="Enter USD amount"
                          min="0"
                        />
                      </div>
                    </div>

                    {usdAmount && (
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Transaction Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">You pay</span>
                            <span className="text-white">${parseFloat(usdAmount).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">You receive</span>
                            <span className="text-white">{tokenAmount} {selectedPool}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Exchange rate</span>
                            <span className="text-white">1 {selectedPool} = ${lendingPools.find(p => p.asset === selectedPool)?.priceUSD.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleLend}
                      disabled={isLoading || !usdAmount || parseFloat(usdAmount) <= 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      {isLoading ? 'Processing...' : 'Lend Assets'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 