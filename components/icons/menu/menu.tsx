import { Menu, type LucideProps } from "lucide-react";

export interface MenuIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function MenuIcon(props: MenuIconProps) {
  return <Menu {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
