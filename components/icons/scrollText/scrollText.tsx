import { ScrollText, type LucideProps } from "lucide-react";

export interface ScrollTextIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function ScrollTextIcon(props: ScrollTextIconProps) {
  return <ScrollText {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
