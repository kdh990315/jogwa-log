"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { FishingMode } from "../../../lib/mock/dashboardData";
import {
  formatDateInputValue,
  formatTimeInputValue,
} from "../../../utils/format/date";
import { ChevronRightIcon } from "../../icons/chevronRight/chevronRight";
import { FishIcon } from "../../icons/fish/fish";
import { MapIcon } from "../../icons/map/map";
import { PlusIcon } from "../../icons/plus/plus";
import { SearchIcon } from "../../icons/search/search";
import { ThumbsUpIcon } from "../../icons/thumbsUp/thumbsUp";
import { WavesIcon } from "../../icons/waves/waves";
import { XIcon } from "../../icons/x/x";

const WEATHER_OPTIONS = ["맑음", "구름", "흐림", "비"] as const;
const SEA_SPECIES_OPTIONS = ["광어", "우럭", "쭈꾸미"] as const;
const FRESHWATER_SPECIES_OPTIONS = ["배스", "쏘가리", "붕어"] as const;
const TIDE_OPTIONS = ["1물", "2물", "3물", "4물", "조금", "무시"] as const;

type RegisterStep = 1 | 2 | 3;

interface RegisterLogDialogProps {
  triggerClassName?: string;
  triggerLabel?: string;
}

interface RegisterLogFormState {
  catchCount: string;
  date: string;
  locationQuery: string;
  maxSize: string;
  memo: string;
  species: string;
  tide: string;
  time: string;
  waterTemperature: string;
  weather: string;
}

export function RegisterLogDialog({
  triggerClassName,
  triggerLabel = "기록하기",
}: RegisterLogDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const [fishingType, setFishingType] = useState<FishingMode | null>(null);
  const [formState, setFormState] = useState<RegisterLogFormState>(
    createInitialFormState(),
  );
  const closeTimerRef = useRef<number | null>(null);

  const speciesOptions =
    fishingType === "freshwater"
      ? FRESHWATER_SPECIES_OPTIONS
      : SEA_SPECIES_OPTIONS;

  const resetState = useCallback(() => {
    setRegisterStep(1);
    setFishingType(null);
    setFormState(createInitialFormState());
  }, []);

  const openDialog = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    resetState();
    setIsOpen(true);
  }, [resetState]);

  const handleClose = useCallback(() => {
    setIsOpen(false);

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      resetState();
      closeTimerRef.current = null;
    }, 300);
  }, [resetState]);

  function updateField<Key extends keyof RegisterLogFormState>(
    key: Key,
    value: RegisterLogFormState[Key],
  ) {
    setFormState((previousState) => ({
      ...previousState,
      [key]: value,
    }));
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, isOpen]);

  return (
    <>
      <button
        className={`${triggerClassName ?? ""} flex items-center justify-center gap-1.5 bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow-md active:scale-95 transform`}
        onClick={openDialog}
        type="button"
      >
        <PlusIcon className="h-4 w-4" />
        <span>{triggerLabel}</span>
      </button>

      {!isOpen ? null : (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          />

          <div
            aria-modal="true"
            className="bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
          >
            <div className="flex items-center justify-between p-6 border-b border-line-muted shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <PlusIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    새 조과 기록
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Step {registerStep} of 3
                  </p>
                </div>
              </div>
              <button
                aria-label="기록하기 모달 닫기"
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                onClick={handleClose}
                type="button"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="h-1 bg-surface-muted w-full">
              <div
                className="h-full bg-brand transition-all duration-300 ease-in-out"
                style={{
                  width: `${(registerStep / 3) * 100}%`,
                }}
              />
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {registerStep === 1 ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-bold text-slate-900 text-center mb-6">
                    어떤 낚시를 다녀오셨나요?
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className={`relative p-6 rounded-2xl border-2 transition-all group hover:shadow-md flex flex-col items-center gap-4 ${
                        fishingType === "sea"
                          ? "border-brand bg-brand-surface/50"
                          : "border-line hover:border-brand-border bg-surface-card"
                      }`}
                      onClick={() => setFishingType("sea")}
                      type="button"
                    >
                      <div
                        className={`p-4 rounded-full transition-colors ${
                          fishingType === "sea"
                            ? "bg-brand-surface text-brand-fg"
                            : "bg-surface-muted text-fg-muted group-hover:bg-brand-surface group-hover:text-brand-fg"
                        }`}
                      >
                        <WavesIcon className="h-8 w-8" />
                      </div>
                      <div className="text-center">
                        <span
                          className={`block font-bold text-lg ${
                            fishingType === "sea" ? "text-fg" : "text-fg-dim"
                          }`}
                        >
                          바다 낚시
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                          광어, 우럭, 쭈꾸미 등
                        </span>
                      </div>
                      {fishingType === "sea" ? (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-brand rounded-full flex items-center justify-center">
                          <PlusIcon className="w-3 h-3 text-white" />
                        </div>
                      ) : null}
                    </button>

                    <button
                      className={`relative p-6 rounded-2xl border-2 transition-all group hover:shadow-md flex flex-col items-center gap-4 ${
                        fishingType === "freshwater"
                          ? "border-brand bg-brand-surface/50"
                          : "border-line hover:border-brand-border bg-surface-card"
                      }`}
                      onClick={() => setFishingType("freshwater")}
                      type="button"
                    >
                      <div
                        className={`p-4 rounded-full transition-colors ${
                          fishingType === "freshwater"
                            ? "bg-brand-surface text-brand-fg"
                            : "bg-surface-muted text-fg-muted group-hover:bg-brand-surface group-hover:text-brand-fg"
                        }`}
                      >
                        <FishIcon className="h-8 w-8" />
                      </div>
                      <div className="text-center">
                        <span
                          className={`block font-bold text-lg ${
                            fishingType === "freshwater"
                              ? "text-fg"
                              : "text-fg-dim"
                          }`}
                        >
                          민물 낚시
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                          배스, 쏘가리, 붕어 등
                        </span>
                      </div>
                      {fishingType === "freshwater" ? (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-brand rounded-full flex items-center justify-center">
                          <PlusIcon className="w-3 h-3 text-white" />
                        </div>
                      ) : null}
                    </button>
                  </div>
                </div>
              ) : null}

              {registerStep === 2 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1"
                        htmlFor="register-log-date"
                      >
                        날짜
                      </label>
                      <input
                        className="w-full p-3 bg-surface-muted border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium"
                        id="register-log-date"
                        onChange={(event) =>
                          updateField("date", event.target.value)
                        }
                        type="date"
                        value={formState.date}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1"
                        htmlFor="register-log-time"
                      >
                        시간
                      </label>
                      <input
                        className="w-full p-3 bg-surface-muted border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium"
                        id="register-log-time"
                        onChange={(event) =>
                          updateField("time", event.target.value)
                        }
                        type="time"
                        value={formState.time}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1"
                      htmlFor="register-log-species"
                    >
                      대상 어종
                    </label>
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-surface-muted border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm"
                        id="register-log-species"
                        onChange={(event) =>
                          updateField("species", event.target.value)
                        }
                        placeholder="어종을 검색하세요 (예: 광어)"
                        type="text"
                        value={formState.species}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {speciesOptions.map((species, index) => {
                        const isActive = formState.species
                          ? formState.species === species
                          : index === 0;

                        return (
                          <button
                            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                              isActive
                                ? "bg-brand-surface text-brand-fg border-brand-border hover:bg-brand-surface"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                            key={species}
                            onClick={() => updateField("species", species)}
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
                        className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1"
                        htmlFor="register-log-count"
                      >
                        마릿수
                      </label>
                      <div className="relative">
                        <input
                          className="w-full pl-4 pr-12 py-3 bg-surface-muted border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium"
                          id="register-log-count"
                          inputMode="numeric"
                          onChange={(event) =>
                            updateField("catchCount", event.target.value)
                          }
                          placeholder="0"
                          type="number"
                          value={formState.catchCount}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                          마리
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1"
                        htmlFor="register-log-size"
                      >
                        최대어 크기
                      </label>
                      <div className="relative">
                        <input
                          className="w-full pl-4 pr-12 py-3 bg-surface-muted border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium"
                          id="register-log-size"
                          inputMode="decimal"
                          onChange={(event) =>
                            updateField("maxSize", event.target.value)
                          }
                          placeholder="0.0"
                          type="number"
                          value={formState.maxSize}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                          cm
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`grid gap-3 ${fishingType === "freshwater" ? "grid-cols-2" : "grid-cols-3"}`}
                  >
                    {fishingType !== "freshwater" ? (
                      <div>
                        <label
                          className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1"
                          htmlFor="register-log-tide"
                        >
                          물때
                        </label>
                        <select
                          className="w-full p-3 bg-surface-muted border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm text-fg-dim"
                          id="register-log-tide"
                          onChange={(event) =>
                            updateField("tide", event.target.value)
                          }
                          value={formState.tide}
                        >
                          <option value="">선택</option>
                          {TIDE_OPTIONS.map((tide) => (
                            <option key={tide} value={tide}>
                              {tide}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}
                    <div>
                      <label
                        className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1"
                        htmlFor="register-log-weather"
                      >
                        날씨
                      </label>
                      <select
                        className="w-full p-3 bg-surface-muted border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm text-fg-dim"
                        id="register-log-weather"
                        onChange={(event) =>
                          updateField("weather", event.target.value)
                        }
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
                        className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1"
                        htmlFor="register-log-temperature"
                      >
                        수온
                      </label>
                      <div className="relative">
                        <input
                          className="w-full pl-3 pr-8 py-3 bg-surface-muted border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium"
                          id="register-log-temperature"
                          inputMode="decimal"
                          onChange={(event) =>
                            updateField("waterTemperature", event.target.value)
                          }
                          placeholder="-"
                          type="number"
                          value={formState.waterTemperature}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                          ℃
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {registerStep === 3 ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                  <div>
                    <label
                      className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1"
                      htmlFor="register-log-location"
                    >
                      장소 검색
                    </label>
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-surface-muted border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm"
                        id="register-log-location"
                        onChange={(event) =>
                          updateField("locationQuery", event.target.value)
                        }
                        placeholder="항구, 방파제, 낚시터 검색..."
                        type="text"
                        value={formState.locationQuery}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-h-[200px] bg-surface-muted rounded-xl border-2 border-dashed border-line flex flex-col items-center justify-center relative overflow-hidden group hover:border-brand-border transition-colors">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
                    <div className="relative z-10 flex flex-col items-center p-6 text-center">
                      <div className="bg-white p-3 rounded-full shadow-md mb-3 text-brand-fg">
                        <MapIcon className="h-6 w-6" />
                      </div>
                      <p className="font-bold text-slate-700">
                        지도에서 포인트 선택
                      </p>
                      <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                        지도를 움직여 정확한 낚시 포인트를 지정해주세요.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1"
                      htmlFor="register-log-memo"
                    >
                      메모
                    </label>
                    <textarea
                      className="w-full p-3 bg-surface-muted border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm resize-none h-24"
                      id="register-log-memo"
                      onChange={(event) =>
                        updateField("memo", event.target.value)
                      }
                      placeholder="채비, 미끼, 특이사항 등을 기록하세요..."
                      value={formState.memo}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between shrink-0 bg-white">
              <button
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  registerStep === 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                disabled={registerStep === 1}
                onClick={() =>
                  setRegisterStep(Math.max(1, registerStep - 1) as RegisterStep)
                }
                type="button"
              >
                이전
              </button>

              <button
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all flex items-center gap-2 ${
                  registerStep === 1 && !fishingType
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-brand hover:bg-brand-hover hover:shadow-md active:scale-95"
                }`}
                disabled={registerStep === 1 && !fishingType}
                onClick={() => {
                  if (registerStep < 3) {
                    if (registerStep === 1 && !fishingType) {
                      return;
                    }

                    setRegisterStep((registerStep + 1) as RegisterStep);
                    return;
                  }

                  handleClose();
                }}
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
          </div>
        </div>
      )}
    </>
  );
}

function createInitialFormState(): RegisterLogFormState {
  const now = new Date();

  return {
    catchCount: "",
    date: formatDateInputValue(now),
    locationQuery: "",
    maxSize: "",
    memo: "",
    species: "",
    tide: "",
    time: formatTimeInputValue(now),
    waterTemperature: "",
    weather: "",
  };
}
