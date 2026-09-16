
import { View, TouchableOpacity, Image,  } from "react-native";
import { AppText } from "../FontProvider/FontProvider";
import {styles} from "./Card.style"
import { 
  Heart, 
  ShoppingBag, 
  Check, 
  Copy, 
  Star 
} from "lucide-react-native";

interface Coupon {
  _id: string;
  code: string;
  discountType: "Percentage" | "Flat";
  discountValue: number;
}

interface Product {
  _id?: string;
  id?: number | string;
  title: string;
  price: number;
  image?: any[];
  discountPrice?: number;
  category?: {
    name: string;
  };
  inStock?: boolean;
  description?: string;
  color?: string;
  rating?: number;
  reviews?: number;
}

interface ProductCardProps {
  item: Product;
  itemKey: string;
  isWishlist: boolean;
  isInCart: boolean;
  outOfStock: boolean;
  discountPercent: number;
  imageSrc: string;
  productCoupons?: Coupon[];
  copiedCoupon?: string | null;
  onViewCard: () => void;
  onWishlist: () => void;
  onAddToCart: () => void;
  onCopyCoupon?: (code: string) => void;
}

export const ProductCard = ({
  item,
  isWishlist,
  isInCart,
  outOfStock,
  discountPercent,
  imageSrc,
  productCoupons = [],
  copiedCoupon,
  onViewCard,
  onWishlist,
  onAddToCart,
  onCopyCoupon,
}: ProductCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onViewCard}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageSrc }}
          style={[styles.productImage, outOfStock && styles.disabledImage]}
        />

        {/* Wishlist Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation?.();
            onWishlist();
          }}
          style={styles.wishlistButton}
        >
          <Heart
            size={12}
            color={isWishlist ? "#A9803F" : "#7A7365"}
            fill={isWishlist ? "#A9803F" : "transparent"}
          />
        </TouchableOpacity>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <View style={styles.discountBadge}>
            <AppText style={styles.discountText}>−{discountPercent}%</AppText>
          </View>
        )}

        {/* Coupon Ribbon Banner */}
        {productCoupons.length > 0 && (
          <View style={styles.couponBanner}>
            <AppText style={styles.couponEmoji}>🎀</AppText>
            <AppText style={styles.couponDiscountText}>
              {productCoupons[0].discountType === "Percentage"
                ? `EXTRA ${productCoupons[0].discountValue}% OFF`
                : `EXTRA ₹${productCoupons[0].discountValue} OFF`}
            </AppText>
            <AppText style={styles.couponCodeText}>{productCoupons[0].code}</AppText>
            
            {onCopyCoupon && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={(e) => {
                  e.stopPropagation?.();
                  onCopyCoupon(productCoupons[0].code);
                }}
                style={styles.copyButton}
              >
                {copiedCoupon === productCoupons[0].code ? (
                  <Check size={10} color="#E84C7F" />
                ) : (
                  <Copy size={10} color="#E84C7F" />
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Stock / Quick Add Overlays */}
        {outOfStock ? (
          <View style={styles.soldOutOverlay}>
            <AppText style={styles.soldOutText}>Sold Out</AppText>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={(e) => {
              e.stopPropagation?.();
              onAddToCart();
            }}
            style={styles.quickAddButton}
          >
            {isInCart ? (
              <>
                <Check size={14} color="#1E1B16" style={{ marginRight: 6 }} />
                <AppText style={styles.quickAddText}>Go to Bag</AppText>
              </>
            ) : (
              <>
                <ShoppingBag size={14} color="#1E1B16" style={{ marginRight: 6 }} />
                <AppText style={styles.quickAddText}>Quick Add</AppText>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Details Section */}
      <View style={styles.cardContent}>
        <AppText style={styles.itemCategory}>
          {item.category?.name || "Collection"}
        </AppText>

        <AppText variant="uiBold" style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </AppText>

        {item.description && (
          <AppText style={styles.itemDescription} numberOfLines={1}>
            {item.description}
          </AppText>
        )}

        {item.color && (
          <AppText style={styles.itemColor}>Color: {item.color}</AppText>
        )}

        {item.rating != null && (
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, i) => {
              const filled = i < Math.floor(item.rating || 0);
              return (
                <Star
                  key={i}
                  size={9}
                  color={filled ? "#A9803F" : "#E2D9C4"}
                  fill={filled ? "#A9803F" : "transparent"}
                  style={{ marginRight: 2 }}
                />
              );
            })}
            <AppText style={styles.reviewsCount}>({item.reviews || 0})</AppText>
          </View>
        )}

        <View style={styles.priceContainer}>
          <AppText style={styles.itemPrice}>
            ₹{(item.discountPrice || item.price).toLocaleString()}
          </AppText>
          {item.discountPrice && item.discountPrice < item.price && (
            <AppText style={styles.originalPrice}>
              ₹{item.price.toLocaleString()}
            </AppText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

