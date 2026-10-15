import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";


import { ProductCard } from "../../components/Card/Card"; // Adjust the path as per your file structure
import { AppText } from "../../components/FontProvider/FontProvider";

// API hooks
import { useGetBestSellersQuery } from "../../services/ProductApi";
import { useGetWishlistQuery, } from "../../services/WishlistApi";
import { useGetActiveCouponsQuery } from "../../services/CouponApi";
//function hooks 
import { useWishlist } from "../../services/Hooks/useWishlist";
import { useCart } from "../../services/Hooks/useCart";
import { useProductNavigation } from "../../services/Hooks/useProductNavigation"


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
  currentStatus?: string;
  products?: any[];
  category?: any[];
  sellerId?: any[];
}

interface Product {
  _id?: string;
  id?: string | number;
  title: string;
  color?: string;
  price: number;
  image?: string[];
  router?: string;
  discountPrice?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
  reviews?: number;
  inStock?: boolean;
  description?: string;
  rating: number;
  reviewCount: number;
  coupons?: Coupon[];
  sellerId?: { _id: string };
}

export const BestSeller = () => {
  const route = useRoute();
  const category = (route.params as any)?.category;

  const { data: wishlistData } = useGetWishlistQuery();
  const { data, } = useGetBestSellersQuery();

   

  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const { data: couponData } = useGetActiveCouponsQuery();

  const coupons = couponData?.coupons || [];
  const wishlist = wishlistData?.wishlist || [];
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);

  const Api = process.env.EXPO_PUBLIC_API_URL || "";

  const imageByIndexUrl = (productId: string, index: number) =>
    `${Api}/api/${productId}/img/${index}`;

  const formatSlug = (value?: string) =>
    (value || "").toLowerCase().replace(/\s+/g, "-").trim();

  const getDiscountPercentage = (price?: number, discountPrice?: number) => {
    if (price == null || discountPrice == null) return 0;
    if (price <= discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const products = useMemo(() => {
    if (Array.isArray((data as any)?.data)) return (data as any).data as Product[];
    if (Array.isArray(data)) return data as Product[];
    return [];
  }, [data]);

  
  const filteredProducts = useMemo(() => {
    let items = [...products];

    if (category) {
      items = items.filter(
        (item: Product) => formatSlug(item.category?.name) === category
      );
    }

    return items;
  }, [products, category]);


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



  const { handleViewCard } = useProductNavigation()
  const { handleWishlist } = useWishlist();
  const { handleAddToCart } = useCart();



  const copyCoupon = async (code: string) => {
    try {
      await Clipboard.setStringAsync(code);
      setCopiedCoupon(code);
      setTimeout(() => {
        setCopiedCoupon(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy coupon:", error);
    }
  };








  const displayedProducts = showAllProducts
    ? filteredProducts
    : filteredProducts.slice(0, 8);


  return (
      <SafeAreaView>
    <ScrollView className="flex-grow bg-bgcream  px-3"  >
      <View className="w-full max-w-[1200px] self-center">

        <View className="flex-row items-end justify-between border-b border-textcolor pb-4 mb-5">
          <View>
            <AppText className="text-[11px] font-semibold tracking-[2.2px] text-goldtext uppercase mb-1.5">
              Curated For You
            </AppText>
            <AppText className="text-[30px] italic text-blacktext">Best Seller</AppText>
          </View>

          <TouchableOpacity
            onPress={() => setShowAllProducts(!showAllProducts)}
            className="flex-row items-center gap-1 mb-1"
          >
            <Text className="text-xs font-semibold tracking-wider text-goldtext uppercase">
              {showAllProducts ? "See Less" : "See All"}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={14}
              color="#A9803F"
              style={{ transform: [{ rotate: showAllProducts ? "-90deg" : "0deg" }] }}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap justify-between gap-y-6">
          {displayedProducts.map((item: Product) => {
            const itemKey = String(item._id || item.id);
            const isWishlist = wishlist.some(
              (w: any) => String(w._id || w.id) === itemKey
            );
            const discountPercent = getDiscountPercentage(item.price, item.discountPrice);
            const isInCart = cartItems.includes(itemKey);
            const outOfStock = item.inStock === false;
            const productCoupons = getProductCoupons(item);
            const imageSrc = item._id ? imageByIndexUrl(item._id, 0) : item.image?.[0] || "";

            return (
              <ProductCard
                key={itemKey}
                item={item}
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
                onAddToCart={() => handleAddToCart(item, cartItems, setCartItems)}
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

