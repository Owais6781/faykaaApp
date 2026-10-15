
import { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Clipboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import { useRoute } from "@react-navigation/native";

import { useGetProductCategoryQuery } from "../../services/ProductApi";
import { useGetWishlistQuery,  } from "../../services/WishlistApi";
import { useGetActiveCouponsQuery } from "../../services/CouponApi";
import { AppText } from "../../components/FontProvider/FontProvider";
import { ProductCard } from "../../components/Card/Card";
import {palette} from "../../globaltheme/colors"
import {useWishlist} from "../../services/Hooks/useWishlist";
import {useCart} from "../../services/Hooks/useCart";
import {useProductNavigation} from "../../services/Hooks/useProductNavigation"



export  const ShopCatalog =()=> {
 
  const route = useRoute<any>();
  const initialCategory = route.params?.category || "all";

  const { data = [], isError } = useGetProductCategoryQuery();
  const { data: wishlistData } = useGetWishlistQuery();
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

  const {handleViewCard} = useProductNavigation()
  const { handleWishlist } = useWishlist();
  const { handleAddToCart } = useCart();

return (
  <SafeAreaView>
  <View className="flex-1 bg-bgcream p-x2">
    <ScrollView
      className="flex-1 bg-bgcream"
      contentContainerStyle={{
        padding: 10,
      }}
    >
      {/* Search Bar */}
      <TextInput
        placeholder="Search ..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholderTextColor="#9A9282"
       className="border-b border-textcolor mb-6 py-1 text-blacktext"
      
      />

      {/* Horizontal Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3"
      >
        {/* All Items */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedCategory("all")}
          className={`mr-2 items-center justify-center rounded-2xl border px-3 py-1.5 ${
            selectedCategory === "all"
              ? "border-goldtext bg-goldtext"
              : "border-textcolor bg-[#FAF7F2]"
          }`}
        >
          <AppText
            className={`text-[11px] ${
              selectedCategory === "all"
                ? "font-bold  text-white"
                : "text-[#5A5245]"
            }`}
          >
            All Items
          </AppText>
        </TouchableOpacity>

        {/* Categories */}
        {uniqueCategories.map((cat) => {
          const isActive = selectedCategory === cat.slug;

          return (
            <TouchableOpacity
              key={cat.slug}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory(cat.slug)}
              className={`mr-2 items-center justify-center rounded-2xl border px-3 py-1.5 ${
                isActive
                  ? "border-goldtext bg-goldtext"
                  : "border-[#E2D9C4] bg-[#FAF7F2]"
              }`}
            >
              <AppText
                className={`text-[11px] ${
                  isActive
                    ? "font-bold text-white"
                    : "text-[#5A5245]"
                }`}
              >
                {cat.name}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Product Cards Grid */}
      <View className="flex-row flex-wrap justify-between">
        {filteredProducts.map((item: any) => {
          const itemKey = item._id || String(item.id);

          const isWishlist = wishlist.some(
            (w: any) =>
              (w._id || String(w.id)) === itemKey
          );

          const discountPercent = getDiscountPercentage(
            item.price,
            item.discountPrice
          );

          const isInCart = cartItems.includes(itemKey);

          const outOfStock = item.inStock === false;

          const productCoupons = getProductCoupons(item);

          const imageUri = item._id
            ? imageByIndexUrl(item._id, 0)
            : item.image?.[0];

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
              onViewCard={() => handleViewCard(item)}
              onWishlist={() => handleWishlist(item)}
              onAddToCart={() =>handleAddToCart(item,cartItems,setCartItems)}
              
          
                
                  
            
              onCopyCoupon={handleCopyCoupon}
            />
          );
        })}
      </View>
    </ScrollView>
  </View>
  </SafeAreaView>
);

}
