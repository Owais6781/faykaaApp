

import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Text,
    View,
    Pressable,
} from "react-native";
import {
    Heart,
    ArrowLeft,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { WishlistCard } from "./WishlistCard";
import {
    useGetWishlistQuery,
    useRemoveWishlistDBMutation,
} from "../../services/WishlistApi";
import { useCart } from "../../services/Hooks/useCart";

type WishlistItem = {
    id?: string;
    _id?: string;
    category?: {
        _id: string;
        name: string;
        slug: string;
        isActive: boolean;
    };
    title: string;
    description?: string;
    price: number;
    discountPrice?: number;
    image?: string;
    images?: string[];
    stock?: number;
};

export const Wishlist = () => {
    const navigation = useNavigation<any>();

    const [removeWishlist] = useRemoveWishlistDBMutation();
    const { data: wishlistData,  refetch } = useGetWishlistQuery();

    const [cartItems, setCartItems] = useState<string[]>([]);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const wishlist: WishlistItem[] = (wishlistData?.wishlist || []) as unknown as WishlistItem[];
    const Api = process.env.EXPO_PUBLIC_API_URL || "";

    const imageByIndexUrl = (productId: string, index: number) =>
        `${Api}/api/${productId}/img/${index}`;

    const getDiscountPercentage = (price?: number, discountPrice?: number) => {
        if (price == null || discountPrice == null) return 0;
        if (price <= discountPrice) return 0;
        return Math.round(((price - discountPrice) / price) * 100);
    };

    const handleViewCard = (item: WishlistItem) => {
        const productId = item._id || item.id;
        if (!productId) {
            Alert.alert("Error", "Product id not found");
            return;
        }
        navigation.navigate("ProductViewCard", { productId });
    };

    const { handleAddToCart } = useCart();

    const handleRemoveFromWishlist = async (item: WishlistItem) => {
        const productId = item._id || item.id;
        if (!productId) return;

        try {
            setRemovingId(String(productId));
            await removeWishlist({ productId: String(productId) }).unwrap();
            refetch();
        } catch (error) {
            console.log("Remove wishlist error:", error);
            Alert.alert("Error", "Failed to remove from wishlist");
        } finally {
            setRemovingId(null);
        }
    };


    if (wishlist.length === 0) {
        return (
            <View className="flex-1 items-center justify-center bg-bgcream px-6 mt-[100px]">
                <View className="w-full max-w-md items-center rounded-xl border border-textcolor bg-white p-8">
                    <View className="mb-5 h-16 w-16 items-center justify-center rounded-xl bg-goldtext">
                        <Heart size={32} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                    <Text className="text-center text-3xl font-bold italic text-blacktext">
                        Your wishlist is empty
                    </Text>
                    <Text className="mt-3 text-center leading-6 text-lightgoldtext">
                        Save items you love and find them all in one place
                    </Text>
                    <Pressable
                        onPress={() => navigation.navigate("Home")}
                        className="mt-8 flex-row items-center justify-center rounded-lg bg-blacktext px-8 py-4"
                    >
                        <Text className="text-base font-semibold text-white">
                            Discover Products
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    const renderWishlistItem = ({ item }: { item: WishlistItem }) => {
        const itemId = item._id || item.id;
        if (!itemId) return null;

        const discountPercent = getDiscountPercentage(item.price, item.discountPrice);
        const isInCart = cartItems.includes(String(itemId));
        const outOfStock = item.stock === 0;
        const imageUrl = item._id ? imageByIndexUrl(item._id, 0) : (item.image || "https://via.placeholder.com/150");

        return (
            <WishlistCard
            
                item={item}
                itemKey={String(itemId)}
                isRemoved={removingId === String(itemId)}
                isInCart={isInCart}
                outOfStock={outOfStock}
                discountPercent={discountPercent}
                imageSrc={imageUrl}
                onViewCard={() => handleViewCard(item)}
                onRemove={() => handleRemoveFromWishlist(item)}
                onAddToCart={() => handleAddToCart(item, cartItems, setCartItems)}
            />
        );
    };

    return (
        <View className="flex-1 bg-bgcream mt-[50px]">
            {/* Header */}
            <View className="px-5 pb-4 pt-5">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <Pressable
                            onPress={() => navigation.goBack()}
                            className="h-10 w-10 items-center justify-center rounded-lg"
                        >
                            <ArrowLeft size={22} color="#1E1B16" />
                        </Pressable>
                        <Text className="text-3xl font-bold italic text-blacktext">
                            My Wishlist
                        </Text>
                    </View>

                    <Text className="text-sm text-lightgoldtext">
                        <Text className="font-semibold text-blacktext">
                            {wishlist.length}
                        </Text>{" "}
                        {wishlist.length === 1 ? "item" : "items"}
                    </Text>
                </View>
            </View>

            {/* Wishlist Grid/List */}
            <FlatList
                data={wishlist}
                keyExtractor={(item, index) =>
                    String(item._id || item.id || index)
                }
                renderItem={renderWishlistItem}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            />
        </View>
    );
};