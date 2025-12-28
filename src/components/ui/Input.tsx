import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function Input({ label, hint, className = "", ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-black/80">
      <span>{label}</span>
      <input
        {...props}
        className={`h-11 rounded-[12px] border border-black/10 bg-white px-3 text-sm font-medium text-black/90 placeholder:text-black/30 focus:border-emerald-400 focus:outline-none ${className}`}
      />
      {hint ? (
        <span className="text-xs font-medium text-black/40">{hint}</span>
      ) : null}
    </label>
  );
}
