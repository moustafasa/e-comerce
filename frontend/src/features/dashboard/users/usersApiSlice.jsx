import { apiSlice } from "../../../app/apiSlice";
// import { getUser } from "../auth/authSlice";

const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: (result, err) => {
        console.log(result);
        return !err
          ? ["Users", ...result.map((user) => ({ type: "Users", id: user.id }))]
          : ["Users"];
      },
    }),
    getUser: builder.mutation({
      query: (id) => `/user/${id}`,
    }),
    editUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/edit/${id}`,
        method: "post",
        data,
      }),
      invalidatesTags: (result, err, args) => [{ type: "Users", id: args.id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "delete",
      }),
      // invalidatesTags: (result, err, args) => [{ type: "Users", id: args.id }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData("getUsers", undefined, (draft) =>
            draft.filter((user) => +user.id !== +id)
          )
        );

        console.log(patchResult);
        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
        }
      },
    }),
    addUser: builder.mutation({
      query: (data) => ({
        url: `/user/add`,
        method: "post",
        data,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export default usersApiSlice;
export const { useGetUsersQuery } = usersApiSlice;
