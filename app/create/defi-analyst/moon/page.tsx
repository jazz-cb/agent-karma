'use client'

import { useState } from 'react'
import { Loader2, MessageCircle, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import ChatWindow from '@/app/components/ChatWindow'
import CredentialWidget from '@/app/components/CredentialWidget'

interface SupplyResponse {
  txHash: string
}

interface Step {
  number: number
  title: string
  description: string
  status: 'pending' | 'loading' | 'complete' | 'error'
  txHash?: any
}

interface SuccessMessage {
  show: boolean
  message: string
}

export default function MoonStrategyPage() {
  const [initialAmount, setInitialAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
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
      description: 'Borrow 30% USDC against your collateral',
      status: 'pending'
    },
    {
      number: 3,
      title: 'Supply Borrowed',
      description: 'Supply borrowed USDC back to Aave',
      status: 'pending'
    }
  ])
  const [successMessage, setSuccessMessage] = useState<SuccessMessage>({
    show: false,
    message: ''
  })
  const [showTransactions, setShowTransactions] = useState(false)

  const updateStepStatus = (stepNumber: number, status: Step['status'], txHash?: any) => {
    setSteps(prevSteps => prevSteps.map(step => 
      step.number === stepNumber 
        ? { ...step, status, txHash }
        : step.status === 'complete' 
          ? step  // Keep completed steps as is
          : step
    ))
  }

  const executeStep = async (stepNumber: number, amount: string, action: string) => {
    updateStepStatus(stepNumber, 'loading')
    
    try {
      const response = await fetch('/api/aave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, amount }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Failed to execute step ${stepNumber}`)
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      updateStepStatus(stepNumber, 'complete', data.txHash)
      return data
    } catch (error: any) {
      updateStepStatus(stepNumber, 'error')
      throw error
    }
  }

  const handleStartStrategy = async () => {
    if (!initialAmount || isLoading) return
    
    setIsLoading(true)
    setError(null)
    setSuccessMessage({ show: false, message: '' })

    try {
      setSteps(steps.map(step => ({
        ...step,
        status: step.status === 'complete' ? 'complete' : 'pending'
      })))

      await executeStep(1, initialAmount, 'supply')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await executeStep(2, initialAmount, 'borrow')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await executeStep(3, initialAmount, 'supply')

      setIsLoading(false)
      
      setSuccessMessage({
        show: true,
        message: "🚀 Moon Strategy successfully executed! All steps completed."
      })

      setTimeout(() => {
        setSteps(steps.map(step => ({ ...step, status: 'pending' })))
        setInitialAmount('')
        setCurrentStep(1)
        setSuccessMessage({ show: false, message: '' })
      }, 5000)

    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message || 'An error occurred during the strategy execution')
      setIsLoading(false)
    }
  }

  const hasCompletedTransactions = () => {
    return steps.some(step => step.status === 'complete' && step.txHash)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden relative">
          <CredentialWidget />

          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-purple-600 to-blue-600 p-8">
            <div className="relative">
              <h1 className="text-3xl font-bold text-white mb-2">
                Moon Strategy
              </h1>
              <p className="text-blue-100">
                High-risk, high-reward: Maximize your gains through leveraged positions
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Moon Strategy Setup</h2>
              <p className="text-gray-400 mb-6">
                Execute a series of steps to maximize your position through leveraged lending.
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
                          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
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

              {/* Transaction History Section */}
              {hasCompletedTransactions() && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowTransactions(!showTransactions)}
                    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {showTransactions ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                    {showTransactions ? 'Hide Transactions' : 'Click to see transactions'}
                  </button>
                  
                  {showTransactions && (
                    <div className="mt-3 space-y-2">
                      {steps.map((step) => (
                        step.status === 'complete' && step.txHash && (
                          <div key={step.number} className="flex items-center text-sm text-gray-400">
                            <span className="mr-2">Step {step.number}:</span>
                            <a 
                              href={`https://sepolia.etherscan.io/tx/${step.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-400 hover:text-blue-300"
                            >
                              {step.txHash.slice(0, 10)}...{step.txHash.slice(-8)}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Amount Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Initial Amount (USDC)
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

                {/* Action Button */}
                <button
                  onClick={handleStartStrategy}
                  disabled={isLoading || !initialAmount || parseFloat(initialAmount) <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                           text-white font-bold py-3 px-4 rounded-lg transition-colors
                           flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Executing Strategy...
                    </>
                  ) : (
                    'Start Moon Strategy'
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 mb-4">
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMessage.show && (
              <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-300 mb-4 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {successMessage.message}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Chat Icon Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 p-4 rounded-full shadow-lg transition-colors"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Chat Window Component */}
      <ChatWindow 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  )
} 