


import { Animated, Easing } from "react-native";
import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  // Platform,
  // UIManager,
} from "react-native";

import {
  Search,
  ShoppingCart,
  Heart,
  X,
  Mic,
  Camera,
  MapPin,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { skipToken } from "@reduxjs/toolkit/query";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useGetCartQuery } from "../../services/CartApi";
import { useGetWishlistQuery } from "../../services/WishlistApi";

import { palette } from "../../globaltheme/colors"
// Android LayoutAnimation
// if (
//   Platform.OS === "android" &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

interface HeaderProps {
  isScrolled: boolean;
  // isProfilePressed: boolean;
  // setIsProfilePressed: (pressed: boolean) => void;
  // isSearchPressed: boolean;
  // setIsSearchPressed: (pressed: boolean) => void;
  // isHeartPressed: boolean;
  // setIsHeartPressed: (pressed: boolean) => void;
  // isCartPressed: boolean;
  // setIsCartPressed: (pressed: boolean) => void;
  // fullAddress: string;
  // translateX: any; // or SharedValue<number> if using reanimated types
  // wishlistCount: number;
  // cartCount: number;
  // isSearchOpen: boolean;
  // toggleSearch: () => void;
  // searchQuery: string;
  // setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isScrolled,
  // isProfilePressed, 
  // setIsProfilePressed, 
  // isSearchPressed, 
  // setIsSearchPressed, 
  // isHeartPressed, 
  // setIsHeartPressed, 
  // isCartPressed, 
  // setIsCartPressed, 
  // fullAddress, 
  // translateX, 
  // wishlistCount, 
  // cartCount, 
  // isSearchOpen, 
  // toggleSearch, 
  // searchQuery, 
  // setSearchQuery
}) => {
  const navigation = useNavigation<any>();
  const [token, setToken] = useState<string | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCartPressed, setIsCartPressed] = useState(false);
  const [isSearchPressed, setIsSearchPressed] = useState(false);
  const [isProfilePressed, setIsProfilePressed] = useState(false);
  const [isHeartPressed, setIsHeartPressed] = useState(false);

  const [fullAddress, setFullAddress] = useState("");

  const translateX = useRef(new Animated.Value(0)).current;

  // =========================
  // Get token & user
  // =========================
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        setToken(storedToken);

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const address = parsedUser?.address;

          const addressText = [
            address?.line1,
            address?.city,
            address?.state,
            address?.pincode,
            address?.country,
          ]
            .filter(Boolean)
            .join(", ");

          setFullAddress(addressText);

        }
      } catch (error) {
        console.log("User data error:", error);
      }
    };

    loadUserData();
  }, []);


  useEffect(() => {
    if (!fullAddress) return;

    translateX.setValue(100);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -500,
          duration: 7000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),

        Animated.timing(translateX, {
          toValue: 100,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [fullAddress]);

  // =========================
  // Cart / Wishlist
  // =========================

  const { data: wishlistData, }
    = useGetWishlistQuery(token ? undefined : skipToken);
  const { data: cartState, }
    = useGetCartQuery(token ? undefined : skipToken);

  const wishlist = Array.isArray(wishlistData?.wishlist)
    ? wishlistData.wishlist
    : [];

  const cartItems = Array.isArray(cartState?.cart)
    ? cartState.cart
    : [];

  const wishlistCount = wishlist.length;



  const cartCount = cartItems.reduce(
    (acc: number, item: any) =>
      acc + Number(item?.quantity || 1),
    0
  );


  // =========================
  // Search
  // =========================

  const toggleSearch = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setIsSearchOpen((previous) => {
      if (previous) {
        setSearchQuery("");
      }

      return !previous;
    });
  };



  const handleWishlist = () => {
    navigation.navigate("Wishlist")
  }

    const handleCart = () => {
    navigation.navigate("Cart")
  }


  return (
    <View
      className={`mt-[50px] w-full border-b ${isScrolled
          ? 'bg-bgcream/[0.95] border-textcolor shadow-[0_4px_10px_rgba(30,27,22,0.12)] elevation-4'
          : 'bg-bgcream/[0.80] border-transparent'
        }`}
    >

      {/* ================= HEADER ================= */}
      <View className="w-full h-[72px] flex-row items-center px-2">

        {/* Profile */}
        <Pressable
          onPressIn={() => setIsProfilePressed(true)}
          onPressOut={() => setIsProfilePressed(false)}
          className={`flex-1 min-w-0 h-12 justify-center overflow-hidden rounded-[20px] ${isProfilePressed ? 'bg-[#F2ECE1]' : '' // Replace with palette.hoverCream value if dynamic
            }`}
        >
          <View className="w-full flex-row items-center overflow-hidden px-1">

            {/* Map Pin + Deliver To */}
            <View className="flex-row items-center shrink-0">
              <MapPin
                size={17}
                color={palette.terracotta}
                strokeWidth={2}
              />
              <Text className="ml-1.5 text-xs text-blacktext font-medium">
                Deliver to
              </Text>
            </View>

            {/* Scrolling Address */}
            <View className="flex-1 min-w-0 overflow-hidden ml-[5px] bg-bgcream">
              <Animated.View
                style={{
                  flexDirection: "row",
                  transform: [{ translateX }],
                }}
              >
                <Text className="text-xs text-blacktext w-[400px]">
                  {fullAddress}
                </Text>

                {/* Gap between first & second address */}
                <Text className="text-xs text-blacktext w-[400px] ml-[60px]">
                  {fullAddress}
                </Text>
              </Animated.View>
            </View>

          </View>
        </Pressable>

        {/* Actions */}
        <View className="flex-row items-center shrink-0 ml-1">

          {/* Search */}
          <Pressable
            onPress={toggleSearch}
            onPressIn={() => setIsSearchPressed(true)}
            onPressOut={() => setIsSearchPressed(false)}
            className={`w-[38px] h-[42px] rounded-full justify-center items-center ml-[1px] ${isSearchPressed ? 'bg-white text-Hearticone' : ''
              }`}
          >
            <Search
              size={20}
              color={palette.charcoal}
              strokeWidth={1.5}
            />
          </Pressable>

          {/* Wishlist */}
          <Pressable
            onPress={handleWishlist}
            onPressIn={() => setIsHeartPressed(true)}
            onPressOut={() => setIsHeartPressed(false)}
            className={`w-[38px] h-[42px] rounded-full justify-center items-center ml-[1px] ${isHeartPressed ? 'bg-white text-Hearticone' : ''
              }`}
          >
            <View>
              <Heart
                size={20}
                color={palette.charcoal}
                strokeWidth={1.5}
              />

              {wishlistCount > 0 && (
                <View className="absolute -top-[8px] -right-[5px] min-w-[17px] h-[17px]  rounded-[9px] bg-blacktext justify-center items-center px-[3px]">
                  <Text className="text-white text-[10px] font-semibold">
                    {wishlistCount}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>

          {/* Cart */}
          <Pressable
          onPress={handleCart}
            onPressIn={() => setIsCartPressed(true)}
            onPressOut={() => setIsCartPressed(false)}
            className={`w-[38px] h-[42px] rounded-full justify-center items-center ml-[1px] ${isCartPressed ? 'bg-white  text-Carticone' : ''
              }`}
          >
            <View>
              <ShoppingCart
                size={20}
                color={palette.charcoal}
                strokeWidth={1.5}
              />

              {cartCount > 0 && (
                <View className="absolute -top-[8px] -right-[5px] min-w-[17px] h-[17px] rounded-[9px]  bg-goldtext justify-center items-center px-[3px]">
                  <Text className="text-white text-[10px] font-semibold">
                    {cartCount}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>

        </View>
      </View>

      {/* ================= SEARCH ================= */}
      {isSearchOpen && (
        <View className="px-3 pb-3">
          <View className="w-full flex-row items-center bg-white rounded-xl px-3 h-[42px]">

            <Search
              size={18}
              color={palette.gray800}
              style={{ marginRight: 8 }}
            />

            <TextInput
              className="flex-1 text-sm text-blacktext"
              placeholder="Search by Keyword..."
              placeholderTextColor={palette.gray800}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />

            <View className="flex-row items-center">

              {/* Clear */}
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  className="w-[30px] h-[30px] justify-center items-center"
                >
                  <X size={16} color={palette.gray800} />
                </TouchableOpacity>
              )}

              {/* Mic */}
              <TouchableOpacity
                onPress={() => console.log("Voice Search Triggered")}
                className="w-[30px] h-[30px] justify-center items-center"
              >
                <Mic size={18} color={palette.charcoal} />
              </TouchableOpacity>

              {/* Camera */}
              <TouchableOpacity
                onPress={() => console.log("Camera Search Triggered")}
                className="w-[30px] h-[30px] justify-center items-center"
              >
                <Camera size={18} color={palette.charcoal} />
              </TouchableOpacity>

            </View>
          </View>
        </View>
      )}

    </View>
  );


}



