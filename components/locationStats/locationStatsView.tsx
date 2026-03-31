"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AnchorIcon } from "../icons/anchor/anchor";
import { ArrowLeftIcon } from "../icons/arrowLeft/arrowLeft";
import { ChevronDownIcon } from "../icons/chevronDown/chevronDown";
import { ChevronUpIcon } from "../icons/chevronUp/chevronUp";
import { Clock3Icon } from "../icons/clock3/clock3";
import { FishIcon } from "../icons/fish/fish";
import { MapPinIcon } from "../icons/mapPin/mapPin";
import { StarIcon } from "../icons/star/star";
import { SunIcon } from "../icons/sun/sun";
import { TrendingUpIcon } from "../icons/trendingUp/trendingUp";
import { TrophyIcon } from "../icons/trophy/trophy";
import { WavesIcon } from "../icons/waves/waves";
import { WindIcon } from "../icons/wind/wind";
import { getModeAwareHref } from "../../lib/fishingMode";
import type { FishingMode } from "../../lib/mock/dashboardData";
import type {
  LocationSpeciesBreakdown,
  LocationStatDetail,
  LocationStatsData,
} from "../../lib/mock/locationStatsData";
import { FishingModeToggle } from "../fishingModeToggle";
import { Card } from "../ui/card";

interface LocationStatsViewProps {
  activeMode: FishingMode;
  data: LocationStatsData;
}

interface ComparisonChartCardProps {
  locations: LocationStatDetail[];
}

interface ComparisonPoint {
  fullName: string;
  name: string;
  totalCatch: number;
  successRate: number;
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

interface ConditionItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

interface CompactStatProps {
  label: string;
  value: string;
}

interface LocationCardProps {
  location: LocationStatDetail;
  rank: number;
}

interface MetricCardProps {
  backgroundClassName: string;
  icon: ReactNode;
  label: string;
  subLabel: string;
  textClassName: string;
  value: string;
}

interface RankingCardProps {
  bestLocation: LocationStatDetail;
  locations: LocationStatDetail[];
}

interface SpeciesDonutChartProps {
  speciesBreakdown: LocationSpeciesBreakdown[];
}

interface SortButtonProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

interface MonthlyMiniChartProps {
  monthlyPoints: LocationStatDetail["monthlyPoints"];
}

type SortBy = "catch" | "count" | "success";

const SPECIES_BREAKDOWN_COLORS = [
  "var(--viz-1)",
  "#f59e0b",
  "#14b8a6",
  "#94a3b8",
];

export function LocationStatsView({
  activeMode,
  data,
}: LocationStatsViewProps) {
  const [sortBy, setSortBy] = useState<SortBy>("success");
  const [yearFilter, setYearFilter] = useState("2024년");

  const locationDetails = data.locations;

  const sorted = [...locationDetails].sort((left, right) => {
    if (sortBy === "success") {
      return right.successRate - left.successRate;
    }

    if (sortBy === "count") {
      return right.totalTrips - left.totalTrips;
    }

    return right.totalCatch - left.totalCatch;
  });

  const totalTrips = locationDetails.reduce(
    (sum, location) => sum + location.totalTrips,
    0,
  );
  const totalCatch = locationDetails.reduce(
    (sum, location) => sum + location.totalCatch,
    0,
  );
  const bestLocation = [...locationDetails].sort(
    (left, right) => right.successRate - left.successRate,
  )[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link
            className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
            href={getModeAwareHref("/dashboard", activeMode)}
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            대시보드
          </Link>
          <div className="h-4 w-px bg-line" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-fg">
                <MapPinIcon className="h-5 w-5 text-brand-fg" />
                포인트별 상세 성과
              </h1>
              <FishingModeToggle
                activeMode={activeMode}
                pathname="/location-stats"
              />
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
              총 <span className="font-semibold text-brand-fg">{locationDetails.length}개</span>{" "}
              포인트 ·{" "}
              <span className="font-semibold text-brand-fg">{totalTrips}회</span>{" "}
              출조 기록
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="cursor-pointer rounded-lg border border-line bg-surface-card py-1.5 pl-2.5 pr-6 text-xs text-fg-dim outline-none transition-colors hover:bg-surface-muted"
            onChange={(event) => setYearFilter(event.target.value)}
            value={yearFilter}
          >
            <option>2024년</option>
            <option>2023년</option>
          </select>
          <div className="flex items-center gap-1 rounded-lg bg-surface-muted p-1">
            <SortButton
              isActive={sortBy === "success"}
              label="성공률순"
              onClick={() => setSortBy("success")}
            />
            <SortButton
              isActive={sortBy === "count"}
              label="출조순"
              onClick={() => setSortBy("count")}
            />
            <SortButton
              isActive={sortBy === "catch"}
              label="조과순"
              onClick={() => setSortBy("catch")}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          backgroundClassName="bg-slate-100 dark:bg-slate-800"
          icon={<MapPinIcon className="h-4 w-4" />}
          label="방문 포인트"
          subLabel="등록된 낚시 포인트"
          textClassName="text-slate-600 dark:text-slate-400"
          value={`${locationDetails.length}곳`}
        />
        <MetricCard
          backgroundClassName="bg-slate-100 dark:bg-slate-800"
          icon={<AnchorIcon className="h-4 w-4" />}
          label="총 출조 횟수"
          subLabel="2024년 누적"
          textClassName="text-slate-600 dark:text-slate-400"
          value={`${totalTrips}회`}
        />
        <MetricCard
          backgroundClassName="bg-slate-100 dark:bg-slate-800"
          icon={<TrophyIcon className="h-4 w-4" />}
          label="최우수 포인트"
          subLabel={`${formatRankingName(bestLocation.name)} · 성공률 ${bestLocation.successRate}%`}
          textClassName="text-slate-600 dark:text-slate-400"
          value={bestLocation.mainSpecies}
        />
        <MetricCard
          backgroundClassName="bg-slate-100 dark:bg-slate-800"
          icon={<FishIcon className="h-4 w-4" />}
          label="총 조과"
          subLabel="전 포인트 합산"
          textClassName="text-slate-600 dark:text-slate-400"
          value={`${totalCatch}마리`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ComparisonChartCard locations={locationDetails} />
        <RankingCard bestLocation={bestLocation} locations={locationDetails} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            포인트 상세 카드
          </h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            카드를 클릭해 최근 기록을 확인하세요
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((location) => {
            const rank =
              [...locationDetails]
                .sort((left, right) => right.successRate - left.successRate)
                .findIndex((item) => item.id === location.id) + 1;

            return (
              <LocationCard key={location.id} location={location} rank={rank} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ComparisonChartCard({ locations }: ComparisonChartCardProps) {
  const comparisonData: ComparisonPoint[] = locations.map((location) => ({
    fullName: location.name,
    name: formatComparisonName(location.name),
    successRate: location.successRate,
    totalCatch: location.totalCatch,
  }));

  return (
    <Card className="p-4 border-none shadow-sm hover:shadow-md lg:col-span-2">
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

function RankingCard({ bestLocation, locations }: RankingCardProps) {
  const rankedLocations = [...locations].sort(
    (left, right) => right.successRate - left.successRate,
  );

  return (
    <Card className="flex flex-col p-4 border-none shadow-sm hover:shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <StarIcon className="h-4 w-4 text-amber-400" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          성공률 순위
        </h3>
      </div>
      <div className="flex-1 space-y-3">
        {rankedLocations.map((location, index) => (
          <div key={location.id}>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={getRankTextClassName(index + 1)}>{index + 1}</span>
                <span className="max-w-[100px] truncate text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  {formatRankingName(location.name)}
                </span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getSuccessColor(location.successRate)}`}
              >
                {location.successRate}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  backgroundColor: getSuccessBarColor(location.successRate),
                  width: `${location.successRate}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
        <p className="flex items-start gap-1.5 text-[10px] text-fg-faint">
          <TrendingUpIcon className="mt-0.5 h-3 w-3 shrink-0 text-brand-fg" />
          <span>
            <span className="font-bold text-brand-fg">{bestLocation.name}</span>
            이(가) 가장 높은 성공률을 기록 중입니다.
          </span>
        </p>
      </div>
    </Card>
  );
}

function LocationCard({ location, rank }: LocationCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="flex flex-col overflow-hidden border border-line-card p-0 shadow-sm transition-shadow hover:shadow-md">
      <div className="border-b border-line-muted p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <div className={getRankBadgeClassName(rank)}>{rank}</div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold leading-tight text-slate-900 dark:text-white">
                {location.name}
              </h3>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                  <MapPinIcon className="h-2.5 w-2.5" />
                  {location.region}
                </span>
                <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0 text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  {location.typeLabel}
                </span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${getSuccessColor(location.successRate)}`}
            >
              {location.successRate}%
            </span>
            <span
              className={`px-1.5 py-0.5 rounded border text-[10px] font-medium ${getSpeciesBadgeClassName()}`}
            >
              {location.mainSpecies}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 divide-x divide-line-muted px-0 py-0">
        <CompactStat label="출조" value={`${location.totalTrips}회`} />
        <CompactStat label="평균 조과" value={`${location.averageCatch}마리`} />
        <CompactStat
          label="평균 씨즈"
          value={location.averageSize > 0 ? `${location.averageSize}cm` : "-"}
        />
        <CompactStat label="최대 조과" value={`${location.maxCatch}마리`} />
      </div>

      <div className="grid grid-cols-2 gap-0 border-t border-line-muted">
        <div className="border-r border-line-muted p-3">
          <p className="mb-1 text-[9px] font-medium text-slate-400 dark:text-slate-500">
            어종 비율
          </p>
          <SpeciesDonutChart speciesBreakdown={location.speciesBreakdown} />
        </div>
        <div className="p-3">
          <p className="mb-1 text-[9px] font-medium text-slate-400 dark:text-slate-500">
            월별 조과
          </p>
          <MonthlyMiniChart monthlyPoints={location.monthlyPoints} />
        </div>
      </div>

      <div className="border-t border-line-muted bg-surface-muted/30 px-4 py-3">
        <p className="mb-2 text-[9px] font-medium text-slate-400 dark:text-slate-500">
          최적 조건
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {location.bestTide ? (
            <ConditionItem
              icon={<WavesIcon className="h-3 w-3" />}
              label="물때"
              value={location.bestTide}
            />
          ) : null}
          <ConditionItem
            icon={<Clock3Icon className="h-3 w-3" />}
            label="시간대"
            value={location.bestTime}
          />
          <ConditionItem
            icon={<WindIcon className="h-3 w-3" />}
            label="날씨"
            value={location.bestWeather}
          />
          <ConditionItem
            icon={<SunIcon className="h-3 w-3" />}
            label="시즌"
            value={location.bestSeason}
          />
        </div>
      </div>

      <button
        className="flex w-full items-center justify-between border-t border-line-muted px-4 py-2 text-[10px] font-medium text-fg-faint transition-colors hover:bg-surface-muted"
        onClick={() => setExpanded((previousState) => !previousState)}
        type="button"
      >
        <span>최근 출조 기록</span>
        {expanded ? (
          <ChevronUpIcon className="h-3.5 w-3.5" />
        ) : (
          <ChevronDownIcon className="h-3.5 w-3.5" />
        )}
      </button>

      {expanded ? (
        <div className="space-y-1.5 px-4 pb-3">
          {location.recentLogs.map((log) => (
            <div
              className="flex items-center justify-between rounded-lg border border-line bg-surface-muted px-2 py-1.5"
              key={`${location.id}-${log.dateLabel}-${log.species}`}
            >
              <span className="w-10 shrink-0 text-[10px] text-slate-400 dark:text-slate-500">
                {log.dateLabel}
              </span>
              <span className="text-[10px] font-bold text-fg">
                {log.catchCount}마리
              </span>
              <span
                className={`px-1.5 py-0.5 rounded border text-[9px] font-medium ${getSpeciesBadgeClassName()}`}
              >
                {log.species}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500">
                {log.tideLabel}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500">
                {log.weather}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function MetricCard({
  backgroundClassName,
  icon,
  label,
  subLabel,
  textClassName,
  value,
}: MetricCardProps) {
  return (
    <Card className="p-3.5 border-none shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className={`mt-0.5 text-xl font-bold ${textClassName}`}>{value}</p>
          <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
            {subLabel}
          </p>
        </div>
        <div className={`shrink-0 rounded-lg p-2 ${backgroundClassName} ${textClassName}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

function SortButton({
  isActive,
  label,
  onClick,
}: SortButtonProps) {
  return (
    <button
      className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
        isActive
          ? "bg-surface-card text-brand-fg shadow-sm"
          : "text-fg-faint hover:text-fg"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function CompactStat({ label, value }: CompactStatProps) {
  return (
    <div className="flex flex-col items-center px-1 py-2.5">
      <span className="mb-0.5 text-[9px] text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <span className="text-[11px] font-bold text-fg">{value}</span>
    </div>
  );
}

function SpeciesDonutChart({ speciesBreakdown }: SpeciesDonutChartProps) {
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

function MonthlyMiniChart({ monthlyPoints }: MonthlyMiniChartProps) {
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

function ConditionItem({ icon, label, value }: ConditionItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="shrink-0 text-blue-500 dark:text-blue-400">{icon}</span>
      <span className="shrink-0 text-[9px] text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <span className="truncate text-[10px] font-semibold text-slate-700 dark:text-slate-300">
        {value}
      </span>
    </div>
  );
}

function formatComparisonName(name: string) {
  return name.replace(/(안면도|보령|군산|태안|경기|경북|충북|충남)\s/, "");
}

function formatRankingName(name: string) {
  return name.split(" ")[1] ?? name;
}


function getRankBadgeClassName(rank: number) {
  if (rank === 1) {
    return "shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-amber-900";
  }

  if (rank === 2) {
    return "shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-[10px] font-bold text-slate-700";
  }

  if (rank === 3) {
    return "shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-orange-300 text-[10px] font-bold text-orange-900";
  }

  return "shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400";
}

function getRankTextClassName(rank: number) {
  if (rank === 1) {
    return "w-4 text-center text-[10px] font-bold text-amber-500";
  }

  if (rank === 2) {
    return "w-4 text-center text-[10px] font-bold text-slate-400";
  }

  if (rank === 3) {
    return "w-4 text-center text-[10px] font-bold text-orange-400";
  }

  return "w-4 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500";
}

function getSuccessColor(rate: number) {
  if (rate >= 85) {
    return "text-brand-fg-strong bg-brand-surface";
  }

  if (rate >= 70) {
    return "text-brand-fg bg-brand-surface";
  }

  if (rate >= 55) {
    return "text-fg-dim bg-surface-muted";
  }

  return "text-fg-muted bg-surface-muted";
}

function getSuccessBarColor(rate: number) {
  if (rate >= 85) {
    return "var(--viz-1)";
  }

  if (rate >= 70) {
    return "var(--viz-2)";
  }

  if (rate >= 55) {
    return "var(--viz-3)";
  }

  return "var(--viz-4)";
}

function getSpeciesBadgeClassName() {
  return "bg-surface-muted text-fg-dim border-line";
}
