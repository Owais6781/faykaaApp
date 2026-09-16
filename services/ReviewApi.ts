import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = process.env.EXPO_PUBLIC_API_URL 


export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API}/api`,
        prepareHeaders: (headers) => {
            const token = AsyncStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }

            return headers
        }


    }),
    tagTypes: ["Review", "Product"],
    endpoints: (builder) => ({
        addReview: builder.mutation({
            query: (body) => ({
                url: "/review/add",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Review", "Product"],
        }),

        getReviews: builder.query({
            query: (productId) => `/review/${productId}`,
            providesTags: ["Review"],
        }),
    }),
});

export const {
    useAddReviewMutation,
    useGetReviewsQuery,
} = reviewApi;