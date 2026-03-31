"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import LayoutFrame from "./layoutFrame";
import SearchAwareLayoutFrame from "./searchAwareLayoutFrame";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [isDarkMode]);

  return (
    <Suspense
      fallback={
        <LayoutFrame
          currentMode={null}
          isDarkMode={isDarkMode}
          mobileNavigationOpen={mobileNavigationOpen}
          onCloseNavigation={() => setMobileNavigationOpen(false)}
          onOpenNavigation={() => setMobileNavigationOpen(true)}
          onToggleTheme={() => setIsDarkMode((previousState) => !previousState)}
          pathname={pathname}
        >
          {children}
        </LayoutFrame>
      }
    >
      <SearchAwareLayoutFrame
        isDarkMode={isDarkMode}
        mobileNavigationOpen={mobileNavigationOpen}
        onCloseNavigation={() => setMobileNavigationOpen(false)}
        onOpenNavigation={() => setMobileNavigationOpen(true)}
        onToggleTheme={() => setIsDarkMode((previousState) => !previousState)}
        pathname={pathname}
      >
        {children}
      </SearchAwareLayoutFrame>
    </Suspense>
  );
}
