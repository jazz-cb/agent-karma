import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}

      <div className="w-full border-b border-gray-800 fixed top-0 z-50 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-gray-600 transition-colors flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Login / Register</span>
            </button>

            <button className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Inventory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add padding to the top of your existing content */}
      <div className="pt-16">
        {/* Your existing hero section */}
        <div className="w-full max-w-6xl mx-auto pt-24 pb-8 px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            FAM
          </h1>
          {/* Headline Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-2">
                $600M+
              </div>
              <p className="text-sm text-gray-400 font-medium">
                Market Value Created<br />by Agents
              </p>
            </div>

            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-2">
                2B+
              </div>
              <p className="text-sm text-gray-400 font-medium">
                Transactions<br />by Agents
              </p>
            </div>

            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-2">
                10T
              </div>
              <p className="text-sm text-gray-400 font-medium">
                Agents by<br />2030
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Finance Wizard Section */}
      <div className="w-full max-w-5xl mx-auto px-6 pb-24">
        <div className="p-8 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Finance Wizard
          </h2>
          <p className="text-center text-gray-400 mb-8">
            One-click launch your AI-powered financial strategy companion
          </p>

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

        {/* Best Seller Ribbon */}
        <div className="relative w-full max-w-5xl mx-auto flex justify-center -mt-3 mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-2 rounded-full shadow-lg">
            <span className="font-bold text-sm tracking-wider">#1 BEST SELLER</span>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="w-full max-w-5xl mx-auto px-6">
          <div className="mb-6">
            <span className="text-blue-400 text-sm font-semibold bg-blue-500/10 px-4 py-1 rounded-full">
              Coming Soon
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Payments Agent */}
            <div className="p-6 rounded-xl border border-gray-800/50 bg-gray-900/30 hover:bg-gray-900/50 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-300">Payments</h3>
              </div>
              <p className="text-sm text-gray-400">
                Streamline payment processing and reconciliation
              </p>
            </div>

            {/* International Agent */}
            <div className="p-6 rounded-xl border border-gray-800/50 bg-gray-900/30 hover:bg-gray-900/50 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-300">International</h3>
              </div>
              <p className="text-sm text-gray-400">
                Manage cross-border transactions and forex
              </p>
            </div>

            {/* Enterprise Agent */}
            <div className="p-6 rounded-xl border border-gray-800/50 bg-gray-900/30 hover:bg-gray-900/50 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-300">Enterprise</h3>
              </div>
              <p className="text-sm text-gray-400">
                Advanced solutions for large organizations
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
