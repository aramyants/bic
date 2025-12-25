import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import {
  TestimonialForm,
  type TestimonialActionState,
} from '@/components/admin/testimonial-form';
import { createTestimonial } from '@/server/testimonials-service';

const DEFAULT_ERROR_MESSAGE = 'Unable to save testimonial.';

function getTestimonialErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (code === '42P01' || code === '42703') {
    return 'Database schema is missing testimonial tables or columns. Run npm run db:migrate.';
  }
  return DEFAULT_ERROR_MESSAGE;
}

export default function NewTestimonialPage() {
  async function handleCreate(
    _prevState: TestimonialActionState,
    formData: FormData
  ): Promise<TestimonialActionState> {
    'use server';

    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    const content = formData.get('content') as string;
    const rating = Number.parseInt(formData.get('rating') as string);
    const isPublished = formData.get('isPublished') === 'on';
    const sortOrder = Number.parseInt(formData.get('sortOrder') as string) || 0;
    const avatarRaw = (formData.get('avatar') as string) ?? '';
    const avatar = avatarRaw.trim() || null;

    try {
      await createTestimonial({
        name,
        location: location || null,
        avatar,
        content,
        rating,
        isPublished,
        sortOrder,
      });
    } catch (error) {
      console.error('[testimonials] create failed', error);
      return { status: 'error', message: getTestimonialErrorMessage(error) };
    }

    redirect('/admin/testimonials');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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
