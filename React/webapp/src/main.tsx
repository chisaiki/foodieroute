import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx' // We don't need this file
import { AuthProvider } from "./config/AuthUser"

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


// Pages
// Basic pages
import Bananas from './components/views/bananas.jsx'; // We can convert this for fun
import ErrorPagee from './components/views/error-page.jsx'; // We will need to conver this


// Better pages (containers)
import HomeContainer  from './components/containers/HomeContainer';
import SettingsContainer from './components/containers/SettingsContainer';

// Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeContainer />, // Homepage should be here
    errorElement: <ErrorPagee />
  },
  {
    path: "/banana",
    element: <Bananas />,
  },
  {
    path: "/Settings",
    element: <SettingsContainer/>
  },
  // {
  //   path: "/og",
  //   element: <App />,
  // },
]);

// I need this for the JS -> TS convertion 
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found. Make sure you have a div with id='root' in your index.html");
}


createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);



// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <RouterProvider router={router} />
//     {/* <App /> */}
//   </StrictMode>,
// )
