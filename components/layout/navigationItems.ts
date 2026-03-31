import { LayoutDashboardIcon } from "../icons/layoutDashboard/layoutDashboard";
import { MapPinnedIcon } from "../icons/mapPinned/mapPinned";
import { ScrollTextIcon } from "../icons/scrollText/scrollText";
import type { NavigationItem } from "./types";

export const APP_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    description: "조과 패턴과 주요 지표를 확인합니다.",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
    label: "대시보드",
  },
  {
    description: "출조 기록을 검색하고 정렬합니다.",
    href: "/logs",
    icon: ScrollTextIcon,
    label: "조과 기록",
  },
  {
    description: "포인트별 성과와 시즌 흐름을 봅니다.",
    href: "/location-stats",
    icon: MapPinnedIcon,
    label: "포인트별 상세 성과",
  },
];
