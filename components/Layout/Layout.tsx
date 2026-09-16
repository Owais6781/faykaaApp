
import { View, ScrollView,  } from "react-native";


import  {styles}   from "./Layout.style";
import Header from "../Header/Header";
import Footer from "../BottomNav/Footer";

export default function Layout({ children }: any) {
  return (
    <View style={styles.safeArea}>
      <View style={styles.mainContainer}>
        {/* Top Fixed Header */}
        <Header />

        {/* Middle Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {children}
        </ScrollView>

        {/* Bottom Fixed Footer */}
        <View style={styles.footerContainer}>
          <Footer />
        </View>
      </View>
    </View>
  );
}


