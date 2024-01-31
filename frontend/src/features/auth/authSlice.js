import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const cookie = new Cookies();
const initialState = {
  token: cookie.get("Bearer"),
  roles: {
    1995: "admin",
    2001: "user",
    1996: "writer",
    1999: "product Manager",
  },
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredintials(state, action) {
      cookie.set("Bearer", action.payload.token, { path: "/" });
      state.token = action.payload.token;
    },
    logout(state, action) {
      cookie.remove("Bearer", { path: "/" });
      state.token = "";
    },
  },
});

export default authSlice.reducer;

export const { setCredintials, logout } = authSlice.actions;

export const getRoles = (state) => state.auth.roles;
export const getToken = (state) => state.auth.token;
