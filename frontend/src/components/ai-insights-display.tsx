"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIResponse {
  main_insights: string[];
  market_opportunity: string[];
  risks: string[];
}

interface AIInsightsDisplayProps {
  data: AIResponse;
}

export function AIInsightsDisplay({ data }: AIInsightsDisplayProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Main Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.ul className="list-disc pl-5 space-y-2">
            {data.main_insights.map((insight, index) => (
              <motion.li key={index} variants={itemVariants}>
                {insight}
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.ul className="list-disc pl-5 space-y-2">
            {data.market_opportunity.map((opportunity, index) => (
              <motion.li key={index} variants={itemVariants}>
                {opportunity}
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.ul className="list-disc pl-5 space-y-2">
            {data.risks.map((risk, index) => (
              <motion.li key={index} variants={itemVariants}>
                {risk}
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
