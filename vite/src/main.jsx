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
import { FOLDER_MACAO, FOLDER_MACAO_WORKSHOP, FOLDER_MOCA, FOLDER_MOCA_WORKSHOP } from './constants.js'


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
    path: "/v2/:lang",
    element: <DalleV2 folder={FOLDER_MOCA}/>,
  },
  {
    path: "/macao/:lang",
    element: <DalleV2 folder={FOLDER_MACAO}/>,
  },
  {
    path: "/v2",
    element: <DalleV2 folder={FOLDER_MOCA}/>,
  },
  {
    path: "/display",
    element: <Display/>,
  },
  {
    path: "/display/macao",
    element: <Display tag="MACAO"/>,
  },
  {
    path:"/workshop/:lang",
    element:<Workshop folder={FOLDER_MOCA_WORKSHOP}/> 
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
  },
  {
    path:"/workshop/macao/:lang",
    element:<Workshop folder={FOLDER_MACAO_WORKSHOP}/> 
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
