import { Cloud, type LucideProps } from "lucide-react";

export interface CloudIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function CloudIcon(props: CloudIconProps) {
  return <Cloud {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
