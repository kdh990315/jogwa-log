import { Waves, type LucideProps } from "lucide-react";

export interface WavesIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function WavesIcon(props: WavesIconProps) {
  return <Waves {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
