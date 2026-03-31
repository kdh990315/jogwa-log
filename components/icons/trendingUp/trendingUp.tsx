import { TrendingUp, type LucideProps } from "lucide-react";

export interface TrendingUpIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function TrendingUpIcon(props: TrendingUpIconProps) {
  return <TrendingUp {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
