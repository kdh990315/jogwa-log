"use client";

import Link from "next/link";

import { getModeAwareHref } from "../../lib/fishing-mode";
import type { NavigationLinkProps } from "./types";

export default function NavigationLink({
  currentMode,
  currentPath,
  isMobile = false,
  item,
  onNavigate,
}: NavigationLinkProps) {
  const isActive = isCurrentPath(currentPath, item.href);
  const Icon = item.icon;

  return (
    <Link
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-[color:var(--brand-surface)] text-[color:var(--brand-fg)] shadow-sm"
          : "text-[color:var(--fg-dim)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--fg)]"
      }`}
      href={getModeAwareHref(item.href, currentMode)}
      onClick={onNavigate}
      title={isMobile ? undefined : item.description}
    >
      <Icon
        className={`h-4 w-4 ${
          isActive
            ? "text-[color:var(--brand-fg)]"
            : "text-[color:var(--fg-muted)]"
        }`}
      />
      <span className={isMobile ? "text-base" : undefined}>{item.label}</span>
    </Link>
  );
}

function isCurrentPath(currentPath: string, href: string) {
  return currentPath === href || currentPath.startsWith(`${href}/`);
}
