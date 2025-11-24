import Image from "next/image"
import Link from "next/link"
import { Car, Clock, Mail, MapPin, Phone, Send, Store } from "lucide-react"

const LEGAL_NAV = [
  { href: "/legal/privacy", label: "Политика конфиденциальности" },
  { href: "/legal/terms", label: "Пользовательское соглашение" },
  { href: "/legal/cookies", label: "Политика файлов cookie и отказ" },
  { href: "/legal/accessibility", label: "Декларация доступности" },
]

const SOCIAL_LINKS = [
  {
    href: "https://t.me/bicauto",
    label: "Подписаться на Telegram-канал @bicauto",
    icon: "/telegram.svg",
  },
  {
    href: "https://vk.com/bic_auto",
    label: "Сообщество B.I.C. во VK",
    icon: "/vk.svg",
  },
]

const PARTNER_LINKS = [
  {
    href: "https://www.avito.ru/brands/i129065073/all/transport?sellerId=f767951810a227ac5add1c4f0d1b9d9e",
    label: "Профиль на Avito",
    icon: Store,
    color: "bg-[#ff163c]/20 text-[#ff163c]",
  },
  {
    href: "https://auto.ru/profile/27530088/",
    label: "Витрина на Auto.ru",
    icon: Car,
    color: "bg-[#ff7b1a]/20 text-[#ff7b1a]",
  },
]

const CONTACT_ITEMS = [
  {
    icon: Clock,
    label: "График",
    value: "пн–сб 10:00–20:00\nвс — по записи",
  },
  {
    icon: Phone,
    label: "Телефон",
    value: "+7 (495) 260-00-00",
    href: "tel:+74952600000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "sales@bic.market",
    href: "mailto:sales@bic.market",
  },
  {
    icon: MapPin,
    label: "Офис и выдача",
    value: "Москва, Дербеневская набережная, 7, стр. 10",
    href: "https://yandex.ru/maps/-/CDfKrOz6",
  },
  {
    icon: Send,
    label: "Быстрая связь",
    value: "Telegram",
    href: "https://t.me/BIC_auto_bot",
  },
]

export const SiteFooter = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-black/90 text-white">
      <div className="mx-auto grid w-full max-w-[1320px] gap-12 px-6 py-16 xl:grid-cols-[1.5fr_1fr_1.5fr_1fr]">
        <div className="space-y-6">
          <Image
            src="/logo.png"
            alt="B.I.C. — Best Imported Cars"
            width={360}
            height={160}
            className="h-32 w-auto object-contain"
            unoptimized
          />
          <p className="text-sm text-white/70">
            B.I.C. «Best Imported Cars» — платформа полного цикла по подбору, импорту и продаже автомобилей и мототехники.
            Работаем с проверенными поставщиками и сопровождаем клиента на каждом этапе.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-base font-semibold text-white/85">Юридические страницы</h4>
          <div className="space-y-1 text-sm text-white/75">
            {LEGAL_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="block transition-colors hover:text-[#ec0c0c]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-base font-semibold text-white/85">Контакты</h4>
          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-5">
            {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => {
              const wrapperClasses = ["group flex items-start gap-3"]

              const labelClasses = [
                "text-xs font-semibold uppercase tracking-[0.08em] text-white/55 transition-colors",
              ]
              const valueClasses = ["whitespace-pre-line text-sm leading-relaxed text-white/80 transition-colors"]
              if (href) {
                labelClasses.push("group-hover:text-[#ec0c0c]")
                valueClasses.push("group-hover:text-[#ec0c0c]")
              }

              const content = (
                <>
                  <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 text-white transition-colors group-hover:text-[#ec0c0c]">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className={labelClasses.join(" ")}>{label}</span>
                    <span className={valueClasses.join(" ")}>{value}</span>
                  </div>
                </>
              )

              if (href) {
                const isExternal = href.startsWith("http")
                return (
                  <a
                    key={label}
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={wrapperClasses.join(" ")}
                  >
                    {content}
                  </a>
                )
              }

              return (
                <div key={label} className={wrapperClasses.join(" ")}>
                  {content}
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white/85">Следите за нами</h4>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ href, icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/8 transition-colors hover:border-[#ec0c0c] hover:bg-[#ec0c0c]/15"
                  title={label}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white transition-colors group-hover:bg-[#ec0c0c]/25 group-hover:text-[#ec0c0c]">
                    <span
                      className="h-5 w-5"
                      style={{
                        WebkitMaskImage: `url(${icon})`,
                        maskImage: `url(${icon})`,
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        backgroundColor: "currentColor",
                      }}
                    />
                  </span>
                </Link>
              ))}
            </div>
            <p className="text-xs text-white/55">
              Подписывайтесь на каналы для получения свежих подборок, новостей рынка и закрытых предложений.
            </p>
          </div>
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-white/80">Площадки B.I.C.</h5>
            <div className="space-y-2">
              {PARTNER_LINKS.map(({ href, label, icon: IconComponent, color }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm text-white/80 transition-colors hover:border-[#ec0c0c] hover:bg-[#ec0c0c]/20 hover:text-white"
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold uppercase ${color}`}>
                    <IconComponent className="h-4 w-4" />
                  </span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center justify-between gap-4 px-6 py-6 pb-16 text-xs text-white/55 md:flex-row md:pb-6">
          <span>
            © {year} B.I.C. Best Imported Cars. Все права защищены. Создано от{" "}
            <Link href="https://aramyants.com/" target="_blank" className="text-white transition-colors hover:text-[#ec0c0c]">
              aramyants
            </Link>
            .
          </span>
          <span>Параллельный импорт и сопровождение сделок в 25 странах.</span>
        </div>
      </div>
    </footer>
  )
}
