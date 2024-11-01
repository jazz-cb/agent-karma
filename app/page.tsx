import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            AI Agent Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Leverage the power of AI agents for your business needs
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-4">
          {/* Chat with Reputation Agent Card */}
          <Link href="/chat" className="group">
            <div className="h-full rounded-2xl bg-white dark:bg-gray-800 p-8 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
              
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h2 className="ml-4 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    Chat with Reputation Agent
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                  Start a conversation with our AI-powered reputation management expert
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                  Start Chat
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Create New Agent Card */}
          <div className="h-full rounded-2xl bg-white dark:bg-gray-800 p-8 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>

            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="ml-4 text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 text-transparent bg-clip-text">
                  Create a New Agent
                </h2>
              </div>

              <div className="space-y-4">
                <Link href="/create/content-marketing">
                  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <h3 className="ml-3 font-bold text-xl">Content Marketing Agent</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 ml-11">
                      Create an AI agent specialized in content marketing strategies
                    </p>
                  </div>
                </Link>

                <Link href="/create/defi-pro">
                  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                        <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="ml-3 font-bold text-xl">DeFi Pro Agent</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 ml-11">
                      Create an AI agent expert in DeFi protocols and strategies
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
