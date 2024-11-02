'use client'

import { useState } from 'react'
import { Loader2, MessageCircle } from 'lucide-react'
import ChatWindow from '@/app/components/ChatWindow'
import CredentialWidget from '@/app/components/CredentialWidget'

interface SupplyResponse {
  txHash: string
}

export default function BuffetStrategyPage() {
  const [amount, setAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleSupply = async () => {
    if (!amount || isLoading) return
    
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/aave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'supply',
          amount: amount
        }),
      })

      const data = await response.json()
      console.log("API Response:", data)
      setResult(data)
    } catch (err) {
      setError(err.message || 'An error occurred while supplying USDC')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden relative">
          {/* Add CredentialWidget */}
          <CredentialWidget />

          {/* Header Section */}
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

          {/* Main Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Supply USDC</h2>
              <p className="text-gray-400 mb-6">
                Supply your USDC to Aave to earn interest while maintaining a value-focused position.
              </p>
              
              {/* Amount Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (USDC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full bg-gray-700 rounded-lg p-3 text-white"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter USDC amount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Supply Button */}
                <button
                  onClick={handleSupply}
                  disabled={isLoading || !amount || parseFloat(amount) <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                           text-white font-bold py-3 px-4 rounded-lg transition-colors
                           flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Supplying...
                    </>
                  ) : (
                    'Supply USDC'
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

            {result && (
              <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-300">
                Transaction successful! {JSON.stringify(result)}
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