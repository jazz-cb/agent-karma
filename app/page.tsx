import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="w-full max-w-6xl mx-auto pt-24 pb-16 px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          FAM
        </h1>
        <p className="text-2xl md:text-3xl font-bold mb-4 text-white">
          Financial Agent Management
        </p>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Transform your financial strategies with AI-powered agents that adapt to market conditions in real-time
        </p>
      </div>

      {/* DeFi Analyst Section */}
      <div className="w-full max-w-5xl mx-auto px-6 pb-24">
        <div className="p-8 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-8 text-teal-400">
            DeFi Market Analyst
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/create/defi-analyst/bearish" className="block">
              <div className="p-4 rounded-lg border border-gray-800 hover:border-red-500/50 bg-gray-900/50 transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-red-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-base font-medium group-hover:text-red-400">Bearish</span>
                    <p className="text-sm text-gray-400">Conservative, risk-averse strategy</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/create/defi-analyst/buffet" className="block">
              <div className="p-4 rounded-lg border border-gray-800 hover:border-blue-500/50 bg-gray-900/50 transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-base font-medium group-hover:text-blue-400">Buffet</span>
                    <p className="text-sm text-gray-400">Value investing approach</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/create/defi-analyst/bullish" className="block">
              <div className="p-4 rounded-lg border border-gray-800 hover:border-green-500/50 bg-gray-900/50 transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-base font-medium group-hover:text-green-400">Bullish</span>
                    <p className="text-sm text-gray-400">Growth-focused strategy</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/create/defi-analyst/moon" className="block">
              <div className="p-4 rounded-lg border border-gray-800 hover:border-purple-500/50 bg-gray-900/50 transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-base font-medium group-hover:text-purple-400">Moon</span>
                    <p className="text-sm text-gray-400">High-risk, high-reward approach</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
