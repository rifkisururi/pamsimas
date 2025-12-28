import type { Role } from "@/lib/roles";
import { getSession } from "@/lib/auth";

export async function requireRole(role: Role) {
  const session = await getSession();
  if (!session || session.user.role !== role) {
    throw new Error("Unauthorized");
  }
  return session;
}
