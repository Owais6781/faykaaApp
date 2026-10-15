

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
 import AsyncStorage from '@react-native-async-storage/async-storage';


 const API = process.env.EXPO_PUBLIC_API_URL;

export type ProfileResponse = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  provider?: string;
  profilePic?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};



export const authLoginApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({baseUrl: `${API}/authApi`,
    prepareHeaders: async (headers) => {
      const token = await   AsyncStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body:data,
      }),
      invalidatesTags: ["Profile"],
    })
    ,
    

    loginUser: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body:data,
      }),
    }),

    googleLoginUser: builder.mutation({
      query: (data) => ({
        url: "/google-login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    facebookLoginUser: builder.mutation({
      query: (data) => ({
        url: "/facebook-login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    getProfile: builder.query({
      query: () => "/profile",
      transformResponse: (response: any) => response.user,
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
      url:"/profile",
      method: "PUT",
      body: data
       }),
       invalidatesTags: ["Profile"],
    })


  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGoogleLoginUserMutation,
  useFacebookLoginUserMutation,
  useGetProfileQuery,
  useUpdateProfileMutation
 
} = authLoginApi;


