import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginAction, sendOtpAction } from "./actions";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
          PDAM Mini
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-black">Masuk</h1>
        <p className="mt-2 text-sm font-medium text-black/50">
          Akses cepat untuk admin, petugas, dan pelanggan.
        </p>
      </div>

      <Card className="space-y-4">
        <form action={loginAction} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="********"
            required
          />
          <Button type="submit" fullWidth>
            Masuk
          </Button>
        </form>
        <div className="border-t border-black/5 pt-4">
          <form action={sendOtpAction} className="space-y-3">
            <Input
              label="Login dengan OTP (mock)"
              name="email"
              type="email"
              placeholder="email terdaftar"
            />
            <Button type="submit" variant="secondary" fullWidth>
              Kirim OTP
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
