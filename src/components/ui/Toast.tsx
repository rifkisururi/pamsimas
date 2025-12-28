"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  durationMs?: number;
};

export function Toast({ message, durationMs = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(timer);
  }, [durationMs]);

  if (!visible) return null;

  return (
    <div className="fixed left-1/2 top-4 z-40 w-[90%] max-w-sm -translate-x-1/2 rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-lg">
      {message}
    </div>
  );
}
