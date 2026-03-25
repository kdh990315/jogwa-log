import { ChevronLeft, type LucideProps } from "lucide-react";

export interface ChevronLeftIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function ChevronLeftIcon(props: ChevronLeftIconProps) {
  return <ChevronLeft {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
