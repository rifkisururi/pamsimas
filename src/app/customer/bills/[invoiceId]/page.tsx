import { prisma } from "@/lib/db";
import { PageShell } from "@/components/ui/PageShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatMonthLabel } from "@/lib/utils";
import { requireSession } from "@/lib/require-session";

type PageProps = {
  params: { invoiceId: string };
};

export default async function CustomerInvoiceDetailPage({ params }: PageProps) {
  const session = await requireSession("CUSTOMER");
  const invoice = await prisma.invoice.findFirst({
    where: { id: params.invoiceId, customerId: session.user.customerId || "" },
    include: { customer: true },
  });

  if (!invoice) {
    return (
      <PageShell title="Detail Tagihan" subtitle="Data tidak ditemukan">
        <Card>Tagihan tidak tersedia.</Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Detail Tagihan"
      subtitle={formatMonthLabel(invoice.billingMonth)}
    >
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-black">
            {invoice.customer.name}
          </p>
          <Badge
            label={invoice.status}
            tone={invoice.status === "PAID" ? "success" : "warning"}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-black/60">
          <div>Meter awal: {invoice.meterAwal}</div>
          <div>Meter akhir: {invoice.meterAkhir}</div>
          <div>Pemakaian: {invoice.pemakaian} m3</div>
          <div>Tarif/m3: {formatCurrency(invoice.tarifPerM3)}</div>
          <div>Biaya beban: {formatCurrency(invoice.biayaBeban)}</div>
          <div>Total: {formatCurrency(invoice.total)}</div>
        </div>
        <a
          href={`/customer/bills/${invoice.id}/pdf`}
          className="inline-flex text-xs font-semibold text-emerald-700"
        >
          Download invoice PDF
        </a>
      </Card>
    </PageShell>
  );
}
