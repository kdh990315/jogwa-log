"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";

import { ChevronDownIcon } from "../icons/chevron-down/chevron-down";
import { LayoutDashboardIcon } from "../icons/layout-dashboard/layout-dashboard";
import { MenuIcon } from "../icons/menu/menu";
import { MoonIcon } from "../icons/moon/moon";
import { SunIcon } from "../icons/sun/sun";
import { useAuthStore } from "../../stores/auth-store";
import Logo from "./Logo";
import type { HeaderProps } from "./types";

function getUserMetadataValue(user: User | null, key: string) {
  const value = user?.user_metadata?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function getUserDisplayName(user: User | null) {
  return (
    getUserMetadataValue(user, "full_name") ??
    getUserMetadataValue(user, "name") ??
    getUserMetadataValue(user, "nickname") ??
    user?.email ??
    "로그인 사용자"
  );
}

function getUserSecondaryLabel(user: User | null) {
  return user?.email ?? "소셜 로그인";
}

function getUserInitials(name: string) {
  const sanitizedName = name.replace(/\s+/g, "");
  return sanitizedName.slice(0, 2).toUpperCase();
}

export default function Header({
  currentMode,
  dashboardHref = null,
  isDarkMode,
  onOpenNavigation,
  onToggleTheme,
  showNavigationToggle = true,
  showUserSummary = true,
}: HeaderProps) {
  const user = useAuthStore((state) => state.user);
  const userDisplayName = getUserDisplayName(user);
  const userSecondaryLabel = getUserSecondaryLabel(user);
  const userInitials = getUserInitials(userDisplayName);

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-[color:var(--line)] bg-[color:var(--surface-panel)] px-4 transition-colors duration-300 lg:px-6">
      <div className="flex items-center gap-3">
        {showNavigationToggle ? (
          <button
            aria-label="모바일 메뉴 열기"
            className="rounded-lg p-1.5 text-[color:var(--fg-dim)] transition-colors hover:bg-[color:var(--surface-muted)] lg:hidden"
            onClick={onOpenNavigation}
            type="button"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        ) : null}

        <Logo currentMode={currentMode} variant="header" />
      </div>

      <div className="flex items-center gap-3">
        {dashboardHref ? (
          <Link
            aria-label="대시보드로 이동"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-page)] px-3 py-1.5 text-[11px] font-semibold text-[color:var(--fg)] transition-colors hover:border-[color:var(--brand-border)] hover:bg-[color:var(--surface-muted)]"
            href={dashboardHref}
          >
            <LayoutDashboardIcon className="h-4 w-4" />
            <span className="hidden sm:inline">대시보드</span>
          </Link>
        ) : null}

        <button
          aria-label="다크 모드 토글"
          className="rounded-lg p-1.5 text-[color:var(--fg-faint)] transition-colors hover:bg-[color:var(--surface-muted)]"
          onClick={onToggleTheme}
          type="button"
        >
          {isDarkMode ? (
            <SunIcon className="h-4 w-4" />
          ) : (
            <MoonIcon className="h-4 w-4" />
          )}
        </button>

        {showUserSummary ? (
          <button
            className="flex items-center gap-2 rounded-lg border border-transparent p-1 transition-colors hover:border-[color:var(--line)] hover:bg-[color:var(--surface-muted)]"
            type="button"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--brand-surface)] shadow-sm ring-2 ring-[color:var(--surface-panel)]">
              <span className="text-[10px] font-bold text-[color:var(--brand-fg)]">
                {userInitials}
              </span>
            </div>
            <div className="hidden items-start text-left sm:flex sm:flex-col">
              <span className="text-[11px] font-bold leading-none text-[color:var(--fg)]">
                {userDisplayName}
              </span>
              <span className="mt-1 text-[10px] leading-none text-[color:var(--fg-muted)]">
                {userSecondaryLabel}
              </span>
            </div>
            <ChevronDownIcon className="hidden h-3 w-3 text-[color:var(--fg-muted)] sm:block" />
          </button>
        ) : null}
      </div>
    </header>
  );
}
