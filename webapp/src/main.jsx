import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


// Pages
// Basic pages
import Bananas from './components/views/bananas.jsx';
// Better pages (containers)

// Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Homepage should be here
    //ErrorPage: <ErrorPage />
  },
  {
    path: "/banana",
    element: <Bananas />,
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>,
)
