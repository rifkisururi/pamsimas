import { prisma } from "@/lib/db";
import { PageShell } from "@/components/ui/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { createCustomer, updateCustomer, deleteCustomer } from "./actions";
import { requireSession } from "@/lib/require-session";

type PageProps = {
  searchParams?: { q?: string; page?: string };
};

export default async function AdminCustomersPage({ searchParams }: PageProps) {
  await requireSession("OWNER");
  const query = searchParams?.q?.trim();
  const page = Math.max(1, Number(searchParams?.page || 1));
  const pageSize = 5;

  const whereClause = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          {
            nomor_pelanggan: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          { desa: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.customer.count({ where: whereClause }),
  ]);

  const hasNext = page * pageSize < total;

  return (
    <PageShell
      title="Pelanggan"
      subtitle="Kelola data pelanggan"
      actions={
        <form className="flex gap-2" action="/admin/customers">
          <input
            name="q"
            placeholder="Cari nama / nomor"
            className="h-10 w-32 rounded-[12px] border border-black/10 bg-white px-3 text-xs font-semibold"
            defaultValue={query}
          />
          <Button variant="secondary" type="submit">
            Cari
          </Button>
        </form>
      }
    >
      <Card>
        <h2 className="text-base font-semibold text-black">Tambah pelanggan</h2>
        <form action={createCustomer} className="mt-4 grid gap-3">
          <Input label="Nomor pelanggan" name="nomor_pelanggan" required />
          <Input label="Nama" name="name" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="RT" name="rt" required />
            <Input label="RW" name="rw" required />
          </div>
          <Input label="Desa" name="desa" required />
          <Input label="Nomor WA" name="nomor_wa" required inputMode="numeric" />
          <Input label="Email" name="email" type="email" required />
          <Input label="Alamat (opsional)" name="alamat" />
          <Input label="Catatan (opsional)" name="catatan" />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="is_active" defaultChecked />
            Aktif
          </label>
          <Button type="submit" fullWidth>
            Simpan pelanggan
          </Button>
        </form>
      </Card>

      {customers.map((customer) => (
        <Card key={customer.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-black">
                {customer.name}
              </p>
              <p className="text-xs font-medium text-black/50">
                {customer.nomor_pelanggan} - RT {customer.rt}/RW {customer.rw} -{" "}
                {customer.desa}
              </p>
            </div>
            <Badge
              label={customer.is_active ? "Aktif" : "Nonaktif"}
              tone={customer.is_active ? "success" : "neutral"}
            />
          </div>
          <details className="rounded-[12px] bg-emerald-50/70 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-emerald-900">
              Edit data
            </summary>
            <form action={updateCustomer} className="mt-3 grid gap-3">
              <input type="hidden" name="id" value={customer.id} />
              <Input
                label="Nomor pelanggan"
                name="nomor_pelanggan"
                defaultValue={customer.nomor_pelanggan}
                required
              />
              <Input label="Nama" name="name" defaultValue={customer.name} required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="RT" name="rt" defaultValue={customer.rt} required />
                <Input label="RW" name="rw" defaultValue={customer.rw} required />
              </div>
              <Input label="Desa" name="desa" defaultValue={customer.desa} required />
              <Input
                label="Nomor WA"
                name="nomor_wa"
                defaultValue={customer.nomor_wa}
                inputMode="numeric"
                required
              />
              <Input label="Email" name="email" type="email" defaultValue={customer.email} required />
              <Input label="Alamat" name="alamat" defaultValue={customer.alamat || ""} />
              <Input label="Catatan" name="catatan" defaultValue={customer.catatan || ""} />
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" name="is_active" defaultChecked={customer.is_active} />
                Aktif
              </label>
              <Button type="submit" fullWidth>
                Update
              </Button>
            </form>
          </details>
          <form action={deleteCustomer}>
            <input type="hidden" name="id" value={customer.id} />
            <Button variant="danger" fullWidth type="submit">
              Hapus pelanggan
            </Button>
          </form>
        </Card>
      ))}
      <Card className="flex items-center justify-between text-sm font-semibold">
        <a
          className={`rounded-[12px] px-3 py-2 ${
            page > 1 ? "text-emerald-700" : "text-black/30"
          }`}
          href={`/admin/customers?q=${query ?? ""}&page=${Math.max(1, page - 1)}`}
        >
          Prev
        </a>
        <span className="text-black/50">
          Halaman {page} dari {Math.max(1, Math.ceil(total / pageSize))}
        </span>
        <a
          className={`rounded-[12px] px-3 py-2 ${
            hasNext ? "text-emerald-700" : "text-black/30"
          }`}
          href={`/admin/customers?q=${query ?? ""}&page=${page + 1}`}
        >
          Next
        </a>
      </Card>
    </PageShell>
  );
}
