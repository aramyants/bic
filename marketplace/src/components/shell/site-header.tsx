"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/process", label: "Как это работает" },
  { href: "/delivery", label: "Доставка и растаможка" },
  { href: "/pricing", label: "Комиссия и цены" },
  { href: "/about", label: "О компании" },
  { href: "/contacts", label: "Контакты" },
  { href: "/calculator", label: "Калькулятор" },
];

const CTA_LABEL = "Оставить заявку";
const SERVICE_STRIP = "24/7 • 25 стран";

export const SiteHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    const normalizePath = (path: string) => (path === "/" ? "/" : path.replace(/\/+$/, ""));
    const current = normalizePath(pathname || "/");
    const target = normalizePath(href);

    if (target === "/") return current === "/";

    return current === target || current.startsWith(`${target}/`);
  };

  React.useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between rounded-full border border-white/10 bg-black/70 px-6 py-4 text-white shadow-soft transition">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-5">
            <Image
              src="/logo.png"
              alt="B.I.C. — Best Imported Cars"
              width={248}
              height={96}
              className="h-20 w-auto object-contain"
              priority
              unoptimized
            />

          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/70 xl:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "transition hover:text-white",
                isActive(item.href) ? "text-white" : "text-white/70",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <div className="text-xs text-white/55">{}</div>
          <Link
            href="#request"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand-primary px-6 text-xs font-semibold text-white transition hover:bg-brand-primary-strong"
          >
            {CTA_LABEL}
          </Link>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 xl:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Открыть меню"
        >
          <span className="flex h-6 w-6 flex-col items-center justify-center gap-1">
            <span className={cn("h-[2px] w-full bg-white transition", menuOpen && "translate-y-[5px] rotate-45")}></span>
            <span className={cn("h-[2px] w-full bg-white transition", menuOpen && "opacity-0")}></span>
            <span className={cn("h-[2px] w-full bg-white transition", menuOpen && "-translate-y-[5px] -rotate-45")}></span>
          </span>
        </button>
      </div>

      <div
        className={cn(
          "xl:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="mx-auto mt-4 w-full max-w-[320px] space-y-4 rounded-3xl border border-white/10 bg-black/85 p-6 text-sm text-white/75 shadow-strong">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "block rounded-full px-4 py-3 text-center transition hover:bg-white/10",
                isActive(item.href) ? "bg-white/10 text-white" : "bg-white/5",
              )}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#request"
            onClick={() => setMenuOpen(false)}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white transition hover:bg-brand-primary-strong"
          >
            {CTA_LABEL}
          </Link>
          <div className="text-center text-xs text-white/45">{SERVICE_STRIP}</div>
        </div>
      </div>
    </header>
  );
};
