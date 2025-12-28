"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { getMonthKey } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/rbac";

const readingSchema = z.object({
  customerId: z.string().min(1),
  meterAwal: z.coerce.number().min(0),
  meterAkhir: z.coerce.number().min(0),
});

export async function saveReading(formData: FormData) {
  const parsed = readingSchema.safeParse({
    customerId: formData.get("customerId"),
    meterAwal: formData.get("meterAwal"),
    meterAkhir: formData.get("meterAkhir"),
  });

  if (!parsed.success) {
    return;
  }

  if (parsed.data.meterAkhir < parsed.data.meterAwal) {
    return;
  }

  await requireRole("OFFICER");
  const billingMonth = getMonthKey();
  const pemakaian = parsed.data.meterAkhir - parsed.data.meterAwal;
  const settings = await prisma.setting.findFirst();

  const existing = await prisma.meterReading.findUnique({
    where: {
      customerId_billingMonth: {
        customerId: parsed.data.customerId,
        billingMonth,
      },
    },
  });

  if (existing) {
    redirect("/officer/readings?success=0");
  }

  await prisma.meterReading.create({
    data: {
      customerId: parsed.data.customerId,
      billingMonth,
      meterAwal: parsed.data.meterAwal,
      meterAkhir: parsed.data.meterAkhir,
      pemakaian,
    },
  });

  const dueDate = new Date();
  dueDate.setDate(settings?.dueDayOfMonth ?? 10);

  await prisma.invoice.upsert({
    where: {
      customerId_billingMonth: {
        customerId: parsed.data.customerId,
        billingMonth,
      },
    },
    update: {
      meterAwal: parsed.data.meterAwal,
      meterAkhir: parsed.data.meterAkhir,
      pemakaian,
      tarifPerM3: settings?.tarifPerM3 ?? 0,
      biayaBeban: settings?.biayaBeban ?? 3000,
      total: pemakaian * (settings?.tarifPerM3 ?? 0) + (settings?.biayaBeban ?? 3000),
      dueDate,
      status: "ISSUED",
      issuedAt: new Date(),
    },
    create: {
      customerId: parsed.data.customerId,
      billingMonth,
      meterAwal: parsed.data.meterAwal,
      meterAkhir: parsed.data.meterAkhir,
      pemakaian,
      tarifPerM3: settings?.tarifPerM3 ?? 0,
      biayaBeban: settings?.biayaBeban ?? 3000,
      total: pemakaian * (settings?.tarifPerM3 ?? 0) + (settings?.biayaBeban ?? 3000),
      dueDate,
      status: "ISSUED",
      issuedAt: new Date(),
    },
  });

  revalidatePath("/officer/readings");
  redirect("/officer/readings?success=1");
}
