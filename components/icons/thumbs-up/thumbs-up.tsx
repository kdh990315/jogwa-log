import { ThumbsUp, type LucideProps } from "lucide-react";

export interface ThumbsUpIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function ThumbsUpIcon(props: ThumbsUpIconProps) {
  return <ThumbsUp {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
