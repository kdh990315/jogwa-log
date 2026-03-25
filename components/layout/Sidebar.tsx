"use client";

import { LogOutIcon } from "../icons/log-out/log-out";
import NavigationLink from "./NavigationLink";
import { APP_NAVIGATION_ITEMS } from "./navigation-items";
import type { SidebarProps } from "./types";

export default function Sidebar({
  currentMode,
  currentPath,
  isMobile = false,
  onNavigate,
}: SidebarProps) {
  const navClasses = isMobile
    ? "min-h-0 flex-1 overflow-y-auto px-4 py-4"
    : "min-h-0 flex-1 overflow-y-auto p-3";
  const footerClasses = isMobile
    ? "border-t border-[color:var(--line-muted)] px-4 pt-3"
    : "border-t border-[color:var(--line-muted)] p-3";
  const logoutButtonClasses = isMobile
    ? "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-[color:var(--fg-dim)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-red-600 dark:hover:text-red-400"
    : "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--fg-dim)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-red-600 dark:hover:text-red-400";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav className={navClasses}>
        <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--fg-muted)]">
          Menu
        </div>

        <div className="space-y-0.5">
          {APP_NAVIGATION_ITEMS.map((item) => (
            <NavigationLink
              currentMode={currentMode}
              currentPath={currentPath}
              isMobile={isMobile}
              item={item}
              key={item.href}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      <div
        className={footerClasses}
        style={
          isMobile
            ? { paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }
            : undefined
        }
      >
        <button className={logoutButtonClasses} type="button">
          <LogOutIcon
            className={`${isMobile ? "h-5 w-5" : "h-4 w-4"} text-[color:var(--fg-muted)] group-hover:text-red-600 dark:group-hover:text-red-400`}
          />
          로그아웃
        </button>
      </div>
    </div>
  );
}
