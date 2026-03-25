"use client";

import { ChevronDownIcon } from "../icons/chevron-down/chevron-down";
import { MenuIcon } from "../icons/menu/menu";
import { MoonIcon } from "../icons/moon/moon";
import { SunIcon } from "../icons/sun/sun";
import Logo from "./Logo";
import type { HeaderProps } from "./types";

export default function Header({
  currentMode,
  isDarkMode,
  onOpenNavigation,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-[color:var(--line)] bg-[color:var(--surface-panel)] px-4 transition-colors duration-300 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          aria-label="모바일 메뉴 열기"
          className="rounded-lg p-1.5 text-[color:var(--fg-dim)] transition-colors hover:bg-[color:var(--surface-muted)] lg:hidden"
          onClick={onOpenNavigation}
          type="button"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <Logo currentMode={currentMode} variant="header" />
      </div>

      <div className="flex items-center gap-3">
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

        <button
          className="flex items-center gap-2 rounded-lg border border-transparent p-1 transition-colors hover:border-[color:var(--line)] hover:bg-[color:var(--surface-muted)]"
          type="button"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--brand-surface)] shadow-sm ring-2 ring-[color:var(--surface-panel)]">
            <span className="text-[10px] font-bold text-[color:var(--brand-fg)]">
              KH
            </span>
          </div>
          <div className="hidden items-start text-left sm:flex sm:flex-col">
            <span className="text-[11px] font-bold leading-none text-[color:var(--fg)]">
              김낚시
            </span>
            <span className="mt-1 text-[10px] leading-none text-[color:var(--fg-muted)]">
              Pro Angler
            </span>
          </div>
          <ChevronDownIcon className="hidden h-3 w-3 text-[color:var(--fg-muted)] sm:block" />
        </button>
      </div>
    </header>
  );
}
