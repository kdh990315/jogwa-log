"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { SIGN_OUT_ERROR_MESSAGE } from "../../lib/auth/constants";
import { LogOutIcon } from "../icons/log-out/log-out";
import { signOut } from "../../apis/auth";
import { useAuthStore } from "../../stores/auth-store";
import NavigationLink from "./NavigationLink";
import { APP_NAVIGATION_ITEMS } from "./navigation-items";
import type { SidebarProps } from "./types";

export default function Sidebar({
  currentMode,
  currentPath,
  isMobile = false,
  onNavigate,
}: SidebarProps) {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const user = useAuthStore((state) => state.user);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navClasses = isMobile
    ? "min-h-0 flex-1 overflow-y-auto px-4 py-4"
    : "min-h-0 flex-1 overflow-y-auto p-3";
  const footerClasses = isMobile
    ? "border-t border-[color:var(--line-muted)] px-4 pt-3"
    : "border-t border-[color:var(--line-muted)] p-3";
  const logoutButtonClasses = isMobile
    ? "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-[color:var(--fg-dim)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-red-400"
    : "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--fg-dim)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-red-400";
  const userLabel = user?.email ?? "소셜 로그인";

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage(null);

    try {
      await signOut();
      clearSession();
      router.replace("/login");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Sign out failed", error);
      }

      setErrorMessage(SIGN_OUT_ERROR_MESSAGE);
    } finally {
      setIsSigningOut(false);
    }
  }

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
        <p className="mb-3 truncate px-3 text-[11px] text-[color:var(--fg-muted)]">
          {userLabel}
        </p>
        <button
          className={logoutButtonClasses}
          disabled={isSigningOut}
          onClick={() => void handleSignOut()}
          type="button"
        >
          <LogOutIcon
            className={`${isMobile ? "h-5 w-5" : "h-4 w-4"} text-[color:var(--fg-muted)] group-hover:text-red-600 dark:group-hover:text-red-400`}
          />
          {isSigningOut ? "로그아웃 중..." : "로그아웃"}
        </button>
        {errorMessage ? (
          <p className="mt-2 px-3 text-[11px] leading-5 text-red-500">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
