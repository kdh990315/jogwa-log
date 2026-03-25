"use client";

import Footer from "./Footer";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";
import Sidebar from "./Sidebar";
import type { LayoutFrameProps } from "./types";

export default function LayoutFrame({
  children,
  currentMode,
  isDarkMode,
  mobileNavigationOpen,
  onCloseNavigation,
  onOpenNavigation,
  onToggleTheme,
  pathname,
}: LayoutFrameProps) {
  return (
    <div
      className={`${isDarkMode ? "dark" : ""} font-sans flex h-screen flex-col overflow-hidden bg-[color:var(--surface-app)] transition-colors duration-300`}
    >
      <Header
        currentMode={currentMode}
        isDarkMode={isDarkMode}
        onOpenNavigation={onOpenNavigation}
        onToggleTheme={onToggleTheme}
      />

      <div className="flex w-full flex-1 overflow-hidden bg-[color:var(--surface-panel)] transition-all duration-300 lg:m-4 lg:max-w-[1800px] lg:self-center lg:rounded-xl lg:border lg:border-[color:var(--line-card)] lg:shadow-sm">
        <aside className="hidden h-full w-60 shrink-0 border-r border-[color:var(--line)] bg-[color:var(--surface-panel)] lg:flex">
          <Sidebar currentMode={currentMode} currentPath={pathname} />
        </aside>

        <main className="relative min-w-0 flex-1 overflow-y-auto bg-[color:var(--surface-page)] p-3 scroll-smooth md:p-5">
          <div className="mx-auto w-full max-w-7xl pb-16">{children}</div>
        </main>
      </div>

      <Footer />

      <MobileNavigation
        currentMode={currentMode}
        currentPath={pathname}
        isOpen={mobileNavigationOpen}
        onClose={onCloseNavigation}
      />
    </div>
  );
}
