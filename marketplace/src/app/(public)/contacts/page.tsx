import Link from "next/link";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Контакты | B.I.C.",
  description:
    "Офис и контактные данные B.I.C. Best Imported Cars: телефон, электронная почта, социальные сети и режим работы.",
};

export default function ContactsPage() {
  return (
    <div className="mx-auto w-full max-w-[780px] space-y-10 px-6 py-16 text-white">
      <div className="space-y-3">
        <Badge tone="outline">Контакты</Badge>
        <h1 className="text-4xl font-semibold">Связаться с B.I.C.</h1>
        <p className="text-sm text-white/70">
          Мы на связи ежедневно с 10:00 до 20:00 (МСК). Используйте удобный канал: телефон, email или Telegram-бот. Для
          оперативных вопросов доступен чат с менеджером и CRM.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-[32px] border border-white/10 bg-white/6 p-6 text-sm text-white/80">
          <h2 className="text-lg font-semibold text-white">Основные контакты</h2>
          <p>Телефон: <a href="tel:+74952600000" className="text-white hover:underline">+7 (495) 260-00-00</a></p>
          <p>Email: <a href="mailto:sales@bic.market" className="text-white hover:underline">sales@bic.market</a></p>
          <p>Офис: Москва, Дербеневская наб., 7, стр. 10</p>
          <p>Склад-выдача: Химки, Ленинградское ш., 25</p>
          <p>График: пн‑сб 10:00–20:00, вс — по записи</p>
        </div>
        <div className="space-y-3 rounded-[32px] border border-white/10 bg-white/6 p-6 text-sm text-white/80">
          <h2 className="text-lg font-semibold text-white">Telegram</h2>
          <p>Бот: <a href="https://t.me/BIC_auto_bot" className="text-white hover:underline">@BIC_auto_bot</a></p>
          <p>Канал: <a href="https://t.me/bicauto" className="text-white hover:underline">@bicauto</a></p>
          <p>
            Добавьте бота администратором канала для автопостинга из каталога и автоматической обработки заявок, которые
            приходят через сайт.
          </p>
        </div>
      </div>
      <div className="space-y-3 rounded-[32px] border border-white/10 bg-white/6 p-6 text-sm text-white/80">
        <h2 className="text-lg font-semibold text-white">Как нас найти</h2>
        <p>
          Пользуйтесь интерактивной картой в разделе <Link href="/#contacts" className="text-white hover:underline">Контакты</Link>{" "}
          на главной странице или запросите маршрут у менеджера B.I.C. — мы отправим точные координаты и пропуск для въезда.
        </p>
      </div>
    </div>
  );
}
