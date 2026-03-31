import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { FishIcon } from "@/components/icons/fish/fish";
import type { LocationSpeciesBreakdown } from "@/lib/mock/locationStatsData";

import { SPECIES_BREAKDOWN_COLORS } from "./locationStats.constants";

interface SpeciesDonutChartProps {
  speciesBreakdown: LocationSpeciesBreakdown[];
}

export function SpeciesDonutChart({
  speciesBreakdown,
}: SpeciesDonutChartProps) {
  return (
    <>
      <div className="relative h-[80px]">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={speciesBreakdown}
              dataKey="value"
              innerRadius={24}
              outerRadius={36}
              paddingAngle={3}
              stroke="none"
            >
              {speciesBreakdown.map((species, index) => (
                <Cell
                  fill={
                    SPECIES_BREAKDOWN_COLORS[
                      index % SPECIES_BREAKDOWN_COLORS.length
                    ]
                  }
                  key={species.label}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15,23,42,0.95)",
                border: "none",
                borderRadius: "8px",
                color: "#f8fafc",
                fontSize: "10px",
              }}
              formatter={(value) => [`${value}%`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <FishIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
        {speciesBreakdown.slice(0, 3).map((species, index) => (
          <span
            className="flex items-center gap-0.5 text-[9px] text-slate-500 dark:text-slate-400"
            key={species.label}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: SPECIES_BREAKDOWN_COLORS[index] }}
            />
            {species.label} {species.value}%
          </span>
        ))}
      </div>
    </>
  );
}
