"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";

import {
  createReferenceDataStore,
  type ReferenceDataState,
  type ReferenceDataStore,
} from "@/stores/referenceDataStore";

const ReferenceDataStoreContext = createContext<ReferenceDataStore | null>(null);

interface ReferenceDataProviderProps {
  children: ReactNode;
  initialState: ReferenceDataState;
}

export function ReferenceDataProvider({
  children,
  initialState,
}: ReferenceDataProviderProps) {
  const [store] = useState(() => createReferenceDataStore(initialState));

  return (
    <ReferenceDataStoreContext.Provider value={store}>
      {children}
    </ReferenceDataStoreContext.Provider>
  );
}

export function useReferenceDataStore<T>(
  selector: (state: ReferenceDataState) => T,
) {
  const store = useContext(ReferenceDataStoreContext);

  if (store === null) {
    throw new Error(
      "useReferenceDataStore must be used within ReferenceDataProvider.",
    );
  }

  return useStore(store, selector);
}

export function useFieldTypes() {
  return useReferenceDataStore((state) => state.fieldTypes);
}

export function useFishRows() {
  return useReferenceDataStore((state) => state.fishRows);
}
