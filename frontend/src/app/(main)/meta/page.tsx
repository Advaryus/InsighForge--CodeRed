"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Simulated API call
const fetchKeywords = async (websites: string[], question: string): Promise<string> => {
  const response = await fetch('http://127.0.0.1:5000/processmeta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ websites, question })
  })

  if (!response.ok) {
    throw new Error('Failed to fetch keywords')
  }

  const data = await response.json()
  return data.answer
}

export default function ProductAnalyzerPage() {
  const [urls, setUrls] = useState<string[]>([])
  const [currentUrl, setCurrentUrl] = useState("")
  const [keywords, setKeywords] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAddUrl = () => {
    if (currentUrl && !urls.includes(currentUrl)) {
      setUrls([...urls, currentUrl])
      setCurrentUrl("")
    }
  }

  const handleRemoveUrl = (urlToRemove: string) => {
    setUrls(urls.filter(url => url !== urlToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (urls.length === 0) return

    setLoading(true)
    try {
      const result = await fetchKeywords(urls, "What are the best keywords for my product?")
      setKeywords(result)
    } catch (error) {
      console.error("Error fetching keywords:", error)
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Circular Gradient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-full h-full rounded-full bg-gradient-to-br from-blue-300/20 to-purple-300/20 blur-3xl dark:from-blue-900/30 dark:to-purple-900/30" />
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full rounded-full bg-gradient-to-tl from-green-300/20 to-yellow-300/20 blur-3xl dark:from-green-900/30 dark:to-yellow-900/30" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-8 mt-20 text-gray-900 dark:text-white"
        >
          Product Keyword Analyzer
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter product URL"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddUrl}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {urls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Added URLs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {urls.map((url, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-md"
                    >
                      <span className="truncate flex-1 mr-2">{url}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveUrl(url)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || urls.length === 0}
          >
            {loading ? (
              "Analyzing..."
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Analyze Products
              </>
            )}
          </Button>
        </motion.form>

        {keywords && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Recommended Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{keywords}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}