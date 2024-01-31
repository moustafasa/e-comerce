import { redirect } from "react-router-dom";
import authApiSlice from "./authApiSlice";
import { logout } from "./authSlice";

export const action = (dispatch) => async () => {
  console.log("done");
  try {
    await dispatch(
      authApiSlice.endpoints.logOut.initiate(undefined, { track: false })
    ).unwrap();
    dispatch(logout());
  } catch (err) {
    console.log(err);
  }
  return redirect("/login");
};
