import Link from "next/link";

import { Button } from "@/components/ui/button";
import { requestPasswordResetAction } from "@/server/auth-actions";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const params = await searchParams;
  const sent = params?.sent === "1";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col justify-center gap-6 px-6 text-white">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-white">Восстановление доступа</h1>
        <p className="text-sm text-white/60">
          Укажите email администратора. Мы пришлём код подтверждения и ссылку для сброса пароля.
        </p>
      </div>

      {sent ? (
        <div className="rounded-[28px] border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-50">
          Если этот адрес есть в системе, мы отправили инструкцию для восстановления. Проверьте почту и папку «Спам».
        </div>
      ) : null}

      <form action={requestPasswordResetAction} className="space-y-4 rounded-[32px] border border-white/10 bg-white/6 p-6">
        <div className="space-y-2">
          <label className="text-xs text-white/55" htmlFor="email">
            Email администратора
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
        <Button type="submit" className="w-full">
          Отправить код
        </Button>
        <div className="text-center text-xs text-white/55">
          Уже вспомнили пароль?{" "}
          <Link href="/admin/login" className="text-white underline-offset-4 hover:underline">
            Вернуться к входу
          </Link>
        </div>
      </form>
    </div>
  );
}
