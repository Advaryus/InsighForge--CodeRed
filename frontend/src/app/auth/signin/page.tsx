"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OAuthButton } from "@/components/oauth-button";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-8">
        <Link
          href="/"
          className="text-xl font-medium text-gray-900 dark:text-white"
        >
          scale
        </Link>
        <Link
          href="/auth/signup"
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Don't have an account? <span className="font-medium">Sign up →</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
            Log in to your account
          </h1>
        </div>

        <div className="space-y-4">
          <OAuthButton provider="google" onClick={() => {}} variant="signin" />
          <OAuthButton provider="github" onClick={() => {}} variant="signin" />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 dark:text-gray-400 bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                or
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Don't remember your password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Log In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
