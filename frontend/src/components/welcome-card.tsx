import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Mic } from 'lucide-react'

interface WelcomeCardProps {
  name: string
  message: string
  submessage: string
}

export function WelcomeCard({ name, message, submessage }: WelcomeCardProps) {
  return (
    <div className="relative h-[300px] overflow-hidden rounded-lg">
      <Image
        src="/user.jpg"
        alt="Welcome"
        width={600}
        height={300}
        className="absolute inset-0 object-cover w-full h-full opacity-50"
      />
      <div className="relative p-6 flex flex-col h-full justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Welcome back,</p>
          <h2 className="text-2xl font-bold text-white">{name}</h2>
          <p className="text-gray-400">{message}</p>
          <p className="text-sm text-gray-500">{submessage}</p>
        </div>
        <Button variant="ghost" className="w-fit" size="sm">
          <Mic className="w-4 h-4 mr-2" />
          Tap to record
        </Button>
      </div>
    </div>
  )
}

