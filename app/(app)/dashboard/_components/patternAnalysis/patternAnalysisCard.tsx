"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import type {
  LocationPerformanceStat,
  SpeciesStat,
  TimePatternStat,
} from "@/lib/mock/dashboardData";

import { LocationPatternSection } from "./locationPatternSection";
import { PatternTabButton } from "./patternTabButton";
import { SpeciesPatternSection } from "./speciesPatternSection";
import { PatternTab } from "./shared";
import { TimePatternSection } from "./timePatternSection";

interface PatternAnalysisCardProps {
  locationInsight: string;
  locations: LocationPerformanceStat[];
  speciesStats: SpeciesStat[];
  timeInsight: string;
  timePatterns: TimePatternStat[];
}

export function PatternAnalysisCard({
  locationInsight,
  locations,
  speciesStats,
  timeInsight,
  timePatterns,
}: PatternAnalysisCardProps) {
  const [activeTab, setActiveTab] = useState<PatternTab>("species");

  return (
    <Card className="flex min-w-0 flex-col border-none p-4 shadow-sm hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-[color:var(--fg)]">
          패턴 분석
        </h3>
        <div className="flex rounded bg-[color:var(--surface-muted)] p-1">
          <PatternTabButton
            activeTab={activeTab}
            label="어종별"
            onClick={() => setActiveTab("species")}
            tab="species"
          />
          <PatternTabButton
            activeTab={activeTab}
            label="시간대별"
            onClick={() => setActiveTab("time")}
            tab="time"
          />
          <PatternTabButton
            activeTab={activeTab}
            label="장소별"
            onClick={() => setActiveTab("location")}
            tab="location"
          />
        </div>
      </div>

      <div className="relative min-h-[200px] min-w-0 flex-1">
        {activeTab === "species" ? (
          <SpeciesPatternSection speciesStats={speciesStats} />
        ) : null}
        {activeTab === "time" ? (
          <TimePatternSection
            timeInsight={timeInsight}
            timePatterns={timePatterns}
          />
        ) : null}
        {activeTab === "location" ? (
          <LocationPatternSection
            locationInsight={locationInsight}
            locations={locations}
          />
        ) : null}
      </div>
    </Card>
  );
}
