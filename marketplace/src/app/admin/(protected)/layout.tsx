import Link from "next/link";

import { requireAdmin } from "@/server/auth";
import { signOutAction } from "@/server/auth-actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/70">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-sm font-semibold text-white/70">
            B.I.C. Admin
          </Link>
          <div className="flex items-center gap-4 text-xs text-white/55">
            <span>{admin.email}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-white/20 px-4 py-2 text-white/65 transition hover:border-white/40 hover:text-white"
              >
                Выйти
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1320px] px-6 py-10">{children}</main>
    </div>
  );
}
