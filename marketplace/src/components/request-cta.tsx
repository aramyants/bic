'use client';

import { useEffect, useState } from "react";

import { useRequestModal } from "@/components/request-modal";
import { Button } from "@/components/ui/button";

type Props = {
  vehicleId?: string;
  vehicleSlug?: string;
  vehicleTitle: string;
  priceEur?: number | null;
  priceRub?: number | null;
};

export function RequestCtaCard({ vehicleId, vehicleSlug, vehicleTitle, priceEur, priceRub }: Props) {
  const requestModal = useRequestModal();
  const [pageUrl, setPageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
    }
  }, []);

  return (
    <div className="rounded-[28px] border border-white/12 bg-white/8 p-5 text-white shadow-lg shadow-black/20 sm:p-6">
      <div className="space-y-2">
        <p className="text-sm text-white/75">Зафиксировать расчёт и связаться с менеджером.</p>
        <p className="text-xs text-white/60">
          Мы проверим авто, подтвердим итоговую сумму и поможем с оформлением.
        </p>
      </div>
      <Button
        type="button"
        size="lg"
        className="mt-4 w-full"
        onClick={() =>
          requestModal.open({
            source: "vehicle-page",
            vehicleId,
            vehicleSlug,
            vehicleTitle,
            priceEur: priceEur ?? undefined,
            priceRub: priceRub ?? undefined,
            pageUrl,
            prefillMessage: `Здравствуйте! Я смотрю ${vehicleTitle}. Помогите подобрать и рассчитать финальную стоимость.`,
          })
        }
      >
        Оставить заявку
      </Button>
    </div>
  );
}
