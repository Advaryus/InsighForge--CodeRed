import { cn } from "@/lib/utils"
import { Users, MousePointer, DollarSign, Box, type LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  icon?: "users" | "mouse" | "dollar" | "box"
  className?: string
}

const icons: Record<NonNullable<MetricCardProps["icon"]>, LucideIcon> = {
  users: Users,
  mouse: MousePointer,
  dollar: DollarSign,
  box: Box,
}

export function MetricCard({ label, value, icon, className }: MetricCardProps) {
  const Icon = icon ? icons[icon] : null

  return (
    <div className={cn(
      "p-4 rounded-lg space-y-2",
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-blue-500" />}
      </div>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

