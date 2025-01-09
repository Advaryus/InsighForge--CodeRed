import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string | number;
  trend?: "up" | "down";
  className?: string;
}

export function MetricCard({
  label,
  value,
  change,
  trend,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-2xl font-semibold">{value}</p>
        {change && (
          <span
            className={cn(
              "text-sm px-2 py-0.5 rounded-full",
              trend === "up"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {trend === "up" ? "+" : "-"}
            {change}
          </span>
        )}
      </div>
    </Card>
  );
}
