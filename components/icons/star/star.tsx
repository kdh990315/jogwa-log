import { Star, type LucideProps } from "lucide-react";

export interface StarIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function StarIcon(props: StarIconProps) {
  return <Star {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
