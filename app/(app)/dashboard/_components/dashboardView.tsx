import type {
  DashboardData,
  FishingMode,
} from "@/lib/mock/dashboardData";

import { CalendarCard } from "./calendarCard";
import { DashboardHeader } from "./dashboardHeader";
import { LocationStatsPreviewCard } from "./locationStatsPreviewCard";
import { MetricCard } from "./metricCard";
import { MonthlyTrendCard } from "./patternAnalysis/monthlyTrendCard";
import { PatternAnalysisCard } from "./patternAnalysis/patternAnalysisCard";
import { TideAnalysisCard } from "./patternAnalysis/tideAnalysisCard";
import { RecentLogsCard } from "./recentLogsCard";

interface DashboardViewProps {
  activeMode: FishingMode;
  data: DashboardData;
}

export function DashboardView({ activeMode, data }: DashboardViewProps) {
  return (
    <div className="min-w-0 space-y-4">
      <DashboardHeader activeMode={activeMode} />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
        <MonthlyTrendCard monthlyCatch={data.monthlyCatch} />
        <PatternAnalysisCard
          locationInsight={data.locationInsight}
          locations={data.locations}
          speciesStats={data.speciesStats}
          timeInsight={data.timeInsight}
          timePatterns={data.timePatterns}
        />
      </section>

      {data.tideStats ? (
        <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <TideAnalysisCard
            insight={data.tideInsight ?? ""}
            tideStats={data.tideStats}
          />
          <CalendarCard calendarEntries={data.calendarEntries} />
        </section>
      ) : (
        <section>
          <CalendarCard calendarEntries={data.calendarEntries} />
        </section>
      )}

      <LocationStatsPreviewCard
        activeMode={activeMode}
        locations={data.locations}
      />

      <RecentLogsCard activeMode={activeMode} recentLogs={data.recentLogs} />
    </div>
  );
}
