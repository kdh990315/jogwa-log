import { FishingModeToggle } from "@/components/fishingModeToggle";
import { RegisterLogDialog } from "@/components/registerLog/registerLogDialog";
import type { FishingMode } from "@/lib/mock/dashboardData";

interface DashboardHeaderProps {
  activeMode: FishingMode;
}

export function DashboardHeader({ activeMode }: DashboardHeaderProps) {
  return (
    <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[color:var(--fg)]">
            대시보드
          </h1>
        </div>
        <FishingModeToggle activeMode={activeMode} pathname="/dashboard" />
      </div>

      <RegisterLogDialog triggerClassName="w-full sm:w-auto" />
    </section>
  );
}
