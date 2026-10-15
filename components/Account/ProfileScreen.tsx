
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetWishlistQuery } from "../../services/WishlistApi";
import { useGetCartQuery } from "../../services/CartApi";
import { skipToken } from "@reduxjs/toolkit/query";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react'; import {
  User,
  UserPlus,
  Package,
  Heart,
  ShoppingCart,
  Smartphone,
  LogOut,
  ChevronRight,
  Store,
  Gift,
  Sparkles,
  Flame,
} from 'lucide-react-native';

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginPressed, setIsLoginPressed] = useState(false);
  const [isSignupPressed, setIsSignupPressed] = useState(false);

  const [token, setToken] = useState<string | null>(null);

  // Mock user data (Replace with your actual auth/user state)

  const [user, setUser] = useState<{
    fullName: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem('user');


        setToken(storedToken);

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);

          setUser({
            fullName:
              parsedUser.fullName ||
              parsedUser.name ||
              parsedUser.username ||
              'User',

            email: parsedUser.email || '',
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('Error getting user:', error);
        console.log('GET USER ERROR:', error);
        setUser(null);
      }
    };

    getUser();
  }, []);


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setUser(null);
      navigation.replace('Home');
    } catch (error) {
      console.log('Logout error:', error);
    }

  };

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




  const handlelogin = () => {
    navigation.navigate("LogInPage");
    setIsLoading(false);

  };


  const handleSignup = () => {
    navigation.navigate("NewRegistation");
    setIsLoading(false);
  };

  const handleProfileinfo = () => {
    navigation.navigate("ProfileInfo")
  }

  const handleOrderslist = () => {
    navigation.navigate("Orderslist")
  }

  const handleWishlist = () => {
    navigation.navigate("Wishlist")
  }

   const handleCart = () => {
    navigation.navigate("Cart")
  }




  const handleShpo = () => {
    navigation.navigate("Shop")
  }
  const handleBestSeller = () => {
    navigation.navigate("BestSeller")
  }

  const handleBestMegaDels = () => {
    navigation.navigate("MegaDeals")
  }

  const handleNewArrivels = () => {
    navigation.navigate("NewArrivels")
  }


  return (
    <SafeAreaView className="flex-1 bg-[#F8F5EF]">
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: 20,
        }}
      >


        {/* Header Title */}
        <View className="mb-5">
          <Text className="text-2xl font-display italic text-[#1E1B16]">
            Fayk
            <Text className="text-[#A9803F]">aa</Text>
          </Text>
        </View>

        <View className="bg-white rounded-xl border border-[#E2D9C4] overflow-hidden mb-6">

          {/* Profile Information */}
          <TouchableOpacity
            className="flex-row items-center justify-between py-4 px-4 border-b border-[#F0ECE1]"
            onPress={handleShpo}
          >
            <View className="flex-row items-center gap-[14px]">
              <Store size={20} color="#1E1B16" />

              <Text className="text-[15px] font-medium text-[#1E1B16]">
                Shop
              </Text>
            </View>

            <ChevronRight size={18} color="#9A9282" />
          </TouchableOpacity>

          {/* My Orders */}
          <TouchableOpacity
            className="flex-row items-center justify-between py-4 px-4 border-b border-[#F0ECE1]"
            onPress={handleBestSeller}
          >
            <View className="flex-row items-center gap-[14px]">
              <Flame size={20} color="#1E1B16" />

              <Text className="text-[15px] font-medium text-[#1E1B16]">
                Best Seller
              </Text>
            </View>

            <ChevronRight size={18} color="#9A9282" />
          </TouchableOpacity>

          {/* Wishlist */}
          <TouchableOpacity
            className="flex-row items-center justify-between py-4 px-4 border-b border-[#F0ECE1]"
            onPress={handleBestMegaDels}
          >
            <View className="flex-row items-center gap-[14px]">
              <Gift size={20} color="#1E1B16" />

              <Text className="text-[15px] font-medium text-[#1E1B16]">
                Mega Deles
              </Text>
            </View>

            <ChevronRight size={18} color="#9A9282" />
          </TouchableOpacity>

          {/* Cart */}
          <TouchableOpacity
            className="flex-row items-center justify-between py-4 px-4 border-b border-[#F0ECE1]"
            onPress={handleNewArrivels}
          >
            <View className="flex-row items-center gap-[14px]">
              <Sparkles size={20} color="#1E1B16" />

              <Text className="text-[15px] font-medium text-[#1E1B16]">
                New Arrivals
              </Text>
            </View>

            <ChevronRight size={18} color="#9A9282" />
          </TouchableOpacity>

        </View>



        {/* User Info Card */}
        {user ? (
          <>

            <View className="flex-row items-center bg-[#EFEAE0] p-4 rounded-xl mb-6 border border-[#E2D9C4]">
              <View className="w-14 h-14 rounded-xl bg-[#F8F5EF] justify-center items-center">
                <User size={28} color="#A9803F" />
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-base font-semibold text-[#1E1B16]">
                  {user.fullName}
                </Text>

                <Text className="text-[13px] text-[#9A9282] mt-0.5">
                  {user.email}
                </Text>
              </View>
            </View>

            <View className="mb-2">
              <Text className=" font-bold text-[#1E1B16]">
                Profile Setting
              </Text>
            </View>


            {/* Menu Options Section */}
            <View className="bg-white rounded-xl border border-[#E2D9C4] overflow-hidden mb-6">

              {/* Profile Information */}
              <TouchableOpacity
                className="flex-row items-center justify-between py-4 px-4 border-b border-[#F0ECE1]"
                onPress={handleProfileinfo}
              >
                <View className="flex-row items-center gap-[14px]">
                  <User size={20} color="#1E1B16" />

                  <Text className="text-[15px] font-medium text-[#1E1B16]">
                    Profile Info
                  </Text>
                </View>

                <ChevronRight size={18} color="#9A9282" />
              </TouchableOpacity>

              {/* My Orders */}
              <TouchableOpacity
                className="flex-row items-center justify-between py-4 px-4 border-b border-[#F0ECE1]"
                onPress={handleOrderslist}
              >
                <View className="flex-row items-center gap-[14px]">
                  <Package size={20} color="#1E1B16" />

                  <Text className="text-[15px] font-medium text-[#1E1B16]">
                    My Orders
                  </Text>
                </View>

                <ChevronRight size={18} color="#9A9282" />
              </TouchableOpacity>

              {/* Wishlist */}
              <TouchableOpacity
                className="flex-row items-center justify-between py-4 px-4 border-b border-[#F0ECE1]"
                onPress={handleWishlist}
              >
                <View className="flex-row items-center gap-[14px]">
                  <Heart size={20} color="#1E1B16" />

                  <Text className="text-[15px] font-medium text-[#1E1B16]">
                    Wishlist
                  </Text>

                  {wishlistCount > 0 && (
                    <View className="min-w-[20px] h-[20px] rounded-full bg-[#1E1B16] items-center justify-center px-1">
                      <Text className="text-white text-[11px] font-bold text-center">
                        {wishlistCount > 99 ? "99+" : wishlistCount}
                      </Text>
                    </View>
                  )}
                </View>

                <ChevronRight size={18} color="#9A9282" />
              </TouchableOpacity>

              {/* Cart */}
              <TouchableOpacity
                className="flex-row items-center justify-between py-4 px-4 border-b border-[#F0ECE1]"
                onPress={handleCart}
              >
                <View className="flex-row items-center gap-[14px]">
                  <ShoppingCart size={20} color="#1E1B16" />

                  <Text className="text-[15px] font-medium text-[#1E1B16]">
                    Cart
                  </Text>
                  {cartCount > 0 && (
                    <View className="min-w-[20px] h-[20px] rounded-full bg-[#A9803F] items-center justify-center px-1">
                      <Text className="text-white text-[11px] font-bold text-center">
                        {cartCount > 99 ? "99+" : cartCount}
                      </Text>
                    </View>
                  )}
                </View>

                <ChevronRight size={18} color="#9A9282" />
              </TouchableOpacity>

              {/* Manage Devices */}
              <TouchableOpacity
                className="flex-row items-center justify-between py-4 px-4 border-b border-[#F0ECE1]"
                onPress={() => navigation.navigate("ManageDevices")}
              >
                <View className="flex-row items-center gap-[14px]">
                  <Smartphone size={20} color="#1E1B16" />

                  <Text className="text-[15px] font-medium text-[#1E1B16]">
                    Manage Devices
                  </Text>
                </View>

                <ChevronRight size={18} color="#9A9282" />
              </TouchableOpacity>

            </View>




            {/* Logout Button */}
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 bg-[#1E1B16] py-4 rounded-xl"
              onPress={handleLogout}
            >
              <LogOut size={18} color="#F8F5EF" />

              <Text className="text-[#F8F5EF] text-base font-semibold">
                Logout
              </Text>
            </TouchableOpacity>
          </>
        ) : (
       
          <View className="flex-1 bg-[#F8F5EF]">

            {/* Your screen content */}
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 110 }}
            >
              {/* Other content */}
            </ScrollView>
            <View className="flex-row gap-3">
              {/* Sign In */}

              <TouchableOpacity
                onPress={handlelogin}
                disabled={isLoading}
                onPressIn={() => setIsLoginPressed(true)}
                onPressOut={() => setIsLoginPressed(false)}
                className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg py-4 ${isLoading
                  ? "bg-[#D9CFB8]"
                  : isLoginPressed
                    ? "bg-[#A9803F]"
                    : "bg-[#1E1B16]"
                  }`}
              >
                {isLoading ? (
                  <>
                    <ActivityIndicator size="small" color="#9A9282" />

                    <Text className="text-base font-semibold text-[#9A9282]">
                      Signing in...
                    </Text>
                  </>
                ) : (
                  <>
                    <User size={18} color="#F8F5EF" />

                    <Text className="text-base font-semibold text-[#F8F5EF]">
                      Sign In
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Sign Up */}
              <TouchableOpacity
                onPress={handleSignup}
                disabled={isLoading}
                onPressIn={() => setIsSignupPressed(true)}
                onPressOut={() => setIsSignupPressed(false)}
                className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg py-4 ${isLoading
                  ? "bg-[#D9CFB8]"
                  : isSignupPressed
                    ? "bg-[#A9803F]"
                    : "bg-[#1E1B16]"
                  }`}
              >
                {isLoading ? (
                  <>
                    <ActivityIndicator size="small" color="#9A9282" />

                    <Text className="text-base font-semibold text-[#9A9282]">
                      Signing up...
                    </Text>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} color="#F8F5EF" />

                    <Text className="text-base font-semibold text-[#F8F5EF]">
                      Sign Up
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>


        )}
      </ScrollView>
    </SafeAreaView>
  );



}
