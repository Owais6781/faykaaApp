import { useState, } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  // ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, } from "@react-navigation/native";
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react-native";
import { useRegisterUserMutation } from "../../../services/AuthApi";

export const NewRegistation = () => {
  const navigation = useNavigation<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [localError, setLocalError] = useState("");
  // const [googleLoading, setGoogleLoading] = useState(false);
  // const [facebookLoading, setFacebookLoading] = useState(false);
  const [customError, setCustomError] = useState("");

  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError("");
    setCustomError("");
  };

  const handleSubmit = async () => {
    setCustomError("");

    if (formData.password !== formData.confirmPassword) {
      setCustomError("Password and confirm password do not match");
      return;
    }

    try {
      const res = await registerUser(formData).unwrap();
      console.log(res);
      // React Native mein toast ke liye agar aap 'react-native-toast-message' use kar rahe hain toh wahan call karein
      setTimeout(() => {
        navigation.navigate("LogInPage");
      }, 1500);
    } catch (err: any) {
      setCustomError(err?.data?.message || "Registration failed");
    }
  };

  // const handleGoogleSignup = () => {
  //   setGoogleLoading(true);
  //   setTimeout(() => setGoogleLoading(false), 1000);
  // };

  // const handleFacebookSignup = () => {
  //   setFacebookLoading(true);
  //   setTimeout(() => setFacebookLoading(false), 1000);
  // };

  const apiError =
    error && "data" in error
      ? (error.data as { message?: string })?.message
      : "";


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-bgcream"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="flex-grow justify-center p-4">

          {/* Card */}
          <View className="bg-white rounded-xl p-6 border border-textcolor shadow-md elevation-[3px]">

            {/* Header */}
            <View className="items-center mb-6">
              <View className="w-12 h-12 bg-bgcard rounded-lg items-center justify-center mb-3">
                <Text className="text-2xl font-bold text-goldtext italic">
                  F
                </Text>
              </View>

              <Text className="text-[26px] font-bold text-blacktext italic">
                Create Account
              </Text>

              <Text className="text-sm text-lightgoldtext mt-1">
                Join our home décor community
              </Text>
            </View>

            {/* Form */}
            <View className="gap-[14px]">

              {/* Full Name */}
              <View className="mb-1">
                <Text className="text-[13px] font-medium text-blacktext mb-1.5">
                  Full Name
                </Text>

                <View className="flex-row items-center  border-r border border-textcolor rounded-lg bg-white px-3 ">
                  <View className="flex-row items-center pr-3 mr-3 border-r border-textcolor">
                    <User size={18}   color="#B3AB97" />
                  </View>
                  <TextInput
                    className="flex-1 py-3 text-[15px] text-blacktext"
                    placeholder="Enter your full name"
                    placeholderTextColor="#B3AB97"
                    value={formData.fullName}
                    onChangeText={(val) => handleChange("fullName", val)}
                  />
                </View>
              </View>

              {/* Email Address */}
              <View className="mb-1">
                <Text className="text-[13px] font-medium text-blacktext mb-1.5">
                  Email Address
                </Text>

                <View className="flex-row items-center  border-r border border-textcolor rounded-lg bg-white px-3 ">
                  <View className="flex-row items-center pr-3 mr-3 border-r border-textcolor">
                    <Mail size={18}  color="#B3AB97"/>
                  </View>

                  <TextInput
                    className="flex-1 py-3 text-[15px] text-blacktext"
                    placeholder="Enter your email"
                    placeholderTextColor="#B3AB97"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(val) => handleChange("email", val)}
                  />
                </View>
              </View>

              {/* Phone Number */}
              <View className="mb-1">
                <Text className="text-[13px] font-medium text-blacktext mb-1.5">
                  Phone Number
                </Text>



                <View className="flex-row items-center  border-r border border-textcolor rounded-lg bg-white px-3 ">
                  <View className="flex-row items-center pr-3 mr-3 border-r border-textcolor">
                    <Phone size={18}  color="#B3AB97"/>
                  </View>
                  <TextInput
                    className="flex-1 py-3 text-[15px] text-blacktext"
                    placeholder="Enter your phone number"
                    placeholderTextColor="#B3AB97"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={formData.phone}
                    onChangeText={(val) => handleChange("phone", val)}
                  />
                </View>
              </View>

              {/* Password */}
              <View className="mb-1">
                <Text className="text-[13px] font-medium text-blacktext mb-1.5">
                  Password
                </Text>
                <View className="flex-row items-center  border-r border border-textcolor rounded-lg bg-white px-3 ">
                  <View className="flex-row items-center pr-3 mr-3 border-r border-textcolor">
                    <Lock size={18}  color="#B3AB97"/>
                  </View>
                  <TextInput
                    className="flex-1 py-3 text-[15px] text-blacktext"
                    placeholder="Create a password"
                    placeholderTextColor="#B3AB97"
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(val) => handleChange("password", val)}
                  />

                  <TouchableOpacity
                    className="absolute right-3"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#9A9282" />
                    ) : (
                      <Eye size={20} color="#9A9282" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View className="mb-1">
                <Text className="text-[13px] font-medium text-blacktext mb-1.5">
                  Confirm Password
                </Text>

                 <View className="flex-row items-center  border-r border border-textcolor rounded-lg bg-white px-3 ">
                  <View className="flex-row items-center pr-3 mr-3 border-r border-textcolor">
                    <Lock size={18}  color="#B3AB97"/>
                  </View>
                  <TextInput
                    className="flex-1 py-3 text-[15px] text-blacktext"
                    placeholder="Confirm your password"
                    placeholderTextColor="#B3AB97"
                    secureTextEntry={!showConfirmPassword}
                    value={formData.confirmPassword}
                    onChangeText={(val) =>
                      handleChange("confirmPassword", val)
                    }
                  />

                  <TouchableOpacity
                    className="absolute right-3"
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#9A9282" />
                    ) : (
                      <Eye size={20} color="#9A9282" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Error Alert */}
              {customError || localError || apiError ? (
                <View className="flex-row items-start bg-[#FEF2F2] border border-[#FECACA] p-2.5 rounded-lg gap-2">
                  <View className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-1.5" />

                  <Text className="flex-1 text-[#B91C1C] text-[13px] font-medium">
                    {customError || localError || apiError}
                  </Text>
                </View>
              ) : null}

              {/* Submit Button */}
              <TouchableOpacity
                className={`w-full py-3.5 rounded-lg items-center justify-center mt-2 ${isLoading ? "bg-[#D9CFB8]" : "bg-blacktext"
                  }`}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View className="flex-row items-center gap-2">
                    <Loader2 size={18} color="#9A9282" />

                    <Text className="text-lightgoldtext text-[15px] font-semibold">
                      Creating Account...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-[15px] font-semibold">
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-5">
              <View className="flex-1 h-px bg-textcolor" />

              <Text className="px-2.5 text-lightgoldtext text-[13px] font-medium">
                Or sign up with
              </Text>

              <View className="flex-1 h-px bg-textcolor" />
            </View>

            {/* Social Buttons */}
            {/* <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 border border-textcolor py-3 rounded-lg items-center bg-white"
                onPress={handleGoogleSignup}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <ActivityIndicator size="small" color="#A9803F" />
                ) : (
                  <Text className="text-blacktext font-medium text-sm">
                    Google
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 border border-textcolor py-3 rounded-lg items-center bg-white"
                onPress={handleFacebookSignup}
                disabled={facebookLoading}
              >
                {facebookLoading ? (
                  <ActivityIndicator size="small" color="#A9803F" />
                ) : (
                  <Text className="text-blacktext font-medium text-sm">
                    Facebook
                  </Text>
                )}
              </TouchableOpacity>
            </View> */}

            {/* Footer */}
            <View className="flex-row justify-center mt-5">
              <Text className="text-lightgoldtext text-[13px]">
                Already have an account?{" "}
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("LogInPage")}
              >
                <Text className="text-goldtext font-semibold text-[13px]">
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>

            {/* Security */}
            <View className="mt-4 border-t border-textcolor pt-3 items-center">
              <Text className="text-[#B3AB97] text-[11px] font-medium">
                Secure registration powered by Faykaa
              </Text>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );





}

