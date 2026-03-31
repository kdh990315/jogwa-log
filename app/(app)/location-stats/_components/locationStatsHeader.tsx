import Link from "next/link";

import { FishingModeToggle } from "@/components/fishingModeToggle";
import { ArrowLeftIcon } from "@/components/icons/arrowLeft/arrowLeft";
import { MapPinIcon } from "@/components/icons/mapPin/mapPin";
import { getModeAwareHref } from "@/lib/fishingMode";
import type { FishingMode } from "@/lib/mock/dashboardData";

import type { SortBy } from "./locationStats.types";

interface LocationStatsHeaderProps {
  activeMode: FishingMode;
  locationCount: number;
  onSortChange: (sortBy: SortBy) => void;
  onYearFilterChange: (value: string) => void;
  sortBy: SortBy;
  totalTrips: number;
  yearFilter: string;
}

export function LocationStatsHeader({
  activeMode,
  locationCount,
  onSortChange,
  onYearFilterChange,
  sortBy,
  totalTrips,
  yearFilter,
}: LocationStatsHeaderProps) {
  return (
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
            총 <span className="font-semibold text-brand-fg">{locationCount}개</span>{" "}
            포인트 · <span className="font-semibold text-brand-fg">{totalTrips}회</span>{" "}
            출조 기록
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select
          className="cursor-pointer rounded-lg border border-line bg-surface-card py-1.5 pl-2.5 pr-6 text-xs text-fg-dim outline-none transition-colors hover:bg-surface-muted"
          onChange={(event) => onYearFilterChange(event.target.value)}
          value={yearFilter}
        >
          <option>2024년</option>
          <option>2023년</option>
        </select>
        <div className="flex items-center gap-1 rounded-lg bg-surface-muted p-1">
          <SortButton
            isActive={sortBy === "success"}
            label="성공률순"
            onClick={() => onSortChange("success")}
          />
          <SortButton
            isActive={sortBy === "count"}
            label="출조순"
            onClick={() => onSortChange("count")}
          />
          <SortButton
            isActive={sortBy === "catch"}
            label="조과순"
            onClick={() => onSortChange("catch")}
          />
        </div>
      </div>
    </div>
  );
}

interface SortButtonProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

function SortButton({ isActive, label, onClick }: SortButtonProps) {
  return (
    <button
      className={`rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
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
