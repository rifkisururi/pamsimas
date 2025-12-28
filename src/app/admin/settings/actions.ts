"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";

const settingsSchema = z.object({
  biayaBeban: z.coerce.number().min(0),
  tarifPerM3: z.coerce.number().min(0),
  dueDayOfMonth: z.coerce.number().min(1).max(28),
});

export async function updateSettings(formData: FormData) {
  const data = settingsSchema.safeParse({
    biayaBeban: formData.get("biayaBeban"),
    tarifPerM3: formData.get("tarifPerM3"),
    dueDayOfMonth: formData.get("dueDayOfMonth"),
  });

  if (!data.success) return { ok: false };

  await requireRole("OWNER");
  const existing = await prisma.setting.findFirst();
  if (existing) {
    await prisma.setting.update({
      where: { id: existing.id },
      data: data.data,
    });
  } else {
    await prisma.setting.create({ data: data.data });
  }

  revalidatePath("/admin/settings");
  return { ok: true };
}
