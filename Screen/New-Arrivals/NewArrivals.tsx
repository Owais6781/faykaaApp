import  { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {  X } from "lucide-react-native";
import { styles } from "./NewArrivals.styles";
// Import your custom AppText and Card component
import { AppText } from "../../components/FontProvider/FontProvider";
import { ProductCard } from "../../components/Card/Card"; // Path apne folder structure ke hisaab se check kar lein

// API Hooks
import { useGetNewArrivalsQuery } from "../../services/ProductApi";
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

export default function NewArrivals() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const [addToCartDb] = useAddToCartDbMutation();
  const { data: wishlistData } = useGetWishlistQuery();
  const [toggleWishlistDB] = useToggleWishlistDBMutation();

  const wishlist = wishlistData?.wishlist || [];
  const { data = [], isLoading, isError } = useGetNewArrivalsQuery();
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

  const handleViewCard = (item: Product) => {
    navigation.navigate("ProductViewCard", { productId: item._id || item.id });
  };

  const handleWishlist = async (item: Product) => {
    const productId = String(item._id || item.id);
    if (!productId) return;

    try {
      await toggleWishlistDB({ productId }).unwrap();
    } catch (error) {
      console.log("Wishlist update failed:", error);
    }
  };

  const handleAddToCart = async (item: Product) => {
    const itemKey = String(item._id || item.id);
    if (!itemKey) return;

    if (cartItems.includes(itemKey)) {
      navigation.navigate("Cart");
      return;
    }

    try {
      await addToCartDb({
        productId: itemKey,
        quantity: 1,
      }).unwrap();

      setCartItems((prev) => [...prev, itemKey]);
    } catch (error) {
      console.log("Failed to add cart:", error);
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

  // Loading State
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size="large" color="#A9803F" />
        </View>
        <AppText style={styles.loadingTitle}>Curating new arrivals</AppText>
        <AppText style={styles.loadingSubtitle}>One moment, please</AppText>
      </View>
    );
  }

  // Error State
  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconBox}>
          <X size={24} color="#9C6B3E" />
        </View>
        <AppText style={styles.errorTitle}>Something went astray</AppText>
        <AppText style={styles.errorSubtitle}>
          We couldn't reach the collection. Please try again.
        </AppText>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {}}
          style={styles.retryButton}
        >
          <AppText style={styles.retryButtonText}>Retry</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  const displayedProducts = showAllProducts
    ? latestProducts
    : latestProducts.slice(0, 8);

  return (
    <ScrollView contentContainerStyle={styles.sectionContainer}>
      <View style={styles.maxContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View>
            <AppText style={styles.headerTag}>Just In</AppText>
            <AppText style={styles.headerTitle}>New Arrivals</AppText>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowAllProducts(!showAllProducts)}
            style={styles.seeAllRow}
          >
            <AppText style={styles.seeAllText}>
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
        <View style={styles.gridContainer}>
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
                    reviews: item.reviewCount || item.reviews || 0,
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
                  onAddToCart={() => handleAddToCart(item)}
                  onCopyCoupon={(code) => copyCoupon(code)}
                />
           
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

