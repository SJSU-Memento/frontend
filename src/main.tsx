import { StrictMode, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import SearchPage from './pages/SearchPage.lazy.tsx';
import ManualPage from './pages/ManualPage.lazy.tsx';
import TimelinePage from './pages/TimelinePage.lazy.tsx';

import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <SearchPage />
      </Suspense>
    ),
  },
  {
    path: "/manual",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ManualPage />
      </Suspense>
    ),
  },
  {
    path: "/timeline",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <TimelinePage />
      </Suspense>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);