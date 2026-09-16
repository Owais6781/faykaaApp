    import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

    const API = process.env.EXPO_PUBLIC_API_URL;

    export interface Banner {
        _id: string;

        title: string;
        subtitle?: string;
        description?: string;

        bannerType: string;

        desktopImage?: string | null;
        mobileImage?: string | null;

        buttonText?: string;
        redirectUrl?: string;

        openInNewTab?: boolean;

        startDate?: string | null;
        endDate?: string | null;

        priority?: number;

        isActive?: boolean;

        slideGroup?: string;

        categoryId?: string;
        brandId?: string;

        festivalName?: string;

        offerTitle?: string;
        offerCode?: string;

        preview?: boolean;

        clicks?: number;
        views?: number;

        createdAt?: string;
        updatedAt?: string;
    }


    export interface BannerResponse {
        success: boolean;
        message?: string;
        count?: number;
        data: Banner | Banner[];
    }


    export const bannerApi = createApi({

        reducerPath: "bannerApi",

        baseQuery: fetchBaseQuery({
            baseUrl: `${API}/api`,
        }),


        tagTypes: ["Banner"],


        endpoints: (builder) => ({

            // CREATE BANNER
            createBanner:builder.mutation<BannerResponse,FormData>({
            
                query: (body) => ({
                    url: "/banner",
                    method: "POST",
                    body,
                }),

                invalidatesTags: ["Banner"],
            }),



    
            // GET ALL BANNER
    
            getBanners: builder.query<BannerResponse,void>({
                query: () => ({
                    url: "/banner",
                    method: "GET",
                }),

                providesTags: ["Banner"],
            }),

            // GET ACTIVE BANNER
            getActiveBanners: builder.query<BannerResponse,void>({
                query: () => ({
                    url: "/banner/active",
                }),

                providesTags: ["Banner"],
            }),

            // GET BANNER BY ID
            getBannerById: builder.query<BannerResponse,string>({
            
                query: (id) => ({
                    url: `/banner/${id}`,
                }),

                providesTags: ["Banner"],
            }),




            // GET BY TYPE
            getBannerByType: builder.query<BannerResponse,string>({
                query: (type) => ({
                    url: `/banner/type/${type}`,
                }),

                providesTags: ["Banner"],

            }),

            // GET BY SLIDE GROUP
            getBannerByGroup: builder.query<BannerResponse,string>({
                query: (group) => ({
                    url: `/banner/group/${group}`,
                }),

                providesTags: ["Banner"],

            }),

            // UPDATE BANNER
            updateBanner: builder.mutation<BannerResponse,{id: string;body:FormData;}>({
                query: ({ id, body }) => ({

                    url: `/banner/${id}`,
                    method: "PUT",
                    body,

                }),

                invalidatesTags: ["Banner"],

            }),

            // TOGGLE STATUS
    
            toggleBannerStatus: builder.mutation<BannerResponse,string >({
                query: (id) => ({
                    url: `/banner/${id}/toggle-status`,
                    method: "PATCH",

                }),

                invalidatesTags: ["Banner"],

            }),


            // INCREASE CLICK

            increaseBannerClick:builder.mutation<BannerResponse,string >({
                    query: (id) => ({
                        url: `/banner/${id}/click`,
                        method: "PATCH",

                    }),

                }),
            // INCREASE VIEW

            increaseBannerView:builder.mutation<BannerResponse,string >({
                    query: (id) => ({
                        url: `/banner/${id}/view`,
                        method: "PATCH",

                    }),

                }),

            // DELETE BANNER
    
            deleteBanner:builder.mutation<BannerResponse,string >({
                    query: (id) => ({
                        url: `/banner/${id}`,
                        method: "DELETE",

                    }),

                    invalidatesTags: ["Banner"],

                }),



        }),

    });





    export const {

        useCreateBannerMutation,

        useGetBannersQuery,

        useGetActiveBannersQuery,

        useGetBannerByIdQuery,

        useGetBannerByTypeQuery,

        useGetBannerByGroupQuery,

        useUpdateBannerMutation,

        useToggleBannerStatusMutation,

        useIncreaseBannerClickMutation,

        useIncreaseBannerViewMutation,

        useDeleteBannerMutation,


    } = bannerApi;