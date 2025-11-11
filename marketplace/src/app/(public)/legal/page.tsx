import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Юридические документы | B.I.C.",
  description: "Публичная оферта, политика конфиденциальности и правила использования сервисов B.I.C.",
};

const documents = [
  {
    name: "Публичная оферта",
    description: "Условия предоставления услуг по подбору и поставке автомобилей и мототехники.",
    href: "/docs/bic-offer.pdf",
  },
  {
    name: "Политика обработки персональных данных",
    description: "Как мы защищаем данные клиентов и партнеров, порядок хранения и удаления информации.",
    href: "/docs/bic-privacy.pdf",
  },
  {
    name: "Правила использования Telegram-бота",
    description: "Рекомендации по подключению бота, порядок уведомлений и автоматической отправки заявок.",
    href: "/docs/bic-bot.pdf",
  },
];

export default function LegalPage() {
  return (
    <div className="mx-auto w-full max-w-[820px] space-y-10 px-6 py-16 text-white">
      <div className="space-y-3">
        <Badge tone="outline">Юридические документы</Badge>
        <h1 className="text-4xl font-semibold">Правовые материалы B.I.C.</h1>
        <p className="text-sm text-white/70">
          Здесь собраны ключевые документы компании. Если вам нужно официальное письмо или реквизиты для договора —
          оставьте запрос через форму в разделе «Контакты».
        </p>
      </div>
      <div className="space-y-4 text-sm text-white/75">
        {documents.map((doc) => (
          <div
            key={doc.name}
            className="flex flex-col gap-1 rounded-[28px] border border-white/10 bg-white/6 px-5 py-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="font-semibold text-white">{doc.name}</div>
              <div>{doc.description}</div>
            </div>
            <a href={doc.href} target="_blank" rel="noreferrer" className="text-xs text-white hover:underline">
              Скачать
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
