import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from '@react-native-async-storage/async-storage';
   
const API = process.env.EXPO_PUBLIC_API_URL;

export interface Coupon {
  _id: string;
  code: string;
  title: string;
  description: string;

  discountType: "Flat" | "Percentage";
  discountValue: number;
  maximumDiscount: number;
  minimumOrder: number;

  usageLimit: number;
  perUserLimit: number;

  startDate: string;
  endDate: string;

  status: "Active" | "Inactive" | "Expired";

  isPublic: boolean;
  firstOrderOnly: boolean;
  freeShipping: boolean;
}


export interface CouponResponse {
  success: boolean;
  total: number;
  coupons: Coupon[];
}
export const couponApi = createApi({
  reducerPath: "couponApi",

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

  tagTypes: ["Coupon"],

  endpoints: (builder) => ({
    // Get All Coupons
    getCoupons: builder.query<CouponResponse, void>({
      query: () => "/coupon",
      providesTags: ["Coupon"],
    }),
    // Get Active  Coupons
    getActiveCoupons: builder.query<CouponResponse, void>({
      query: () => "/active-coupons",
      providesTags: ["Coupon"],
    }),


    // Get Single Coupon
    getCouponById: builder.query({
      query: (id) => `/coupon/${id}`,
      providesTags: ["Coupon"],
    }),





    // Create Coupon
    addCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),

   applyCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon",
        method: "POST",
        body: data,
      }),
    }),


    // Update Coupon
    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/coupon/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),

    // Delete Coupon
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useGetActiveCouponsQuery,
  useGetCouponByIdQuery,
  useAddCouponMutation,
  useApplyCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;