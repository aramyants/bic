import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Блог и новости | B.I.C.",
  description: "Обновления рынка, аналитика и новости компании B.I.C. — подбор и импорт автомобилей и мототехники.",
};

const posts = [
  {
    title: "Параллельный импорт в 2025 году",
    summary: "Главные тренды, изменения в законодательстве и что они означают для покупателей автомобилей.",
    link: "https://dzen.ru/id/5b9b5f2ebc251e00a9e6d9e1",
  },
  {
    title: "Как выбрать безопасный автомобиль с пробегом",
    summary: "Чек-лист проверки техники: что смотрим, какие базы используем и зачем нужен отчёт инспектора.",
    link: "https://dzen.ru/id/5b9b5f2ebc251e00a9e6d9e1",
  },
  {
    title: "Электромобили: что учитывать при заказе",
    summary: "Доступность зарядной инфраструктуры, льготы и ограничения на ввоз — собрали всё в одной статье.",
    link: "https://dzen.ru/id/5b9b5f2ebc251e00a9e6d9e1",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-[960px] space-y-10 px-6 py-16 text-white">
      <div className="space-y-3">
        <Badge tone="outline">Блог</Badge>
        <h1 className="text-4xl font-semibold">Новости и аналитика B.I.C.</h1>
        <p className="text-sm text-white/70">
          Следите за обновлениями в нашем блоге и Telegram-канале. Делимся внутрянкой рынка, кейсами клиентов и свежими
          предложениями из каталога.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.title}
            className="space-y-2 rounded-[32px] border border-white/10 bg-white/6 p-6 text-sm text-white/80"
          >
            <h2 className="text-lg font-semibold text-white">{post.title}</h2>
            <p>{post.summary}</p>
            <a href={post.link} target="_blank" rel="noreferrer" className="inline-flex text-xs text-white hover:underline">
              Читать в Дзене →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
