"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold mb-4">
          Thank you for your feedback!
        </h3>
        <p>We appreciate your input and will use it to improve our services.</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="mb-4">
        <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
          Name
        </label>
        <Input
          type="text"
          placeholder="Your Name"
          required
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
          Email
        </label>
        <Input
          type="email"
          placeholder="Your Email"
          required
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
          Content
        </label>
        <Textarea
          placeholder="Your Feedback"
          required
          className="w-full h-36 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        Submit Feedback
      </Button>
    </motion.form>
  );
}
