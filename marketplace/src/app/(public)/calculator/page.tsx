import type { Metadata } from "next";

import { LandedCostCalculator } from "@/components/calculator/landed-cost-calculator";
import { Badge } from "@/components/ui/badge";
import { getEurRubRate } from "@/server/exchange-service";

export const metadata: Metadata = {
  title: "Калькулятор стоимости | B.I.C.",
  description:
    "Онлайн-калькулятор полной стоимости автомобиля с доставкой, растаможкой и комиссией B.I.C. по курсу ЦБ РФ.",
};

export default async function CalculatorPage() {
  const eurRubRate = await getEurRubRate().catch(() => 100);

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-8 px-6 py-16 text-white">
      <div className="space-y-3">
        <Badge tone="outline">Калькулятор стоимости</Badge>
        <h1 className="text-4xl font-semibold">Расчёт «под ключ» для вашего автомобиля</h1>
        <p className="text-sm text-white/70">
          Укажите стоимость авто у продавца и измените параметры — увидите примерную сумму в рублях с учётом логистики,
          таможни и комиссии. Для уточнения цифр отправьте расчёт менеджеру B.I.C.
        </p>
        <p className="text-xs text-white/55">Текущий курс ЦБ: {eurRubRate.toFixed(2)} ₽/€</p>
      </div>
      <LandedCostCalculator baseRate={eurRubRate} />
      <div className="rounded-[32px] border border-white/10 bg-white/6 px-6 py-5 text-sm text-white/70">
        <p>
          Результат носит справочный характер. Финальная стоимость подтверждается после проверки автомобиля и фиксации
          договора. Поможем подобрать оптимальный маршрут и выбрать выгодный сценарий оплаты.
        </p>
      </div>
    </div>
  );
}
