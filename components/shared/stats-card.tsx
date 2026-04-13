


"use client";

import { LucideIcon } from "lucide-react";

type StatItem = {
    title: string;
    value: number | string;
    icon?: LucideIcon;
    iconBg?: string;
    iconColor?: string;
    trend?: string;
};

export const StatsCard = ({ data }: { data: StatItem[] }) => {
    return (
        <div className={`grid gap-4 md:grid-cols-${data.length}`}>
            {data.map((item, i) => {
                const Icon = item.icon;

                return (
                    <div
                        key={i}
                        className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4"
                    >
                        {/* ICON (optional) */}
                        {Icon && (
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                            >
                                <Icon className="h-6 w-6" />
                            </div>
                        )}

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                {item.title}
                            </p>
                            <p className="text-2xl font-semibold text-slate-900">
                                {item.value}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};