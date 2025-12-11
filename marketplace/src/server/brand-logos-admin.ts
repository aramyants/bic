'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import type { BrandLogo } from '@/db/schema';
import {
  createBrandLogo,
  deleteBrandLogo,
  getBrandLogoById,
  updateBrandLogo,
} from '@/server/brand-logos-service';
import { requireAdmin } from '@/server/auth';

export type BrandLogoActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

const DEFAULT_STATE: BrandLogoActionState = { status: 'idle' };

const linkSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      !value ||
      value.startsWith('/') ||
      value.startsWith('http://') ||
      value.startsWith('https://'),
    {
      message: 'Укажите ссылку с http(s) или начинающуюся с /',
    }
  )
  .transform((value) => (value ? value : undefined));

const brandLogoSchema = z.object({
  name: z.string().trim().min(2),
  logoUrl: linkSchema.refine(Boolean, { message: 'Укажите URL изображения' }),
  href: linkSchema.optional(),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

function parsePayload(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = brandLogoSchema.safeParse({
    ...raw,
    isActive: formData.get('isActive') === 'on',
  });

  if (!parsed.success) {
    return { success: false, error: 'Проверьте наполнение формы' as const };
  }

  const data = parsed.data;
  return {
    success: true,
    data: {
      name: data.name,
      logoUrl: data.logoUrl!,
      href: data.href ?? null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    } satisfies Omit<BrandLogo, 'id' | 'createdAt' | 'updatedAt'>,
  };
}

export async function createBrandLogoAction(
  _prev: BrandLogoActionState | undefined,
  formData: FormData
): Promise<BrandLogoActionState> {
  await requireAdmin();
  const parsed = parsePayload(formData);
  if (!parsed.success) {
    return { status: 'error', message: parsed.error };
  }

  try {
    await createBrandLogo(parsed.data as Omit<BrandLogo, 'id' | 'createdAt' | 'updatedAt'>);
    revalidatePath('/');
    revalidatePath('/admin/brand-logos');
    revalidatePath('/admin');
    return { status: 'success', message: 'Логотип добавлен.' };
  } catch (error) {
    if ((error as { code?: string }).code === '42P01') {
      return { status: 'error', message: 'Нужно выполнить миграции базы (npm run db:migrate).' };
    }
    console.error('[brand-logos] create failed', error);
    return { status: 'error', message: 'Не удалось сохранить запись.' };
  }
}

export async function updateBrandLogoAction(
  _prev: BrandLogoActionState | undefined,
  formData: FormData
): Promise<BrandLogoActionState> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) {
    return { status: 'error', message: 'Нет ID записи.' };
  }

  const existing = await getBrandLogoById(id);
  if (!existing) {
    return { status: 'error', message: 'Запись не найдена.' };
  }

  const parsed = parsePayload(formData);
  if (!parsed.success) {
    return { status: 'error', message: parsed.error };
  }

  try {
    await updateBrandLogo(id, parsed.data as Partial<BrandLogo>);
    revalidatePath('/');
    revalidatePath('/admin/brand-logos');
    revalidatePath('/admin');
    return { status: 'success', message: 'Обновлено.' };
  } catch (error) {
    if ((error as { code?: string }).code === '42P01') {
      return { status: 'error', message: 'Нужно выполнить миграции базы (npm run db:migrate).' };
    }
    console.error('[brand-logos] update failed', error);
    return { status: 'error', message: 'Сохранить не удалось.' };
  }
}

export async function deleteBrandLogoAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  await deleteBrandLogo(id);
  revalidatePath('/');
  revalidatePath('/admin/brand-logos');
  revalidatePath('/admin');
  redirect('/admin/brand-logos');
}
