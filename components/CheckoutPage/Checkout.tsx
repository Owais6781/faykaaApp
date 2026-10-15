import { useEffect, useMemo, useState,useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,

  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from '@expo/vector-icons';
import { Star } from "lucide-react-native";
import { skipToken } from "@reduxjs/toolkit/query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute, } from "@react-navigation/native";
import { Ionicons, } from "@expo/vector-icons"; // Or react-native-vector-icons

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
  rating?: number;
  reviewCount?: number;
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



export const Checkout = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { productId } = route.params || {}; // Getting ID from React Navigation params
  const [token, setToken] = useState<string | null>(null);


  const { data: logindata, } = useGetProfileQuery(
    token ? undefined : skipToken
  ) as {
    data?: ProfileData;
    isLoading: boolean;
  };





  const { data = [], isLoading, isError } = useGetProductCategoryQuery();
  const { data: cartData } = useGetCartQuery();

  const cartItems: CartItem[] = cartData?.items || [];

  const products: Product[] = Array.isArray(data)
    ? data
    : [];


  products.forEach((item: Product, index: number) => {
  });

  const product = products.find(
    (item: Product) =>
      String(item._id) === String(productId) ||
      String(item.id) === String(productId)
  );


  const { data: myOrdersData } = useGetMyOrdersQuery(undefined);
  const orders = myOrdersData?.orders || [];
  const [visible, setVisible] = useState(false);
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
  const quantities = [1, 2, 3, 4, 5];

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          navigation.replace("LogInPage");
        }
      } catch (error) {
        console.log("Token check error:", error);
      }
    };

    checkToken();
  }, [navigation, productId]);



  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);
      } catch (error) {
        console.log("Failed to load data from AsyncStorage", error);
      }
    };

    loadToken();
  }, []);






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

    navigation.navigate("PaymentGateway", {
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
      // 🔥 PER USER LIMIT CHECK
      // if (!coupon.perUserLimit && usedCount >= Number(coupon.perUserLimit)) {
      //   setAppliedCoupon(null);
      //   setCouponError("You have already used this coupon.");
      //   return;
      // }

      if (
        coupon.perUserLimit &&
        usedCount >= Number(coupon.perUserLimit)
      ) {
        setAppliedCoupon(null);

        setCouponError(
          "You have already used this coupon."
        );

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






  if (isError || !product) {
    return (
      <View className="w-full flex-1 items-center justify-center bg-[#F8F5EF]">
        <Text className="text-[16px] text-[#1E1B16]">
          Product not found.
        </Text>
      </View>
    );
  }


  return (
    <SafeAreaView className="flex-1 bg-bgcream ">

      <ScrollView
       contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="bg-white border-b border-textcolor p-4">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} className="text-blacktext " />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-blacktext ml-3">Order Summary</Text>
          </View>

          {/* Progress Stepper */}
          <View className="flex-row justify-between mt-5">
            {/* Step 1 */}
            <View className="items-center flex-1">
              <View
                className={`w-9 h-9 rounded-full justify-center items-center bg-white ${currentStep >= 2
                  ? "border-2 border-goldtext"
                  : "border border-textcolor"
                  }`}
              >
                <Text
                  className={`text-sm font-bold ${currentStep >= 2 ? "text-goldtext" : "text-lightgoldtext"
                    }`}
                >
                  {currentStep >= 2 ? "✓" : "1"}
                </Text>
              </View>
              <Text
                className={`text-xs text-lightgoldtext mt-1 ${currentStep === 1 ? "font-bold text-blacktext" : ""
                  }`}
              >
                Address
              </Text>
            </View>

            {/* Step 2 */}
            <View className="items-center flex-1">
              <View
                className={`w-9 h-9 rounded-full justify-center items-center ${currentStep >= 2
                  ? "bg-goldtext"
                  : "bg-white border border-textcolor"
                  }`}
              >
                <Text
                  className={`text-sm font-bold ${currentStep >= 2 ? "text-white" : "text-lightgoldtext"
                    }`}
                >
                  2
                </Text>
              </View>
              <Text
                className={`text-xs text-lightgoldtext mt-1 ${currentStep === 2 ? "font-bold text-blacktext" : ""
                  }`}
              >
                Order Summary
              </Text>
            </View>

            {/* Step 3 */}
            <View className="items-center flex-1">
              <View className="w-9 h-9 rounded-full justify-center items-center bg-white border border-textcolor">
                <Text className="text-sm font-bold text-lightgoldtext">3</Text>
              </View>
              <Text className="text-xs text-lightgoldtext mt-1">Payment</Text>
            </View>
          </View>
        </View>

        {/* Shipping Address Section */}
        <View className="bg-white mt-2 p-4">
          <Text className="text-sm text-lightgoldtext font-semibold">Shipping address:</Text>
          {isAddressComplete ? (
            <View className="mt-3">
              <Text className="text-lg font-bold text-blacktext">{address.fullName}</Text>
              <Text className="text-sm text-blacktext mt-0.5">{address.line1}</Text>
              <Text className="text-sm text-blacktext mt-0.5">
                {address.city}, {address.state}, {address.pincode}
              </Text>
              <Text className="text-sm text-blacktext mt-0.5">{address.country}</Text>
              <View className="flex-row items-center gap-1.5 mt-1.5">
                <Text className="text-sm text-blacktext font-semibold">{address.phone}</Text>
              </View>
            </View>
          ) : (
            <View className="bg-bgcard p-3 rounded-lg mt-2 flex-row justify-between items-center">
              <Text className="text-goldtext text-xs flex-1 font-semibold">
                Address not found. Please fill address details first.
              </Text>
              <TouchableOpacity
                onPress={handleAddress}
                className="bg-blacktext px-3 py-2 rounded-md"
              >
                <Text className="text-white font-bold text-xs">Address</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Product Details Section */}
        <View className="bg-white mt-2 p-4">
          <View className="flex-row items-center">
            <Image
              source={{
                uri: product.images?.length
                  ? imageByIndexUrl(product._id || product.id || "", 0)
                  : "https://via.placeholder.com/220x220?text=Product",
              }}
              className="w-20 h-20 bg-bgcard rounded-lg"
              resizeMode="contain"
            />


            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-blacktext" numberOfLines={2}>
                {product.title}
              </Text>

              {product.rating != null && (
                <View className="flex-row items-center mt-1.5">
                  {[...Array(5)].map((_, i) => {
                    const filled = i < Math.floor(product?.rating || 0);
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
                  {(product?.reviewCount ?? 0) > 0 && (
                    <Text className="text-[10px] text-graytextcolor ml-1">
                      ({product?.reviewCount || 0})
                    </Text>
                  )}
                </View>
              )}

              {/* Pricing */}
              <View className="flex-row items-center gap-2 mt-2">
                <Text className="text-goldtext font-bold text-sm">↓ {discountPercent || 0}%</Text>
                <Text className="text-graytextcolor line-through text-sm">
                  ₹{originalPrice.toLocaleString()}
                </Text>
                <Text className="text-blacktext font-bold text-lg">
                  ₹{effectivePrice.toLocaleString()}
                </Text>
              </View>

            </View>
          </View>

          <View className="mt-4 relative w-full max-w-[65px]">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setVisible(true)}
              className="w-full   flex-row justify-between items-center rounded-lg border-2 border-textcolor bg-white px-2 py-2"
            >
              <Text className="text-sm text-blacktext">
                Qty: {quantity}
              </Text>
              <Feather
                name="chevron-down"
                size={16}
                color="#A9803F"
              />
            </TouchableOpacity>

            <Modal
              visible={visible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setVisible(false)}
            >
              <TouchableOpacity
                className="flex-1 bg-black/20 justify-center items-center"
                activeOpacity={1}
                onPress={() => setVisible(false)}
              >
                <View className="w-[150px] bg-white rounded-lg border-2 border-textcolor overflow-hidden">
                  <FlatList
                    data={quantities}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="py-3 px-4 border-b border-[#F0EBE1]"
                        onPress={() => {
                          setQuantity(item);
                          setVisible(false);
                        }}
                      >
                        <Text className="text-lg text-blacktext">
                          Qty: {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        </View>





        {/* Coupon Section */}
        <View className="bg-white mt-2 p-4">
          <Text className="text-lg font-bold text-blacktext">Apply Coupon</Text>
          <Text className="text-xs text-lightgoldtext mt-0.5">Have a coupon code? Apply it here.</Text>

          <View className="flex-row mt-2.5 gap-2">
            <TextInput
              value={couponCode}
              onChangeText={(text) => {
                setCouponCode(text.toUpperCase());
                setCouponError("");
              }}
              placeholder="Enter coupon code"
              placeholderTextColor="#9A9282"
              className="flex-1 border border-textcolor rounded-lg px-3 h-11 bg-white text-blacktext"
            />
            <TouchableOpacity
              onPress={handleApplyCoupon}
              disabled={couponLoading}
              className="bg-blacktext justify-center px-4 rounded-lg"
            >
              <Text className="text-white font-bold text-xs">
                {couponLoading ? "Checking..." : "APPLY"}
              </Text>
            </TouchableOpacity>
          </View>

          {couponError ? (
            <Text className="text-red-500 text-xs mt-1">{couponError}</Text>
          ) : null}

          {applicableCoupons.length > 0 && !appliedCoupon && (
            <View className="mt-4">

              <Text className="text-sm font-semibold text-blacktext mb-2">
                Available Coupons
              </Text>

              <View className="space-y-2">
                {applicableCoupons.map((coupon: any) => (
                  <View
                    key={coupon._id}
                    className="flex-row items-center justify-between rounded-md border border-[#F5C6D8] bg-[#FDF0F5] p-3 mb-2"
                  >

                    <View>
                      <Text className="text-sm font-bold text-Couponstext">
                        🎀{" "}
                        {coupon.discountType === "Percentage"
                          ? `EXTRA ${coupon.discountValue}% OFF`
                          : `EXTRA ₹${coupon.discountValue} OFF`}
                      </Text>

                      <Text className="text-xs text-[#4A4745] mt-0.5">
                        Code:{" "}
                        <Text className="font-bold">
                          {coupon.code}
                        </Text>
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setCouponCode(coupon.code);
                        setCouponError("");
                      }}
                      className="rounded-sm border border-Couponstext bg-white px-3 py-1.5"
                    >
                      <Text className="text-xs font-bold text-Couponstext rounded-xl ">
                        USE
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            </View>
          )}


          {appliedCoupon && (
            <View className="flex-row justify-between items-center bg-bgcard p-3 rounded-lg mt-2.5 border border-goldtext">
              <View>
                <Text className="font-bold text-blacktext">
                  🎀 {appliedCoupon.code}
                </Text>
                <Text className="text-xs text-[#4A4745] mt-0.5">
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
                <Text className="text-bgbrown font-bold text-xs">REMOVE</Text>
              </TouchableOpacity>
            </View>
          )}



          {/* Success Modal */}

          {couponSuccess && appliedCoupon && (
            <Modal
              visible={couponSuccess && !!appliedCoupon}
              transparent={true}
              animationType="fade"
              onRequestClose={() => { }}
            >
              <View className="flex-1 items-center justify-center bg-black/40">
                <View className="relative w-[90%] max-w-md overflow-hidden rounded-2xl bg-white px-6 py-8 text-center shadow-2xl">

                  {/* Success Circle */}
                  <View className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <View className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
                      <Feather name="check" size={28} color="#FFFFFF" />
                    </View>
                  </View>

                  {/* Title */}
                  <Text className="text-2xl font-bold text-blacktext text-center">
                    Coupon Applied Successfully!
                  </Text>

                  <Text className="mt-2 text-sm text-[#777] text-center">
                    Your coupon has been applied to this order.
                  </Text>

                  {/* Coupon Card */}
                  <View className="mt-5 rounded-xl border border-[#F5C6D8] bg-[#FDF0F5] px-4 py-4 items-center">
                    <Text className="text-sm font-medium text-[#777]">
                      Coupon Code
                    </Text>

                    <Text className="mt-1 text-xl font-bold tracking-wider text-Couponstext">
                      🎀 {appliedCoupon.code}
                    </Text>

                    {/* Discount */}
                    <Text className="mt-2 text-lg font-bold text-green-600">
                      {appliedCoupon.discountType === "Percentage"
                        ? `${appliedCoupon.discountValue}% OFF`
                        : `₹${appliedCoupon.discountValue} OFF`}
                    </Text>
                  </View>

                  <Text className="mt-4 text-xs text-gray-400 text-center">
                    Discount has been added to your order
                  </Text>

                </View>
              </View>
            </Modal>
          )}
        </View>

        {/* Price Details Section */}
        <View className="bg-white mt-2 p-4">
          <Text className="text-lg font-bold text-blacktext mb-3">Price Details</Text>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-graytextcolor">Total ({quantity} {quantity === 1 ? 'item' : 'items'})</Text>
            <Text className="text-sm text-blacktext">₹{(originalPrice * quantity).toLocaleString()}</Text>
          </View>



          {originalPrice > effectivePrice && (
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-graytextcolor">Discount</Text>
              <Text className="text-sm text-blacktext">-₹{((originalPrice - effectivePrice) * quantity).toLocaleString()}</Text>
            </View>
          )}

          {couponDiscount > 0 && (
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-graytextcolor">Coupon Discount</Text>
              <Text className="text-sm text-green-600">-₹{couponDiscount.toLocaleString()}</Text>
            </View>
          )}

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-graytextcolor">Delivery Charges</Text>
            <Text className="text-sm font-semibold text-green-600">FREE</Text>
          </View>

          {/* Platform Fee Row */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-graytextcolor">Platform Fee</Text>
            <Text className="text-sm text-blacktext">₹0</Text>
          </View>


          {/* Total Discount Row (Product Discount + Coupon Discount) */}
          {((originalPrice > effectivePrice ? (originalPrice - effectivePrice) * quantity : 0) + couponDiscount) > 0 && (
            <View className="flex-row justify-between items-center mb-2 bg-green-50 p-2 rounded-md">
              <Text className="text-sm font-semibold text-green-700">Total Discount</Text>
              <Text className="text-sm font-semibold text-green-700">
                -₹{(((originalPrice > effectivePrice ? (originalPrice - effectivePrice) * quantity : 0) + couponDiscount)).toLocaleString()}
              </Text>
            </View>
          )}

          <View className="border-t border-[#E2D9C4] my-2 pt-2 flex-row justify-between items-center">
            <Text className="text-base font-bold text-blacktext">Total Amount</Text>
            <Text className="text-lg font-bold text-blacktext">₹{finalAmount.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Footer */}
      <View className="  border-t border-[#E2D9C4] bg-white">
        <View className="flex-row items-center justify-between ">

          {/* Savings Banner */}
          <View className="flex-1 mr-3 bg-bgcard px-4 py-3">
            <Text className="text-xs text-blacktext" numberOfLines={1}>
              You'll save{" "}
              <Text className="italic font-bold text-goldtext">
                ₹{(((originalPrice > effectivePrice ? (originalPrice - effectivePrice) * quantity : 0) + couponDiscount)).toLocaleString()}

              </Text>{" "}
              on this order!
            </Text>
          </View>

          {/* Price + Order */}
          <View className="flex-row items-center">

            {/* Original Price */}
            {/* {couponDiscount > 0 && (
              <Text className="mr-2 text-[10px] text-lightgoldtext line-through">
                ₹{totalAmount.toLocaleString()}
              </Text>
            )} */}

            {/* Coupon Discount */}
            {/* {couponDiscount > 0 && (
              <Text className="mr-2 text-[10px] font-semibold text-green-600">
                -₹{couponDiscount.toLocaleString()} Coupon
              </Text>
            )} */}

            {/* Final Amount */}
            <Text className="mr-3 italic text-xl font-bold text-blacktext">
              ₹{finalAmount.toLocaleString()}
            </Text>

            {/* Place Order */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePlaceOrder}
              disabled={!isAddressComplete || isLoading}
              className={`shrink-0 rounded-lg my-.5  px-4 py-2 mr-3 ${isAddressComplete && !isLoading
                ? "bg-blacktext"
                : "bg-[#D9CFB8]"
                }`}
            >
              <Text
                className={`text-sm font-semibold text-white  ${!isAddressComplete || isLoading ? "opacity-80" : ""
                  }`}
              >
                {isLoading ? "Placing..." : "Place Order"}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}



