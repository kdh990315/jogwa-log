import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  const classes = [
    "flex flex-col rounded-xl border border-[color:var(--line-card)] bg-[color:var(--surface-card)] text-[color:var(--fg)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
