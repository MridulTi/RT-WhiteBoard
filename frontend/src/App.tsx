import { createBrowserRouter, Navigate, RouterProvider, useActionData } from "react-router-dom";
import Landing from "./screens/Landing";
import Session from "./screens/Session.tsx";
import Layout from "./screens/Layout.tsx";
import Whiteboard from "./screens/Whiteboard.tsx";
import { useKeycloak } from "@react-keycloak/web";
import useAuth from "./hooks/useAuth.tsx";

function App() {
  const {isLogin}=useAuth()
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Navigate to={isLogin ? "/rtwhiteboard" : "/landing"} />,
    },
    {
      path:"/",
      element:<Navigate to="/landing"/>
    },
    {
      path: "/rtwhiteboard",
      element: <Layout />,
      children:[
        {
          path:"/rtwhiteboard/",
          element:<Whiteboard/>
        },
        {
          path:"/rtwhiteboard/session/:id",
          element:<Session />
        }
      ],
    },
    {
      path: "/landing",
      element: <Landing/>,
    },

  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
