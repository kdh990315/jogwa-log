import { MapIcon } from "@/components/icons/map/map";
import { SearchIcon } from "@/components/icons/search/search";

import type {
  RegisterLogFormState,
  UpdateRegisterLogField,
} from "./registerLog.types";

interface RegisterLocationStepProps {
  formState: RegisterLogFormState;
  onFieldChange: UpdateRegisterLogField;
}

export function RegisterLocationStep({
  formState,
  onFieldChange,
}: RegisterLocationStepProps) {
  return (
    <div className="flex h-full flex-col space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <label
          className="mb-1.5 ml-1 block text-xs font-bold uppercase text-slate-500"
          htmlFor="register-log-location"
        >
          장소 검색
        </label>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-xl border border-line bg-surface-muted py-3 pl-10 pr-4 text-sm transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            id="register-log-location"
            onChange={(event) =>
              onFieldChange("locationQuery", event.target.value)
            }
            placeholder="항구, 방파제, 낚시터 검색..."
            type="text"
            value={formState.locationQuery}
          />
        </div>
      </div>

      <div className="group relative flex min-h-[200px] flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line bg-surface-muted transition-colors hover:border-brand-border">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-col items-center p-6 text-center">
          <div className="mb-3 rounded-full bg-white p-3 text-brand-fg shadow-md">
            <MapIcon className="h-6 w-6" />
          </div>
          <p className="font-bold text-slate-700">지도에서 포인트 선택</p>
          <p className="mt-1 max-w-[200px] text-xs text-slate-500">
            지도를 움직여 정확한 낚시 포인트를 지정해주세요.
          </p>
        </div>
      </div>

      <div>
        <label
          className="mb-1.5 ml-1 block text-xs font-bold uppercase text-slate-500"
          htmlFor="register-log-memo"
        >
          메모
        </label>
        <textarea
          className="h-24 w-full resize-none rounded-xl border border-line bg-surface-muted p-3 text-sm transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          id="register-log-memo"
          onChange={(event) => onFieldChange("memo", event.target.value)}
          placeholder="채비, 미끼, 특이사항 등을 기록하세요..."
          value={formState.memo}
        />
      </div>
    </div>
  );
}
