


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = process.env.EXPO_PUBLIC_API_URL as string;

export type WishlistItem = {
  id?: string;
  _id?: string;
  category?: string;
  title?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  image?: string;
  images?: string[];
};

type WishlistResponse = {
  success?: boolean;
  message?: string;
  wishlist: WishlistItem[];
};

type ToggleWishlistRequest = {
  productId: string;
};

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
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
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistResponse, void>({
      query: () => "/my-wishlist",
      providesTags: ["Wishlist"],
    }),

    toggleWishlistDB: builder.mutation<WishlistResponse, ToggleWishlistRequest>({
      query: ({ productId }) => ({
        url: "/wishlist/toggle",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeWishlistDB: builder.mutation({
      query: ({productId}) => ({
        url: `/wishlist/remove/${productId}`,
        method: "DELETE",
        //  body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useToggleWishlistDBMutation,
  useRemoveWishlistDBMutation,
} = wishlistApi;