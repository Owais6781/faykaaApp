
import { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  
} from "react-native";

import { SuggestedProducts } from "../SuggestionProduct/SuggestionProduct"
import { useNavigation, useRoute } from "@react-navigation/native";
import {

  ImageIcon,
  Check,
  Copy,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  ChevronDown,
  Star,
  RotateCcw,
  Shield,
  Award,
} from "lucide-react-native";
import { Ionicons } from '@expo/vector-icons';
import { useCart } from "../../services/Hooks/useCart";
import { useGetProductCategoryQuery } from "../../services/ProductApi";
import { useGetReviewsQuery } from "../../services/ReviewApi";
import { useGetActiveCouponsQuery } from "../../services/CouponApi";

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
  id?: number;
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

export const ProductViewCard = () => {

  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id = route.params?.productId;
  const Api = process.env.EXPO_PUBLIC_API_URL || "";

  const [showReviews, setShowReviews] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const { data: couponData } = useGetActiveCouponsQuery();
  const coupons = couponData?.coupons || [];

  const { data, } = useGetProductCategoryQuery();
  const { data: reviewData } = useGetReviewsQuery(id, {
    skip: !id,
  });


  const product: ProductFromApi | undefined = useMemo(() => {
    if (!data || !id) return undefined;
    const payload: any = (data as any)?.data ?? data;

    if (Array.isArray(payload)) {
      return payload.find((p: any) => String(p?._id) === String(id));
    }
    if (payload && String(payload?._id) === String(id)) return payload;
    const maybeArray = payload?.data;
    if (Array.isArray(maybeArray)) {
      return maybeArray.find((p: any) => String(p?._id) === String(id));
    }
    return undefined;
  }, [data, id]);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    stock: "",
    price: "",
    discountPrice: "",
    rating: "",
  });

  const [cartItems, setCartItems] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const imageByIndexUrl = (productId: string, index: number) =>
    `${Api}/api/${productId}/img/${index}`;

  useEffect(() => {
    if (!product) return;

    setFormData({
      category: product.category?.name || "",
      title: product.title || "",
      description: product.description || "",
      stock: product.stock != null ? String(product.stock) : "",
      price: product.price != null ? String(product.price) : "",
      discountPrice: product.discountPrice != null ? String(product.discountPrice) : "",
      rating: String(product.rating ?? 0),
    });

    const imgs = Array.isArray(product.images)
      ? product.images.map((x: any) => (typeof x === "string" ? x : x?._id || String(x)))
      : [];

    setExistingImages(imgs);
    setSelectedImageIndex(0);
  }, [product]);

  const calculateDiscount = () => {
    if (formData.price && formData.discountPrice) {
      const original = parseFloat(formData.price);
      const discount = parseFloat(formData.discountPrice);
      if (!original || discount >= original) return "0";
      const percentage = ((original - discount) / original) * 100;
      return percentage.toFixed(0);
    }
    return "0";
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev < existingImages.length - 1 ? prev + 1 : 0));
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : existingImages.length - 1));
  };

 

  const allproduct: ProductFromApi[] = Array.isArray(data)
    ? data
    : (data as any)?.data && Array.isArray((data as any).data)
      ? (data as any).data
      : [];

  const currentProduct = useMemo(() => {
    return allproduct.find((item) => String(item._id || item.id) === String(id));
  }, [allproduct, id]);

  const handleBuyNow = (product: ProductFromApi) => {
    navigation.navigate("Checkout", { productId: product._id || product.id });
  };

  const visibleCoupons = coupons.filter(
    (coupon: any) => coupon.currentStatus === "Active" || coupon.currentStatus === "Upcoming"
  );

  const getProductCoupons = (prod: any) => {
    return visibleCoupons.filter((coupon: any) => {
      const productMatch = coupon.products?.some(
        (cp: any) => cp._id?.toString() === prod._id?.toString()
      );
      const categoryMatch = coupon.category?.some(
        (cc: any) => cc._id?.toString() === prod.category?._id?.toString()
      );
      const sellerMatch = coupon.sellerId?.some(
        (cs: any) => cs._id?.toString() === prod.sellerId?._id?.toString()
      );
      return productMatch || categoryMatch || sellerMatch;
    });
  };

  const productCoupons = currentProduct ? getProductCoupons(currentProduct) : [];

  const copyCoupon = async (code: string) => {
    try {
      setCopiedCoupon(code);
      setTimeout(() => setCopiedCoupon(null), 2000);
    } catch (error) {
      console.error(error);
    }
  };


  const { handleAddToCart } = useCart();

  if (!id) {
    return (
      <View className="flex-1 justify-center items-center bg-espresso">
        <View className="p-5 items-center">
          <AlertCircle size={40} color="#c9736c" />
          <Text className="text-cream text-lg font-bold mt-2.5">Invalid Route</Text>
          <Text className="text-brass text-sm mt-1.25">Product ID is missing</Text>
          <TouchableOpacity className="mt-5 bg-cream py-2.5 px-5" onPress={() => navigation.goBack()}>
            <Text className="text-espresso font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  return (
    <ScrollView className="flex-1 bg-cream mt-[50px] pb-10" >
      {/* Image Zoom Modal */}
      <Modal visible={isImageZoomed} transparent animationType="fade">
        <View className="flex-1 bg-[#2B2432]/95 justify-center items-center">
          <TouchableOpacity
            className="absolute top-10 right-5 p-2.5"
            onPress={() => setIsImageZoomed(false)}
          >
            <X size={24} color="#FBF7F0" />
          </TouchableOpacity>

          <TouchableOpacity className="absolute left-5" onPress={prevImage}>
            <ChevronLeft size={24} color="#FBF7F0" />
          </TouchableOpacity>

          <Image
            source={{
              uri: product?._id ? imageByIndexUrl(product._id, selectedImageIndex) : "",
            }}
            className="w-[90vw] h-[90vw]"
            resizeMode="contain"
          />

          <TouchableOpacity className="absolute right-5" onPress={nextImage}>
            <ChevronRight size={24} color="#FBF7F0" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Main Image View */}
      <View className="relative w-full aspect-square bg-[#EFE8DA]">
        {existingImages.length > 0 ? (
          <>
            <TouchableOpacity activeOpacity={0.9} onPress={() => setIsImageZoomed(true)}>
              <Image
                source={{
                  uri: product?._id ? imageByIndexUrl(product._id, selectedImageIndex) : "",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="absolute top-[15px] right-[15px] bg-cream p-2 rounded-[20px]"
              onPress={() => setIsImageZoomed(true)}
            >
              <ZoomIn size={22} color="#2B2420" />
            </TouchableOpacity>

            {formData.discountPrice &&
              parseFloat(formData.discountPrice) < parseFloat(formData.price) && (
                <View className="absolute top-[15px] left-[15px] bg-bgbrown px-2 py-1">
                  <Text className="text-cream text-xs font-bold">{calculateDiscount()}% OFF</Text>
                </View>
              )}
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <ImageIcon size={64} color="#8C8377" />
            <Text className="text-warm-gray mt-2">No images available</Text>
          </View>
        )}
      </View>

      {/* Thumbnails */}
      {existingImages.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-[10px] px-[10px]">
          {existingImages.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImageIndex(index)}

              className={`w-[60px] h-[60px] mr-[8px] border
                 ${index === selectedImageIndex
                  ? "border-brass border-2"
                  : "border-[#ccc] border-[1px]"}`}
            >
              <Image
                source={{
                  uri: product?._id ? imageByIndexUrl(product._id, index) : "",
                }}
                className="w-full h-full"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Product Details Section */}
      <View className="p-[15px]">
        <Text className="text-xs text-brass font-semibold uppercase">{formData.category || "Latest Collection"}</Text>
        <Text className="text-[22px] font-bold text-espresso my-[6px]">{formData.title || "Untitled Product"}</Text>
        {/* Ratings */}
        <View className="flex-row items-center gap-1">
          {[...Array(5)].map((_, i) => {
            const filled = i < Math.floor(product?.rating || 0);
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
          {(product?.reviewCount ?? 0) > 0 && (
            <Text className="text-sm text-[#B3AB97] ml-1">
              ({product?.reviewCount})
            </Text>
          )}
        </View>
        <View className="flex-row items-center my-2">
          {formData.discountPrice &&
            parseFloat(formData.discountPrice) < parseFloat(formData.price) ? (
            <>
              <Text className="text-[22px] font-bold text-bgbrown mr-[10px]">
                Rs {parseFloat(formData.discountPrice).toLocaleString()}
              </Text>
              <Text className="text-base text-warm-gray line-through">
                Rs {parseFloat(formData.price).toLocaleString()}
              </Text>
              <View className="bg-espresso/[0.05] px-[10px] py-[4px] border border-warm-gray/30 self-start ml-[12px]">
                <Text className="text-xs text-espresso font-semibold">
                  Save Rs{" "}{(
                    parseFloat(formData.price) -
                    parseFloat(formData.discountPrice)
                  ).toLocaleString()}
                </Text>
              </View>
            </>
          ) : (
            <Text className="text-[22px] font-bold text-espresso">
              Rs {parseFloat(formData.price || "0").toLocaleString()}
            </Text>
          )}
        </View>

        {/* Coupons */}
        {productCoupons.length > 0 && (
          <View className="flex-row flex-wrap gap-2 my-[10px]">
            {productCoupons.slice(0, 4).map((coupon: any) => (
              <View key={coupon._id} className="w-[48%] bg-[#FDF0F5] border border-[#F5C6D8] p-2 flex-row items-center rounded-[6px]">
                <View style={{ flex: 1 }}>
                  <Text className="text-[10px] font-bold text-Couponstext">
                    {coupon.discountType === "Percentage"
                      ? `EXTRA ${coupon.discountValue}% OFF`
                      : `EXTRA ₹${coupon.discountValue} OFF`}
                  </Text>
                  <Text className="text-[9px] text-[#777] mt-[2px]">Code: {coupon.code}</Text>
                </View>
                <TouchableOpacity
                  className="p-[4px] bg-white border border-Couponstext rounded-[4px]"
                  onPress={() => copyCoupon(coupon.code)}
                >
                  {copiedCoupon === coupon.code ? (
                    <Check size={12} color="#E84C7F" />
                  ) : (
                    <Copy size={12} color="#E84C7F" />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View className="flex-row flex-wrap items-center gap-3">
          {parseInt(formData.stock) > 5 ? (
            <View className="flex-row items-center gap-2 px-3 py-2 bg-[#4A5D46]/[0.1]">
              <Ionicons name="checkmark" size={18} color="#4A5D46" />
              <Text className="text-sm font-medium text-[#4A5D46]">
                In Stock ({formData.stock} units)
              </Text>
            </View>
          ) : parseInt(formData.stock) > 0 ? (
            <View className="flex-row items-center gap-2 px-3 py-2 bg-brass/15">
              <Ionicons name="alert-circle-outline" size={18} color="#8a6a3a" />
              <Text className="text-sm font-medium text-[#8a6a3a]">
                Low Stock (Only {formData.stock} left)
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-2 px-3 py-2 bg-bgbrown/10">
              <Ionicons name="close" size={18} color="#7B2D26" />
              <Text className="text-sm font-medium text-bgbrown">
                Out of Stock
              </Text>
            </View>
          )}
        </View>



        {/* Action Buttons */}
        <View className="flex-row gap-2.5 my-[15px]">
          <TouchableOpacity
            className={`
              flex-1 border py-3 items-center justify-center
              ${cartItems.includes(product?._id || "")
                ? "bg-[#7B2D26]/10 text-[#7B2D26] border border-[#7B2D26]/40"
                : "bg-transparent text-[#2B2420] border border-[#2B2420] "
              }`}
            onPress={() => product && handleAddToCart(product, cartItems, setCartItems )}
          >
            <Text className="text-espresso font-bold text-sm">
              {cartItems.includes(product?._id || "") ? "Go to Bag" : "Quick Add"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-bgbrown py-3 items-center justify-center"
            onPress={() => currentProduct && handleBuyNow(currentProduct)}
          >
            <Text className="text-cream font-bold text-sm">Buy Now</Text>
          </TouchableOpacity>
        </View>

        {/* Product Features Section */}
        <View className="flex-row flex-wrap border-t border-b border-[rgba(140,131,119,0.25)] py-1.5 justify-between">
          {/* Feature 1: Easy Returns */}
          <View className="w-[48%] items-center gap-2 p-0.5">
            <View className="h-[25px] w-[25px] rounded-[22px] items-center justify-center bg-[rgba(176,141,87,0.15)]">
              <RotateCcw size={20} color="#B08D57" />
            </View>
            <View className="items-center">
              <Text className="text-sm font-semibold text-espresso text-center">Easy Returns</Text>
              <Text
                className={`text-xs  text-center
                  ${product?.returnPolicy?.isReturnable ? "text-[#4A5D46]" : "text-bgbrown"}`}
              >
                {product?.returnPolicy?.policyText || 'Not Available'}
              </Text>
            </View>
          </View>

          {/* Feature 2: COD / Payment Options */}
          <View className="w-[48%] items-center gap-2 p-[2px]">
            <View className="h-[25px] w-[25px] rounded-[22px] items-center justify-center bg-bgbrown/10">
              <Text className="text-lg font-bold text-bgbrown">₹</Text>
            </View>
            <View className="items-center">
              <Text
                className={`text-sm font-semibold text-center${product?.paymentOptions?.cod ? '#4A5D46' : '#7B2D26'}`}
              >
                {`COD ${product?.paymentOptions?.cod ? 'Available' : 'Not Available'}`}
              </Text>
              <Text

                className={`text-xs text-center ${product?.paymentOptions?.online ? '#2B2420' : '#7B2D26'}`}
              >
                {`Online ${product?.paymentOptions?.online ? 'Available' : 'Not Available'}`}
              </Text>
            </View>
          </View>

          {/* Feature 3: Secure Payment */}
          <View className="w-[48%] items-center gap-2 p-[2px]">
            <View className="h-[25px] w-[25px] rounded-[22px] items-center justify-center  bg-[#4A5D46]/10">
              <Shield size={20} color="#4A5D46" />
            </View>
            <View className="items-center">
              <Text className="text-sm font-semibold text-center text-espresso">Secure Payment</Text>
              <Text className="text-xs text-center text-warm-gray">100% Protected</Text>
            </View>
          </View>

          {/* Feature 4: Quality Assured */}
          <View className="w-[48%] items-center gap-2 p-[2px]">

            <View className="h-[25px] w-[25px] rounded-[22px] items-center justify-center bg-brass/10">
              <Award size={20} color="#B08D57" />
            </View>
            <View className="items-center">
              <Text className="text-sm font-semibold text-center text-espresso">Quality Assured</Text>
              <Text className="text-xs text-center text-warm-gray">Verified Products</Text>
            </View>
          </View>
        </View>



        {/* Customer Reviews Dropdown Header */}
        <TouchableOpacity
          className="flex-row justify-between items-center bg-[#EFEAE0] p-3 rounded-md mt-2.5"
          onPress={() => setShowReviews(!showReviews)}
        >
          <Text className="text-base font-bold text-[#1E1B16]">Customer Reviews</Text>
          <ChevronDown size={20} color="#A9803F" />
        </TouchableOpacity>

        {showReviews && (
          <View className="mt-2.5 gap-2.5">
            {reviewData?.reviews?.length > 0 ? (
              reviewData.reviews.map((item: any) => (
                <View key={item._id} className="bg-white p-3 border border-[#E2D9C4]">
                  <Text className="font-bold text-xs text-[#1E1B16]">{item.userName || "User"}</Text>
                  <Text className="text-xs text-[#555] mt-1">{item.comment}</Text>
                </View>
              ))
            ) : (
              <Text className="text-xs text-warm-gray italic text-center p-2.5">No reviews yet.</Text>
            )}
          </View>
        )}
      </View>
      {currentProduct && (
        <SuggestedProducts
          currentProduct={currentProduct}
          allProducts={allproduct}
          activeCoupons={visibleCoupons}
        />
      )}
    </ScrollView>
  );

}








