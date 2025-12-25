'use client';

import React from 'react';
import {
  Calculator,
  Car,
  Database,
  Images,
  LayoutDashboard,
  Layers,
  LogOut,
  MessageSquare,
  Settings,
  Tags,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { signOutAction } from '@/server/auth-actions';

type AdminShellProps = {
  children: React.ReactNode;
  admin?: {
    name?: string | null;
    email?: string | null;
  };
};

const navItems = [
  { href: '/admin', label: 'Обзор', icon: LayoutDashboard },
  { href: '/admin/vehicles', label: 'Автомобили', icon: Car },
  { href: '/admin/hierarchy', label: 'Иерархия брендов', icon: Layers },
  { href: '/admin/taxonomy', label: 'Справочники', icon: Tags },
  { href: '/admin/calculator', label: 'Калькулятор', icon: Calculator },
  { href: '/admin/brand-logos', label: 'Бренды на главной', icon: Images },
  { href: '/admin/testimonials', label: 'Отзывы', icon: MessageSquare },
  { href: '/admin/sources', label: 'Источники', icon: Database },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
];

export function AdminShell({ children, admin }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const displayName = admin?.name?.trim() || 'Администратор';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!mobileNavOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="flex min-h-screen min-w-0">
        <div
          className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity lg:hidden ${
            mobileNavOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
        <aside
          className={`fixed left-0 top-0 z-50 h-dvh w-72 border-r border-white/10 bg-black/70 backdrop-blur-xl transition-transform duration-200 ease-out lg:translate-x-0 ${
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-6 py-6">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Image
                    src="/logo.png"
                    alt="Логотип B.I.C."
                    width={28}
                    height={28}
                    priority
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">B.I.C.</div>
                  <div className="text-xs text-white/50">Панель администратора</div>
                </div>
              </Link>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              <div className="px-3 pb-2 text-[11px] uppercase tracking-[0.2em] text-white/35">Меню</div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-white shadow-md ring-1 ring-orange-500/30'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-4 space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold text-white">
                  {initials || 'А'}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-white">{displayName}</div>
                  {admin?.email ? <div className="text-xs text-white/60">{admin.email}</div> : null}
                </div>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                  Выйти
                </button>
              </form>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-72">
          <div className="sticky top-0 z-30 border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Image src="/logo.png" alt="Лого B.I.C." width={22} height={22} className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">B.I.C.</div>
                  <div className="text-xs text-white/50">Панель администратора</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80"
                aria-label="Открыть меню"
              >
                <span className="flex h-5 w-5 flex-col items-center justify-center gap-1">
                  <span className="h-[2px] w-full rounded-full bg-white" />
                  <span className="h-[2px] w-full rounded-full bg-white/70" />
                  <span className="h-[2px] w-full rounded-full bg-white/50" />
                </span>
              </button>
            </div>
          </div>

          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1400px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
