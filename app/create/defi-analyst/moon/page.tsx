'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface SupplyResponse {
  txHash: string
  success?: boolean
}

export default function MoonStrategyPage() {
  const [initialAmount, setInitialAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHashes, setTxHashes] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const maxSteps = 3

  const calculateBorrowAmount = (supplyAmount: number) => {
    return (supplyAmount * 0.3).toFixed(2) // 30% of supply amount
  }

  const handleLeveragedSupply = async () => {
    if (!initialAmount || isLoading) return
    
    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Initial Supply
      const supplyResponse = await fetch('/aave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'supply',
          amount: initialAmount
        }),
      })

      const supplyData: SupplyResponse = await supplyResponse.json()
      if (!supplyResponse.ok || !supplyData.success) {
        throw new Error('Failed to supply USDC')
      }
      setTxHashes(prev => [...prev, supplyData.txHash])
      setCurrentStep(2)

      // Step 2: Borrow 30%
      const borrowAmount = calculateBorrowAmount(parseFloat(initialAmount))
      const borrowResponse = await fetch('/aave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'borrow',
          amount: borrowAmount
        }),
      })

      const borrowData: SupplyResponse = await borrowResponse.json()
      if (!borrowResponse.ok || !borrowData.success) {
        throw new Error('Failed to borrow USDC')
      }
      setTxHashes(prev => [...prev, borrowData.txHash])
      setCurrentStep(3)

      // Step 3: Re-supply borrowed amount
      const resupplyResponse = await fetch('/aave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'supply',
          amount: borrowAmount
        }),
      })

      const resupplyData: SupplyResponse = await resupplyResponse.json()
      if (!resupplyResponse.ok || !resupplyData.success) {
        throw new Error('Failed to re-supply USDC')
      }
      setTxHashes(prev => [...prev, resupplyData.txHash])

    } catch (err: any) {
      setError(err.message || 'An error occurred during the leveraged supply process')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-purple-600 to-purple-800 p-8">
            <div className="relative">
              <h1 className="text-3xl font-bold text-white mb-2">
                Moon Strategy
              </h1>
              <p className="text-purple-100">
                Leveraged lending strategy for maximum yield potential
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Leveraged USDC Supply</h2>
              <p className="text-gray-400 mb-6">
                Supply USDC, borrow 30%, and re-supply for enhanced yields.
              </p>

              {/* Progress Steps */}
              <div className="flex justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step < currentStep ? 'bg-purple-500' :
                      step === currentStep ? 'bg-purple-900 border-2 border-purple-500' :
                      'bg-gray-700'
                    }`}>
                      {step}
                    </div>
                    <span className="text-sm mt-2 text-gray-400">
                      {step === 1 ? 'Supply' : step === 2 ? 'Borrow' : 'Re-supply'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Amount Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Initial Supply Amount (USDC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full bg-gray-700 rounded-lg p-3 text-white"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(e.target.value)}
                      placeholder="Enter USDC amount"
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Supply Button */}
                <button
                  onClick={handleLeveragedSupply}
                  disabled={isLoading || !initialAmount || parseFloat(initialAmount) <= 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 
                           text-white font-bold py-3 px-4 rounded-lg transition-colors
                           flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Step {currentStep}/{maxSteps}...
                    </>
                  ) : (
                    'Start Leveraged Supply'
                  )}
                </button>
              </div>
            </div>

            {/* Transaction Hashes */}
            {txHashes.length > 0 && (
              <div className="space-y-2">
                {txHashes.map((hash, index) => (
                  <div key={hash} className="p-4 bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-300">
                      Step {index + 1} Transaction: {hash}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 mt-4">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 