"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  BarChartIcon as ChartBar,
  LineChart,
  Radar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BackgroundIllustration } from "@/components/background-illustration";
import { FeedbackForm } from "@/components/feedback-form";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Circular Gradient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-full h-full rounded-full bg-gradient-to-br from-blue-300/20 to-purple-300/20 blur-3xl dark:from-blue-900/30 dark:to-purple-900/30" />
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full rounded-full bg-gradient-to-tl from-green-300/20 to-yellow-300/20 blur-3xl dark:from-green-900/30 dark:to-yellow-900/30" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-32 pb-20 lg:px-8 lg:pt-40 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Introducing InsightForge
              </motion.div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Master the Market with
                <motion.span
                  className="relative whitespace-nowrap"
                  initial={{ backgroundSize: "0 100%" }}
                  animate={{ backgroundSize: "100% 100%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                  style={{
                    backgroundImage: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 418 42"
                    className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70 dark:fill-blue-700/30 z-1"
                    preserveAspectRatio="none"
                  >
                    <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                  </svg>
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 1 }}
                    className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-gray-900 dark:border-white z-10"
                  >
                    {" Precision Insights"}
                  </motion.span>
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300"
              >
                Monitor competitors, analyze trends, and stay ahead in the
                market with AI-driven insights. Transform data into decisive
                action with InsightForge.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="mt-10"
              >
                <Button
                  size="lg"
                  className="get-started-btn h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Background Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex-1 mt-10 lg:mt-0"
            >
              <BackgroundIllustration />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to analyze and win
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Powerful features designed to give you the competitive edge
            </p>
          </motion.div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:max-w-none lg:grid-cols-3">
            {[
              {
                name: "AI-Driven SWOT Analysis",
                description:
                  "Get comprehensive strength, weakness, opportunity, and threat analysis powered by advanced AI.",
                icon: Brain,
              },
              {
                name: "Real-Time Monitoring",
                description:
                  "Track market changes, competitor moves, and customer sentiment as they happen.",
                icon: LineChart,
              },
              {
                name: "Predictive Analytics",
                description:
                  "Forecast market trends and identify opportunities before they become obvious.",
                icon: ChartBar,
              },
              {
                name: "Competitive Intelligence",
                description:
                  "Deep dive into competitor strategies, pricing, and market positioning.",
                icon: Radar,
              },
              {
                name: "Market Sentiment",
                description:
                  "Understand market perception through advanced sentiment analysis.",
                icon: ChartBar,
              },
              {
                name: "Custom Reports",
                description:
                  "Generate detailed reports tailored to your specific business needs.",
                icon: LineChart,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="group relative overflow-hidden border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 transition-all hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-100/20 to-transparent dark:from-blue-900/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative isolate py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-blue-50/50 dark:bg-blue-950/30" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How InsightForge Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Three simple steps to market dominance
            </p>
          </motion.div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {[
              {
                step: "01",
                name: "Data Collection",
                description:
                  "We gather data from websites, social media, and market sources in real-time.",
              },
              {
                step: "02",
                name: "AI Analysis",
                description:
                  "Our advanced AI processes and analyzes the data for actionable insights.",
              },
              {
                step: "03",
                name: "Visualization",
                description:
                  "Access beautiful dashboards and reports with clear, actionable insights.",
              },
            ].map((phase, index) => (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex flex-col items-start">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-400">
                      <span className="text-lg font-semibold text-white dark:text-gray-900">
                        {phase.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                    {phase.name}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {phase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 px-6 py-24 text-center shadow-2xl sm:px-12">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45% 45% at 50% 50%,rgba(59,130,246,0.1),transparent)]" />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
            >
              We Value Your Feedback
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300"
            >
              Help us improve InsightForge by sharing your thoughts and
              experiences.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-10 flex items-center justify-center"
            >
              <div className="w-full max-w-md">
                <FeedbackForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
