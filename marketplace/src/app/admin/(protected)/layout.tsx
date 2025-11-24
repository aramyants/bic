'use client';

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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { signOutAction } from '@/server/auth-actions';

const navItems = [
  { href: '/admin', label: 'Главная', icon: LayoutDashboard },
  { href: '/admin/vehicles', label: 'Автомобили', icon: Car },
  { href: '/admin/hierarchy', label: 'Иерархия брендов', icon: Layers },
  { href: '/admin/calculator', label: 'Калькулятор', icon: Calculator },
  { href: '/admin/brand-logos', label: 'Бренды на главной', icon: Images },
  { href: '/admin/testimonials', label: 'Отзывы', icon: MessageSquare },
  { href: '/admin/sources', label: 'Источники', icon: Database },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="flex">
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-6 py-6">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">B.I.C.</div>
                  <div className="text-xs text-white/50">Админ-панель</div>
                </div>
              </Link>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
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
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-4">
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

        <main className="ml-64 flex-1 p-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
