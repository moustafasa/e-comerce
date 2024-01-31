// import PropTypes from "prop-types";
import {
  RouterProvider,
  createBrowserRouter,
  json,
  redirect,
} from "react-router-dom";
import Home from "./pages/Home";
import Register, {
  action as registerAction,
} from "./features/auth/Register/Register";
import { useDispatch } from "react-redux";
import Login, { action as loginAction } from "./features/auth/Login/Login";
import GoogleCallBack from "./features/auth/googleCallBack/GoogleCallBack";
import Dashboard from "./features/dashboard/Dashboard";
import authApiSlice from "./features/auth/authApiSlice";
import Cookies from "universal-cookie";
import Users from "./features/dashboard/users/Users";
import EditUser, {
  action as editAction,
  loader as editLoader,
} from "./features/dashboard/users/EditUser";
import { action as deleteAction } from "./features/dashboard/users/DeleteUser";
import AddUser, {
  action as addUserAction,
} from "./features/dashboard/users/AddUser";
import { action as logOutAction } from "./features/auth/LogOut";
import Writer from "./features/dashboard/Writer";

import ErrorPage from "./features/auth/errors/ErrorPage";
import Categories from "./features/dashboard/categories/Categories";
import AddCategory, {
  action as addCatAction,
} from "./features/dashboard/categories/AddCategory";
import EditCategory, {
  action as editCatAction,
  loader as editCatLoader,
} from "./features/dashboard/categories/EditCategory";

const protectedLoader = (dispatch, allowedRoles) => async () => {
  const cookie = new Cookies();
  if (cookie.get("Bearer")) {
    let user;
    try {
      const { unsubscribe, unwrap } = dispatch(
        authApiSlice.endpoints.getCurrentUser.initiate(undefined)
      );
      const user = await unwrap();
      unsubscribe();

      if (allowedRoles.includes(user.role)) {
        return null;
      } else {
        throw json("access denied", { status: 403 });
      }
    } catch (err) {
      if (err.status === 403) {
        throw err;
      } else {
        cookie.remove("Bearer");
        return redirect("/login");
      }
    }
  } else {
    return redirect("/login");
  }
};

const requireBackLoader = async () => {
  const cookie = new Cookies();
  if (cookie.get("Bearer")) {
    return window.history.back();
  }

  return null;
};

function App() {
  const dispatch = useDispatch();
  const router = createBrowserRouter([
    {
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },

        {
          loader: requireBackLoader,
          children: [
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
          ],
        },

        {
          path: "/auth/google/callback",
          element: <GoogleCallBack />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
          loader: protectedLoader(dispatch, ["1995", "1996", "1999"]),
          errorElement: <ErrorPage />,
          children: [
            {
              errorElement: <ErrorPage />,
              children: [
                {
                  path: "delete/:page/:id",
                  action: deleteAction(dispatch),
                },
                {
                  loader: protectedLoader(dispatch, ["1995"]),
                  children: [
                    {
                      path: "users",
                      element: <Users />,
                    },
                    {
                      path: "users/edit/:id",
                      element: <EditUser />,
                      loader: editLoader(dispatch),
                      action: editAction(dispatch),
                    },

                    {
                      path: "user/add",
                      element: <AddUser />,
                      action: addUserAction(dispatch),
                    },
                  ],
                },
                {
                  path: "writer",
                  element: <Writer />,
                  loader: protectedLoader(dispatch, ["1995", "1996"]),
                },
                {
                  loader: protectedLoader(dispatch, ["1995", "1999"]),
                  children: [
                    {
                      path: "categories",
                      element: <Categories />,
                    },
                    {
                      path: "category/add",
                      element: <AddCategory />,
                      action: addCatAction(dispatch),
                    },
                    {
                      path: "categories/edit/:id",
                      element: <EditCategory />,
                      loader: editCatLoader(dispatch),
                      action: editCatAction(dispatch),
                    },
                  ],
                },
              ],
            },
          ],
        },
        { path: "/logout", action: logOutAction(dispatch) },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
