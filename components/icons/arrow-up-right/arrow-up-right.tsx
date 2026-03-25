import { ArrowUpRight, type LucideProps } from "lucide-react";

export interface ArrowUpRightIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function ArrowUpRightIcon(props: ArrowUpRightIconProps) {
  return <ArrowUpRight {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
