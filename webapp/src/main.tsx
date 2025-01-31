import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import { db }  from "./config/firebase.js";


// Pages
// Simple Pages
import Bananas from './components/views/bananas.tsx';
// pages that require containers
// .. none atm


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // needs to be home/splash page
    //ErrorPage: <ErrorPage />
  },
  {
    path: "/banana",
    element: <Bananas />,
  },
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <RouterProvider router={router} />

    {/* <App /> */}
  </StrictMode>,
)
