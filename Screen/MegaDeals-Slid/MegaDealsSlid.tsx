

import  { useMemo, useRef } from "react";
import {
  View,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"
import {  Flame, Timer } from "lucide-react-native";

import { styles } from "./MegaDealsSlide.styles"
import { AppText } from "../../components/FontProvider/FontProvider";
import MegaDealsCard from "./MegaDealsCard"; // Path apne folder structure ke hisaab se check kar lein

// API Hooks
import { useGetMegaDealsQuery } from "../../services/ProductApi";
import { useAddToCartDbMutation } from "../../services/CartApi";
import { useGetWishlistQuery, useToggleWishlistDBMutation } from "../../services/WishlistApi";

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
  inStock?: boolean;
  description?: string;
  rating: number;
  reviewCount: number;
}


export default function MegaDealsSlid() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const category = (route.params as any)?.category;

  const scrollRef = useRef<ScrollView>(null);

  // ✅ API hooks
  const { data: products = [], isLoading } = useGetMegaDealsQuery();
  const { data: wishlistData = [] } = useGetWishlistQuery();

  const [toggleWishlist] = useToggleWishlistDBMutation();
  const [addToCart] = useAddToCartDbMutation();

  const wishlist =
    wishlistData &&
      !Array.isArray(wishlistData) &&
      "wishlist" in wishlistData
      ? (wishlistData as any).wishlist
      : [];

  const formatSlug = (value?: string) =>
    (value || "").toLowerCase().replace(/\s+/g, "-").trim();

  const getDiscountPercentage = (price?: number, discountPrice?: number) => {
    if (price == null || discountPrice == null) return 0;
    if (price <= discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const megaDealsProducts = useMemo(() => {
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

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    // Note: ScrollView in RN uses scrollTo({ x, y, animated })
    // We can maintain a simple current offset or approximate it using standard scroll offsets.
    // Alternatively, let's scroll by a fixed width or index.
  };

  // ✅ Handlers connected to API
  const Api = process.env.EXPO_PUBLIC_API_URL;
  const imageByIndexUrl = (productId: string, index: number) =>
    `${Api}/api/${productId}/img/${index}`;

  const handleViewCard = (item: Product) => {
    navigation.navigate("ProductViewCard", { productId: item._id || item.id });
  };

  const handleWishlist = async (item: Product) => {
    const productId = String(item._id || item.id);
    if (!productId) return;
    try {
      await toggleWishlist({ productId }).unwrap();
    } catch (error) {
      console.log("Wishlist update failed:", error);
    }
  };

  const handleAddToCart = async (item: Product) => {
    const productId = String(item._id || item.id);
    if (!productId) return;
    try {
      await addToCart({
        productId,
        quantity: 1,
      }).unwrap();
    } catch (error) {
      console.log("Add to cart failed:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.spinnerWrapper}>
          <View style={styles.spinnerCircleOuter} />
          <View style={styles.spinnerCircleInner} />
        </View>
        <AppText style={styles.loadingTitle}>Curating new arrivals</AppText>
        <AppText style={styles.loadingSubtitle}>One moment, please</AppText>
      </View>
    );
  }

  if (megaDealsProducts.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <View style={styles.flameIconBox}>
              <Flame size={24} color="#D9C08F" />
            </View>

            <View>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Timer size={11} color="#D9C08F" />
                  <AppText style={styles.badgeText}>Limited Time</AppText>
                </View>
              </View>
              <AppText style={styles.headerTitle}>Mega Deals</AppText>
              <AppText style={styles.headerSubtitle}>
                Up to <AppText style={styles.goldText}>60–80% off</AppText> on selected pieces
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Products Slider */}
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {megaDealsProducts.map((item: Product) => (
            <View key={String(item._id || item.id)} style={styles.cardWrapper}>
              <MegaDealsCard
                item={item}
                wishlist={wishlist}
                cartItems={[]}
                imageByIndexUrl={imageByIndexUrl}
                handleViewCard={() => handleViewCard(item)}
                handleWishlist={() => handleWishlist(item)}
                handleAddToCart={() => handleAddToCart(item)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

