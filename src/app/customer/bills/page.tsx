import { prisma } from "@/lib/db";
import { PageShell } from "@/components/ui/PageShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatMonthLabel, getMonthKey } from "@/lib/utils";
import Link from "next/link";
import { requireSession } from "@/lib/require-session";
import { BottomNav } from "@/components/ui/BottomNav";

export default async function CustomerBillsPage() {
  const session = await requireSession("CUSTOMER");
  const billingMonth = getMonthKey();

  const invoices = await prisma.invoice.findMany({
    where: { customerId: session.user.customerId || "" },
    orderBy: { billingMonth: "desc" },
  });

  type InvoiceRow = (typeof invoices)[number];

  const current = invoices.find((invoice) => invoice.billingMonth === billingMonth);
  const history = invoices.filter(
    (invoice: InvoiceRow) => invoice.billingMonth !== billingMonth
  );

  return (
    <>
      <PageShell
        title="Tagihan Saya"
        subtitle="Status pembayaran & riwayat"
        withBottomPadding
      >
        {current ? (
          <Card className="border-2 border-emerald-300 bg-emerald-50/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-emerald-700">
                  Bulan ini
                </p>
                <p className="text-lg font-semibold text-black">
                  {formatCurrency(current.total)}
                </p>
              </div>
              <Badge
                label={current.status}
                tone={current.status === "PAID" ? "success" : "warning"}
              />
            </div>
            <Link
              href={`/customer/bills/${current.id}`}
              className="mt-3 inline-flex text-xs font-semibold text-emerald-800"
            >
              Detail tagihan
            </Link>
          </Card>
        ) : (
          <Card>Belum ada tagihan bulan ini.</Card>
        )}

        <div className="mt-2 text-xs font-semibold uppercase text-black/40">
          Riwayat
        </div>
        {history.map((invoice: InvoiceRow) => (
          <Card key={invoice.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-black">
                {formatMonthLabel(invoice.billingMonth)}
              </p>
              <Badge
                label={invoice.status}
                tone={invoice.status === "PAID" ? "success" : "neutral"}
              />
            </div>
            <p className="text-sm font-semibold text-black">
              {formatCurrency(invoice.total)}
            </p>
            <Link
              href={`/customer/bills/${invoice.id}`}
              className="text-xs font-semibold text-emerald-700"
            >
              Lihat detail
            </Link>
          </Card>
        ))}
      </PageShell>
      <BottomNav
        items={[
          { href: "/customer/bills", label: "Tagihan" },
          { href: "/logout", label: "Keluar" },
        ]}
        activePath="/customer/bills"
      />
    </>
  );
}
