import { ChevronRightIcon } from "@/components/icons/chevronRight/chevronRight";
import { ThumbsUpIcon } from "@/components/icons/thumbsUp/thumbsUp";

import type { RegisterStep } from "./registerLog.types";

interface RegisterLogFooterProps {
  canProceed: boolean;
  onNext: () => void;
  onPrevious: () => void;
  registerStep: RegisterStep;
}

export function RegisterLogFooter({
  canProceed,
  onNext,
  onPrevious,
  registerStep,
}: RegisterLogFooterProps) {
  return (
    <div className="flex shrink-0 justify-between border-t border-line-muted bg-surface-card p-4">
      <button
        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
          registerStep === 1
            ? "cursor-not-allowed text-fg-muted opacity-40"
            : "text-fg-dim hover:bg-surface-muted hover:text-fg"
        }`}
        disabled={registerStep === 1}
        onClick={onPrevious}
        type="button"
      >
        이전
      </button>

      <button
        className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold shadow-sm transition-all ${
          canProceed
            ? "bg-brand text-white hover:bg-brand-hover hover:shadow-md active:scale-95"
            : "cursor-not-allowed bg-surface-muted text-fg-muted shadow-none"
        }`}
        disabled={!canProceed}
        onClick={onNext}
        type="button"
      >
        {registerStep === 3 ? (
          <>
            <span>등록완료</span>
            <ThumbsUpIcon className="h-4 w-4" />
          </>
        ) : (
          <>
            <span>다음</span>
            <ChevronRightIcon className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}
