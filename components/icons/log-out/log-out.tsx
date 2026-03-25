import { LogOut, type LucideProps } from "lucide-react";

export interface LogOutIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function LogOutIcon(props: LogOutIconProps) {
  return <LogOut {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
