import { ChevronsUpDown, type LucideProps } from "lucide-react";

export interface ChevronsUpDownIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function ChevronsUpDownIcon(props: ChevronsUpDownIconProps) {
  return <ChevronsUpDown {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
