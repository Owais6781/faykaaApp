import  {  useMemo, useState } from "react";
import {
  View,
  Text,
} from "react-native";
import { useNavigation,  } from "@react-navigation/native";

import {styles} from "./Suggestion.styles"
import { ProductCard } from "../Card/Card"; // Adjust import path if needed

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

type ProductFromApi = {
  _id: string;
  id?: number | string;
  productId: string;
  category: {
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
  title?: string;
  description?: string;
  stock?: number;
  price?: number;
  discountPrice?: number;
  images?: any[];
  image?: string[];
  inStock?: boolean;
  color?: string;
  rating: number;
  reviewCount: number;
  paymentOptions?: {
    cod?: boolean;
    online?: boolean;
  };
  returnPolicy?: {
    isReturnable?: boolean;
    returnDays?: number;
    policyText?: string;
  };
  coupons?: Coupon[];
};


// Suggested Products Sub-Component using ProductCard
type SuggestedProductsProps = {
  currentProduct: ProductFromApi;
  allProducts: ProductFromApi[];
  onWishlistPress?: (item: ProductFromApi) => void;
  wishlist?: any[];
  activeCoupons?: Coupon[];
};

 export default  function SuggestedProducts({
  currentProduct,
  allProducts,
  onWishlistPress,
  wishlist = [],
  activeCoupons = [],
}: SuggestedProductsProps) {
  const navigation = useNavigation<any>();
  const Api = process.env.EXPO_PUBLIC_API_URL || "";
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const suggestedProducts = useMemo(() => {
    if (!currentProduct || !allProducts?.length) return [];
    const currentKey = currentProduct._id || String(currentProduct.id);

    return allProducts
      .filter((item) => {
        const itemKey = item._id || String(item.id);
        return (
          itemKey !== currentKey &&
          item.category?.name?.toLowerCase() ===
            currentProduct.category?.name?.toLowerCase()
        );
      })
      .slice(0, 8);
  }, [currentProduct, allProducts]);

  const handleAddToCart = async (item: ProductFromApi) => {
    const itemKey = String(item._id || item.id);
    if (!item._id && !item.id) return;
    if (cartItems.includes(itemKey)) {
      navigation.navigate("Cart");
      return;
    }
    try {
      setCartItems((prev) => [...prev, itemKey]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductClick = (item: ProductFromApi) => {
    const itemKey = item._id || item.id;
    if (itemKey) {
      navigation.navigate("ProductViewCard", {
        productId: item._id || item.id,
      });
    }
  };

  const imageByIndexUrl = (productId: string, index: number) =>
    `${Api}/api/${productId}/img/${index}`;

  const getDiscountPercentage = (price?: number, discountPrice?: number) => {
    if (!price || !discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const getProductCoupons = (prod: ProductFromApi) => {
    return activeCoupons.filter((coupon: any) => {
      const productMatch = coupon.products?.some(
        (cp: any) => cp._id?.toString() === prod._id?.toString()
      );
      const categoryMatch = coupon.category?.some(
        (cc: any) => cc._id?.toString() === prod.category?._id?.toString()
      );
      return productMatch || categoryMatch;
    });
  };

  const handleCopyCoupon = (code: string) => {
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  if (suggestedProducts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.subheading}>More To Explore</Text>
        <Text style={styles.heading}>Similar Products</Text>
      </View>

      <View style={styles.gridContainer}>
        {suggestedProducts.map((item) => {
          const itemKey = item._id || String(item.id);
          const isWishlist = wishlist.some(
            (w: any) => (w._id || String(w.id)) === itemKey
          );
          const discountPercent = getDiscountPercentage(
            item.price,
            item.discountPrice
          );
          const isInCart = cartItems.includes(itemKey);
          const outOfStock = item.inStock === false;
          const imageSrc = item._id
            ? imageByIndexUrl(item._id, 0)
            : item.image?.[0] || "";

          const productCoupons = getProductCoupons(item);

          return (
          //  <View key={itemKey} style={styles.cardWrapper}>
              <ProductCard 
             key={itemKey}
                item={{
                  _id: item._id,
                  id: item.id,
                  title: item.title || "Untitled Product",
                  price: item.price || 0,
                  discountPrice: item.discountPrice,
                  category: item.category,
                  inStock: item.inStock,
                  description: item.description,
                  color: item.color,
                  rating: item.rating,
                  reviews: item.reviewCount,
                }}
                itemKey={itemKey}
                isWishlist={isWishlist}
                isInCart={isInCart}
                outOfStock={outOfStock}
                discountPercent={discountPercent}
                imageSrc={imageSrc}
                productCoupons={productCoupons}
                copiedCoupon={copiedCoupon}
                onViewCard={() => handleProductClick(item)}
                onWishlist={() => onWishlistPress?.(item)}
                onAddToCart={() => handleAddToCart(item)}
                onCopyCoupon={handleCopyCoupon}
              />
            // </View>
          );
        })}
      </View>
    </View>
  );



}



