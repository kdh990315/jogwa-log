"use client";

import { useSearchParams } from "next/navigation";

import LayoutFrame from "./LayoutFrame";
import type { LayoutFrameProps } from "./types";

type SearchAwareLayoutFrameProps = Omit<LayoutFrameProps, "currentMode">;

export default function SearchAwareLayoutFrame({
  children,
  isDarkMode,
  mobileNavigationOpen,
  onCloseNavigation,
  onOpenNavigation,
  onToggleTheme,
  pathname,
}: SearchAwareLayoutFrameProps) {
  const searchParams = useSearchParams();
  const currentMode = searchParams.get("mode");

  return (
    <LayoutFrame
      currentMode={currentMode}
      isDarkMode={isDarkMode}
      mobileNavigationOpen={mobileNavigationOpen}
      onCloseNavigation={onCloseNavigation}
      onOpenNavigation={onOpenNavigation}
      onToggleTheme={onToggleTheme}
      pathname={pathname}
    >
      {children}
    </LayoutFrame>
  );
}
