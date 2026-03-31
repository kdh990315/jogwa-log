"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/card";
import type { TideStat } from "@/lib/mock/dashboardData";

import { V1 } from "./shared";

interface TideAnalysisCardProps {
  insight: string;
  tideStats: TideStat[];
}

export function TideAnalysisCard({
  insight,
  tideStats,
}: TideAnalysisCardProps) {
  return (
    <Card className="flex h-full flex-col border-none p-3 shadow-sm transition-shadow hover:shadow-md lg:col-span-1">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h3 className="text-sm font-bold text-[color:var(--fg)]">
          물때별 성과
        </h3>
        <span className="rounded-full bg-[color:var(--brand-surface)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--brand-fg)]">
          Insight
        </span>
      </div>

      <div className="min-h-[200px] w-full flex-1">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart
            data={tideStats}
            layout="vertical"
            margin={{ bottom: 0, left: 4, right: 6, top: 0 }}
          >
            <CartesianGrid
              horizontal
              opacity={0.15}
              stroke="#334155"
              strokeDasharray="3 3"
              vertical
            />
            <XAxis hide type="number" />
            <YAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              type="category"
              width={36}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                color: "#f8fafc",
                fontSize: "11px",
              }}
              cursor={{ fill: "rgba(51, 65, 85, 0.1)" }}
              formatter={(value) => [`${value}회`, "출조"]}
            />
            <Bar
              barSize={12}
              dataKey="count"
              fill={V1}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 shrink-0 rounded-lg border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] p-2 text-[12px] leading-relaxed text-[color:var(--fg-faint)]">
        <strong className="text-[color:var(--brand-fg)]">분석:</strong> {insight}
      </p>
    </Card>
  );
}
