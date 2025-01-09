'use client'

import { useState } from 'react'
// import { useChat } from 'ai/react'
import { ChatHistory } from '@/components/chat-history'
import { ChatInterface } from '@/components/chat-interface'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
// import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
// const { messages, input, handleInputChange, handleSubmit } = useChat()
// const messages = []
const input = ''
const handleInputChange = () => {}
const handleSubmit = () => {}
  return (
    <div className="mt-20 flex h-full">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-gray-100 p-4 overflow-y-auto`}>
        <ChatHistory />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <h1 className="text-xl font-bold">ChatGPT-like Interface</h1>
          </div>
        </header>

        {/* Chat interface */}
        <ChatInterface 
          messages={["Hello", "Hi", "How are you?"]}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

