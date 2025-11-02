import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Доставка и растаможка | B.I.C.",
  description: "Схема доставки автомобилей, таможенного оформления и выдачи клиентам в B.I.C.",
};

const logistics = [
  {
    title: "Маршруты поставки",
    points: [
      "Европа → Россия: автотранспорт, железная дорога и морская контейнерная линия.",
      "Азия и США → Россия: судно до порта Кавказ/Санкт-Петербург, далее автотранспорт до техцентра.",
      "VIP-доставка: авиа-доставка и индивидуальное страхование груза по запросу клиента.",
    ],
  },
  {
    title: "Таможенное оформление",
    points: [
      "Расчёт пошлин и акцизов по ставкам ЕАЭС с учётом возраста и объёма двигателя.",
      "Предоставление полного пакета документов (инвойс, договор, экспортные декларации, инспекционный отчёт).",
      "Оплата: 20% предоплата при бронировании, далее пошлина + НДС + утилизационный сбор + логистика.",
    ],
  },
  {
    title: "Сертификация и выдача",
    points: [
      "Организация СБКТС, выдача ЭПТС, постановка на учёт и получение российских госномеров.",
      "Предпродажная подготовка (мойка, детейлинг, диагностика), при необходимости дооснащение.",
      "Выдача в центре B.I.C. в Москве или доставка «последней мили» до двери клиента.",
    ],
  },
];

export default function DeliveryPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-10 px-6 py-16 text-white">
      <div className="space-y-3">
        <Badge tone="outline">Доставка и растаможка</Badge>
        <h1 className="text-4xl font-semibold">Логистика, таможня и выдача автомобиля</h1>
        <p className="text-sm text-white/70">
          Мы отвечаем за весь процесс: от планирования маршрута до таможенного оформления и передачи автомобиля клиенту.
          Работая с B.I.C., вы получаете прозрачные сроки и фиксированные этапы оплаты.
        </p>
      </div>
      <div className="space-y-8">
        {logistics.map((block) => (
          <section key={block.title} className="space-y-4 rounded-[32px] border border-white/10 bg-white/6 p-7">
            <h2 className="text-xl font-semibold text-white">{block.title}</h2>
            <ul className="space-y-2 text-sm text-white/75">
              {block.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="rounded-[32px] border border-brand-primary/40 bg-brand-primary/10 px-6 py-5 text-sm text-white/80">
        Хотите рассчитать маршрут до вашего города? Воспользуйтесь нашим <a href="/calculator" className="text-white hover:underline">калькулятором</a>
        {" "}и отправьте расчёт менеджеру B.I.C. — мы подтвердим сроки и стоимость.
      </div>
    </div>
  );
}
