import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { Role } from "@/lib/roles";

const COOKIE_NAME = "pdam_session";

export type SessionUser = {
  id: string;
  role: Role;
  customerId?: string | null;
  name: string;
  email: string;
};

export type SessionPayload = {
  user: SessionUser;
};

export function signSession(payload: SessionPayload) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const secret = process.env.SESSION_SECRET;
    if (!secret) throw new Error("SESSION_SECRET is not set");
    return jwt.verify(token, secret) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { expires: new Date(0), path: "/" });
}
