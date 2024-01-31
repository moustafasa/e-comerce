import { json, redirect } from "react-router-dom";
import usersApiSlice from "./usersApiSlice";

export const action =
  (dispatch) =>
  async ({ params, request }) => {
    const { page, id } = params;

    const endpoint =
      page === "users"
        ? "deleteUser"
        : page === "categories" && "deleteCategory";

    try {
      await dispatch(
        usersApiSlice.endpoints[endpoint].initiate(id, { track: false })
      ).unwrap();
    } catch (err) {
      console.log(err);
    }
    // return redirect("/dashboard/users");
    return null;
  };
