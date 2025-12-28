import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-12 pt-10">
      <div className="relative overflow-hidden rounded-[24px] border border-emerald-100 bg-white/90 p-6 shadow-sm">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-100/70" />
        <div className="absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-amber-100/60" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Pamsimas
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-black">
            Program Penyediaan Air Minum dan Sanitasi Berbasis Masyarakat
          </h1>
          <p className="mt-3 text-sm font-medium text-black/60">
            Pamsimas adalah aplikasi mobile-first untuk mengelola pelanggan air,
            mencatat meter bulanan di lapangan, menerbitkan tagihan, serta
            memproses pembayaran warga dengan cepat dan tertib.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Link href="/login">
              <Button fullWidth>Login ke Aplikasi</Button>
            </Link>
            <Button fullWidth variant="secondary">
              Unduh Panduan Singkat
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <Card>
          <p className="text-xs font-semibold uppercase text-black/40">Owner</p>
          <p className="mt-2 text-sm font-semibold text-black">
            Atur tarif, generate tagihan, dan pantau laporan.
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase text-black/40">
            Petugas Pencatat
          </p>
          <p className="mt-2 text-sm font-semibold text-black">
            Catat meter cepat satu tangan, otomatis hitung pemakaian.
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase text-black/40">
            Pelanggan
          </p>
          <p className="mt-2 text-sm font-semibold text-black">
            Cek tagihan, histori, dan unduh invoice dari HP.
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase text-black/40">
            Petugas Pembayaran
          </p>
          <p className="mt-2 text-sm font-semibold text-black">
            Konfirmasi pembayaran di lapangan dengan sekali tap.
          </p>
        </Card>
      </div>

      <div className="mt-8 rounded-[18px] border border-black/5 bg-white/80 p-4 text-xs font-semibold text-black/60">
        Target layar utama 360x800. Semua tombol minimal 44px, siap dipakai di
        lapangan.
      </div>
    </div>
  );
}
