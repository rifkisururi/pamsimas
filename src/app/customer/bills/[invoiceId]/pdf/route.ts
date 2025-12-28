import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatCurrency, formatMonthLabel } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: { invoiceId: string } }
) {
  const session = await getSession();
  if (!session || session.user.role !== "CUSTOMER") {
    return new Response("Unauthorized", { status: 401 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: params.invoiceId, customerId: session.user.customerId || "" },
    include: { customer: true },
  });

  if (!invoice) {
    return new Response("Not found", { status: 404 });
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();

  page.drawText("INVOICE AIR", {
    x: 50,
    y: height - 80,
    size: 20,
    font,
    color: rgb(0, 0.4, 0.3),
  });

  const lines = [
    `Nama: ${invoice.customer.name}`,
    `Nomor Pelanggan: ${invoice.customer.nomor_pelanggan}`,
    `Periode: ${formatMonthLabel(invoice.billingMonth)}`,
    `Meter Awal: ${invoice.meterAwal}`,
    `Meter Akhir: ${invoice.meterAkhir}`,
    `Pemakaian: ${invoice.pemakaian} m3`,
    `Tarif per m3: ${formatCurrency(invoice.tarifPerM3)}`,
    `Biaya Beban: ${formatCurrency(invoice.biayaBeban)}`,
    `Total: ${formatCurrency(invoice.total)}`,
    `Status: ${invoice.status}`,
  ];

  lines.forEach((line, index) => {
    page.drawText(line, {
      x: 50,
      y: height - 130 - index * 22,
      size: 12,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
  });

  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${invoice.billingMonth}.pdf"`,
    },
  });
}
