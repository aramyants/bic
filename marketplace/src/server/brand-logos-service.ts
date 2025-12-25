'use server';

import { asc, desc, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import {
  brandLogos,
  type BrandLogo,
  type NewBrandLogo,
} from '@/db/schema';

export async function getActiveBrandLogos(): Promise<BrandLogo[]> {
  try {
    return await db
      .select()
      .from(brandLogos)
      .where(eq(brandLogos.isActive, true))
      .orderBy(asc(brandLogos.sortOrder), desc(brandLogos.createdAt));
  } catch (error) {
    console.error('[brand-logos] failed to load active entries', error);
    return [];
  }
}

export async function getAllBrandLogos(): Promise<BrandLogo[]> {
  try {
    return await db
      .select()
      .from(brandLogos)
      .orderBy(asc(brandLogos.sortOrder), desc(brandLogos.createdAt));
  } catch (error) {
    console.error('[brand-logos] failed to load all entries', error);
    return [];
  }
}

export async function getBrandLogoById(id: string): Promise<BrandLogo | null> {
  try {
    const result = await db
      .select()
      .from(brandLogos)
      .where(eq(brandLogos.id, id))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === '42P01' || code === '42703') {
      console.error('[brand-logos] table unavailable', error);
      return null;
    }
    throw error;
  }
}

export async function createBrandLogo(
  data: NewBrandLogo
): Promise<BrandLogo> {
  const result = await db
    .insert(brandLogos)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();

  return result[0]!;
}

export async function updateBrandLogo(
  id: string,
  data: Partial<NewBrandLogo>
): Promise<BrandLogo> {
  const result = await db
    .update(brandLogos)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(brandLogos.id, id))
    .returning();

  return result[0]!;
}

export async function deleteBrandLogo(id: string): Promise<void> {
  await db.delete(brandLogos).where(eq(brandLogos.id, id));
}
