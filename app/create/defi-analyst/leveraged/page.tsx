'use client'

import { useState } from 'react'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

interface SupplyResponse {
  txHash: string
}

interface Step {
  number: number
  title: string
  description: string
  status: 'pending' | 'loading' | 'complete' | 'error'
  txHash?: string
}

export default function LeveragedStrategyPage() {
  const [initialAmount, setInitialAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [steps, setSteps] = useState<Step[]>([
    {
      number: 1,
      title: 'Initial Supply',
      description: 'Supply USDC to Aave as collateral',
      status: 'pending'
    },
    {
      number: 2,
      title: 'Borrow USDC',
      description: 'Borrow 30% of supplied USDC',
      status: 'pending'
    },
    {
      number: 3,
      title: 'Re-supply Borrowed',
      description: 'Supply borrowed USDC back to Aave',
      status: 'pending'
    }
  ])

  const updateStepStatus = (stepNumber: number, status: Step['status'], txHash?: string) => {
    setSteps(steps.map(step => 
      step.number === stepNumber 
        ? { ...step, status, txHash }
        : step
    ))
  }

  const handleInitialSupply = async () => {
    if (!initialAmount || isLoading) return
    
    setIsLoading(true)
    setError(null)
    updateStepStatus(1, 'loading')

    try {
      const response = await fetch('/aave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'supply',
          amount: initialAmount
        }),
      })

      const data: SupplyResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.txHash || 'Failed to supply USDC')
      }

      updateStepStatus(1, 'complete', data.txHash)
      
      // Automatically proceed to borrow step
      const borrowAmount = (parseFloat(initialAmount) * 0.3).toString()
      await handleBorrow(borrowAmount)
    } catch (err: any) {
      setError(err.message || 'An error occurred during the initial supply')
      updateStepStatus(1, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBorrow = async (amount: string) => {
    updateStepStatus(2, 'loading')
    
    try {
      const response = await fetch('/aave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'borrow',
          amount: amount
        }),
      })

      const data: SupplyResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.txHash || 'Failed to borrow USDC')
      }

      updateStepStatus(2, 'complete', data.txHash)
      
      // Automatically proceed to re-supply step
      await handleReSupply(amount)
    } catch (err: any) {
      setError(err.message || 'An error occurred while borrowing')
      updateStepStatus(2, 'error')
    }
  }

  const handleReSupply = async (amount: string) => {
    updateStepStatus(3, 'loading')
    
    try {
      const response = await fetch('/aave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'supply',
          amount: amount
        }),
      })

      const data: SupplyResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.txHash || 'Failed to re-supply USDC')
      }

      updateStepStatus(3, 'complete', data.txHash)
    } catch (err: any) {
      setError(err.message || 'An error occurred while re-supplying')
      updateStepStatus(3, 'error')
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
                Leveraged Strategy
              </h1>
              <p className="text-purple-100">
                Maximize yields through leveraged lending positions
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Leveraged USDC Supply</h2>
              <p className="text-gray-400 mb-6">
                Supply USDC to Aave, borrow against it, and re-supply for enhanced yields.
              </p>

              {/* Steps Display */}
              <div className="space-y-4 mb-8">
                {steps.map((step) => (
                  <div 
                    key={step.number}
                    className={`p-4 rounded-lg border ${
                      step.status === 'complete' 
                        ? 'border-green-500/50 bg-green-900/20'
                        : step.status === 'error'
                        ? 'border-red-500/50 bg-red-900/20'
                        : 'border-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {step.status === 'loading' && (
                          <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                        )}
                        {step.status === 'complete' && (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        )}
                        {step.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                        {step.status === 'pending' && (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium">
                          Step {step.number}: {step.title}
                        </h3>
                        <p className="text-sm text-gray-400">{step.description}</p>
                        {step.txHash && (
                          <p className="text-xs text-gray-500 mt-1">
                            TX: {step.txHash.slice(0, 10)}...
                          </p>
                        )}
                      </div>
                    </div>
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
                      disabled={isLoading || currentStep > 1}
                    />
                  </div>
                </div>

                {/* Supply Button */}
                <button
                  onClick={handleInitialSupply}
                  disabled={isLoading || !initialAmount || parseFloat(initialAmount) <= 0 || currentStep > 1}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 
                           text-white font-bold py-3 px-4 rounded-lg transition-colors
                           flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Start Leveraged Supply'
                  )}
                </button>
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 mb-4">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 