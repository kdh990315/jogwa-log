export function formatComparisonName(name: string) {
  return name.replace(/(안면도|보령|군산|태안|경기|경북|충북|충남)\s/, "");
}

export function formatRankingName(name: string) {
  return name.split(" ")[1] ?? name;
}

export function getRankBadgeClassName(rank: number) {
  if (rank === 1) {
    return "shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-amber-900";
  }

  if (rank === 2) {
    return "shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-[10px] font-bold text-slate-700";
  }

  if (rank === 3) {
    return "shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-orange-300 text-[10px] font-bold text-orange-900";
  }

  return "shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400";
}

export function getRankTextClassName(rank: number) {
  if (rank === 1) {
    return "w-4 text-center text-[10px] font-bold text-amber-500";
  }

  if (rank === 2) {
    return "w-4 text-center text-[10px] font-bold text-slate-400";
  }

  if (rank === 3) {
    return "w-4 text-center text-[10px] font-bold text-orange-400";
  }

  return "w-4 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500";
}

export function getSuccessColor(rate: number) {
  if (rate >= 85) {
    return "text-brand-fg-strong bg-brand-surface";
  }

  if (rate >= 70) {
    return "text-brand-fg bg-brand-surface";
  }

  if (rate >= 55) {
    return "text-fg-dim bg-surface-muted";
  }

  return "text-fg-muted bg-surface-muted";
}

export function getSuccessBarColor(rate: number) {
  if (rate >= 85) {
    return "var(--viz-1)";
  }

  if (rate >= 70) {
    return "var(--viz-2)";
  }

  if (rate >= 55) {
    return "var(--viz-3)";
  }

  return "var(--viz-4)";
}

export function getSpeciesBadgeClassName() {
  return "bg-surface-muted text-fg-dim border-line";
}
