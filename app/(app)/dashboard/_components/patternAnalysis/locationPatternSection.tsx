import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { LocationPerformanceStat } from "@/lib/mock/dashboardData";

import { formatLocationPatternLabel, TOOLTIP_STYLE, V2 } from "./shared";

interface LocationPatternSectionProps {
  locationInsight: string;
  locations: LocationPerformanceStat[];
}

export function LocationPatternSection({
  locationInsight,
  locations,
}: LocationPatternSectionProps) {
  const chartData = locations
    .map((location) => ({
      label: formatLocationPatternLabel(location.name),
      trips: location.trips,
    }))
    .sort((left, right) => right.trips - left.trips);

  return (
    <div className="h-full w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="h-[180px] w-full">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ bottom: 0, left: 10, right: 20, top: 0 }}
          >
            <CartesianGrid
              horizontal
              opacity={0.15}
              stroke="#334155"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis hide type="number" />
            <YAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
              tickLine={false}
              type="category"
              width={52}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              cursor={{ fill: "rgba(49,130,246,0.06)" }}
              formatter={(value) => [`${value}회`, "출조"]}
            />
            <Bar
              barSize={16}
              dataKey="trips"
              fill={V2}
              radius={[0, 3, 3, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-center text-[10px] text-[color:var(--fg-faint)]">
        {locationInsight}
      </p>
    </div>
  );
}
