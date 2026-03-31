import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { TimePatternStat } from "@/lib/mock/dashboardData";

import { TOOLTIP_STYLE, V1, V3 } from "./shared";

interface TimePatternSectionProps {
  timeInsight: string;
  timePatterns: TimePatternStat[];
}

export function TimePatternSection({
  timeInsight,
  timePatterns,
}: TimePatternSectionProps) {
  const chartData = timePatterns.map((item) => ({
    count: item.count,
    label: item.label,
  }));

  return (
    <div className="h-full w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="h-[180px] w-full -ml-4">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart
            data={chartData}
            margin={{ bottom: 0, left: 0, right: 10, top: 10 }}
          >
            <CartesianGrid
              opacity={0.15}
              stroke="#334155"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="label"
              interval={0}
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
              cursor={{ fill: "rgba(49,130,246,0.06)" }}
              formatter={(value) => [`${value}회`, "출조"]}
            />
            <Bar barSize={24} dataKey="count" radius={[3, 3, 0, 0]}>
              {chartData.map((item) => (
                <Cell
                  fill={item.count >= 20 ? V1 : V3}
                  key={`${item.label}-${item.count}`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 rounded border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] py-1.5 text-center text-[10px] font-medium text-[color:var(--brand-fg)]">
        {timeInsight}
      </p>
    </div>
  );
}
