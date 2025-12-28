type BadgeProps = {
  label: string;
  tone?: "success" | "warning" | "neutral" | "danger";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  neutral: "bg-slate-100 text-slate-700",
  danger: "bg-rose-100 text-rose-700",
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {label}
    </span>
  );
}
