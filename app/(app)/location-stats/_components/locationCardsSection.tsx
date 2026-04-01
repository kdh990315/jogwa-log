"use client";

import { useState } from "react";

import type { LocationStatDetail } from "@/lib/mock/locationStatsData";

import { LocationCard } from "./locationCard";

interface LocationCardsSectionProps {
  locations: LocationStatDetail[];
  rankById: Map<string, number>;
}

export function LocationCardsSection({
  locations,
  rankById,
}: LocationCardsSectionProps) {
  const [expandedLocationId, setExpandedLocationId] = useState<string | null>(
    null,
  );

  return (
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
        {locations.map((location) => (
          <LocationCard
            expanded={expandedLocationId === location.id}
            key={location.id}
            location={location}
            onToggle={() =>
              setExpandedLocationId((currentLocationId) =>
                currentLocationId === location.id ? null : location.id,
              )
            }
            rank={rankById.get(location.id) ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
