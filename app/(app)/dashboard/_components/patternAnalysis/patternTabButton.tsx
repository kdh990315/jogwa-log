import { Clock3Icon } from "@/components/icons/clock3/clock3";
import { FishIcon } from "@/components/icons/fish/fish";
import { MapIcon } from "@/components/icons/map/map";

import type { PatternTab } from "./shared";

interface PatternTabButtonProps {
  activeTab: PatternTab;
  label: string;
  onClick: () => void;
  tab: PatternTab;
}

export function PatternTabButton({
  activeTab,
  label,
  onClick,
  tab,
}: PatternTabButtonProps) {
  const isActive = activeTab === tab;

  return (
    <button
      className={`rounded p-1 transition-all ${
        isActive
          ? "bg-[color:var(--surface-card)] text-[color:var(--brand-fg)] shadow-sm"
          : "text-[color:var(--fg-muted)] hover:text-[color:var(--fg-dim)]"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {tab === "species" ? <FishIcon className="h-3.5 w-3.5" /> : null}
      {tab === "time" ? <Clock3Icon className="h-3.5 w-3.5" /> : null}
      {tab === "location" ? <MapIcon className="h-3.5 w-3.5" /> : null}
    </button>
  );
}
