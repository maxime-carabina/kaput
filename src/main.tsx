import React from 'react';

import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import './global.css';

import { Base } from '@/components';
import { Error, NotFound, Index } from '@/pages';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Base />}>
      {/* routes for pages */}
      <Route index element={<Index />} />

      {/* routes for errors */}
      <Route path="error" element={<Error />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<Error />} />
  </React.StrictMode>,
);
