"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Clock3Icon } from "../icons/clock3/clock3";
import { FishIcon } from "../icons/fish/fish";
import { MapIcon } from "../icons/map/map";
import type {
  LocationPerformanceStat,
  MonthlyCatchPoint,
  SpeciesStat,
  TideStat,
  TimePatternStat,
} from "../../lib/mock/dashboardData";
import { Card } from "../ui/card";

interface MonthlyTrendCardProps {
  monthlyCatch: MonthlyCatchPoint[];
}

interface PatternAnalysisCardProps {
  locationInsight: string;
  locations: LocationPerformanceStat[];
  speciesStats: SpeciesStat[];
  timeInsight: string;
  timePatterns: TimePatternStat[];
}

interface PatternTabButtonProps {
  activeTab: PatternTab;
  label: string;
  onClick: () => void;
  tab: PatternTab;
}

interface SpeciesPatternSectionProps {
  speciesStats: SpeciesStat[];
}

interface TimePatternChartPoint {
  count: number;
  label: string;
}

interface TimePatternSectionProps {
  timeInsight: string;
  timePatterns: TimePatternStat[];
}

interface LocationPatternChartPoint {
  label: string;
  trips: number;
}

interface LocationPatternSectionProps {
  locationInsight: string;
  locations: LocationPerformanceStat[];
}

interface TideAnalysisCardProps {
  insight: string;
  tideStats: TideStat[];
}

type PatternTab = "location" | "species" | "time";

const V1 = "var(--viz-1)";
const V2 = "var(--viz-2)";
const V3 = "var(--viz-3)";
const V4 = "var(--viz-4)";
const VIZ_COLORS = [V1, V2, V3, V4];

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(15, 23, 42, 0.94)",
  border: "none",
  borderRadius: "10px",
  boxShadow: "0 8px 24px -4px rgb(0 0 0 / 0.18)",
  color: "#e2e8f0",
  fontSize: "11px",
};

export function MonthlyTrendCard({ monthlyCatch }: MonthlyTrendCardProps) {
  return (
    <Card className="border-none p-4 shadow-sm hover:shadow-md lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-[color:var(--fg)]">
          월별 조과 추이
        </h3>
        <select className="cursor-pointer rounded border border-[color:var(--line)] bg-[color:var(--surface-muted)] py-1 pl-2 pr-6 text-xs text-[color:var(--fg-dim)] outline-none">
          <option>2024년</option>
          <option>2023년</option>
        </select>
      </div>

      <div className="h-[200px] w-full sm:h-[250px] -ml-3">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={monthlyCatch}>
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
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function PatternAnalysisCard({
  locationInsight,
  locations,
  speciesStats,
  timeInsight,
  timePatterns,
}: PatternAnalysisCardProps) {
  const [activeTab, setActiveTab] = useState<PatternTab>("species");

  return (
    <Card className="flex flex-col border-none p-4 shadow-sm hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-[color:var(--fg)]">
          패턴 분석
        </h3>
        <div className="flex rounded bg-[color:var(--surface-muted)] p-1">
          <PatternTabButton
            activeTab={activeTab}
            label="어종별"
            onClick={() => setActiveTab("species")}
            tab="species"
          />
          <PatternTabButton
            activeTab={activeTab}
            label="시간대별"
            onClick={() => setActiveTab("time")}
            tab="time"
          />
          <PatternTabButton
            activeTab={activeTab}
            label="장소별"
            onClick={() => setActiveTab("location")}
            tab="location"
          />
        </div>
      </div>

      <div className="relative min-h-[200px] flex-1">
        {activeTab === "species" ? (
          <SpeciesPatternSection speciesStats={speciesStats} />
        ) : null}
        {activeTab === "time" ? (
          <TimePatternSection
            timeInsight={timeInsight}
            timePatterns={timePatterns}
          />
        ) : null}
        {activeTab === "location" ? (
          <LocationPatternSection
            locationInsight={locationInsight}
            locations={locations}
          />
        ) : null}
      </div>
    </Card>
  );
}

export function TideAnalysisCard({
  insight,
  tideStats,
}: TideAnalysisCardProps) {
  return (
    <Card className="flex h-full flex-col border-none p-3 shadow-sm hover:shadow-md lg:col-span-1 transition-shadow">
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

function PatternTabButton({
  activeTab,
  label,
  onClick,
  tab,
}: PatternTabButtonProps) {
  const isActive = activeTab === tab;

  return (
    <button
      className={`rounded p-1 transition-all ${
        isActive
          ? "bg-[color:var(--surface-card)] text-[color:var(--brand-fg)] shadow-sm"
          : "text-[color:var(--fg-muted)] hover:text-[color:var(--fg-dim)]"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {tab === "species" ? <FishIcon className="h-3.5 w-3.5" /> : null}
      {tab === "time" ? <Clock3Icon className="h-3.5 w-3.5" /> : null}
      {tab === "location" ? <MapIcon className="h-3.5 w-3.5" /> : null}
    </button>
  );
}

function SpeciesPatternSection({ speciesStats }: SpeciesPatternSectionProps) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 h-full w-full">
      <div className="relative h-[160px] w-full">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
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
        </ResponsiveContainer>
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

function TimePatternSection({
  timeInsight,
  timePatterns,
}: TimePatternSectionProps) {
  const chartData: TimePatternChartPoint[] = timePatterns.map((item) => ({
    count: item.count,
    label: item.label,
  }));

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 h-full w-full">
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

function LocationPatternSection({
  locationInsight,
  locations,
}: LocationPatternSectionProps) {
  const chartData: LocationPatternChartPoint[] = locations
    .map((location) => ({
      label: formatLocationPatternLabel(location.name),
      trips: location.trips,
    }))
    .sort((left, right) => right.trips - left.trips);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 h-full w-full">
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

function formatLocationPatternLabel(name: string) {
  const parts = name.split(" ");

  return parts[parts.length - 1] ?? name;
}
