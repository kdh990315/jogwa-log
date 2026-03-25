import { ChevronRight, type LucideProps } from "lucide-react";

export interface ChevronRightIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function ChevronRightIcon(props: ChevronRightIconProps) {
  return <ChevronRight {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
