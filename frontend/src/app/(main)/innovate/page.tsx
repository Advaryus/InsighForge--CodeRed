"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Book, Star, Tag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AVAILABLE_PRODUCTS = [
  "Bevzilla 75 Grams X 4 Flavoured Instant Coffee Powder |Strong Coffee Instant Coffee",
  "N/A",
  "MSI Sword 16 HX Intel Core i7 14th Gen 14700HX",
  "MSI Sword 16 HX Intel Core i7 14th Gen 14700HX",
  "FAR CRY",
  "GRAN TURISMO 6",
  "HITMAN 2 SILENT ASSASSIN",
  "IGI 2 COVERT STRIKE",
  "MSI LAPTOPS",
  "SLIM LAPTOPS",
  "LENOVO Z50-70 NOTEBOOK",
  "XBOX ONE INDIA",
  "MIDTOWN MADNESS",
  "NARUTO SHIPPUDEN ULTIMATE NINJA STORM 4",
  "RESIDENT EVIL 7",
  "SONY PLAYSTATION 2",
  "PLAYSTATION 2 PRICE",
  "PLAYSTATION PRICE",
  "PLAYSTATION TV",
  "SONY PSP PRICE",
  "WITCHER 2",
  "CRICKETGAME",
];

const fetchAnalysis = async (choice: number) => {
  const response = await fetch("http://127.0.0.1:5000/api/innovate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ choice }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analysis");
  }

  return response.json();
};

export default function InnovatePage() {
  const [choice, setChoice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!choice) return;
    setLoading(true);
    try {
      const result = await fetchAnalysis(parseInt(choice));
      setData(result);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-full h-full rounded-full bg-gradient-to-br from-blue-300/20 to-purple-300/20 blur-3xl dark:from-blue-900/30 dark:to-purple-900/30" />
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full rounded-full bg-gradient-to-tl from-green-300/20 to-yellow-300/20 blur-3xl dark:from-green-900/30 dark:to-yellow-900/30" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mt-8">
            Product Analysis
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Select a product to analyze research papers and get insights
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <Card className="p-6 shadow-md">
            <CardContent className="space-y-4">
              <Select value={choice} onValueChange={setChoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_PRODUCTS.map((product, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {index + 1}. {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleAnalyze}
                className="w-full"
                disabled={!choice || loading}
              >
                {loading ? (
                  "Analyzing..."
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" /> Analyze Product
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-12 space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Tag className="mr-2 h-5 w-5" />
                      Product Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">
                        {data.product_data.product_name}
                      </h3>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400" />
                          <span className="ml-1">
                            {data.product_data.rating}
                          </span>
                          <span className="text-gray-500 ml-1">
                            ({data.product_data.review_count} reviews)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">
                            {data.product_data.current_price}
                          </span>
                          <span className="text-gray-500 line-through">
                            {data.product_data.original_price}
                          </span>
                          <span className="text-green-600">
                            {data.product_data.discount_percentage}
                          </span>
                        </div>
                      </div>

                      <Accordion type="single" collapsible>
                        <AccordionItem value="highlights">
                          <AccordionTrigger>
                            Product Highlights
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc pl-5 space-y-2">
                              {data?.product_data?.product_highlights?.map(
                                (highlight: string, index: number) => (
                                  <li key={index}>{highlight}</li>
                                )
                              )}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="offers">
                          <AccordionTrigger>Available Offers</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc pl-5 space-y-2">
                              {data?.product_data?.available_offers?.map(
                                (offer: string, index: number) => (
                                  <li key={index}>{offer}</li>
                                )
                              )}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </CardContent>
                </Card>

                {/* Research Papers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Book className="mr-2 h-5 w-5" />
                      Research Papers
                    </CardTitle>
                    <CardDescription>
                      Relevant academic research for product innovation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {data?.papers?.map((paper: any, index: number) => (
                        <AccordionItem key={index} value={`paper-${index}`}>
                          <AccordionTrigger>{paper.title}</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Authors: {paper.authors.join(", ")}
                              </p>
                              <p>{paper.summary}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>

              {/* Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Innovation Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    {data.analysis
                      .split("\n\n")
                      .map((paragraph: string, index: number) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
