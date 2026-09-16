import  { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons,  } from "@expo/vector-icons"; // Or react-native-vector-icons
import { styles } from "./Checkout.styles";
// RTK Query hooks (Keep these as they are since RTK Query works identically in React Native)
import { useGetProductCategoryQuery } from "../../services/ProductApi";
import { useGetProfileQuery } from "../../services/AuthApi";
import { useGetCartQuery } from "../../services/CartApi";
import { useGetActiveCouponsQuery } from "../../services/CouponApi";
import { useGetMyOrdersQuery } from "../../services/OrderApi";

type PaymentOptions = {
  cod?: boolean;
  online?: boolean;
};

type Product = {
  _id?: string;
  id?: number | string;
  title: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  category?: string;
  description?: string;
  paymentOptions?: PaymentOptions;
};

type Address = {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

type ProfileData = {
  fullName?: string;
  phone?: string;
  email?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
};

type CartItem = {
  _id?: string;
  id?: string | number;
  quantity?: number;
  price?: number;
  discountPrice?: number;
  paymentOptions?: PaymentOptions;
  productId?: {
    _id?: string;
    id?: string | number;
    price?: number;
    discountPrice?: number;
    paymentOptions?: PaymentOptions;
  } | string;
};

export default function Checkout() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params || {}; // Getting ID from React Navigation params

  const { data: logindata, isLoading: profileLoading } = useGetProfileQuery(
    undefined
  ) as {
    data?: ProfileData;
    isLoading: boolean;
  };

  const { data = [], isLoading, isError } = useGetProductCategoryQuery();
  const { data: cartData } = useGetCartQuery();

  const cartItems: CartItem[] = cartData?.items || [];

  const product = data.find(
    (item: Product) => String(item._id || item.id) === String(id)
  );

  const { data: myOrdersData } = useGetMyOrdersQuery(undefined);
  const orders = myOrdersData?.orders || [];

  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [couponError, setCouponError] = useState("");
  const { data: couponData } = useGetActiveCouponsQuery();
  const [couponLoading, setCouponLoading] = useState(false);
  const coupons = couponData?.coupons || [];

  const [address, setAddress] = useState<Address>({
    fullName: "",
    phone: "",
    email: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const Api = process.env.EXPO_PUBLIC_API_URL || ""; // Use Expo or React Native config variables

  const imageByIndexUrl = (productId: string | number, index: number) => {
    return `${Api}/api/${productId}/img/${index}`;
  };

  useEffect(() => {
    // In React Native, token check is usually handled via AsyncStorage
    // Example placeholder: check token logic here
  }, [navigation, id]);

  useEffect(() => {
    if (logindata) {
      setAddress((prev) => ({
        ...prev,
        fullName: logindata.fullName || prev.fullName,
        phone: logindata.phone || prev.phone,
        email: logindata.email || prev.email,
        line1: logindata.address?.line1 || prev.line1,
        city: logindata.address?.city || prev.city,
        state: logindata.address?.state || prev.state,
        pincode: logindata.address?.pincode || prev.pincode,
        country: logindata.address?.country || prev.country || "India",
      }));
    }
  }, [logindata]);

  const isAddressComplete = useMemo(() => {
    return Boolean(
      address.fullName?.trim() &&
        address.phone?.trim() &&
        address.email?.trim() &&
        address.line1?.trim() &&
        address.city?.trim() &&
        address.state?.trim() &&
        address.pincode?.trim() &&
        address.country?.trim()
    );
  }, [address]);

  const currentStep = useMemo(() => {
    if (!isAddressComplete) return 1;
    return 2;
  }, [isAddressComplete]);

  const effectivePrice = useMemo(() => {
    if (!product) return 0;
    return product.discountPrice || product.price;
  }, [product]);

  const originalPrice = useMemo(() => {
    if (!product) return 0;
    return product.price;
  }, [product]);

  const totalAmount = effectivePrice * quantity;

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const subtotal = totalAmount;

    if (appliedCoupon.discountType === "Percentage") {
      let discount = (subtotal * Number(appliedCoupon.discountValue)) / 100;
      if (appliedCoupon.maximumDiscount) {
        discount = Math.min(discount, Number(appliedCoupon.maximumDiscount));
      }
      return Math.min(discount, subtotal);
    }

    if (appliedCoupon.discountType === "Flat") {
      return Math.min(Number(appliedCoupon.discountValue), subtotal);
    }

    return 0;
  }, [appliedCoupon, totalAmount]);

  const finalAmount = Math.max(totalAmount - couponDiscount, 0);

  const discountPercent = useMemo(() => {
    if (!product || !product.price || !product.discountPrice) return 0;
    return Math.round(
      ((product.price - product.discountPrice) / product.price) * 100
    );
  }, [product]);

  const singleProductPaymentOptions = useMemo(() => {
    return {
      cod: Boolean(product?.paymentOptions?.cod),
      online: Boolean(product?.paymentOptions?.online),
    };
  }, [product]);

  const cartPaymentOptions = useMemo(() => {
    if (!cartItems.length) {
      return { cod: false, online: false };
    }
    return {
      cod: cartItems.every((item: any) =>
        Boolean(item.productId?.paymentOptions?.cod || item.paymentOptions?.cod)
      ),
      online: cartItems.every((item: any) =>
        Boolean(
          item.productId?.paymentOptions?.online || item.paymentOptions?.online
        )
      ),
    };
  }, [cartItems]);

  const availablePaymentOptions = useMemo(() => {
    if (cartItems.length > 0) {
      return cartPaymentOptions;
    }
    return singleProductPaymentOptions;
  }, [cartItems.length, cartPaymentOptions, singleProductPaymentOptions]);

  const handlePlaceOrder = async () => {
    if (!isAddressComplete) {
      alert("Please complete address first.");
      return;
    }

    const couponPayload = appliedCoupon
      ? {
          couponId: appliedCoupon._id,
          code: appliedCoupon.code,
          discountType: appliedCoupon.discountType,
          discountValue: Number(appliedCoupon.discountValue),
          discountAmount: couponDiscount,
        }
      : null;

    let payload;

    if (cartItems.length > 0) {
      const cartSubtotal = cartItems.reduce(
        (total: number, item: any) => {
          const price =
            Number(item.productId?.discountPrice) ||
            Number(item.productId?.price) ||
            Number(item.discountPrice) ||
            Number(item.price) ||
            0;
          return total + price * Number(item.quantity || 1);
        },
        0
      );

      let cartCouponDiscount = 0;
      if (appliedCoupon) {
        if (appliedCoupon.discountType === "Percentage") {
          cartCouponDiscount =
            (cartSubtotal * Number(appliedCoupon.discountValue)) / 100;
          if (appliedCoupon.maximumDiscount) {
            cartCouponDiscount = Math.min(
              cartCouponDiscount,
              Number(appliedCoupon.maximumDiscount)
            );
          }
        } else if (appliedCoupon.discountType === "Flat") {
          cartCouponDiscount = Math.min(
            Number(appliedCoupon.discountValue),
            cartSubtotal
          );
        }
        cartCouponDiscount = Math.min(cartCouponDiscount, cartSubtotal);
      }

      const cartFinalAmount = Math.max(cartSubtotal - cartCouponDiscount, 0);

      payload = {
        items: cartItems.map((item: any) => ({
          productId: String(
            item.productId?._id || item.productId || item._id || item.id
          ),
          quantity: Number(item.quantity || 1),
        })),
        address,
        totalAmount: cartFinalAmount,
        coupon: appliedCoupon
          ? {
              couponId: appliedCoupon._id,
              code: appliedCoupon.code,
              discountType: appliedCoupon.discountType,
              discountValue: Number(appliedCoupon.discountValue),
              discountAmount: cartCouponDiscount,
            }
          : null,
      };
    } else {
      const singleFinalAmount = Math.max(totalAmount - couponDiscount, 0);
      payload = {
        items: [
          {
            productId: String(product?._id || product?.id),
            quantity,
          },
        ],
        address,
        totalAmount: singleFinalAmount,
        coupon: couponPayload,
      };
    }

    navigation.navigate("Payment", {
      payload,
      availablePaymentOptions,
    });
  };

  const handleAddress = () => {
    navigation.navigate("ProfileInfo");
  };

  const getApplicableCoupons = () => {
    if (!product) return [];
    return coupons.filter((coupon: any) => {
      if (
        coupon.currentStatus !== "Active" &&
        coupon.currentStatus !== "Upcoming"
      ) {
        return false;
      }
      const productMatch = coupon.products?.some(
        (couponProduct: any) =>
          String(couponProduct?._id || couponProduct) ===
          String(product._id || product.id)
      );
      const categoryMatch = coupon.category?.some(
        (couponCategory: any) =>
          String(couponCategory?._id || couponCategory) ===
          String((product as any).category?._id || (product as any).category)
      );
      const sellerMatch = coupon.sellerId?.some(
        (couponSeller: any) =>
          String(couponSeller?._id || couponSeller) ===
          String((product as any).sellerId?._id || (product as any).sellerId)
      );
      return productMatch || categoryMatch || sellerMatch;
    });
  };

  const applicableCoupons = useMemo(() => {
    return getApplicableCoupons();
  }, [product, coupons]);

  const handleApplyCoupon = async () => {
    setCouponError("");
    const enteredCode = couponCode.trim().toUpperCase();

    if (!enteredCode) {
      setCouponError("Please enter coupon code.");
      return;
    }

    setCouponLoading(true);
    try {
      const coupon = applicableCoupons.find(
        (item: any) => item.code?.toUpperCase() === enteredCode
      );

      if (!coupon) {
        setAppliedCoupon(null);
        setCouponError("This coupon is not valid for this product.");
        return;
      }

      const previousCouponOrders = orders.filter(
        (order: any) => String(order.coupon?.couponId) === String(coupon._id)
      );
      const usedCount = previousCouponOrders.length;

      if (coupon.perUserLimit && usedCount >= Number(coupon.perUserLimit)) {
        setAppliedCoupon(null);
        setCouponError("You have already used this coupon.");
        return;
      }

      if (coupon.minimumOrder && totalAmount < Number(coupon.minimumOrder)) {
        setAppliedCoupon(null);
        setCouponError(
          `Minimum order value should be ₹${Number(
            coupon.minimumOrder
          ).toLocaleString()}`
        );
        return;
      }

      setAppliedCoupon(coupon);
      setCouponSuccess(true);
      setTimeout(() => {
        setCouponSuccess(false);
      }, 3000);
    } catch (error) {
      setCouponError("Unable to apply coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  if (isLoading || profileLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#A9803F" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#1E1B16" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Order Summary</Text>
          </View>

          {/* Progress Stepper */}
          <View style={styles.stepperContainer}>
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  currentStep >= 2
                    ? { borderColor: "#A9803F", borderWidth: 2 }
                    : { borderColor: "#E2D9C4", borderWidth: 1 },
                ]}
              >
                <Text
                  style={[
                    styles.stepText,
                    currentStep >= 2 ? { color: "#A9803F" } : { color: "#9A9282" },
                  ]}
                >
                  {currentStep >= 2 ? "✓" : "1"}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  currentStep === 1 && { fontWeight: "bold", color: "#1E1B16" },
                ]}
              >
                Address
              </Text>
            </View>

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  currentStep >= 2
                    ? { backgroundColor: "#A9803F" }
                    : { backgroundColor: "#fff", borderColor: "#E2D9C4", borderWidth: 1 },
                ]}
              >
                <Text
                  style={[
                    styles.stepText,
                    currentStep >= 2 ? { color: "#fff" } : { color: "#9A9282" },
                  ]}
                >
                  2
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  currentStep === 2 && { fontWeight: "bold", color: "#1E1B16" },
                ]}
              >
                Order Summary
              </Text>
            </View>

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, { borderColor: "#E2D9C4", borderWidth: 1, backgroundColor: "#fff" }]}>
                <Text style={[styles.stepText, { color: "#9A9282" }]}>3</Text>
              </View>
              <Text style={styles.stepLabel}>Payment</Text>
            </View>
          </View>
        </View>

        {/* Shipping Address Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionSubtitle}>Shipping address:</Text>
          {isAddressComplete ? (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.addressName}>{address.fullName}</Text>
              <Text style={styles.addressText}>{address.line1}</Text>
              <Text style={styles.addressText}>
                {address.city}, {address.state}, {address.pincode}
              </Text>
              <Text style={styles.addressText}>{address.country}</Text>
              <View style={styles.phoneRow}>
                {/* <Phone size={16} color="#A9803F" /> */}
                <Text style={styles.phoneText}>{address.phone}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.addressWarningBox}>
              <Text style={styles.warningText}>
                Address not found. Please fill address details first.
              </Text>
              <TouchableOpacity
                onPress={handleAddress}
                style={styles.addressButton}
              >
                <Text style={styles.addressButtonText}>Address</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Product Details Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.productRow}>
            <Image
              source={{
                uri: product.images?.length
                  ? imageByIndexUrl(product._id || product.id || "", 0)
                  : "https://via.placeholder.com/220x220?text=Product",
              }}
              style={styles.productImage}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {product.title}
              </Text>
              
              {/* Pricing */}
              <View style={styles.pricingRow}>
                <Text style={styles.discountBadge}>↓ {discountPercent || 0}%</Text>
                <Text style={styles.originalPriceText}>
                  ₹{originalPrice.toLocaleString()}
                </Text>
                <Text style={styles.effectivePriceText}>
                  ₹{effectivePrice.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Coupon Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Apply Coupon</Text>
          <Text style={styles.subText}>Have a coupon code? Apply it here.</Text>

          <View style={styles.couponInputRow}>
            <TextInput
              value={couponCode}
              onChangeText={(text) => {
                setCouponCode(text.toUpperCase());
                setCouponError("");
              }}
              placeholder="Enter coupon code"
              placeholderTextColor="#9A9282"
              style={styles.textInput}
            />
            <TouchableOpacity
              onPress={handleApplyCoupon}
              disabled={couponLoading}
              style={styles.applyButton}
            >
              <Text style={styles.applyButtonText}>
                {couponLoading ? "Checking..." : "APPLY"}
              </Text>
            </TouchableOpacity>
          </View>

          {couponError ? (
            <Text style={styles.errorTextSmall}>{couponError}</Text>
          ) : null}

          {appliedCoupon && (
            <View style={styles.appliedCouponBox}>
              <View>
                <Text style={styles.appliedCodeText}>
                  🎀 {appliedCoupon.code}
                </Text>
                <Text style={styles.appliedDescText}>
                  {appliedCoupon.discountType === "Percentage"
                    ? `${appliedCoupon.discountValue}% OFF`
                    : `₹${appliedCoupon.discountValue} OFF`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setAppliedCoupon(null);
                  setCouponCode("");
                  setCouponError("");
                }}
              >
                <Text style={styles.removeText}>REMOVE</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Success Modal */}
          <Modal visible={couponSuccess && Boolean(appliedCoupon)} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Coupon Applied Successfully!</Text>
                <Text style={styles.modalSub}>Your coupon has been applied to this order.</Text>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>

      {/* Sticky Bottom Footer */}
      <View style={styles.footerContainer}>
        <View style={styles.footerInner}>
          <View>
            <Text style={styles.footerSubText}>Total Amount:</Text>
            <Text style={styles.footerPrice}>₹{finalAmount.toLocaleString()}</Text>
          </View>
          <TouchableOpacity
            onPress={handlePlaceOrder}
            disabled={!isAddressComplete || isLoading}
            style={[
              styles.placeOrderButton,
              (!isAddressComplete || isLoading) && { backgroundColor: "#D9CFB8" },
            ]}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

