import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--accent)] text-white shadow-md shadow-emerald-200/60 hover:bg-[color:var(--accent-strong)]",
  secondary:
    "bg-white text-[color:var(--foreground)] border border-black/10 hover:border-black/20",
  ghost: "bg-transparent text-[color:var(--accent-strong)] hover:bg-emerald-50",
  danger: "bg-[color:var(--danger)] text-white hover:bg-red-700",
};

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    fullWidth?: boolean;
  }
>;

export function Button({
  children,
  className = "",
  variant = "primary",
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-[14px] px-5 py-3 text-sm font-semibold transition ${
        variants[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
