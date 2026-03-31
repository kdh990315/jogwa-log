import type { FishingMode } from "@/lib/mock/dashboardData";
import type { LocationStatsData } from "@/lib/mock/locationStatsData";

export interface LocationStatsViewProps {
  activeMode: FishingMode;
  data: LocationStatsData;
}

export type SortBy = "catch" | "count" | "success";
