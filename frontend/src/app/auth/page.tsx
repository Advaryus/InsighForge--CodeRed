"use client";

import AuthForm from "@/components/auth-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LucideLoader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TypewriterText = () => {
  const line1 = "Welcome to SamagraCampUS";
  const typingSpeed = 100;
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const typeText = (index: number) => {
      if (index <= line1.length) {
        setDisplayedText(line1.slice(0, index));
        timeoutId = setTimeout(() => typeText(index + 1), typingSpeed);
      }
    };

    typeText(0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="text-3xl lg:text-4xl font-medium text-gray-900 dark:text-white text-center leading-relaxed">
      {displayedText}
    </div>
  );
};

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      const checkUserInfo = async () => {
        try {
          const res = await fetch("/api/users/check");
          const data = await res.json();
          console.log("Check user info response:", data);

          if (!data.hasUSN || !data.hasDOB) {
            setShowModal(true);
          } else {
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error checking user info:", error);
        } finally {
          setLoadingCheck(false);
        }
      };

      checkUserInfo();
    } else {
      setLoadingCheck(false);
    }
  }, [session, status, router]);

  const handleModalSubmit = async (usn: string, dob: string) => {
    try {
      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usn, dob }),
      });

      const data = await res.json();
      console.log("Update user info response:", data);

      if (res.ok) {
        setShowModal(false);
        router.push("/dashboard");
      } else {
        setShowModal(false);
        alert(`Failed to update information: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("An unexpected error occurred while updating your information.");
    }
  };

  if (status === "loading" || loadingCheck) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <LucideLoader2 className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Top Navigation */}
      <nav className="absolute top-0 right-0 p-6">
        <Link
          href="/auth/signup"
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Don't have an account? <span className="font-medium">Sign up →</span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Logo */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-2xl font-medium text-gray-900 dark:text-white"
          >
            SamagraCampUS
          </Link>
        </div>

        {/* Auth Container */}
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
              Log in to your account
            </h2>
          </div>

          <div className="mt-10">
            <AuthForm />
          </div>

          {/* Partner Logos - Optional */}
          <div className="mt-16">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              Trusted by leading institutions
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-75 grayscale">
              <img
                src="/placeholder.svg?height=30&width=100"
                alt="Partner Logo"
                className="h-8 object-contain"
              />
              <img
                src="/placeholder.svg?height=30&width=100"
                alt="Partner Logo"
                className="h-8 object-contain"
              />
              <img
                src="/placeholder.svg?height=30&width=100"
                alt="Partner Logo"
                className="h-8 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
