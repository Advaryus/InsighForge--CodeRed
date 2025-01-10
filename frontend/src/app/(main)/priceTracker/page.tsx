"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  Package,
  IndianRupee,
  Plus,
  X,
  LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fetchPriceHistory = async (urls: string[]) => {
  try {
    const res = await fetch("http://127.0.0.1:5000/fetch-product-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls }),
    });
    if (!res.ok) throw new Error("Request failed");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch price history");
  }
};

const priceData = [
  { name: "Jan", price: 12990 },
  { name: "Feb", price: 12489 },
  { name: "Mar", price: 11990 },
  { name: "Apr", price: 12489 },
  { name: "May", price: 12990 },
];

export default function PriceHistoryPage() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddUrl = () => {
    if (!currentUrl) return;
    try {
      new URL(currentUrl);
      if (!urls.includes(currentUrl)) {
        setUrls([...urls, currentUrl]);
        setCurrentUrl("");
        setError(null);
      } else {
        setError("URL already added");
      }
    } catch {
      setError("Please enter a valid URL");
    }
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    setUrls(urls.filter((url) => url !== urlToRemove));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (urls.length === 0) {
      setError("Please add at least one URL");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPriceHistory(urls);
      setData(result[0]);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch price history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-full h-full rounded-full bg-gradient-to-br from-blue-300/20 to-purple-300/20 blur-3xl dark:from-blue-900/30 dark:to-purple-900/30" />
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full rounded-full bg-gradient-to-tl from-green-300/20 to-yellow-300/20 blur-3xl dark:from-green-900/30 dark:to-yellow-900/30" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mt-20">
            Price History
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Track and analyze product prices
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleAnalyze}
          className="max-w-xl mx-auto space-y-4"
        >
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter product URL"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddUrl} variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          )}

          <AnimatePresence>
            {urls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2"
              >
                {urls.map((url) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-md p-2 group"
                  >
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm truncate flex-1">{url}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveUrl(url)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || urls.length === 0}
          >
            {loading ? (
              "Analyzing..."
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze{" "}
                {urls.length > 0
                  ? `${urls.length} URL${urls.length > 1 ? "s" : ""}`
                  : "Products"}
              </>
            )}
          </Button>
        </motion.form>

        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-10 space-y-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Product Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-4">
                    {data["Product Name"]}
                  </h3>
                  <div className="prose dark:prose-invert max-w-none">
                    {data["Product Details"]
                      .split("|")
                      .map((detail: string, index: number) => (
                        <p
                          key={index}
                          className="text-gray-600 dark:text-gray-300"
                        >
                          {detail.trim()}
                        </p>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Price Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#3b82f6"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <IndianRupee className="mr-2 h-5 w-5" />
                      Price Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Average Price
                        </p>
                        <p className="text-2xl font-bold">
                          ₹{data["Average Price"].toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Highest Price
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                          ₹{data["Highest Price"].toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Lowest Price
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{data["Lowest Price"].toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
