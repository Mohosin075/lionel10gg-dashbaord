import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatItem = {
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    icon?: React.ReactNode;
};

export default function DashboardStatsCard({ stats }: { stats: StatItem[] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((data) => (
                <Card key={data.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            {data.title}
                        </CardTitle>

                        {/* ICON (optional) */}
                        {data.icon}
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">{data.value}</div>

                        <p
                            className={`text-xs ${data.isPositive ? "text-emerald-500" : "text-red-500"
                                } flex items-center gap-1 mt-1`}
                        >
                            {/* ICON */}
                            {data.trend.startsWith("+") && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3 w-3"
                                >
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                            )}

                            {/* TREND TEXT */}
                            {data.trend}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}