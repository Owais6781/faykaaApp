import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Flame } from "lucide-react-native";
import {styles} from "./MegaDealsCard.styles"
// Import your custom AppText component
import { AppText } from "../../components/FontProvider/FontProvider";

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

type MegaDealsCardProps = {
  item: Product;
  wishlist: any[];
  cartItems: string[];
  imageByIndexUrl: (productId: string, index: number) => string;
  handleViewCard: (item: Product) => void;
  handleWishlist: (item: Product) => void;
  handleAddToCart: (item: Product) => void;
};

export default function MegaDealsCard({
  item,
  wishlist,
  cartItems,
  imageByIndexUrl,
  handleViewCard,
  handleWishlist,
  handleAddToCart,
}: MegaDealsCardProps) {
  const itemKey = String(item._id || item.id);

  const isWishlist = wishlist?.some(
    (w: any) => String(w._id || w.id) === itemKey
  );

  const isInCart = cartItems.includes(itemKey);
  const outOfStock = item.inStock === false;

  const getDiscountPercentage = (price?: number, discountPrice?: number) => {
    if (price == null || discountPrice == null) return 0;
    if (price <= discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const discountPercent = getDiscountPercentage(item.price, item.discountPrice);

  const imageSource = item._id
    ? { uri: imageByIndexUrl(item._id, 0) }
    : item.image?.[0]
    ? { uri: item.image[0] }
    : null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleViewCard(item)}
      style={styles.cardContainer}
    >
      {/* Image & Overlay Section */}
      <View style={styles.imageWrapper}>
        {imageSource && (
          <Image
            source={imageSource}
            style={[
              styles.productImage,
              outOfStock && styles.outOfStockImage,
            ]}
            resizeMode="cover"
          />
        )}

        {/* Wishlist Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleWishlist(item)}
          style={styles.wishlistButton}
        >
          {isWishlist ? (
            <FontAwesome name="heart" size={12} color="#A9803F" />
          ) : (
            <FontAwesome name="heart-o" size={12} color="#7A7365" />
          )}
        </TouchableOpacity>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <View style={styles.discountBadge}>
            <Flame size={10} color="#FFFFFF" />
            <AppText style={styles.discountText}>{discountPercent}% OFF</AppText>
          </View>
        )}

        {/* Sold Out Overlay */}
        {outOfStock && (
          <View style={styles.soldOutBanner}>
            <AppText style={styles.soldOutText}>Sold Out</AppText>
          </View>
        )}

        {/* Add To Cart / Quick Add Button */}
        {!outOfStock && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleAddToCart(item)}
            style={styles.cartButton}
          >
            {isInCart ? (
              <>
                <Ionicons name="checkmark" size={14} color="#1E1B16" />
                <AppText style={styles.cartButtonText}>Go to Bag</AppText>
              </>
            ) : (
              <>
                <Ionicons name="bag-outline" size={14} color="#1E1B16" />
                <AppText style={styles.cartButtonText}>Quick Add</AppText>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        {/* Category */}
        <AppText style={styles.categoryText}>
          {item.category?.name || "Mega Deal"}
        </AppText>

        {/* Product Title */}
        <AppText numberOfLines={1} style={styles.productTitle}>
          {item.title}
        </AppText>

        {/* Description */}
        <AppText numberOfLines={1} style={styles.productDescription}>
          {item.description}
        </AppText>

        {/* Rating */}
        <View style={styles.ratingRow}>
          {[...Array(5)].map((_, i) => (
            <FontAwesome
              key={i}
              name="star"
              size={9}
              color={i < Math.floor(item.rating) ? "#A9803F" : "#E2D9C4"}
              style={{ marginRight: 2 }}
            />
          ))}
          {item.reviewCount > 0 && (
            <AppText style={styles.reviewCountText}>
              ({item.reviewCount})
            </AppText>
          )}
        </View>

        {/* Price Section */}
        <View style={styles.priceRow}>
          <AppText style={styles.currentPrice}>
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
}

