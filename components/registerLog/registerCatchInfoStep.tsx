import { SearchIcon } from "@/components/icons/search/search";

import { WEATHER_OPTIONS } from "./registerLog.constants";
import type {
  RegisterLogFishingType,
  RegisterLogFormState,
  UpdateRegisterLogField,
} from "./registerLog.types";

interface RegisterCatchInfoStepProps {
  fishingType: RegisterLogFishingType;
  formState: RegisterLogFormState;
  onFieldChange: UpdateRegisterLogField;
  speciesOptions: readonly string[];
}

export function RegisterCatchInfoStep({
  fishingType,
  formState,
  onFieldChange,
  speciesOptions,
}: RegisterCatchInfoStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="mb-1.5 ml-1 block text-xs font-bold uppercase text-fg-faint"
            htmlFor="register-log-date"
          >
            날짜
          </label>
          <input
            className="w-full rounded-xl border border-line bg-surface-muted p-3 text-sm font-medium text-fg transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            id="register-log-date"
            onChange={(event) => onFieldChange("date", event.target.value)}
            type="date"
            value={formState.date}
          />
        </div>
        <div>
          <label
            className="mb-1.5 ml-1 block text-xs font-bold uppercase text-fg-faint"
            htmlFor="register-log-time"
          >
            시간
          </label>
          <input
            className="w-full rounded-xl border border-line bg-surface-muted p-3 text-sm font-medium text-fg transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            id="register-log-time"
            onChange={(event) => onFieldChange("time", event.target.value)}
            type="time"
            value={formState.time}
          />
        </div>
      </div>

      <div>
        <label
          className="mb-1.5 ml-1 block text-xs font-bold uppercase text-fg-faint"
          htmlFor="register-log-species"
        >
          대상 어종
        </label>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input
            className="w-full rounded-xl border border-line bg-surface-muted py-3 pl-10 pr-4 text-sm text-fg transition-all placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            id="register-log-species"
            onChange={(event) => onFieldChange("species", event.target.value)}
            placeholder="어종을 검색하세요 (예: 광어)"
            type="text"
            value={formState.species}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {speciesOptions.map((species, index) => {
            const isActive = formState.species
              ? formState.species === species
              : index === 0;

            return (
              <button
                className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                  isActive
                    ? "border-brand-border bg-brand-surface text-brand-fg hover:bg-brand-surface"
                    : "border-line bg-surface-card text-fg-dim hover:bg-surface-muted"
                }`}
                key={species}
                onClick={() => onFieldChange("species", species)}
                type="button"
              >
                {species}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="mb-1.5 ml-1 block text-xs font-bold uppercase text-fg-faint"
            htmlFor="register-log-count"
          >
            마릿수
          </label>
          <div className="relative">
            <input
              className="w-full rounded-xl border border-line bg-surface-muted py-3 pl-4 pr-12 text-sm font-medium text-fg transition-all placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              id="register-log-count"
              inputMode="numeric"
              onChange={(event) =>
                onFieldChange("catchCount", event.target.value)
              }
              placeholder="0"
              type="number"
              value={formState.catchCount}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-fg-muted">
              마리
            </span>
          </div>
        </div>
        <div>
          <label
            className="mb-1.5 ml-1 block text-xs font-bold uppercase text-fg-faint"
            htmlFor="register-log-size"
          >
            최대어 크기
          </label>
          <div className="relative">
            <input
              className="w-full rounded-xl border border-line bg-surface-muted py-3 pl-4 pr-12 text-sm font-medium text-fg transition-all placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              id="register-log-size"
              inputMode="decimal"
              onChange={(event) => onFieldChange("maxSize", event.target.value)}
              placeholder="0.0"
              type="number"
              value={formState.maxSize}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-fg-muted">
              cm
            </span>
          </div>
        </div>
      </div>

      <div
        className={`grid gap-3 ${
          fishingType === "freshwater" ? "grid-cols-2" : "grid-cols-3"
        }`}
      >
        {fishingType !== "freshwater" ? (
          <div>
            <label
              className="mb-1.5 ml-1 block text-xs font-bold uppercase text-fg-faint"
              htmlFor="register-log-tide"
            >
              물때
            </label>
            <input
              className="w-full rounded-xl border border-line bg-surface-muted p-3 text-sm font-medium text-fg-dim"
              id="register-log-tide"
              placeholder="날짜를 선택하면 자동 계산됩니다."
              readOnly
              type="text"
              value={formState.tide}
            />
            <p className="mt-1.5 ml-1 text-[11px] text-fg-faint">
              날짜 기준으로 자동 계산됩니다.
            </p>
          </div>
        ) : null}
        <div>
          <label
            className="mb-1.5 ml-1 block text-xs font-bold uppercase text-fg-faint"
            htmlFor="register-log-weather"
          >
            날씨
          </label>
          <select
            className="w-full rounded-xl border border-line bg-surface-muted p-3 text-sm text-fg transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            id="register-log-weather"
            onChange={(event) => onFieldChange("weather", event.target.value)}
            value={formState.weather}
          >
            <option value="">선택</option>
            {WEATHER_OPTIONS.map((weather) => (
              <option key={weather} value={weather}>
                {weather}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="mb-1.5 ml-1 block text-xs font-bold uppercase text-fg-faint"
            htmlFor="register-log-temperature"
          >
            수온
          </label>
          <div className="relative">
            <input
              className="w-full rounded-xl border border-line bg-surface-muted py-3 pl-3 pr-8 text-sm font-medium text-fg transition-all placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              id="register-log-temperature"
              inputMode="decimal"
              onChange={(event) =>
                onFieldChange("waterTemperature", event.target.value)
              }
              placeholder="-"
              type="number"
              value={formState.waterTemperature}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-fg-muted">
              ℃
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
