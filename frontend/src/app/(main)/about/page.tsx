"use client"
import { motion } from "framer-motion";
import { Activity, BarChart2, Database, LineChart, MessageSquare, TrendingUp } from 'lucide-react';
import { FeatureCard } from "@/components/feature-card"; // Corrected import path
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const popupAnimation = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

export default function AboutUs() {
  const features = [
    {
      title: "Real-Time SWOT Analysis",
      description: "Instantly assess your strengths, weaknesses, opportunities, and threats with our dynamic SWOT analysis tool.",
      icon: <Activity className="h-6 w-6" />,
    },
    {
      title: "Sentiment Heatmaps",
      description: "Visualize market sentiment and understand public perception with our intuitive sentiment heatmaps.",
      icon: <MessageSquare className="h-6 w-6" />,
    },
    {
      title: "Trend Prediction",
      description: "Stay ahead of the curve with our advanced trend prediction algorithms that forecast market movements and emerging trends.",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: "AI Integration",
      description: "Leverage state-of-the-art artificial intelligence solutions to analyze complex statistical data and extract meaningful insights.",
      icon: <BarChart2 className="h-6 w-6" />,
    },
    {
      title: "Extensive Data Repository",
      description: "Access a wealth of structured and meticulously curated data to ensure accuracy and relevance.",
      icon: <Database className="h-6 w-6" />,
    },
    {
      title: "Customizable Dashboards",
      description: "Create and customize your own dashboards to visualize the data that matters most to you.",
      icon: <LineChart className="h-6 w-6" />,
    },
  ]

  const benefits = [
    "Informed Decision-Making",
    "Enhanced Research",
    "Actionable Insights",
    "Improved Collaboration",
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <main className="container mx-auto px-4 py-16">
        <section id="features" className="mb-16">
          <motion.h2 
            className="mb-8 text-center text-3xl font-bold text-[rgb(117,103,246)]"
            initial="hidden"
            animate="visible"
            variants={popupAnimation}
          >
            Our Features
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <Card className="border-2 border-[rgba(117,103,246,0.2)]">
            <CardHeader>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={popupAnimation}
              >
                <CardTitle className="text-2xl text-[rgb(117,103,246)]">Why Choose InsightForge?</CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our mission is to deliver high-quality research and insights faster and more efficiently. Here are the expected results of using InsightForge:
              </p>
              <ul className="grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className="flex items-center justify-center h-6 w-6 rounded-full bg-[rgba(117,103,246,0.1)] text-[rgb(117,103,246)]"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <Badge variant="secondary" className="h-4 w-4 p-0">
                        ✓
                      </Badge>
                    </motion.div>
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="text-center mb-16">
          <motion.h2 
            className="mb-4 text-3xl font-bold text-[rgb(117,103,246)]"
            initial="hidden"
            animate="visible"
            variants={popupAnimation}
          >
            Our Motto
          </motion.h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Badge variant="secondary" className="mb-4 text-lg p-2 border-2 border-[rgb(117,103,246)] bg-[rgba(117,103,246,0.1)] text-[rgb(117,103,246)]">
                "Bringing Meaning to Statistics"
              </Badge>
            </motion.div>
          </motion.div>
          <p className="mx-auto max-w-2xl">
            At InsightForge, our motto reflects our commitment to transforming raw data into meaningful insights that drive innovation and growth. We strive to provide the tools and resources needed to navigate the complexities of the data landscape with confidence and clarity.
          </p>
        </section>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2 
            className="mb-4 text-3xl font-bold text-[rgb(117,103,246)]"
            initial="hidden"
            animate="visible"
            variants={popupAnimation}
          >
            Join Us Today
          </motion.h2>
          <p className="mb-8 text-xl">
            Transform the way you approach competitor intelligence. Empower your business with the intelligence to succeed.
          </p>
          <motion.a
            href="#contact"
            className="inline-block rounded-full bg-[rgb(117,103,246)] px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-[rgb(97,83,226)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>
        </motion.div>
      </main>
    </div>
  )
}

