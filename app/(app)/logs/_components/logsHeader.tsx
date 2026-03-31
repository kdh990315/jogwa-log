import Link from "next/link";

import { FishingModeToggle } from "@/components/fishingModeToggle";
import { ArrowLeftIcon } from "@/components/icons/arrowLeft/arrowLeft";
import { FishIcon } from "@/components/icons/fish/fish";
import { RegisterLogDialog } from "@/components/registerLog/registerLogDialog";
import { getModeAwareHref } from "@/lib/fishingMode";
import type { FishingMode } from "@/lib/mock/dashboardData";

interface LogsHeaderProps {
  activeMode: FishingMode;
  logsCount: number;
}

export function LogsHeader({ activeMode, logsCount }: LogsHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <Link
          className="group flex items-center gap-1.5 text-sm font-medium text-fg-faint transition-colors hover:text-brand-fg"
          href={getModeAwareHref("/dashboard", activeMode)}
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          대시보드
        </Link>
        <div className="h-4 w-px bg-line" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-fg">
              <FishIcon className="h-5 w-5 text-brand-fg" />
              조과 기록
            </h1>
            <FishingModeToggle activeMode={activeMode} pathname="/logs" />
          </div>
          <p className="mt-0.5 text-xs text-fg-faint">
            총 <span className="font-semibold text-brand-fg">{logsCount}건</span>
            의 {activeMode === "sea" ? "바다" : "민물"} 출조 기록
          </p>
        </div>
      </div>

      <RegisterLogDialog triggerClassName="w-full sm:w-auto" />
    </div>
  );
}
