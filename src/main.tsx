import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import './global.css';

import { Base, DashboardLayout } from '@/components';
import {
  Error,
  NotFound,
  Index,
  CreateQuizz,
  Dashboard,
  SelectQuizz,
} from '@/pages';

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Base />}>
      {/* routes for pages */}
      <Route index element={<Index />} />
      <Route element={<DashboardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/create-quizz" element={<CreateQuizz />} />
        <Route path="dashboard/select-quizz" element={<SelectQuizz />} />
      </Route>

      {/* routes for errors */}
      <Route path="error" element={<Error />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} fallbackElement={<Error />} />
    </QueryClientProvider>
  </React.StrictMode>,
);
