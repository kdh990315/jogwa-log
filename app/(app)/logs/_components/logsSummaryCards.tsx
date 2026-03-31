import { CloudSunIcon } from "@/components/icons/cloudSun/cloudSun";
import { FishIcon } from "@/components/icons/fish/fish";
import { MapPinIcon } from "@/components/icons/mapPin/mapPin";
import { WavesIcon } from "@/components/icons/waves/waves";
import { Card } from "@/components/ui/card";
import type { LogEntry } from "@/lib/mock/logsData";

interface LogsSummaryCardsProps {
  logs: LogEntry[];
}

export function LogsSummaryCards({ logs }: LogsSummaryCardsProps) {
  const successfulTrips = logs.filter((log) => log.count > 0).length;
  const bestLog = logs.reduce(
    (best, log) => (log.count > best.count ? log : best),
    logs[0],
  );

  const items = [
    {
      bg: "bg-brand-surface",
      color: "text-brand-fg",
      icon: <FishIcon className="h-4 w-4" />,
      label: "전체 출조",
      sub: "누적 출조 횟수",
      value: `${logs.length}회`,
    },
    {
      bg: "bg-brand-surface",
      color: "text-brand-fg",
      icon: <WavesIcon className="h-4 w-4" />,
      label: "총 조과",
      sub: "전체 기간 합산",
      value: `${logs.reduce((sum, log) => sum + log.count, 0)}마리`,
    },
    {
      bg: "bg-brand-surface",
      color: "text-brand-fg",
      icon: <MapPinIcon className="h-4 w-4" />,
      label: "성공 출조",
      sub: `성공률 ${Math.round((successfulTrips / Math.max(logs.length, 1)) * 100)}%`,
      value: `${successfulTrips}회`,
    },
    {
      bg: "bg-brand-surface",
      color: "text-brand-fg",
      icon: <CloudSunIcon className="h-4 w-4" />,
      label: "최고 조과",
      sub: bestLog?.location ?? "-",
      value: `${Math.max(...logs.map((log) => log.count), 0)}마리`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <Card
          className="border-none p-3.5 shadow-sm transition-shadow hover:shadow-md"
          key={item.label}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-medium text-fg-faint">
                {item.label}
              </p>
              <p className={`mt-0.5 text-xl font-bold ${item.color}`}>
                {item.value}
              </p>
              <p className="mt-0.5 text-[10px] text-fg-muted">{item.sub}</p>
            </div>
            <div className={`shrink-0 rounded-lg p-2 ${item.bg} ${item.color}`}>
              {item.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
