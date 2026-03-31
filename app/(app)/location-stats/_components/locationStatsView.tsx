"use client";

import { useMemo, useState } from "react";

import type { LocationStatDetail } from "@/lib/mock/locationStatsData";

import { ComparisonChartCard } from "./comparisonChartCard";
import { LocationCardsSection } from "./locationCardsSection";
import { LocationStatsHeader } from "./locationStatsHeader";
import { LocationStatsMetrics } from "./locationStatsMetrics";
import { RankingCard } from "./rankingCard";
import type { LocationStatsViewProps, SortBy } from "./locationStats.types";

export function LocationStatsView({
  activeMode,
  data,
}: LocationStatsViewProps) {
  const [sortBy, setSortBy] = useState<SortBy>("success");
  const [yearFilter, setYearFilter] = useState("2024년");

  const locationDetails = data.locations;

  const rankedBySuccess = useMemo(
    () =>
      [...locationDetails].sort(
        (left, right) => right.successRate - left.successRate,
      ),
    [locationDetails],
  );

  const sortedLocations = useMemo(
    () => [...locationDetails].sort((left, right) => sortLocations(left, right, sortBy)),
    [locationDetails, sortBy],
  );

  const rankById = useMemo(
    () =>
      new Map(
        rankedBySuccess.map((location, index) => [location.id, index + 1]),
      ),
    [rankedBySuccess],
  );

  const totalTrips = locationDetails.reduce(
    (sum, location) => sum + location.totalTrips,
    0,
  );
  const totalCatch = locationDetails.reduce(
    (sum, location) => sum + location.totalCatch,
    0,
  );
  const bestLocation = rankedBySuccess[0];

  if (!bestLocation) {
    return null;
  }

  return (
    <div className="space-y-4">
      <LocationStatsHeader
        activeMode={activeMode}
        locationCount={locationDetails.length}
        onSortChange={setSortBy}
        onYearFilterChange={setYearFilter}
        sortBy={sortBy}
        totalTrips={totalTrips}
        yearFilter={yearFilter}
      />

      <LocationStatsMetrics
        bestLocation={bestLocation}
        locationCount={locationDetails.length}
        totalCatch={totalCatch}
        totalTrips={totalTrips}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ComparisonChartCard locations={locationDetails} />
        <RankingCard bestLocation={bestLocation} locations={locationDetails} />
      </div>

      <LocationCardsSection locations={sortedLocations} rankById={rankById} />
    </div>
  );
}

function sortLocations(
  left: LocationStatDetail,
  right: LocationStatDetail,
  sortBy: SortBy,
) {
  if (sortBy === "success") {
    return right.successRate - left.successRate;
  }

  if (sortBy === "count") {
    return right.totalTrips - left.totalTrips;
  }

  return right.totalCatch - left.totalCatch;
}
