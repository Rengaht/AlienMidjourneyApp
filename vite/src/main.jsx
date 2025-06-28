import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import DalleTest from './DalleTest.jsx'
import Display from './display.jsx'
import './index.css'

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Workshop from './pages/input.jsx'
import Compare from './pages/compare.jsx'
import Single from './pages/single.jsx'
import DalleV2 from './Dalle_v2.jsx'


const router = createBrowserRouter([
  {
    path: "/mj",
    element: <App/>,
  },
  {
    path: "/:lang/:auto?",
    element: <DalleTest/>,
  },
  {
    path: "/",
    element: <Navigate to="/en"/>,
  },
  {
    path: "/v2/:lang/:auto?",
    element: <DalleV2/>,
  },
  {
    path: "/v2",
    element: <DalleV2/>,
  },
  {
    path: "/display",
    element: <Display/>,
  },
  {
    path:"/workshop/:lang",
    element:<Workshop/> 
  },
  {
    path:"/workshop",
    element:<Navigate to="/workshop/en"/>,
  },
  {
    path:"/workshop/compare",
    element: <Compare/>,
  },{
    path:'/workshop/display/:index',
    element:<Single/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
