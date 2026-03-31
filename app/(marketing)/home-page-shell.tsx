"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import Header from "../../components/layout/Header";
import { useAuthStore } from "../../stores/auth-store";

interface HomePageShellProps {
  children: ReactNode;
}

export default function HomePageShell({ children }: HomePageShellProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [isDarkMode]);

  return (
    <div
      className={`${isDarkMode ? "dark" : ""} flex min-h-screen flex-col font-sans transition-colors duration-300`}
    >
      <Header
        currentMode={null}
        dashboardHref="/dashboard"
        isDarkMode={isDarkMode}
        onOpenNavigation={() => {}}
        onToggleTheme={() => setIsDarkMode((previousState) => !previousState)}
        showNavigationToggle={false}
        showUserSummary={user !== null}
      />
      {children}
    </div>
  );
}
