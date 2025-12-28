import "dotenv/config";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { addMonths, format } from "date-fns";

const { PrismaClient, Role, InvoiceStatus } = pkg;
const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  ),
});

const monthKey = (date: Date) => format(date, "yyyy-MM");

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.setting.create({
    data: {
      biayaBeban: 3000,
      tarifPerM3: 2500,
      dueDayOfMonth: 10,
      timezone: "Asia/Jakarta",
    },
  });

  const customers = await prisma.customer.createMany({
    data: [
      {
        nomor_pelanggan: "CUST-001",
        name: "Asep Rahmat",
        rt: "01",
        rw: "02",
        desa: "Sukamaju",
        nomor_wa: "081200000001",
        email: "asep@example.com",
        is_active: true,
        alamat: "Jl. Sukamaju 1",
      },
      {
        nomor_pelanggan: "CUST-002",
        name: "Siti Lestari",
        rt: "02",
        rw: "01",
        desa: "Sukamaju",
        nomor_wa: "081200000002",
        email: "siti@example.com",
        is_active: true,
        alamat: "Jl. Sukamaju 2",
      },
      {
        nomor_pelanggan: "CUST-003",
        name: "Budi Santoso",
        rt: "03",
        rw: "01",
        desa: "Mekarwangi",
        nomor_wa: "081200000003",
        email: "budi@example.com",
        is_active: true,
        alamat: "Jl. Mekarwangi 3",
      },
      {
        nomor_pelanggan: "CUST-004",
        name: "Rani Nur",
        rt: "01",
        rw: "03",
        desa: "Mekarwangi",
        nomor_wa: "081200000004",
        email: "rani@example.com",
        is_active: true,
        alamat: "Jl. Mekarwangi 4",
      },
      {
        nomor_pelanggan: "CUST-005",
        name: "Dedi Pratama",
        rt: "04",
        rw: "02",
        desa: "Sukamaju",
        nomor_wa: "081200000005",
        email: "dedi@example.com",
        is_active: false,
        alamat: "Jl. Sukamaju 5",
      },
    ],
  });

  const customerRecords = await prisma.customer.findMany();

  const owner = await prisma.user.create({
    data: {
      name: "Owner Admin",
      email: "owner@pdam.local",
      passwordHash,
      role: Role.OWNER,
    },
  });

  await prisma.user.create({
    data: {
      name: "Petugas Lapangan",
      email: "officer@pdam.local",
      passwordHash,
      role: Role.OFFICER,
    },
  });

  await prisma.user.create({
    data: {
      name: "Petugas Pembayaran",
      email: "collector@pdam.local",
      passwordHash,
      role: Role.COLLECTOR,
    },
  });

  for (const customer of customerRecords) {
    await prisma.user.create({
      data: {
        name: customer.name,
        email: customer.email,
        passwordHash,
        role: Role.CUSTOMER,
        customerId: customer.id,
      },
    });
  }

  const currentMonth = monthKey(new Date());
  const previousMonth = monthKey(addMonths(new Date(), -1));

  const activeCustomer = customerRecords.find((item) => item.is_active);
  if (activeCustomer) {
    await prisma.meterReading.create({
      data: {
        customerId: activeCustomer.id,
        billingMonth: previousMonth,
        meterAwal: 120,
        meterAkhir: 145,
        pemakaian: 25,
      },
    });

    await prisma.invoice.create({
      data: {
        customerId: activeCustomer.id,
        billingMonth: previousMonth,
        meterAwal: 120,
        meterAkhir: 145,
        pemakaian: 25,
        tarifPerM3: 2500,
        biayaBeban: 3000,
        total: 2500 * 25 + 3000,
        dueDate: new Date(),
        status: InvoiceStatus.PAID,
        issuedAt: new Date(),
        paidAt: new Date(),
      },
    });

    await prisma.meterReading.create({
      data: {
        customerId: activeCustomer.id,
        billingMonth: currentMonth,
        meterAwal: 145,
        meterAkhir: 150,
        pemakaian: 5,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      userId: owner.id,
      action: "SEED_INIT",
      metadata: { customers: customers.count },
    },
  });
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
