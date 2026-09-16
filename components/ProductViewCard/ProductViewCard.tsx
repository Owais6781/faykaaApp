
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
import { styles, } from "./ProductViewCard.styles"
import SuggestedProducts  from "../SuggestionProduct/SuggestionProduct"
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
} from "lucide-react-native";

import { useGetProductCategoryQuery } from "../../services/ProductApi";
import { useGetReviewsQuery } from "../../services/ReviewApi";
import { useAddToCartDbMutation } from "../../services/CartApi";
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

export default function ProductViewCard() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id = route.params?.productId;
  const Api = process.env.EXPO_PUBLIC_API_URL || "";

  const [showReviews, setShowReviews] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const { data: couponData } = useGetActiveCouponsQuery();
  const coupons = couponData?.coupons || [];

  const { data, isLoading, isError } = useGetProductCategoryQuery();
  const { data: reviewData } = useGetReviewsQuery(id, {
    skip: !id,
  });

  const [addToCartDb] = useAddToCartDbMutation();

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

  const handleAddToCart = async (item: ProductFromApi) => {
    const itemKey = String(item._id || item.id);
    if (!item._id && !item.id) return;

    if (cartItems.includes(itemKey)) {
      navigation.navigate("Cart");
      return;
    }

    try {
      await addToCartDb({
        productId: String(item._id || item.id),
        quantity: 1,
      }).unwrap();
      setCartItems((prev) => [...prev, itemKey]);
    } catch (error) {
      console.log(error);
    }
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

  if (!id) {
    return (
      <View style={styles.centerContainerDark}>
        <View style={styles.errorBox}>
          <AlertCircle size={40} color="#c9736c" />
          <Text style={styles.errorTitle}>Invalid Route</Text>
          <Text style={styles.errorSub}>Product ID is missing</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7B2D26" />
        <Text style={styles.loadingText}>Loading Products...</Text>
      </View>
    );
  }

  if (isError || !currentProduct) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { }}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Image Zoom Modal */}
      <Modal visible={isImageZoomed} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeModalBtn}
            onPress={() => setIsImageZoomed(false)}
          >
            <X size={24} color="#FBF7F0" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalArrowLeft} onPress={prevImage}>
            <ChevronLeft size={24} color="#FBF7F0" />
          </TouchableOpacity>

          <Image
            source={{
              uri: product?._id ? imageByIndexUrl(product._id, selectedImageIndex) : "",
            }}
           style={styles.zoomedImage}
            resizeMode="contain"
          />

          <TouchableOpacity style={styles.modalArrowRight} onPress={nextImage}>
            <ChevronRight size={24} color="#FBF7F0" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Main Image View */}
      <View style={styles.imageMainContainer}>
        {existingImages.length > 0 ? (
          <>
            <TouchableOpacity activeOpacity={0.9} onPress={() => setIsImageZoomed(true)}>
              <Image
                source={{
                  uri: product?._id ? imageByIndexUrl(product._id, selectedImageIndex) : "",
                }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.zoomIconBtn}
              onPress={() => setIsImageZoomed(true)}
            >
              <ZoomIn size={22} color="#2B2420" />
            </TouchableOpacity>

            {formData.discountPrice &&
              parseFloat(formData.discountPrice) < parseFloat(formData.price) && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>{calculateDiscount()}% OFF</Text>
                </View>
              )}
          </>
        ) : (
          <View style={styles.noImageView}>
            <ImageIcon size={64} color="#8C8377" />
            <Text style={styles.noImageText}>No images available</Text>
          </View>
        )}
      </View>

      {/* Thumbnails */}
      {existingImages.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbScroll}>
          {existingImages.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImageIndex(index)}
              style={[
                styles.thumbBtn,
                index === selectedImageIndex && styles.selectedThumbBtn,
              ]}
            >
              <Image
                source={{
                  uri: product?._id ? imageByIndexUrl(product._id, index) : "",
                }}
                style={styles.thumbImage}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Product Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.categoryText}>{formData.category || "Latest Collection"}</Text>
        <Text style={styles.productTitle}>{formData.title || "Untitled Product"}</Text>

        <View style={styles.priceContainer}>
          {formData.discountPrice &&
            parseFloat(formData.discountPrice) < parseFloat(formData.price) ? (
            <>
              <Text style={styles.salePrice}>
                Rs {parseFloat(formData.discountPrice).toLocaleString()}
              </Text>
              <Text style={styles.originalPrice}>
                Rs {parseFloat(formData.price).toLocaleString()}
              </Text>
            </>
          ) : (
            <Text style={styles.normalPrice}>
              Rs {parseFloat(formData.price || "0").toLocaleString()}
            </Text>
          )}
        </View>

        {/* Coupons */}
        {productCoupons.length > 0 && (
          <View style={styles.couponGrid}>
            {productCoupons.slice(0, 4).map((coupon: any) => (
              <View key={coupon._id} style={styles.couponCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.couponDiscountText}>
                    {coupon.discountType === "Percentage"
                      ? `EXTRA ${coupon.discountValue}% OFF`
                      : `EXTRA ₹${coupon.discountValue} OFF`}
                  </Text>
                  <Text style={styles.couponCodeText}>Code: {coupon.code}</Text>
                </View>
                <TouchableOpacity
                  style={styles.copyBtn}
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

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.cartBtn,
              cartItems.includes(product?._id || "") && styles.cartBtnActive,
            ]}
            onPress={() => product && handleAddToCart(product)}
          >
            <Text style={styles.cartBtnText}>
              {cartItems.includes(product?._id || "") ? "Go to Bag" : "Quick Add"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buyNowBtn}
            onPress={() => currentProduct && handleBuyNow(currentProduct)}
          >
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>

        {/* Customer Reviews Dropdown Header */}
        <TouchableOpacity
          style={styles.reviewDropdown}
          onPress={() => setShowReviews(!showReviews)}
        >
          <Text style={styles.reviewHeaderTitle}>Customer Reviews</Text>
          <ChevronDown size={20} color="#A9803F" />
        </TouchableOpacity>

        {showReviews && (
          <View style={styles.reviewsList}>
            {reviewData?.reviews?.length > 0 ? (
              reviewData.reviews.map((item: any) => (
                <View key={item._id} style={styles.reviewCard}>
                  <Text style={styles.reviewUser}>{item.userName || "User"}</Text>
                  <Text style={styles.reviewComment}>{item.comment}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviewText}>No reviews yet.</Text>
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








