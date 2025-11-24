import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getAllBrandLogos } from "@/server/brand-logos-service";

export default async function BrandLogosPage() {
  const logos = await getAllBrandLogos();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Бренды на главной</h1>
          <p className="text-sm text-white/60">
            Управляйте логотипами дилеров и партнёров для инфинит карусели на главной странице.
          </p>
        </div>
        <Link
          href="/admin/brand-logos/new"
          className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-primary-strong"
        >
          Добавить логотип
        </Link>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        <table className="w-full table-fixed text-left text-sm text-white/70">
          <thead className="border-b border-white/10 text-xs text-white/45">
            <tr>
              <th className="w-16 px-6 py-4">Лого</th>
              <th className="px-6 py-4">Название</th>
              <th className="px-6 py-4">Ссылка</th>
              <th className="w-32 px-6 py-4 text-center">Порядок</th>
              <th className="w-32 px-6 py-4 text-center">Статус</th>
              <th className="w-32 px-6 py-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {logos.map((logo) => (
              <tr key={logo.id} className="border-b border-white/5 last:border-none">
                <td className="px-6 py-4">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-black/40">
                    {logo.logoUrl ? (
                      <img src={logo.logoUrl} alt={logo.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-xs text-white/60">{logo.name[0]}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-white">
                  <div className="font-semibold">{logo.name}</div>
                  <div className="text-xs text-white/50">{logo.logoUrl}</div>
                </td>
                <td className="px-6 py-4 text-white/70">
                  {logo.href ? (
                    <a href={logo.href} target="_blank" rel="noreferrer" className="text-xs text-orange-300 hover:text-orange-200">
                      {logo.href}
                    </a>
                  ) : (
                    <span className="text-xs text-white/40">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center text-white/80">{logo.sortOrder}</td>
                <td className="px-6 py-4 text-center">
                  <Badge tone={logo.isActive ? "success" : "default"}>
                    {logo.isActive ? "Активен" : "Скрыт"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/brand-logos/${logo.id}/edit`}
                    className="text-xs text-orange-300 transition hover:text-orange-200"
                  >
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
            {logos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-white/50">
                  Логотипов ещё нет. Добавьте первый, чтобы показать клиентов, с кем работаем.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
