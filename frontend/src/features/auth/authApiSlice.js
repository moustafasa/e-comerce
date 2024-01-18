import { apiSlice } from "../../app/apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "post",
        data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({ url: "/login", method: "post", data }),
    }),
  }),
});

export default authApiSlice;
