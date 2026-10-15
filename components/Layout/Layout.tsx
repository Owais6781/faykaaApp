
import { View, ScrollView, } from "react-native";
import { Header } from "../Header/Header";
import { BottomNav } from "../BottomNav/BottomNav";
import { useRoute } from "@react-navigation/native";



interface LayoutProps {
  isScrolled?: boolean;
  children: React.ReactNode;
}

export const Layout = ({ isScrolled = false, children }: LayoutProps) => {
  const route = useRoute();
  const isHome = route.name === "Home";

  return (
    <View className="flex-1 bg-bgcream">
      <View className="flex-1 relative">
        {/* Top Fixed Header */}
        {isHome && <Header isScrolled={isScrolled} />}

        {/* Middle Scrollable Content */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 90 }} // Kept inline for exact arbitrary spacing if needed, or use pb-[90px]
        >
          {children}
        </ScrollView>

        {/* Absolute Footer */}
        <View className="absolute bottom-0 left-0 right-0 z-[999] elevation-[10]">
          <BottomNav />
        </View>
      </View>
    </View>
  );
}


