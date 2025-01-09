import { FormEvent } from 'react'
import { Message } from 'ai'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

interface ChatInterfaceProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export function ChatInterface({ messages, input, handleInputChange, handleSubmit }: ChatInterfaceProps) {
  return (
    <div className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <Card key={message.id} className="mb-4 p-4 bg-background border border-border">
            <div className="flex items-start">
              <Avatar className="mr-4">
                <AvatarImage src={message.role === 'user' ? '/user-avatar.png' : '/ai-avatar.png'} />
                <AvatarFallback>{message.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold mb-1">{message.role === 'user' ? 'You' : 'AI'}</p>
                <p>{message.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="flex-1 mr-2"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  )
}

