import type { Metadata } from "next";

import { LandedCostCalculator } from "@/components/calculator/landed-cost-calculator";
import { Badge } from "@/components/ui/badge";
import { toCalculatorSettings } from "@/lib/calculator";
import { getActiveCalculatorConfig } from "@/server/calculator-service";
import { getEurRubRate } from "@/server/exchange-service";

export const metadata: Metadata = {
  title: "Калькулятор растаможки и логистики | B.I.C.",
  description:
    "Онлайн-калькулятор доставки и растаможки автомобилей. Получите ориентировочную стоимость ввоза авто вместе с B.I.C.",
};

export default async function CalculatorPage() {
  const [eurRubRate, calculatorConfig] = await Promise.all([
    getEurRubRate().catch(() => 100),
    getActiveCalculatorConfig().catch(() => null),
  ]);
  const calculatorSettings = toCalculatorSettings(calculatorConfig);

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-8 px-6 py-16 text-white">
      <div className="space-y-3">
        <Badge tone="outline">Калькулятор расходов</Badge>
        <h1 className="text-4xl font-semibold">Расчёт доставки и оформления авто</h1>
        <p className="text-sm text-white/70">
          Введите параметры автомобиля и получите ориентировочную стоимость с учётом пошлин, НДС и логистики. Мы
          работаем как с частными лицами, так и с компаниями.
        </p>
        <p className="text-xs text-white/55">Текущий курс EUR/RUB: {eurRubRate.toFixed(2)}</p>
      </div>
      <LandedCostCalculator baseRate={eurRubRate} settings={calculatorSettings} />
      <div className="rounded-[32px] border border-white/10 bg-white/6 px-6 py-5 text-sm text-white/70">
        <p>
          Результат носит ориентировочный характер. Точная сумма зависит от комплектации, ставок таможенных пошлин и
          выбранной логистики. Команда B.I.C. проконсультирует и подготовит индивидуальный расчёт.
        </p>
      </div>
    </div>
  );
}
