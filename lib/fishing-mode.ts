import type { FishingMode } from "./mock/dashboard-data";

export function isFishingMode(
  value: string | null | undefined,
): value is FishingMode {
  return value === "sea" || value === "freshwater";
}

export function getModeAwareHref(
  pathname: string,
  mode: string | null | undefined,
) {
  return isFishingMode(mode) ? `${pathname}?mode=${mode}` : pathname;
}
