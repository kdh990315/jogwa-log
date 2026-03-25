import { Sun, type LucideProps } from "lucide-react";

export interface SunIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function SunIcon(props: SunIconProps) {
  return <Sun {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
