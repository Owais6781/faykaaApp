
import  { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppText } from "../../components/FontProvider/FontProvider";
import { ProductCard } from "../../components/Card/Card";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./MegaDeals.styles";
// API Hooks
import { useGetMegaDealsQuery } from "../../services/ProductApi";
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
}

interface Product {
  _id?: string;
  id?: string | number;
  title: string;
  color?: string;
  price: number;
  image?: string[];
  discountPrice?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
  inStock?: boolean;
  description?: string;
  rating: number;
  reviewCount: number;
  coupons?: Coupon[];
  sellerId?: { _id: string }[];
}

export default function MegaDeals() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const category = (route.params as any)?.category;

  const [addToCartDb] = useAddToCartDbMutation();
  const { data: wishlistData } = useGetWishlistQuery();
  const [toggleWishlistDB] = useToggleWishlistDBMutation();
  const { data, isLoading, isError } = useGetMegaDealsQuery();
  const { data: couponData } = useGetActiveCouponsQuery();

  const coupons = couponData?.coupons || [];
  const wishlist = wishlistData?.wishlist || [];

  const [showAllProducts, setShowAllProducts] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const Api = process.env.EXPO_PUBLIC_API_URL;

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
      items = items.filter((item) => formatSlug(item.category?.name) === category);
    }
    return items
      .filter((item) => {
        const percent = getDiscountPercentage(item.price, item.discountPrice);
        return percent >= 60 && percent <= 90;
      })
      .sort((a, b) => {
        const discountA = getDiscountPercentage(a.price, a.discountPrice);
        const discountB = getDiscountPercentage(b.price, b.discountPrice);
        return discountB - discountA;
      });
  }, [products, category]);

  const visibleCoupons = coupons.filter(
    (coupon: any) =>
      coupon.currentStatus === "Active" || coupon.currentStatus === "Upcoming"
  );

  const getProductCoupons = (product: any) => {
    return visibleCoupons.filter((coupon: any) => {
      const productMatch = coupon.products?.some(
        (couponProduct: any) => couponProduct._id?.toString() === product._id?.toString()
      );
      const categoryMatch = coupon.category?.some(
        (couponCategory: any) => couponCategory._id?.toString() === product.category?._id?.toString()
      );
      const sellerMatch = coupon.sellerId?.some(
        (couponSeller: any) => couponSeller._id?.toString() === product.sellerId?._id?.toString()
      );
      return productMatch || categoryMatch || sellerMatch;
    });
  };

  const handleWishlist = async (item: Product) => {
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

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#A9803F" />
        <AppText style={styles.loadingTitle}>Curating your selection</AppText>
        <AppText style={styles.loadingSubtitle}>One moment, please</AppText>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <AppText style={styles.errorTitle}>Something went astray</AppText>
        <AppText style={styles.errorSubtitle}>Failed to load products. Please try again later.</AppText>
      </View>
    );
  }

  const displayedList = showAllProducts ? filteredProducts : filteredProducts.slice(0, 8);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <AppText style={styles.curatedText}>Curated For You</AppText>
          <AppText style={styles.MegaDealsTitle}>Mega Deals</AppText>
        </View>

        <TouchableOpacity
          onPress={() => setShowAllProducts(!showAllProducts)}
          style={styles.seeAllRow}
        >
          <AppText style={styles.seeAllText}>{showAllProducts ? "See Less" : "See All"}</AppText>
          <Ionicons
            name="arrow-forward"
            size={14}
            color="#A9803F"
            style={{ transform: [{ rotate: showAllProducts ? "-90deg" : "0deg" }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Product Grid Container */}
      <View style={styles.grid}>
        {displayedList.map((item: Product) => {
          const itemKey = String(item._id || item.id);
          const isWishlist = wishlist.some((w: any) => String(w._id || w.id) === itemKey);
          const discountPercent = getDiscountPercentage(item.price, item.discountPrice);
          const isInCart = cartItems.includes(itemKey);
          const outOfStock = item.inStock === false;
          const productCoupons = getProductCoupons(item);
          const imageSrc = item._id ? imageByIndexUrl(item._id, 0) : item.image?.[0] || "";

          return (
            /* Wrapped with gridItemWrapper so cardWidth is applied */
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