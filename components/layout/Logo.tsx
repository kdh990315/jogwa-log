"use client";

import Link from "next/link";

import { getModeAwareHref } from "../../lib/fishing-mode";
import { FishIcon } from "../icons/fish/fish";
import type { LogoProps } from "./types";

export default function Logo({ currentMode, onClick, variant }: LogoProps) {
  const iconClasses =
    variant === "drawer"
      ? "rounded-lg bg-[color:var(--brand)] p-1.5 text-white shadow-sm"
      : "rounded-lg bg-[color:var(--brand)] p-1 text-white shadow-sm";
  const labelClasses =
    variant === "drawer"
      ? "truncate text-xl font-bold tracking-tight text-[color:var(--fg)]"
      : "hidden text-lg font-bold tracking-tight text-[color:var(--fg)] sm:block";

  return (
    <Link
      className={`flex min-w-0 items-center ${variant === "drawer" ? "gap-2.5" : "gap-2"}`}
      href={getModeAwareHref("/", currentMode)}
      onClick={onClick}
    >
      <div className={iconClasses}>
        <FishIcon className={variant === "drawer" ? "h-5 w-5" : "h-4 w-4"} />
      </div>
      <span className={labelClasses}>Jogwa-log</span>
    </Link>
  );
}
