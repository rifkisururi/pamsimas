import { prisma } from "@/lib/db";
import { PageShell } from "@/components/ui/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { getMonthKey } from "@/lib/utils";
import { requireSession } from "@/lib/require-session";
import { BottomNav } from "@/components/ui/BottomNav";

type PageProps = {
  searchParams?:
    | { success?: string | string[]; q?: string | string[] }
    | Promise<{ success?: string | string[]; q?: string | string[] }>;
};

export const dynamic = "force-dynamic";

export default async function OfficerReadingsPage({ searchParams }: PageProps) {
  await requireSession("OFFICER");
  const billingMonth = getMonthKey();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const rawQuery = resolvedSearchParams?.q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim();

  const customers = await prisma.customer.findMany({
    where: {
      is_active: true,
      ...(query
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
              { rt: { contains: query, mode: "insensitive" as const } },
              { rw: { contains: query, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      nomor_pelanggan: true,
      name: true,
      rt: true,
      rw: true,
      desa: true,
      meterReadings: {
        where: { billingMonth },
        select: { id: true },
      },
    },
  });

  return (
    <>
      <PageShell
        title="Catat Meter"
        subtitle={`Periode ${billingMonth}`}
        actions={
          <form className="flex gap-2" action="/officer/readings">
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
        withBottomPadding
      >
        {resolvedSearchParams?.success === "1" ? (
          <Card className="border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-800">
            Berhasil disimpan.
          </Card>
        ) : null}
        {resolvedSearchParams?.success === "0" ? (
          <Card className="border border-amber-200 bg-amber-50 text-sm font-semibold text-amber-800">
            Sudah ada catatan untuk bulan ini.
          </Card>
        ) : null}
        {customers.map((customer) => {
          const isRecorded = customer.meterReadings.length > 0;
          return (
            <Card key={customer.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-black">
                    {customer.nomor_pelanggan}
                  </p>
                  <p className="text-sm font-medium text-black/70">
                    {customer.name}
                  </p>
                  <p className="text-xs font-medium text-black/50">
                    RT {customer.rt}/RW {customer.rw} - {customer.desa}
                  </p>
                </div>
                <Badge
                  label={isRecorded ? "Sudah dicatat" : "Belum"}
                  tone={isRecorded ? "success" : "warning"}
                />
              </div>
              {customer.id ? (
                <Link href={`/officer/readings/${encodeURIComponent(customer.id)}`}>
                  <Button fullWidth>{isRecorded ? "Lihat" : "CATAT"}</Button>
                </Link>
              ) : (
                <Button fullWidth disabled>
                  ID kosong
                </Button>
              )}
            </Card>
          );
        })}
      </PageShell>
      <BottomNav
        items={[
          { href: "/officer/readings", label: "Catat" },
          { href: "/logout", label: "Keluar" },
        ]}
        activePath="/officer/readings"
      />
    </>
  );
}
