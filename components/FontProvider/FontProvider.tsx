


// import React from "react";
// import { Text as RNText, TextProps, StyleSheet } from "react-native";

// // 1. AppTextProps interface mein variant aur baaki TextProps include karein
// export interface AppTextProps extends TextProps {
//   variant?: "display" | "displaySemiBold" | "ui" | "uiMedium" | "uiSemiBold" | "uiBold";
//   children?: React.ReactNode;
// }

// export const AppText: React.FC<AppTextProps> = ({
//   children,
//   style,
//   variant = "ui",
//   ...props
// }) => {
//   return (
//     <RNText style={[styles[variant], style]} {...props}>
//       {children}
//     </RNText>
//   );
// };

// const styles = StyleSheet.create({
//   // Font display styles (Cormorant Garamond)
//   display: {
//     fontFamily: "CormorantGaramond-Italic",
//   },
//   displaySemiBold: {
//     fontFamily: "CormorantGaramond-SemiBoldItalic",
//   },

//   // Font UI styles (Inter)
//   ui: {
//     fontFamily: "Inter-Regular",
//   },
//   uiMedium: {
//     fontFamily: "Inter-Medium",
//   },
//   uiSemiBold: {
//     fontFamily: "Inter-SemiBold",
//   },
//   uiBold: {
//     fontFamily: "Inter-Bold",
//   },
// });


// import React, { createContext, useContext } from "react";
// import { useFonts } from "expo-font";

// import {
//   CormorantGaramond_500Medium,
//   CormorantGaramond_600SemiBold,
//   CormorantGaramond_500Medium_Italic,
// } from "@expo-google-fonts/cormorant-garamond";

// import {
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_600SemiBold,
//   Inter_700Bold,
// } from "@expo-google-fonts/inter";

// const FontContext = createContext(false);

// export const FontProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [fontsLoaded] = useFonts({
//     // Cormorant Garamond
//     CormorantMedium: CormorantGaramond_500Medium,
//     CormorantSemiBold: CormorantGaramond_600SemiBold,
//     CormorantItalic: CormorantGaramond_500Medium_Italic,

//     // Inter
//     InterRegular: Inter_400Regular,
//     InterMedium: Inter_500Medium,
//     InterSemiBold: Inter_600SemiBold,
//     InterBold: Inter_700Bold,
//   });

//   if (!fontsLoaded) {
//     return null;
//   }

//   return (
//     <FontContext.Provider value={fontsLoaded}>
//       {children}
//     </FontContext.Provider>
//   );
// };

// export const useAppFonts = () => useContext(FontContext);


import React, {
  createContext,
  useContext,
} from "react";

import {
  Text as RNText,
  TextProps,
} from "react-native";

import { useFonts } from "expo-font";

import {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_500Medium_Italic,
} from "@expo-google-fonts/cormorant-garamond";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";


// ========================================
// FONT CONTEXT
// ========================================

const FontContext = createContext(false);


// ========================================
// FONT PROVIDER
// ========================================

export const FontProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [fontsLoaded] = useFonts({

    // Cormorant Garamond
    CormorantMedium:
      CormorantGaramond_500Medium,

    CormorantSemiBold:
      CormorantGaramond_600SemiBold,

    CormorantItalic:
      CormorantGaramond_500Medium_Italic,


    // Inter
    InterRegular:
      Inter_400Regular,

    InterMedium:
      Inter_500Medium,

    InterSemiBold:
      Inter_600SemiBold,

    InterBold:
      Inter_700Bold,
  });


  if (!fontsLoaded) {
    return null;
  }


  return (
    <FontContext.Provider value={fontsLoaded}>
      {children}
    </FontContext.Provider>
  );
};


// ========================================
// FONT HOOK
// ========================================

export const useAppFonts = () =>
  useContext(FontContext);


// ========================================
// APP TEXT
// ========================================

interface AppTextProps extends TextProps {
  children?: React.ReactNode;
  className?: string;
}


export const AppText = ({
  children,
  className = "",
  ...props
}: AppTextProps) => {

  return (
    <RNText
      {...props}
      className={`font-ui ${className}`}
    >
      {children}
    </RNText>
  );
};