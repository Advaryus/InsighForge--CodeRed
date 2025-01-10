"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIInsightsDisplay } from "@/components/ai-insights-display";

// Simulated API call
const fetchAIInsights = async (data: {
  websites: string[];
  question: string;
}) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/processmeta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching insights:", error);
    throw error;
  }
};

export default function AIInsightsPage() {
  const [urls, setUrls] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUrls([""]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchAIInsights({ websites: urls, question });
      setInsights(data);
    } catch (error) {
      console.error("Error fetching insights:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, ""]);
  };

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
          className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white"
        >
          AI Insights Generator
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mb-8"
        >
          {urls.map((url, index) => (
            <Input
              key={index}
              type="url"
              placeholder="Enter product URL"
              value={url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              className="flex-1"
              required
            />
          ))}
          <Button type="button" onClick={addUrlField}>
            Add another URL
          </Button>
          <Input
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              "Loading..."
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Generate Insights
              </>
            )}
          </Button>
        </motion.form>

        {insights && <AIInsightsDisplay data={insights} />}
      </div>
    </div>
  );
}
