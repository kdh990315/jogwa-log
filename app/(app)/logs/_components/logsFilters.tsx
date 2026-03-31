import { SearchIcon } from "@/components/icons/search/search";

interface LogsFiltersProps {
  filterMethod: string;
  filterSpecies: string;
  filteredCount: number;
  hasActiveFilters: boolean;
  methodList: string[];
  onFilterMethodChange: (value: string) => void;
  onFilterSpeciesChange: (value: string) => void;
  onReset: () => void;
  onSearchChange: (value: string) => void;
  search: string;
  speciesList: string[];
}

export function LogsFilters({
  filterMethod,
  filterSpecies,
  filteredCount,
  hasActiveFilters,
  methodList,
  onFilterMethodChange,
  onFilterSpeciesChange,
  onReset,
  onSearchChange,
  search,
  speciesList,
}: LogsFiltersProps) {
  return (
    <div className="rounded-2xl border-none bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted" />
          <input
            className="w-full rounded-lg border border-line bg-surface-muted py-1.5 pl-8 pr-3 text-xs text-fg outline-none focus:ring-1 focus:ring-brand-fg"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="어종, 장소 검색..."
            value={search}
          />
        </div>
        <select
          className="cursor-pointer rounded-lg border border-line bg-surface-muted py-1.5 pl-2.5 pr-6 text-xs text-fg-dim outline-none"
          onChange={(event) => onFilterSpeciesChange(event.target.value)}
          value={filterSpecies}
        >
          {speciesList.map((species) => (
            <option key={species}>{species}</option>
          ))}
        </select>
        <select
          className="cursor-pointer rounded-lg border border-line bg-surface-muted py-1.5 pl-2.5 pr-6 text-xs text-fg-dim outline-none"
          onChange={(event) => onFilterMethodChange(event.target.value)}
          value={filterMethod}
        >
          {methodList.map((method) => (
            <option key={method}>{method}</option>
          ))}
        </select>
      </div>

      {hasActiveFilters ? (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[10px] text-fg-faint">
            <span className="font-semibold text-brand-fg">{filteredCount}건</span>{" "}
            검색됨
          </p>
          <button
            className="text-[10px] text-fg-muted transition-colors hover:text-fg"
            onClick={onReset}
            type="button"
          >
            초기화
          </button>
        </div>
      ) : null}
    </div>
  );
}
