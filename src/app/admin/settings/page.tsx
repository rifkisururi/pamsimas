import { prisma } from "@/lib/db";
import { PageShell } from "@/components/ui/PageShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateSettings } from "./actions";
import { requireSession } from "@/lib/require-session";

export default async function AdminSettingsPage() {
  await requireSession("OWNER");
  const settings = await prisma.setting.findFirst();

  return (
    <PageShell title="Pengaturan" subtitle="Tarif & jatuh tempo">
      <Card>
        <form action={updateSettings} className="grid gap-3">
          <Input
            label="Biaya beban bulanan"
            name="biayaBeban"
            inputMode="numeric"
            defaultValue={settings?.biayaBeban ?? 3000}
            required
          />
          <Input
            label="Tarif per m3"
            name="tarifPerM3"
            inputMode="numeric"
            defaultValue={settings?.tarifPerM3 ?? 0}
            required
          />
          <Input
            label="Tanggal jatuh tempo"
            name="dueDayOfMonth"
            inputMode="numeric"
            defaultValue={settings?.dueDayOfMonth ?? 10}
            hint="Maksimal tanggal 28"
            required
          />
          <Button type="submit" fullWidth>
            Simpan pengaturan
          </Button>
        </form>
      </Card>
    </PageShell>
  );
}
