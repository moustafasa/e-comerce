import { apiSlice } from "../../../app/apiSlice";

export const catApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: (result, err, args) => [
        "Cats",
        ...result.map((cat) => ({ type: "Cats", id: cat.id })),
      ],
    }),
    getCategory: builder.query({
      query: (id) => `/category/${id}`,
    }),
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/category/add",
        method: "post",
        data,
      }),
    }),
    editCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category/edit/${id}`,
        method: "post",
        data,
      }),
      invalidatesTags: (result, err, args) => [{ type: "Cats", id: args.id }],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "delete",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          catApiSlice.util.updateQueryData(
            "getCategories",
            undefined,
            (draft) => {
              return draft.filter((cat) => +cat.id !== +id);
            }
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
  }),
});

export const { useGetCategoriesQuery, useGetCategoryQuery } = catApiSlice;
