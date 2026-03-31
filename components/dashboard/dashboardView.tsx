import Link from "next/link";

import { ArrowUpRightIcon } from "../icons/arrowUpRight/arrowUpRight";
import { ChevronLeftIcon } from "../icons/chevronLeft/chevronLeft";
import { ChevronRightIcon } from "../icons/chevronRight/chevronRight";
import { FishIcon } from "../icons/fish/fish";
import { HouseIcon } from "../icons/house/house";
import { MapPinIcon } from "../icons/mapPin/mapPin";
import { MoreHorizontalIcon } from "../icons/moreHorizontal/moreHorizontal";
import { WavesIcon } from "../icons/waves/waves";
import { XIcon } from "../icons/x/x";
import { getModeAwareHref } from "../../lib/fishingMode";
import type {
  CalendarEntry,
  DashboardData,
  DashboardMetric,
  FishingMode,
  LocationPerformanceStat,
  RecentLogEntry,
} from "../../lib/mock/dashboardData";
import { FishingModeToggle } from "../fishingModeToggle";
import { RegisterLogDialog } from "./registerLog/registerLogDialog";
import { Card } from "../ui/card";
import {
  MonthlyTrendCard,
  PatternAnalysisCard,
  TideAnalysisCard,
} from "./patternAnalysisCard";

interface DashboardViewProps {
  activeMode: FishingMode;
  data: DashboardData;
}

type DashboardIconName = DashboardMetric["icon"];

interface MetricCardProps {
  metric: DashboardMetric;
}

interface CalendarCardProps {
  calendarEntries: CalendarEntry[];
}

interface LocationStatsCardProps {
  activeMode: FishingMode;
  locations: LocationPerformanceStat[];
}

interface RecentLogsCardProps {
  activeMode: FishingMode;
  recentLogs: RecentLogEntry[];
}

export function DashboardView({ activeMode, data }: DashboardViewProps) {
  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[color:var(--fg)]">
              대시보드
            </h1>
          </div>
          <FishingModeToggle activeMode={activeMode} pathname="/dashboard" />
        </div>

        <RegisterLogDialog triggerClassName="w-full sm:w-auto" />
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MonthlyTrendCard monthlyCatch={data.monthlyCatch} />
        <PatternAnalysisCard
          locationInsight={data.locationInsight}
          locations={data.locations}
          speciesStats={data.speciesStats}
          timeInsight={data.timeInsight}
          timePatterns={data.timePatterns}
        />
      </section>

      {data.tideStats ? (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <TideAnalysisCard
            insight={data.tideInsight ?? ""}
            tideStats={data.tideStats}
          />
          <CalendarCard calendarEntries={data.calendarEntries} />
        </section>
      ) : (
        <section>
          <CalendarCard calendarEntries={data.calendarEntries} />
        </section>
      )}

      <LocationStatsCard activeMode={activeMode} locations={data.locations} />
      <RecentLogsCard activeMode={activeMode} recentLogs={data.recentLogs} />
    </div>
  );
}

function MetricCard({ metric }: MetricCardProps) {
  const hasPositiveChange = metric.change?.includes("+");

  return (
    <Card className="flex h-full flex-col justify-between border-none p-4 shadow-sm hover:shadow-md">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <p className="truncate text-xs font-medium text-[color:var(--fg-faint)]">
          {metric.label}
        </p>
        <div className="ml-2 shrink-0 rounded-lg bg-[color:var(--brand-surface)] p-1.5">
          <MetricIcon
            className="h-4 w-4 text-[color:var(--brand-fg)]"
            name={metric.icon}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold tracking-tight text-[color:var(--fg)]">
          {metric.value}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] font-medium">
          {metric.change ? (
            hasPositiveChange ? (
              <span className="flex items-center rounded bg-[color:var(--brand-surface)] px-1.5 py-0.5 text-[color:var(--brand-fg)]">
                <ArrowUpRightIcon className="mr-0.5 h-3 w-3" />
                {metric.change}
              </span>
            ) : (
              <span className="text-[color:var(--fg-muted)]">
                {metric.change}
              </span>
            )
          ) : null}

          {metric.subtext ? (
            <span className="hidden text-[color:var(--fg-muted)] sm:inline">
              · {metric.subtext}
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function CalendarCard({ calendarEntries }: CalendarCardProps) {
  const referenceDate = new Date(calendarEntries[0]?.date ?? "2024-05-01");
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = new Date(year, month, 1).getDay();
  const today = 14;
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const entriesByDay = new Map<number, CalendarEntry>();

  calendarEntries.forEach((entry) => {
    entriesByDay.set(new Date(entry.date).getDate(), entry);
  });

  const calendarDays = Array.from(
    { length: firstDayOffset + daysInMonth },
    (_, index) => (index < firstDayOffset ? null : index - firstDayOffset + 1),
  );

  return (
    <Card className="flex h-full flex-col border-none p-4 shadow-sm lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-[color:var(--fg)]">
          출조 캘린더
        </h3>
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-1 text-[color:var(--fg-muted)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--fg-dim)]"
            type="button"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold text-[color:var(--fg)]">
            {year}. {String(month + 1).padStart(2, "0")}
          </span>
          <button
            className="rounded-lg p-1 text-[color:var(--fg-muted)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--fg-dim)]"
            type="button"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center">
        {weekDays.map((day, index) => (
          <div
            className={`mb-1 text-[10px] font-medium ${
              index === 0
                ? "text-red-400 dark:text-red-500"
                : index === 6
                  ? "text-[color:var(--brand-fg)]"
                  : "text-[color:var(--fg-muted)]"
            }`}
            key={day}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 gap-1 sm:gap-1.5">
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <div
                className="h-16 rounded-lg bg-[color:var(--surface-page)]/50 md:h-20"
                key={`empty-${index}`}
              />
            );
          }

          const entry = entriesByDay.get(day);
          const isToday = day === today;

          return (
            <div
              className={`relative flex h-16 flex-col rounded-lg border p-1 transition-all duration-200 md:h-20 ${
                isToday
                  ? "border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] ring-1 ring-[color:var(--brand-border)]/50"
                  : "border-[color:var(--line-card)] bg-[color:var(--surface)] hover:border-[color:var(--brand-border)] hover:shadow-sm"
              }`}
              key={day}
            >
              <span
                className={`mb-0.5 pl-0.5 text-[10px] font-bold ${
                  isToday
                    ? "text-[color:var(--brand-fg)]"
                    : "text-[color:var(--fg-faint)]"
                }`}
              >
                {day}
              </span>

              {entry ? (
                <div className="flex flex-1 flex-col justify-center gap-1 sm:justify-start">
                  <div className="flex w-full items-center justify-center gap-1 rounded bg-[color:var(--surface-panel)]/60 p-1 shadow-sm backdrop-blur-sm transition-all hover:bg-[color:var(--surface-panel)] sm:justify-start sm:px-1.5 sm:py-1">
                    {entry.status === "fishing" ? (
                      <>
                        <FishIcon className="h-4 w-4 shrink-0 text-[color:var(--brand-fg)] sm:h-3 sm:w-3" />
                        <span className="hidden truncate pt-0.5 text-[10px] font-bold leading-none text-[color:var(--brand-fg-strong)] sm:block">
                          {entry.species}
                        </span>
                      </>
                    ) : (
                      <>
                        <XIcon className="h-4 w-4 shrink-0 text-red-500 sm:h-3 sm:w-3" />
                        <span className="hidden truncate pt-0.5 text-[10px] font-bold leading-none text-red-700 dark:text-red-300 sm:block">
                          꽝
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function LocationStatsCard({ activeMode, locations }: LocationStatsCardProps) {
  return (
    <Card className="w-full overflow-hidden border-none p-4 shadow-sm hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-[color:var(--fg)]">
          포인트별 상세 성과
        </h3>
        <Link
          className="text-xs font-medium text-[color:var(--brand-fg)] transition-colors hover:text-[color:var(--brand-fg-strong)]"
          href={getModeAwareHref("/location-stats", activeMode)}
        >
          전체보기
        </Link>
      </div>

      <div className="space-y-3 md:hidden">
        {locations.map((location) => (
          <div
            className="space-y-2.5 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3"
            key={location.name}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-[color:var(--fg)]">
                  {location.name}
                </h4>
                <div className="mt-1">
                  <span className="rounded border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--fg-dim)]">
                    {location.species}
                  </span>
                </div>
              </div>
              <span className="rounded px-2 py-0.5 text-[10px] font-bold text-[color:var(--brand-fg)] bg-[color:var(--brand-surface)]">
                성공률 {location.successRate}%
              </span>
            </div>

            <div className="mt-1.5 grid grid-cols-3 gap-2 border-t border-[color:var(--line)] pt-2.5 text-center text-[11px]">
              <div className="flex flex-col">
                <span className="mb-0.5 text-[10px] text-[color:var(--fg-muted)]">
                  출조 횟수
                </span>
                <span className="font-medium text-[color:var(--fg)]">
                  {location.trips}회
                </span>
              </div>
              <div className="flex flex-col border-x border-[color:var(--line)] px-2">
                <span className="mb-0.5 text-[10px] text-[color:var(--fg-muted)]">
                  평균 조과
                </span>
                <span className="font-bold text-[color:var(--fg)]">
                  {location.averageCatch}마리
                </span>
              </div>
              <div className="flex flex-col">
                <span className="mb-0.5 text-[10px] text-[color:var(--fg-muted)]">
                  평균 크기
                </span>
                <span className="font-medium text-[color:var(--fg)]">
                  {location.averageSize}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[color:var(--line)] bg-[color:var(--surface-muted)] font-medium text-[color:var(--fg-faint)]">
            <tr>
              <th className="rounded-tl-lg px-3 py-2.5 whitespace-nowrap">
                포인트 명
              </th>
              <th className="px-3 py-2.5 whitespace-nowrap">주력 어종</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">
                출조 횟수
              </th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">
                평균 조과
              </th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">
                평균 사이즈
              </th>
              <th className="rounded-tr-lg px-3 py-2.5 text-right whitespace-nowrap">
                성공률
              </th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr
                className="border-b border-[color:var(--line-muted)] transition hover:bg-[color:var(--surface-muted)]/50"
                key={location.name}
              >
                <td className="px-3 py-2.5 font-bold text-[color:var(--fg)] whitespace-nowrap">
                  {location.name}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className="rounded border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--fg-dim)]">
                    {location.species}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center text-[color:var(--fg-dim)] whitespace-nowrap">
                  {location.trips}회
                </td>
                <td className="px-3 py-2.5 text-center font-bold text-[color:var(--fg)] whitespace-nowrap">
                  {location.averageCatch}마리
                </td>
                <td className="px-3 py-2.5 text-center text-[color:var(--fg-dim)] whitespace-nowrap">
                  {location.averageSize}
                </td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap">
                  <span className="rounded bg-[color:var(--brand-surface)] px-1.5 py-0.5 font-bold text-[color:var(--brand-fg)]">
                    {location.successRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function RecentLogsCard({ activeMode, recentLogs }: RecentLogsCardProps) {
  const isSea = activeMode === "sea";

  return (
    <Card className="flex w-full flex-col border-none p-4 shadow-sm hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-[color:var(--fg)]">
            최근 조과 기록
          </h3>
          <span className="rounded-full bg-[color:var(--surface-muted)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--fg-faint)]">
            Recent Logs
          </span>
        </div>
        <Link
          className="text-xs font-medium text-[color:var(--brand-fg)] underline decoration-2 underline-offset-2 transition-colors hover:text-[color:var(--brand-fg-strong)]"
          href={getModeAwareHref("/logs", activeMode)}
        >
          전체보기
        </Link>
      </div>

      <div className="-mx-4 overflow-x-auto px-4">
        <table className="min-w-[520px] w-full text-left text-xs">
          <thead className="border-b border-[color:var(--line-muted)] bg-[color:var(--surface-muted)]/50 text-[10px] uppercase text-[color:var(--fg-faint)]">
            <tr>
              <th className="px-3 py-2.5 whitespace-nowrap">날짜</th>
              <th className="px-3 py-2.5 whitespace-nowrap">대상어종</th>
              <th className="px-3 py-2.5 whitespace-nowrap">마릿수</th>
              <th className="px-3 py-2.5 whitespace-nowrap">
                {isSea ? "물때/날씨" : "날씨"}
              </th>
              <th className="px-3 py-2.5 whitespace-nowrap">장소</th>
              <th className="px-3 py-2.5 text-right whitespace-nowrap">관리</th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((log) => (
              <tr
                className="border-b border-[color:var(--line-muted)] transition hover:bg-[color:var(--surface-muted)]/50"
                key={log.id}
              >
                <td className="px-3 py-3 font-medium text-[color:var(--fg)] whitespace-nowrap">
                  {log.date}
                </td>
                <td className="px-3 py-3 text-[color:var(--fg)] whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--fg-muted)]" />
                    {log.species}
                  </div>
                </td>
                <td className="px-3 py-3 font-bold text-[color:var(--fg)] whitespace-nowrap">
                  {log.count > 0 ? (
                    `${log.count}마리`
                  ) : (
                    <span className="font-medium text-[color:var(--fg-muted)]">
                      꽝
                    </span>
                  )}
                </td>
                {isSea ? (
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-[color:var(--surface-muted)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--fg-dim)]">
                        {log.tide}
                      </span>
                      <span className="text-[10px] text-[color:var(--fg-muted)]">
                        {log.weather}
                      </span>
                    </div>
                  </td>
                ) : (
                  <td className="px-3 py-3 text-[10px] text-[color:var(--fg-faint)] whitespace-nowrap">
                    {log.weather}
                  </td>
                )}
                <td className="px-3 py-3 text-[color:var(--fg-dim)] whitespace-nowrap">
                  {log.location}
                </td>
                <td className="px-3 py-3 text-right">
                  <button
                    className="text-[color:var(--fg-muted)] transition-colors hover:text-[color:var(--fg-dim)]"
                    type="button"
                  >
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

interface MetricIconProps {
  className?: string;
  name: DashboardIconName;
}

function MetricIcon({ name, ...props }: MetricIconProps) {
  switch (name) {
    case "catch":
      return <FishIcon {...props} />;
    case "point":
      return <MapPinIcon {...props} />;
    case "species":
      return <FishIcon {...props} />;
    case "tide":
      return <WavesIcon {...props} />;
    case "trip":
      return <HouseIcon {...props} />;
    default:
      return null;
  }
}
