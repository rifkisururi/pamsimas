import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const PrismaClientCtor =
  (pkg as unknown as { PrismaClient?: new (...args: any[]) => any })
    .PrismaClient ??
  (pkg as unknown as { default?: new (...args: any[]) => any }).default;

if (!PrismaClientCtor) {
  throw new Error("PrismaClient not found in @prisma/client");
}

const globalForPrisma = globalThis as unknown as {
  prisma?: InstanceType<typeof PrismaClientCtor>;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClientCtor({
    log: ["error", "warn"],
    adapter: new PrismaPg(
      new Pool({
        connectionString: process.env.DATABASE_URL,
      })
    ),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
