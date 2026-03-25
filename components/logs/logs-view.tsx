"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ArrowLeftIcon } from "../icons/arrow-left/arrow-left";
import { ChevronDownIcon } from "../icons/chevron-down/chevron-down";
import { ChevronUpIcon } from "../icons/chevron-up/chevron-up";
import { ChevronsUpDownIcon } from "../icons/chevrons-up-down/chevrons-up-down";
import { CloudIcon } from "../icons/cloud/cloud";
import { CloudRainIcon } from "../icons/cloud-rain/cloud-rain";
import { CloudSunIcon } from "../icons/cloud-sun/cloud-sun";
import { FishIcon } from "../icons/fish/fish";
import { MapPinIcon } from "../icons/map-pin/map-pin";
import { MoreHorizontalIcon } from "../icons/more-horizontal/more-horizontal";
import { SearchIcon } from "../icons/search/search";
import { WavesIcon } from "../icons/waves/waves";
import { FishingModeToggle } from "../fishing-mode-toggle";
import { RegisterLogDialog } from "../register-log/register-log-dialog";
import { Card } from "../ui/card";
import { getModeAwareHref } from "../../lib/fishing-mode";
import type { FishingMode } from "../../lib/mock/dashboard-data";
import type { LogEntry } from "../../lib/mock/logs-data";
import { formatShortMonthDay } from "../../utils/format/date";

interface LogsViewProps {
  activeMode: FishingMode;
  logs: LogEntry[];
}

type SortKey = "date" | "count" | "size";
type SortDirection = "asc" | "desc";

const ALL_OPTION = "전체";

const SEA_SPECIES_COLORS: Record<string, string> = {
  광어: "bg-surface-muted text-fg-dim border-line",
  우럭: "bg-surface-muted text-fg-dim border-line",
  갑오징어: "bg-surface-muted text-fg-dim border-line",
  노래미: "bg-surface-muted text-fg-dim border-line",
  농어: "bg-surface-muted text-fg-dim border-line",
};

const FRESHWATER_SPECIES_COLORS: Record<string, string> = {
  배스: "bg-surface-muted text-fg-dim border-line",
  붕어: "bg-surface-muted text-fg-dim border-line",
  쏘가리: "bg-surface-muted text-fg-dim border-line",
  잉어: "bg-surface-muted text-fg-dim border-line",
};

const METHOD_COLORS: Record<string, string> = {
  루어: "text-fg-dim",
  생미끼: "text-fg-faint",
  에깅: "text-fg-dim",
  떡밥: "text-fg-faint",
  찌낚시: "text-fg-dim",
};

export function LogsView({ activeMode, logs }: LogsViewProps) {
  const [search, setSearch] = useState("");
  const [filterSpecies, setFilterSpecies] = useState(ALL_OPTION);
  const [filterMethod, setFilterMethod] = useState(ALL_OPTION);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const speciesList = useMemo(
    () => [ALL_OPTION, ...Array.from(new Set(logs.map((log) => log.species)))],
    [logs],
  );
  const methodList =
    activeMode === "sea"
      ? [ALL_OPTION, "루어", "생미끼", "에깅"]
      : [ALL_OPTION, "루어", "떡밥", "찌낚시"];

  const speciesColors =
    activeMode === "sea" ? SEA_SPECIES_COLORS : FRESHWATER_SPECIES_COLORS;

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          log.species.includes(query) ||
          log.location.includes(query) ||
          log.weather.includes(query);
        const matchesSpecies =
          filterSpecies === ALL_OPTION || log.species === filterSpecies;
        const matchesMethod =
          filterMethod === ALL_OPTION || log.method === filterMethod;

        return matchesSearch && matchesSpecies && matchesMethod;
      })
      .sort((left, right) => {
        let diff = 0;

        if (sortKey === "date") {
          diff =
            new Date(left.occurredOn).getTime() -
            new Date(right.occurredOn).getTime();
        }

        if (sortKey === "count") {
          diff = left.count - right.count;
        }

        if (sortKey === "size") {
          diff = left.size - right.size;
        }

        return sortDir === "asc" ? diff : -diff;
      });
  }, [filterMethod, filterSpecies, logs, search, sortDir, sortKey]);

  const totalCatch = filteredLogs.reduce((sum, log) => sum + log.count, 0);
  const successfulTrips = logs.filter((log) => log.count > 0).length;
  const bestDay = filteredLogs.reduce<LogEntry | undefined>(
    (best, log) => (log.count > (best?.count ?? 0) ? log : best),
    filteredLogs[0],
  );
  const accentColor = "text-brand-fg";

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((currentDirection) =>
        currentDirection === "asc" ? "desc" : "asc",
      );
      return;
    }

    setSortKey(key);
    setSortDir("desc");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link
            className="group flex items-center gap-1.5 text-sm font-medium text-fg-faint transition-colors hover:text-brand-fg"
            href={getModeAwareHref("/dashboard", activeMode)}
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            대시보드
          </Link>
          <div className="h-4 w-px bg-line" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-fg">
                <FishIcon className="h-5 w-5 text-brand-fg" />
                조과 기록
              </h1>
              <FishingModeToggle activeMode={activeMode} pathname="/logs" />
            </div>
            <p className="mt-0.5 text-xs text-fg-faint">
              총 <span className={`font-semibold ${accentColor}`}>{logs.length}건</span>의{" "}
              {activeMode === "sea" ? "바다" : "민물"} 출조 기록
            </p>
          </div>
        </div>

        <RegisterLogDialog
          triggerClassName="w-full sm:w-auto"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            bg: "bg-brand-surface",
            color: "text-brand-fg",
            icon: <FishIcon className="h-4 w-4" />,
            label: "전체 출조",
            sub: "누적 출조 횟수",
            value: `${logs.length}회`,
          },
          {
            bg: "bg-brand-surface",
            color: "text-brand-fg",
            icon: <WavesIcon className="h-4 w-4" />,
            label: "총 조과",
            sub: "전체 기간 합산",
            value: `${logs.reduce((sum, log) => sum + log.count, 0)}마리`,
          },
          {
            bg: "bg-brand-surface",
            color: "text-brand-fg",
            icon: <MapPinIcon className="h-4 w-4" />,
            label: "성공 출조",
            sub: `성공률 ${Math.round((successfulTrips / Math.max(logs.length, 1)) * 100)}%`,
            value: `${successfulTrips}회`,
          },
          {
            bg: "bg-brand-surface",
            color: "text-brand-fg",
            icon: <CloudSunIcon className="h-4 w-4" />,
            label: "최고 조과",
            sub:
              logs.reduce((best, log) => (log.count > best.count ? log : best), logs[0])?.location ??
              "-",
            value: `${Math.max(...logs.map((log) => log.count), 0)}마리`,
          },
        ].map((item) => (
          <Card
            className="border-none p-3.5 shadow-sm transition-shadow hover:shadow-md"
            key={item.label}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-medium text-fg-faint">{item.label}</p>
                <p className={`mt-0.5 text-xl font-bold ${item.color}`}>{item.value}</p>
                <p className="mt-0.5 text-[10px] text-fg-muted">{item.sub}</p>
              </div>
              <div className={`shrink-0 rounded-lg p-2 ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-none p-3 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted" />
            <input
              className="w-full rounded-lg border border-line bg-surface-muted py-1.5 pl-8 pr-3 text-xs text-fg outline-none focus:ring-1 focus:ring-brand-fg"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="어종, 장소 검색..."
              value={search}
            />
          </div>
          <select
            className="cursor-pointer rounded-lg border border-line bg-surface-muted py-1.5 pl-2.5 pr-6 text-xs text-fg-dim outline-none"
            onChange={(event) => setFilterSpecies(event.target.value)}
            value={filterSpecies}
          >
            {speciesList.map((species) => (
              <option key={species}>{species}</option>
            ))}
          </select>
          <select
            className="cursor-pointer rounded-lg border border-line bg-surface-muted py-1.5 pl-2.5 pr-6 text-xs text-fg-dim outline-none"
            onChange={(event) => setFilterMethod(event.target.value)}
            value={filterMethod}
          >
            {methodList.map((method) => (
              <option key={method}>{method}</option>
            ))}
          </select>
        </div>

        {(search || filterSpecies !== ALL_OPTION || filterMethod !== ALL_OPTION) ? (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[10px] text-fg-faint">
              <span className={`font-semibold ${accentColor}`}>{filteredLogs.length}건</span>{" "}
              검색됨
            </p>
            <button
              className="text-[10px] text-fg-muted transition-colors hover:text-fg"
              onClick={() => {
                setSearch("");
                setFilterSpecies(ALL_OPTION);
                setFilterMethod(ALL_OPTION);
              }}
              type="button"
            >
              초기화
            </button>
          </div>
        ) : null}
      </Card>

      <Card className="overflow-hidden border-none p-0 shadow-sm hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead className="border-b border-line bg-surface-muted text-[10px] text-fg-faint uppercase">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium">
                  <button
                    className="flex items-center gap-0.5 hover:text-fg"
                    onClick={() => toggleSort("date")}
                    type="button"
                  >
                    날짜 <SortIcon activeColumn={sortKey} column="date" direction={sortDir} />
                  </button>
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">어종</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">
                  <button
                    className="flex items-center gap-0.5 hover:text-fg"
                    onClick={() => toggleSort("count")}
                    type="button"
                  >
                    마릿수 <SortIcon activeColumn={sortKey} column="count" direction={sortDir} />
                  </button>
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">
                  <button
                    className="flex items-center gap-0.5 hover:text-fg"
                    onClick={() => toggleSort("size")}
                    type="button"
                  >
                    씨즈 <SortIcon activeColumn={sortKey} column="size" direction={sortDir} />
                  </button>
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">채비</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">
                  {activeMode === "sea" ? "물때 / 날씨" : "날씨"}
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">장소</th>
                <th className="whitespace-nowrap px-4 py-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td className="px-4 py-12 text-center text-fg-muted" colSpan={8}>
                    <FishIcon className="mx-auto mb-2 h-8 w-8 opacity-30" />
                    <p className="text-sm">검색 결과가 없습니다</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    className="border-b border-line-muted transition-colors hover:bg-surface-muted/50"
                    key={`${log.occurredOn}-${log.location}`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-fg">
                      {formatShortMonthDay(log.occurredOn)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${speciesColors[log.species] ?? ""}`}
                      >
                        {log.species}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {log.count === 0 ? (
                        <span className="font-medium text-fg-muted">꽝</span>
                      ) : (
                        <span className="font-bold text-fg">{log.count}마리</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-fg-dim">
                      {log.size ? `${log.size}cm` : "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`font-medium ${METHOD_COLORS[log.method] ?? "text-slate-500"}`}
                      >
                        {log.method}
                      </span>
                    </td>
                    {activeMode === "sea" ? (
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md border border-line bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-fg-dim">
                            {log.tide}
                          </span>
                          <span className="flex items-center gap-1 text-fg-muted">
                            <WeatherIcon weather={log.weather} />
                            <span className="text-[10px]">{log.weather}</span>
                          </span>
                        </div>
                      </td>
                    ) : (
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="flex items-center gap-1 text-fg-faint">
                          <WeatherIcon weather={log.weather} />
                          <span className="text-[10px]">{log.weather}</span>
                        </span>
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-3 text-fg-dim">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3 shrink-0 text-fg-muted" />
                        {log.location}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="text-fg-muted transition-colors hover:text-fg-dim"
                        type="button"
                      >
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredLogs.length > 0 ? (
          <div className="flex items-center justify-between border-t border-line bg-surface-muted/30 px-4 py-3">
            <p className="text-[10px] text-fg-muted">
              총 <span className="font-semibold text-fg-dim">{filteredLogs.length}건</span> · 합계{" "}
              <span className={`font-semibold ${accentColor}`}>{totalCatch}마리</span>
            </p>
            {bestDay ? (
              <p className="hidden text-[10px] text-fg-muted sm:block">
                최고 기록:{" "}
                <span className="font-semibold text-fg-dim">
                  {formatShortMonthDay(bestDay.occurredOn)} · {bestDay.count}마리 ({bestDay.species})
                </span>
              </p>
            ) : null}
          </div>
        ) : null}
      </Card>
    </div>
  );
}

interface SortIconProps {
  activeColumn: SortKey;
  column: SortKey;
  direction: SortDirection;
}

function SortIcon({ activeColumn, column, direction }: SortIconProps) {
  if (activeColumn !== column) {
    return <ChevronsUpDownIcon className="ml-0.5 inline h-3 w-3 text-fg-muted" />;
  }

  return direction === "desc" ? (
    <ChevronDownIcon className="ml-0.5 inline h-3 w-3 text-brand-fg" />
  ) : (
    <ChevronUpIcon className="ml-0.5 inline h-3 w-3 text-brand-fg" />
  );
}

interface WeatherIconProps {
  weather: LogEntry["weather"];
}

function WeatherIcon({ weather }: WeatherIconProps) {
  const className = "h-3.5 w-3.5";

  if (weather === "맑음") {
    return <CloudSunIcon className={`${className} text-amber-400`} />;
  }

  if (weather === "흐림") {
    return <CloudIcon className={`${className} text-fg-muted`} />;
  }

  if (weather === "비") {
    return <CloudRainIcon className={`${className} text-blue-400`} />;
  }

  return <CloudSunIcon className={`${className} text-slate-400`} />;
}
