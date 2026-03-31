import { StarIcon } from "@/components/icons/star/star";
import { TrendingUpIcon } from "@/components/icons/trendingUp/trendingUp";
import { Card } from "@/components/ui/card";
import type { LocationStatDetail } from "@/lib/mock/locationStatsData";

import {
  formatRankingName,
  getRankTextClassName,
  getSuccessBarColor,
  getSuccessColor,
} from "./locationStats.helpers";

interface RankingCardProps {
  bestLocation: LocationStatDetail;
  locations: LocationStatDetail[];
}

export function RankingCard({ bestLocation, locations }: RankingCardProps) {
  const rankedLocations = [...locations].sort(
    (left, right) => right.successRate - left.successRate,
  );

  return (
    <Card className="flex flex-col border-none p-4 shadow-sm hover:shadow-md">
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
                <span className={getRankTextClassName(index + 1)}>
                  {index + 1}
                </span>
                <span className="max-w-[100px] truncate text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  {formatRankingName(location.name)}
                </span>
              </div>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${getSuccessColor(
                  location.successRate,
                )}`}
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
