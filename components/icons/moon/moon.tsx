import { Moon, type LucideProps } from "lucide-react";

export interface MoonIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function MoonIcon(props: MoonIconProps) {
  return <Moon {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
