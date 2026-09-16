import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
 import AsyncStorage from '@react-native-async-storage/async-storage';

 const API = process.env.EXPO_PUBLIC_API_URL;

export interface OrderPayloadItem {
  productId: string;
  quantity: number;
}


export type Address = {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};


interface CouponPayload {
  couponId: string;
  code: string;
  discountType: "Flat" | "Percentage";
  discountValue: number;
  discountAmount: number;
}


type CreateOrderPayload = {
  items: {
    productId: string;
    quantity: number;
  }[];
  address: Address;
  totalAmount: number;
  paymentMethod: "COD" | "ONLINE";
    coupon?: CouponPayload 
};
export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}/api`,
     credentials: "include",
    prepareHeaders: (headers) => {
      const token = AsyncStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({

    createOrder: builder.mutation<any, CreateOrderPayload>({
      query: (data) => ({
        url: "/order/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),



    getMyOrders: builder.query<any, void>({
      query: () => ({
        url: "/single-user-orders",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),


    createRazorpayOrder: builder.mutation<any, { amount: number }>({
      query: (body) => ({
        url: "/payment/create-order",
        method: "POST",
        body,
      }),
    }),


    verifyPayment: builder.mutation<any, {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }>({
      query: (body) => ({
        url: "/payment/verify",
        method: "POST",
        body,
      }),
    }),


    updatePaymentSuccess: builder.mutation<any,{
      orderId: string;
      paymentId: string;
    }>({
      query: (body) => ({
        url: "/order/payment-success",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    updatePaymentFailed: builder.mutation<any, {
      orderId: string;
      status: "FAILED";
    }>({
      query: (body) => ({
        url: "/order/payment-failed",
        method: "PUT",
        body,
      }),

       invalidatesTags: ["Orders"],
    }),





  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
  useUpdatePaymentSuccessMutation,
  useUpdatePaymentFailedMutation,
} = orderApi;