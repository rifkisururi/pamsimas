import { prisma } from "@/lib/db";
import { PageShell } from "@/components/ui/PageShell";
import { Card } from "@/components/ui/Card";
import { requireSession } from "@/lib/require-session";
import { formatCurrency, getMonthKey } from "@/lib/utils";

export default async function AdminDashboardPage() {
  await requireSession("OWNER");

  const [totalCustomers, activeCustomers, monthInvoices, paidInvoices] =
    await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { is_active: true } }),
      prisma.invoice.findMany({ where: { billingMonth: getMonthKey() } }),
      prisma.invoice.count({
        where: { billingMonth: getMonthKey(), status: "PAID" },
      }),
    ]);

  const totalRevenue = monthInvoices
    .filter((item) => item.status === "PAID")
    .reduce((sum, item) => sum + item.total, 0);

  return (
    <PageShell title="Dashboard" subtitle="Ringkasan bulan berjalan">
      <Card>
        <p className="text-xs font-semibold uppercase text-black/40">Pelanggan</p>
        <p className="mt-2 text-2xl font-semibold">{totalCustomers}</p>
        <p className="text-sm font-medium text-black/50">
          {activeCustomers} aktif
        </p>
      </Card>
      <Card>
        <p className="text-xs font-semibold uppercase text-black/40">Tagihan</p>
        <p className="mt-2 text-2xl font-semibold">{monthInvoices.length}</p>
        <p className="text-sm font-medium text-black/50">
          {paidInvoices} sudah dibayar
        </p>
      </Card>
      <Card>
        <p className="text-xs font-semibold uppercase text-black/40">
          Penerimaan
        </p>
        <p className="mt-2 text-2xl font-semibold">
          {formatCurrency(totalRevenue)}
        </p>
        <p className="text-sm font-medium text-black/50">Bulan ini</p>
      </Card>
    </PageShell>
  );
}
