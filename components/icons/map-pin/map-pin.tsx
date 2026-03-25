import { MapPin, type LucideProps } from "lucide-react";

export interface MapPinIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function MapPinIcon(props: MapPinIconProps) {
  return <MapPin {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
