import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shrink: false,
};
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    toggleShrink(state) {
      state.shrink = !state.shrink;
    },
    disableShrink(state) {
      state.shrink = false;
    },
  },
});

export default dashboardSlice.reducer;
export const { toggleShrink, disableShrink } = dashboardSlice.actions;
export const getShrink = (state) => state.dashboard.shrink;
