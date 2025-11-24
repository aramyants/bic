export const dynamic = 'force-dynamic';
export const revalidate = 0;

import {
  ArrowRight,
  Award,
  ClipboardList,
  Coins,
  Globe2,
  KeyRound,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Timer,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { ContactForm } from '@/components/contact-form';
import { LandedCostCalculator } from '@/components/calculator/landed-cost-calculator';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VehicleCard } from '@/components/vehicle-card';
import { COUNTRIES } from '@/lib/constants';
import { toCalculatorSettings, type CalculatorSettings } from '@/lib/calculator';
import { getActiveCalculatorConfig } from '@/server/calculator-service';
import { getEurRubRate } from '@/server/exchange-service';
import { getActiveBrandLogos } from '@/server/brand-logos-service';
import { getPublishedTestimonials } from '@/server/testimonials-service';
import { getFeaturedVehicles } from '@/server/vehicle-service';
import { RevealOnScroll } from '@/components/reveal-on-scroll';

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [featuredVehicles, eurRubRate, calculatorConfig, testimonials, brandLogos] = await Promise.all([
    getFeaturedVehicles(3),
    getEurRubRate().catch(() => 100),
    getActiveCalculatorConfig().catch(() => null),
    getPublishedTestimonials().catch(() => []),
    getActiveBrandLogos().catch(() => []),
  ]);
  const calculatorSettings = toCalculatorSettings(calculatorConfig);

  const params = await searchParams;
  const submittedParam = Array.isArray(params.submitted)
    ? params.submitted[0]
    : params.submitted;
  const errorParam = Array.isArray(params.error)
    ? params.error[0]
    : params.error;
  const showSuccess = submittedParam === '1';
  const showError = errorParam === 'form';

  return (
    <div className="space-y-32">
      {showSuccess && (
        <FormBanner
          tone="success"
          message="Спасибо! Заявка отправлена, мы свяжемся в течение 1–2 часов."
        />
      )}
      {showError && (
        <FormBanner
          tone="error"
          message="Не получилось отправить форму. Проверьте данные и попробуйте ещё раз."
        />
      )}
      <HeroSection eurRubRate={eurRubRate} />
      <StatsStrip eurRubRate={eurRubRate} />
      <BrandLogosSection logos={brandLogos} />
      <FeaturedCatalog vehicles={featuredVehicles} eurRubRate={eurRubRate} />
      <CalculatorSection
        eurRubRate={eurRubRate}
        calculatorSettings={calculatorSettings}
      />
      <CountriesSection />
      <ProcessSection />
      <TestimonialsSection testimonials={testimonials} />
      <ContactCta />
    </div>
  );
}

function HeroSection({ eurRubRate }: { eurRubRate: number }) {
  return (
    <section className="relative -mt-24 w-full overflow-hidden pt-24 text-white sm:-mt-28 sm:pt-28 lg:-mt-32 lg:overflow-visible lg:pt-32">
      <div className="relative mx-auto mt-10 flex min-h-[calc(100vh-120px)] w-full max-w-[1400px] flex-col overflow-hidden rounded-[52px] border border-white/10 bg-gradient-to-br from-black/70 via-black/45 to-brand-secondary/60 px-8 py-16 shadow-strong lg:min-h-[calc(100vh-140px)] lg:flex-row lg:items-center lg:justify-between lg:overflow-visible lg:px-16 lg:py-24">
        <div className="relative z-10 flex-1 space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/70">
          <span>Маркетплейс параллельного импорта</span>
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span>24/7</span>
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
          B.I.C. подбор и поставка автомобилей и мототехники
        </h1>
        <p className="max-w-2xl text-lg text-white/70">
          Комплексно сопровождаем покупку и доставку авто из Европы, Азии и США.
          Предоставляем прозрачный расчёт, проверяем историю, выкупаем и
          привозим «под ключ» с оформлением всех документов.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg">
            <Link href="/catalog" className="flex items-center gap-3">
              Перейти в каталог
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
              title: 'Подбор и проверка',
              description:
                'Проверяем по 12 базам, организуем техосмотр, CarVertical, escrow и инспекцию на месте.',
              icon: <Sparkles className="h-5 w-5 text-brand-primary" />,
            },
            {
              title: 'Финансы под контролем',
              description:
                'Безопасные транзакции, фиксированный договор и прозрачная комиссия.',
              icon: <Timer className="h-5 w-5 text-brand-primary" />,
            },
            {
              title: 'Гарантия договора',
              description:
                'Фиксируем стоимость в рублях, страхуем поставку и подключаем местных брокеров на каждом этапе.',
              icon: <ShieldCheck className="h-5 w-5 text-brand-primary" />,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-lg"
            >
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
      <div className="relative z-10 mt-12 flex flex-col gap-4 rounded-[40px] border border-white/10 bg-white/8 p-6 text-sm text-white/80 lg:sticky lg:top-36 lg:ml-12 lg:mt-0 lg:w-[360px] lg:self-start">
        <h3 className="text-lg font-semibold text-white">
          Что вы получаете
        </h3>
        <ul className="space-y-3">
          {[
            'Персональный менеджер и прозрачный договор.',
            'Фото и видеоотчёт, проверка истории, VIN и сервисных отметок.',
            'Поддержка по оплате в евро или рублях, фиксированная комиссия.',
            'Сопровождение до растаможки и постановки на учёт.',
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </section>
  );
}

function StatsStrip({ eurRubRate }: { eurRubRate: number }) {
  const stats = [
    {
      label: 'Страны поставки',
      value: '25',
      description:
        'Германия, Нидерланды, Польша, ОАЭ, Корея и другие рынки — выбираем лучшее предложение.',
      icon: Globe2,
      accent: 'from-brand-primary/35 via-brand-primary/10 to-transparent',
      pill: 'география',
    },
    {
      label: 'Средний курс EUR/RUB',
      value: `${eurRubRate.toFixed(2)} ₽/€`,
      description: 'Фиксируем курс на дату бронирования и прописываем в договоре.',
      icon: Coins,
      accent: 'from-amber-400/50 via-amber-400/10 to-transparent',
      pill: 'курс',
    },
    {
      label: 'Средний срок доставки',
      value: '12 недель',
      description: 'От подбора до передачи автомобиля клиенту.',
      icon: Award,
      accent: 'from-brand-primary/45 via-brand-primary/18 to-transparent',
      pill: 'сроки',
    },
  ];

  return (
    <section className="mx-auto mb-16 w-full max-w-[1320px]">
      <div className="relative overflow-hidden rounded-[44px] border border-white/10 bg-gradient-to-br from-black/85 via-black/70 to-brand-secondary/45 p-8 shadow-strong">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_85%_0%,rgba(255,68,94,0.16),transparent_38%),radial-gradient(circle_at_70%_90%,rgba(255,255,255,0.06),transparent_35%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge tone="outline">О компании</Badge>
            <h3 className="text-3xl font-semibold text-white md:text-4xl">
              Цифры, за которые отвечаем
            </h3>
            <p className="max-w-xl text-sm text-white/70">
              Фиксируем курс и условия в договоре, работаем с проверенными поставщиками и сопровождаем сделку до выдачи ключей.
            </p>
          </div>
          <div className="hidden h-px flex-1 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block" />
        </div>
        <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 px-6 py-6 backdrop-blur transition duration-500 hover:-translate-y-1.5 hover:border-brand-primary/50"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent}`} />
                </div>
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                      <Icon className="h-6 w-6 text-brand-primary" />
                      <span className="absolute inset-0 rounded-2xl bg-brand-primary/16 blur-xl opacity-0 transition duration-500 group-hover:opacity-100" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-3xl font-semibold text-white">{stat.value}</h3>
                        <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white/60">
                          {stat.pill}
                        </span>
                      </div>
                      <p className="text-[11px] uppercase tracking-[0.08em] text-white/60">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                  <span className="hidden text-[10px] uppercase tracking-[0.12em] text-white/45 sm:block">
                    0{index + 1}
                  </span>
                </div>
                <p className="relative mt-4 text-sm text-white/70">{stat.description}</p>
                <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            );
          })}
        </div>
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
          <Badge tone="outline">Выбор недели</Badge>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Свежие предложения
          </h2>
          <p className="text-sm text-white/70">
            Подобрали автомобили с прозрачной историей и готовыми документами.
            Больше вариантов — в каталоге.
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-xs font-semibold text-white transition hover:border-white/40"
        >
          Перейти в каталог
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            eurRubRate={eurRubRate}
          />
        ))}
      </div>
    </section>
  );
}

function CalculatorSection({
  eurRubRate,
  calculatorSettings,
}: {
  eurRubRate: number;
  calculatorSettings: CalculatorSettings;
}) {
  return (
    <section id="calculator" className="mx-auto w-full max-w-[1320px]">
      <div className="flex flex-col w-full gap-10 rounded-[42px] border border-white/10 bg-white/8 px-5 py-10 text-white sm:px-8 sm:py-12 lg:flex-col lg:justify-between lg:px-10 lg:py-14">
        <div className="space-y-4">
          <Badge tone="outline">Онлайн-калькулятор</Badge>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Рассчитайте цену «под ключ» за 30 секунд
          </h2>
        </div>
        <LandedCostCalculator
          baseRate={eurRubRate}
          settings={calculatorSettings}
        />
      </div>
    </section>
  );
}

function BrandLogosSection({
  logos,
}: {
  logos: Awaited<ReturnType<typeof getActiveBrandLogos>>;
}) {
  if (!logos.length) {
    return null;
  }

  const marqueeItems = [...logos, ...logos];
  const durationSeconds = Math.max(18, logos.length * 3);

  return (
    <section className="mx-auto w-full max-w-[1320px] space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Badge tone="outline">Партнеры</Badge>
          <h3 className="text-3xl font-semibold text-white md:text-4xl">Марки и поставщики</h3>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[28px] border border-white/5 bg-black/40 px-3 py-5 shadow-strong">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(120%_140%_at_0%_50%,rgba(0,0,0,0.4),transparent_45%),radial-gradient(120%_140%_at_100%_50%,rgba(0,0,0,0.4),transparent_45%)]" />
        <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-24 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/85 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-0 h-full w-24 bg-gradient-to-l from-[#0d0d0d] via-[#0d0d0d]/85 to-transparent" />
        <div className="relative z-10 marquee">
          <div className="marquee-track" style={{ animationDuration: `${durationSeconds}s` }}>
            {marqueeItems.map((logo, index) => {
              const content = (
                <div className="flex h-28 w-56 items-center justify-center px-5 transition hover:scale-[1.03]">
                  <img
                    src={logo.logoUrl}
                    alt={logo.name}
                    className="max-h-20 w-auto object-contain opacity-95 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition hover:opacity-100"
                    loading="lazy"
                  />
                </div>
              );

              const key = `${logo.id}-${index}`;
              return logo.href ? (
                <a
                  key={key}
                  href={logo.href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4"
                  aria-label={logo.name}
                >
                  {content}
                </a>
              ) : (
                <div key={key} className="px-4">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
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
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
            25 стран — от Германии до ОАЭ
          </h2>
        </div>
        <p className="max-w-xl text-sm text-white/70">
          Работаем с официальными дилерами и проверенными аукционами.
          <br />
          Поможем выбрать рынок и порт, просчитаем логистику и растаможку.
        </p>
      </div>
      <div className="grid gap-3 rounded-[42px] border border-white/10 bg-black/65 p-6 text-sm text-white/70 sm:grid-cols-2 md:grid-cols-3">
        {COUNTRIES.map(({ code, name }) => (
          <div
            key={code}
            className="flex items-center gap-3 rounded-3xl border border-white/5 bg-white/3 px-4 py-3"
          >
            <img
              src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${code.toLowerCase()}.png 2x`}
              width="20"
              height="15"
              alt={`${name} flag`}
              className="shrink-0 rounded-sm"
            />
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
      title: 'Бриф и подбор',
      description:
        'Фиксируем бюджет, подписываем NDA, собираем 5–7 релевантных предложений и проверяем историю.',
      icon: ClipboardList,
      hint: 'бриф',
    },
    {
      title: 'Проверка и бронь',
      description:
        'Готовим отчёт, согласуем итоговую цену, фиксируем курс в договоре и резервируем автомобиль.',
      icon: SearchCheck,
      hint: 'бронь',
    },
    {
      title: 'Выкуп и логистика',
      description:
        'Оплачиваем, страхуем, организуем доставку в РФ, проходим таможню и сертификацию.',
      icon: Truck,
      hint: 'доставка',
    },
    {
      title: 'Выдача и сервис',
      description:
        'Проводим предпродажную подготовку, ставим на учёт, устанавливаем опции и передаём ключи.',
      icon: KeyRound,
      hint: 'ключи',
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[1320px]">
      <div className="relative overflow-hidden rounded-[44px] border border-white/10 bg-gradient-to-br from-black/82 via-black/70 to-brand-secondary/40 p-10 shadow-strong">
        <div className="pointer-events-none absolute -left-24 top-10 h-48 w-48 rounded-full bg-brand-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <RevealOnScroll className="space-y-6">
            <div className="flex w-full flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold text-white/75 backdrop-blur">
                <Sparkles className="h-4 w-4 text-brand-primary" />
                4 шага до выдачи
              </div>
            </div>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Как это работает</h2>
            <p className="max-w-xl text-sm text-white/70">
              От брифа до ключей: фиксируем этапы в договоре, показываем статусы и держим курс под контролем.
            </p>
            <div className="relative isolate ml-6 w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/12 bg-white/5 shadow-strong md:ml-10 lg:ml-16">
              <div className="absolute inset-0 z-10 bg-gradient-to-tr from-brand-primary/25 via-transparent to-black/70" />
              <div className="relative aspect-[3/4]">
                <Image
                  src="/red_lambo.jpg"
                  alt="Red sports car ready for delivery"
                  fill
                  sizes="(min-width: 1280px) 560px, (min-width: 1024px) 520px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute right-6 bottom-5 z-20">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur">
                  <span className="inline-flex h-2 w-2 rounded-full bg-brand-primary" />
                  <span>Контроль на каждом этапе</span>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="relative space-y-6" delay={120}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="group relative flex gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-brand-primary/50"
                  style={{
                    animation: 'fadeUp 0.6s ease forwards',
                    animationDelay: `${index * 120}ms`,
                    opacity: 0,
                    transform: 'translateY(12px)',
                  }}
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/40 ring-1 ring-white/10 shadow-inner">
                      <Icon className="h-6 w-6 text-brand-primary" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-white/60">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white">
                        {index + 1}
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-white/60">
                        {step.hint}
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-white">{step.title}</div>
                    <p className="text-sm leading-relaxed text-white/70">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({
  testimonials,
}: {
  testimonials: Awaited<ReturnType<typeof getPublishedTestimonials>>;
}) {
  if (!testimonials.length) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-[1320px] space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h3 className="text-3xl font-semibold text-white md:text-4xl">
            Что о нас говорят
          </h3>
        </div>
      </div>
      <TestimonialsCarousel testimonials={testimonials} />
    </section>
  );
}


function ContactCta() {
  return (
    <section id="contacts" className="mx-auto w-full max-w-[1320px]">
      <div className="grid gap-10 rounded-[42px] border border-white/10 bg-gradient-to-br from-brand-secondary/80 to-black/80 px-5 py-10 text-white sm:px-8 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-14">
        <div className="space-y-6">
          <Badge tone="default">Свяжитесь с нами</Badge>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Получите расчёт и варианты за 10–15 минут
          </h2>
          <p className="max-w-xl text-sm text-white/70">
            Расскажите, какой автомобиль ищете. Подготовим 2–3 варианта с
            расчётом «под ключ», сроками доставки и примером договора.
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
              <a
                href="mailto:sales@bic.market"
                className="text-white hover:underline"
              >
                sales@bic.market
              </a>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

function FormBanner({
  tone,
  message,
}: {
  tone: 'success' | 'error';
  message: string;
}) {
  const styles =
    tone === 'success'
      ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
      : 'border-red-400/40 bg-red-500/15 text-red-100';

  return (
    <div
      className={`mx-auto mt-8 w-full max-w-[960px] rounded-[32px] border px-6 py-4 text-sm ${styles}`}
    >
      {message}
    </div>
  );
}
