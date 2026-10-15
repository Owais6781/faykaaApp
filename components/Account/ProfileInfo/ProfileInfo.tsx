
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    User,
    Mail,
    Phone,
    MapPin,
    Pencil,
    SquarePen,
    Save,
    ShieldCheck,
    X,
} from "lucide-react-native";
import { skipToken } from "@reduxjs/toolkit/query";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    useGetProfileQuery,
    useUpdateProfileMutation,
} from "../../../services/AuthApi";

type ProfileData = {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: {
        line1?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
    };
};

type FormData = {
    fullName: string;
    email: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
};

export const ProfileInfo = () => {
    const [token, setToken] = useState<string | null>(null);



    const {
        data,
        isLoading,
        // isFetching,
        isError,
        error,
        refetch,
    } = useGetProfileQuery(token ? undefined : skipToken);

    const [updateProfile, { isLoading: isUpdating }] =
        useUpdateProfileMutation();

    const profile = data as ProfileData | undefined;


    const [edit, setEdit] = useState(false);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        email: "",
        phone: "",
        line1: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
    });

    // ------------------------------------------
    // Load profile
    // ------------------------------------------

    useEffect(() => {
        const getProfile = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                const storedUser = await AsyncStorage.getItem("user");

                setToken(storedToken);

                if (storedUser) {
                    // If you want to parse and use the user data locally:
                    // const parsedUser = JSON.parse(storedUser);
                    const profile = JSON.parse(storedUser);
                    setFormData({
                        fullName: profile.fullName || "",
                        email: profile.email || "",
                        phone: profile.phone || "",
                        line1: profile.address?.line1 || "",
                        city: profile.address?.city || "",
                        state: profile.address?.state || "",
                        pincode: profile.address?.pincode || "",
                        country: profile.address?.country || "India",
                    });

                }
            } catch (error) {
                console.log("Failed to load data from AsyncStorage", error);
            }
        };

        getProfile();
    }, []);


    useEffect(() => {
        if (!profile) return;

        setFormData({
            fullName: profile.fullName || "",
            email: profile.email || "",
            phone: profile.phone || "",
            line1: profile.address?.line1 || "",
            city: profile.address?.city || "",
            state: profile.address?.state || "",
            pincode: profile.address?.pincode || "",
            country: profile.address?.country || "India",
        });
    }, [profile]);




    // ------------------------------------------
    // Change input
    // ------------------------------------------

    const handleChange = (
        field: keyof FormData,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // ------------------------------------------
    // Save profile
    // ------------------------------------------

    const handleSave = async () => {
        try {
            setMessage("");

            const payload = {
                fullName: formData.fullName,
                phone: formData.phone,
                address: {
                    line1: formData.line1,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    country: formData.country,
                },
            };

            const response = await updateProfile(payload).unwrap();
            await refetch();
            setMessage(
                response?.message || "Profile updated successfully"
            );

            setEdit(false);


        } catch (error: any) {
            setMessage(
                error?.data?.message || "Failed to update profile"
            );
        }
    };

    // ------------------------------------------
    // Cancel edit
    // ------------------------------------------

    const handleCancel = () => {
        setEdit(false);
        setMessage("");

        if (!profile) return;

        setFormData({
            fullName: profile.fullName || "",
            email: profile.email || "",
            phone: profile.phone || "",
            line1: profile.address?.line1 || "",
            city: profile.address?.city || "",
            state: profile.address?.state || "",
            pincode: profile.address?.pincode || "",
            country: profile.address?.country || "India",
        });
    };

    // ------------------------------------------
    // Loading
    // ------------------------------------------

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#F8F5EF]">
                <ActivityIndicator
                    size="large"
                    color="#A9803F"
                />

                <Text className="mt-5 text-2xl italic text-[#1E1B16]">
                    Curating your selection
                </Text>

                <Text className="mt-2 text-sm text-[#9A9282]">
                    One moment, please
                </Text>
            </View>
        );
    }

    // ------------------------------------------
    // Error
    // ------------------------------------------




    {
        isError && (
            <View className="rounded-xl bg-red-50 p-4">
                <Text className="font-bold text-red-700">
                    Profile load failed
                </Text>

                <Text className="mt-2 text-red-700">
                    {JSON.stringify(error)}
                </Text>

                <Pressable
                    onPress={() => refetch()}
                    className="mt-3 rounded-lg bg-red-700 p-3"
                >
                    <Text className="text-center font-bold text-white">
                        Retry
                    </Text>
                </Pressable>
            </View>
        )
    }

    return (
        <ScrollView
            className="flex-1 bg-[#F8F5EF] mt-[50px]"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 2,
            }}
        >
            <View className="px-4 ">

                {/* ======================================
            PROFILE CARD
        ====================================== */}

                <View className="mb-6 rounded-2xl border border-[#E2D9C4] bg-white p-6">

                    <View className="items-center">

                        {/* Avatar */}

                        <View className="h-24 w-24 items-center justify-center rounded-2xl bg-[#A9803F]">

                            <User
                                size={42}
                                color="#FFFFFF"
                            />

                        </View>

                        {/* Name */}

                        <Text className="mt-5 text-center text-2xl font-semibold italic text-[#1E1B16]">
                            {formData.fullName || "No Name"}
                        </Text>

                        {/* Details */}

                        <View className="mt-2 w-full">

                            {/* Email */}

                            <View className="mb-3 flex-row items-center rounded-xl bg-[#EFEAE0] px-4 py-3">

                                <Mail
                                    size={18}
                                    color="#A9803F"
                                />

                                <Text
                                    numberOfLines={2}
                                    className="ml-3 flex-1 text-sm text-[#1E1B16]"
                                >
                                    {formData.email || "No email"}
                                </Text>

                            </View>

                            {/* Phone */}

                            <View className="mb-3 flex-row items-center rounded-xl bg-[#EFEAE0] px-4 py-3">

                                <Phone
                                    size={18}
                                    color="#A9803F"
                                />

                                <Text className="ml-3 flex-1 text-sm text-[#1E1B16]">
                                    {formData.phone || "No phone"}
                                </Text>

                            </View>

                            {/* Address */}

                            <View className="flex-row items-start rounded-xl bg-[#EFEAE0] px-4 py-3">

                                <MapPin
                                    size={18}
                                    color="#A9803F"
                                />

                                <Text className="ml-3 flex-1 text-sm leading-6 text-[#1E1B16]">

                                    {formData.line1
                                        ? `${formData.line1}, ${formData.city}, ${formData.state}, ${formData.pincode}, ${formData.country}`
                                        : "No address added"}

                                </Text>

                            </View>

                        </View>

                    </View>

                </View>

                {/* ======================================
            SUCCESS / ERROR MESSAGE
        ====================================== */}
                {message ? (
                    <View className="mb-6 rounded-xl border border-[#E2D9C4] bg-white p-4">
                        <Text className="text-sm font-medium text-[#1E1B16]">
                            {message}
                        </Text>
                    </View>
                ) : null}

                {/* ======================================
            PERSONAL INFORMATION
        ====================================== */}

                <View className="overflow-hidden rounded-2xl border border-[#E2D9C4] bg-white">

                    {/* Section Header */}


                    <View className="border-b border-[#E2D9C4] p-6">

                        {/* Header Row */}
                        <View className="flex-row items-center justify-between">

                            {/* Left Side */}
                            <Text className="text-2xl font-semibold italic text-[#1E1B16]">
                                Personal Information
                            </Text>

                            {/* Right Side - Edit / Save Button */}
                            {!edit ? (
                                <Pressable
                                    onPress={() => setEdit(true)}
                                    className="flex-row items-center justify-center rounded-xl text-[#1E1B16] px-3 py-2"
                                >
                                    <SquarePen
                                        size={18}

                                    />

                                </Pressable>
                            ) : (
                                <Pressable
                                    disabled={isUpdating}
                                    onPress={handleSave}
                                    className="flex-row items-center justify-center rounded-xl px-5 py-3"
                                >
                                    {isUpdating ? (
                                        <ActivityIndicator
                                            size="small"
                                            color="#A9803F"
                                        />
                                    ) : (
                                        <>
                                            <Pencil
                                                size={18}
                                            />


                                        </>
                                    )}
                                </Pressable>
                            )}

                        </View>

                        {/* Description */}
                        <Text className="mt-2 text-sm leading-5 text-[#9A9282]">
                            Update your profile details for a faster checkout
                            experience.
                        </Text>

                    </View>

                    {/* ==================================
              FORM
          ================================== */}

                    <View className="p-6">

                        {/* ACCOUNT DETAILS */}

                        <Text className="mb-5 text-xl font-semibold italic text-[#1E1B16]">
                            Account Details
                        </Text>

                        {/* Full Name */}

                        <View className="mb-5">

                            <Text className="mb-2 text-sm font-medium text-[#1E1B16]">
                                Full Name
                            </Text>

                            <TextInput
                                value={formData.fullName}
                                onChangeText={(value) =>
                                    handleChange("fullName", value)
                                }
                                editable={edit}
                                placeholder="Enter full name"
                                placeholderTextColor="#9A9282"
                                className={`rounded-xl border px-4 py-3.5 text-base ${edit
                                    ? "border-[#E2D9C4] bg-white text-[#1E1B16]"
                                    : "border-[#E2D9C4] bg-[#EFEAE0] text-[#9A9282]"
                                    }`}
                            />

                        </View>

                        {/* Email */}

                        <View className="mb-5">

                            <Text className="mb-2 text-sm font-medium text-[#1E1B16]">
                                Email Address
                            </Text>

                            <TextInput
                                value={formData.email}
                                editable={false}
                                placeholder="Email"
                                placeholderTextColor="#9A9282"
                                className="rounded-xl border border-[#E2D9C4] bg-[#EFEAE0] px-4 py-3.5 text-base text-[#9A9282]"
                            />

                        </View>

                        {/* Phone */}

                        <View className="mb-8">

                            <Text className="mb-2 text-sm font-medium text-[#1E1B16]">
                                Phone Number
                            </Text>

                            <TextInput
                                value={formData.phone}
                                onChangeText={(value) =>
                                    handleChange("phone", value)
                                }
                                editable={edit}
                                keyboardType="phone-pad"
                                placeholder="Enter phone number"
                                placeholderTextColor="#9A9282"
                                className={`rounded-xl border px-4 py-3.5 text-base ${edit
                                    ? "border-[#E2D9C4] bg-white text-[#1E1B16]"
                                    : "border-[#E2D9C4] bg-[#EFEAE0] text-[#9A9282]"
                                    }`}
                            />

                        </View>

                        {/* ==================================
                DELIVERY ADDRESS
            ================================== */}

                        <Text className="mb-5 text-xl font-semibold italic text-[#1E1B16]">
                            Delivery Address
                        </Text>

                        {/* Address */}

                        <View className="mb-5">

                            <Text className="mb-2 text-sm font-medium text-[#1E1B16]">
                                Address Line
                            </Text>

                            <TextInput
                                value={formData.line1}
                                onChangeText={(value) =>
                                    handleChange("line1", value)
                                }
                                editable={edit}
                                multiline
                                placeholder="Enter address"
                                placeholderTextColor="#9A9282"
                                className={`min-h-[55px] rounded-xl border px-4 py-3.5 text-base ${edit
                                    ? "border-[#E2D9C4] bg-white text-[#1E1B16]"
                                    : "border-[#E2D9C4] bg-[#EFEAE0] text-[#9A9282]"
                                    }`}
                            />

                        </View>

                        {/* City */}

                        <View className="mb-5">

                            <Text className="mb-2 text-sm font-medium text-[#1E1B16]">
                                City
                            </Text>

                            <TextInput
                                value={formData.city}
                                onChangeText={(value) =>
                                    handleChange("city", value)
                                }
                                editable={edit}
                                placeholder="City"
                                placeholderTextColor="#9A9282"
                                className={`rounded-xl border px-4 py-3.5 text-base ${edit
                                    ? "border-[#E2D9C4] bg-white text-[#1E1B16]"
                                    : "border-[#E2D9C4] bg-[#EFEAE0] text-[#9A9282]"
                                    }`}
                            />

                        </View>

                        {/* State */}

                        <View className="mb-5">

                            <Text className="mb-2 text-sm font-medium text-[#1E1B16]">
                                State
                            </Text>

                            <TextInput
                                value={formData.state}
                                onChangeText={(value) =>
                                    handleChange("state", value)
                                }
                                editable={edit}
                                placeholder="State"
                                placeholderTextColor="#9A9282"
                                className={`rounded-xl border px-4 py-3.5 text-base ${edit
                                    ? "border-[#E2D9C4] bg-white text-[#1E1B16]"
                                    : "border-[#E2D9C4] bg-[#EFEAE0] text-[#9A9282]"
                                    }`}
                            />

                        </View>

                        {/* Pincode */}

                        <View className="mb-5">

                            <Text className="mb-2 text-sm font-medium text-[#1E1B16]">
                                Pincode
                            </Text>

                            <TextInput
                                value={formData.pincode}
                                onChangeText={(value) =>
                                    handleChange("pincode", value)
                                }
                                editable={edit}
                                keyboardType="number-pad"
                                placeholder="Pincode"
                                placeholderTextColor="#9A9282"
                                className={`rounded-xl border px-4 py-3.5 text-base ${edit
                                    ? "border-[#E2D9C4] bg-white text-[#1E1B16]"
                                    : "border-[#E2D9C4] bg-[#EFEAE0] text-[#9A9282]"
                                    }`}
                            />

                        </View>

                        {/* Country */}

                        <View className="mb-8">

                            <Text className="mb-2 text-sm font-medium text-[#1E1B16]">
                                Country
                            </Text>

                            <TextInput
                                value={formData.country}
                                onChangeText={(value) =>
                                    handleChange("country", value)
                                }
                                editable={edit}
                                placeholder="Country"
                                placeholderTextColor="#9A9282"
                                className={`rounded-xl border px-4 py-3.5 text-base ${edit
                                    ? "border-[#E2D9C4] bg-white text-[#1E1B16]"
                                    : "border-[#E2D9C4] bg-[#EFEAE0] text-[#9A9282]"
                                    }`}
                            />

                        </View>

                        {/* ==================================
                BOTTOM BUTTONS
            ================================== */}

                        {edit && (

                            <View className="border-t border-[#E2D9C4] pt-5">

                                {/* Save */}

                                <Pressable
                                    disabled={isUpdating}
                                    onPress={handleSave}
                                    className="mb-3 rounded-xl bg-[#A9803F] px-6 py-3.5"
                                >

                                    <Text className="text-center font-semibold text-white">
                                        {isUpdating
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </Text>

                                </Pressable>

                                {/* Cancel */}

                                <Pressable
                                    onPress={handleCancel}
                                    className="rounded-xl bg-[#EFEAE0] px-6 py-3.5"
                                >

                                    <Text className="text-center font-semibold text-[#1E1B16]">
                                        Cancel
                                    </Text>

                                </Pressable>

                            </View>

                        )}

                    </View>

                </View>


                {/* ======================================
            HEADER
        ====================================== */}

                <View className=" rounded-2xl border border-[#E2D9C4] bg-white p-5">



                    {/* Secure Account */}

                    {/* <View className="mt-5 rounded-xl border border-[#E2D9C4] bg-[#EFEAE0] p-4">

                        <View className="flex-row items-center">

                            <ShieldCheck
                                size={21}
                                color="#A9803F"
                            />

                            <View className="ml-3">

                                <Text className="text-base font-semibold text-[#1E1B16]">
                                    Secure Account
                                </Text>

                                <Text className="mt-1 text-sm text-[#9A9282]">
                                    Your information is protected.
                                </Text>
                                  <Text className="mt-2 text-sm leading-5 text-[#9A9282]">
                                Manage your personal details, contact information
                                and delivery address.
                            </Text>

                            </View>

                        </View>

                    </View> */}

                    <View className="mt-5 rounded-xl border border-[#E2D9C4] bg-[#EFEAE0] p-2">
                        <View className="flex-row items-start">

                            {/* Icon */}
                            <ShieldCheck
                                size={21}
                                color="#A9803F"
                                className="mt-0.5"
                            />

                            {/* Content */}
                            <View className="ml-3 flex-1">

                                <Text className="text-base font-semibold text-[#1E1B16]">
                                    Secure Account
                                </Text>

                                <Text className="mt-1 text-sm leading-5 text-[#9A9282]">
                                    Your information is protected.
                                </Text>

                                <Text className="mt-2 text-sm leading-5 text-[#9A9282]">
                                    Manage your personal details, contact information
                                    and delivery address.
                                </Text>

                            </View>

                        </View>
                    </View>

                </View>

            </View>
        </ScrollView>
    );
}
