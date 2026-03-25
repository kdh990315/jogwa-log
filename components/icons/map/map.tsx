import { Map, type LucideProps } from "lucide-react";

export interface MapIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function MapIcon(props: MapIconProps) {
  return <Map {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
