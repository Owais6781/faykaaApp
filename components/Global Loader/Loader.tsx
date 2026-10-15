
import { View, Modal, Animated, Easing, } from "react-native";
import { AppText } from "../FontProvider/FontProvider"; // Path apne folder structure ke hisaاب se adjust kar lein
import { useEffect, useRef } from "react";

interface AppLoaderProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
}
export const AppLoader = ({
  visible,
  title = "Loading...",
  subtitle,
}: AppLoaderProps) => {

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    rotateAnim.setValue(0);

    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [visible, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });


  

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View className="flex-1 bg-bgcream items-center justify-center px-4">

        {/* Animated Spinner */}
        <View className="w-12 h-12 items-center justify-center">

          {/* Background Circle */}
          <View className="absolute inset-0 rounded-full border border-textcolor" />

          {/* Rotating Circle */}
          <Animated.View
            style={{
              transform: [{ rotate }],
            }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-goldtext"
          />

        </View>

        {/* Title */}
        <AppText className="mt-6 text-[22px] italic text-blacktext text-center">
          {title}
        </AppText>

        {/* Subtitle */}
        {subtitle ? (
          <AppText className="text-[13px] text-[#9A9282] mt-1 text-center">
            {subtitle}
          </AppText>
        ) : null}

      </View>
    </Modal>
  );
};




// import  { useEffect, useRef } from 'react';
// import { View, Image, Animated, Easing } from 'react-native';

//  export const AppLoader=() =>{
//   // Animation value reference create karein
//   const scaleValue = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     // Continuous pulsing loop animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(scaleValue, {
//           toValue: 1.2, // Zoom in
//           duration: 800,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(scaleValue, {
//           toValue: 1, // Zoom out to original size
//           duration: 800,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, [scaleValue]);

//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       {/* Animated Image Component */}
//       <Animated.Image
//         source={require('../../assets/faykaimg/')}
//         style={{
//           width: 80,
//           height: 80,
//           transform: [{ scale: scaleValue }],
//         }}
//         resizeMode="contain"
//       />
//     </View>
//   );
// }










// /**
//  * FaykaaLoader.js — React Native (Expo) version
//  *
//  * Install:
//  *   npx expo install react-native-svg expo-font expo-splash-screen
//  *   npx expo install @expo-google-fonts/great-vibes @expo-google-fonts/cormorant-garamond @expo-google-fonts/jost
//  *
//  * Usage (App.js):
//  *   import FaykaaLoader from './FaykaaLoader';
//  *
//  *   export default function App() {
//  *     const [loading, setLoading] = useState(true);
//  *     useEffect(() => { const t = setTimeout(() => setLoading(false), 2500); return () => clearTimeout(t); }, []);
//  *     return (
//  *       <View style={{ flex: 1 }}>
//  *         <YourApp />
//  *         <FaykaaLoader visible={loading} />
//  *       </View>
//  *     );
//  *   }
//  */
// import React, { useEffect, useMemo, useRef } from 'react';
// import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
// import Svg, {
//   Circle,
//   Defs,
//   Ellipse,
//   G,
//   LinearGradient,
//   RadialGradient,
//   Stop,
//   Text as SvgText,
// } from 'react-native-svg';
// import { useFonts, GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
// import { CormorantGaramond_500Medium } from '@expo-google-fonts/cormorant-garamond';
// import { Jost_400Regular } from '@expo-google-fonts/jost';

// const SIZE = 260;
// const ROSE_TEXT = '#b57a6b';
// // viewBox is shifted so the ring centre (150,165) is the centre of each layer,
// // which lets us rotate whole layers around the ring centre.
// const VIEWBOX = '0 15 300 300';
// const CX = 150;
// const CY = 165;

// /* one full-size SVG layer */
// const Layer = ({ children, defs }) => (
//   <Svg width={SIZE} height={SIZE} viewBox={VIEWBOX} style={StyleSheet.absoluteFill}>
//     {defs}
//     {children}
//   </Svg>
// );

// const sharedDefs = (
//   <Defs>
//     <LinearGradient id="roseGrad" x1="0" y1="0" x2="1" y2="1">
//       <Stop offset="0" stopColor="#f6cfc1" />
//       <Stop offset="0.35" stopColor="#d6897a" />
//       <Stop offset="0.65" stopColor="#f1bfae" />
//       <Stop offset="1" stopColor="#b9705f" />
//     </LinearGradient>
//     <LinearGradient id="roseGrad2" x1="1" y1="0" x2="0" y2="1">
//       <Stop offset="0" stopColor="#e9a998" />
//       <Stop offset="0.5" stopColor="#fbe0d6" />
//       <Stop offset="1" stopColor="#c6806f" />
//     </LinearGradient>
//     <LinearGradient id="textGrad" x1="0" y1="0" x2="1" y2="1">
//       <Stop offset="0" stopColor="#e2a291" />
//       <Stop offset="0.5" stopColor="#b9705f" />
//       <Stop offset="1" stopColor="#d99a89" />
//     </LinearGradient>
//     <RadialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
//       <Stop offset="0" stopColor="#ffffff" stopOpacity="1" />
//       <Stop offset="0.55" stopColor="#fdeee8" stopOpacity="0.8" />
//       <Stop offset="1" stopColor="#f4c3b3" stopOpacity="0" />
//     </RadialGradient>
//     <RadialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
//       <Stop offset="0.7" stopColor="#f4b9a8" stopOpacity="0" />
//       <Stop offset="0.88" stopColor="#f4b9a8" stopOpacity="0.45" />
//       <Stop offset="1" stopColor="#f4b9a8" stopOpacity="0" />
//     </RadialGradient>
//   </Defs>
// );

// /* simple seeded random so sparkles don't jump on re-render */
// const seeded = (seed) => () => {
//   seed = (seed * 9301 + 49297) % 233280;
//   return seed / 233280;
// };

// /* loops a rotation 0 -> 360deg */
// const useSpin = (duration, reverse = false) => {
//   const v = useRef(new Animated.Value(0)).current;
//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.timing(v, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true })
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [v, duration]);
//   return v.interpolate({
//     inputRange: [0, 1],
//     outputRange: reverse ? ['360deg', '0deg'] : ['0deg', '360deg'],
//   });
// };

// const Dot = ({ delay }) => {
//   const o = useRef(new Animated.Value(0.2)).current;
//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.delay(delay),
//         Animated.timing(o, { toValue: 1, duration: 350, useNativeDriver: true }),
//         Animated.timing(o, { toValue: 0.2, duration: 350, useNativeDriver: true }),
//         Animated.delay(700 - delay),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [o, delay]);
//   return <Animated.Text style={{ opacity: o }}>.</Animated.Text>;
// };

// export default function FaykaaLoader({ visible = true }) {
//   const [fontsLoaded] = useFonts({
//     GreatVibes_400Regular,
//     CormorantGaramond_500Medium,
//     Jost_400Regular,
//   });

//   const ringSpin = useSpin(6000);
//   const swirlSpin = useSpin(9000, true);
//   const sparkleSpin = useSpin(18000);

//   /* glow breathing */
//   const breathe = useRef(new Animated.Value(0)).current;
//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(breathe, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//         Animated.timing(breathe, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [breathe]);
//   const glowScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.04] });
//   const glowOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1] });

//   /* fade out when visible -> false */
//   const fade = useRef(new Animated.Value(1)).current;
//   const [mounted, setMounted] = React.useState(visible);
//   useEffect(() => {
//     if (visible) {
//       setMounted(true);
//       fade.setValue(1);
//     } else {
//       Animated.timing(fade, { toValue: 0, duration: 600, useNativeDriver: true }).start(() =>
//         setMounted(false)
//       );
//     }
//   }, [visible, fade]);

//   /* pearls + sparkles */
//   const swirlDots = useMemo(() => {
//     const dots = [];
//     for (let arm = 0; arm < 2; arm++) {
//       for (let i = 0; i < 46; i++) {
//         const t = i / 46;
//         const ang = arm * Math.PI + t * Math.PI * 3.2;
//         const rad = 8 + t * 62;
//         dots.push({
//           key: `s${arm}-${i}`,
//           x: CX + Math.cos(ang) * rad,
//           y: CY + Math.sin(ang) * rad,
//           r: 0.6 + t * 1.5,
//           o: 0.25 + t * 0.6,
//           c: t > 0.6 ? '#d99a89' : '#efc2b4',
//         });
//       }
//     }
//     return dots;
//   }, []);

//   const sparkleDots = useMemo(() => {
//     const rnd = seeded(7);
//     return Array.from({ length: 26 }, (_, j) => {
//       const a = rnd() * Math.PI * 2;
//       const r = 98 + rnd() * 22;
//       return {
//         key: `p${j}`,
//         x: CX + Math.cos(a) * r,
//         y: CY + Math.sin(a) * r,
//         r: 0.5 + rnd() * 1.4,
//         o: 0.25 + rnd() * 0.55,
//       };
//     });
//   }, []);

//   if (!mounted) return null;

//   return (
//     <Animated.View style={[styles.overlay, { opacity: fade }]} pointerEvents={visible ? 'auto' : 'none'}>
//       {fontsLoaded && (
//         <>
//           <View style={styles.logoWrap}>
//             {/* glow */}
//             <Animated.View
//               style={[StyleSheet.absoluteFill, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}
//             >
//               <Layer defs={sharedDefs}>
//                 <Circle cx={CX} cy={CY} r={112} fill="url(#outerGlow)" />
//                 <Circle cx={CX} cy={CY} r={86} fill="url(#innerGlow)" />
//               </Layer>
//             </Animated.View>

//             {/* pearl swirl */}
//             <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: swirlSpin }] }]}>
//               <Layer>
//                 {swirlDots.map((d) => (
//                   <Circle key={d.key} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity={d.o} />
//                 ))}
//               </Layer>
//             </Animated.View>

//             {/* rose-gold ring */}
//             <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: ringSpin }] }]}>
//               <Layer defs={sharedDefs}>
//                 <Circle cx={CX} cy={CY} r={88} fill="none" stroke="url(#roseGrad)" strokeWidth={5} />
//                 <G rotation={-18} origin="152, 163">
//                   <Ellipse cx={152} cy={163} rx={86} ry={89} fill="none" stroke="url(#roseGrad2)" strokeWidth={2.5} />
//                 </G>
//                 <G rotation={25} origin="148, 167">
//                   <Ellipse cx={148} cy={167} rx={90} ry={85} fill="none" stroke="url(#roseGrad)" strokeWidth={1.6} opacity={0.8} />
//                 </G>
//                 <Circle
//                   cx={CX} cy={CY} r={88} fill="none" stroke="#ffffff" strokeWidth={1}
//                   opacity={0.35} strokeDasharray="40 160"
//                 />
//               </Layer>
//             </Animated.View>

//             {/* sparkle dust */}
//             <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: sparkleSpin }] }]}>
//               <Layer>
//                 {sparkleDots.map((d) => (
//                   <Circle key={d.key} cx={d.x} cy={d.y} r={d.r} fill="#e8aa99" opacity={d.o} />
//                 ))}
//               </Layer>
//             </Animated.View>

//             {/* script logo text */}
//             <Layer defs={sharedDefs}>
//               <SvgText
//                 x={150}
//                 y={105}
//                 fontSize={84}
//                 fontFamily="GreatVibes_400Regular"
//                 fill="url(#textGrad)"
//                 textAnchor="middle"
//                 rotation={-4}
//                 origin="150, 105"
//               >
//                 Faykaa
//               </SvgText>
//             </Layer>
//           </View>

//           <Text style={styles.brand}>FAYKAA</Text>
//           <View style={styles.loadingRow}>
//             <Text style={styles.loading}>LOADING</Text>
//             <Text style={[styles.loading, styles.dots]}>
//               <Dot delay={0} />
//               <Dot delay={200} />
//               <Dot delay={400} />
//             </Text>
//           </View>
//         </>
//       )}
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: '#ffffff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 9999,
//     elevation: 9999,
//   },
//   logoWrap: { width: SIZE, height: SIZE },
//   brand: {
//     marginTop: 6,
//     fontFamily: 'CormorantGaramond_500Medium',
//     fontSize: 34,
//     letterSpacing: 4,
//     color: ROSE_TEXT,
//   },
//   loadingRow: { flexDirection: 'row', marginTop: 14 },
//   loading: {
//     fontFamily: 'Jost_400Regular',
//     fontSize: 13,
//     letterSpacing: 1.5,
//     color: ROSE_TEXT,
//   },
//   dots: { letterSpacing: 1.5 },
// });