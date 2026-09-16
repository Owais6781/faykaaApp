
import { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Clipboard,
} from "react-native";
 import {styles} from "./Shop.styles"
import { useNavigation, useRoute } from "@react-navigation/native";

import { useGetProductCategoryQuery } from "../../services/ProductApi";
import { useAddToCartDbMutation } from "../../services/CartApi";
import { useGetWishlistQuery, useToggleWishlistDBMutation } from "../../services/WishlistApi";
import { useGetActiveCouponsQuery } from "../../services/CouponApi";
import { AppText } from "../../components/FontProvider/FontProvider";
import { ProductCard } from "../../components/Card/Card";

export default function ShopCatalog() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialCategory = route.params?.category || "all";

  const { data = [], isLoading, isError } = useGetProductCategoryQuery();
  const [addToCartDb] = useAddToCartDbMutation();
  const { data: wishlistData } = useGetWishlistQuery();
  const [toggleWishlistDB] = useToggleWishlistDBMutation();
  const { data: couponData } = useGetActiveCouponsQuery();

  const coupons = couponData?.coupons || [];
  const wishlist = wishlistData?.wishlist || [];

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const Api = process.env.EXPO_PUBLIC_API_URL || "";

  const imageByIndexUrl = (productId: string, index: number) =>
    `${Api}/api/${productId}/img/${index}`;

  const formatSlug = (value?: string) =>
    value?.toLowerCase().trim().replace(/[\s_]+/g, "-") || "";

  const uniqueCategories = useMemo(() => {
    const map = new Map<string, { name: string; slug: string }>();
    (data || []).forEach((item: any) => {
      const name = item.category?.name || item.name;
      if (name) {
        const slug = formatSlug(name);
        if (!map.has(slug)) {
          map.set(slug, { name, slug });
        }
      }
    });
    return Array.from(map.values());
  }, [data]);

  const getDiscountPercentage = (price?: number, discountPrice?: number) => {
    if (price == null || discountPrice == null || price <= discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const visibleCoupons = coupons.filter(
    (coupon: any) => coupon.currentStatus === "Active" || coupon.currentStatus === "Upcoming"
  );

  const getProductCoupons = (product: any) => {
    return visibleCoupons.filter((coupon: any) => {
      const productMatch = coupon.products?.some(
        (cp: any) => cp._id?.toString() === product._id?.toString()
      );
      const categoryMatch = coupon.category?.some(
        (cc: any) => cc._id?.toString() === product.category?._id?.toString()
      );
      return productMatch || categoryMatch;
    });
  };

  const handleCopyCoupon = (code: string) => {
    try {
      Clipboard.setString(code);
      setCopiedCoupon(code);
      setTimeout(() => setCopiedCoupon(null), 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProducts = useMemo(() => {
    let products = [...data];

    if (selectedCategory && selectedCategory !== "all") {
      products = products.filter((item: any) => {
        const catName = item.category?.name || item.name || "";
        return formatSlug(catName) === selectedCategory;
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      products = products.filter(
        (item: any) =>
          item.title?.toLowerCase().includes(term) ||
          item.category?.name?.toLowerCase().includes(term)
      );
    }
    return products;
  }, [data, selectedCategory, searchTerm]);

  const handleWishlist = async (item: any) => {
    const productId = String(item._id || item.id);
    if (!productId) return;
    try {
      await toggleWishlistDB({ productId }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (item: any) => {
    const itemKey = String(item._id || item.id);
    if (cartItems.includes(itemKey)) {
      navigation.navigate("Cart");
      return;
    }
    try {
      await addToCartDb({ productId: itemKey, quantity: 1 }).unwrap();
      setCartItems((prev) => [...prev, itemKey]);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#A9803F" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <AppText>Failed to load collection.</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.productSection} contentContainerStyle={styles.productContentContainer}>
        
        {/* Search Bar */}
        <TextInput
          placeholder="Search products..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
          placeholderTextColor="#9A9282"
        />

        {/* Horizontal Category Chips (Sidebar Remove hone ke baad categories ke liye) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedCategory("all")}
            style={[
              styles.categoryChip,
              selectedCategory === "all" && styles.activeCategoryChip,
            ]}
          >
            <AppText
              style={[
                styles.categoryChipText,
                selectedCategory === "all" && styles.activeCategoryChipText,
              ]}
            >
              All Items
            </AppText>
          </TouchableOpacity>

          {uniqueCategories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <TouchableOpacity
                key={cat.slug}
                activeOpacity={0.7}
                onPress={() => setSelectedCategory(cat.slug)}
                style={[styles.categoryChip, isActive && styles.activeCategoryChip]}
              >
                <AppText
                  style={[styles.categoryChipText, isActive && styles.activeCategoryChipText]}
                >
                  {cat.name}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Product Cards Grid */}
        <View style={styles.grid}>
          {filteredProducts.map((item: any) => {
            const itemKey = item._id || String(item.id);
            const isWishlist = wishlist.some((w: any) => (w._id || String(w.id)) === itemKey);
            const discountPercent = getDiscountPercentage(item.price, item.discountPrice);
            const isInCart = cartItems.includes(itemKey);
            const outOfStock = item.inStock === false;
            const productCoupons = getProductCoupons(item);
            const imageUri = item._id ? imageByIndexUrl(item._id, 0) : item.image?.[0];

            return (
              <ProductCard
                key={itemKey}
                item={item}
                itemKey={itemKey}
                isWishlist={isWishlist}
                isInCart={isInCart}
                outOfStock={outOfStock}
                discountPercent={discountPercent}
                imageSrc={imageUri}
                productCoupons={productCoupons}
                copiedCoupon={copiedCoupon}
                onViewCard={() =>
                  navigation.navigate("ProductViewCard", { productId: item._id || item.id })
                }
                onWishlist={() => handleWishlist(item)}
                onAddToCart={() => handleAddToCart(item)}
                onCopyCoupon={handleCopyCoupon}
              />
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
}
