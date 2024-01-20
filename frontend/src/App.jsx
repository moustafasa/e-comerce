import PropTypes from "prop-types";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import Home from "./pages/Home";
import Register, {
  action as registerAction,
} from "./features/auth/Register/Register";
import { useDispatch } from "react-redux";
import store from "./app/store";
import Login, { action as loginAction } from "./features/auth/Login/Login";
import GoogleCallBack from "./features/auth/googleCallBack/GoogleCallBack";
import Dashboard from "./features/dashboard/dashboard";
import authApiSlice from "./features/auth/authApiSlice";
import { setUser } from "./features/auth/authSlice";
import Cookies from "universal-cookie";
import Users from "./features/dashboard/Users";

const protectedLoader = (dispatch) => async () => {
  const cookie = new Cookies();
  if (cookie.get("Bearer")) {
    try {
      const user = await dispatch(
        authApiSlice.endpoints.verifyToken.initiate(undefined, {
          subscribe: false,
        })
      ).unwrap();
      dispatch(setUser(user));
      return null;
    } catch (err) {
      cookie.remove("Bearer");
      return redirect("/login");
    }
  } else {
    return redirect("/login");
  }
};

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
    {
      path: "/auth/google/callback",
      element: <GoogleCallBack />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      loader: protectedLoader(dispatch),
      children: [
        {
          path: "users",
          element: <Users />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
