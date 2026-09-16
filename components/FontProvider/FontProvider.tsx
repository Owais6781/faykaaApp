// import  { createContext, useContext, ReactNode } from "react";
// import { View, ActivityIndicator, StyleSheet } from "react-native";
// import {
//   useFonts,
//   CormorantGaramond_500Medium_Italic,
//   CormorantGaramond_600SemiBold_Italic,
// } from "@expo-google-fonts/cormorant-garamond";
// import {
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_600SemiBold,
//   Inter_700Bold,
// } from "@expo-google-fonts/inter";

// const FontContext = createContext({ isLoaded: false });

// export const FontProvider = ({ children }: { children: ReactNode }) => {
//   const [fontsLoaded] = useFonts({
//     // font-display
//     "CormorantGaramond-Italic": CormorantGaramond_500Medium_Italic,
//     "CormorantGaramond-SemiBoldItalic": CormorantGaramond_600SemiBold_Italic,

//     // font-ui
//     "Inter-Regular": Inter_400Regular,
//     "Inter-Medium": Inter_500Medium,
//     "Inter-SemiBold": Inter_600SemiBold,
//     "Inter-Bold": Inter_700Bold,
//   });

//   if (!fontsLoaded) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#A9803F" />
//       </View>
//     );
//   }

//   return (
//     <FontContext.Provider value={{ isLoaded: fontsLoaded }}>
//       {children}
//     </FontContext.Provider>
//   );
// };

// export const useAppFonts = () => useContext(FontContext);

// const styles = StyleSheet.create({
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8F5EF",
//   },
// });



import React from "react";
import { Text as RNText, TextProps, StyleSheet } from "react-native";

// 1. AppTextProps interface mein variant aur baaki TextProps include karein
export interface AppTextProps extends TextProps {
  variant?: "display" | "displaySemiBold" | "ui" | "uiMedium" | "uiSemiBold" | "uiBold";
  children?: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  children,
  style,
  variant = "ui",
  ...props
}) => {
  return (
    <RNText style={[styles[variant], style]} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  // Font display styles (Cormorant Garamond)
  display: {
    fontFamily: "CormorantGaramond-Italic",
  },
  displaySemiBold: {
    fontFamily: "CormorantGaramond-SemiBoldItalic",
  },

  // Font UI styles (Inter)
  ui: {
    fontFamily: "Inter-Regular",
  },
  uiMedium: {
    fontFamily: "Inter-Medium",
  },
  uiSemiBold: {
    fontFamily: "Inter-SemiBold",
  },
  uiBold: {
    fontFamily: "Inter-Bold",
  },
});