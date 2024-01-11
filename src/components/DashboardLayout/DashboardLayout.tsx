import { Outlet } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';

export function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-11">
      <Outlet />
      <Toaster />
    </div>
  );
}
