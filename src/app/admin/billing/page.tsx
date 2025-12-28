import { prisma } from "@/lib/db";
import { PageShell } from "@/components/ui/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatMonthLabel, getMonthKey } from "@/lib/utils";
import { generateInvoices, issueInvoices } from "./actions";
import { requireSession } from "@/lib/require-session";

export default async function AdminBillingPage() {
  await requireSession("OWNER");
  const billingMonth = getMonthKey();
  const invoices = await prisma.invoice.findMany({
    where: { billingMonth },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  type InvoiceRow = (typeof invoices)[number];

  return (
    <PageShell
      title="Tagihan"
      subtitle={`Periode ${formatMonthLabel(billingMonth)}`}
      actions={
        <a
          className="text-xs font-semibold text-emerald-700"
          href="/admin/billing/export"
        >
          Export CSV
        </a>
      }
    >
      <Card className="flex flex-col gap-3">
        <form action={generateInvoices}>
          <Button type="submit" fullWidth>
            Generate tagihan dari meter
          </Button>
        </form>
        <form action={issueInvoices}>
          <Button type="submit" variant="secondary" fullWidth>
            Terbitkan tagihan (ISSUED)
          </Button>
        </form>
      </Card>

      {invoices.map((invoice: InvoiceRow) => (
        <Card key={invoice.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-black">
                {invoice.customer.name}
              </p>
              <p className="text-xs font-medium text-black/50">
                {invoice.customer.nomor_pelanggan} - {invoice.customer.desa}
              </p>
            </div>
            <Badge
              label={invoice.status}
              tone={
                invoice.status === "PAID"
                  ? "success"
                  : invoice.status === "OVERDUE"
                  ? "danger"
                  : "warning"
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-black/60">
            <div>Awal: {invoice.meterAwal}</div>
            <div>Akhir: {invoice.meterAkhir}</div>
            <div>Pemakaian: {invoice.pemakaian} m3</div>
            <div>Total: {formatCurrency(invoice.total)}</div>
          </div>
        </Card>
      ))}
    </PageShell>
  );
}
