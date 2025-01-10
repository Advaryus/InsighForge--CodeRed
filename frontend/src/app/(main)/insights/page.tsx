"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIInsightsDisplay } from "@/components/ai-insights-display";

// Simulated API call
const fetchAIInsights = async (url: string[]) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/scrape/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ websites: [url] }),
    });
    console.log(response);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("data", data);
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching insights:", error);
    throw error;
  }
};

export default function AIInsightsPage() {
  const [url, setUrl] = useState("");
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchAIInsights([url]);
      console.log(data);
      setInsights(data);
    } catch (error) {
      console.error("Error fetching insights:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
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
          className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white mt-20"
        >
          AI Insights Generator
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="flex gap-2 mb-8"
        >
          <Input
            type="url"
            placeholder="Enter product URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
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
