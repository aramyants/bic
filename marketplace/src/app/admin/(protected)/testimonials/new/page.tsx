import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { TestimonialForm } from '@/components/admin/testimonial-form';
import { createTestimonial } from '@/server/testimonials-service';

export default function NewTestimonialPage() {
  async function handleCreate(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    const content = formData.get('content') as string;
    const rating = Number.parseInt(formData.get('rating') as string);
    const isPublished = formData.get('isPublished') === 'on';
    const sortOrder = Number.parseInt(formData.get('sortOrder') as string) || 0;

    await createTestimonial({
      name,
      location: location || null,
      content,
      rating,
      isPublished,
      sortOrder,
    });

    redirect('/admin/testimonials');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/testimonials"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Новый отзыв</h1>
          <p className="mt-1 text-sm text-white/60">Добавьте имя клиента, текст и оценку.</p>
        </div>
      </div>

      <TestimonialForm action={handleCreate} />
    </div>
  );
}
