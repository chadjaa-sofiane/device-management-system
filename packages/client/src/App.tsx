import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/devices" />,
  },
  {
    path: "/devices",
    element: <div>Hello world!</div>,
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
  return <RouterProvider router={router} />;
}

export default App;
