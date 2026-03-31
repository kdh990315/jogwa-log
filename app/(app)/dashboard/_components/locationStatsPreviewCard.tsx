import Link from "next/link";

import { Card } from "@/components/ui/card";
import { getModeAwareHref } from "@/lib/fishingMode";
import type {
  FishingMode,
  LocationPerformanceStat,
} from "@/lib/mock/dashboardData";

interface LocationStatsPreviewCardProps {
  activeMode: FishingMode;
  locations: LocationPerformanceStat[];
}

export function LocationStatsPreviewCard({
  activeMode,
  locations,
}: LocationStatsPreviewCardProps) {
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
              <span className="rounded bg-[color:var(--brand-surface)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--brand-fg)]">
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
