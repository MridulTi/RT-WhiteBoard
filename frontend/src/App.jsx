import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Workspace from "./pages/Workspace.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MainLayout from "./pages/More/MainLayout.jsx";
import { useApp } from "./context/AppContext.jsx";

function App() {
  const {loggedin}=useApp();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to={loggedin? "/app" : "/auth"} />,
    },
    {
      path: "/auth",
      element: loggedin?<Navigate to="/app"/>:<Login />,
    },
    {
      path: "/app",
      element: loggedin?<MainLayout/>:<Navigate to="/auth"/>,
      children: [
        {
          path: "/app",
          element: <Dashboard/>,
        },
        {
          path: "/app",
          element: <Workspace/>,
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
