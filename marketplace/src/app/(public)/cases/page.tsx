import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Отзывы и кейсы | B.I.C.",
  description: "Реальные истории клиентов B.I.C.: подбор, доставка и выдача автомобилей и мототехники.",
};

const cases = [
  {
    title: "Porsche 911 GTS для постоянного клиента",
    summary: "Поставили автомобиль за 5 недель: Финляндия → Москва, полная предпродажная подготовка и выдача под презентацию.",
    details: [
      "Первичная стоимость 145 000 €, подтверждение скидки у официального дилера Porsche Zentrum.",
      "Организовали инспекцию на месте: лакокрасочное покрытие, диагностика силового агрегата, отчёт CarVertical.",
      "Доставили в Россию за 26 дней, провели сертификацию, поставили на учёт и передали клиенту на закрытом мероприятии.",
    ],
  },
  {
    title: "Mercedes-Benz S 580e Long для корпоративного парка",
    summary: "Импорт гибридного седана с комплексом мультимедиа и бронированным стеклом для руководства компании.",
    details: [
      "Подбор среди европейских дилеров, согласование заводской гарантии и пакета обслуживания Mercedes-Benz.",
      "Сопроводили оплату через эскроу, оформили таможню, НДС и утилизационный сбор для юридического лица.",
      "Срок поставки — 7 недель, включены доставка в шоурум, детейлинг и обучение водителя современным ассистентам.",
    ],
  },
  {
    title: "Tesla Model Y Performance из США",
    summary: "Поиск на аукционе Manheim, выкуп, доставка через порт Балтимор и адаптация электромобиля под российские сети.",
    details: [
      "Подобрали авто с минимальным пробегом, проверили батарею и провели диагностику по 75 пунктам.",
      "Доставили морем до Санкт-Петербурга, оформили «Зелёный коридор», получили сертификат соответствия.",
      "Переоборудовали зарядный порт, прошили навигацию, подготовили комплект зимней резины и доставили клиенту в Казань.",
    ],
  },
];

export default function CasesPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-10 px-6 py-16 text-white">
      <div className="space-y-3">
        <Badge tone="outline">Отзывы и кейсы</Badge>
        <h1 className="text-4xl font-semibold">Реализованные проекты B.I.C.</h1>
        <p className="text-sm text-white/70">
          Мы сопровождаем клиентов от подбора до выдачи. Эти кейсы показывают, как команда B.I.C. решает сложные задачи по
          поставке премиальных автомобилей и мототехники.
        </p>
      </div>
      <div className="space-y-6">
        {cases.map((item) => (
          <article key={item.title} className="space-y-3 rounded-[32px] border border-white/10 bg-white/6 p-7">
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="text-sm text-white/75">{item.summary}</p>
            <ul className="space-y-2 text-sm text-white/75">
              {item.details.map((detail) => (
                <li key={detail} className="flex gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
