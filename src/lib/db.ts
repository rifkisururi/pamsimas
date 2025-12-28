import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const { PrismaClient } = pkg;

const globalForPrisma = globalThis as unknown as {
  prisma?: InstanceType<typeof PrismaClient>;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
    adapter: new PrismaPg(
      new Pool({
        connectionString: process.env.DATABASE_URL,
      })
    ),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
