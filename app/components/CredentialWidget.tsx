'use client'

import { useState } from 'react'
import { Award, Loader2, ExternalLink } from 'lucide-react'

interface CredentialResponse {
  actionId: string;
  credentialId: string;
  id: string;
  onChain: {
    chain: string;
    contractAddress: string;
  };
}

export default function CredentialWidget() {
  const [isLoading, setIsLoading] = useState(false)
  const [showCredential, setShowCredential] = useState(false)
  const [credential, setCredential] = useState<CredentialResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    // Show popup and loading state immediately
    setShowCredential(true)
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'richard@gmail.com', // TODO: make this dynamic
        })
      })

      const data = await response.json()
      setCredential(data)
    } catch (err) {
      setError('Failed to fetch credentials')
      console.error('Error fetching credentials:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={handleClick}
        className="bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-colors"
        disabled={isLoading}
      >
        <Award className="w-6 h-6 text-white" />
      </button>

      {/* Credential Popup */}
      {showCredential && (
        <div className="absolute top-12 right-0 w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-white font-semibold">Agent Credentials</h3>
            <button
              onClick={() => {
                setShowCredential(false)
                setCredential(null)
                setError(null)
              }}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm">{error}</div>
          ) : credential ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-300 space-y-2">
                <div>
                  <span className="text-gray-400">Credential ID:</span>
                  <p className="font-mono text-xs mt-1">{credential.credentialId}</p>
                </div>
                
                <div>
                  <span className="text-gray-400">Network:</span>
                  <p className="capitalize">{credential.onChain.chain}</p>
                </div>

                <div>
                  <span className="text-gray-400">Contract Address:</span>
                  <a
                    href={`https://sepolia.etherscan.io/address/${credential.onChain.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-400 hover:text-blue-300 mt-1 font-mono text-xs"
                  >
                    {formatAddress(credential.onChain.contractAddress)}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>

                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className="capitalize">{credential.onChain.status}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
} 