import type { Metadata } from "next";
import { Award, Globe2, Handshake, ShieldCheck, Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "О компании | B.I.C.",
  description:
    "B.I.C. — команда экспертов параллельного импорта: подбор, проверка, логистика и юридическое сопровождение поставок авто с 2012 года.",
};

const highlights = [
  { title: "2012", subtitle: "на рынке импорта", icon: Award },
  { title: "25", subtitle: "стран поставки", icon: Globe2 },
  { title: "1800+", subtitle: "закрытых сделок", icon: Handshake },
  { title: "15", subtitle: "экспертов в команде", icon: Users },
];

const pillars = [
  {
    title: "Экспертиза",
    text: "Юристы, логисты и технические специалисты по поставкам из Европы, Азии и США. Проверяем авто по 12 базам, проводим инспекции и видеоотчёты.",
    icon: ShieldCheck,
  },
  {
    title: "Партнёрства",
    text: "Прямые контракты с дилерами и аукционами, брокеры в портах и проверенные перевозчики. Берём на себя валютные расчёты и страхование.",
    icon: Handshake,
  },
];

const assurance = [
  "Фиксируем курс, сроки и ответственность сторон в договоре.",
  "Работаем через escrow/аккредитив, страхуем поставку на всём плече.",
  "Показываем статусы: инспекция, погрузка, таможня, сертификация, выдача.",
  "Команда на связи 24/7 — менеджер, юрист, логист и техэксперт.",
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-14 px-6 py-16 text-white lg:space-y-16 lg:py-20">
      <section className="relative overflow-hidden rounded-[44px] border border-white/12 bg-gradient-to-br from-black/85 via-brand-secondary/70 to-brand-primary/35 p-10 shadow-strong sm:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.1),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(236,12,12,0.2),transparent_45%)]" />
        <div className="relative space-y-6">
          <Badge tone="outline">О компании</Badge>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">B.I.C. — Best Imported Cars</h1>
          <p className="max-w-3xl text-sm text-white/75">
            Мы занимаемся параллельным импортом автомобилей и мототехники с 2012 года. Берём на себя подбор, проверку,
            выкуп, логистику, таможню и выдачу с готовыми документами.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-[28px] border border-white/12 bg-white/6 px-4 py-4 backdrop-blur"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/50 text-brand-primary ring-1 ring-white/10">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-2xl font-semibold text-white">{item.title}</div>
                    <div className="text-xs uppercase tracking-[0.1em] text-white/60">{item.subtitle}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {pillars.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[32px] border border-white/12 bg-white/6 p-6 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-brand-primary/55"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-white/8 opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="relative mb-3 flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/40 text-brand-primary ring-1 ring-white/10">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              </div>
              <p className="relative text-sm text-white/75">{item.text}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-[36px] border border-white/12 bg-gradient-to-br from-brand-primary/12 via-white/6 to-black/60 p-6 shadow-soft backdrop-blur">
          <Badge tone="outline">Подход</Badge>
          <h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">Прозрачный процесс</h3>
          <p className="mt-2 text-sm text-white/70">
            Все этапы фиксируем в договоре: курс, сроки, страхование, ответственность сторон. Все отчёты и статусы логистики, таможни и документов отправляем напрямую в переписку.
          </p>
          <div className="mt-4 grid gap-3 text-sm text-white/75">
            {assurance.map((item) => (
              <div key={item} className="flex gap-2 rounded-2xl border border-white/8 bg-black/35 px-4 py-3">
                <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-white/12 bg-white/5 px-6 py-6 shadow-soft backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Badge tone="outline">Команда и клиенты</Badge>
              <h3 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Кого сопровождаем</h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-white/60">
              B2B · B2C
            </span>
          </div>
          <div className="mt-4 grid gap-4 text-sm text-white/75 md:grid-cols-2">
            {[
              {
                title: "Частные клиенты",
                text: "Подбор автомобилей и мототехники «под ключ». Прозрачные платежи и готовый пакет документов.",
              },
              {
                title: "Корпоративные клиенты",
                text: "Поставка парков, спецтехники и VIP-комплектаций. Отчётность, НДС, сопровождение сделки.",
              },
              {
                title: "Партнёры и дилеры",
                text: "Локальные брокеры, сервисные центры, страховые компании и логистические операторы.",
              },
              {
                title: "Постпродажный сервис",
                text: "Дооснащение, трейд-ин, КАСКО, продлённые гарантии и выездная выдача по России.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[24px] border border-white/8 bg-black/30 px-4 py-3">
                <div className="text-sm font-semibold text-white">{item.title}</div>
                <p className="mt-1 text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[38px] border border-brand-primary/35 bg-gradient-to-r from-brand-primary/80 via-brand-primary/55 to-brand-secondary px-8 py-10 shadow-strong lg:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="text-3xl font-semibold text-white md:text-4xl">Готовы обсудить поставку?</h3>
            <p className="max-w-2xl text-sm text-white/80">
              Расскажите, какой автомобиль ищете. Подготовим варианты, расчёт «под ключ» и пример договора в течение дня.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/contacts"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[38px] bg-white px-6 text-xs font-semibold uppercase tracking-[0.14em] text-black shadow-soft transition hover:-translate-y-0.5"
            >
              Связаться с нами
            </a>
            <a
              href="/catalog"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white/45"
            >
              Посмотреть каталог
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
