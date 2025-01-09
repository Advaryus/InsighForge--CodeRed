"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Share2,
  Filter,
  Plus,
  ChevronDown,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricCard } from "./metric-card";
import { PlatformCard } from "./platform-card";
// import { RevenueChart } from "./revenue-chart";

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("nov-2023");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Try searching 'insights'"
                  className="pl-9 bg-gray-50 dark:bg-gray-900"
                />
              </div>
              <div className="flex -space-x-2">
                <Avatar className="border-2 border-white dark:border-gray-800">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>AA</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-white dark:border-gray-800">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>EY</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-white dark:border-gray-800">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="outline" className="rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Title and Timeframe */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              New report
            </h1>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nov-2023">Sep 1 - Nov 30, 2023</SelectItem>
                <SelectItem value="oct-2023">Aug 1 - Oct 31, 2023</SelectItem>
                <SelectItem value="sep-2023">Jul 1 - Sep 30, 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Revenue Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  $528,976
                  <span className="text-gray-500 dark:text-gray-400">.82</span>
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">
                    -7.9%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    vs prev. $501,641.73
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="mr-2 h-4 w-4" />
                  Best deal
                </Button>
              </div>
            </div>

            {/* Team Performance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>AA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">$209,633</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    39.63%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">$156,841</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    29.65%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>EY</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">$117,115</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    22.14%
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Revenue by platform
                </h3>
                <div className="space-y-3">
                  <PlatformCard
                    platform="Dribbble"
                    revenue={227459}
                    percentage={43}
                    icon="/placeholder.svg"
                  />
                  <PlatformCard
                    platform="Instagram"
                    revenue={142823}
                    percentage={27}
                    icon="/placeholder.svg"
                  />
                  <PlatformCard
                    platform="Behance"
                    revenue={89935}
                    percentage={11}
                    icon="/placeholder.svg"
                  />
                  <PlatformCard
                    platform="Google"
                    revenue={37028}
                    percentage={7}
                    icon="/placeholder.svg"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Sales dynamic
                </h3>
                {/* <RevenueChart /> */}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
