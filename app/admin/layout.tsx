import React from 'react';
import { AdminLayout } from '@/widgets/admin/ui/adminLayout';

export const metadata = {
  title: '관리자',
};

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
