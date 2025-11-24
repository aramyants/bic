import { Plus, Star } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { getAllTestimonials } from '@/server/testimonials-service';

export default async function TestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Отзывы</h1>
          <p className="mt-1 text-sm text-white/60">Управляйте отзывами клиентов: публикуйте, сортируйте и редактируйте.</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Добавить отзыв
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <table className="w-full">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/70">
                Клиент
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/70">
                Текст
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/70">
                Оценка
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/70">
                Статус
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/70">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id} className="transition hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-white/15"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-semibold text-white">
                        {testimonial.name[0]}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-white">
                        {testimonial.name}
                      </div>
                      {testimonial.location && (
                        <div className="text-xs text-white/50">
                          {testimonial.location}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="max-w-md px-6 py-4">
                  <p className="line-clamp-2 text-sm text-white/70">
                    {testimonial.content}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge tone={testimonial.isPublished ? 'success' : 'default'}>
                    {testimonial.isPublished ? 'Опубликован' : 'Черновик'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/testimonials/${testimonial.id}/edit`}
                    className="text-sm text-orange-400 hover:text-orange-300"
                  >
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
