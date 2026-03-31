import type { FishingMode } from "@/lib/mock/dashboardData";

import { FishIcon } from "@/components/icons/fish/fish";
import { PlusIcon } from "@/components/icons/plus/plus";
import { WavesIcon } from "@/components/icons/waves/waves";

interface RegisterFishingTypeStepProps {
  fishingType: FishingMode | null;
  onSelect: (fishingType: FishingMode) => void;
}

export function RegisterFishingTypeStep({
  fishingType,
  onSelect,
}: RegisterFishingTypeStepProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="mb-6 text-center text-lg font-bold text-slate-900">
        어떤 낚시를 다녀오셨나요?
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          className={`group relative flex flex-col items-center gap-4 rounded-2xl border-2 p-6 transition-all hover:shadow-md ${
            fishingType === "sea"
              ? "border-brand bg-brand-surface/50"
              : "border-line bg-surface-card hover:border-brand-border"
          }`}
          onClick={() => onSelect("sea")}
          type="button"
        >
          <div
            className={`rounded-full p-4 transition-colors ${
              fishingType === "sea"
                ? "bg-brand-surface text-brand-fg"
                : "bg-surface-muted text-fg-muted group-hover:bg-brand-surface group-hover:text-brand-fg"
            }`}
          >
            <WavesIcon className="h-8 w-8" />
          </div>
          <div className="text-center">
            <span
              className={`block text-lg font-bold ${
                fishingType === "sea" ? "text-fg" : "text-fg-dim"
              }`}
            >
              바다 낚시
            </span>
            <span className="mt-1 text-xs text-slate-400">
              광어, 우럭, 쭈꾸미 등
            </span>
          </div>
          {fishingType === "sea" ? (
            <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand">
              <PlusIcon className="h-3 w-3 text-white" />
            </div>
          ) : null}
        </button>

        <button
          className={`group relative flex flex-col items-center gap-4 rounded-2xl border-2 p-6 transition-all hover:shadow-md ${
            fishingType === "freshwater"
              ? "border-brand bg-brand-surface/50"
              : "border-line bg-surface-card hover:border-brand-border"
          }`}
          onClick={() => onSelect("freshwater")}
          type="button"
        >
          <div
            className={`rounded-full p-4 transition-colors ${
              fishingType === "freshwater"
                ? "bg-brand-surface text-brand-fg"
                : "bg-surface-muted text-fg-muted group-hover:bg-brand-surface group-hover:text-brand-fg"
            }`}
          >
            <FishIcon className="h-8 w-8" />
          </div>
          <div className="text-center">
            <span
              className={`block text-lg font-bold ${
                fishingType === "freshwater" ? "text-fg" : "text-fg-dim"
              }`}
            >
              민물 낚시
            </span>
            <span className="mt-1 text-xs text-slate-400">
              배스, 쏘가리, 붕어 등
            </span>
          </div>
          {fishingType === "freshwater" ? (
            <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand">
              <PlusIcon className="h-3 w-3 text-white" />
            </div>
          ) : null}
        </button>
      </div>
    </div>
  );
}
