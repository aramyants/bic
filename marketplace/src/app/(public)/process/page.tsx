import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  ClipboardList,
  FileCheck2,
  HandCoins,
  KeyRound,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { RevealOnScroll } from "@/components/reveal-on-scroll";

export const metadata: Metadata = {
  title: "Как это работает | B.I.C.",
  description:
    "Этапы сотрудничества с B.I.C.: бриф, проверка, выкуп, логистика и выдача автомобиля под ключ с прозрачным контролем.",
};

type Step = {
  title: string;
  tag: string;
  duration: string;
  points: string[];
  icon: LucideIcon;
};

const microRoute = [
  { title: "Бриф", detail: "NDA, запрос, бюджет и сроки", duration: "день 1" },
  { title: "Проверка", detail: "5–7 вариантов, отчёты и видеоинспекции", duration: "неделя 1" },
  { title: "Логистика", detail: "Бронь, страхование, таможня", duration: "недели 2–10" },
  { title: "Выдача", detail: "ЭПТС, учёт, доп.опции и передача ключей", duration: "недели 10–12" },
];

const steps: Step[] = [
  {
    title: "Бриф и целеполагание",
    tag: "старт",
    duration: "день 1",
    icon: ClipboardList,
    points: [
      "Выявляем бюджет, сроки, бренды и требования к комплектации.",
      "Подписываем NDA и договор, фиксируем формат коммуникации (Telegram, почта, CRM).",
      "Создаём профиль клиента и подключаем к личному чату со статусами.",
    ],
  },
  {
    title: "Подбор и проверка",
    tag: "аналитика",
    duration: "неделя 1",
    icon: SearchCheck,
    points: [
      "Готовим 5–7 релевантных предложений из 25 стран с расчётом TCO и курсовой разницы.",
      "Проверяем историю по международным базам, организуем инспекцию и видеорепортаж.",
      "Формируем итоговый отчёт, согласуем вариант, фиксируем стоимость и сроки поставки.",
    ],
  },
  {
    title: "Выкуп и логистика",
    tag: "движение",
    duration: "недели 2–10",
    icon: Truck,
    points: [
      "Заключаем контракт, подключаем escrow или аккредитив, проводим оплату и бронирование.",
      "Организуем транспортировку (автовоз, судоходная линия, авиа) и страхование груза.",
      "Проходим таможенное оформление, оплачиваем пошлины и следим за соответствием ЕАЭС.",
    ],
  },
  {
    title: "Выдача и сервис",
    tag: "финал",
    duration: "недели 10–12",
    icon: KeyRound,
    points: [
      "Проводим предпродажную подготовку, сертификацию, постановку на учёт в ГИБДД и выдачу ЭПТС.",
      "Устанавливаем дополнительное оборудование по запросу, помогаем с КАСКО и трейд-ином.",
      "Передаём автомобиль в центре B.I.C. или доставляем «последнюю милю» до двери.",
    ],
  },
];

const guarantees = [
  {
    title: "Документы и финансы под защитой",
    description:
      "NDA и договор с фиксированными условиями, escrow/аккредитив, страхование груза и прозрачная комиссия.",
    icon: ShieldCheck,
  },
  {
    title: "Экспертиза и отчёты",
    description:
      "Проверяем по 12 базам, проводим инспекцию на месте, готовим видеоотчёты и чек-листы по комплектации.",
    icon: FileCheck2,
  },
  {
    title: "Связь и прозрачность 24/7",
    description:
      "Недельные отчёты, чат с менеджером и доступ ко всем документам.",
    icon: MessageCircle,
  },
];

export default function ProcessPage() {
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-14 px-4 py-12 text-white sm:space-y-16 sm:px-6 lg:space-y-20 lg:py-20">
      <section className="relative overflow-hidden rounded-[44px] border border-white/12 bg-gradient-to-br from-black/85 via-brand-secondary/70 to-brand-primary/35 p-6 shadow-strong sm:p-10">
        <div className="pointer-events-none absolute -left-16 top-8 h-64 w-64 rounded-full bg-brand-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/12 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(236,12,12,0.18),transparent_40%)]" />

        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
          <div className="space-y-5 sm:space-y-6">
            <Badge tone="outline">Как это работает</Badge>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Прозрачный маршрут: от брифа и проверки до выдачи «под ключ»
            </h1>
            <p className="max-w-3xl text-sm text-white/70">
              Мы фиксируем курс и этапы в договоре, работаем через безопасные расчёты, показываем отчёты по
              инспекциям и статус логистики в личном чате. Каждый шаг сопровождает персональный менеджер.
            </p>

            <div className="flex flex-col gap-3 text-sm text-white/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs uppercase tracking-[0.12em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                Безопасная схема расчётов и контроль курса
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs uppercase tracking-[0.12em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                Отчёты по проверке и логистике в личном чате
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs uppercase tracking-[0.12em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                Персональный менеджер 24/7 на всех этапах
              </span>
            </div>
          </div>

          <div className="relative isolate overflow-hidden rounded-[36px] border border-white/12 bg-white/6 p-6 shadow-strong backdrop-blur">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-black/70" />
            <div className="relative flex items-center justify-between">
              <div className="text-sm text-white/70">Маршрут сделки</div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Sparkles className="h-4 w-4 text-brand-primary" />
                <span>Контроль B.I.C.</span>
              </div>
            </div>

            <div className="relative mt-5 space-y-4 sm:space-y-5">
              {microRoute.map((item, index) => (
                <div key={item.title} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/60 text-sm font-semibold ring-1 ring-white/12">
                      0{index + 1}
                    </span>
                    {index < microRoute.length - 1 ? (
                      <span className="mt-1 h-8 w-px bg-gradient-to-b from-brand-primary/80 via-brand-primary/25 to-transparent" />
                    ) : null}
                  </div>
                  <div className="flex-1 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 shadow-inner">
                    <div className="flex items-center justify-between gap-3 text-sm font-semibold text-white">
                      <span>{item.title}</span>
                      <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] text-white/65">{item.duration}</span>
                    </div>
                    <p className="mt-1 text-xs text-white/65">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-6 grid gap-3 text-xs text-white/70 sm:grid-cols-2">
              {[
                {
                  title: "Фиксируем ключевые условия",
                  description: "Курс, сроки, ответственность сторон и этапы оплаты — в одном документе.",
                  icon: BadgeCheck,
                },
                {
                  title: "Видно, где сейчас авто",
                  description: "От отчёта инспекции до таможни и выдачи — статусы обновляются онлайн.",
                  icon: HandCoins,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 px-4 py-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-brand-primary/10" />
                  <div className="relative flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl text-brand-primary">
                      <card.icon className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <div className="font-semibold text-white">{card.title}</div>
                      <p className="text-white/65">{card.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-7 sm:space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Badge tone="outline">4 шага</Badge>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Каждый этап прописан в договоре</h2>
            <p className="max-w-2xl text-sm text-white/70">
              Каждый шаг имеет конкретный результат и ответственного. Вы видите расчёты, отчёты и документы до оплаты
              следующего этапа.
            </p>
          </div>
          <Link
            href="/contacts"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white/40"
          >
            Запросить консультацию
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          {steps.map((step, index) => (
            <RevealOnScroll key={step.title} delay={index * 80}>
              <div className="group relative overflow-hidden rounded-[30px] border border-white/12 bg-white/6 p-5 shadow-soft backdrop-blur transition duration-500 hover:-translate-y-1.5 hover:border-brand-primary/60 sm:p-6">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/18 via-brand-primary/6 to-transparent" />
                </div>
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/50 text-brand-primary ring-1 ring-white/10">
                      <step.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-white/55">{step.tag}</p>
                      <h3 className="text-lg font-semibold text-white sm:text-xl">{step.title}</h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-white/65">
                    {step.duration}
                  </span>
                </div>
                <ul className="relative mt-4 space-y-2 text-sm text-white/75">
                  {step.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-2 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="rounded-[40px] border border-white/12 bg-white/5 px-6 py-9 shadow-soft backdrop-blur sm:px-8 sm:py-10 lg:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge tone="outline">Контроль и сервис</Badge>
            <h3 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Что мы держим на себе</h3>
            <p className="text-sm text-white/70">
              Сфокусированы на безопасности сделки и предсказуемых сроках. Вот что закрывает команда B.I.C.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs text-white/60">
            <Sparkles className="h-4 w-4 text-brand-primary" />
            <span>Премиум-сопровождение 24/7</span>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {guarantees.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[28px] border border-white/12 bg-black/55 p-4 transition duration-500 hover:-translate-y-1 hover:border-brand-primary/50 sm:p-5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-white/6 opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="relative flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-brand-primary ring-1 ring-white/10">
                  <item.icon className="h-5 w-5" />
                </span>
                <div className="text-lg font-semibold text-white">{item.title}</div>
              </div>
              <p className="relative mt-3 text-sm leading-relaxed text-white/70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[42px] border border-brand-primary/35 bg-gradient-to-r from-brand-primary/80 via-brand-primary/55 to-brand-secondary px-6 py-8 shadow-strong sm:px-8 sm:py-10 lg:px-10">
        <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-48 w-48 rounded-full bg-black/30 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="text-3xl font-semibold text-white md:text-4xl">Готовы собрать маршрут под вас?</h3>
            <p className="max-w-2xl text-sm text-white/80">
              Расскажите, какую комплектацию ищете. Подготовим 2–3 варианта с расчётом «под ключ», сроками доставки и
              примером договора уже сегодня.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[38px] bg-white px-6 text-xs font-semibold uppercase tracking-[0.14em] text-black shadow-soft transition hover:-translate-y-0.5"
            >
              <HandCoins className="h-4 w-4" />
              Оставить заявку
            </Link>
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white/45"
            >
              Посмотреть каталог
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
