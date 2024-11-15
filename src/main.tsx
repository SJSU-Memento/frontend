import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SearchPage from './pages/search.tsx'
import ManualPage from './pages/manual.tsx'
import TimelinePage from './pages/timeline.tsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <SearchPage />,
  },
  {
    path: "/manual",
    element: <ManualPage />,
  },
  {
    path: "/timeline",
    element: <TimelinePage />,
  },
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
