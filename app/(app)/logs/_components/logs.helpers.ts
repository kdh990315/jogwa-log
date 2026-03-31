import type { FishingMode } from "@/lib/mock/dashboardData";
import type { LogEntry } from "@/lib/mock/logsData";

import {
  ALL_OPTION,
  FRESHWATER_SPECIES_COLORS,
  SEA_SPECIES_COLORS,
} from "./logs.constants";

export type SortKey = "date" | "count" | "size";
export type SortDirection = "asc" | "desc";

interface FilterAndSortLogsParams {
  filterMethod: string;
  filterSpecies: string;
  logs: LogEntry[];
  search: string;
  sortDir: SortDirection;
  sortKey: SortKey;
}

export function getSpeciesList(logs: LogEntry[]) {
  return [ALL_OPTION, ...Array.from(new Set(logs.map((log) => log.species)))];
}

export function getMethodList(activeMode: FishingMode) {
  return activeMode === "sea"
    ? [ALL_OPTION, "루어", "생미끼", "에깅"]
    : [ALL_OPTION, "루어", "떡밥", "찌낚시"];
}

export function getSpeciesColors(activeMode: FishingMode) {
  return activeMode === "sea"
    ? SEA_SPECIES_COLORS
    : FRESHWATER_SPECIES_COLORS;
}

export function filterAndSortLogs({
  filterMethod,
  filterSpecies,
  logs,
  search,
  sortDir,
  sortKey,
}: FilterAndSortLogsParams) {
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
}
