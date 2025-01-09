"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OAuthButton } from "@/components/oauth-button";
import { FeatureList } from "@/components/feature-list";
import { CompanyLogos } from "@/components/company-logos";

export default function SignUpPage() {
  const [email, setEmail] = useState("");

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
          href="/auth/signin"
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Have an account? <span className="font-medium">Log in →</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Features */}
          <div className="hidden lg:block">
            <div className="mb-8">
              <h1 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Create a Scale account to get started with our platform!
              </h1>
            </div>
            <FeatureList />
          </div>

          {/* Right Column - Sign Up Form */}
          <div>
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-8">
                Create your account
              </h2>

              <div className="space-y-4">
                <OAuthButton
                  provider="google"
                  onClick={() => {}}
                  variant="signup"
                />
                <OAuthButton
                  provider="github"
                  onClick={() => {}}
                  variant="signup"
                />

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
                  <Button
                    type="submit"
                    className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                  >
                    Get Registration Link
                  </Button>
                </form>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  I agree to Scale's{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Main Services Agreement
                  </Link>{" "}
                  and acknowledge Scale's{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Logos */}
        <div className="mt-24">
          <CompanyLogos />
        </div>
      </div>
    </div>
  );
}
