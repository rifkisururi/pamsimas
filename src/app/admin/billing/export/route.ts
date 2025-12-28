import { prisma } from "@/lib/db";
import { getMonthKey } from "@/lib/utils";

export async function GET() {
  const billingMonth = getMonthKey();
  const invoices = await prisma.invoice.findMany({
    where: { billingMonth },
    include: { customer: true },
  });

  type InvoiceRow = (typeof invoices)[number];

  const rows: (string | number)[][] = [
    [
      "nomor_pelanggan",
      "nama",
      "desa",
      "rt",
      "rw",
      "pemakaian",
      "total",
      "status",
    ],
    ...invoices.map((invoice: InvoiceRow) => [
      invoice.customer.nomor_pelanggan,
      invoice.customer.name,
      invoice.customer.desa,
      invoice.customer.rt,
      invoice.customer.rw,
      String(invoice.pemakaian),
      String(invoice.total),
      invoice.status,
    ]),
  ];

  const csv = rows
    .map((row: (string | number)[]) =>
      row.map((cell: string | number) => `"${cell}"`).join(",")
    )
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="tagihan-${billingMonth}.csv"`,
    },
  });
}
