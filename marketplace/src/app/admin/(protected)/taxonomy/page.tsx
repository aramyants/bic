import Link from "next/link";

import { ColorValuePicker } from "@/components/admin/color-value-picker";
import { upsertTaxonomyAction, deleteTaxonomyAction } from "@/server/taxonomy-admin";
import { getTaxonomyByType, TAXONOMY_TYPES, type TaxonomyType } from "@/server/taxonomy-service";

type SearchParams =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>;

export default async function TaxonomyPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const typeParam = Array.isArray(params.type) ? params.type[0] : params.type;
  const selectedType = (typeParam as TaxonomyType) || "brand";
  const isColorType = selectedType === "color";

  const entries = await getTaxonomyByType(selectedType);
  const isHexColor = (value: string) => /^#([0-9a-fA-F]{6})$/.test(value);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Справочники</h1>
          <p className="text-sm text-white/60">
            Управляйте брендами, моделями, цветами и другими общими атрибутами
            для карточек и фильтров.
          </p>
        </div>
        <Link
          href="/admin/vehicles"
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/70 hover:text-white"
        >
          К автомобилям
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {TAXONOMY_TYPES.map((item) => {
          const active = item.type === selectedType;
          return (
            <Link
              key={item.type}
              href={`/admin/taxonomy?type=${item.type}`}
              className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                active
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5">
          <div className="overflow-hidden">
            <table className="w-full table-fixed text-left text-sm text-white/70">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.14em] text-white/45">
                <tr>
                  <th className="px-4 py-3">Метка</th>
                  <th className="px-4 py-3">Значение</th>
                  <th className="px-4 py-3">Родитель</th>
                  <th className="w-20 px-4 py-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-white/50"
                    >
                      Пусто. Добавьте первый элемент для этого справочника.
                    </td>
                  </tr>
                ) : (
                  entries.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 last:border-none"
                    >
                      <td className="px-4 py-3 text-white">
                        <div className="flex items-center gap-2">
                          {isColorType && isHexColor(item.value) ? (
                            <span
                              className="h-3 w-3 rounded-full border border-white/40"
                              style={{ backgroundColor: item.value }}
                            />
                          ) : null}
                          <span>{item.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/80">
                        {item.value}
                      </td>
                      <td className="px-4 py-3 text-white/60">
                        {item.parentValue || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <form action={deleteTaxonomyAction}>
                          <input
                            type="hidden"
                            name="id"
                            value={item.id}
                          />
                          <input
                            type="hidden"
                            name="type"
                            value={selectedType}
                          />
                          <button
                            className="text-xs text-red-300 hover:text-red-200"
                            type="submit"
                          >
                            Удалить
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/6 p-4 text-sm text-white/80">
          <h3 className="text-base font-semibold text-white">
            Добавить / обновить
          </h3>
          <p className="text-xs text-white/55">
            Используйте одинаковые значения в поле «Значение» для консистентности
            фильтров.
          </p>
          <form action={upsertTaxonomyAction} className="mt-4 space-y-3">
            <input type="hidden" name="type" value={selectedType} />
            <label className="space-y-1 block">
              <span className="text-xs uppercase tracking-[0.14em] text-white/50">
                Метка
              </span>
              <input
                name="label"
                required
                className="h-10 w-full rounded-lg border border-white/15 bg-black/30 px-3 text-sm text-white placeholder:text-white/35 focus:border-brand-primary focus:outline-none"
                placeholder="Например, RAM"
              />
            </label>
            {isColorType ? (
              <label className="space-y-1 block">
                <span className="text-xs uppercase tracking-[0.14em] text-white/50">
                  Значение (HEX)
                </span>
                <ColorValuePicker name="value" />
              </label>
            ) : (
              <label className="space-y-1 block">
                <span className="text-xs uppercase tracking-[0.14em] text-white/50">
                  Значение (латиница)
                </span>
                <input
                  name="value"
                  required
                  className="h-10 w-full rounded-lg border border-white/15 bg-black/30 px-3 text-sm text-white placeholder:text-white/35 focus:border-brand-primary focus:outline-none"
                  placeholder="ram"
                />
              </label>
            )}
            <label className="space-y-1 block">
              <span className="text-xs uppercase tracking-[0.14em] text-white/50">
                Родитель (для моделей укажите бренд)
              </span>
              <input
                name="parentValue"
                className="h-10 w-full rounded-lg border border-white/15 bg-black/30 px-3 text-sm text-white placeholder:text-white/35 focus:border-brand-primary focus:outline-none"
                placeholder="например, jeep"
              />
            </label>
            <label className="space-y-1 block">
              <span className="text-xs uppercase tracking-[0.14em] text-white/50">
                Сортировка
              </span>
              <input
                name="sortOrder"
                type="number"
                defaultValue={0}
                className="h-10 w-full rounded-lg border border-white/15 bg-black/30 px-3 text-sm text-white placeholder:text-white/35 focus:border-brand-primary focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-primary-strong"
            >
              Сохранить элемент
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
