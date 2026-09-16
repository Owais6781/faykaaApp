

// import  { useState } from 'react';
// import { styles, palette } from './Header.styles';
// import {
//   View,
//   Text,
//   Image,
//   Pressable,
//   TextInput,
//   TouchableOpacity,
//   LayoutAnimation,
//   Platform,
//   UIManager,
// } from 'react-native';
// import { Search, ShoppingCart, Heart, X,Mic, Camera } from 'lucide-react-native';
//  import { skipToken } from "@reduxjs/toolkit/query";
// import { useGetCartQuery } from "../../services/CartApi";
// import { useGetWishlistQuery } from "../../services/WishlistApi";


// // Enable LayoutAnimation for Android
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }



// export default function Header() {
//    const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const API = process.env.EXPO_PUBLIC_API_URL;

//     const { data: wishlistData } = useGetWishlistQuery(token ? undefined : skipToken);
//   const { data: cartState } = useGetCartQuery(token ? undefined : skipToken);

//    const wishlist = wishlistData?.wishlist || [];
//   const cartItems = Array.isArray(cartState?.cart) ? cartState.cart : [];


//   const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

//   const cartCount = cartItems.reduce(
//     (acc: number, item: any) => acc + (item.quantity || 1),
//     0
//   );



//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isCartPressed, setIsCartPressed] = useState(false);
//   const [isSearchPressed, setIsSearchPressed] = useState(false);
//   const [isProfilePressed, setIsProfilePressed] = useState(false);
//   const [isHeartPressed, setIsHeartPressed] = useState(false);

//   // Dynamic values state for demonstration (should come from props/context)

//   const [userName, setUserName] = useState('User');
//   const [userProfileImageUrl, setUserProfileImageUrl] = useState('https://via.placeholder.com/150/1E1B16/FFFFFF?text=UP'); // Placeholder image

//   const toggleSearch = () => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setIsSearchOpen(!isSearchOpen);
//     if (isSearchOpen) {
//       setSearchQuery('');
//     }
//   };





//    const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     // setDropdownOpen(false);
//     // navigate("/");
//   };


//   return (
//     <View style={styles.container}>
//       {/* Main Header Bar */}
//       <View style={styles.mainHeader}>
//         {/* Left Side - User Profile Button as Avatar and Name */}
//         <Pressable
//           onPressIn={() => setIsProfilePressed(true)}
//           onPressOut={() => setIsProfilePressed(false)}
//           style={[
//             styles.profileButton,
//             isProfilePressed && styles.pressedBackground,
//           ]}
//         >
//           <Image
//             source={{ uri: userProfileImageUrl }}
//             style={styles.profileAvatar}
//           />
//           <Text style={styles.profileNameText}>{userName}</Text>
//         </Pressable>

//         {/* Right Side - Actions (Search, Wishlist, Cart) */}
//         <View style={styles.actionGroup}>
//           {/* Search Toggle Button */}
//           <Pressable
//             onPress={toggleSearch}
//             onPressIn={() => setIsSearchPressed(true)}
//             onPressOut={() => setIsSearchPressed(false)}
//             style={[
//               styles.iconButton,
//               isSearchPressed && styles.pressedBackground,
//             ]}
//           >
//             <Search size={20} color={palette.charcoal} strokeWidth={1.5} />
//           </Pressable>

//           {/* Wishlist Button with Badge */}
//           <Pressable
//             onPressIn={() => setIsHeartPressed(true)}
//             onPressOut={() => setIsHeartPressed(false)}
//             style={[
//               styles.iconButton,
//               isHeartPressed && styles.pressedBackground,
//             ]}
//           >
//           <View>
//           <Heart size={20} color={palette.charcoal} strokeWidth={1.5} />

//             {wishlistCount>0 &&(
//               <View style={styles.wishlistBadge}> 
//            <Text style={styles.badgeText}>{wishlistCount}</Text>
//               </View>
//             )}
//           </View>

          
//           </Pressable>

//           {/* Cart Button with Badge */}
//           <Pressable
//             onPressIn={() => setIsCartPressed(true)}
//             onPressOut={() => setIsCartPressed(false)}
//             style={[
//               styles.iconButton,
//               isCartPressed && styles.pressedBackground,
//             ]}
//           >
//             <View>
//               <ShoppingCart size={20} color={palette.charcoal} strokeWidth={1.5} />
//               {cartCount > 0 && (
//                 <View style={styles.cartBadge}>
//                   <Text style={styles.badgeText}>{cartCount}</Text>
//                 </View>
//               )}
//             </View>
//           </Pressable>
//         </View>
//       </View>

//       {/* Expandable Search Input Bar */}
     

//       {isSearchOpen && (
//   <View style={styles.searchBarContainer}>
//     <View style={styles.searchInputWrapper}>
//       <Search size={18} color={palette.gray800} style={styles.searchIcon} />
      
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search by Keyword..."
//         placeholderTextColor={palette.gray800}
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         autoFocus
//       />

//       {/* Action Icons Right Side */}
//       <View style={styles.searchActionGroup}>
//         {/* Clear Text Button */}
//         {searchQuery.length > 0 && (
//           <TouchableOpacity 
//             onPress={() => setSearchQuery('')}
//             style={styles.actionIconButton}
//           >
//             <X size={16} color={palette.gray800} />
//           </TouchableOpacity>
//         )}

//         {/* Voice Search Button */}
//         <TouchableOpacity 
//           onPress={() => console.log('Voice Search Triggered')}
//           style={styles.actionIconButton}
//         >
//           <Mic size={18} color={palette.charcoal} />
//         </TouchableOpacity>

//         {/* Camera / Visual Search Button */}
//         <TouchableOpacity 
//           onPress={() => console.log('Camera Search Triggered')}
//           style={styles.actionIconButton}
//         >
//           <Camera size={18} color={palette.charcoal} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// )}
//     </View>
//   );
// }



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

import {
  Search,
  ShoppingCart,
  Heart,
  X,
  Mic,
  Camera,
} from "lucide-react-native";

import { skipToken } from "@reduxjs/toolkit/query";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useGetCartQuery } from "../../services/CartApi";
import { useGetWishlistQuery } from "../../services/WishlistApi";

import { styles,  } from "./Header.styles";
import {palette} from "../../globaltheme/colors"
// Android LayoutAnimation
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Header() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCartPressed, setIsCartPressed] = useState(false);
  const [isSearchPressed, setIsSearchPressed] = useState(false);
  const [isProfilePressed, setIsProfilePressed] = useState(false);
  const [isHeartPressed, setIsHeartPressed] = useState(false);

  const [userName, setUserName] = useState("User");

  const [userProfileImageUrl, setUserProfileImageUrl] = useState(
    "https://via.placeholder.com/150/1E1B16/FFFFFF?text=UP"
  );

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

          setUser(parsedUser);

          setUserName(
            parsedUser?.name ||
              parsedUser?.username ||
              parsedUser?.firstName ||
              "User"
          );

          if (parsedUser?.profileImage) {
            setUserProfileImageUrl(parsedUser.profileImage);
          }
        }
      } catch (error) {
        console.log("User data error:", error);
      }
    };

    loadUserData();
  }, []);

  // =========================
  // Cart / Wishlist
  // =========================

  const { data: wishlistData } = useGetWishlistQuery(
    token ? undefined : skipToken
  );

  const { data: cartState } = useGetCartQuery(
    token ? undefined : skipToken
  );

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

  // =========================
  // Logout
  // =========================

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      setToken(null);
      setUser(null);
      setUserName("User");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>

      {/* ================= HEADER ================= */}

      <View style={styles.mainHeader}>

        {/* Profile */}

        <Pressable
          onPressIn={() => setIsProfilePressed(true)}
          onPressOut={() => setIsProfilePressed(false)}
          style={[
            styles.profileButton,
            isProfilePressed && styles.pressedBackground,
          ]}
        >
          <Image
            source={{ uri: userProfileImageUrl }}
            style={styles.profileAvatar}
          />

          <Text style={styles.profileNameText}>
            {userName}
          </Text>
        </Pressable>

        {/* Actions */}

        <View style={styles.actionGroup}>

          {/* Search */}

          <Pressable
            onPress={toggleSearch}
            onPressIn={() => setIsSearchPressed(true)}
            onPressOut={() => setIsSearchPressed(false)}
            style={[
              styles.iconButton,
              isSearchPressed && styles.pressedBackground,
            ]}
          >
            <Search
              size={20}
              color={palette.charcoal}
              strokeWidth={1.5}
            />
          </Pressable>

          {/* Wishlist */}

          <Pressable
            onPressIn={() => setIsHeartPressed(true)}
            onPressOut={() => setIsHeartPressed(false)}
            style={[
              styles.iconButton,
              isHeartPressed && styles.pressedBackground,
            ]}
          >
            <View>

              <Heart
                size={20}
                color={palette.charcoal}
                strokeWidth={1.5}
              />

              {wishlistCount > 0 && (
                <View style={styles.wishlistBadge}>
                  <Text style={styles.badgeText}>
                    {wishlistCount}
                  </Text>
                </View>
              )}

            </View>
          </Pressable>

          {/* Cart */}

          <Pressable
            onPressIn={() => setIsCartPressed(true)}
            onPressOut={() => setIsCartPressed(false)}
            style={[
              styles.iconButton,
              isCartPressed && styles.pressedBackground,
            ]}
          >
            <View>

              <ShoppingCart
                size={20}
                color={palette.charcoal}
                strokeWidth={1.5}
              />

              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.badgeText}>
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
        <View style={styles.searchBarContainer}>

          <View style={styles.searchInputWrapper}>

            <Search
              size={18}
              color={palette.gray800}
              style={styles.searchIcon}
            />

            <TextInput
              style={styles.searchInput}
              placeholder="Search by Keyword..."
              placeholderTextColor={palette.gray800}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />

            <View style={styles.searchActionGroup}>

              {/* Clear */}

              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={styles.actionIconButton}
                >
                  <X
                    size={16}
                    color={palette.gray800}
                  />
                </TouchableOpacity>
              )}

              {/* Mic */}

              <TouchableOpacity
                onPress={() =>
                  console.log("Voice Search Triggered")
                }
                style={styles.actionIconButton}
              >
                <Mic
                  size={18}
                  color={palette.charcoal}
                />
              </TouchableOpacity>

              {/* Camera */}

              <TouchableOpacity
                onPress={() =>
                  console.log("Camera Search Triggered")
                }
                style={styles.actionIconButton}
              >
                <Camera
                  size={18}
                  color={palette.charcoal}
                />
              </TouchableOpacity>

            </View>
          </View>
        </View>
      )}

    </View>
  );
}