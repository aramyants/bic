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

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const linkSchema = z
  .string()
  .trim()
  .transform((value) => {
    if (!value) return undefined;
    if (value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }
    return `https://${value}`;
  })
  .refine((value) => !value || value.startsWith('/') || isValidUrl(value), {
    message: "Please enter a URL starting with http(s) or /."
  });

const brandLogoSchema = z.object({
  name: z.string().trim().min(2),
  logoUrl: linkSchema.refine(Boolean, { message: 'Ð£ÐºÐ°Ð¶Ð¸Ñ‚Ðµ URL Ð¸Ð·Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ñ' }),
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
    return { success: false, error: 'ÐŸÑ€Ð¾Ð²ÐµÑ€ÑŒÑ‚Ðµ Ð½Ð°Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ Ñ„Ð¾Ñ€Ð¼Ñ‹' as const };
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
    return { status: 'success', message: 'Ð›Ð¾Ð³Ð¾Ñ‚Ð¸Ð¿ Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½.' };
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === '42P01' || code === '42703') {
      return { status: 'error', message: 'ÐÑƒÐ¶Ð½Ð¾ Ð²Ñ‹Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÑŒ Ð¼Ð¸Ð³Ñ€Ð°Ñ†Ð¸Ð¸ Ð±Ð°Ð·Ñ‹ (npm run db:migrate).' };
    }
    console.error('[brand-logos] create failed', error);
    return { status: 'error', message: 'ÐÐµ ÑƒÐ´Ð°Ð»Ð¾ÑÑŒ ÑÐ¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ Ð·Ð°Ð¿Ð¸ÑÑŒ.' };
  }
}

export async function updateBrandLogoAction(
  _prev: BrandLogoActionState | undefined,
  formData: FormData
): Promise<BrandLogoActionState> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) {
    return { status: 'error', message: 'ÐÐµÑ‚ ID Ð·Ð°Ð¿Ð¸ÑÐ¸.' };
  }

  const existing = await getBrandLogoById(id);
  if (!existing) {
    return { status: 'error', message: 'Ð—Ð°Ð¿Ð¸ÑÑŒ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½Ð°.' };
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
    return { status: 'success', message: 'ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¾.' };
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === '42P01' || code === '42703') {
      return { status: 'error', message: 'ÐÑƒÐ¶Ð½Ð¾ Ð²Ñ‹Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÑŒ Ð¼Ð¸Ð³Ñ€Ð°Ñ†Ð¸Ð¸ Ð±Ð°Ð·Ñ‹ (npm run db:migrate).' };
    }
    console.error('[brand-logos] update failed', error);
    return { status: 'error', message: 'Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ Ð½Ðµ ÑƒÐ´Ð°Ð»Ð¾ÑÑŒ.' };
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


