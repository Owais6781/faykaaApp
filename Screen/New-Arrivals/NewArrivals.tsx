import  { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

// Import your custom AppText and Card component
import { AppText } from "../../components/FontProvider/FontProvider";
import { ProductCard } from "../../components/Card/Card"; // Path apne folder structure ke hisaab se check kar lein

// API Hooks
import { useGetNewArrivalsQuery } from "../../services/ProductApi";
import { useGetWishlistQuery,  } from "../../services/WishlistApi";
import { useGetActiveCouponsQuery } from "../../services/CouponApi";
//hooks
import {useWishlist} from "../../services/Hooks/useWishlist";
import {useCart} from "../../services/Hooks/useCart";
import {useProductNavigation} from "../../services/Hooks/useProductNavigation"

interface Coupon {
  _id: string;
  code: string;
  title: string;
  discountType: "Percentage" | "Flat";
  discountValue: number;
  minimumOrder?: number;
  maximumDiscount?: number;
  isPublic: boolean;
  firstOrderOnly: boolean;
  freeShipping: boolean;
}

interface Product {
  _id?: string;
  id?: number | string;
  title: string;
  price: number;
  discountPrice?: number;
  image?: string[];
  category?: {
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
  description?: string;
  createdAt?: string;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  reviews?: number;
  coupons?: Coupon[];
  sellerId?: { _id: string }[];
}

export  const  NewArrivals=() =>{

  const { data: wishlistData } = useGetWishlistQuery();

  const wishlist = wishlistData?.wishlist || [];
  const { data = [] } = useGetNewArrivalsQuery();
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const { data: couponData } = useGetActiveCouponsQuery();


  const coupons = couponData?.coupons || [];

  const visibleCoupons = coupons.filter(
    (coupon: any) =>
      coupon.currentStatus === "Active" || coupon.currentStatus === "Upcoming"
  );

  const getProductCoupons = (product: any) => {
    return visibleCoupons.filter((coupon: any) => {
      const productMatch = coupon.products?.some(
        (couponProduct: any) =>
          couponProduct._id?.toString() === product._id?.toString()
      );
      const categoryMatch = coupon.category?.some(
        (couponCategory: any) =>
          couponCategory._id?.toString() === product.category?._id?.toString()
      );
      const sellerMatch = coupon.sellerId?.some(
        (couponSeller: any) =>
          couponSeller._id?.toString() === product.sellerId?._id?.toString()
      );
      return productMatch || categoryMatch || sellerMatch;
    });
  };

  const Api = process.env.EXPO_PUBLIC_API_URL;

  const imageByIndexUrl = (productId: string, index: number) =>
    `${Api}/api/${productId}/img/${index}`;

  const getDiscountPercentage = (price?: number, discountPrice?: number) => {
    if (price == null || discountPrice == null) return 0;
    if (price <= discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const latestProducts = useMemo(() => {
    const products = [...(data as Product[])];
    return products
      .sort((a: Product, b: Product) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return (String(b._id || "")).localeCompare(String(a._id || ""));
      })
      .slice(0, 70);
  }, [data]);





const {handleViewCard} = useProductNavigation()
const { handleWishlist } = useWishlist();
const { handleAddToCart } = useCart();

  const copyCoupon = async (code: string) => {
    try {
      setCopiedCoupon(code);
      setTimeout(() => {
        setCopiedCoupon(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy coupon:", error);
    }
  };
  
  

  const displayedProducts = showAllProducts
    ? latestProducts
    : latestProducts.slice(0, 8);

  return (
    <SafeAreaView>
    <ScrollView className="flex-grow bg-bgcream  px-3">
      <View className="w-full max-w-[1200px] self-center">
        {/* Header */}
        <View className="flex-row items-end justify-between border-b border-textcolor pb-4 mb-5">
          <View>
            <AppText className="text-[11px] font-semibold tracking-[2.2px] text-goldtext uppercase mb-1.5">Just In</AppText>
            <AppText className="text-[30px] italic text-blacktext">New Arrivals</AppText>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowAllProducts(!showAllProducts)}
            className="flex-row items-center mb-1"
          >
            <AppText className="text-xs font-semibold tracking-[1.2px] text-goldtext uppercase">
              {showAllProducts ? "See Less" : "See All"}
            </AppText>
          <Ionicons
                     name="arrow-forward"
                     size={14}
                     color="#A9803F"
                     style={{ transform: [{ rotate: showAllProducts ? "-90deg" : "0deg" }] }}
                   />
          </TouchableOpacity>
        </View>

        {/* Products Grid (2 columns layout for React Native) */}
        <View className="flex-row flex-wrap justify-between gap-3">
          {displayedProducts.map((item: Product) => {
            const itemKey = String(item._id || item.id);
            const isWishlist = wishlist.some(
              (w: any) => String(w._id || w.id) === itemKey
            );
            const isInCart = cartItems.includes(itemKey);
            const discountPercent = getDiscountPercentage(
              item.price,
              item.discountPrice
            );
            const outOfStock = item.inStock === false;
            const productCoupons = getProductCoupons(item);
            const imageSrc = item._id
              ? imageByIndexUrl(item._id, 0)
              : item.image?.[0] || "";

            return (
                <ProductCard
                key={itemKey}
                  item={{
                    ...item,
                    reviewCount: item.reviewCount || item.reviews || 0,
                  }}
                  itemKey={itemKey}
                  isWishlist={isWishlist}
                  isInCart={isInCart}
                  outOfStock={outOfStock}
                  discountPercent={discountPercent}
                  imageSrc={imageSrc}
                  productCoupons={productCoupons}
                  copiedCoupon={copiedCoupon}
                  onViewCard={() => handleViewCard(item)}
                  onWishlist={() => handleWishlist(item)}
                  onAddToCart={() =>handleAddToCart(item, cartItems, setCartItems)}                
                  onCopyCoupon={(code) => copyCoupon(code)}
                />
           
            );
          })}
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

