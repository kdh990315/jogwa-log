import type { FishingMode } from "@/lib/mock/dashboardData";

export type RegisterStep = 1 | 2 | 3;

export interface RegisterLogDialogProps {
  triggerClassName?: string;
  triggerLabel?: string;
}

export interface RegisterLogImagePreview {
  file: File;
  id: string;
  previewUrl: string;
}

export interface RegisterLogFormState {
  catchCount: string;
  date: string;
  fieldTypeId: string;
  fishingType: FishingMode | null;
  latitude: number | null;
  locationName: string;
  locationQuery: string;
  longitude: number | null;
  maxSize: string;
  memo: string;
  species: string;
  tide: string;
  time: string;
  waterTemperature: string;
  weather: string;
}

export type RegisterLogFishingType = FishingMode | null;

export type UpdateRegisterLogField = <
  Key extends keyof RegisterLogFormState,
>(
  key: Key,
  value: RegisterLogFormState[Key],
) => void;
