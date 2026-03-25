import Link from "next/link";

import type { FishingMode } from "../lib/mock/dashboard-data";

interface FishingModeToggleProps {
  activeMode: FishingMode;
  pathname: string;
}

export function FishingModeToggle({
  activeMode,
  pathname,
}: FishingModeToggleProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-[color:var(--surface-muted)] p-0.5">
      <ModeLink
        href={`${pathname}?mode=sea`}
        isActive={activeMode === "sea"}
        label="바다"
      />
      <ModeLink
        href={`${pathname}?mode=freshwater`}
        isActive={activeMode === "freshwater"}
        label="민물"
      />
    </div>
  );
}

interface ModeLinkProps {
  href: string;
  isActive: boolean;
  label: string;
}

function ModeLink({ href, isActive, label }: ModeLinkProps) {
  const icon = label === "바다" ? "🌊" : "🏞";

  return (
    <Link
      aria-pressed={isActive}
      className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
        isActive
          ? "bg-[color:var(--surface-panel)] text-[color:var(--fg)] shadow-sm"
          : "text-[color:var(--fg-muted)] hover:text-[color:var(--fg-dim)]"
      }`}
      href={href}
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}
