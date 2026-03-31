import { ChevronLeftIcon } from "@/components/icons/chevronLeft/chevronLeft";
import { ChevronRightIcon } from "@/components/icons/chevronRight/chevronRight";
import { FishIcon } from "@/components/icons/fish/fish";
import { XIcon } from "@/components/icons/x/x";
import { Card } from "@/components/ui/card";
import type { CalendarEntry } from "@/lib/mock/dashboardData";

interface CalendarCardProps {
  calendarEntries: CalendarEntry[];
}

export function CalendarCard({ calendarEntries }: CalendarCardProps) {
  const referenceDate = new Date(calendarEntries[0]?.date ?? "2024-05-01");
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = new Date(year, month, 1).getDay();
  const today = 14;
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const entriesByDay = new Map<number, CalendarEntry>();

  calendarEntries.forEach((entry) => {
    entriesByDay.set(new Date(entry.date).getDate(), entry);
  });

  const calendarDays = Array.from(
    { length: firstDayOffset + daysInMonth },
    (_, index) => (index < firstDayOffset ? null : index - firstDayOffset + 1),
  );

  return (
    <Card className="flex h-full flex-col border-none p-4 shadow-sm lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-[color:var(--fg)]">
          출조 캘린더
        </h3>
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-1 text-[color:var(--fg-muted)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--fg-dim)]"
            type="button"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold text-[color:var(--fg)]">
            {year}. {String(month + 1).padStart(2, "0")}
          </span>
          <button
            className="rounded-lg p-1 text-[color:var(--fg-muted)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--fg-dim)]"
            type="button"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center">
        {weekDays.map((day, index) => (
          <div
            className={`mb-1 text-[10px] font-medium ${
              index === 0
                ? "text-red-400 dark:text-red-500"
                : index === 6
                  ? "text-[color:var(--brand-fg)]"
                  : "text-[color:var(--fg-muted)]"
            }`}
            key={day}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 gap-1 sm:gap-1.5">
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <div
                className="h-16 rounded-lg bg-[color:var(--surface-page)]/50 md:h-20"
                key={`empty-${index}`}
              />
            );
          }

          const entry = entriesByDay.get(day);
          const isToday = day === today;

          return (
            <div
              className={`relative flex h-16 flex-col rounded-lg border p-1 transition-all duration-200 md:h-20 ${
                isToday
                  ? "border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] ring-1 ring-[color:var(--brand-border)]/50"
                  : "border-[color:var(--line-card)] bg-[color:var(--surface)] hover:border-[color:var(--brand-border)] hover:shadow-sm"
              }`}
              key={day}
            >
              <span
                className={`mb-0.5 pl-0.5 text-[10px] font-bold ${
                  isToday
                    ? "text-[color:var(--brand-fg)]"
                    : "text-[color:var(--fg-faint)]"
                }`}
              >
                {day}
              </span>

              {entry ? (
                <div className="flex flex-1 flex-col justify-center gap-1 sm:justify-start">
                  <div className="flex w-full items-center justify-center gap-1 rounded bg-[color:var(--surface-panel)]/60 p-1 shadow-sm backdrop-blur-sm transition-all hover:bg-[color:var(--surface-panel)] sm:justify-start sm:px-1.5 sm:py-1">
                    {entry.status === "fishing" ? (
                      <>
                        <FishIcon className="h-4 w-4 shrink-0 text-[color:var(--brand-fg)] sm:h-3 sm:w-3" />
                        <span className="hidden truncate pt-0.5 text-[10px] font-bold leading-none text-[color:var(--brand-fg-strong)] sm:block">
                          {entry.species}
                        </span>
                      </>
                    ) : (
                      <>
                        <XIcon className="h-4 w-4 shrink-0 text-red-500 sm:h-3 sm:w-3" />
                        <span className="hidden truncate pt-0.5 text-[10px] font-bold leading-none text-red-700 dark:text-red-300 sm:block">
                          꽝
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
