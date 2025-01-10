import { DollarSign, Users, Globe, ShoppingCart, type LucideIcon } from 'lucide-react'
import { Card } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string
  change: string
  icon: "dollar" | "users" | "globe" | "cart"
}

const icons: Record<StatsCardProps["icon"], LucideIcon> = {
  dollar: DollarSign,
  users: Users,
  globe: Globe,
  cart: ShoppingCart,
}

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  const Icon = icons[icon]
  const isPositive = change.startsWith("+")

  return (
    <Card className="bg-[#0F1629] border-[#1C2137]">
      <div className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-400">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold text-white">{value}</h3>
            <span className={isPositive ? "text-emerald-400" : "text-red-400"}>
              {change}
            </span>
          </div>
        </div>
        <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
      </div>
    </Card>
  )
}

