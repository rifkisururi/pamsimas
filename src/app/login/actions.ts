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
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: data.data.email },
    include: { customer: true },
  });

  if (!user) {
    return;
  }

  const match = await bcrypt.compare(data.data.password, user.passwordHash);
  if (!match) {
    return;
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
    return;
  }
  console.log(`[OTP MOCK] Kirim OTP ke ${email}: 123456`);
}
