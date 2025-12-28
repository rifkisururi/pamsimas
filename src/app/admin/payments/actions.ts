"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  customerId: z.string().min(1),
  redirectTo: z.string().optional(),
});

export async function recordPayment(formData: FormData) {
  const data = paymentSchema.safeParse({
    invoiceId: formData.get("invoiceId"),
    customerId: formData.get("customerId"),
    redirectTo: formData.get("redirectTo") || undefined,
  });

  if (!data.success) return { ok: false };

  const session = await getSession();
  if (!session || !["OWNER", "COLLECTOR"].includes(session.user.role)) {
    return { ok: false };
  }
  const invoice = await prisma.invoice.findUnique({
    where: { id: data.data.invoiceId },
  });

  if (!invoice) return { ok: false };

  await prisma.payment.create({
    data: {
      invoiceId: data.data.invoiceId,
      customerId: data.data.customerId,
      amount: invoice.total,
      method: "CASH",
    },
  });

  await prisma.invoice.update({
    where: { id: data.data.invoiceId },
    data: { status: "PAID", paidAt: new Date() },
  });

  const redirectTo =
    data.data.redirectTo &&
    (data.data.redirectTo.startsWith("/admin/payments") ||
      data.data.redirectTo.startsWith("/cashier/payments"))
      ? data.data.redirectTo
      : "/admin/payments";

  revalidatePath("/admin/payments");
  revalidatePath("/cashier/payments");
  redirect(`${redirectTo}${redirectTo.includes("?") ? "&" : "?"}success=1`);
}
