import { Trophy, type LucideProps } from "lucide-react";

export interface TrophyIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function TrophyIcon(props: TrophyIconProps) {
  return <Trophy {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
