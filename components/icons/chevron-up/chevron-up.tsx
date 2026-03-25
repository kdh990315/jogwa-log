import { ChevronUp, type LucideProps } from "lucide-react";

export interface ChevronUpIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function ChevronUpIcon(props: ChevronUpIconProps) {
  return <ChevronUp {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
