import { PlusIcon } from "@/components/icons/plus/plus";

interface RegisterLogTriggerButtonProps {
  className?: string;
  label: string;
  onClick: () => void;
}

export function RegisterLogTriggerButton({
  className,
  label,
  onClick,
}: RegisterLogTriggerButtonProps) {
  return (
    <button
      className={`${className ?? ""} flex items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover hover:shadow-md active:scale-95`}
      onClick={onClick}
      type="button"
    >
      <PlusIcon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
