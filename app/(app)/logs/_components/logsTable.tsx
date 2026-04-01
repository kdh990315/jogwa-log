import { ChevronDownIcon } from "@/components/icons/chevronDown/chevronDown";
import { ChevronUpIcon } from "@/components/icons/chevronUp/chevronUp";
import { ChevronsUpDownIcon } from "@/components/icons/chevronsUpDown/chevronsUpDown";
import { FishIcon } from "@/components/icons/fish/fish";
import { Card } from "@/components/ui/card";
import type { FishingMode } from "@/lib/mock/dashboardData";
import type { LogEntry } from "@/lib/mock/logsData";
import { formatShortMonthDay } from "@/utils/format/date";

import type { SortDirection, SortKey } from "./logs.helpers";
import { LogsTableRow } from "./logsTableRow";

interface LogsTableProps {
  activeMode: FishingMode;
  bestDay?: LogEntry;
  filteredLogs: LogEntry[];
  onToggleSort: (key: SortKey) => void;
  sortDir: SortDirection;
  sortKey: SortKey;
  speciesColors: Record<string, string>;
  totalCatch: number;
}

export function LogsTable({
  activeMode,
  bestDay,
  filteredLogs,
  onToggleSort,
  sortDir,
  sortKey,
  speciesColors,
  totalCatch,
}: LogsTableProps) {
  return (
    <Card className="overflow-hidden border-none p-0 shadow-sm hover:shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-xs">
          <thead className="border-b border-line bg-surface-muted text-[10px] uppercase text-fg-faint">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 font-medium">
                <button
                  className="flex items-center gap-0.5 hover:text-fg"
                  onClick={() => onToggleSort("date")}
                  type="button"
                >
                  날짜
                  <SortIcon
                    activeColumn={sortKey}
                    column="date"
                    direction={sortDir}
                  />
                </button>
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">어종</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">
                <button
                  className="flex items-center gap-0.5 hover:text-fg"
                  onClick={() => onToggleSort("count")}
                  type="button"
                >
                  마릿수
                  <SortIcon
                    activeColumn={sortKey}
                    column="count"
                    direction={sortDir}
                  />
                </button>
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">
                <button
                  className="flex items-center gap-0.5 hover:text-fg"
                  onClick={() => onToggleSort("size")}
                  type="button"
                >
                  사이즈
                  <SortIcon
                    activeColumn={sortKey}
                    column="size"
                    direction={sortDir}
                  />
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
                <td
                  className="px-4 py-12 text-center text-fg-muted"
                  colSpan={8}
                >
                  <FishIcon className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  <p className="text-sm">검색 결과가 없습니다</p>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <LogsTableRow
                  activeMode={activeMode}
                  key={`${log.occurredOn}-${log.location}`}
                  log={log}
                  speciesColors={speciesColors}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredLogs.length > 0 ? (
        <div className="flex items-center justify-between border-t border-line bg-surface-muted/30 px-4 py-3">
          <p className="text-[10px] text-fg-muted">
            총
            <span className="font-semibold text-fg-dim">
              {filteredLogs.length}건
            </span>
            · 합계
            <span className="font-semibold text-brand-fg">
              {totalCatch}마리
            </span>
          </p>
          {bestDay ? (
            <p className="hidden text-[10px] text-fg-muted sm:block">
              최고 기록:
              <span className="font-semibold text-fg-dim">
                {formatShortMonthDay(bestDay.occurredOn)} · {bestDay.count}마리
                ({bestDay.species})
              </span>
            </p>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

interface SortIconProps {
  activeColumn: SortKey;
  column: SortKey;
  direction: SortDirection;
}

function SortIcon({ activeColumn, column, direction }: SortIconProps) {
  if (activeColumn !== column) {
    return (
      <ChevronsUpDownIcon className="ml-0.5 inline h-3 w-3 text-fg-muted" />
    );
  }

  return direction === "desc" ? (
    <ChevronDownIcon className="ml-0.5 inline h-3 w-3 text-brand-fg" />
  ) : (
    <ChevronUpIcon className="ml-0.5 inline h-3 w-3 text-brand-fg" />
  );
}
