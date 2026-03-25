import { ChevronDown, type LucideProps } from "lucide-react";

export interface ChevronDownIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function ChevronDownIcon(props: ChevronDownIconProps) {
  return <ChevronDown {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
