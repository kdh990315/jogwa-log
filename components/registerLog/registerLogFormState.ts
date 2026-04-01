import {
  formatDateInputValue,
  formatTimeInputValue,
} from "@/utils/format/date";

import type { RegisterLogFormState } from "./registerLog.types";

export function createInitialFormState(): RegisterLogFormState {
  const now = new Date();

  return {
    catchCount: "0",
    date: formatDateInputValue(now),
    fieldTypeId: "",
    fishingType: null,
    latitude: null,
    locationName: "",
    locationQuery: "",
    longitude: null,
    maxSize: "",
    memo: "",
    species: "",
    tide: "",
    time: formatTimeInputValue(now),
    waterTemperature: "",
    weather: "",
  };
}
