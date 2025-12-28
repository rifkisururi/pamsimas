import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{ className?: string }>;

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[18px] border border-black/5 bg-white/90 p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
