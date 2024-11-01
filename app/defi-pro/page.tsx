'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

type RiskLevel = 'conservative' | 'moderate' | 'aggressive'

interface Protocol {
  id: string
  name: string
  apy: string
  risk: RiskLevel
  description: string
}

export default function DefiProPage() {
  const searchParams = useSearchParams()
  const [riskLevel, setRiskLevel] = useState<RiskLevel>((searchParams.get('risk') as RiskLevel) || 'moderate')
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([])

  const riskLevels: { value: RiskLevel; label: string; description: string; color: string }[] = [
    {
      value: 'conservative',
      label: 'Conservative',
      description: 'Focus on established protocols with lower APY',
      color: 'from-blue-500 to-blue-600'
    },
    {
      value: 'moderate',
      label: 'Moderate',
      description: 'Balance between risk and return',
      color: 'from-green-500 to-green-600'
    },
    {
      value: 'aggressive',
      label: 'Aggressive',
      description: 'Focus on high-risk, high-reward protocols',
      color: 'from-red-500 to-red-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 p-8">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative">
              <h1 className="text-3xl font-bold text-white mb-2">
                DeFi Pro Agent
              </h1>
              <p className="text-blue-100">
                Configure your automated DeFi investment strategy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
