

import { useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
} from "react-native";

import { useRoute } from "@react-navigation/native";
import { Flame, Timer } from "lucide-react-native";
import { palette } from "../../globaltheme/colors"
import { AppText } from "../../components/FontProvider/FontProvider";
import { MegaDealsCard } from "./MegaDealsCard";

// API Hooks
import { useGetMegaDealsQuery } from "../../services/ProductApi";
import { useGetWishlistQuery } from "../../services/WishlistApi";
// Hooks
import { useWishlist } from "../../services/Hooks/useWishlist";
import { useCart } from "../../services/Hooks/useCart";
import { useProductNavigation } from "../../services/Hooks/useProductNavigation";

interface Product {
  _id?: string;
  id?: string | number;
  title: string;
  color?: string;
  price: number;
  images?: string[];
  image?: string[];
  router?: string;
  discountPrice?: number;
  discountPercentage?: number;
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

export const MegaDealsSlid = () => {
  const route = useRoute();
  const category = (route.params as any)?.category;

  const scrollRef = useRef<ScrollView>(null);

  // ✅ API hooks with console debugging check
  const { data: megaDealsData, } = useGetMegaDealsQuery();
  const { data: wishlistData } = useGetWishlistQuery();
  const [cartItems, setCartItems] = useState<string[]>([]);



  const products = useMemo(() => {
    if (Array.isArray(megaDealsData)) return megaDealsData;
    if (megaDealsData && Array.isArray((megaDealsData as any)?.data)) return (megaDealsData as any).data;
    return [];
  }, [megaDealsData]);

  const wishlist = useMemo(() => {
    if (wishlistData && !Array.isArray(wishlistData) && "wishlist" in wishlistData) {
      return (wishlistData as any).wishlist;
    }
    if (Array.isArray(wishlistData)) return wishlistData;
    return [];
  }, [wishlistData]);

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
      items = items.filter((item) => {
        const itemSlug = formatSlug(item.category?.slug || item.category?.name);
        return itemSlug === formatSlug(category);
      });
    }

    const filtered = items.filter((item) => {
      const percent = item.discountPercentage ?? getDiscountPercentage(item.price, item.discountPrice);
      return percent >= 60 && percent <= 90;
    }).sort((a, b) => {
      const discountA = a.discountPercentage ?? getDiscountPercentage(a.price, a.discountPrice);
      const discountB = b.discountPercentage ?? getDiscountPercentage(b.price, b.discountPrice);
      return discountB - discountA;
    });

    return filtered;
  }, [products, category]);

  const Api = process.env.EXPO_PUBLIC_API_URL || "";
  const imageByIndexUrl = (productId: string, index: number) =>
    `${Api}/api/${productId}/img/${index}`;

  const { handleViewCard } = useProductNavigation();
  const { handleWishlist } = useWishlist();
  const { handleAddToCart } = useCart();

  if (!megaDealsProducts || megaDealsProducts.length === 0) return null;

  return (
    <View className="pt-[2px] bg-blacktext px-2">
      {/* Header */}

      <View className="bg-blacktext px-6 py-8  ">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-start gap-4">
            <View className="hidden w-[56px] h-[56px] border  items-center justify-center"
             style={{borderColor: palette.WarmBrass }}
            >
              <Flame size={24} color="#D9C08F" />
            </View>

            <View>
              <View className="flex-row items-center mb-10">
                <View className="flex-row items-center gap-2  px-3 py-1 mb-1"
                  style={{ borderWidth: 1, borderColor: palette.WarmBrass }}>

                  <Timer size={11} color="#D9C08F" />
                  <AppText className="text-[10px] font-semibold tracking-[1.2px] uppercase"
                    style={{ color: palette.WarmBrass }}>Limited Time</AppText>
                </View>
              </View>

              <AppText className="text-[32px] italic text-white">Mega Deals</AppText>
              <AppText className="text-[13px]  mt-[6px]" style={{ color: palette.SoftGray }} >
                Up to <AppText style={{ color: palette.WarmBrass }}>60–80% off</AppText > on selected pieces
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Products Slider */}
      <View className="bg-blacktext mt-[-30px] pt-6 pb-6 px-4">
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="bg-blacktext "
          contentContainerClassName="gap-4"

        >
          {megaDealsProducts.map((item: Product, index: number) => (
            <View key={String(item._id || item.id || index)}
              style={{ width: 260 }}>

              <MegaDealsCard
                item={item}
                wishlist={wishlist}
                cartItems={cartItems}
                imageByIndexUrl={imageByIndexUrl}
                onViewCard={() => handleViewCard(item)}
                onWishlist={() => handleWishlist(item)}
                onAddToCart={() => handleAddToCart(item, cartItems, setCartItems)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
 
  );
};
