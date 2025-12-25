import Link from "next/link";

import { Button } from "@/components/ui/button";
import { resetPasswordAction } from "@/server/auth-actions";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const params = await searchParams;
  const tokenParam = params?.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
  const showError = params?.error === "1";

  if (!token) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col justify-center gap-6 px-6 text-white">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-white">Сброс пароля</h1>
          <p className="text-sm text-white/60">
            Ссылка недействительна. Запросите новый код восстановления.
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/admin/forgot"
            className="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-strong"
          >
            Запросить новый код
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col justify-center gap-6 px-6 text-white">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-white">Сброс пароля</h1>
        <p className="text-sm text-white/60">
          Введите одноразовый код из письма и задайте новый пароль. Код действует 20 минут.
        </p>
      </div>

      {showError ? (
        <div className="rounded-[28px] border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
          Код или токен не подошёл, либо срок истёк. Попробуйте ещё раз или запросите новый.
        </div>
      ) : null}

      <form action={resetPasswordAction} className="space-y-4 rounded-[32px] border border-white/10 bg-white/6 p-6">
        <input type="hidden" name="token" value={token} />

        <div className="space-y-2">
          <label className="text-xs text-white/55" htmlFor="otp">
            Код из письма
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            className="h-12 w-full rounded-full border border-white/15 bg-black/40 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
            placeholder="123456"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-white/55" htmlFor="password">
            Новый пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            className="h-12 w-full rounded-full border border-white/15 bg-black/40 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
            placeholder="Минимум 8 символов"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-white/55" htmlFor="confirm">
            Повторите пароль
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            minLength={8}
            required
            className="h-12 w-full rounded-full border border-white/15 bg-black/40 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
            placeholder="Повторите пароль"
          />
        </div>

        <Button type="submit" className="w-full">
          Сменить пароль
        </Button>

        <div className="text-center text-xs text-white/55">
          Вспомнили пароль?{" "}
          <Link href="/admin/login" className="text-white underline-offset-4 hover:underline">
            Вернуться к входу
          </Link>
        </div>
      </form>
    </div>
  );
}
