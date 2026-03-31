import type { RegisterStep } from "./registerLog.types";

interface RegisterLogProgressProps {
  registerStep: RegisterStep;
}

export function RegisterLogProgress({
  registerStep,
}: RegisterLogProgressProps) {
  return (
    <div className="h-1 w-full bg-surface-muted">
      <div
        className="h-full bg-brand transition-all duration-300 ease-in-out"
        style={{ width: `${(registerStep / 3) * 100}%` }}
      />
    </div>
  );
}
