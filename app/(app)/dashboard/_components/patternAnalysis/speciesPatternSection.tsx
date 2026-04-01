import { Cell, Pie, PieChart, Tooltip } from "recharts";

import type { SpeciesStat } from "@/lib/mock/dashboardData";

import { ChartFrame } from "./chartFrame";
import { TOOLTIP_STYLE, VIZ_COLORS } from "./shared";

interface SpeciesPatternSectionProps {
  speciesStats: SpeciesStat[];
}

export function SpeciesPatternSection({
  speciesStats,
}: SpeciesPatternSectionProps) {
  return (
    <div className="h-full w-full min-w-0 animate-in fade-in zoom-in-95 duration-300">
      <div className="relative h-[160px] w-full">
        <ChartFrame className="h-full w-full">
          {({ height, width }) => (
            <PieChart height={height} width={width}>
              <Pie
                cx="50%"
                cy="50%"
                data={speciesStats}
                dataKey="value"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                stroke="none"
              >
                {speciesStats.map((item, index) => (
                  <Cell
                    fill={VIZ_COLORS[index % VIZ_COLORS.length]}
                    key={item.label}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => [`${value}%`, ""]}
                itemStyle={{ color: "#e2e8f0" }}
              />
            </PieChart>
          )}
        </ChartFrame>
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-xl font-bold text-[color:var(--fg)]">Top 4</p>
          <p className="text-[10px] text-[color:var(--fg-muted)]">어종 비율</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {speciesStats.map((item, index) => (
          <div
            className="flex items-center gap-1 rounded border border-[color:var(--line-muted)] bg-[color:var(--surface-muted)] px-2 py-0.5"
            key={item.label}
          >
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: VIZ_COLORS[index % VIZ_COLORS.length] }}
            />
            <span className="text-[10px] font-medium text-[color:var(--fg-dim)]">
              {item.label} {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
