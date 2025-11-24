import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BrandLogoForm } from "@/components/admin/brand-logo-form";
import { deleteBrandLogoAction, updateBrandLogoAction } from "@/server/brand-logos-admin";
import { getBrandLogoById } from "@/server/brand-logos-service";

type RouteParams = Promise<{ id: string }> | { id: string };

export default async function EditBrandLogoPage({ params }: { params: RouteParams }) {
  const { id } = await params;
  const logo = await getBrandLogoById(id);

  if (!logo) {
    notFound();
  }

  const defaults = {
    id: logo.id,
    name: logo.name,
    href: logo.href,
    logoUrl: logo.logoUrl,
    sortOrder: logo.sortOrder,
    isActive: logo.isActive,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/brand-logos"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-white">Редактировать логотип</h1>
            <p className="text-sm text-white/60">Обновите имя, ссылку и статус отображения.</p>
          </div>
        </div>
        <form action={deleteBrandLogoAction}>
          <input type="hidden" name="id" value={logo.id} />
          <button
            type="submit"
            className="rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
          >
            Удалить
          </button>
        </form>
      </div>

      <BrandLogoForm action={updateBrandLogoAction} defaultValues={defaults} submitLabel="Сохранить изменения" />
    </div>
  );
}
