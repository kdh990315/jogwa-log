import { Clock3, type LucideProps } from "lucide-react";

export interface Clock3IconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function Clock3Icon(props: Clock3IconProps) {
  return <Clock3 {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
