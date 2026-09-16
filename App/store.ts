import { configureStore } from "@reduxjs/toolkit";

import { cartApi } from "../services/CartApi"
import { wishlistApi } from "../services/WishlistApi"
import { bannerApi } from "../services/BannerApi";
import { couponApi } from "../services/CouponApi"
import { productApi } from "../services/ProductApi";
import { reviewApi } from "../services/ReviewApi";
import { orderApi } from "../services/OrderApi";
import { authLoginApi } from "../services/AuthApi";








export const store = configureStore({
    reducer: {

        [cartApi.reducerPath]: cartApi.reducer,
        [wishlistApi.reducerPath]: wishlistApi.reducer,
        [bannerApi.reducerPath]: bannerApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [authLoginApi.reducerPath]: authLoginApi.reducer,



    },
    middleware: (getDefualMIddlewear) =>
        getDefualMIddlewear().concat(
            cartApi.middleware,
            wishlistApi.middleware,
            bannerApi.middleware,
            couponApi.middleware,
            productApi.middleware,
            reviewApi.middleware,
            orderApi.middleware,
            authLoginApi.middleware,




        ),

})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;