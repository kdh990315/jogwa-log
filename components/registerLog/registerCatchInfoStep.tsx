import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ChevronRightIcon } from "@/components/icons/chevronRight/chevronRight";
import { SearchIcon } from "@/components/icons/search/search";
import { SpeciesSelectSheet } from "@/components/ui/speciesSelectSheet";

import { WEATHER_OPTIONS } from "./registerLog.constants";
import type {
  RegisterLogFishingType,
  RegisterLogFormState,
} from "./registerLog.types";

interface RegisterCatchInfoStepProps {
  fishingType: RegisterLogFishingType;
  speciesOptions: readonly string[];
}

export function RegisterCatchInfoStep({
  fishingType,
  speciesOptions,
}: RegisterCatchInfoStepProps) {
  const [isSpeciesSheetOpen, setIsSpeciesSheetOpen] = useState(false);
  const { control, register, setValue } =
    useFormContext<RegisterLogFormState>();
  const catchCount = useWatch({ control, name: "catchCount" }) ?? "";
  const maxSize = useWatch({ control, name: "maxSize" }) ?? "";
  const selectedSpecies = useWatch({ control, name: "species" }) ?? "";
  const tide = useWatch({ control, name: "tide" }) ?? "";
  const isZeroCount = isZero(catchCount);

  useEffect(() => {
    if (!isZeroCount || maxSize.trim().length === 0) {
      return;
    }

    setValue("maxSize", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [isZeroCount, maxSize, setValue]);

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
            type="date"
            {...register("date", { required: true })}
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
            type="time"
            {...register("time", { required: true })}
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
        <input
          type="hidden"
          {...register("species", {
            validate: (value) => value.trim().length > 0,
          })}
        />
        <button
          className="flex w-full items-center justify-between rounded-xl border border-line bg-surface-muted py-3 pl-4 pr-3 text-left text-sm text-fg transition-all hover:border-brand-border hover:bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand/20"
          id="register-log-species"
          onClick={() => setIsSpeciesSheetOpen(true)}
          type="button"
        >
          <span className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4 text-fg-muted" />
            <span
              className={selectedSpecies ? "text-fg" : "text-fg-muted"}
            >
              {selectedSpecies || "어종을 선택하세요"}
            </span>
          </span>
          <ChevronRightIcon className="h-4 w-4 text-fg-muted" />
        </button>
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
              min="0"
              placeholder="0"
              step="1"
              type="number"
              {...register("catchCount", {
                validate: (value) => isWholeNumber(value),
              })}
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
              className="w-full rounded-xl border border-line bg-surface-muted py-3 pl-4 pr-12 text-sm font-medium text-fg transition-all placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:bg-surface-panel disabled:text-fg-faint disabled:opacity-70"
              disabled={isZeroCount}
              id="register-log-size"
              inputMode="decimal"
              min="0"
              placeholder={isZeroCount ? "0마리" : "0.0"}
              step="0.1"
              type="number"
              {...register("maxSize", {
                validate: (value) => {
                  if (isZeroCount) {
                    return value.trim().length === 0;
                  }

                  return value.trim().length === 0 || isNumber(value);
                },
              })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-fg-muted">
              cm
            </span>
          </div>
          {isZeroCount ? (
            <p className="mt-1.5 ml-1 text-[11px] text-fg-faint">
              마릿수가 0이면 최대어 크기는 입력할 수 없습니다.
            </p>
          ) : null}
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
              value={tide}
              {...register("tide", {
                validate: (value) =>
                  fishingType !== "sea" || value.trim().length > 0,
              })}
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
            {...register("weather", { required: true })}
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
              placeholder="-"
              type="number"
              {...register("waterTemperature")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-fg-muted">
              ℃
            </span>
          </div>
        </div>
      </div>

      {isSpeciesSheetOpen ? (
        <SpeciesSelectSheet
          isOpen={isSpeciesSheetOpen}
          onClose={() => setIsSpeciesSheetOpen(false)}
          onSelect={(species) => {
            setValue("species", species, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setIsSpeciesSheetOpen(false);
          }}
          options={speciesOptions}
          selectedSpecies={selectedSpecies}
        />
      ) : null}
    </div>
  );
}

function isWholeNumber(value: string) {
  if (value.trim().length === 0) {
    return false;
  }

  const normalizedValue = Number(value);

  return (
    Number.isInteger(normalizedValue) &&
    Number.isFinite(normalizedValue) &&
    normalizedValue >= 0
  );
}

function isNumber(value: string) {
  if (value.trim().length === 0) {
    return false;
  }

  const normalizedValue = Number(value);

  return Number.isFinite(normalizedValue) && normalizedValue >= 0;
}

function isZero(value: string) {
  if (value.trim().length === 0) {
    return false;
  }

  return Number(value) === 0;
}
