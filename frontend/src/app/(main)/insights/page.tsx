"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIInsightsDisplay } from "@/components/ai-insights-display";

interface AIInsightsResponse {
  answer: string;
}

const fetchAIInsights = async (
  competitorURL: string,
  ownerURL: string
): Promise<AIInsightsResponse> => {
  try {
    const response = await fetch("http://127.0.0.1:5000/processcomp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        competitor_website: competitorURL,
        owner_website: ownerURL,
        question: "Why is my product lagging behind my competitor?",
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: AIInsightsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching insights:", error);
    throw error;
  }
};

export default function AIInsightsPage() {
  const [competitorURL, setCompetitorURL] = useState("");
  const [ownerURL, setOwnerURL] = useState("");
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  interface FormEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: AIInsightsResponse = await fetchAIInsights(competitorURL, ownerURL);
      if (data.answer) {
        setInsights(data.answer);
      } else {
        setInsights("No insights generated.");
      }
    } catch (error) {
      setInsights("Error fetching insights. Please try again.");
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

      <div className="relative mx-auto max-w-3xl px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center mb-12 mt-20 text-gray-900 dark:text-white"
        >
          Competitor vs Owner Insights
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 mb-12"
        >
          <Input
            type="url"
            placeholder="Enter Competitor Product URL"
            value={competitorURL}
            onChange={(e) => setCompetitorURL(e.target.value)}
            required
            className="h-12 text-lg"
          />
          <Input
            type="url"
            placeholder="Enter Owner Product URL"
            value={ownerURL}
            onChange={(e) => setOwnerURL(e.target.value)}
            required
            className="h-12 text-lg"
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="h-12 text-lg font-semibold"
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" /> Compare and Generate Insights
              </>
            )}
          </Button>
        </motion.form>

        {insights ? (
          <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <p className="text-gray-900 dark:text-gray-100">{insights}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No insights to display.
          </p>
        )}
      </div>
    </div>
  );
}
