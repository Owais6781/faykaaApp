import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Make sure yeh import ho
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  useLoginUserMutation,
  // useGoogleLoginUserMutation,
  // useFacebookLoginUserMutation,
} from "../../../services/AuthApi";
interface LoginFormData {
  loginId: string;
  password: string;
}

export const LoginPage = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const from = route.params?.from || "Home";

  const [formData, setFormData] = useState<LoginFormData>({
    loginId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [googleLoading, setGoogleLoading] = useState(false);
  // const [facebookLoading, setFacebookLoading] = useState(false);


  const [loginUser,] = useLoginUserMutation();
  // const [googleLoginUser, ] = useGoogleLoginUserMutation();
  // const [facebookLoginUser, ] = useFacebookLoginUserMutation();



  const handleAfterLogin = async (token: string, user: any) => {
    try {
      console.log("USER SAVING:", user);

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      navigation.reset({
        index: 0,
        routes: [{ name: from }],
      });
    } catch (error) {
      console.error("SAVE USER ERROR:", error);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);
    try {

      // Yahan apna RTK Query ya API call karein
      const res = await loginUser(formData).unwrap();
      await handleAfterLogin(res.token, res.user);


    } catch (err: any) {
      setIsLoading(false);
      console.error(err);
      if (err?.data?.message) {
        setError(err.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };






  // const handleGoogleLogin = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
  //     const user = result.user;

  //     const res = await googleLoginUser({
  //       fullName: user.displayName || "Google User",
  //       email: user.email || "",
  //       providerId: user.uid,
  //       profilePic: user.photoURL || "",
  //     }).unwrap();


  //     await handleAfterLogin(res.token, res.user);

  //     navigation(from, { replace: true });
  //   } catch (err) {
  //     console.error("Google login failed:", err);
  //   }
  // };

  // const handleFacebookLogin = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, facebookProvider);
  //     const user = result.user;

  //     const res = await facebookLoginUser({
  //       fullName: user.displayName || "Facebook User",
  //       email: user.email || "",
  //       providerId: user.uid,
  //       profilePic: user.photoURL || "",
  //     }).unwrap();

  //     await handleAfterLogin(res.token, res.user);
  //     navigation(from, { replace: true });
  //   } catch (err) {
  //     console.error("Facebook login failed:", err);
  //   }
  // };


  // return (
  //   <KeyboardAvoidingView
  //     behavior={Platform.OS === "ios" ? "padding" : "height"}
  //     className="flex-1 dark:bg-bgcream"
  //   >
  //     <ScrollView
  //       contentContainerClassName="flex-grow justify-center p-4 pt-[100px]"
  //       showsVerticalScrollIndicator={false}
  //     >
  //       <View className="bg-white rounded-xl border border-textcolor p-6 shadow-sm shadow-black/10 elevation-[3]">

  //         {/* Header */}
  //         <View className="items-center mb-6">
  //           <View className="w-[50px] h-[50px] bg-bgcard rounded-lg justify-center items-center mb-3">
  //             <Text className="text-2xl font-bold text-goldtext italic">F</Text>
  //           </View>

  //           <Text className="text-[22px] font-bold text-blacktext italic">Welcome Back</Text>
  //           <Text className="text-sm text-lightgoldtext mt-1">Sign in to your account</Text>
  //         </View>

  //         {/* Form Section */}
  //         <View className="w-full">

  //           {/* Email/Phone Input */}
  //           <View className="mb-4">
  //             <Text className="text-[13px] font-medium text-blacktext mb-1.5">Email or Mobile Number</Text>
  //             <View className="flex-row items-center border border-textcolor rounded-lg bg-white px-3">
  //               <View className="flex-row items-center pr-3 mr-3 border-r border-textcolor">
  //                 <Mail size={18} color="#B3AB97" />
  //               </View>
  //               <TextInput
  //                 className="flex-1 py-3 text-[15px] text-blacktext"
  //                 placeholder="Enter email or mobile"
  //                 placeholderTextColor="#B3AB97"
  //                 value={formData.loginId}
  //                 onChangeText={(val) => handleChange("loginId", val)}
  //                 autoCapitalize="none"
  //               />
  //             </View>
  //           </View>

  //           {/* Password Input */}
  //           <View className="mb-4">
  //             <Text className="text-[13px] font-medium text-blacktext mb-1.5">Password</Text>
  //             <View className="flex-row items-center  border-r border border-textcolor rounded-lg bg-white px-3 ">

  //               <View className="flex-row items-center pr-3 mr-3 border-r border-textcolor">
  //                 <Lock size={18} color="#B3AB97" />
  //               </View>

  //               <TextInput
  //                 className="flex-1 py-3 text-[15px] text-blacktext"
  //                 placeholder="••••••••"
  //                 placeholderTextColor="#B3AB97"
  //                 secureTextEntry={!showPassword}
  //                 value={formData.password}
  //                 onChangeText={(val) => handleChange("password", val)}
  //               />
  //               <TouchableOpacity
  //                 onPress={() => setShowPassword(!showPassword)}
  //                 className="p-1"
  //                 activeOpacity={0.7}
  //               >
  //                 {showPassword ? (
  //                   <EyeOff size={20} color="#B3AB97" />
  //                 ) : (
  //                   <Eye size={20} color="#B3AB97" />
  //                 )}
  //               </TouchableOpacity>
  //             </View>
  //           </View>

  //           {/* Error Alert */}
  //           {error ? (
  //             <View className="flex-row items-center bg-[#FEF2F2] border border-[#FECACA] p-2.5 rounded-lg mb-4">
  //               <View className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mr-2" />
  //               <Text className="text-[#B91C1C] text-[13px] flex-1">{error}</Text>
  //             </View>
  //           ) : null}

  //           {/* Forgot Password */}
  //           <TouchableOpacity
  //             onPress={() => navigation.navigate("ForgotPassword")}
  //             className="self-end mb-5"
  //           >
  //             <Text className="text-goldtext text-[13px] font-medium">Forgot Password?</Text>
  //           </TouchableOpacity>

  //           {/* Sign In Button */}
  //           <TouchableOpacity
  //             className={`bg-blacktext py-3.5 rounded-lg items-center justify-center ${isLoading ? "bg-[#D9CFB8]" : ""
  //               }`}
  //             onPress={handleSubmit}
  //             disabled={isLoading}
  //           >
  //             {isLoading ? (
  //               <View className="flex-row items-center">
  //                 <Loader2 size={18} color="#9A9282" style={{ marginRight: 6 }} />
  //                 <Text className="text-lightgoldtext text-[15px] font-semibold">Signing in...</Text>
  //               </View>
  //             ) : (
  //               <Text className="text-white text-[15px] font-semibold">Sign In</Text>
  //             )}
  //           </TouchableOpacity>

  //           {/* Divider */}
  //           <View className="flex-row items-center my-5">
  //             <View className="flex-1 h-[1px] bg-textcolor" />
  //             <Text className="px-2.5 text-[13px] text-lightgoldtext font-medium">Or continue with</Text>
  //             <View className="flex-1 h-[1px] bg-textcolor" />
  //           </View>

  //           {/* Sign Up Link */}
  //           <View className="flex-row justify-center mb-4">
  //             <Text className="text-[13px] text-lightgoldtext">Don't have an account? </Text>
  //             <TouchableOpacity onPress={() => navigation.navigate("NewRegistation")}>
  //               <Text className="text-[13px] text-goldtext font-semibold">Sign up</Text>
  //             </TouchableOpacity>
  //           </View>

  //           {/* Security Footer */}
  //           <View className="border-t border-textcolor pt-4 items-center">
  //             <Text className="text-[11px] text-Vintage-Gray font-medium">Secure login powered by Faykaa</Text>
  //           </View>

  //         </View>
  //       </View>
  //     </ScrollView>
  //   </KeyboardAvoidingView>
  // );


  return (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    className="flex-1 bg-bgcream dark:bg-[#12110F]"
  >
    <ScrollView
      contentContainerClassName="flex-grow justify-center p-4 pt-[100px]"
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-white dark:bg-[#1C1A17] rounded-xl border border-textcolor dark:border-[#3A352D] p-6 shadow-sm shadow-black/10 elevation-[3px]">

        {/* Header */}
        <View className="items-center mb-6">

          <View className="w-[50px] h-[50px] bg-bgcard dark:bg-[#211F1B] rounded-lg justify-center items-center mb-3">
            <Text className="text-2xl font-bold text-goldtext italic">
              F
            </Text>
          </View>

          <Text className="text-[22px] font-bold text-blacktext dark:text-textcream italic">
            Welcome Back
          </Text>

          <Text className="text-sm text-lightgoldtext dark:text-graytextcolor mt-1">
            Sign in to your account
          </Text>
        </View>

        {/* Form Section */}
        <View className="w-full">

          {/* Email/Phone Input */}
          <View className="mb-4">

            <Text className="text-[13px] font-medium text-blacktext dark:text-textcream mb-1.5">
              Email or Mobile Number
            </Text>

            <View className="flex-row items-center border border-textcolor dark:border-[#3A352D] rounded-lg bg-white dark:bg-[#211F1B] px-3">

              <View className="flex-row items-center pr-3 mr-3 border-r border-textcolor dark:border-[#3A352D]">
                <Mail size={18} color="#B3AB97" />
              </View>

              <TextInput
                className="flex-1 py-3 text-[15px] text-blacktext dark:text-textcream"
                placeholder="Enter email or mobile"
                placeholderTextColor="#B3AB97"
                value={formData.loginId}
                onChangeText={(val) => handleChange("loginId", val)}
                autoCapitalize="none"
              />

            </View>
          </View>

          {/* Password Input */}
          <View className="mb-4">

            <Text className="text-[13px] font-medium text-blacktext dark:text-textcream mb-1.5">
              Password
            </Text>

            <View className="flex-row items-center border border-textcolor dark:border-[#3A352D] rounded-lg bg-white dark:bg-[#211F1B] px-3">

              <View className="flex-row items-center pr-3 mr-3 border-r border-textcolor dark:border-[#3A352D]">
                <Lock size={18} color="#B3AB97" />
              </View>

              <TextInput
                className="flex-1 py-3 text-[15px] text-blacktext dark:text-textcream"
                placeholder="••••••••"
                placeholderTextColor="#B3AB97"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(val) => handleChange("password", val)}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="p-1"
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#B3AB97" />
                ) : (
                  <Eye size={20} color="#B3AB97" />
                )}
              </TouchableOpacity>

            </View>
          </View>

          {/* Error Alert */}
          {error ? (
            <View className="flex-row items-center bg-[#FEF2F2] dark:bg-[#3A1F1F] border border-[#FECACA] dark:border-[#6B3030] p-2.5 rounded-lg mb-4">

              <View className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mr-2" />

              <Text className="text-[#B91C1C] dark:text-[#FCA5A5] text-[13px] flex-1">
                {error}
              </Text>

            </View>
          ) : null}

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            className="self-end mb-5"
          >
            <Text className="text-goldtext text-[13px] font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            className={`bg-blacktext dark:bg-goldtext py-3.5 rounded-lg items-center justify-center ${
              isLoading ? "bg-[#D9CFB8] dark:bg-[#5F5139]" : ""
            }`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View className="flex-row items-center">

                <Loader2
                  size={18}
                  color="#9A9282"
                  style={{ marginRight: 6 }}
                />

                <Text className="text-lightgoldtext dark:text-[#D9C08F] text-[15px] font-semibold">
                  Signing in...
                </Text>

              </View>
            ) : (
              <Text className="text-white dark:text-[#12110F] text-[15px] font-semibold">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-5">

            <View className="flex-1 h-[1px] bg-textcolor dark:bg-[#3A352D]" />

            <Text className="px-2.5 text-[13px] text-lightgoldtext dark:text-graytextcolor font-medium">
              Or continue with
            </Text>

            <View className="flex-1 h-[1px] bg-textcolor dark:bg-[#3A352D]" />

          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mb-4">

            <Text className="text-[13px] text-lightgoldtext dark:text-graytextcolor">
              Don't have an account?{" "}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("NewRegistation")}
            >
              <Text className="text-[13px] text-goldtext font-semibold">
                Sign up
              </Text>
            </TouchableOpacity>

          </View>

          {/* Security Footer */}
          <View className="border-t border-textcolor dark:border-[#3A352D] pt-4 items-center">

            <Text className="text-[11px] text-Vintage-Gray dark:text-graytextcolor font-medium">
              Secure login powered by Faykaa
            </Text>

          </View>

        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);
}
