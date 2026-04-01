import { createStore } from "zustand/vanilla";

import type { FieldTypeRow } from "@jogwa-log/data-access/api/referenceData/fieldTypes";
import type { FishRow } from "@jogwa-log/data-access/api/referenceData/fish";

export interface ReferenceDataState {
  fieldTypes: FieldTypeRow[];
  fishRows: FishRow[];
}

export type ReferenceDataStore = ReturnType<typeof createReferenceDataStore>;

export function createReferenceDataStore(initialState: ReferenceDataState) {
  return createStore<ReferenceDataState>()(() => initialState);
}
