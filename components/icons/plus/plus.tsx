import { Plus, type LucideProps } from "lucide-react";

export interface PlusIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function PlusIcon(props: PlusIconProps) {
  return <Plus {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
