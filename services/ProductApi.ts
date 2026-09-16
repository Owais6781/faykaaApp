import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


 const API = process.env.EXPO_PUBLIC_API_URL;

export const productApi = createApi({

   reducerPath: `createApi`,
   baseQuery: fetchBaseQuery({
      baseUrl: `${API}/api`,
   }),

   tagTypes: ["productList"],

   endpoints: (builder) => ({
      getProductCategory: builder.query<any[], void>({
         query: () => `/Categories`,
         providesTags: ["productList"]
      }),



      getBestSellers: builder.query<any[], void>({
         query: () => "/best-sellers",
         providesTags: ["productList"],
      }),



      getMegaDeals: builder.query<any[], void>({
         query: () => "/mega-deals",
      }),


      getNewArrivals: builder.query<any[], void>({
         query: () => "/new-arrivals",
         providesTags: ["productList"],
      }),

      getFeaturedProducts: builder.query<any[], void>({
         query: () => "/featured",
         providesTags: ["productList"],
      }),
   })


})

export const {
   useGetProductCategoryQuery,
   useGetBestSellersQuery,
   useGetMegaDealsQuery,
   useGetNewArrivalsQuery,
   useGetFeaturedProductsQuery,

} = productApi