import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleCard } from "@/components/vehicle-card";
import { LandedCostCalculator } from "@/components/calculator/landed-cost-calculator";
import { getFeaturedVehicles } from "@/server/vehicle-service";
import { getEurRubRate } from "@/server/exchange-service";
import { COUNTRIES } from "@/lib/constants";
import { formatLocaleNumber } from "@/lib/utils";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [featuredVehicles, eurRubRate] = await Promise.all([
    getFeaturedVehicles(3),
    getEurRubRate().catch(() => 100),
  ]);

  const params = await searchParams;
  const submittedParam = Array.isArray(params.submitted) ? params.submitted[0] : params.submitted;
  const errorParam = Array.isArray(params.error) ? params.error[0] : params.error;
  const showSuccess = submittedParam === "1";
  const showError = errorParam === "form";

  return (
    <div className="space-y-32">
      {showSuccess && (
        <FormBanner tone="success" message="Заявка отправлена, мы свяжемся с вами в течение 1–2 дней." />
      )}
      {showError && (
        <FormBanner tone="error" message="Не удалось отправить форму. Проверьте данные и попробуйте ещё раз." />
      )}
      <HeroSection eurRubRate={eurRubRate} />
      <StatsStrip eurRubRate={eurRubRate} />
      <FeaturedCatalog vehicles={featuredVehicles} eurRubRate={eurRubRate} />
      <ServicesSection />
      <CalculatorSection eurRubRate={eurRubRate} />
      <CountriesSection />
      <ProcessSection />
      <ContactCta />
    </div>
  );
}

function HeroSection({ eurRubRate }: { eurRubRate: number }) {
  return (
    <section className="relative mx-auto mt-12 flex w-full max-w-[1400px] flex-col overflow-hidden rounded-[52px] border border-white/10 bg-gradient-to-br from-black/85 via-black/60 to-brand-secondary/80 px-8 py-16 text-white shadow-strong lg:flex-row lg:items-center lg:px-16 lg:py-24">
      <div className="flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/70">
          <span>Маркетплейс параллельного импорта</span>
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span>24/7 · 25 стран</span>
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
          B.I.C. подбор и поставка автомобилей и мототехники
        </h1>
        <p className="max-w-2xl text-lg text-white/70">
          Комплексно сопровождаем покупку и доставку авто из Европы, Азии и США. Предоставляем прозрачный расчёт, проверяем
          историю, выкупаем и привозим «под ключ» с оформлением всех документов.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg">
            <Link href="/catalog" className="flex items-center gap-3">
              Каталог
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Link
            href="#calculator"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-xs font-semibold text-white transition hover:border-white/45"
          >
            Рассчитать стоимость
          </Link>
          <div className="flex items-center gap-3 rounded-[32px] border border-white/10 bg-black/45 px-4 py-3 text-xs text-white/60">
            <ShieldCheck className="h-4 w-4" />
            Курс ЦБ: {eurRubRate.toFixed(2)} ₽/€
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Экспертиза и аудит",
              description: "Проверяем по 12 базам, организуем техосмотр, CarVertical, escrow и инспекцию на месте.",
              icon: <Sparkles className="h-5 w-5 text-brand-primary" />,
            },
            {
              title: "Скорость и контроль",
              description: "Берём на себя выкуп, логистику, таможню и сертификацию. Выгрузка статуса в личный кабинет 24/7.",
              icon: <Timer className="h-5 w-5 text-brand-primary" />,
            },
            {
              title: "Гарантия договора",
              description: "Фиксируем стоимость в рублях, страхуем поставку и подключаем местных брокеров на каждом этапе.",
              icon: <ShieldCheck className="h-5 w-5 text-brand-primary" />,
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-lg">
              <div className="flex items-center gap-3 text-white">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40">
                  {item.icon}
                </span>
                <span className="text-base font-semibold">{item.title}</span>
              </div>
              <p className="mt-4 text-sm text-white/70">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 flex flex-col gap-4 rounded-[40px] border border-white/10 bg-white/8 p-6 text-sm text-white/80 lg:ml-12 lg:mt-0 lg:w-[360px]">
        <h3 className="text-lg font-semibold text-white">Что входит в услугу</h3>
        <ul className="space-y-3">
          {[
            "Поиск и подбор авто или мототехники с учётом бюджета и требований.",
            "Переговоры с дилерами, проверка истории и юридического статуса.",
            "Организация логистики, страхование, таможенное оформление и сертификация.",
            "Доставка до РФ, постановка на учёт, выдача в нашем центре или доставка до двери.",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StatsStrip({ eurRubRate }: { eurRubRate: number }) {
  const stats = [
    {
      label: "Страны поставки",
      value: "25",
      description: "Европа, Азия, США и ОАЭ с прямыми поставщиками.",
    },
    {
      label: "Средний курс на сегодня",
      value: `${eurRubRate.toFixed(2)} ₽/€`,
      description: "Фиксируем курс на дату бронирования договора.",
    },
    {
      label: "Опыт команды",
      value: "12 лет",
      description: "Более 1800 успешно закрытых сделок под ключ.",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[1320px]">
      <div className="grid gap-6 rounded-[42px] border border-white/10 bg-white/5 px-8 py-10 text-white md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-3">
            <h3 className="text-3xl font-semibold text-white">{stat.value}</h3>
            <p className="text-sm uppercase text-white/60">{stat.label}</p>
            <p className="text-sm text-white/65">{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

async function FeaturedCatalog({
  vehicles,
  eurRubRate,
}: {
  vehicles: Awaited<ReturnType<typeof getFeaturedVehicles>>;
  eurRubRate: number;
}) {
  if (!vehicles.length) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-[1320px] space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Badge tone="outline">Избранный каталог</Badge>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Готовые предложения недели</h2>
          <p className="text-sm text-white/70">
            Подборка свежих автомобилей с реальными VIN, прозрачным ценообразованием и ссылкой на оригинальное объявление.
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-xs font-semibold text-white transition hover:border-white/40"
        >
          Смотреть всё
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} eurRubRate={eurRubRate} />
        ))}
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      title: "Расчёт полной стоимости",
      description:
        "Онлайн-калькулятор для физических и юридических лиц: логистика, пошлины, акциз, утилизационный сбор, НДС и комиссия B.I.C.",
    },
    {
      title: "Прозрачное ценообразование",
      description:
        "Подробный breakdown раскрывает все статьи расходов. Можно открыть оригинальное объявление на mobile.de и сравнить.",
    },
    {
      title: "Интеграция с mobile.de",
      description:
        "Карточка автомобиля содержит ссылку на оригинальную публикацию, фото, историю и документы по техсостоянию.",
    },
    {
      title: "Избранное и уведомления",
      description:
        "Сохраняйте понравившиеся предложения, собирайте подборки и получайте уведомления о снижении цены или новых аналогах.",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[1320px]">
      <div className="rounded-[42px] border border-white/10 bg-black/65 p-10 text-white">
        <div className="space-y-3">
          <Badge tone="default">Возможности платформы</Badge>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Маркетплейс B.I.C. «Best Imported Cars» — функционал для подбора и импорта
          </h2>
          <p className="max-w-3xl text-sm text-white/70">
            Мы синхронизировали витрину с проверенными площадками и интегрировали инструменты расчёта, чтобы вы сразу видели
            стоимость под ключ. Каталог разделён по брендам и типам техники, а каждая карточка доступна в двух валютах.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.title} className="space-y-3 rounded-[32px] border border-white/12 bg-white/6 p-6">
              <h3 className="text-xl font-semibold text-white">{service.title}</h3>
              <p className="text-sm text-white/70">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CalculatorSection({ eurRubRate }: { eurRubRate: number }) {
  return (
    <section id="calculator" className="mx-auto w-full max-w-[1320px]">
      <div className="grid gap-10 rounded-[42px] border border-white/10 bg-white/8 px-10 py-14 text-white lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <Badge tone="outline">Калькулятор стоимости</Badge>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Рассчитайте цену «под ключ» за 30 секунд</h2>
          <p className="text-sm text-white/70">
            Учитываем курс ЦБ, логистику, страхование, таможенные пошлины, акциз, утильсбор, брокераж и комиссию B.I.C. —
            достаточно выбрать страну, тип клиента и базовую стоимость автомобиля в валюте продавца.
          </p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>• Переключатель для расчёта для физлиц и юрлиц.</li>
            <li>• Возможность указать дополнительные услуги: предпродажная подготовка, доставка до двери.</li>
            <li>• Экспорт расчёта в PDF и отправка менеджеру за один клик.</li>
          </ul>
        </div>
        <LandedCostCalculator baseRate={eurRubRate} />
      </div>
    </section>
  );
}

function CountriesSection() {
  return (
    <section className="mx-auto w-full max-w-[1320px] space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge tone="default">География поставок</Badge>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">25 стран в режиме онлайн 24/7</h2>
        </div>
        <p className="max-w-xl text-sm text-white/70">
          Сотрудничаем с официальными дилерами и крупными трейдерами. Обновляем остатки дважды в день и можем выкупить
          автомобиль на аукционе или у частного продавца.
        </p>
      </div>
      <div className="grid gap-3 rounded-[42px] border border-white/10 bg-black/65 p-6 text-sm text-white/70 sm:grid-cols-2 md:grid-cols-3">
        {COUNTRIES.map(({ code, name }) => (
          <div key={code} className="flex items-center gap-3 rounded-3xl border border-white/5 bg-white/3 px-4 py-3">
            <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    {
      title: "Бриф и подбор",
      description:
        "Заполняем анкету, фиксируем бюджет, подписываем NDA и конфиденциальность, после чего запускаем подбор и предварительный расчёт.",
    },
    {
      title: "Проверка и бронь",
      description:
        "Собираем 5–7 релевантных предложений, проверяем историю, формируем отчёт, согласуем итоговую цену и резервируем автомобиль.",
    },
    {
      title: "Выкуп и логистика",
      description:
        "Проводим оплату через эскроу, страхуем, организуем доставку в РФ, проходим таможню, сертификацию и оплачиваем пошлины.",
    },
    {
      title: "Выдача и сервис",
      description:
        "Проводим предпродажную подготовку, устанавливаем дополнительное оборудование и передаём автомобиль клиенту.",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[1320px]">
      <div className="rounded-[42px] border border-white/10 bg-white/6 p-10">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">Как это работает</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-black/45 p-6">
              <div className="text-xs text-white/50">Шаг {index + 1}</div>
              <div className="text-lg font-semibold text-white">{step.title}</div>
              <p className="text-sm text-white/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section id="contacts" className="mx-auto w-full max-w-[1320px]">
      <div className="grid gap-10 rounded-[42px] border border-white/10 bg-gradient-to-br from-brand-secondary/80 to-black/80 px-10 py-14 text-white lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Badge tone="default">Контакты</Badge>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Получите персональный подбор и расчёт стоимости доставки автомобиля за 24 часа
          </h2>
          <p className="max-w-xl text-sm text-white/70">
            Оставьте заявку — менеджер подтвердит детали, подберёт актуальные предложения и расскажет о способах оплаты.
            Уведомление придёт в Telegram и на почту.
          </p>
          <div className="grid gap-4 text-sm text-white/70 md:grid-cols-2">
            <div className="rounded-[32px] border border-white/12 bg-black/35 px-5 py-4">
              <div className="text-white/45">Телефон</div>
              <a href="tel:+74952600000" className="text-white hover:underline">
                +7 (495) 260-00-00
              </a>
            </div>
            <div className="rounded-[32px] border border-white/12 bg-black/35 px-5 py-4">
              <div className="text-white/45">Email</div>
              <a href="mailto:sales@bic.market" className="text-white hover:underline">
                sales@bic.market
              </a>
            </div>
          </div>
        </div>
        <form
          id="request"
          action="/api/request"
          method="post"
          className="flex flex-col gap-4 rounded-[36px] border border-white/12 bg-black/45 p-8 backdrop-blur"
        >
          <input
            type="text"
            name="name"
            required
            placeholder="Имя"
            className="h-12 rounded-full border border-white/15 bg-white/10 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Электронная почта"
            className="h-12 rounded-full border border-white/15 bg-white/10 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            className="h-12 rounded-full border border-white/15 bg-white/10 px-5 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
          />
          <textarea
            name="message"
            placeholder="Опишите задачу или желаемую комплектацию"
            className="min-h-[140px] rounded-[28px] border border-white/15 bg-white/10 px-5 py-4 text-sm text-white placeholder:text-white/40 focus:border-brand-primary focus:outline-none"
          />
          <div className="flex items-center justify-between text-xs text-white/45">
            <span>Ответим в течение 1–2 дней</span>
            <span>{formatLocaleNumber(1800)}+ реализованных проектов</span>
          </div>
          <Button type="submit" size="lg">
            Отправить заявку
          </Button>
        </form>
      </div>
    </section>
  );
}

function FormBanner({ tone, message }: { tone: "success" | "error"; message: string }) {
  const styles =
    tone === "success"
      ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100"
      : "border-red-400/40 bg-red-500/15 text-red-100";

  return (
    <div className={`mx-auto mt-8 w-full max-w-[960px] rounded-[32px] border px-6 py-4 text-sm ${styles}`}>
      {message}
    </div>
  );
}
