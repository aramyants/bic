import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getCurrentAdmin } from "@/server/auth";
import { loginAction } from "@/server/auth-actions";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const params = await searchParams;
  const existing = await getCurrentAdmin();
  if (existing) {
    redirect("/admin");
  }

  const showError = params?.error === "1";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col justify-center gap-6 px-6 text-white">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-white">Вход в админ-панель B.I.C.</h1>
        <p className="text-sm text-white/60">
          Используйте корпоративную почту и админский пароль, чтобы получить доступ к панели управления.
        </p>
      </div>
      {showError ? (
        <div className="rounded-[28px] border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
          Неверная почта или пароль. Проверьте данные и попробуйте ещё раз.
        </div>
      ) : null}
      <form action={loginAction} className="space-y-4 rounded-[32px] border border-white/10 bg-white/6 p-6">
        <div className="space-y-2">
          <label className="text-xs text-white/55" htmlFor="email">
            Почта
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="h-12 w-full rounded-full border border-white/15 bg-black/40 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
            placeholder="admin@bic.market"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-white/55" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="h-12 w-full rounded-full border border-white/15 bg-black/40 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
            placeholder="Введите пароль"
          />
        </div>
        <Button type="submit" className="w-full">
          Войти
        </Button>
      </form>
    </div>
  );
}
