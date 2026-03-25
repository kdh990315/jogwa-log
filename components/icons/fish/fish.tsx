import { FishSymbol, type LucideProps } from "lucide-react";

export interface FishIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function FishIcon(props: FishIconProps) {
  return <FishSymbol {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
