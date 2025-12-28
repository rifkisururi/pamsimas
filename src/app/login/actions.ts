"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signSession, setSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function loginAction(formData: FormData) {
  const data = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!data.success) {
    return { ok: false, message: "Email atau password tidak valid." };
  }

  const user = await prisma.user.findUnique({
    where: { email: data.data.email },
    include: { customer: true },
  });

  if (!user) {
    return { ok: false, message: "Pengguna tidak ditemukan." };
  }

  const match = await bcrypt.compare(data.data.password, user.passwordHash);
  if (!match) {
    return { ok: false, message: "Password salah." };
  }

  const token = signSession({
    user: {
      id: user.id,
      role: user.role,
      customerId: user.customerId,
      name: user.name,
      email: user.email,
    },
  });

  await setSessionCookie(token);
  redirect("/");
}

export async function sendOtpAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  if (!email) {
    return { ok: false, message: "Masukkan email untuk OTP." };
  }
  console.log(`[OTP MOCK] Kirim OTP ke ${email}: 123456`);
  return { ok: true, message: "OTP dikirim (mock). Cek console." };
}
