import { X, type LucideProps } from "lucide-react";

export interface XIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function XIcon(props: XIconProps) {
  return <X {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
