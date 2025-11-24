export default async function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Обзор</h1>
            <p className="text-sm text-white/60">
            Добро пожаловать в панель администратора B.I.C. Управляйте каталогом, калькулятором и отзывами через меню слева или выберите нужный раздел ниже.
            </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Каталог", description: "Создавайте и редактируйте автомобили", href: "/admin/vehicles" },
          { title: "Калькулятор", description: "Настройка ставок и логистики", href: "/admin/calculator" },
          { title: "Отзывы", description: "Публикуйте отзывы клиентов", href: "/admin/testimonials" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-white transition hover:border-orange-500/40 hover:bg-white/10"
          >
            <div className="text-lg font-semibold">{item.title}</div>
            <div className="mt-2 text-sm text-white/65">{item.description}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
