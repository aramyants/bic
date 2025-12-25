import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { BrandLogoForm } from "@/components/admin/brand-logo-form";
import { createBrandLogoAction } from "@/server/brand-logos-admin";

export default function NewBrandLogoPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Link
          href="/admin/brand-logos"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-white">Добавить логотип</h1>
          <p className="text-sm text-white/60">
            Загрузите лого и добавьте ссылку для секции с брендами на главной странице.
          </p>
        </div>
      </div>

      <BrandLogoForm action={createBrandLogoAction} submitLabel="Создать логотип" />
    </div>
  );
}
