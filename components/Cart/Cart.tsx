
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useWishlist } from "../../services/Hooks/useWishlist";
import { useProductNavigation } from "../../services/Hooks/useProductNavigation"

import {
  ShoppingCart,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  X,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useGetCartQuery,
  useRemoveFromCartDbMutation,
  useUpdateCartQuantityDbMutation,
} from "../../services/CartApi";
import { useGetWishlistQuery } from "../../services/WishlistApi"
interface ProductData {
  _id: string;
  title?: string;
  name?: string;
  price?: number;
  discountPrice?: number;
  stock?: number;
  images?: string[];
  image?: string;
}

interface CartApiItem {
  _id?: string;
  id?: string;
  productId?: ProductData;
  quantity: number;
}

export const Cart = () => {
  const navigation = useNavigation<any>();

  const { data, refetch } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartDbMutation();
  const [updateQuantity] = useUpdateCartQuantityDbMutation();
  const { data: wishlistData, refetch: refetchWishlist, } = useGetWishlistQuery();
  const wishlist = wishlistData?.wishlist || [];
  const Api = process.env.EXPO_PUBLIC_API_URL || ""; // Ya aapka jo bhi env setup ho

  const imageByIndexUrl = (productId: string, index: number) =>
    `${Api}/api/${productId}/img/${index}`;

  // Backend response safe parse
  const cart: CartApiItem[] = Array.isArray(data?.cart)
    ? data.cart
    : Array.isArray(data?.data?.cart)
      ? data.data.cart
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

  const total = cart.reduce((acc, item) => {
    const product = item.productId || (item as any);
    const price = Number(product?.discountPrice ?? product?.price ?? 0);
    return acc + price * Number(item.quantity || 1);
  }, 0);

  const shipping = total >= 999 ? 0 : 100;
  const grandTotal = total + shipping;

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId).unwrap();
      refetch();
    } catch (error) {
      console.log("Remove error:", error);
    }
  };



  const handleIncrement = async (item: CartApiItem) => {
    try {
      const product = item.productId || (item as any);
      const productId = product?._id || item._id || item.id || "";
      const newQuantity = item.quantity + 1;

      if (product?.stock && newQuantity > product.stock) {
        Alert.alert("Stock Limit", `Only ${product.stock} items available in stock`);
        return;
      }

      await updateQuantity({
        productId,
        quantity: newQuantity,
      }).unwrap();

      refetch();
    } catch (error) {
      console.log("Increment error:", error);
    }
  };

  const handleDecrement = async (item: CartApiItem) => {
    try {
      const product = item.productId || (item as any);
      const productId = product?._id || item._id || item.id || "";
      const newQuantity = item.quantity - 1;

      if (newQuantity < 1) {
        await handleRemove(productId);
        return;
      }

      await updateQuantity({
        productId,
        quantity: newQuantity,
      }).unwrap();

      refetch();
    } catch (error) {
      console.log("Decrement error:", error);
    }
  };

  const handleQuantityChange = async (item: CartApiItem, value: string) => {
    try {
      const product = item.productId || (item as any);
      const productId = product?._id || item._id || item.id || "";
      const newQuantity = parseInt(value) || 1;

      if (newQuantity < 1) return;

      if (product?.stock && newQuantity > product.stock) {
        Alert.alert("Stock Limit", `Only ${product.stock} items available in stock`);
        return;
      }

      await updateQuantity({
        productId,
        quantity: newQuantity,
      }).unwrap();

      refetch();
    } catch (error) {
      console.log("Quantity update error:", error);
    }
  };



  const { handleWishlist } = useWishlist();
  const { handleViewCard } = useProductNavigation()




  return (
    <SafeAreaView>
      <ScrollView className="bg-bgcream flex-1 px-4 sm:px-6   ">
        <View className="max-w-4xl mx-auto w-full ">

          {/* Header */}
          <View className="bg-white rounded-lg shadow-sm border border-textcolor p-6 mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="items-center justify-center w-10 h-10 bg-bgcard rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-[#A9803F]" />
                </View>
                <Text className="italic text-2xl font-bold text-blacktext">
                  Shopping Cart
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                className="flex-row items-center gap-2 px-3 py-2 bg-bgcard rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 text-goldtext" />
                <Text className="font-medium text-goldtext text-xs hidden sm:flex">Shop</Text>
              </TouchableOpacity>
            </View>

            {cart.length > 0 && (
              <Text className="text-lightgoldtext mt-3 font-medium">
                {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
              </Text>
            )}
          </View>

          {cart.length === 0 ? (
            /* Empty Cart State */
            <View className="bg-white rounded-lg shadow-sm border border-textcolor p-12 items-center">
              <View className="bg-bgcard p-6 rounded-lg mb-6">
                <ShoppingBag className="w-16 h-16 text-goldtext" />
              </View>

              <Text className="italic text-2xl font-bold text-blacktext mb-3 text-center">
                Your cart is empty
              </Text>

              <Text className="text-lightgoldtext mb-8 text-center leading-relaxed">
                Looks like you haven't added anything to your cart yet. Start exploring our collection!
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                className="flex-row items-center gap-2 px-8 py-4 bg-blacktext rounded-lg"
              >
                <ShoppingBag className="w-5 h-5 text-white" />
                <Text className="text-white font-semibold">Start Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Cart Contents */
            <View className="space-y-4">
              {cart.map((item) => {
                const product = item.productId || (item as any);
                const productId = product?._id || item._id || item.id || "";
                const isWishlist = wishlist.some((w: any) => {
                  const wishlistProductId = String(
                    w.productId?._id ||
                    w.productId ||
                    w.product?._id ||
                    w._id ||
                    w.id ||
                    ""
                  );

                  return wishlistProductId === productId;
                });

                const title = product?.title || product?.name || "Product";
                const price = Number(product?.discountPrice ?? product?.price ?? 0);
                const stock = Number(product?.stock ?? 0);
                const imageUrl = productId ? imageByIndexUrl(productId, 0) : product?.image;

                return (
                  <View
                    key={productId}
                    className="bg-white rounded-lg shadow-sm border border-textcolor p-4 mb-2"
                  >

                    <View className="flex-row gap-4">
                      {/* Product Image + Quantity */}
                      <View className="items-center">
                        {/* Product Image */}
                        <Image
                          source={{
                            uri: imageUrl || "https://via.placeholder.com/150",
                          }}
                          className="w-28 h-24 rounded-lg bg-bgcard"
                          resizeMode="cover"
                        />

                        {/* Quantity Controls - Image ke neeche */}
                        <View className="flex-row items-center border-2 border-textcolor rounded-lg overflow-hidden bg-bgcream mt-2">
                          <TouchableOpacity
                            onPress={() => handleDecrement(item)}
                            className="p-2"
                          >
                            <Minus size={16} color="#A9803F" />
                          </TouchableOpacity>

                          <TextInput
                            value={String(item.quantity)}
                            onChangeText={(value) => handleQuantityChange(item, value)}
                            className="w-10 text-center py-1 font-semibold text-blacktext bg-white"
                            keyboardType="numeric"
                          />

                          <TouchableOpacity
                            onPress={() => handleIncrement(item)}
                            className="p-2"
                          >
                            <Plus size={16} color="#A9803F" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Product Info */}
                      <View className="flex-1">
                        <Text
                          className="italic text-base font-semibold text-blacktext "
                          numberOfLines={1}
                        >
                          {title}
                        </Text>

                        <View className="mb-4 ">
                          <Text className="italic text-lg font-bold text-blacktext">
                            ₹{(price * item.quantity).toLocaleString("en-IN")}
                          </Text>

                          <Text className="text-xs text-lightgoldtext mt-0.5">
                            ₹{price.toLocaleString("en-IN")} each
                          </Text>

                          {stock > 0 && (
                            <Text className="text-xs text-goldtext font-medium mt-0.5">
                              {stock} items available
                            </Text>
                          )}
                        </View>

                        {/* Remove Button */}
                        <View className="flex-row items-center">
                          <View className="w-full flex-row items-center gap-2">
                            {/* Remove */}
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => handleRemove(productId)}
                              className="min-w-0 flex-1 items-center justify-center rounded-lg border border-[#D9C8A5] bg-white px-2 py-2"
                            >
                              <Text
                                numberOfLines={1}
                                className="text-xs font-medium text-[#8A682F]"
                              >
                                Remove
                              </Text>
                            </TouchableOpacity>

                            {/* Move to Wishlist */}
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => handleWishlist(item,)}
                              className="min-w-0 flex-[1.5] items-center justify-center rounded-lg border border-[#D9C8A5] px-2 py-2"
                            >
                              <Text
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                className="text-xs font-medium text-[#8A682F]"
                              >
                                {isWishlist ? "Remove from Wishlist" : "Move to Wishlist"}
                              </Text>
                            </TouchableOpacity>

                            {/* Buy Now */}
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => handleViewCard(productId)}
                              className="min-w-0 flex-1 items-center justify-center rounded-lg border border-[#D9C8A5] px-1 py-2"
                            >
                              <Text
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                className="text-xs font-medium text-[#8A682F]"
                              >
                                Buy Now
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Order Summary Box */}
              <View className="bg-white rounded-lg shadow-sm border border-textcolor p-6 ">
                <Text className="italic text-xl font-bold text-blacktext mb-4">
                  Order Summary
                </Text>

                <View className="space-y-3 mb-6">
                  <View className="flex-row justify-between">
                    <Text className="text-lightgoldtext font-medium">
                      Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)
                    </Text>
                    <Text className="italic font-semibold text-blacktext">
                      ₹{total.toLocaleString("en-IN")}
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-lightgoldtext font-medium">Shipping</Text>
                    <Text className={`italic font-semibold ${shipping === 0 ? "text-goldtext" : "text-blacktext"}`}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </Text>
                  </View>

                  <View className="border-t border-textcolor pt-3 mt-2">
                    <View className="flex-row justify-between">
                      <Text className="italic text-lg font-bold text-blacktext">Total</Text>
                      <Text className="italic text-lg font-bold text-goldtext">
                        ₹{grandTotal.toLocaleString("en-IN")}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Checkout")}
                  className="w-full py-3.5 bg-blacktext rounded-lg items-center mb-3"
                >
                  <Text className="text-white font-semibold">Proceed to Checkout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Home")}
                  className="w-full py-3 border-2 border-textcolor rounded-lg items-center"
                >
                  <Text className="text-blacktext font-semibold">Continue Shopping</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

