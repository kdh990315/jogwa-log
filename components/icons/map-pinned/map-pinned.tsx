import { MapPinned, type LucideProps } from "lucide-react";

export interface MapPinnedIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function MapPinnedIcon(props: MapPinnedIconProps) {
  return <MapPinned {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
