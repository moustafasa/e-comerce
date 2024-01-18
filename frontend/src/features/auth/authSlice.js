import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const initialState = { user: null, token: "" };
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredintials(state, action) {
      const cookie = new Cookies();
      cookie.set("Bearer", action.payload.token);
      return action.payload;
    },
    logout(state, action) {
      (state.user = null), (state.token = "");
    },
  },
});

export default authSlice.reducer;

export const { setCredintials, logout } = authSlice.actions;

export const getUser = (state) => state.auth.user;
export const getToken = (state) => state.auth.token;
