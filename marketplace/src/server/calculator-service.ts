'use server';

import { db } from '@/db/client';
import {
  calculatorConfig,
  type CalculatorConfig,
  type NewCalculatorConfig,
} from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function getActiveCalculatorConfig(): Promise<CalculatorConfig | null> {
  const result = await db
    .select()
    .from(calculatorConfig)
    .where(eq(calculatorConfig.isActive, true))
    .limit(1);

  return result[0] ?? null;
}

export async function getAllCalculatorConfigs(): Promise<CalculatorConfig[]> {
  try {
    const result = await db
      .select()
      .from(calculatorConfig)
      .orderBy(desc(calculatorConfig.createdAt));
    return result;
  } catch (error) {
    console.error("[calculator] table unavailable", error);
    return [];
  }
}

export async function getCalculatorConfigById(
  id: string
): Promise<CalculatorConfig | null> {
  const result = await db
    .select()
    .from(calculatorConfig)
    .where(eq(calculatorConfig.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function createCalculatorConfig(
  data: NewCalculatorConfig
): Promise<CalculatorConfig> {
  // If this config is set to active, deactivate all others
  if (data.isActive) {
    await db
      .update(calculatorConfig)
      .set({ isActive: false })
      .where(eq(calculatorConfig.isActive, true));
  }

  const result = await db
    .insert(calculatorConfig)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();

  return result[0]!;
}

export async function updateCalculatorConfig(
  id: string,
  data: Partial<NewCalculatorConfig>
): Promise<CalculatorConfig> {
  // If this config is being set to active, deactivate all others
  if (data.isActive) {
    await db
      .update(calculatorConfig)
      .set({ isActive: false })
      .where(eq(calculatorConfig.isActive, true));
  }

  const result = await db
    .update(calculatorConfig)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(calculatorConfig.id, id))
    .returning();

  return result[0]!;
}

export async function deleteCalculatorConfig(id: string): Promise<void> {
  await db.delete(calculatorConfig).where(eq(calculatorConfig.id, id));
}

export async function setActiveCalculatorConfig(id: string): Promise<void> {
  // Deactivate all configs
  await db
    .update(calculatorConfig)
    .set({ isActive: false })
    .where(eq(calculatorConfig.isActive, true));

  // Activate the specified config
  await db
    .update(calculatorConfig)
    .set({ isActive: true, updatedAt: new Date() })
    .where(eq(calculatorConfig.id, id));
}
