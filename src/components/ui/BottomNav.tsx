import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
};

type BottomNavProps = {
  items: NavItem[];
  activePath: string;
};

export function BottomNav({ items, activePath }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-6 py-3 text-xs font-semibold">
        {items.map((item) => {
          const isActive = activePath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                isActive ? "text-[color:var(--accent)]" : "text-black/50"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
