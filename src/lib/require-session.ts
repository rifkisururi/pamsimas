import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { Role } from "@/lib/roles";

export async function requireSession(role?: Role) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (role && session.user.role !== role) redirect("/");
  return session;
}
