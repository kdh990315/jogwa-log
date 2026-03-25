import { Check, type LucideProps } from "lucide-react";

export interface CheckIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function CheckIcon(props: CheckIconProps) {
  return <Check {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
