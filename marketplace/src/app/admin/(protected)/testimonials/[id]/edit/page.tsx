import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { TestimonialForm } from '@/components/admin/testimonial-form';
import {
  deleteTestimonial,
  getTestimonialById,
  updateTestimonial,
} from '@/server/testimonials-service';

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);

  if (!testimonial) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    const content = formData.get('content') as string;
    const rating = Number.parseInt(formData.get('rating') as string);
    const isPublished = formData.get('isPublished') === 'on';
    const sortOrder = Number.parseInt(formData.get('sortOrder') as string) || 0;
    const avatarRaw = (formData.get('avatar') as string) ?? '';
    const avatar = avatarRaw.trim() || null;

    await updateTestimonial(id, {
      name,
      location: location || null,
      avatar,
      content,
      rating,
      isPublished,
      sortOrder,
    });

    redirect('/admin/testimonials');
  }

  async function handleDelete() {
    'use server';

    await deleteTestimonial(id);
    redirect('/admin/testimonials');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/testimonials"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Редактирование отзыва
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Обновите текст и статус публикации.
            </p>
          </div>
        </div>
        <form action={handleDelete}>
          <button
            type="submit"
            className="rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            Удалить
          </button>
        </form>
      </div>

      <TestimonialForm action={handleUpdate} initialData={testimonial} />
    </div>
  );
}
