import { Anchor, type LucideProps } from "lucide-react";

export interface AnchorIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function AnchorIcon(props: AnchorIconProps) {
  return <Anchor {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
