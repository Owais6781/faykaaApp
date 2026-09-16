import  { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import {styles} from "./BestSeller.styles"

import { ProductCard } from "../../components/Card/Card"; // Adjust the path as per your file structure

// API hooks
import { useGetBestSellersQuery } from "../../services/ProductApi";
import { useAddToCartDbMutation } from "../../services/CartApi";
import { useGetWishlistQuery, useToggleWishlistDBMutation } from "../../services/WishlistApi";
import { useGetActiveCouponsQuery } from "../../services/CouponApi";

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

export default function BestSeller() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const category = (route.params as any)?.category;

  const [addToCartDb] = useAddToCartDbMutation();
  const { data: wishlistData } = useGetWishlistQuery();
  const [toggleWishlistDB] = useToggleWishlistDBMutation();
  const { data, isLoading, isError, refetch } = useGetBestSellersQuery();

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


  const handleWishlist = async (item: Product) => {
    const token = (globalThis as any).token; // Or retrieve token from your auth system/secure store

    if (!token) {
      navigation.navigate("Login", { from: route.name });
      return;
    }

    const productId = String(item._id || item.id);
    if (!productId) {
      alert("Product id not found");
      return;
    }

    try {
      await toggleWishlistDB({ productId }).unwrap();
    } catch (error) {
      console.log(error);
      alert("Wishlist update failed");
    }
  };

  const handleAddToCart = async (item: Product) => {
    const token = (globalThis as any).token;

    if (!token) {
      navigation.navigate("Login", { from: route.name });
      return;
    }

    const itemKey = String(item._id || item.id);
    if (!item._id && !item.id) {
      alert("Product id not found");
      return;
    }

    if (cartItems.includes(itemKey)) {
      navigation.navigate("Cart");
      return;
    }

    try {
      await addToCartDb({
        productId: String(item._id || item.id),
        quantity: 1,
      }).unwrap();

      setCartItems((prev) => [...prev, itemKey]);
    } catch (error) {
      console.log(error);
      alert("Failed to add cart");
    }
  };

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

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#A9803F" />
        <Text style={styles.loadingTitle}>Curating your selection</Text>
        <Text style={styles.loadingSubtitle}>One moment, please</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorIconContainer}>
          <Ionicons name="close" size={24} color="#9C6B3E" />
        </View>
        <Text style={styles.loadingTitle}>Something went astray</Text>
        <Text style={styles.loadingSubtitle}>
          Failed to load products. Please try again later.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayedProducts = showAllProducts
    ? filteredProducts
    : filteredProducts.slice(0, 8);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.curatedText}>Curated For You</Text>
          <Text style={styles.bestSellerTitle}>Best Seller</Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowAllProducts(!showAllProducts)}
          style={styles.seeAllRow}
        >
          <Text style={styles.seeAllText}>
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

      <View style={styles.grid}>
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
              onViewCard={() => navigation.navigate("ProductViewCard", { productId: item._id || item.id })}
              onWishlist={() => handleWishlist(item)}
              onAddToCart={() => handleAddToCart(item)}
              onCopyCoupon={(code) => copyCoupon(code)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

