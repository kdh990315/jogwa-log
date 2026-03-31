import { ArrowLeft, type LucideProps } from "lucide-react";

export interface ArrowLeftIconProps extends Omit<LucideProps, "strokeWidth"> {
  strokeWidth?: LucideProps["strokeWidth"];
}

export function ArrowLeftIcon(props: ArrowLeftIconProps) {
  return <ArrowLeft {...props} strokeWidth={props.strokeWidth ?? 1.8} />;
}
