import { ArrowUpRightIcon } from "@/components/icons/arrowUpRight/arrowUpRight";
import { FishIcon } from "@/components/icons/fish/fish";
import { HouseIcon } from "@/components/icons/house/house";
import { MapPinIcon } from "@/components/icons/mapPin/mapPin";
import { WavesIcon } from "@/components/icons/waves/waves";
import { Card } from "@/components/ui/card";
import type { DashboardMetric } from "@/lib/mock/dashboardData";

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const hasPositiveChange = metric.change?.includes("+");

  return (
    <Card className="flex h-full flex-col justify-between border-none p-4 shadow-sm hover:shadow-md">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <p className="truncate text-xs font-medium text-[color:var(--fg-faint)]">
          {metric.label}
        </p>
        <div className="ml-2 shrink-0 rounded-lg bg-[color:var(--brand-surface)] p-1.5">
          <MetricIcon
            className="h-4 w-4 text-[color:var(--brand-fg)]"
            name={metric.icon}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold tracking-tight text-[color:var(--fg)]">
          {metric.value}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] font-medium">
          {metric.change ? (
            hasPositiveChange ? (
              <span className="flex items-center rounded bg-[color:var(--brand-surface)] px-1.5 py-0.5 text-[color:var(--brand-fg)]">
                <ArrowUpRightIcon className="mr-0.5 h-3 w-3" />
                {metric.change}
              </span>
            ) : (
              <span className="text-[color:var(--fg-muted)]">
                {metric.change}
              </span>
            )
          ) : null}

          {metric.subtext ? (
            <span className="hidden text-[color:var(--fg-muted)] sm:inline">
              · {metric.subtext}
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

interface MetricIconProps {
  className?: string;
  name: DashboardMetric["icon"];
}

function MetricIcon({ name, ...props }: MetricIconProps) {
  switch (name) {
    case "catch":
      return <FishIcon {...props} />;
    case "point":
      return <MapPinIcon {...props} />;
    case "species":
      return <FishIcon {...props} />;
    case "tide":
      return <WavesIcon {...props} />;
    case "trip":
      return <HouseIcon {...props} />;
    default:
      return null;
  }
}
