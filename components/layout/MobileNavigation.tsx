"use client";

import { XIcon } from "../icons/x/x";
import Logo from "./Logo";
import Sidebar from "./Sidebar";

interface MobileNavigationProps {
  currentMode: string | null;
  currentPath: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({
  currentMode,
  currentPath,
  isOpen,
  onClose,
}: MobileNavigationProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label="모바일 메뉴 닫기"
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />

      <div className="fixed inset-y-0 left-0 flex w-[min(18.5rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-r-2xl border-r border-[color:var(--line)] bg-[color:var(--surface-panel)] shadow-2xl animate-in slide-in-from-left duration-200">
        <div
          className="flex min-h-16 items-center justify-between border-b border-[color:var(--line)] px-5 pb-4"
          style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
        >
          <Logo
            currentMode={currentMode}
            onClick={onClose}
            variant="drawer"
          />

          <button
            aria-label="모바일 메뉴 닫기"
            className="shrink-0 rounded-lg p-2 text-[color:var(--fg-muted)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--fg-dim)]"
            onClick={onClose}
            type="button"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <Sidebar
          currentMode={currentMode}
          currentPath={currentPath}
          isMobile
          onNavigate={onClose}
        />
      </div>
    </div>
  );
}
