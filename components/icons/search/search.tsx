import { Search, type LucideProps } from "lucide-react";

export interface SearchIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function SearchIcon(props: SearchIconProps) {
  return <Search {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
