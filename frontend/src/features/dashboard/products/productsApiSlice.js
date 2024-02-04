import { apiSlice } from "../../../app/apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
    }),
    getProduct: builder.query({
      query: (id) => `/product/${id}`,
    }),
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/product/add",
        method: "post",
        data,
      }),
    }),
    addImg: builder.mutation({
      query: ({ data, onUploadProgress }) => ({
        url: `/product-img/add`,
        method: "post",
        data,
        onUploadProgress,
      }),
    }),
    editProduct: builder.mutation({
      query: ({ data, id }) => ({
        url: `/product/edit/${id}`,
        method: "post",
        data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "delete",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productApiSlice.util.updateQueryData(
            "getProducts",
            undefined,
            (draft) => {
              return draft.filter((product) => +product.id !== +id);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
        }
      },
    }),
    deleteImg: builder.mutation({
      query: (id) => ({
        url: `/product-img/${id}`,
        method: "delete",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useAddImgMutation,
  useDeleteImgMutation,
} = productApiSlice;
