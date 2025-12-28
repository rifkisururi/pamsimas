import { prisma } from "@/lib/db";
import { PageShell } from "@/components/ui/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { formatCurrency, getMonthKey } from "@/lib/utils";
import { recordPayment } from "./actions";
import { requireSession } from "@/lib/require-session";
import { Prisma } from "@prisma/client";

type PageProps = {
  searchParams?:
    | { q?: string | string[]; success?: string | string[] }
    | Promise<{ q?: string | string[]; success?: string | string[] }>;
};

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage({ searchParams }: PageProps) {
  await requireSession("OWNER");
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const rawQuery = resolvedSearchParams?.q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim();
  const success = Array.isArray(resolvedSearchParams?.success)
    ? resolvedSearchParams?.success[0]
    : resolvedSearchParams?.success;
  const invoices = await prisma.invoice.findMany({
    where: {
      billingMonth: getMonthKey(),
      status: { in: ["ISSUED", "OVERDUE"] },
      ...(query
        ? {
            customer: {
              is: {
                OR: [
                  {
                    name: { contains: query, mode: Prisma.QueryMode.insensitive },
                  },
                  {
                    nomor_pelanggan: {
                      contains: query,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    desa: { contains: query, mode: Prisma.QueryMode.insensitive },
                  },
                ],
              },
            },
          }
        : {}),
    },
    include: { customer: true },
    orderBy: { dueDate: "asc" },
  });

  return (
    <PageShell
      title="Pembayaran"
      subtitle="Input manual pembayaran"
      actions={
        <form className="flex gap-2" action="/admin/payments">
          <input
            name="q"
            placeholder="Cari nama / nomor"
            className="h-10 w-32 rounded-[12px] border border-black/10 bg-white px-3 text-xs font-semibold"
            defaultValue={query}
          />
          <Button variant="secondary" type="submit">
            Cari
          </Button>
        </form>
      }
    >
      {success === "1" ? (
        <Toast message="Pembayaran berhasil disimpan." durationMs={3000} />
      ) : null}
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-black">
              {invoice.customer.name}
            </p>
            <p className="text-xs font-medium text-black/50">
              {invoice.customer.nomor_pelanggan} - {invoice.customer.desa}
            </p>
          </div>
          <div className="text-sm font-semibold text-black">
            Total {formatCurrency(invoice.total)}
          </div>
          <form action={recordPayment} className="grid gap-3">
            <input type="hidden" name="invoiceId" value={invoice.id} />
            <input type="hidden" name="customerId" value={invoice.customerId} />
            <input
              type="hidden"
              name="redirectTo"
              value={`/admin/payments${query ? `?q=${encodeURIComponent(query)}` : ""}`}
            />
            <Button type="submit" fullWidth>
              Tandai Lunas
            </Button>
          </form>
        </Card>
      ))}
    </PageShell>
  );
}
