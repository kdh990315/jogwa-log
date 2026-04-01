"use client";

import { useState } from "react";

import { ChevronDownIcon } from "@/components/icons/chevronDown/chevronDown";
import { ChevronUpIcon } from "@/components/icons/chevronUp/chevronUp";
import { Clock3Icon } from "@/components/icons/clock3/clock3";
import { MapPinIcon } from "@/components/icons/mapPin/mapPin";
import { SunIcon } from "@/components/icons/sun/sun";
import { WavesIcon } from "@/components/icons/waves/waves";
import { WindIcon } from "@/components/icons/wind/wind";
import { Card } from "@/components/ui/card";
import type { LocationStatDetail } from "@/lib/mock/locationStatsData";

import { CompactStat } from "./compactStat";
import { ConditionItem } from "./conditionItem";
import {
  getRankBadgeClassName,
  getSpeciesBadgeClassName,
  getSuccessColor,
} from "./locationStats.helpers";
import { MonthlyMiniChart } from "./monthlyMiniChart";
import { SpeciesDonutChart } from "./speciesDonutChart";

interface LocationCardProps {
  location: LocationStatDetail;
  rank: number;
}

export function LocationCard({ location, rank }: LocationCardProps) {
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
              className={`rounded px-2 py-0.5 text-[11px] font-bold ${getSuccessColor(
                location.successRate,
              )}`}
            >
              {location.successRate}%
            </span>
            <span
              className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${getSpeciesBadgeClassName()}`}
            >
              {location.mainSpecies}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 divide-x divide-line-muted">
        <CompactStat label="출조" value={`${location.totalTrips}회`} />
        <CompactStat label="평균 조과" value={`${location.averageCatch}마리`} />
        <CompactStat
          label="평균 사이즈"
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
        <div className="space-y-1.5 px-4 py-3">
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
                className={`rounded border px-1.5 py-0.5 text-[9px] font-medium ${getSpeciesBadgeClassName()}`}
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
