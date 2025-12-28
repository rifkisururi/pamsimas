"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";

const customerSchema = z.object({
  nomor_pelanggan: z.string().min(3),
  name: z.string().min(2),
  rt: z.string().min(1),
  rw: z.string().min(1),
  desa: z.string().min(1),
  nomor_wa: z.string().min(6),
  email: z.string().email(),
  alamat: z.string().optional(),
  catatan: z.string().optional(),
  is_active: z.boolean().optional(),
});

export async function createCustomer(formData: FormData) {
  const data = customerSchema.safeParse({
    nomor_pelanggan: formData.get("nomor_pelanggan"),
    name: formData.get("name"),
    rt: formData.get("rt"),
    rw: formData.get("rw"),
    desa: formData.get("desa"),
    nomor_wa: formData.get("nomor_wa"),
    email: formData.get("email"),
    alamat: formData.get("alamat") || undefined,
    catatan: formData.get("catatan") || undefined,
    is_active: formData.get("is_active") === "on",
  });

  if (!data.success) {
    return;
  }

  await requireRole("OWNER");
  await prisma.customer.create({ data: data.data });
  revalidatePath("/admin/customers");
}

export async function updateCustomer(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const data = customerSchema.safeParse({
    nomor_pelanggan: formData.get("nomor_pelanggan"),
    name: formData.get("name"),
    rt: formData.get("rt"),
    rw: formData.get("rw"),
    desa: formData.get("desa"),
    nomor_wa: formData.get("nomor_wa"),
    email: formData.get("email"),
    alamat: formData.get("alamat") || undefined,
    catatan: formData.get("catatan") || undefined,
    is_active: formData.get("is_active") === "on",
  });

  if (!data.success) {
    return;
  }

  await requireRole("OWNER");
  await prisma.customer.update({
    where: { id },
    data: data.data,
  });

  revalidatePath("/admin/customers");
}

export async function deleteCustomer(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await requireRole("OWNER");
  await prisma.customer.delete({ where: { id } });
  revalidatePath("/admin/customers");
}
