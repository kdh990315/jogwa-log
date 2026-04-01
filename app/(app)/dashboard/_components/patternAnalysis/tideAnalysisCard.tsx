"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/card";
import type { TideStat } from "@/lib/mock/dashboardData";

import { TOOLTIP_STYLE, V1 } from "./shared";

interface TideAnalysisCardProps {
  insight: string;
  tideStats: TideStat[];
}

interface TideTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{
    payload?: TideStat;
  }>;
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
              content={<TideTooltip />}
              cursor={{ fill: "rgba(51, 65, 85, 0.1)" }}
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

function TideTooltip({
  active,
  label,
  payload,
}: TideTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const datum = payload[0]?.payload as TideStat | undefined;

  if (!datum) {
    return null;
  }

  return (
    <div
      className="min-w-[132px] space-y-1.5 px-3 py-2"
      style={{ ...TOOLTIP_STYLE, whiteSpace: "nowrap" }}
    >
      <p className="border-b border-slate-700/70 pb-1 font-semibold text-slate-100">
        {label}
      </p>
      <div className="flex items-center justify-between gap-3 text-slate-200">
        <span>출조횟수</span>
        <span className="font-semibold text-slate-50">{datum.tripCount}회</span>
      </div>
      <div className="flex items-center justify-between gap-3 text-slate-200">
        <span>조과횟수</span>
        <span className="font-semibold text-slate-50">{datum.count}회</span>
      </div>
    </div>
  );
}
