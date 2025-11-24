import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

type Section = {
  title: string;
  description?: string;
  items: string[];
};

const sections: Section[] = [
  {
    title: "Наша позиция",
    items: [
      "Мы стремимся сделать цифровые сервисы B.I.C. удобными для людей с разными потребностями и устройствами.",
      "Ориентируемся на принципы WCAG 2.1 уровня AA: воспринимаемость, управляемость, понятность и надёжность интерфейсов.",
    ],
  },
  {
    title: "Что уже реализовано",
    items: [
      "Семантическая разметка, иерархия заголовков, понятные подписи для полей форм.",
      "Навигация с клавиатуры и заметные состояния фокуса для интерактивных элементов.",
      "Контрастные цвета текста и фона, возможность масштабирования без потери функциональности.",
      "Альтернативные тексты для ключевых изображений; если подписи отсутствуют, мы добавляем их по обращению.",
      "Чёткие статусы ошибок при валидации форм и подсказки по заполнению.",
    ],
  },
  {
    title: "Поддерживаемые среды",
    items: [
      "Актуальные версии современных браузеров (Chrome, Safari, Firefox, Edge) на десктопах и мобильных устройствах.",
      "Работа на экранах от 360 пикселей по ширине с адаптивной версткой и упрощённой навигацией.",
      "Доступ к основным функциям без необходимости включать звук или воспроизводить видео.",
    ],
  },
  {
    title: "Известные ограничения и планы",
    items: [
      "Отдельные PDF-документы могут содержать изображения без текстового слоя. По запросу предоставим доступный формат.",
      "Не все промо-видео пока снабжены субтитрами; мы последовательно добавляем их в новые материалы.",
      "Для некоторых динамических элементов (например, фильтров каталога) мы продолжаем улучшать ARIA-атрибуты и подсказки для скринридеров.",
    ],
  },
  {
    title: "Обратная связь и поддержка",
    items: [
      "Если вы столкнулись с недоступным контентом или ошибками навигации, сообщите нам — мы постараемся исправить их оперативно.",
      "Вы можете запросить альтернативный формат материалов (текст вместо сканов, субтитры к видео, описание изображений).",
      "Мы отвечаем на обращения о доступности в течение 5 рабочих дней и сообщаем о статусе исправления.",
    ],
  },
];

const SectionCard = ({ title, description, items }: Section) => (
  <section className="space-y-3 rounded-[28px] border border-white/10 bg-white/6 p-5 md:p-6">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {description ? <p className="text-sm text-white/70">{description}</p> : null}
    <ul className="space-y-2 text-sm text-white/75">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </section>
);

export const metadata: Metadata = {
  title: "Декларация доступности | B.I.C.",
  description: "Принципы доступности цифровых сервисов B.I.C. и способы обратной связи.",
};

export default function AccessibilityPage() {
  return (
    <div className="mx-auto w-full max-w-[960px] space-y-10 px-6 py-16 text-white">
      <div className="space-y-3">
        <Badge tone="outline">Декларация доступности</Badge>
        <h1 className="text-4xl font-semibold">Доступность сервисов B.I.C.</h1>
        <p className="text-sm text-white/70">
          Мы хотим, чтобы каждый пользователь мог получить информацию о поставке автомобилей и воспользоваться нашими
          сервисами. Ниже — меры, которые мы уже внедрили, и каналы обратной связи.
        </p>
        <p className="text-xs text-white/50">Версия: ноябрь 2025</p>
      </div>
      <div className="space-y-5">
        {sections.map((section) => (
          <SectionCard key={section.title} {...section} />
        ))}
      </div>
      <div className="rounded-[28px] border border-brand-primary/35 bg-brand-primary/10 px-5 py-4 text-sm text-white/80 md:px-6 md:py-5">
        <div className="font-semibold text-white">Свяжитесь с нами</div>
        <p className="mt-2">
          Опишите проблему доступности или отправьте пожелания на{" "}
          <a href="mailto:sales@bic.market" className="text-white hover:underline">
            sales@bic.market
          </a>{" "}
          или по телефону{" "}
          <a href="tel:+74952600000" className="text-white hover:underline">
            +7 (495) 260-00-00
          </a>
          . Если нужно, мы предложим альтернативный способ получения информации.
        </p>
      </div>
    </div>
  );
}
