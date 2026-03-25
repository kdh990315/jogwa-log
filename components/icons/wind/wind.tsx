import { Wind, type LucideProps } from "lucide-react";

export interface WindIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function WindIcon(props: WindIconProps) {
  return <Wind {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
