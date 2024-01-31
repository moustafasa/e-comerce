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
  },
});

export default dashboardSlice.reducer;
export const { toggleShrink } = dashboardSlice.actions;
export const getShrink = (state) => state.dashboard.shrink;
