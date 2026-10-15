

import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    Star,
    ArrowLeft,
    Filter,
    Search,
    Truck,
    X,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    useAddReviewMutation,
    useGetReviewsQuery,
} from "../../../services/ReviewApi";

import { useGetMyOrdersQuery } from "../../../services/OrderApi";

// Keep these imports if these components already exist
import { OrderTracking } from "./OrderTracking";
import { OrderStatus } from "./OrderTracking"
import { ReviewModal } from "./ReviewModal";

type ProductItem = {
    id: string;
    _id?: string;
    productId: string;

    title: string;
    price: number;
    discountPrice?: number;
    quantity: number;

    image?: string;
    category?: string;

    orderStatus: string;
    paymentStatus: "Paid" | "Pending" | "Failed";
    orderId: string;
    createdAt: string;
    paymentMethod: "Paid" | "COD";
    transactionId: string;
    updatedAt: string;

    rating: number;
    reviewCount: number;

    orderTotalAmount: number;
};

type TimeFilter =
    | "all"
    | "last30"
    | "last3months"
    | "last6months"
    | "thisYear";

const API = process.env.EXPO_PUBLIC_API_URL;

export const OrderList = () => {

    const [selectedOrder, setSelectedOrder] = useState<ProductItem | null>(
        null
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [timeFilter, setTimeFilter] =
        useState<TimeFilter>("all");

    const [showFilter, setShowFilter] = useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState<ProductItem | null>(null);

    const [refreshing, setRefreshing] = useState(false);

    const {
        data,
       
        isError,
        refetch,
    } = useGetMyOrdersQuery(undefined);


    const [addReview] = useAddReviewMutation();

    const { data: reviewData } = useGetReviewsQuery(
        selectedProduct?.productId,
        {
            skip: !selectedProduct,
        }
    );

    const orders = data?.orders || [];

    // --------------------------------------------------
    // Convert orders -> products
    // --------------------------------------------------

    const products: ProductItem[] = useMemo(() => {
        return orders.flatMap((order: any) =>
            order.items.map((item: any, index: number) => ({
                id: `${order._id}-${index}`,

                title: item.title,
                price: item.price,
                discountPrice: item.discountPrice,
                quantity: item.quantity,

                category: item.category,

                image: item.productId?.images?.[0],

                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus,

                orderId: order.orderId,

                createdAt: order.createdAt,
                paymentMethod: order.paymentMethod,

                transactionId: order.transactionId,
                updatedAt: order.updatedAt,

                productId: item.productId?._id,

                rating: item.productId?.rating || 0,
                reviewCount: item.productId?.reviewCount || 0,

                orderTotalAmount: order.totalAmount,
            }))
        );
    }, [orders]);

    // --------------------------------------------------
    // Filter
    // --------------------------------------------------

    const filteredProducts = useMemo(() => {
        let result = [...products];

        const now = new Date();

        if (timeFilter !== "all") {
            const cutoff = new Date();

            switch (timeFilter) {
                case "last30":
                    cutoff.setDate(now.getDate() - 30);
                    break;

                case "last3months":
                    cutoff.setMonth(now.getMonth() - 3);
                    break;

                case "last6months":
                    cutoff.setMonth(now.getMonth() - 6);
                    break;

                case "thisYear":
                    cutoff.setMonth(0, 1);
                    cutoff.setHours(0, 0, 0, 0);
                    break;
            }

            result = result.filter(
                (item) =>
                    new Date(item.createdAt) >= cutoff
            );
        }

        if (searchQuery.trim()) {
            const q = searchQuery
                .toLowerCase()
                .trim();

            result = result.filter(
                (item) =>
                    item.title
                        ?.toLowerCase()
                        .includes(q) ||
                    item.orderId
                        ?.toLowerCase()
                        .includes(q) ||
                    item.category
                        ?.toLowerCase()
                        .includes(q)
            );
        }

        return result;
    }, [
        products,
        timeFilter,
        searchQuery,
    ]);

    // --------------------------------------------------
    // Helpers
    // --------------------------------------------------

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    const getOrderStatusStyle = (
        status: string
    ) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return {
                    container:
                        "bg-[#EFEAE0] border-[#E2D9C4]",
                    text: "text-[#A9803F]",
                };

            case "shipped":
                return {
                    container:
                        "bg-blue-50 border-blue-200",
                    text: "text-[#1E1B16]",
                };

            case "pending":
                return {
                    container:
                        "bg-yellow-50 border-yellow-200",
                    text: "text-[#A9803F]",
                };

            case "cancelled":
                return {
                    container:
                        "bg-red-50 border-red-200",
                    text: "text-red-700",
                };

            case "processing":
                return {
                    container:
                        "bg-[#EFEAE0] border-[#E2D9C4]",
                    text: "text-[#1E1B16]",
                };

            case "confirmed":
                return {
                    container:
                        "bg-[#EFEAE0] border-[#E2D9C4]",
                    text: "text-[#A9803F]",
                };

            default:
                return {
                    container:
                        "bg-[#EFEAE0] border-[#E2D9C4]",
                    text: "text-[#1E1B16]",
                };
        }
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setTimeFilter("all");
        setShowFilter(false);
    };

    const hasActiveFilters =
        searchQuery.trim().length > 0 ||
        timeFilter !== "all";

    const timeFilterOptions: {
        value: TimeFilter;
        label: string;
    }[] = [
            {
                value: "all",
                label: "All Time",
            },
            {
                value: "last30",
                label: "Last 30 Days",
            },
            {
                value: "last3months",
                label: "Last 3 Months",
            },
            {
                value: "last6months",
                label: "Last 6 Months",
            },
            {
                value: "thisYear",
                label: "This Year",
            },
        ];

    // --------------------------------------------------
    // Refresh
    // --------------------------------------------------

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await refetch();
        } finally {
            setRefreshing(false);
        }
    };

    // --------------------------------------------------
    // Review
    // --------------------------------------------------

    const handleSubmitReview = async (
        rating: number,
        comment: string
    ) => {
        if (!selectedProduct) return;

        try {
            await addReview({
                productId: String(
                    selectedProduct.productId
                ),

                orderId: String(
                    selectedProduct.orderId
                ),

                rating,

                review: comment,
            }).unwrap();

            Alert.alert(
                "Success",
                "Review Added Successfully"
            );

            setSelectedProduct(null);
        } catch (error) {
            console.log(
                "Review error:",
                error
            );

            Alert.alert(
                "Error",
                "Unable to add review."
            );
        }
    };
    // --------------------------------------------------
    // Error
    // --------------------------------------------------

    if (isError) {
        return (
            <SafeAreaView>
            <View className="flex-1 bg-[#F8F5EF] ">
                <View className="flex-1 items-center justify-center px-6">

                    <View className="items-center">
                        <View className="h-14 w-14 items-center justify-center rounded-full border border-[#E2D9C4] bg-[#F8F5EF]">
                            <X size={25} color="#9C6B3E" />
                        </View>

                        <Text className="mt-5 text-center text-2xl font-semibold italic text-[#1E1B16]">
                            Something went wrong
                        </Text>

                        <Text className="mt-2 max-w-[300px] text-center text-sm leading-5 text-[#9A9282]">
                            We couldn't load the page. Please try again.
                        </Text>

                        <Pressable
                            onPress={() => refetch()}
                            className="mt-7 rounded-xl bg-[#1E1B16] px-7 py-3.5"
                        >
                            <Text className="text-xs font-semibold uppercase tracking-widest text-[#F8F5EF]">
                                Retry
                            </Text>
                        </Pressable>
                    </View>

                </View>
            </View>
            </SafeAreaView>
        );
    }

    // --------------------------------------------------
    // Empty
    // --------------------------------------------------

    if (products.length === 0) {
        return (
             <SafeAreaView>
            <View className="flex-1 items-center justify-center bg-[#F8F5EF] px-6">
                <View className="w-full max-w-md items-center rounded-xl border border-[#E2D9C4] bg-white p-8">
                    <Text className="text-5xl">
                        📦
                    </Text>

                    <Text className="mt-4 text-center text-xl font-semibold italic text-[#1E1B16]">
                        No orders yet
                    </Text>

                    <Text className="mt-2 text-center text-[#9A9282]">
                        Once you place an order,
                        it will appear here.
                    </Text>
                </View>
            </View>
            </SafeAreaView>
        );
    }

    // --------------------------------------------------
    // Main
    // --------------------------------------------------

    return (
        <View className="flex-1 bg-[#F8F5EF] mt-[50px]">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 40,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#A9803F"
                    />
                }
            >
                {/* Header */}

                <View className="mb-6 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Pressable
                            onPress={() => {
                                // navigation.goBack()
                            }}
                            className="mr-2 rounded-lg p-2"
                        >
                            <ArrowLeft
                                size={24}
                                color="#1E1B16"
                            />
                        </Pressable>

                        <Text className="text-3xl  italic text-[#1E1B16]">
                            My Orders
                        </Text>
                    </View>

                    <Text className="text-sm text-[#9A9282]">
                        <Text className="font-semibold text-[#1E1B16]">
                            {products.length}
                        </Text>{" "}
                        Items
                    </Text>
                </View>

                {/* Search + Filter */}




                <View className="mb-6 rounded-xl border border-[#E2D9C4] bg-white p-4">

                    {/* Search + Filter Row */}


                    <View className="flex-row items-center gap-2">
                        {/* Search Bar */}
                        <View className="flex-1 flex-row items-center rounded-lg border border-[#E2D9C4] bg-[#F8F5EF] px-3">
                            <Search size={19} color="#B3AB97" />

                            <TextInput
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search product, order ID..."
                                placeholderTextColor="#B3AB97"
                                className="ml-2 flex-1 py-3 text-sm text-[#1E1B16]"
                            />

                            {searchQuery.length > 0 && (
                                <Pressable onPress={() => setSearchQuery("")}>
                                    <X size={18} color="#9A9282" />
                                </Pressable>
                            )}
                        </View>

                        {/* Filter Button */}
                        <Pressable
                            onPress={() => setShowFilter((previous) => !previous)}
                            className="shrink-0 flex-row items-center justify-center rounded-lg border border-[#E2D9C4] bg-white px-4 py-3"
                        >
                             <Filter size={17} color="#A9803F" />

                        
                        </Pressable>
                    </View>




                    {/* Filter Options */}
                    {showFilter && (
                        <View className="mt-4 border-t border-[#E2D9C4] pt-4">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-sm font-semibold text-[#1E1B16]">
                                    Filter Orders
                                </Text>

                                {hasActiveFilters && (
                                    <Pressable
                                        onPress={clearAllFilters}
                                    >
                                        <Text className="text-xs font-medium text-[#A9803F]">
                                            Clear all
                                        </Text>
                                    </Pressable>
                                )}
                            </View>

                            <Text className="mb-3 mt-4 text-xs font-medium uppercase tracking-wide text-[#9A9282]">
                                Period
                            </Text>

                            <View className="flex-row flex-wrap gap-2">
                                {timeFilterOptions.map(
                                    (option) => {
                                        const active =
                                            timeFilter ===
                                            option.value;

                                        return (
                                            <Pressable
                                                key={
                                                    option.value
                                                }
                                                onPress={() => {
                                                    setTimeFilter(
                                                        option.value
                                                    );
                                                    setShowFilter(
                                                        false
                                                    );
                                                }}
                                                className={`rounded-lg border px-3.5 py-2.5 ${active
                                                    ? "border-[#1E1B16] bg-[#1E1B16]"
                                                    : "border-[#E2D9C4] bg-[#EFEAE0]"
                                                    }`}
                                            >
                                                <Text
                                                    className={`text-xs font-medium ${active
                                                        ? "text-white"
                                                        : "text-[#1E1B16]"
                                                        }`}
                                                >
                                                    {
                                                        option.label
                                                    }
                                                </Text>
                                            </Pressable>
                                        );
                                    }
                                )}
                            </View>
                        </View>
                    )}

                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <View className="mt-4 flex-row flex-wrap items-center gap-2 border-t border-[#E2D9C4] pt-4">
                            <Text className="text-xs font-medium text-[#9A9282]">
                                Active:
                            </Text>

                            {timeFilter !== "all" && (
                                <View className="rounded-lg border border-[#E2D9C4] bg-[#EFEAE0] px-3 py-1.5">
                                    <Text className="text-xs font-medium text-[#A9803F]">
                                        {
                                            timeFilterOptions.find(
                                                (item) => item.value === timeFilter
                                            )?.label
                                        }
                                    </Text>
                                </View>
                            )}

                            {searchQuery.length > 0 && (
                                <View className="max-w-[220px] rounded-lg border border-[#E2D9C4] bg-[#EFEAE0] px-3 py-1.5">
                                    <Text
                                        numberOfLines={1}
                                        className="text-xs font-medium text-[#1E1B16]"
                                    >
                                        Search: {searchQuery}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                </View>


                {/* No Results */}

                {filteredProducts.length ===
                    0 && (
                        <View className="items-center justify-center rounded-xl border border-[#E2D9C4] bg-white/50 px-6 py-20">
                            <Text className="text-center text-2xl font-semibold italic text-[#1E1B16]">
                                No orders found
                            </Text>

                            <Text className="mt-2 text-center text-sm text-[#9A9282]">
                                Try widening your search
                                or clearing a filter.
                            </Text>

                            <Pressable
                                onPress={
                                    clearAllFilters
                                }
                                className="mt-6 rounded-lg bg-[#1E1B16] px-6 py-3"
                            >
                                <Text className="text-xs font-semibold uppercase tracking-widest text-[#F8F5EF]">
                                    Clear all filters
                                </Text>
                            </Pressable>
                        </View>
                    )}

                {/* Orders */}

                <View className="gap-5">
                    {filteredProducts.map(
                        (item) => {
                            const finalPrice =
                                item.orderTotalAmount;

                            const hasDiscount =
                                !!item.discountPrice &&
                                item.price >
                                item.discountPrice;

                            const statusStyle =
                                getOrderStatusStyle(
                                    item.orderStatus
                                );

                            return (
                                <View
                                    key={item.id}
                                    className="overflow-hidden rounded-xl border border-[#E2D9C4] bg-white"
                                >
                                    <View className="p-4">
                                        {/* Product Image */}

                                        <View className="flex-row">
                                            <View className=" w-full h-52  overflow-hidden rounded-xl bg-[#EFEAE0]">
                                                {item.image ? (
                                                    <Image
                                                        source={{
                                                            uri: `${API}/api/image/${item.image}`,
                                                        }}
                                                        className="h-full w-full"
                                                        resizeMode="cover"
                                                    />
                                                ) : (
                                                    <View className="h-full w-full items-center justify-center">
                                                        <Text className="text-2xl">
                                                            📦
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>


                                        </View>

                                        {/* Order Information */}



                                        <View className="flex-1">
                                            {/* Product Title */}
                                            <Text
                                                numberOfLines={1}
                                                className="font-display text-lg font-semibold italic text-[#1E1B16]"
                                            >
                                                {item.title}
                                            </Text>

                                            {/* Quantity + Price */}
                                            <View className="mt-3 flex-row items-center justify-between">
                                                <View className="rounded-lg border border-[#E2D9C4] bg-[#EFEAE0] px-2.5 py-1">
                                                    <Text className="text-xs font-medium text-[#1E1B16]">
                                                        Qty: {item.quantity}
                                                    </Text>
                                                </View>

                                                <Text className="font-display text-xl font-bold italic text-[#1E1B16]">
                                                    {formatPrice(finalPrice)}
                                                </Text>
                                            </View>

                                            {/* Order ID + Discount */}
                                            <View className="mt-4 flex-row items-start justify-between gap-4">
                                                <Text className="flex-1 text-sm text-[#9A9282]">
                                                    Order ID:{" "}
                                                    <Text className="font-medium text-[#1E1B16]">
                                                        {item.orderId}
                                                    </Text>
                                                </Text>
                                                {/* Discount */}
                                                {hasDiscount && (
                                                    <View className=" flex-row  items-end gap-2">
                                                        <Text className="text-xs text-[#B3AB97] line-through">
                                                            {formatPrice(item.price)}
                                                        </Text>

                                                        <Text className=" text-xs font-semibold text-[#A9803F]">
                                                            Save {formatPrice(item.price - finalPrice)}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>

                                            {/* Date + Rating + Status */}
                                            <View className="mt-4 flex-row items-center justify-between">
                                                {/* Date & Rating */}
                                                <View className="flex-1">
                                                    <Text className="text-sm text-[#9A9282]">
                                                        Date:{" "}
                                                        <Text className="font-medium text-[#1E1B16]">
                                                            {formatDate(item.createdAt)}
                                                        </Text>
                                                    </Text>

                                                    {/* Rating */}
                                                    <View className="mt-1.5 flex-row items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={10}
                                                                color={
                                                                    i < Math.floor(item.rating)
                                                                        ? "#A9803F"
                                                                        : "#E2D9C4"
                                                                }
                                                                fill={
                                                                    i < Math.floor(item.rating)
                                                                        ? "#A9803F"
                                                                        : "transparent"
                                                                }
                                                            />
                                                        ))}

                                                        {item.reviewCount > 0 && (
                                                            <Text className="ml-1 text-[10px] text-[#B3AB97]">
                                                                ({item.reviewCount})
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>

                                                {/* Order Status */}

                                                <View className="mt-3 flex-row">
                                                    <View
                                                        className={`rounded-sm border px-2 py-1 ${statusStyle.container}`}
                                                    >
                                                        <Text
                                                            className={`text-xs font-semibold ${statusStyle.text}`}
                                                        >
                                                            {
                                                                item.orderStatus
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>





                                        {/* Buttons */}

                                        <View className="mt-5 flex-row gap-3 border-t border-[#E2D9C4] pt-4">
                                            <Pressable
                                                onPress={() =>
                                                    setSelectedOrder(
                                                        item
                                                    )
                                                }
                                                className={`flex-row items-center justify-center  bg-[#1E1B16] py-3 ${item.orderStatus?.toLowerCase() ===
                                                    "delivered"
                                                    ? "flex-1"
                                                    : "w-full"
                                                    }`}
                                            >
                                                <Truck
                                                    size={17}
                                                    color="#FFFFFF"
                                                />

                                                <Text className="ml-2 text-sm font-semibold text-white">
                                                    Track Order
                                                </Text>
                                            </Pressable>

                                            {item.orderStatus?.toLowerCase() ===
                                                "delivered" && (
                                                    <Pressable
                                                        onPress={() =>
                                                            setSelectedProduct(
                                                                item
                                                            )
                                                        }
                                                        className="flex-1 items-center justify-center  border border-[#A9803F] py-3"
                                                    >
                                                        <Text className="text-sm font-semibold text-[#A9803F]">
                                                            ⭐ Rating & Review
                                                        </Text>
                                                    </Pressable>
                                                )}
                                        </View>
                                    </View>
                                </View>
                            );
                        }
                    )}
                </View>
            </ScrollView>

            {/* Review Modal */}

            {selectedProduct && (
                <ReviewModal
                    onClose={() => setSelectedProduct(null)}
                    reviewData={reviewData}
                    onSubmit={handleSubmitReview}
                />
            )}

            {/* Order Tracking */}

            {selectedOrder && (
                <View className="absolute inset-0 z-50 bg-black/40">
                    <View className="absolute bottom-0 left-0 right-0 max-h-[90%] rounded-t-3xl border border-[#E2D9C4] bg-white p-5">
                        <View className="mb-4 flex-row items-center justify-between">
                            <Text className="text-xl font-semibold text-[#1E1B16]">
                                Track Order
                            </Text>

                            <Pressable
                                onPress={() =>
                                    setSelectedOrder(
                                        null
                                    )
                                }
                                className="rounded-full bg-[#EFEAE0] p-2"
                            >
                                <X
                                    size={20}
                                    color="#1E1B16"
                                />
                            </Pressable>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={
                                false
                            }
                        >
                            <OrderTracking
                                orderId={selectedOrder.orderId}
                                status={selectedOrder.orderStatus as OrderStatus}
                                createdAt={selectedOrder.createdAt}
                                updatedAt={selectedOrder.updatedAt}
                                paymentStatus={selectedOrder.paymentStatus}
                                orderType={selectedOrder.paymentMethod}
                                transactionId={selectedOrder.transactionId}


                            />
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    );
}