import type { ReactNode } from "react";

interface ConditionItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export function ConditionItem({ icon, label, value }: ConditionItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="shrink-0 text-blue-500 dark:text-blue-400">{icon}</span>
      <span className="shrink-0 text-[9px] text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <span className="truncate text-[10px] font-semibold text-slate-700 dark:text-slate-300">
        {value}
      </span>
    </div>
  );
}
