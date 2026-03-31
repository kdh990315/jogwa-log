"use client";

import { useMemo, useState } from "react";

import type { FishingMode } from "@/lib/mock/dashboardData";
import type { LogEntry } from "@/lib/mock/logsData";

import { ALL_OPTION } from "./logs.constants";
import {
  filterAndSortLogs,
  getMethodList,
  getSpeciesColors,
  getSpeciesList,
  type SortDirection,
  type SortKey,
} from "./logs.helpers";
import { LogsFilters } from "./logsFilters";
import { LogsHeader } from "./logsHeader";
import { LogsSummaryCards } from "./logsSummaryCards";
import { LogsTable } from "./logsTable";

interface LogsViewProps {
  activeMode: FishingMode;
  logs: LogEntry[];
}

export function LogsView({ activeMode, logs }: LogsViewProps) {
  const [search, setSearch] = useState("");
  const [filterSpecies, setFilterSpecies] = useState(ALL_OPTION);
  const [filterMethod, setFilterMethod] = useState(ALL_OPTION);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const speciesList = useMemo(() => getSpeciesList(logs), [logs]);
  const methodList = getMethodList(activeMode);
  const speciesColors = getSpeciesColors(activeMode);

  const filteredLogs = useMemo(
    () =>
      filterAndSortLogs({
        filterMethod,
        filterSpecies,
        logs,
        search,
        sortDir,
        sortKey,
      }),
    [filterMethod, filterSpecies, logs, search, sortDir, sortKey],
  );

  const totalCatch = filteredLogs.reduce((sum, log) => sum + log.count, 0);
  const bestDay = filteredLogs.reduce<LogEntry | undefined>(
    (best, log) => (log.count > (best?.count ?? 0) ? log : best),
    filteredLogs[0],
  );
  const hasActiveFilters =
    search.length > 0 ||
    filterSpecies !== ALL_OPTION ||
    filterMethod !== ALL_OPTION;

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((currentDirection) =>
        currentDirection === "asc" ? "desc" : "asc",
      );
      return;
    }

    setSortKey(key);
    setSortDir("desc");
  }

  function resetFilters() {
    setSearch("");
    setFilterSpecies(ALL_OPTION);
    setFilterMethod(ALL_OPTION);
  }

  return (
    <div className="space-y-4">
      <LogsHeader activeMode={activeMode} logsCount={logs.length} />
      <LogsSummaryCards logs={logs} />
      <LogsFilters
        filterMethod={filterMethod}
        filterSpecies={filterSpecies}
        filteredCount={filteredLogs.length}
        hasActiveFilters={hasActiveFilters}
        methodList={methodList}
        onFilterMethodChange={setFilterMethod}
        onFilterSpeciesChange={setFilterSpecies}
        onReset={resetFilters}
        onSearchChange={setSearch}
        search={search}
        speciesList={speciesList}
      />
      <LogsTable
        activeMode={activeMode}
        bestDay={bestDay}
        filteredLogs={filteredLogs}
        onToggleSort={toggleSort}
        sortDir={sortDir}
        sortKey={sortKey}
        speciesColors={speciesColors}
        totalCatch={totalCatch}
      />
    </div>
  );
}
