'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { TAXONOMY_TYPES, deleteTaxonomy, upsertTaxonomy, type TaxonomyType } from '@/server/taxonomy-service';
import { requireAdmin } from '@/server/auth';

const taxonomySchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(TAXONOMY_TYPES.map((t) => t.type) as [TaxonomyType, ...TaxonomyType[]]),
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
  parentValue: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
});

export async function upsertTaxonomyAction(formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = taxonomySchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/taxonomy?error=1&message=invalid`);
  }

  const data = parsed.data;
  await upsertTaxonomy({
    id: data.id,
    type: data.type,
    value: data.value,
    label: data.label,
    parentValue: data.parentValue || undefined,
    sortOrder: data.sortOrder,
  });

  revalidatePath('/admin/taxonomy');
  redirect(`/admin/taxonomy?type=${data.type}`);
}

export async function deleteTaxonomyAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const type = String(formData.get('type') ?? '');
  if (!id || !type) {
    redirect('/admin/taxonomy?error=1');
  }

  await deleteTaxonomy(id);
  revalidatePath('/admin/taxonomy');
  redirect(`/admin/taxonomy?type=${type}`);
}
