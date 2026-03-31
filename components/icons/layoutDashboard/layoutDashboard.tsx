import { LayoutDashboard, type LucideProps } from "lucide-react";

export interface LayoutDashboardIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function LayoutDashboardIcon(props: LayoutDashboardIconProps) {
  return <LayoutDashboard {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
