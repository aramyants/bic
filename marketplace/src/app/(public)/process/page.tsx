import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Как это работает | B.I.C.",
  description:
    "Этапы работы B.I.C. — подбор, проверка, выкуп, логистика, таможня и выдача автомобиля или мототехники под ключ.",
};

const steps = [
  {
    title: "Бриф и целеполагание",
    points: [
      "Выявляем бюджет, временные рамки, предпочитаемые бренды и требования к комплектации.",
      "Подписываем NDA и соглашение о конфиденциальности, согласуем формат коммуникации (Telegram, почта, CRM).",
      "Создаём профиль клиента и подключаем к личному кабинету для отслеживания статуса сделок.",
    ],
  },
  {
    title: "Подбор и проверка",
    points: [
      "Готовим 5–7 релевантных предложений из 25 стран с расчётом TCO и курсовой разницей.",
      "Проверяем историю автомобиля по международным базам, организуем инспекцию и видеорепортаж.",
      "Формируем итоговый отчёт, согласуем вариант, фиксируем стоимость и итоговые сроки поставки.",
    ],
  },
  {
    title: "Выкуп и логистика",
    points: [
      "Заключаем контракт, подключаем escrow или аккредитив, производим оплату и бронирование.",
      "Организуем транспортировку (автовоз, судоходная линия, авиа) и страхование груза.",
      "Проходим таможенное оформление, оплачиваем пошлины, проверяем соответствие требованиям ЕАЭС.",
    ],
  },
  {
    title: "Выдача и сервис",
    points: [
      "Проводим предпродажную подготовку, сертификацию, постановку на учёт в ГИБДД и выдачу ЭПТС.",
      "Устанавливаем дополнительное оборудование по запросу, помогаем с КАСКО и трейд-ином.",
      "Передаём автомобиль клиенту в центре B.I.C. или доставляем «последнюю милю» до двери.",
    ],
  },
];

export default function ProcessPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-10 px-6 py-16 text-white">
      <div className="space-y-3">
        <Badge tone="outline">Как это работает</Badge>
        <h1 className="text-4xl font-semibold">Процесс сотрудничества с B.I.C.</h1>
        <p className="text-sm text-white/70">
          Мы выстраиваем прозрачный процесс: от согласования бюджета и проверки автомобиля до доставки, таможни и выдачи.
          Каждый этап фиксируется в договоре, а статус виден в личном кабинете клиента.
        </p>
      </div>
      <div className="space-y-8">
        {steps.map((step) => (
          <section key={step.title} className="space-y-4 rounded-[32px] border border-white/10 bg-white/6 p-7">
            <h2 className="text-xl font-semibold text-white">{step.title}</h2>
            <ul className="space-y-2 text-sm text-white/75">
              {step.points.map((point) => (
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
        Готовы обсудить проект? <a href="/contacts" className="text-white hover:underline">Свяжитесь с нами</a>, и мы
        подготовим индивидуальный план закупки и доставки автомобиля под ваш запрос.
      </div>
    </div>
  );
}
