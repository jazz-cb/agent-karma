'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, X } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
  strategy?: 'bearish' | 'buffet' | 'bullish' | 'moon'
}

const strategyEmojis = {
  bearish: '🐻',
  buffet: '💎',
  bullish: '🐂',
  moon: '🚀'
}

const strategyTitles = {
  bearish: 'Chat with Bearish Agent',
  buffet: 'Chat with Buffet Agent',
  bullish: 'Chat with Bullish Agent',
  moon: 'Chat with Moon Agent'
}

export default function ChatWindow({ isOpen, onClose, strategy }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !socket) {
      const ws = new WebSocket('ws://localhost:5328/ws/chat')
      
      ws.onopen = () => {
        console.log('WebSocket Connected')
      }

      ws.onmessage = (event) => {
        console.log('Received message:', event.data)
        const data = JSON.parse(event.data)
        
        if (data.type === 'content') {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.data
          }])
        }
        if (data.type === 'tool_call') {
          console.log('Tool call received:', data.data)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setSocket(null)
      }

      setSocket(ws)
    }

    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending || !socket) return

    setIsSending(true)
    const userMessage: Message = { role: 'user', content: newMessage }
    setMessages(prev => [...prev, userMessage])
    setNewMessage('')

    try {
      socket.send(JSON.stringify({
        role: 'user',
        content: newMessage
      }))
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error. Please try again." 
      }])
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-24 right-8 w-96 h-[500px] bg-gray-800 rounded-lg shadow-xl border border-gray-700 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="font-semibold text-white">
          {strategy ? strategyTitles[strategy] : 'Chat with AI Agent'} {strategy && strategyEmojis[strategy]}
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.role === 'user' 
                ? 'ml-auto bg-red-600' 
                : 'mr-auto bg-gray-700'
            } rounded-lg p-3 max-w-[80%]`}
          >
            <p className="text-white">{message.content}</p>
          </div>
        ))}
        {isSending && (
          <div className="mr-auto bg-gray-700 rounded-lg p-3">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button 
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-white transition-colors"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>
    </div>
  )
} 