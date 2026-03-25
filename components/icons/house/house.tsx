import { House, type LucideProps } from "lucide-react";

export interface HouseIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function HouseIcon(props: HouseIconProps) {
  return <House {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
