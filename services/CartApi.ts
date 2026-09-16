

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
 import AsyncStorage from '@react-native-async-storage/async-storage';
 
const API = process.env.EXPO_PUBLIC_API_URL;

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}/api`,
    prepareHeaders: (headers) => {
      const token = AsyncStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query<any, void>({
      query: () => "/my-cart",
      providesTags: ["Cart"],
    }),

    addToCartDb: builder.mutation<any, { productId: string; quantity: number }>({
      query: (data) => ({
        url: "/cart/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartQuantityDb: builder.mutation<any, { productId: string; quantity: number }>({
      query: (data) => ({
        url: "/cart/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCartDb: builder.mutation<any, string>({
      query: (productId) => ({
        url: `/cart/remove/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCartDb: builder.mutation<any, void>({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartDbMutation,
  useUpdateCartQuantityDbMutation,
  useRemoveFromCartDbMutation,
  useClearCartDbMutation,
} = cartApi;



