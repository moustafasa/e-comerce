import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const cookie = new Cookies();
const initialState = { user: null, token: cookie.get("Bearer") };
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredintials(state, action) {
      cookie.set("Bearer", action.payload.token);
      return action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state, action) {
      (state.user = null), (state.token = "");
    },
  },
});

export default authSlice.reducer;

export const { setCredintials, setUser, logout } = authSlice.actions;

export const getUser = (state) => state.auth.user;
export const getToken = (state) => state.auth.token;
