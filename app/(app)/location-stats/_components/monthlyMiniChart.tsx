import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { LocationStatDetail } from "@/lib/mock/locationStatsData";

interface MonthlyMiniChartProps {
  monthlyPoints: LocationStatDetail["monthlyPoints"];
}

export function MonthlyMiniChart({ monthlyPoints }: MonthlyMiniChartProps) {
  return (
    <div className="ml-[-8px] h-[80px]">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          data={monthlyPoints}
          margin={{ bottom: 0, left: 0, right: 2, top: 0 }}
        >
          <XAxis
            axisLine={false}
            dataKey="month"
            interval={0}
            tick={{ fill: "#94a3b8", fontSize: 7 }}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15,23,42,0.95)",
              border: "none",
              borderRadius: "8px",
              color: "#f8fafc",
              fontSize: "10px",
            }}
            formatter={(value) => [`${value}마리`, ""]}
            labelFormatter={(label) => `${label}월`}
          />
          <Bar
            barSize={8}
            dataKey="catchCount"
            isAnimationActive={false}
            radius={[2, 2, 0, 0]}
          >
            {monthlyPoints.map((point) => (
              <Cell
                fill={
                  point.catchCount > 10
                    ? "var(--viz-1)"
                    : point.catchCount > 0
                      ? "var(--viz-3)"
                      : "var(--line)"
                }
                key={`${point.month}-${point.catchCount}`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
