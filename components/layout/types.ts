import type { ReactNode } from "react";

export type NavigationIcon = (props: { className?: string }) => ReactNode;

export interface LogoProps {
  currentMode: string | null;
  onClick?: () => void;
  variant: "drawer" | "header";
}

export interface HeaderProps {
  currentMode: string | null;
  isDarkMode: boolean;
  onOpenNavigation: () => void;
  onToggleTheme: () => void;
}

export interface LayoutFrameProps {
  children: ReactNode;
  currentMode: string | null;
  isDarkMode: boolean;
  mobileNavigationOpen: boolean;
  onCloseNavigation: () => void;
  onOpenNavigation: () => void;
  onToggleTheme: () => void;
  pathname: string;
}

export interface NavigationItem {
  description: string;
  href: string;
  icon: NavigationIcon;
  label: string;
}

export interface NavigationLinkProps {
  currentMode: string | null;
  currentPath: string;
  isMobile?: boolean;
  item: NavigationItem;
  onNavigate?: () => void;
}

export interface SidebarProps {
  currentMode: string | null;
  currentPath: string;
  isMobile?: boolean;
  onNavigate?: () => void;
}
