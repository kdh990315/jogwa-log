import {
  formatDateInputValue,
  formatTimeInputValue,
} from "@/utils/format/date";

import type { RegisterLogFormState } from "./registerLog.types";

export function createInitialFormState(): RegisterLogFormState {
  const now = new Date();

  return {
    catchCount: "",
    date: formatDateInputValue(now),
    fieldTypeId: "",
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
