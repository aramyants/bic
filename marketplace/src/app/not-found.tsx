import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-[80vh] overflow-hidden bg-[#07070c] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(236,12,12,0.25),transparent_45%),radial-gradient(circle_at_80%_65%,rgba(255,255,255,0.08),transparent_40%)]" />
      <div className="absolute -left-32 top-24 h-64 w-64 rounded-full bg-brand-primary/30 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-white/10 blur-[120px]" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-20">
        <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          404 · страница не найдена
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            Мы свернули не туда, но маршрут уже пересчитан.
          </h1>
          <p className="max-w-2xl text-base text-white/70 md:text-lg">
            Такой страницы нет, зато есть каталог с актуальными авто, калькулятор и быстрый доступ к заявке.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-primary-strong"
          >
            На главную
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 transition hover:border-white/40 hover:text-white"
          >
            В каталог
          </Link>
          <Link
            href="/contacts"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Связаться с нами
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Калькулятор",
              text: "Рассчитать пошлины, логистику и сервис для конкретного авто.",
              href: "/calculator",
            },
            {
              title: "Как работаем",
              text: "Пошаговый процесс от поиска до передачи ключей.",
              href: "/process",
            },
            {
              title: "О компании",
              text: "Команда, условия и факты о B.I.C.",
              href: "/about",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/30 hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{card.title}</h2>
                <ArrowUpRight className="h-4 w-4 text-white/50 transition group-hover:text-white" />
              </div>
              <p className="mt-3 text-sm text-white/60">{card.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
