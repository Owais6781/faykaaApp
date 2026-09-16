


import  { useState, } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  Package,
  User,
} from 'lucide-react-native';

import { styles, } from './Footer.styles';
import {palette} from "../../globaltheme/colors"
export default function Footer() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('Home');

  // Navigation Items Array
  const navItems = [
    { id: 'Home', label: 'Home', Icon: Home },
    { id: 'Shop', label: 'Shop', Icon: LayoutGrid },
    { id: 'Cart', label: 'Cart', Icon: ShoppingCart },
    { id: 'Orders', label: 'Orders', Icon: Package },
    { id: 'User', label: 'User', Icon: User },
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
    <View style={styles.container}>
      <View style={styles.navRow}>
        {navItems.map((item) => {
          const IconComponent = item.Icon;
          const isActive = activeTab === item.id;
          const iconColor = isActive ? palette.terracotta : palette.gray;

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.tabButton}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
            >
              <IconComponent size={22} color={iconColor} strokeWidth={2} />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.activeTabLabel,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}