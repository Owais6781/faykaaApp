import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";

import {
  Home,
  LayoutGrid,
  ShoppingCart,
  Package,
  User,
  Search,
  X,
  Smartphone,
  Heart,
  UserPlus,
  LogOut,
  Store,
  Sparkles,
  Flame,
  Gift,
} from "lucide-react-native";

export default function BottomNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Temporary values
  const user = null;
  const wishlistCount = 3;
  const cartCount = 5;

  const navigate = (screen: string) => {
    console.log("Navigate:", screen);

    // Yahan React Navigation lagana hai
    // navigation.navigate(screen);
    
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // AsyncStorage se token/user remove karna
    setMobileMenuOpen(false);

    console.log("Logout");
  };

  return (
    <>
      {/* ================= BOTTOM NAV ================= */}

      <View className="absolute bottom-0 left-0 right-0 z-50 h-20 border-t border-[#E2D9C4] bg-[#F8F5EF]">
        <View className="h-full flex-row items-center justify-between px-2">

          {/* HOME */}
          <TouchableOpacity
            onPress={() => navigate("Home")}
            className="flex-1 items-center justify-center"
          >
            <Home size={22} color="#A9803F" />

            <Text className="mt-1 text-[10px] font-medium text-[#A9803F]">
              Home
            </Text>
          </TouchableOpacity>

          {/* SHOP */}
          <TouchableOpacity
            onPress={() => navigate("Shop")}
            className="flex-1 items-center justify-center"
          >
            <LayoutGrid size={22} color="#9A9282" />

            <Text className="mt-1 text-[10px] font-medium text-[#9A9282]">
              Shop
            </Text>
          </TouchableOpacity>

          {/* CART */}
          <TouchableOpacity
            onPress={() => navigate("Cart")}
            className="flex-1 items-center justify-center"
          >
            <View>
              <ShoppingCart size={22} color="#9A9282" />

              {cartCount > 0 && (
                <View className="absolute -right-3 -top-2 min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#A9803F] px-1">
                  <Text className="text-[9px] font-bold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Text>
                </View>
              )}
            </View>

            <Text className="mt-1 text-[10px] font-medium text-[#9A9282]">
              Cart
            </Text>
          </TouchableOpacity>

          {/* ORDERS */}
          <TouchableOpacity
            onPress={() => navigate("Orders")}
            className="flex-1 items-center justify-center"
          >
            <Package size={22} color="#9A9282" />

            <Text className="mt-1 text-[10px] font-medium text-[#9A9282]">
              Orders
            </Text>
          </TouchableOpacity>

          {/* USER */}
          <TouchableOpacity
            onPress={() => setMobileMenuOpen(true)}
            className="flex-1 items-center justify-center"
          >
            <User
              size={22}
              color={user ? "#A9803F" : "#9A9282"}
            />

            <Text className="mt-1 max-w-[55px] text-[10px] font-medium text-[#9A9282]">
              {user ? "User" : "You"}
            </Text>
          </TouchableOpacity>

        </View>
      </View>


      {/* ================= DRAWER ================= */}

      <Modal
        visible={mobileMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMobileMenuOpen(false)}
      >

        <View className="flex-1 flex-row">

          {/* OVERLAY */}

          <Pressable
            onPress={() => setMobileMenuOpen(false)}
            className="flex-1 bg-black/40"
          />

          {/* RIGHT DRAWER */}

          <View className="h-full w-[85%] bg-[#F8F5EF]">

            <View className="flex-1">

              {/* HEADER */}

              <View className="flex-row items-center justify-between border-b border-[#E2D9C4] p-5">

                <Text className="text-2xl font-bold italic text-[#1E1B16]">
                  Fayk
                  <Text className="text-[#A9803F]">
                    aa
                  </Text>
                </Text>

                <TouchableOpacity
                  onPress={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2"
                >
                  <X size={22} color="#1E1B16" />
                </TouchableOpacity>

              </View>


              {/* SEARCH */}

              <View className="border-b border-[#E2D9C4] p-4">

                <View className="flex-row items-center rounded-lg border border-[#E2D9C4] bg-white px-3">

                  <Search size={18} color="#B3AB97" />

                  <TextInput
                    placeholder="Search products..."
                    placeholderTextColor="#B3AB97"
                    className="flex-1 py-3 pl-2 text-[#1E1B16]"
                  />

                </View>

              </View>


              {/* MENU */}

              <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
                contentContainerStyle={{
                  padding: 16,
                }}
              >

                {/* HOME */}

                <TouchableOpacity
                  onPress={() => navigate("Home")}
                  className="mb-1 flex-row items-center rounded-lg px-4 py-3"
                >
                  <Home size={20} color="#1E1B16" />

                  <Text className="ml-3 font-medium text-[#1E1B16]">
                    Home
                  </Text>
                </TouchableOpacity>


                {/* SHOP */}

                <TouchableOpacity
                  onPress={() => navigate("Shop")}
                  className="mb-1 flex-row items-center rounded-lg px-4 py-3"
                >
                  <Store size={20} color="#1E1B16" />

                  <Text className="ml-3 font-medium text-[#1E1B16]">
                    Shop
                  </Text>
                </TouchableOpacity>


                {/* BEST SELLER */}

                <TouchableOpacity
                  onPress={() => navigate("BestSeller")}
                  className="mb-1 flex-row items-center rounded-lg px-4 py-3"
                >
                  <Flame size={20} color="#1E1B16" />

                  <Text className="ml-3 font-medium text-[#1E1B16]">
                    Best Seller
                  </Text>
                </TouchableOpacity>


                {/* MEGA DEALS */}

                <TouchableOpacity
                  onPress={() => navigate("MegaDeals")}
                  className="mb-1 flex-row items-center rounded-lg px-4 py-3"
                >
                  <Gift size={20} color="#1E1B16" />

                  <Text className="ml-3 font-medium text-[#1E1B16]">
                    Mega Deals
                  </Text>
                </TouchableOpacity>


                {/* NEW ARRIVALS */}

                <TouchableOpacity
                  onPress={() => navigate("NewArrivals")}
                  className="mb-1 flex-row items-center rounded-lg px-4 py-3"
                >
                  <Sparkles size={20} color="#1E1B16" />

                  <Text className="ml-3 font-medium text-[#1E1B16]">
                    New Arrivals
                  </Text>
                </TouchableOpacity>


                {/* USER MENU */}

                <View className="my-4 border-t border-[#E2D9C4]" />


                {user ? (
                  <>

                    {/* USER INFO */}

                    <View className="mb-4 flex-row items-center rounded-lg bg-[#EFEAE0] p-3">

                      <View className="h-12 w-12 items-center justify-center rounded-lg bg-[#F8F5EF]">
                        <User size={22} color="#A9803F" />
                      </View>

                      <View className="ml-3 flex-1">

                        <Text className="font-semibold text-[#1E1B16]">
                          User Name
                        </Text>

                        <Text className="text-xs text-[#9A9282]">
                          user@email.com
                        </Text>

                      </View>

                    </View>


                    {/* PROFILE */}

                    <TouchableOpacity
                      onPress={() => navigate("ProfileInfo")}
                      className="flex-row items-center rounded-lg px-4 py-3"
                    >
                      <User size={18} color="#1E1B16" />

                      <Text className="ml-3 text-sm font-medium text-[#1E1B16]">
                        Profile Info
                      </Text>
                    </TouchableOpacity>


                    {/* ORDERS */}

                    <TouchableOpacity
                      onPress={() => navigate("Orders")}
                      className="flex-row items-center rounded-lg px-4 py-3"
                    >
                      <Package size={18} color="#1E1B16" />

                      <Text className="ml-3 text-sm font-medium text-[#1E1B16]">
                        My Orders
                      </Text>
                    </TouchableOpacity>


                    {/* WISHLIST */}

                    <TouchableOpacity
                      onPress={() => navigate("Wishlist")}
                      className="flex-row items-center justify-between rounded-lg px-4 py-3"
                    >

                      <View className="flex-row items-center">

                        <Heart size={18} color="#1E1B16" />

                        <Text className="ml-3 text-sm font-medium text-[#1E1B16]">
                          Wishlist
                        </Text>

                      </View>

                      {wishlistCount > 0 && (
                        <View className="min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#1E1B16] px-1">
                          <Text className="text-[10px] font-bold text-white">
                            {wishlistCount}
                          </Text>
                        </View>
                      )}

                    </TouchableOpacity>


                    {/* CART */}

                    <TouchableOpacity
                      onPress={() => navigate("Cart")}
                      className="flex-row items-center justify-between rounded-lg px-4 py-3"
                    >

                      <View className="flex-row items-center">

                        <ShoppingCart
                          size={18}
                          color="#1E1B16"
                        />

                        <Text className="ml-3 text-sm font-medium text-[#1E1B16]">
                          Cart
                        </Text>

                      </View>

                      {cartCount > 0 && (
                        <View className="min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#A9803F] px-1">
                          <Text className="text-[10px] font-bold text-white">
                            {cartCount}
                          </Text>
                        </View>
                      )}

                    </TouchableOpacity>


                    {/* MANAGE DEVICES */}

                    <TouchableOpacity
                      onPress={() => navigate("ManageDevices")}
                      className="flex-row items-center rounded-lg px-4 py-3"
                    >
                      <Smartphone
                        size={18}
                        color="#1E1B16"
                      />

                      <Text className="ml-3 text-sm font-medium text-[#1E1B16]">
                        Manage Devices
                      </Text>
                    </TouchableOpacity>


                    {/* LOGOUT */}

                    <TouchableOpacity
                      onPress={handleLogout}
                      className="mt-4 flex-row items-center justify-center rounded-lg bg-[#1E1B16] py-3"
                    >
                      <LogOut size={18} color="#F8F5EF" />

                      <Text className="ml-2 font-semibold text-[#F8F5EF]">
                        Logout
                      </Text>
                    </TouchableOpacity>

                  </>
                ) : (
                  <>

                    {/* SIGN IN */}

                    <TouchableOpacity
                      onPress={() => navigate("Login")}
                      className="flex-row items-center justify-center rounded-lg bg-[#1E1B16] py-3"
                    >
                      <User size={18} color="#F8F5EF" />

                      <Text className="ml-2 font-semibold text-[#F8F5EF]">
                        Sign In
                      </Text>
                    </TouchableOpacity>


                    {/* SIGN UP */}

                    <TouchableOpacity
                      onPress={() => navigate("Register")}
                      className="mt-3 flex-row items-center justify-center rounded-lg border border-[#E2D9C4] py-3"
                    >
                      <UserPlus
                        size={18}
                        color="#1E1B16"
                      />

                      <Text className="ml-2 font-semibold text-[#1E1B16]">
                        Sign Up
                      </Text>
                    </TouchableOpacity>

                  </>
                )}

              </ScrollView>


              {/* FOOTER */}

              <View className="border-t border-[#E2D9C4] bg-[#EFEAE0] p-4">

                <Text className="text-center text-xs text-[#9A9282]">
                  © 2026 Faykaa. All Rights Reserved.
                </Text>

              </View>

            </View>

          </View>

        </View>

      </Modal>
    </>
  );
}