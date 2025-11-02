import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "О компании | B.I.C.",
  description: "B.I.C. «Best Imported Cars» — команда экспертов параллельного импорта автомобилей и мототехники.",
};

const values = [
  {
    title: "Экспертиза",
    text: "15 специалистов по международным поставкам, таможенному праву и сертификации техники.",
  },
  {
    title: "Партнёрство",
    text: "Прямые контракты с дилерами и аукционами Европы, США, ОАЭ, Японии и Южной Кореи.",
  },
  {
    title: "Технологии",
    text: "Собственная CRM, Telegram-бот, интеграции с mobile.de и логистическими операторами.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[920px] space-y-10 px-6 py-16 text-white">
      <div className="space-y-3">
        <Badge tone="outline">О компании</Badge>
        <h1 className="text-4xl font-semibold">B.I.C. «Best Imported Cars»</h1>
        <p className="text-sm text-white/70">
          Мы занимаемся параллельным импортом автомобилей и мототехники с 2012 года. Сопровождаем клиента от подбора до
          выдачи, берём на себя юридические, финансовые и логистические вопросы.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {values.map((item) => (
          <div key={item.title} className="space-y-2 rounded-[32px] border border-white/10 bg-white/6 p-6">
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            <p className="text-sm text-white/75">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 text-sm text-white/75">
        <h2 className="mb-2 text-lg font-semibold text-white">Контакты и реквизиты</h2>
        <ul className="space-y-1">
          <li>Юридическое лицо: ООО «Бест Импортед Карс»</li>
          <li>Офис: Москва, Дербеневская набережная, 7, стр. 10</li>
          <li>Телефон: <a href="tel:+74952600000" className="text-white hover:underline">+7 (495) 260-00-00</a></li>
          <li>Email: <a href="mailto:sales@bic.market" className="text-white hover:underline">sales@bic.market</a></li>
          <li>ИНН 9721001234 · ОГРН 1227700000000</li>
        </ul>
      </div>
    </div>
  );
}
