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
    <div className="flex justify-between border-t border-slate-100 bg-white p-4 shrink-0">
      <button
        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
          registerStep === 1
            ? "cursor-not-allowed text-slate-300"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
        disabled={registerStep === 1}
        onClick={onPrevious}
        type="button"
      >
        이전
      </button>

      <button
        className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all ${
          canProceed
            ? "bg-brand hover:bg-brand-hover hover:shadow-md active:scale-95"
            : "cursor-not-allowed bg-slate-300"
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
