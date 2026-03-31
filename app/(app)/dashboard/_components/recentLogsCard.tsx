import Link from "next/link";

import { MoreHorizontalIcon } from "@/components/icons/moreHorizontal/moreHorizontal";
import { Card } from "@/components/ui/card";
import { getModeAwareHref } from "@/lib/fishingMode";
import type { FishingMode, RecentLogEntry } from "@/lib/mock/dashboardData";

interface RecentLogsCardProps {
  activeMode: FishingMode;
  recentLogs: RecentLogEntry[];
}

export function RecentLogsCard({
  activeMode,
  recentLogs,
}: RecentLogsCardProps) {
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
