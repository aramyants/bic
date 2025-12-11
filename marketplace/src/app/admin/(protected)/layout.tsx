export const dynamic = 'force-dynamic';

import React from 'react';

import { requireAdmin } from '@/server/auth';

import { AdminShell } from './admin-shell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return <AdminShell admin={{ name: admin.name, email: admin.email }}>{children}</AdminShell>;
}
