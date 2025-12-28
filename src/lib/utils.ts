import { format } from "date-fns";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split("-").map((item) => Number(item));
  if (!year || !month) return monthKey;
  return format(new Date(year, month - 1, 1), "MMMM yyyy");
};

export const getMonthKey = (date = new Date()) => format(date, "yyyy-MM");

export const toNumber = (value: FormDataEntryValue | null) =>
  value ? Number(value) : 0;
