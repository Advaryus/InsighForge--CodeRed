import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, MessageCircle } from 'lucide-react' // Ensure correct import path
import { useState } from 'react'
import { PopUp } from "./modal"

export function ChatHistory() {
    const [open, setOpen] = useState(false)
  // This is a mock-up. In a real application, you'd fetch the actual chat history.
  const chatHistory = [
    { id: 1, title: "Chat 1" },
    { id: 2, title: "Chat 2" },
    { id: 3, title: "Chat 3" },
  ]
  const handleInput=()=>{
    setOpen(true)
  };
  return (
    <>
    <PopUp open={open} setOpen={setOpen}/>
    <div className="flex flex-col h-full bg-background text-foreground">
      <Button className="mb-4">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Chat
      </Button>
      <ScrollArea className="flex-1">
        {chatHistory.map((chat) => (
          <Button key={chat.id} variant="ghost" className="w-full justify-start mb-1">
            <MessageCircle className="mr-2 h-4 w-4" />
            {chat.title}
          </Button>
        ))}
      </ScrollArea>
      <Button variant="ghost" className="w-full justify-start mb-1" onClick={handleInput}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Upload
      </Button>
      
    </div>
    </>
  )
}

