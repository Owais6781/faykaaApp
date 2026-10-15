
import React, { useEffect, useRef, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    ShieldCheck,
    Truck,
} from "lucide-react-native";

import RazorpayCheckout from "react-native-razorpay";

import {
    useCreateOrderMutation,
    useCreateRazorpayOrderMutation,
    useVerifyPaymentMutation,
    useUpdatePaymentSuccessMutation,
    useUpdatePaymentFailedMutation,
} from "../../services/OrderApi";

import { useNavigation, useRoute } from "@react-navigation/native";

const RAZORPAY_KEY =
    process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID ?? "";

type PaymentMethod = "COD" | "ONLINE";

export const PaymentGateway = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    console.log("Razorpay Key:", RAZORPAY_KEY);
    console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);
    console.log(
        "Razorpay Key Loaded:",
        RAZORPAY_KEY.length > 0
    );
    // Navigate to PaymentGateway with { payload }
    const payload = route.params?.payload;

    const [createOrder] = useCreateOrderMutation();
    const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
    const [verifyPayment] = useVerifyPaymentMutation();
    const [paymentSuccess] = useUpdatePaymentSuccessMutation();
    const [paymentFailed] = useUpdatePaymentFailedMutation();

    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>("COD");

    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const redirectTimeoutRef =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    const isOutOfStock = Boolean(
        payload?.items?.some(
            (item: any) =>
                item.stock <= 0 || item.quantity > item.stock
        )
    );

    useEffect(() => {
        return () => {
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, []);

    const showSuccess = (message: string) => {
        setSuccessMsg(message);

        if (redirectTimeoutRef.current) {
            clearTimeout(redirectTimeoutRef.current);
        }

        redirectTimeoutRef.current = setTimeout(() => {
            navigation.navigate("Orders");
        }, 1800);
    };

    const getErrorMessage = (error: any) => {
        return (
            error?.description ??
            error?.data?.message ??
            error?.message ??
            "Something went wrong. Please try again."
        );
    };

    const getOrderId = (orderResponse: any): string => {
        return String(
            orderResponse?.order?._id ??
            orderResponse?._id ??
            orderResponse?.orderId ??
            ""
        );
    };

    const markPaymentFailed = async (orderId: string) => {
        if (!orderId) return;

        try {
            await paymentFailed({
                orderId,
                status: "FAILED",
            }).unwrap();
        } catch (error) {
            console.error("Update payment failed error:", error);
        }
    };

    // =========================
    // Cash on Delivery
    // =========================

    const handleCOD = async () => {
        try {
            setLoading(true);

            const data = await createOrder({
                items: payload.items,
                paymentMethod: "COD",
                address: payload.address,
                totalAmount: payload.totalAmount,
                coupon: payload.coupon,
            }).unwrap();

            if (data?.success) {
                showSuccess("Order placed successfully!");
            } else {
                Alert.alert(
                    "Order not placed",
                    data?.message ?? "Please try again."
                );
            }
        } catch (error: any) {
            console.error("COD Error:", error);

            Alert.alert(
                "Order failed",
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // Online Razorpay Payment
    // =========================

    const handleOnlinePayment = async () => {
        let pendingOrderId = "";
        let paymentVerified = false;

        try {
            setLoading(true);

            if (!RAZORPAY_KEY) {
                Alert.alert(
                    "Configuration Error",
                    "EXPO_PUBLIC_RAZORPAY_KEY_ID is missing from your .env file."
                );
                return;
            }

            // 1. Create pending order in backend
            const pendingOrder = await createOrder({
                ...payload,
                paymentMethod: "ONLINE",
                status: "PENDING",
            }).unwrap();

            pendingOrderId = getOrderId(pendingOrder);

            if (!pendingOrderId) {
                throw new Error(
                    "Order ID was not returned by the server."
                );
            }

            // 2. Create Razorpay order on the backend
            const razorpayOrder = await createRazorpayOrder({
                amount: payload.totalAmount,
            }).unwrap();

            if (!razorpayOrder?.id || razorpayOrder?.amount == null) {
                throw new Error(
                    "Invalid Razorpay order response from the server."
                );
            }

            // 3. Open native Razorpay checkout
            const paymentResponse = await RazorpayCheckout.open({
                key: RAZORPAY_KEY,
                amount: Number(razorpayOrder.amount),
                currency: "INR",
                name: "Faykaa",
                description: "Order Payment",
                order_id: razorpayOrder.id,
                theme: {
                    color: "#A9803F",
                },
            });

            // 4. Verify payment signature on the backend
            const verifyData = await verifyPayment({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
            }).unwrap();

            if (!verifyData?.success) {
                throw new Error("Payment verification failed.");
            }

            paymentVerified = true;

            // 5. Update the existing order as paid
            await paymentSuccess({
                orderId: pendingOrderId,
                paymentId: paymentResponse.razorpay_payment_id,
            }).unwrap();

            showSuccess("Payment successful! Order confirmed.");
        } catch (error: any) {
            console.error("Online Payment Error:", error);

            // Do not mark a verified payment as failed merely because
            // updating the order after verification encountered an error.
            if (pendingOrderId && !paymentVerified) {
                await markPaymentFailed(pendingOrderId);
            }

            Alert.alert(
                "Payment unsuccessful",
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // Place Order
    // =========================

    const handlePlaceOrder = async () => {
        if (loading) return;

        if (isOutOfStock) {
            Alert.alert(
                "Out of Stock",
                "Please remove unavailable items before placing your order."
            );
            return;
        }

        if (!payload?.items?.length) {
            Alert.alert(
                "Order Error",
                "Your order items were not found. Please return to checkout."
            );
            return;
        }

        if (paymentMethod === "COD") {
            await handleCOD();
        } else {
            await handleOnlinePayment();
        }
    };

    // =========================
    // Missing Payload
    // =========================

    if (!payload) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-[#F8F5EF] px-6">
                <Text className="text-center text-lg font-bold text-[#1E1B16]">
                    Order details not found
                </Text>

                <Text className="mt-2 text-center text-sm text-[#9A9282]">
                    Please return to checkout and try again.
                </Text>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mt-5 rounded-lg bg-[#1E1B16] px-5 py-3"
                >
                    <Text className="font-semibold text-white">
                        Go Back
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F8F5EF]">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 28,
                    flexGrow: 1,
                }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View className="mb-5 flex-row items-center">
                    <Pressable
                        onPress={() => navigation.goBack()}
                        className="mr-3 h-10 w-10 items-center justify-center rounded-full border border-[#E2D9C4] bg-white"
                    >
                        <ArrowLeft size={20} color="#1E1B16" />
                    </Pressable>

                    <View className="flex-1">
                        <Text className="text-2xl font-bold italic text-[#1E1B16]">
                            Select Payment Method
                        </Text>

                        <Text className="mt-1 text-xs text-[#9A9282]">
                            Choose an option to securely complete checkout.
                        </Text>
                    </View>
                </View>

                {/* Stock Warning */}
                {isOutOfStock && (
                    <View className="mb-5 flex-row items-start rounded-xl border border-red-200 bg-red-50 p-4">
                        <AlertCircle
                            size={20}
                            color="#DC2626"
                        />

                        <View className="ml-3 flex-1">
                            <Text className="text-sm font-bold text-red-800">
                                Transaction Restricted
                            </Text>

                            <Text className="mt-1 text-xs leading-5 text-red-700">
                                Some items are out of stock or exceed the available
                                quantity. Remove unavailable items to continue.
                            </Text>
                        </View>
                    </View>
                )}

                {/* Payment Options */}
                <View className="gap-4">
                    {/* Cash on Delivery */}
                    <Pressable
                        disabled={isOutOfStock || loading}
                        onPress={() => setPaymentMethod("COD")}
                        className={`flex-row items-center justify-between rounded-xl border p-4 ${isOutOfStock
                                ? "border-[#E2D9C4] bg-[#EFEAE0] opacity-50"
                                : paymentMethod === "COD"
                                    ? "border-[#A9803F] bg-[#EFEAE0]"
                                    : "border-[#E2D9C4] bg-white"
                            }`}
                    >
                        <View className="mr-3 flex-1 flex-row items-center">
                            <View
                                className={`h-12 w-12 items-center justify-center rounded-xl border ${paymentMethod === "COD"
                                        ? "border-[#A9803F] bg-[#A9803F]"
                                        : "border-[#E2D9C4] bg-[#EFEAE0]"
                                    }`}
                            >
                                <Truck
                                    size={22}
                                    color={
                                        paymentMethod === "COD"
                                            ? "#FFFFFF"
                                            : "#9A9282"
                                    }
                                />
                            </View>

                            <View className="ml-3 flex-1">
                                <Text className="text-sm font-semibold text-[#1E1B16]">
                                    Cash on Delivery
                                </Text>

                                <Text className="mt-1 text-xs leading-5 text-[#9A9282]">
                                    Pay with cash when your order arrives.
                                </Text>
                            </View>
                        </View>

                        <View
                            className={`h-5 w-5 items-center justify-center rounded-full border ${paymentMethod === "COD"
                                    ? "border-[#A9803F]"
                                    : "border-[#D9CFB8]"
                                }`}
                        >
                            {paymentMethod === "COD" && (
                                <View className="h-2.5 w-2.5 rounded-full bg-[#A9803F]" />
                            )}
                        </View>
                    </Pressable>

                    {/* Online Payment */}
                    <Pressable
                        disabled={isOutOfStock || loading}
                        onPress={() => setPaymentMethod("ONLINE")}
                        className={`flex-row items-center justify-between rounded-xl border p-4 ${isOutOfStock
                                ? "border-[#E2D9C4] bg-[#EFEAE0] opacity-50"
                                : paymentMethod === "ONLINE"
                                    ? "border-[#A9803F] bg-[#EFEAE0]"
                                    : "border-[#E2D9C4] bg-white"
                            }`}
                    >
                        <View className="mr-3 flex-1 flex-row items-center">
                            <View
                                className={`h-12 w-12 items-center justify-center rounded-xl border ${paymentMethod === "ONLINE"
                                        ? "border-[#A9803F] bg-[#A9803F]"
                                        : "border-[#E2D9C4] bg-[#EFEAE0]"
                                    }`}
                            >
                                <CreditCard
                                    size={22}
                                    color={
                                        paymentMethod === "ONLINE"
                                            ? "#FFFFFF"
                                            : "#9A9282"
                                    }
                                />
                            </View>

                            <View className="ml-3 flex-1">
                                <Text className="text-sm font-semibold text-[#1E1B16]">
                                    Online Payment / UPI
                                </Text>

                                <Text className="mt-1 text-xs leading-5 text-[#9A9282]">
                                    Pay securely using Razorpay.
                                </Text>
                            </View>
                        </View>

                        <View
                            className={`h-5 w-5 items-center justify-center rounded-full border ${paymentMethod === "ONLINE"
                                    ? "border-[#A9803F]"
                                    : "border-[#D9CFB8]"
                                }`}
                        >
                            {paymentMethod === "ONLINE" && (
                                <View className="h-2.5 w-2.5 rounded-full bg-[#A9803F]" />
                            )}
                        </View>
                    </Pressable>
                </View>

                {/* Order Amount */}
                <View className="mt-6 rounded-xl border border-[#E2D9C4] bg-white p-4">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-sm text-[#9A9282]">
                            Order Total
                        </Text>

                        <Text className="text-xl font-bold italic text-[#1E1B16]">
                            ₹{Number(payload?.totalAmount ?? 0).toLocaleString("en-IN")}
                        </Text>
                    </View>
                </View>

                {/* Security */}
                <View className="mt-5 flex-row items-center justify-center">
                    <ShieldCheck
                        size={15}
                        color="#A9803F"
                    />

                    <Text className="ml-2 text-center text-[10px] font-semibold uppercase tracking-widest text-[#9A9282]">
                        Secure payment processing
                    </Text>
                </View>

                {/* Place Order */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handlePlaceOrder}
                    disabled={loading || isOutOfStock}
                    className={`mt-6 min-h-[52px] flex-row items-center justify-center rounded-xl px-4 py-3 ${loading || isOutOfStock
                            ? "bg-[#D9CFB8]"
                            : "bg-[#1E1B16]"
                        }`}
                >
                    {loading ? (
                        <>
                            <ActivityIndicator
                                size="small"
                                color="#FFFFFF"
                            />

                            <Text className="ml-2 text-sm font-bold text-white">
                                Processing...
                            </Text>
                        </>
                    ) : (
                        <Text className="text-center text-sm font-bold text-white">
                            Confirm & Place Order · ₹
                            {Number(payload?.totalAmount ?? 0).toLocaleString("en-IN")}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            {/* Success Modal */}
            <Modal
                visible={Boolean(successMsg)}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() => { }}
            >
                <View className="flex-1 items-center justify-center bg-black/40 px-6">
                    <View className="w-full max-w-sm items-center rounded-2xl border border-[#E2D9C4] bg-white p-7">
                        <CheckCircle2
                            size={52}
                            color="#A9803F"
                            strokeWidth={1.8}
                        />

                        <Text className="mt-4 text-2xl font-bold italic text-[#1E1B16]">
                            Success!
                        </Text>

                        <Text className="mt-2 text-center text-sm leading-6 text-[#9A9282]">
                            {successMsg}
                        </Text>

                        <Text className="mt-4 text-xs text-[#A9803F]">
                            Redirecting to your orders...
                        </Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
