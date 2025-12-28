import type { PropsWithChildren } from "react";
import Link from "next/link";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/customers", label: "Pelanggan" },
  { href: "/admin/billing", label: "Tagihan" },
  { href: "/admin/payments", label: "Pembayaran" },
  { href: "/admin/settings", label: "Pengaturan" },
  { href: "/logout", label: "Keluar" },
];

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <div className="grid grid-cols-2 gap-2 rounded-[18px] border border-black/5 bg-white/80 p-3 text-xs font-semibold">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[12px] border border-black/5 px-3 py-2 text-center text-black/70"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </>
  );
}
