"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function BackgroundIllustration() {
  const { theme } = useTheme();

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <motion.div
        animate={{
          x: [0, getRandomInt(-100, 100), 0],
          y: [0, getRandomInt(-100, 100), 0],
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-0 -left-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:bg-purple-600 dark:mix-blend-screen dark:opacity-70"
      />
      <motion.div
        animate={{
          x: [0, getRandomInt(-100, 100), 0],
          y: [0, getRandomInt(-100, 100), 0],
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
          rotate: [0, -15, 15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
        className="absolute top-0 -right-4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:bg-yellow-600 dark:mix-blend-screen dark:opacity-70"
      />
      <motion.div
        animate={{
          x: [0, getRandomInt(-100, 100), 0],
          y: [0, getRandomInt(-100, 100), 0],
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2,
        }}
        className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:bg-pink-600 dark:mix-blend-screen dark:opacity-70"
      />
      <motion.div
        initial={{ x: 1000, rotate: -10, opacity: 0 }}
        animate={{ x: 0, rotate: 360, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        className="relative"
      >
        <img
          src="/card.svg"
          alt="InsightForge Vector Illustration"
          className="relative"
        />
      </motion.div>
    </div>
  );
}
