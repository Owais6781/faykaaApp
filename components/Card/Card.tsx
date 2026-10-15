
import { View, TouchableOpacity, Image, } from "react-native";
import { AppText } from "../FontProvider/FontProvider";

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
  reviewCount?: number;
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
      className="w-[48%] mb-5 bg-cream"
    >
      <View className="relative aspect-[4/5] bg-[#EFEAE0] overflow-hidden">
        <Image
          source={{ uri: imageSrc }}
          className={`w-full h-full ${outOfStock ? "opacity-50" : ""}`}
          resizeMode="cover"
        />

        {/* Wishlist Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation?.();
            onWishlist();
          }}
          className="absolute top-2.5 right-2.5 w-[30px] h-[30px] bg-white/[0.95] justify-center items-center z-10 "
        >
          <Heart
            size={12}
            color={isWishlist ? "#A9803F" : "#7A7365"}
            fill={isWishlist ? "#A9803F" : "transparent"}
          />
        </TouchableOpacity>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <View className="absolute top-2.5 left-2.5 bg-bgbrown px-2 py-1 z-10">
            <AppText className="text-textcream text-[10px] font-semibold">
              {discountPercent}% OFF
            </AppText>
          </View>
        )}

        {/* Coupon Ribbon Banner */}
        {productCoupons.length > 0 && (
          <View className="absolute bottom-[42px] left-0 right-0 flex-row items-center justify-center py-[5px] px-[6px] border-t border-b border-[#F5C6D8]/40 z-20 gap-1 ">
            <AppText className="text-[10px]">🎀</AppText>
            <AppText className="text-[9px] font-bold text-Couponstext">
              {productCoupons[0].discountType === "Percentage"
                ? `EXTRA ${productCoupons[0].discountValue}% OFF`
                : `EXTRA ₹${productCoupons[0].discountValue} OFF`}
            </AppText>
            <AppText className="text-[9px] text-blacktext">
              {productCoupons[0].code}
            </AppText>

            {onCopyCoupon && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={(e) => {
                  e.stopPropagation?.();
                  onCopyCoupon(productCoupons[0].code);
                }}
                className="border border-Couponstext rounded-[3px] px-1 py-[0.5px] bg-white justify-center items-center"
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
          <View className="absolute bottom-0 left-0 right-0 bg-blacktext/90 py-2.5 items-center z-10">
            <AppText className="text-textcream text-[10px] font-semibold tracking-[1.4] uppercase">
              Sold Out
            </AppText>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={(e) => {
              e.stopPropagation?.();
              onAddToCart();
            }}
            className="absolute bottom-0 left-0 right-0 bg-white flex-row items-center justify-center py-2.5 z-10"
          >
            {isInCart ? (
              <>
                <Check size={14} className="text-blacktext" style={{ marginRight: 6 }} />
                <AppText className="text-blacktext text-[11px] font-semibold tracking-[1] uppercase">
                  Go to Bag
                </AppText>
              </>
            ) : (
              <>
                <ShoppingBag size={14} className="text-blacktext" style={{ marginRight: 6 }} />
                <AppText className="text-blacktext text-[11px] font-semibold tracking-[1] uppercase">
                  Quick Add
                </AppText>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Details Section */}
      <View className="pt-2.5 bg-cream">
        <AppText className="text-[10px] font-semibold text-goldtext tracking-[1.4] uppercase mb-1">
          {item.category?.name || "Collection"}
        </AppText>

        <AppText  className="text-[14px] text-blacktext" numberOfLines={1}>
          {item.title}
        </AppText>

        {item.description && (
          <AppText className="text-[11px] text-descriptiongraytext mt-0.5" numberOfLines={1}>
            {item.description}
          </AppText>
        )}

        {item.color && (
          <AppText className="text-[11px] text-[#B3AB97] mt-0.5">
            Color: {item.color}
          </AppText>
        )}

        {item.rating != null && (
          <View className="flex-row items-center mt-1.5">
            {[...Array(5)].map((_, i) => {
              const filled = i < Math.floor(item.rating || 0);
              return (
                <Star
                  key={i}
                  size={12}
                  color={filled ? "#A9803F" : "#E2D9C4"}
                  fill={filled ? "#A9803F" : "transparent"}
                  style={{ marginRight: 2 }}
                />
              );
            })}
            {(item?.reviewCount ?? 0) > 0 && (
              <AppText className="text-[10px] text-graytextcolor ml-1">
                ({item?.reviewCount || 0})
              </AppText>
            )}
          </View>
        )}

        <View className="flex-row items-baseline mt-1.5 gap-2">
          <AppText className="text-[15px] font-bold text-blacktext">
            ₹{(item.discountPrice || item.price).toLocaleString()}
          </AppText>
          {item.discountPrice && item.discountPrice < item.price && (
            <AppText className="text-[11px] text-graytextcolor line-through">
              ₹{item.price.toLocaleString()}
            </AppText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

