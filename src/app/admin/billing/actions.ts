"use server";

import { prisma } from "@/lib/db";
import { getMonthKey } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";

export async function generateInvoices() {
  await requireRole("OWNER");
  const settings = await prisma.setting.findFirst();
  const billingMonth = getMonthKey();
  const dueDay = settings?.dueDayOfMonth ?? 10;
  const dueDate = new Date();
  dueDate.setDate(dueDay);

  const readings = await prisma.meterReading.findMany({
    where: { billingMonth },
    include: { customer: true },
  });

  for (const reading of readings) {
    if (!reading.customer.is_active) continue;
    await prisma.invoice.upsert({
      where: {
        customerId_billingMonth: {
          customerId: reading.customerId,
          billingMonth,
        },
      },
      update: {
        meterAwal: reading.meterAwal,
        meterAkhir: reading.meterAkhir,
        pemakaian: reading.pemakaian,
        tarifPerM3: settings?.tarifPerM3 ?? 0,
        biayaBeban: settings?.biayaBeban ?? 3000,
        total:
          reading.pemakaian * (settings?.tarifPerM3 ?? 0) +
          (settings?.biayaBeban ?? 3000),
        dueDate,
      },
      create: {
        customerId: reading.customerId,
        billingMonth,
        meterAwal: reading.meterAwal,
        meterAkhir: reading.meterAkhir,
        pemakaian: reading.pemakaian,
        tarifPerM3: settings?.tarifPerM3 ?? 0,
        biayaBeban: settings?.biayaBeban ?? 3000,
        total:
          reading.pemakaian * (settings?.tarifPerM3 ?? 0) +
          (settings?.biayaBeban ?? 3000),
        dueDate,
        status: "DRAFT",
      },
    });
  }

  revalidatePath("/admin/billing");
  return { ok: true };
}

export async function issueInvoices() {
  await requireRole("OWNER");
  const billingMonth = getMonthKey();
  await prisma.invoice.updateMany({
    where: { billingMonth, status: "DRAFT" },
    data: { status: "ISSUED", issuedAt: new Date() },
  });

  revalidatePath("/admin/billing");
  return { ok: true };
}
