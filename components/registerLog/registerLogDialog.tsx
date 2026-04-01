"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { PlusIcon } from "@/components/icons/plus/plus";
import { XIcon } from "@/components/icons/x/x";
import type { FieldTypeRow } from "@jogwa-log/data-access/api/referenceData/fieldTypes";
import type { FishRow } from "@jogwa-log/data-access/api/referenceData/fish";

import {
  useFieldTypes,
  useFishRows,
} from "@/components/providers/referenceDataProvider";
import { getTideBySolarDate } from "@/packages/shared/tideFormatter";

import { RegisterCatchInfoStep } from "./registerCatchInfoStep";
import { RegisterLogFooter } from "./registerLogFooter";
import { RegisterLogProgress } from "./registerLogProgress";
import { createInitialFormState } from "./registerLogFormState";
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
  const [isOpen, setIsOpen] = useState(false);
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const fieldTypes = useFieldTypes();
  const fishRows = useFishRows();
  const registerLogForm = useForm<RegisterLogFormState>({
    defaultValues: createInitialFormState(),
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
  const speciesOptions = getSpeciesOptions({
    fieldTypeId,
    fishRows,
  });

  const resetState = useCallback(() => {
    setRegisterStep(1);
    reset(createInitialFormState());
  }, [reset]);

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

  function handleFishingTypeSelect(nextFishingType: "sea" | "freshwater") {
    setValue("fishingType", nextFishingType, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(
      "fieldTypeId",
      String(resolveFieldTypeId(fieldTypes, nextFishingType)),
      { shouldDirty: true, shouldValidate: true },
    );
    setValue("species", "", { shouldDirty: true, shouldValidate: true });
    setValue(
      "tide",
      nextFishingType === "sea" ? getTideNameForDate(getValues("date")) : "",
      { shouldDirty: true, shouldValidate: true },
    );
  }

  function handlePrevious() {
    setRegisterStep(Math.max(1, registerStep - 1) as RegisterStep);
  }

  async function handleNext() {
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

    void handleSubmit((formData) => {
      console.log("registerLog form data", formData);
      handleClose();
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

  useEffect(() => {
    if (fishingType !== "sea") {
      if (getValues("tide")) {
        setValue("tide", "");
      }

      return;
    }

    const nextTide = getTideNameForDate(date);

    if (getValues("tide") !== nextTide) {
      setValue("tide", nextTide);
    }
  }, [date, fishingType, getValues, setValue]);

  const canProceed =
    registerStep === 1
      ? Boolean(fishingType)
      : registerStep === 2
        ? hasTextValue(date) &&
          hasTextValue(time) &&
          hasTextValue(species) &&
          isNonNegativeNumberString(catchCount) &&
          hasTextValue(weather) &&
          (fishingType !== "sea" || hasTextValue(tide))
      : registerStep === 3
        ? hasTextValue(locationQuery) &&
          hasTextValue(locationName) &&
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
            onClick={handleClose}
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
                className="rounded-full p-2 text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg-dim"
                onClick={handleClose}
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
                  onSelect={handleFishingTypeSelect}
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

            <RegisterLogFooter
              canProceed={canProceed}
              onNext={handleNext}
              onPrevious={handlePrevious}
              registerStep={registerStep}
            />
          </div>
        </div>
      )}
    </FormProvider>
  );
}

function getSpeciesOptions({
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

function resolveFieldTypeId(
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

function getTideNameForDate(dateValue: RegisterLogFormState["date"]) {
  if (!dateValue) {
    return "";
  }

  try {
    return getTideBySolarDate(new Date(`${dateValue}T12:00:00+09:00`)).mulName;
  } catch {
    return "";
  }
}

function hasTextValue(value: string) {
  return value.trim().length > 0;
}

function isNonNegativeNumberString(value: string) {
  if (value.trim().length === 0) {
    return false;
  }

  const normalizedValue = Number(value);

  return Number.isFinite(normalizedValue) && normalizedValue >= 0;
}
