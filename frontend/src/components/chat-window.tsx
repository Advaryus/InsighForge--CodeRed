'use client'

import * as React from 'react'
import { Send, Plus, X, Pencil, Check, History, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  links?: string[]
}

interface Chat {
  id: string
  name: string
  messages: Message[]
}

export default function ChatWindow() {
  const [chats, setChats] = React.useState<Chat[]>([])
  const [historicalChats, setHistoricalChats] = React.useState<Chat[]>([])
  const [currentChat, setCurrentChat] = React.useState<Chat | null>(null)
  const [input, setInput] = React.useState('')
  const [links, setLinks] = React.useState<string[]>([''])
  const [editingChatId, setEditingChatId] = React.useState<string | null>(null)
  const [editingName, setEditingName] = React.useState('')
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  const startNewChat = () => {
    if (currentChat) {
      setHistoricalChats(prev => [currentChat, ...prev])
      setChats(prev => prev.filter(chat => chat.id !== currentChat.id))
    }
    
    const newChat: Chat = {
      id: Date.now().toString(),
      name: `Chat ${chats.length + historicalChats.length + 1}`,
      messages: []
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChat(newChat)
    setInput('')
    setLinks([''])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentChat || !input.trim()) return
    
    const validLinks = links.filter(link => link.trim() !== '')
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
      links: validLinks.length > 0 ? validLinks : undefined
    }
    
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage]
    }
    
    setCurrentChat(updatedChat)
    setChats(prev => prev.map(chat => 
      chat.id === currentChat.id ? updatedChat : chat
    ))
    setInput('')
    setLinks([''])
    
    // Simulate AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: `Received your message: "${input.trim()}"${validLinks.length ? ` and ${validLinks.length} link(s)` : ''}`,
      role: 'assistant',
      timestamp: new Date()
    }
    setTimeout(() => {
      const chatWithAiResponse = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiResponse]
      }
      setCurrentChat(chatWithAiResponse)
      setChats(prev => prev.map(chat => 
        chat.id === currentChat.id ? chatWithAiResponse : chat
      ))
    }, 1000)
  }

  const handleAddLink = () => {
    setLinks(prev => [...prev, ''])
  }

  const handleLinkChange = (index: number, value: string) => {
    setLinks(prev => prev.map((link, i) => i === index ? value : link))
  }

  const handleRemoveLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index))
  }

  const startEditingChat = (chat: Chat) => {
    setEditingChatId(chat.id)
    setEditingName(chat.name)
  }

  const saveEditingChat = () => {
    if (!editingChatId || !editingName.trim()) return
    
    setChats(prev => prev.map(chat => 
      chat.id === editingChatId ? { ...chat, name: editingName } : chat
    ))
    setEditingChatId(null)
    setEditingName('')
  }

  const restoreChat = (chatToRestore: Chat) => {
    setChats(prev => [chatToRestore, ...prev])
    setHistoricalChats(prev => prev.filter(chat => chat.id !== chatToRestore.id))
    setCurrentChat(chatToRestore)
  }

  return (
    <div className="flex flex-col h-screen w-full pt-5 bg-background">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden border-r flex flex-col bg-background mt-14`}>
          <Tabs defaultValue="current" className="flex-1">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {chats.map((chat) => (
                    <div key={chat.id} className="flex items-center gap-2">
                      {editingChatId === chat.id ? (
                        <>
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-8 flex-1"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={saveEditingChat}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant={currentChat?.id === chat.id ? "secondary" : "ghost"}
                            className="flex-1 justify-start"
                            onClick={() => setCurrentChat(chat)}
                          >
                            <span className="truncate">{chat.name}</span>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEditingChat(chat)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="history" className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {historicalChats.map((chat) => (
                    <div key={chat.id} className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="flex-1 justify-start"
                      >
                        <span className="truncate">{chat.name}</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => restoreChat(chat)}
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center mt-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h2 className="font-semibold flex-1">
              {currentChat ? currentChat.name : 'Select or start a new chat'}
            </h2>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {currentChat?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === 'assistant' ? '' : 'flex-row-reverse'
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === 'assistant'
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.links && message.links.length > 0 && (
                      <div className="mt-2 text-sm">
                        <p className="font-semibold">Links:</p>
                        <ul className="list-disc list-inside">
                          {message.links.map((link, index) => (
                            <li key={index}>{link}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Input Area */}
          <div className="p-4 border-t space-y-2">
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={startNewChat}
                title="Start a new chat"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your query (required)..."
                className="flex-1"
                required
              />
              <Button type="submit" size="icon" disabled={!currentChat || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="space-y-2 max-w-4xl mx-auto">
              {links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    placeholder={index === 0 ? "Enter link (optional)..." : "Enter additional link..."}
                    className="flex-1"
                  />
                  {index === links.length - 1 ? (
                    <Button type="button" onClick={handleAddLink} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="button" onClick={() => handleRemoveLink(index)} size="icon" variant="outline">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

