import Image from "next/image";
import { Card } from "@/components/ui/card";

interface PlatformCardProps {
  platform: string;
  revenue: number;
  percentage: number;
  icon: string;
}

export function PlatformCard({
  platform,
  revenue,
  percentage,
  icon,
}: PlatformCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <img src={icon} alt={platform} className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {platform}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ${revenue.toLocaleString()}
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}
