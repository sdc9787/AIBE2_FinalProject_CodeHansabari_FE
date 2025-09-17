import React from 'react';
import { AdminLayout } from '@/widgets/admin/ui/adminLayout';

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
