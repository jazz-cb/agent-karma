import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import ScrollReset from './components/ScrollReset'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FAM - Financial Agent Management',
  description: 'Transform your financial strategies with AI-powered agents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ScrollReset />
        <Navbar />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  )
}
