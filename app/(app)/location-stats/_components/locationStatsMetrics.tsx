import { AnchorIcon } from "@/components/icons/anchor/anchor";
import { FishIcon } from "@/components/icons/fish/fish";
import { MapPinIcon } from "@/components/icons/mapPin/mapPin";
import { TrophyIcon } from "@/components/icons/trophy/trophy";
import { Card } from "@/components/ui/card";
import type { LocationStatDetail } from "@/lib/mock/locationStatsData";

import { formatRankingName } from "./locationStats.helpers";

interface LocationStatsMetricsProps {
  bestLocation: LocationStatDetail;
  locationCount: number;
  totalCatch: number;
  totalTrips: number;
}

export function LocationStatsMetrics({
  bestLocation,
  locationCount,
  totalCatch,
  totalTrips,
}: LocationStatsMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard
        backgroundClassName="bg-slate-100 dark:bg-slate-800"
        icon={<MapPinIcon className="h-4 w-4" />}
        label="방문 포인트"
        subLabel="등록된 낚시 포인트"
        textClassName="text-slate-600 dark:text-slate-400"
        value={`${locationCount}곳`}
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
  );
}

interface MetricCardProps {
  backgroundClassName: string;
  icon: React.ReactNode;
  label: string;
  subLabel: string;
  textClassName: string;
  value: string;
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
    <Card className="border-none p-3.5 shadow-sm transition-shadow hover:shadow-md">
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
