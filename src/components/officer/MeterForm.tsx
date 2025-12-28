"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

type MeterFormProps = {
  customerId: string;
  meterAwal: number;
  tarifPerM3: number;
  biayaBeban: number;
  action: (formData: FormData) => void | Promise<void>;
};

export function MeterForm({
  customerId,
  meterAwal,
  tarifPerM3,
  biayaBeban,
  action,
}: MeterFormProps) {
  const [meterAkhir, setMeterAkhir] = useState("");

  const { pemakaian, total, isValid } = useMemo(() => {
    const akhir = Number(meterAkhir);
    const usage = Number.isFinite(akhir) ? Math.max(0, akhir - meterAwal) : 0;
    return {
      pemakaian: usage,
      total: usage * tarifPerM3 + biayaBeban,
      isValid: meterAkhir !== "" && akhir >= meterAwal,
    };
  }, [meterAkhir, meterAwal, tarifPerM3, biayaBeban]);

  return (
    <form action={action} className="mt-4 grid gap-3">
      <input type="hidden" name="customerId" value={customerId} />
      <Input
        label="Meter awal (read-only)"
        name="meterAwal"
        defaultValue={meterAwal}
        readOnly
        inputMode="numeric"
      />
      <Input
        label="Meter akhir"
        name="meterAkhir"
        inputMode="numeric"
        required
        value={meterAkhir}
        onChange={(event) => setMeterAkhir(event.target.value)}
        className={isValid ? "" : "border-rose-300"}
      />
      <div className="rounded-[12px] bg-emerald-50/70 p-3 text-xs font-semibold text-black/60">
        <div>Pemakaian: {pemakaian} m3</div>
        <div>Biaya beban: {formatCurrency(biayaBeban)}</div>
        <div>Total tagihan: {formatCurrency(total)}</div>
      </div>
      <Button type="submit" fullWidth disabled={!isValid}>
        SIMPAN
      </Button>
    </form>
  );
}
