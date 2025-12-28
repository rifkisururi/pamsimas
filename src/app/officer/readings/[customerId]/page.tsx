import { prisma } from "@/lib/db";
import { PageShell } from "@/components/ui/PageShell";
import { Card } from "@/components/ui/Card";
import { getMonthKey, formatCurrency } from "@/lib/utils";
import { saveReading } from "./actions";
import { requireSession } from "@/lib/require-session";
import { MeterForm } from "@/components/officer/MeterForm";

type PageProps = {
  params: { customerId: string } | Promise<{ customerId: string }>;
};

export default async function OfficerReadingDetailPage({ params }: PageProps) {
  await requireSession("OFFICER");
  const resolvedParams = await Promise.resolve(params);
  const rawCustomerId = resolvedParams?.customerId;
  const customerId = Array.isArray(rawCustomerId)
    ? rawCustomerId[0]
    : rawCustomerId;

  if (!customerId) {
    return (
      <PageShell title="Form Catat Meter" subtitle="Pelanggan tidak ditemukan">
        <Card>Data pelanggan tidak tersedia.</Card>
      </PageShell>
    );
  }
  const billingMonth = getMonthKey();
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      meterReadings: { orderBy: { billingMonth: "desc" }, take: 1 },
    },
  });

  if (!customer) {
    return (
      <PageShell title="Catat Meter" subtitle="Pelanggan tidak ditemukan">
        <Card>Data pelanggan tidak tersedia.</Card>
      </PageShell>
    );
  }

  const existing = await prisma.meterReading.findUnique({
    where: {
      customerId_billingMonth: { customerId: customer.id, billingMonth },
    },
  });

  const lastReading = customer.meterReadings[0];
  const meterAwal = lastReading?.meterAkhir ?? 0;
  const settings = await prisma.setting.findFirst();
  const tarifPerM3 = settings?.tarifPerM3 ?? 0;
  const biayaBeban = settings?.biayaBeban ?? 3000;

  return (
    <PageShell
      title="Form Catat Meter"
      subtitle={`${customer.name} - ${customer.nomor_pelanggan}`}
      actions={
        <a
          href="/officer/readings"
          className="inline-flex items-center gap-2 rounded-[12px] border border-black/10 px-3 py-2 text-xs font-semibold text-black/60"
        >
          {"<-"} Kembali
        </a>
      }
    >
      <Card>
        <div className="text-xs font-semibold uppercase text-black/40">
          {billingMonth}
        </div>
        {existing ? (
          <div className="mt-3 space-y-2 text-sm font-semibold">
            <p>Meter awal: {existing.meterAwal}</p>
            <p>Meter akhir: {existing.meterAkhir}</p>
            <p>Pemakaian: {existing.pemakaian} m3</p>
            <p>
              Total:{" "}
              {formatCurrency(
                existing.pemakaian * tarifPerM3 + biayaBeban
              )}
            </p>
            <p className="text-emerald-700">Sudah dicatat bulan ini.</p>
          </div>
        ) : (
          <MeterForm
            action={saveReading}
            customerId={customer.id}
            meterAwal={meterAwal}
            tarifPerM3={tarifPerM3}
            biayaBeban={biayaBeban}
          />
        )}
      </Card>
    </PageShell>
  );
}
