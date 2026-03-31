import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import type { LocationStatDetail } from "@/lib/mock/locationStatsData";

import { formatComparisonName } from "./locationStats.helpers";

interface ComparisonChartCardProps {
  locations: LocationStatDetail[];
}

interface ComparisonPoint {
  name: string;
  successRate: number;
  totalCatch: number;
}

interface ComparisonChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{
    color?: string;
    name?: string;
    value?: number | string;
  }>;
}

export function ComparisonChartCard({
  locations,
}: ComparisonChartCardProps) {
  const comparisonData: ComparisonPoint[] = locations.map((location) => ({
    name: formatComparisonName(location.name),
    successRate: location.successRate,
    totalCatch: location.totalCatch,
  }));

  return (
    <Card className="border-none p-4 shadow-sm hover:shadow-md lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            포인트별 종합 비교
          </h3>
          <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
            총 조과 (막대) · 성공률 % (꺾은선)
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-3 rounded-sm bg-blue-500" />
            총조과
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 bg-amber-400" />
            성공률
          </span>
        </div>
      </div>
      <div className="h-[220px] -ml-2">
        <ResponsiveContainer height="100%" width="100%">
          <ComposedChart
            data={comparisonData}
            margin={{ bottom: 0, left: 0, right: 20, top: 5 }}
          >
            <CartesianGrid
              opacity={0.15}
              stroke="#334155"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="name"
              dy={6}
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickLine={false}
              width={28}
              yAxisId="left"
            />
            <YAxis
              axisLine={false}
              domain={[0, 100]}
              orientation="right"
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              width={32}
              yAxisId="right"
            />
            <Tooltip content={<ComparisonChartTooltip />} />
            <Bar
              barSize={32}
              dataKey="totalCatch"
              fill="#3182F6"
              name="총조과"
              opacity={0.85}
              radius={[4, 4, 0, 0]}
              yAxisId="left"
            />
            <Line
              activeDot={{ r: 6 }}
              dataKey="successRate"
              dot={{ fill: "#f59e0b", r: 4, stroke: "#fff", strokeWidth: 1.5 }}
              name="성공률"
              stroke="#f59e0b"
              strokeWidth={2.5}
              type="monotone"
              yAxisId="right"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function ComparisonChartTooltip({
  active,
  label,
  payload,
}: ComparisonChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[140px] rounded-xl border border-line-card bg-slate-900 p-3 text-[11px] text-slate-100 shadow-xl">
      <p className="mb-1.5 font-bold text-slate-200">{label}</p>
      {payload.map((item, index) => {
        const rawValue =
          typeof item.value === "number" || typeof item.value === "string"
            ? item.value
            : "";
        const suffix = item.name === "성공률" ? "%" : "마리";

        return (
          <div
            className="flex items-center justify-between gap-3"
            key={`${item.name ?? "metric"}-${index}`}
          >
            <span className="flex items-center gap-1">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: item.color }}
              />
              {item.name}
            </span>
            <span className="font-bold">
              {rawValue}
              {suffix}
            </span>
          </div>
        );
      })}
    </div>
  );
}
