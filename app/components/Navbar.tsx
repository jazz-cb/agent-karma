'use client'

import { Inbox } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo/Home */}
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="text-2xl font-bold text-white">FAM</a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Inventory Button */}
            <button className="inline-flex items-center px-3 py-2 border border-gray-700 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800">
              <Inbox className="h-5 w-5 mr-2" />
              Inventory
            </button>

            {/* Auth Buttons */}
            <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-md">
              Login
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 