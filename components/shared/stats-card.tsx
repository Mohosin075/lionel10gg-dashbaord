"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type StatItem = {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  trend?: string | null;
  isPositive?: boolean | null;
};

const gridColsClass: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export function StatsCard({ data }: { data: StatItem[] }) {
  const cols = Math.min(Math.max(data.length, 1), 4);

  return (
    <div className={cn("grid gap-4", gridColsClass[cols])}>
      {data.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm"
          >
            {Icon && (
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  item.iconBg ?? "bg-slate-50",
                  item.iconColor ?? "text-slate-400",
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-slate-500">{item.title}</p>
              <p className="text-2xl font-semibold text-slate-900">
                {item.value}
              </p>
              {item.trend ? (
                <p
                  className={cn(
                    "mt-1 text-xs",
                    item.isPositive === false
                      ? "text-red-500"
                      : "text-emerald-500",
                  )}
                >
                  {item.trend}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
