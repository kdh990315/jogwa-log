"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";

import { PlusIcon } from "@/components/icons/plus/plus";
import { XIcon } from "@/components/icons/x/x";
import {
  createLog,
  type CreateLogInput,
} from "@jogwa-log/data-access/api/logs/createLog";
import type { FieldTypeRow } from "@jogwa-log/data-access/api/referenceData/fieldTypes";
import type { FishRow } from "@jogwa-log/data-access/api/referenceData/fish";
import { createClient as createBrowserClient } from "@jogwa-log/data-access/supabase/browser";

import {
  useFieldTypes,
  useFishRows,
} from "@/components/providers/referenceDataProvider";
import { getTideBySolarDate } from "@/packages/shared/tideFormatter";

import { RegisterCatchInfoStep } from "./registerCatchInfoStep";
import { RegisterLogFooter } from "./registerLogFooter";
import { RegisterLogProgress } from "./registerLogProgress";
import { createInitialState } from "./registerLogFormState";
import { RegisterLogTriggerButton } from "./registerLogTriggerButton";
import { RegisterLocationStep } from "./registerLocationStep";
import { RegisterFishingTypeStep } from "./registerFishingTypeStep";
import type {
  RegisterLogDialogProps,
  RegisterLogFormState,
  RegisterStep,
} from "./registerLog.types";

export function RegisterLogDialog({
  triggerClassName,
  triggerLabel = "기록하기",
}: RegisterLogDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fieldTypes = useFieldTypes();
  const fishRows = useFishRows();
  const registerLogForm = useForm<RegisterLogFormState>({
    defaultValues: createInitialState(),
    shouldUnregister: false,
  });
  const { control, getValues, handleSubmit, reset, setValue, trigger } =
    registerLogForm;
  const closeTimerRef = useRef<number | null>(null);
  const fishingType = useWatch({ control, name: "fishingType" }) ?? null;
  const fieldTypeId = useWatch({ control, name: "fieldTypeId" }) ?? "";
  const species = useWatch({ control, name: "species" }) ?? "";
  const date = useWatch({ control, name: "date" }) ?? "";
  const time = useWatch({ control, name: "time" }) ?? "";
  const catchCount = useWatch({ control, name: "catchCount" }) ?? "";
  const tide = useWatch({ control, name: "tide" }) ?? "";
  const weather = useWatch({ control, name: "weather" }) ?? "";
  const locationQuery = useWatch({ control, name: "locationQuery" }) ?? "";
  const locationName = useWatch({ control, name: "locationName" }) ?? "";
  const latitude = useWatch({ control, name: "latitude" });
  const longitude = useWatch({ control, name: "longitude" });
  const speciesOptions = getSpeciesNames({
    fieldTypeId,
    fishRows,
  });

  const resetDialog = useCallback(() => {
    setRegisterStep(1);
    setSubmitError(null);
    reset(createInitialState());
  }, [reset]);

  const openDialog = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    resetDialog();
    setIsOpen(true);
  }, [resetDialog]);

  const closeDialog = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      resetDialog();
      closeTimerRef.current = null;
    }, 300);
  }, [isSubmitting, resetDialog]);

  function selectType(nextFishingType: "sea" | "freshwater") {
    setValue("fishingType", nextFishingType, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(
      "fieldTypeId",
      String(getFieldTypeId(fieldTypes, nextFishingType)),
      { shouldDirty: true, shouldValidate: true },
    );
    setValue("species", "", { shouldDirty: true, shouldValidate: true });
    setValue(
      "tide",
      nextFishingType === "sea" ? getTideName(getValues("date")) : "",
      { shouldDirty: true, shouldValidate: true },
    );
  }

  function goPrev() {
    setRegisterStep(Math.max(1, registerStep - 1) as RegisterStep);
  }

  async function goNext() {
    setSubmitError(null);

    if (registerStep === 1 && !fishingType) {
      return;
    }

    if (registerStep === 1) {
      setRegisterStep(2);
      return;
    }

    if (registerStep === 2) {
      const isStepTwoValid = await trigger(
        fishingType === "sea"
          ? ["date", "time", "species", "catchCount", "weather", "tide"]
          : ["date", "time", "species", "catchCount", "weather"],
      );

      if (!isStepTwoValid) {
        return;
      }

      setRegisterStep((registerStep + 1) as RegisterStep);
      return;
    }

    const isStepThreeValid = await trigger(["locationQuery", "locationName"]);

    if (!isStepThreeValid || latitude === null || longitude === null) {
      return;
    }

    await handleSubmit(async (formData) => {
      setIsSubmitting(true);

      try {
        const supabase = createBrowserClient();

        await createLog(
          supabase,
          toCreateLogInput(formData),
        );

        closeDialog();
        router.refresh();
      } catch (error) {
        setSubmitError(getSubmitError(error));
      } finally {
        setIsSubmitting(false);
      }
    })();
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDialog();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeDialog, isOpen]);

  useEffect(() => {
    if (fishingType !== "sea") {
      if (getValues("tide")) {
        setValue("tide", "");
      }

      return;
    }

    const nextTide = getTideName(date);

    if (getValues("tide") !== nextTide) {
      setValue("tide", nextTide);
    }
  }, [date, fishingType, getValues, setValue]);

  const canProceed =
    registerStep === 1
      ? Boolean(fishingType)
      : registerStep === 2
        ? hasText(date) &&
          hasText(time) &&
          hasText(species) &&
          isWholeNumber(catchCount) &&
          hasText(weather) &&
          (fishingType !== "sea" || hasText(tide))
      : registerStep === 3
        ? hasText(locationQuery) &&
          hasText(locationName) &&
          latitude !== null &&
          longitude !== null
        : true;

  return (
    <FormProvider {...registerLogForm}>
      <RegisterLogTriggerButton
        className={triggerClassName}
        label={triggerLabel}
        onClick={openDialog}
      />

      {!isOpen ? null : (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={isSubmitting ? undefined : closeDialog}
          />

          <div
            aria-modal="true"
            className="relative z-10 flex h-full w-full flex-col overflow-hidden border border-line-card bg-surface-card text-fg shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl"
            role="dialog"
          >
            <div className="flex items-center justify-between border-b border-line-muted p-6 shrink-0">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-brand-surface p-2 text-brand-fg">
                  <PlusIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-fg">새 조과 기록</h2>
                  <p className="mt-0.5 text-xs font-medium text-fg-faint">
                    Step {registerStep} of 3
                  </p>
                </div>
              </div>
              <button
                aria-label="기록하기 모달 닫기"
                className="rounded-full p-2 text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg-dim disabled:cursor-not-allowed disabled:opacity-40"
                disabled={isSubmitting}
                onClick={closeDialog}
                type="button"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <RegisterLogProgress registerStep={registerStep} />

            <div className="space-y-6 overflow-y-auto p-6">
              {registerStep === 1 ? (
                <RegisterFishingTypeStep
                  fishingType={fishingType}
                  onSelect={selectType}
                />
              ) : null}
              {registerStep === 2 ? (
                <RegisterCatchInfoStep
                  fishingType={fishingType}
                  speciesOptions={speciesOptions}
                />
              ) : null}
              {registerStep === 3 ? (
                <RegisterLocationStep />
              ) : null}
            </div>

            {submitError ? (
              <p
                className="border-t border-line-muted px-6 py-3 text-sm text-red-400"
                role="alert"
              >
                {submitError}
              </p>
            ) : null}

            <RegisterLogFooter
              canProceed={canProceed}
              isSubmitting={isSubmitting}
              onNext={goNext}
              onPrevious={goPrev}
              registerStep={registerStep}
            />
          </div>
        </div>
      )}
    </FormProvider>
  );
}

function getSpeciesNames({
  fieldTypeId,
  fishRows,
}: {
  fieldTypeId: RegisterLogFormState["fieldTypeId"];
  fishRows: FishRow[];
}) {
  const normalizedFieldTypeId = Number.parseInt(fieldTypeId, 10);

  if (!Number.isFinite(normalizedFieldTypeId)) {
    return [];
  }

  return fishRows
    .filter(
      (fish) =>
        fish.field_type_id === normalizedFieldTypeId &&
        typeof fish.name === "string",
    )
    .map((fish) => fish.name as string);
}

function getFieldTypeId(
  fieldTypes: FieldTypeRow[],
  fishingType: "sea" | "freshwater",
) {
  const matchedFieldType = fieldTypes.find((fieldType) =>
    fishingType === "sea"
      ? fieldType.name?.includes("바다")
      : fieldType.name?.includes("민물"),
  );

  if (matchedFieldType) {
    return matchedFieldType.id;
  }

  return fishingType === "sea" ? 1 : 2;
}

function getTideName(dateValue: RegisterLogFormState["date"]) {
  if (!dateValue) {
    return "";
  }

  try {
    return getTideBySolarDate(new Date(`${dateValue}T12:00:00+09:00`)).mulName;
  } catch {
    return "";
  }
}

function hasText(value: string) {
  return value.trim().length > 0;
}

function toCreateLogInput(
  formData: RegisterLogFormState,
): CreateLogInput {
  const fieldTypeId = Number.parseInt(formData.fieldTypeId, 10);
  const catchCount = parseCount(formData.catchCount, "INVALID_CATCH_COUNT");

  if (!Number.isFinite(fieldTypeId)) {
    throw new Error("FIELD_TYPE_ID_REQUIRED");
  }

  return {
    p_catch_count: catchCount,
    p_date: requireText(formData.date, "DATE_REQUIRED"),
    p_field_type_id: fieldTypeId,
    p_location_name: requireText(formData.locationName, "LOCATION_NAME_REQUIRED"),
    p_latitude: toOptionalValue(formData.latitude),
    p_longitude: toOptionalValue(formData.longitude),
    p_max_size_cm: parseNumber(formData.maxSize),
    p_memo: toOptionalText(formData.memo),
    p_species_name: requireText(formData.species, "SPECIES_REQUIRED"),
    p_tide: toOptionalText(formData.tide),
    p_time: requireText(formData.time, "TIME_REQUIRED"),
    p_water_temperature_c: parseNumber(formData.waterTemperature),
    p_weather: requireText(formData.weather, "WEATHER_REQUIRED"),
  };
}

function requireText(value: string, errorCode: string) {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    throw new Error(errorCode);
  }

  return normalizedValue;
}

function toOptionalText(value: string) {
  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

function parseNumber(value: string) {
  if (value.trim().length === 0) {
    return undefined;
  }

  const normalizedValue = Number(value);

  if (!Number.isFinite(normalizedValue)) {
    throw new Error("INVALID_NUMBER");
  }

  return normalizedValue;
}

function toOptionalValue<Value>(value: Value | null) {
  return value ?? undefined;
}

function parseCount(value: string, errorCode: string) {
  if (value.trim().length === 0) {
    throw new Error(errorCode);
  }

  const normalizedValue = Number(value);

  if (!Number.isInteger(normalizedValue) || normalizedValue < 0) {
    throw new Error(errorCode);
  }

  return normalizedValue;
}

function getSubmitError(error: unknown) {
  const message =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message
      : null;

  switch (message) {
    case "AUTH_REQUIRED":
      return "로그인 정보가 만료되었습니다. 다시 로그인한 뒤 시도해주세요.";
    case "FIELD_TYPE_ID_REQUIRED":
      return "낚시 유형을 다시 선택해주세요.";
    case "SPECIES_REQUIRED":
      return "어종을 선택해주세요.";
    case "DATE_REQUIRED":
      return "날짜를 입력해주세요.";
    case "TIME_REQUIRED":
      return "시간을 입력해주세요.";
    case "LOCATION_NAME_REQUIRED":
      return "포인트 명칭을 입력해주세요.";
    case "WEATHER_REQUIRED":
      return "날씨를 선택해주세요.";
    case "INVALID_CATCH_COUNT":
      return "마릿수는 0 이상의 정수만 입력할 수 있습니다.";
    case "MAX_SIZE_REQUIRES_CATCH":
      return "마릿수가 0이면 최대어 크기는 비워야 합니다.";
    case "INVALID_MAX_SIZE":
      return "최대어 크기 값이 올바르지 않습니다.";
    default:
      return "조과 기록 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
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
