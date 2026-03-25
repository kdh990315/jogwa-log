import { MoreHorizontal, type LucideProps } from "lucide-react";

export interface MoreHorizontalIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function MoreHorizontalIcon(props: MoreHorizontalIconProps) {
  return <MoreHorizontal {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
