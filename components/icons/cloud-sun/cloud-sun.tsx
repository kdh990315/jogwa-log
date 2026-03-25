import { CloudSun, type LucideProps } from "lucide-react";

export interface CloudSunIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function CloudSunIcon(props: CloudSunIconProps) {
  return <CloudSun {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
