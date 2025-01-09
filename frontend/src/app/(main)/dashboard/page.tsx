"use client"

import { Card } from "@/components/ui/card"
import { AreaChart, BarChart } from "@/components/charts"
import { StatsCard } from "@/components/stats-card"
import { MetricCard } from "@/components/metric-card"
import { WelcomeCard } from "@/components/welcome-card"
import { CircularProgress } from "@/components/circular-progress"
import { ThemeSwitch } from "@/components/theme-switch"
import { ThemeProvider } from "@/components/theme-provider"

export default function Dashboard() {
  return (
    <ThemeProvider>
      <div className="mt-20 p-6 space-y-6">
        <div className="flex justify-end">
        </div>
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Today's Money"
            value="$53,000"
            change="+55%"
            icon="dollar"
          />
          <StatsCard
            title="Today's Users"
            value="2,300"
            change="+5%"
            icon="users"
          />
          <StatsCard
            title="New Clients"
            value="+3,462"
            change="-2%"
            icon="globe"
          />
          <StatsCard
            title="Total Sales"
            value="$103,430"
            change="+5%"
            icon="cart"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Welcome Card */}
          <Card className="lg:col-span-6 bg-[#0F1629] border-[#1C2137]">
            <WelcomeCard
              name="Mark Johnson"
              message="Glad to see you again!"
              submessage="Ask me anything."
            />
          </Card>

          {/* Satisfaction Rate Card */}
          <Card className="lg:col-span-3 bg-[#0F1629] border-[#1C2137] p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Satisfaction Rate</h3>
              <p className="text-sm text-gray-400">From all projects</p>
              <div className="flex justify-center py-6">
                <CircularProgress value={95} size={200} />
              </div>
            </div>
          </Card>

          {/* Referral Tracking Card */}
          <Card className="lg:col-span-3 bg-[#0F1629] border-[#1C2137] p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Referral Tracking</h3>
              <div className="space-y-4">
                <MetricCard label="Invited" value="145 people" />
                <MetricCard label="Bonus" value="1,465" />
                <div className="flex justify-center py-4">
                  <CircularProgress 
                    value={93} 
                    size={120} 
                    label="Safety Score" 
                    labelValue="9.3"
                    color="#10B981" 
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sales Overview Chart */}
          <Card className="lg:col-span-8 bg-[#0F1629] border-[#1C2137] p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">Sales Overview</h3>
                  <p className="text-sm text-emerald-400">+5% more in 2021</p>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <AreaChart />
              </div>
            </div>
          </Card>

          {/* Active Users Chart */}
          <Card className="lg:col-span-4 bg-[#0F1629] border-[#1C2137] p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Active Users</h3>
              <p className="text-sm text-emerald-400">(+23) than last week</p>
              <div className="h-[300px] w-full">
                <BarChart />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <MetricCard
                  label="Users"
                  value="32,984"
                  icon="users"
                  className="bg-[#1C2137]"
                />
                <MetricCard
                  label="Clicks"
                  value="2.42M"
                  icon="mouse"
                  className="bg-[#1C2137]"
                />
                <MetricCard
                  label="Sales"
                  value="2,400$"
                  icon="dollar"
                  className="bg-[#1C2137]"
                />
                <MetricCard
                  label="Items"
                  value="320"
                  icon="box"
                  className="bg-[#1C2137]"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  )
}

