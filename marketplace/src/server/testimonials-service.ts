'use server';

import { db } from '@/db/client';
import {
  testimonials,
  type NewTestimonial,
  type Testimonial,
} from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  try {
    const result = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(testimonials.sortOrder, desc(testimonials.createdAt));
    return result;
  } catch (error) {
    console.error("[testimonials] table unavailable", error);
    return [];
  }
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const result = await db
      .select()
      .from(testimonials)
      .orderBy(testimonials.sortOrder, desc(testimonials.createdAt));
    return result;
  } catch (error) {
    console.error("[testimonials] table unavailable", error);
    return [];
  }
}

export async function getTestimonialById(
  id: string
): Promise<Testimonial | null> {
  const result = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function createTestimonial(
  data: NewTestimonial
): Promise<Testimonial> {
  const result = await db
    .insert(testimonials)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();

  return result[0]!;
}

export async function updateTestimonial(
  id: string,
  data: Partial<NewTestimonial>
): Promise<Testimonial> {
  const result = await db
    .update(testimonials)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(testimonials.id, id))
    .returning();

  return result[0]!;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await db.delete(testimonials).where(eq(testimonials.id, id));
}
