


import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  Package,
  User,
  Check,
} from 'lucide-react-native';

import { palette } from "../../globaltheme/colors"
export const BottomNav = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('Home');
  const [user, setUser] = useState<any>(null);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");


      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("USER LOAD ERROR:", error);
      setUser(null);
    }
  };


  useEffect(() => {
    loadUser();
  }, []);
  // Navigation Items Array
  const navItems = [
    { id: 'Home', label: 'Home', Icon: Home },
    { id: 'Cart', label: 'Cart', Icon: ShoppingCart },
    { id: 'Shop', label: 'Shop', Icon: LayoutGrid },
    { id: 'Orderslist', label: 'Orders', Icon: Package },
    { id: 'Profile', label: user?.fullName?.split(" ")[0] || "You", Icon: User },
  ];

  const handlePress = (item: { id: string; label: string }) => {
    setActiveTab(item.id);

    // React Navigation ke through respective screen par navigate karna
    try {
      navigation.navigate(item.id);
    } catch (error) {
      console.log("Navigation error:", error);
    }
  };

  return (
   
      <View className="flex-1 bg-white ">
        <SafeAreaView edges={['bottom']} className="bg-white">
        {/* Outer Nav Row Container */}
        <View className="flex-row items-center justify-around  bg-white  ">
          {navItems.map((item: any) => {
            const IconComponent = item.Icon;
            const isActive = activeTab === item.id;
            // Tailwind mein inline dynamic colors ke liye aap style ya dynamic class use kar sakte hain
            const iconColor = isActive ? palette.terracotta : palette.gray;

            return (
              <TouchableOpacity
                key={item.id}
                className="flex-1 items-center justify-center py-1"
                onPress={() => handlePress(item)}
                activeOpacity={0.7}
              >
                {/* Icon Wrapper */}
                <View className="relative items-center justify-center">
                  <IconComponent
                    size={22}
                    color={iconColor}
                    strokeWidth={2}
                  />

                  {/* Profile Active Badge */}
                  {item.id === "Profile" && user && (
                    <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-3.5 h-3.5 items-center justify-center border border-white">
                      <Check
                        size={8}
                        color="#FFFFFF"
                        strokeWidth={3}
                      />
                    </View>
                  )}
                </View>

                {/* Tab Label */}
                <Text
                  className={`text-xs mt-1 font-medium 
                  ${isActive
                      ? "text-goldtext font-semibold"
                      : "text-graytextcolor"
                    }`}

                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        </SafeAreaView>
      </View>
   
  );

}
