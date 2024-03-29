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
    loginWithGoogle: builder.query({
      query: (search) => `/auth/google/callback${search}`,
    }),
    getCurrentUser: builder.query({
      query: () => `/user`,
    }),
    logOut: builder.mutation({
      query: () => "/logout",
    }),
  }),
});

export default authApiSlice;

export const { useLoginWithGoogleQuery, useGetCurrentUserQuery } = authApiSlice;
