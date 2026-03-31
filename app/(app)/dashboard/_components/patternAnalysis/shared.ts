export type PatternTab = "location" | "species" | "time";

export const V1 = "var(--viz-1)";
export const V2 = "var(--viz-2)";
export const V3 = "var(--viz-3)";
export const V4 = "var(--viz-4)";
export const VIZ_COLORS = [V1, V2, V3, V4];

export const TOOLTIP_STYLE = {
  backgroundColor: "rgba(15, 23, 42, 0.94)",
  border: "none",
  borderRadius: "10px",
  boxShadow: "0 8px 24px -4px rgb(0 0 0 / 0.18)",
  color: "#e2e8f0",
  fontSize: "11px",
};

export function formatLocationPatternLabel(name: string) {
  const parts = name.split(" ");

  return parts[parts.length - 1] ?? name;
}
