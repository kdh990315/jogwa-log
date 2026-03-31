interface CompactStatProps {
  label: string;
  value: string;
}

export function CompactStat({ label, value }: CompactStatProps) {
  return (
    <div className="flex flex-col items-center px-1 py-2.5">
      <span className="mb-0.5 text-[9px] text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <span className="text-[11px] font-bold text-fg">{value}</span>
    </div>
  );
}
