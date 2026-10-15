
import {
  View,
  TouchableOpacity,
  Image,
} from "react-native";

import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Flame } from "lucide-react-native";
import { palette } from "../../globaltheme/colors"
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
  onViewCard: (item: Product) => void;
  onWishlist: (item: Product) => void;
  onAddToCart: (item: Product) => void;
};

export const MegaDealsCard = ({
  item,
  wishlist,
  cartItems,
  imageByIndexUrl,
  onViewCard,
  onWishlist,
  onAddToCart,
}: MegaDealsCardProps) => {
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
      onPress={() => onViewCard(item)}
      className="w-[260px] flex-shrink-0"
    >
      {/* Image & Overlay Section */}
      <View className="w-full aspect-[4/5] bg-bgcard overflow-hidden relative">
        {imageSource && (
          <Image
            source={imageSource}
            className={`w-full h-full ${outOfStock ? 'opacity-50' : ''}`}
            resizeMode="cover"
          />
        )}

        {/* Wishlist Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onWishlist(item)}
          className="absolute top-2.5 right-2.5 w-[30px] h-[30px] rounded-full bg-white/[0.95] justify-center items-center z-10 "

        >
          {isWishlist ? (
            <FontAwesome name="heart" size={12} color="#A9803F" />
          ) : (
            <FontAwesome name="heart-o" size={12} color="#7A7365" />
          )}
        </TouchableOpacity>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <View className="absolute top-2.5 left-2.5 flex-row items-center bg-bgbrown px-2.5 py-1 z-20">
            <Flame size={10} color="#FFFFFF" />
            <AppText className="text-white text-[10px] font-semibold tracking-[0.5px]">{discountPercent}% OFF</AppText>
          </View>
        )}

        {/* Sold Out Overlay */}
        {outOfStock && (
          <View className="absolute bottom-0 left-0 right-0 bg-blacktext/90 py-2 items-center z-20">
            <AppText className="text-white text-[10px] font-semibold tracking-[1.4px] uppercase">Sold Out</AppText>
          </View>
        )}

        {/* Add To Cart / Quick Add Button */}
        {!outOfStock && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onAddToCart(item)}
            className="absolute bottom-0 left-0 right-0 bg-white py-3 flex-row items-center justify-center gap-2 z-20"
          >
            {isInCart ? (
              <>
                <Ionicons name="checkmark" size={14} color="#1E1B16" />
                <AppText className="text-blacktext text-[11px] font-semibold tracking-[1px] uppercase">Go to Bag</AppText>
              </>
            ) : (
              <>
                <Ionicons name="bag-outline" size={14} color="#1E1B16" />
                <AppText className="text-blacktext text-[11px] font-semibold tracking-[1px] uppercase">Quick Add</AppText>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Details Section */}
      <View className="pt-3.5">
        {/* Category */}
        <AppText
          style={{ color: palette.WarmBrass }}
          className="text-[10px] font-semibold text-goldtext tracking-[1.4] uppercase my-2"
        >
          {item.category?.name || "Mega Deal"}
        </AppText>

        {/* Product Title */}
        <AppText numberOfLines={1} className="text-base italic text-white leading-[22px]">
          {item.title}
        </AppText>

        {/* Description */}
        <AppText numberOfLines={1} className="text-xs text-lightgoldtext mt-0.5">
          {item.description}
        </AppText>

        {/* Rating */}
        <View className="flex-row items-center mt-2">
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
            <AppText className="text-[10px] text-white ml-1">
              ({item.reviewCount})
            </AppText>
          )}
        </View>

        {/* Price Section */}
        <View className="mt-2 flex-row items-end gap-2">
          <AppText className="text-lg italic text-white">
            ₹{(item.discountPrice || item.price).toLocaleString()}
          </AppText>

          {item.discountPrice && item.discountPrice < item.price && (
            <AppText className="text-xs text-white line-through mt-2">
              ₹{item.price.toLocaleString()}
            </AppText>
          )}
        </View>
      </View>
    </TouchableOpacity>
 
  );
}

