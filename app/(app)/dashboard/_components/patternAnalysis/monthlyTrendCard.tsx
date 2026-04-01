"use client";

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/card";
import type { MonthlyCatchPoint } from "@/lib/mock/dashboardData";

import { ChartFrame } from "./chartFrame";
import { TOOLTIP_STYLE, V1 } from "./shared";

interface MonthlyTrendCardProps {
  monthlyCatch: MonthlyCatchPoint[];
}

export function MonthlyTrendCard({ monthlyCatch }: MonthlyTrendCardProps) {
  return (
    <Card className="min-w-0 border-none p-4 shadow-sm hover:shadow-md lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-[color:var(--fg)]">
          월별 조과 추이
        </h3>
        <select className="cursor-pointer rounded border border-[color:var(--line)] bg-[color:var(--surface-muted)] py-1 pl-2 pr-6 text-xs text-[color:var(--fg-dim)] outline-none">
          <option>2024년</option>
          <option>2023년</option>
        </select>
      </div>

      <ChartFrame className="h-[200px] w-full sm:h-[250px]">
        {({ height, width }) => (
          <AreaChart
            data={monthlyCatch}
            height={height}
            margin={{ bottom: 0, left: -12, right: 0, top: 8 }}
            width={width}
          >
            <defs>
              <linearGradient id="monthly-catch-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={V1} stopOpacity={0.18} />
                <stop offset="95%" stopColor={V1} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              opacity={0.15}
              stroke="#334155"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="month"
              dy={8}
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              cursor={{ stroke: V1, strokeDasharray: "4 4", strokeWidth: 1 }}
              formatter={(value) => [`${value}마리`, "조과"]}
              labelFormatter={(label) => `${label}`}
            />
            <Area
              dataKey="count"
              fill="url(#monthly-catch-fill)"
              fillOpacity={1}
              stroke={V1}
              strokeWidth={2.5}
              type="monotone"
            />
          </AreaChart>
        )}
      </ChartFrame>
    </Card>
  );
}
