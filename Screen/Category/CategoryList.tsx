
import { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Clipboard
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRoute } from "@react-navigation/native";

import { useGetProductCategoryQuery } from "../../services/ProductApi";
import { useGetWishlistQuery, } from "../../services/WishlistApi";
import { useGetActiveCouponsQuery } from "../../services/CouponApi";
import { ProductCard } from "../../components/Card/Card";
import { useWishlist } from "../../services/Hooks/useWishlist";
import { useCart } from "../../services/Hooks/useCart";
import { useProductNavigation } from "../../services/Hooks/useProductNavigation"


export const CategoryList = () => {

  const route = useRoute<any>();
  const category = route.params?.category;

  const { data = [] } = useGetProductCategoryQuery();
  const { data: wishlistData } = useGetWishlistQuery();
  const { data: couponData } = useGetActiveCouponsQuery();

  const coupons = couponData?.coupons || [];
  const wishlist = wishlistData?.wishlist || [];

  const [cartItems, setCartItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const Api = process.env.EXPO_PUBLIC_API_URL || "";

  const imageByIndexUrl = (productId: string, index: number) =>
    `${Api}/api/${productId}/img/${index}`;

  const formatSlug = (value?: string) =>
    value?.toLowerCase().replace(/\s+/g, "-").trim();

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
    if (category) {
      products = products.filter((item: any) => formatSlug(item.category?.name) === category);
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
  }, [data, category, searchTerm]);




  const { handleViewCard } = useProductNavigation()
  const { handleWishlist } = useWishlist();
  const { handleAddToCart } = useCart();




  return (
<SafeAreaView>
    <ScrollView
      className="flex-1 bg-bgcream mt-[50px] p-4">

      <TextInput
        placeholder="Search..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        className="border-b border-textcolor mb-6 py-1 text-blacktext"
        placeholderTextColor="#9A9282"
      />

      <View className="flex-row flex-wrap justify-between">
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
              onViewCard={() => handleViewCard(item)}
              onWishlist={() => handleWishlist(item)}
              onAddToCart={() => handleAddToCart(item, cartItems, setCartItems)}
              onCopyCoupon={handleCopyCoupon}
            />
          );
        })}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

