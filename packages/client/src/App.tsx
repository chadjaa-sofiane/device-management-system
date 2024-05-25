import Devices from "@/pages/Devices";
import { Provider as ReduxProvider } from "react-redux";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import store from "./store";

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
  return (
    <ReduxProvider store={store}>
      <RouterProvider router={router} />;
    </ReduxProvider>
  );
}

export default App;
