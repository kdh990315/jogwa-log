"use client";

import { useDeferredValue, useEffect, useState } from "react";

import { SearchIcon } from "@/components/icons/search/search";
import { XIcon } from "@/components/icons/x/x";

interface SpeciesSelectSheetProps {
  isOpen: boolean;
  options: readonly string[];
  selectedSpecies: string;
  onClose: () => void;
  onSelect: (species: string) => void;
}

export function SpeciesSelectSheet({
  isOpen,
  options,
  selectedSpecies,
  onClose,
  onSelect,
}: SpeciesSelectSheetProps) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const query = deferredSearch.trim().toLowerCase();
  const filteredOptions = options.filter((option) =>
    !query ? true : option.toLowerCase().includes(query),
  );

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        aria-label="어종 선택 시트 닫기"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />
      <div
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 flex max-h-[78vh] flex-col rounded-t-[28px] border border-line-card bg-surface-card shadow-2xl sm:inset-x-1/2 sm:bottom-auto sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px]"
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-line-muted px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-fg">대상 어종 선택</h3>
            <p className="mt-1 text-xs text-fg-dim">
              검색하거나 목록에서 바로 선택하세요.
            </p>
          </div>
          <button
            aria-label="어종 선택 시트 닫기"
            className="rounded-full p-2 text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg"
            onClick={onClose}
            type="button"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-line-muted px-5 py-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
            <input
              className="w-full rounded-xl border border-line bg-surface-muted py-3 pl-10 pr-4 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="어종 검색"
              type="text"
              value={search}
            />
          </div>
        </div>

        <div className="min-h-[18rem] flex-1 overflow-y-auto px-3 py-3 sm:min-h-[20rem]">
          {filteredOptions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-surface-muted px-4 py-10 text-center text-sm text-fg-dim">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredOptions.map((option) => {
                const isSelected = selectedSpecies === option;

                return (
                  <button
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-brand-surface text-brand-fg"
                        : "text-fg hover:bg-surface-muted"
                    }`}
                    key={option}
                    onClick={() => onSelect(option)}
                    type="button"
                  >
                    <span>{option}</span>
                    {isSelected ? (
                      <span className="text-xs font-semibold">선택됨</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
