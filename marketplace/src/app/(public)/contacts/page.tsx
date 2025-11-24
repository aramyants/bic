import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/contact-form";
import { Clock3, MapPin, Mail, Phone, Send, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Контакты | B.I.C.",
  description:
    "Свяжитесь с B.I.C.: телефон, email, офис в Москве, Telegram-бот и форма заявки. Отвечаем в течение 10–15 минут.",
};

const contacts = [
  {
    title: "Телефон",
    value: "+7 (495) 260-00-00",
    href: "tel:+74952600000",
    icon: Phone,
  },
  {
    title: "Email",
    value: "sales@bic.market",
    href: "mailto:sales@bic.market",
    icon: Mail,
  },
  {
    title: "Офис",
    value: (
      <>
        Москва, Дербеневская наб., 7,
        стр. 10
      </>
    ),
    href: "https://yandex.ru/maps/?text=Дербеневская%20наб.%2C%207",
    icon: MapPin,
  },
  {
    title: "График",
    value: (
      <>
        пн–сб 10:00–20:00
        <br />
        вс — по записи
      </>
    ),
    icon: Clock3,
  },
];

const guarantees = [
  "NDA и договор с фиксированными условиями.",
  "Ответ в течение 10–15 минут после заявки.",
  "Статусы сделки и документы в личном чате.",
];

export default function ContactsPage() {
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-14 px-6 py-16 text-white lg:space-y-16 lg:py-20">
      <section className="relative overflow-hidden rounded-[44px] border border-white/12 bg-gradient-to-br from-black/85 via-brand-secondary/70 to-brand-primary/35 p-10 shadow-strong sm:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.1),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(236,12,12,0.2),transparent_45%)]" />
        <div className="relative space-y-6">
          <Badge tone="outline">Контакты</Badge>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Связаться с B.I.C.</h1>
          <p className="max-w-3xl text-sm text-white/75">
            На связи ежедневно с 10:00 до 20:00 (МСК). Отвечаем в течение 10–15 минут: телефон, email, Telegram или
            заявка через форму.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {contacts.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="relative flex h-full flex-col gap-1 rounded-[28px] border border-white/12 bg-white/6 px-4 py-4 backdrop-blur">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-white/60">
                    <Icon className="h-4 w-4 text-brand-primary" />
                    {item.title}
                  </div>
                  <div className="text-base font-semibold text-white">{item.value}</div>
                  {item.href ? <span className="text-xs text-white/65">Нажмите, чтобы открыть</span> : null}
                </div>
              );

              return item.href ? (
                <a key={item.title} href={item.href} className="block transition hover:-translate-y-1">
                  {content}
                </a>
              ) : (
                <div key={item.title}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-5 rounded-[36px] border border-white/12 bg-white/6 p-6 shadow-soft backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Badge tone="outline">Кураторы 24/7</Badge>
              <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Как мы работаем с запросами</h2>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-white/60">
              Ответ 10–15 мин
            </span>
          </div>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex gap-2 rounded-[24px] border border-white/8 bg-black/35 px-4 py-3">
              <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
              <span>Подписываем NDA и договор, фиксируем курс и этапы оплаты.</span>
            </li>
            <li className="flex gap-2 rounded-[24px] border border-white/8 bg-black/35 px-4 py-3">
              <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
              <span>Назначаем персонального менеджера.</span>
            </li>
            <li className="flex gap-2 rounded-[24px] border border-white/8 bg-black/35 px-4 py-3">
              <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
              <span>Готовим 2–3 варианта с расчётом «под ключ», сроками доставки и примером договора.</span>
            </li>
          </ul>
          <div className="rounded-[26px] border border-white/10 bg-black/30 px-4 py-4 text-sm text-white/75">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-brand-primary" />
              Гарантии
            </div>
            <div className="mt-3 grid gap-2 text-sm text-white/70 md:grid-cols-2">
              {guarantees.map((item) => (
                <div key={item} className="flex gap-2">
                  <span className="mt-2 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[36px] border border-white/12 bg-gradient-to-br from-brand-primary/12 via-white/8 to-black/60 p-6 shadow-strong backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Badge tone="outline">Оставить заявку</Badge>
              <h3 className="mt-2 text-xl font-semibold text-white">Получите расчёт в течение часа</h3>
            </div>
            <Send className="h-5 w-5 text-brand-primary" />
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
