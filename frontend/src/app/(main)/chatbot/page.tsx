"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, LinkIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    Array<{
      id: number;
      text: string;
      isUser: boolean;
      timestamp: string;
      links: string[];
    }>
  >([]);
  const [input, setInput] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAttaching, setIsAttaching] = useState(false);
  const [linkInput, setLinkInput] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendToApi = async (message: string, websites: string[]) => {
    const payload = {
      question: message,
      websites: websites,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/process_and_answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to API");
      }

      const data = await response.json();
      return data.answer; // Return the answer from API
    } catch (error) {
      console.error("Error sending data to API:", error);
      return "Sorry, something went wrong.";
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && links.length === 0) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
      links: [...links],
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLinks([]);

    // Send data to API and get response
    const apiResponse = await sendToApi(newMessage.text, newMessage.links);

    const botResponse = {
      id: Date.now(),
      text: apiResponse,
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
      links: [],
    };
    setMessages((prev) => [...prev, botResponse]);
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    try {
      new URL(linkInput);
      setLinks((prev) => [...prev, linkInput]);
      setLinkInput("");
      setIsAttaching(false);
    } catch {
      alert("Please enter a valid URL");
    }
  };

  const ChatMessage = ({
    message,
    isUser,
    timestamp,
    avatar,
    links,
  }: {
    message: string;
    isUser: boolean;
    timestamp: string;
    avatar?: string;
    links: string[];
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 w-full max-w-4xl",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={avatar} />
        <AvatarFallback>{isUser ? "U" : "B"}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex flex-col gap-1 min-w-0",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2 max-w-[85%] break-words",
            isUser ? "bg-purple-500 text-white" : "bg-gray-100 dark:bg-gray-800"
          )}
        >
          {message}
          {links.length > 0 && (
            <div className="mt-2">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline"
                >
                  {link}
                </a>
              ))}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 px-2">
          {timestamp}
        </span>
      </div>
    </motion.div>
  );

  const LinkAttachment = ({
    url,
    onRemove,
  }: {
    url: string;
    onRemove: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 pr-3"
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
      <span className="text-sm truncate max-w-[200px]">{url}</span>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Circular Gradient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-full h-full rounded-full bg-gradient-to-br from-blue-300/20 to-purple-300/20 blur-3xl dark:from-blue-900/30 dark:to-purple-900/30" />
        <div className="relative -bottom-1/2 -right-1/4 w-full h-full rounded-full bg-gradient-to-tl from-green-300/20 to-yellow-300/20 blur-3xl dark:from-green-900/30 dark:to-yellow-900/30" />
      </div>

      {/* Chat Container */}
      <div className="relative mx-auto max-w-4xl px-4 py-8 min-h-screen flex flex-col">
        {/* Messages */}
        <div className="mt-20 flex-1 overflow-y-auto space-y-6 pb-24">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
                avatar={
                  message.isUser ? "/placeholder.svg" : "/placeholder.svg"
                }
                links={message.links}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-white/80 dark:from-gray-950 dark:to-gray-950/80 p-4">
          <div className="mx-auto max-w-4xl">
            {/* Link Attachment Area */}
            {isAttaching && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 flex items-center gap-2"
              >
                <Input
                  type="url"
                  placeholder="Paste your link here..."
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddLink}>Add</Button>
              </motion.div>
            )}

            {/* Links Display */}
            {links.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap gap-2 mb-4"
              >
                {links.map((link, index) => (
                  <LinkAttachment
                    key={index}
                    url={link}
                    onRemove={() =>
                      setLinks(links.filter((_, i) => i !== index))
                    }
                  />
                ))}
              </motion.div>
            )}

            {/* Message Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setIsAttaching(!isAttaching)}
              >
                <LinkIcon className="h-5 w-5" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!input.trim() && links.length === 0}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
