import PropTypes from "prop-types";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Register, {
  action as registerAction,
} from "./features/auth/Register/Register";
import { useDispatch } from "react-redux";
import store from "./app/store";
import Login, { action as loginAction } from "./features/auth/Login/Login";

function App() {
  const dispatch = useDispatch();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/register",
      element: <Register />,
      action: registerAction(dispatch),
    },
    {
      path: "/login",
      element: <Login />,
      action: loginAction(dispatch),
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
