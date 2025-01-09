import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function Hero() {
  const [text, setText] = useState("")
  const fullText = "Welcome to InsightForge"

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText((prev) => prev + fullText.charAt(i))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <div className="relative h-[50vh] overflow-hidden bg-gradient-to-r from-[rgb(117,103,246)] to-[rgb(147,133,276)] text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto flex h-full flex-col items-center justify-center text-center"
      >
        <h1 className="mb-4 text-5xl font-bold">
          {text}
          <span className="animate-blink">|</span>
        </h1>
        <p className="mb-8 text-xl">
          Your premier AI-driven competitor intelligence platform
        </p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
        >
          <a
            href="#features"
            className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-[rgb(117,103,246)] transition-colors hover:bg-[rgba(117,103,246,0.1)]"
          >
            Explore Our Features
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}

