import Devices from "@/pages/Devices";
import { fetchDevicesAsync } from "@/store/devicesSlice";
import { useEffect } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useAppDispatch } from "./hooks/reduxHooks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/devices" />,
  },
  {
    path: "/devices",
    element: <Devices />,
  },
  {
    path: "/devices/create",
    element: <div>About</div>,
  },
  {
    path: "/devices/update",
    element: <div>About</div>,
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDevicesAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
