import type { PropsWithChildren } from "react";

type PageShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  withBottomPadding?: boolean;
}>;

export function PageShell({
  title,
  subtitle,
  actions,
  withBottomPadding = false,
  children,
}: PageShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-6 pt-6">
      <header className="mb-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-black">{title}</h1>
            {subtitle ? (
              <p className="text-sm font-medium text-black/50">{subtitle}</p>
            ) : null}
          </div>
          {actions}
        </div>
      </header>
      <div className={`flex flex-1 flex-col gap-4 ${withBottomPadding ? "pb-20" : ""}`}>
        {children}
      </div>
    </div>
  );
}
