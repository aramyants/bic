'use client';

import { Star } from 'lucide-react';
import * as React from 'react';

import { ImageUploadField } from '@/components/admin/image-upload-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Testimonial } from '@/db/schema';

export type TestimonialActionState = {
  status: 'idle' | 'error';
  message?: string;
};

type TestimonialFormAction = (
  state: TestimonialActionState,
  formData: FormData
) => Promise<TestimonialActionState>;

interface TestimonialFormProps {
  action: TestimonialFormAction;
  initialData?: Testimonial;
}

const DEFAULT_STATE: TestimonialActionState = { status: 'idle' };

export function TestimonialForm({ action, initialData }: TestimonialFormProps) {
  const [state, formAction] = React.useActionState(action, DEFAULT_STATE);
  const [rating, setRating] = React.useState(initialData?.rating ?? 5);
  const [avatar, setAvatar] = React.useState<string[]>(
    initialData?.avatar ? [initialData.avatar] : []
  );
  const showError = state.status === 'error';

  return (
    <form action={formAction} className="space-y-6">
      {showError ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {state.message ?? 'Unable to save testimonial.'}
        </div>
      ) : null}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Имя клиента *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={initialData?.name}
              placeholder="Иван Иванов"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Город, страна</Label>
            <Input
              id="location"
              name="location"
              defaultValue={initialData?.location ?? ''}
              placeholder="Москва, Россия"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="space-y-1">
            <Label>Фото / аватар</Label>
            <p className="text-xs text-white/50">Опционально: загрузите файл или вставьте ссылку на портрет.</p>
          </div>
          <ImageUploadField
            label="Изображение"
            description="Поддерживается загрузка или ссылка (https:// или /uploads/...)."
            value={avatar}
            onChange={(urls) => setAvatar(urls.slice(0, 1))}
            maxImages={1}
          />
          <input type="hidden" name="avatar" value={avatar[0] ?? ''} />
        </div>

        <div className="mt-6 space-y-2">
          <Label htmlFor="content">Отзыв *</Label>
          <textarea
            id="content"
            name="content"
            required
            defaultValue={initialData?.content}
            rows={6}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            placeholder="Опишите опыт клиента: скорость доставки, сервис, результат."
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Оценка *</Label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="transition hover:scale-110"
                  aria-label={`Set rating to ${i + 1}`}
                >
                  <Star
                    className={`h-6 w-6 ${
                      i < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/20'
                    }`}
                  />
                </button>
              ))}
            </div>
            <input type="hidden" name="rating" value={rating} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Порядок показа</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={initialData?.sortOrder ?? 0}
              placeholder="0"
            />
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              defaultChecked={initialData?.isPublished ?? true}
              className="h-5 w-5 rounded border-white/20 bg-white/10 text-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
            <Label htmlFor="isPublished" className="cursor-pointer">
              Публиковать
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" size="lg">
          {initialData ? 'Сохранить' : 'Создать'} отзыв
        </Button>
      </div>
    </form>
  );
}
