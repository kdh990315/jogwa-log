import { CloudIcon } from "@/components/icons/cloud/cloud";
import { CloudRainIcon } from "@/components/icons/cloudRain/cloudRain";
import { CloudSunIcon } from "@/components/icons/cloudSun/cloudSun";
import { MapPinIcon } from "@/components/icons/mapPin/mapPin";
import { MoreHorizontalIcon } from "@/components/icons/moreHorizontal/moreHorizontal";
import type { FishingMode } from "@/lib/mock/dashboardData";
import type { LogEntry } from "@/lib/mock/logsData";
import { formatShortMonthDay } from "@/utils/format/date";

import { METHOD_COLORS } from "./logs.constants";

interface LogsTableRowProps {
  activeMode: FishingMode;
  log: LogEntry;
  speciesColors: Record<string, string>;
}

export function LogsTableRow({
  activeMode,
  log,
  speciesColors,
}: LogsTableRowProps) {
  return (
    <tr className="border-b border-line-muted transition-colors hover:bg-surface-muted/50">
      <td className="whitespace-nowrap px-4 py-3 font-medium text-fg">
        {formatShortMonthDay(log.occurredOn)}
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <span
          className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${
            speciesColors[log.species] ?? ""
          }`}
        >
          {log.species}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        {log.count === 0 ? (
          <span className="font-medium text-fg-muted">꽝</span>
        ) : (
          <span className="font-bold text-fg">{log.count}마리</span>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-fg-dim">
        {log.size ? `${log.size}cm` : "-"}
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <span
          className={`font-medium ${METHOD_COLORS[log.method] ?? "text-slate-500"}`}
        >
          {log.method}
        </span>
      </td>
      {activeMode === "sea" ? (
        <td className="whitespace-nowrap px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-line bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-fg-dim">
              {log.tide}
            </span>
            <span className="flex items-center gap-1 text-fg-muted">
              <WeatherIcon weather={log.weather} />
              <span className="text-[10px]">{log.weather}</span>
            </span>
          </div>
        </td>
      ) : (
        <td className="whitespace-nowrap px-4 py-3">
          <span className="flex items-center gap-1 text-fg-faint">
            <WeatherIcon weather={log.weather} />
            <span className="text-[10px]">{log.weather}</span>
          </span>
        </td>
      )}
      <td className="whitespace-nowrap px-4 py-3 text-fg-dim">
        <div className="flex items-center gap-1">
          <MapPinIcon className="h-3 w-3 shrink-0 text-fg-muted" />
          {log.location}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          className="text-fg-muted transition-colors hover:text-fg-dim"
          type="button"
        >
          <MoreHorizontalIcon className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

function WeatherIcon({ weather }: Pick<LogEntry, "weather">) {
  const className = "h-3.5 w-3.5";

  if (weather === "맑음") {
    return <CloudSunIcon className={`${className} text-amber-400`} />;
  }

  if (weather === "흐림") {
    return <CloudIcon className={`${className} text-fg-muted`} />;
  }

  if (weather === "비") {
    return <CloudRainIcon className={`${className} text-blue-400`} />;
  }

  return <CloudSunIcon className={`${className} text-slate-400`} />;
}
