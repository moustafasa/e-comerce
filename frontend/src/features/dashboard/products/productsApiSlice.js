import { apiSlice } from "../../../app/apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      providesTags: (res) => {
        console.log(res);
        return ["Pro", ...res.map((pro) => ({ type: "Pro", id: pro.id }))];
      },
    }),
    getProduct: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: (res, err, arg) => [{ type: "Pro", id: arg }],
    }),
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/product/add",
        method: "post",
        data,
      }),
      invalidatesTags: ["Pro"],
    }),
    addImg: builder.mutation({
      query: ({ data, onUploadProgress }) => {
        console.log(data.getAll("image"));
        return {
          url: `/product-img/add`,
          method: "post",
          data,
          onUploadProgress,
        };
      },
    }),
    editProduct: builder.mutation({
      query: ({ data, id }) => ({
        url: `/product/edit/${id}`,
        method: "post",
        data,
      }),
      invalidatesTags: (res, err, arg) => [{ type: "Pro", id: arg.id }],
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
      invalidatesTags: (res, err, arg) => [{ type: "Pro", id: arg }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useAddImgMutation,
  useDeleteImgMutation,
} = productApiSlice;
