import { CloudRain, type LucideProps } from "lucide-react";

export interface CloudRainIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function CloudRainIcon(props: CloudRainIconProps) {
  return <CloudRain {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
