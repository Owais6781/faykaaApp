import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Star, X } from "lucide-react-native";

interface ReviewItem {
  _id: string;
  selectedProduct: any;
  userName: string;
  rating: number;
  review: string;
  createdAt?: string;
}

interface ReviewData {
  reviews: ReviewItem[];
}

interface ReviewModalProps {

  onClose: () => void;
  reviewData?: ReviewData;
  onSubmit: (rating: number, comment: string) => void;
  isLoading?: boolean;
}

export const ReviewModal =({

  onClose,
  reviewData,
  onSubmit,
  isLoading = false,
}: ReviewModalProps)=> {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating > 0 && comment.trim()) {
      onSubmit(rating, comment.trim());

      setRating(0);
      setComment("");
    }
  };

  const handleClose = () => {
    if (isLoading) return;

    setRating(0);
    setComment("");
    onClose();
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  const canSubmit =
    !isLoading && rating > 0 && comment.trim().length > 0;

  return (
    <Modal
   
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      {/* Overlay */}
      <View className="flex-1 justify-end bg-black/40">
        {/* Modal Container */}
        <View className="max-h-[92%] w-full rounded-t-3xl bg-white">
          
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-[#E2D9C4] px-5 py-4">
            <Text className="text-2xl font-bold italic text-[#1E1B16]">
              Product Rating 
            </Text>

            <Pressable
              onPress={handleClose}
              disabled={isLoading}
              className="h-10 w-10 items-center justify-center rounded-xl active:bg-[#EFEAE0]"
            >
              <X size={24} color="#9A9282" />
            </Pressable>
          </View>

          {/* Body */}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
          >
            <View className="px-5 py-5">

              {/* Star Rating */}
              <View>
                <Text className="mb-3 text-sm font-semibold text-[#1E1B16]">
                  Your Rating
                </Text>

                <View className="flex-row gap-3">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= rating;

                    return (
                      <Pressable
                        key={star}
                        onPress={() => setRating(star)}
                        disabled={isLoading}
                        className="items-center justify-center"
                      >
                        <Star
                          size={34}
                          color={active ? "#A9803F" : "#E2D9C4"}
                          fill={active ? "#A9803F" : "transparent"}
                        />
                      </Pressable>
                    );
                  })}
                </View>

                {rating > 0 && (
                  <Text className="mt-2 text-sm font-semibold text-[#A9803F]">
                    {getRatingText()}
                  </Text>
                )}
              </View>

              {/* Review */}
              <View className="mt-6">
                <Text className="mb-2 text-sm font-semibold text-[#1E1B16]">
                  Your Review
                </Text>

                <TextInput
                  value={comment}
                  onChangeText={(text) => {
                    if (text.length <= 200) {
                      setComment(text);
                    }
                  }}
                  placeholder="Share your experience with this product..."
                  placeholderTextColor="#B3AB97"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  editable={!isLoading}
                  className="min-h-[120px] rounded-xl border border-[#E2D9C4] bg-white px-4 py-3 text-sm text-[#1E1B16]"
                />

                <Text className="mt-2 text-xs text-[#9A9282]">
                  {comment.length}/200 characters
                </Text>
              </View>

              {/* Existing Reviews */}
              {reviewData?.reviews &&
                reviewData.reviews.length > 0 && (
                  <View className="mt-6 border-t border-[#E2D9C4] pt-5">
                    <Text className="mb-4 text-xl font-semibold italic text-[#1E1B16]">
                      Other Reviews
                    </Text>

                    <View className="gap-3">
                      {reviewData.reviews.map((r) => (
                        <View
                          key={r._id}
                          className="rounded-xl border border-[#E2D9C4] bg-[#EFEAE0] p-3"
                        >
                          {/* Reviewer + Rating */}
                          <View className="flex-row items-center justify-between">
                            <Text
                              numberOfLines={1}
                              className="mr-3 flex-1 text-sm font-semibold text-[#1E1B16]"
                            >
                              {r.userName}
                            </Text>

                            <View className="flex-row">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const active = star <= r.rating;

                                return (
                                  <Star
                                    key={star}
                                    size={14}
                                    color={
                                      active
                                        ? "#A9803F"
                                        : "#E2D9C4"
                                    }
                                    fill={
                                      active
                                        ? "#A9803F"
                                        : "transparent"
                                    }
                                  />
                                );
                              })}
                            </View>
                          </View>

                          {/* Review Text */}
                          <Text className="mt-2 text-sm leading-5 text-[#555555]">
                            {r.review}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="flex-row gap-3 border-t border-[#E2D9C4] bg-white px-5 py-4">
            {/* Cancel */}
            <Pressable
              onPress={handleClose}
              disabled={isLoading}
              className="flex-1 items-center justify-center rounded-xl border-2 border-[#E2D9C4] px-4 py-3 active:bg-[#EFEAE0]"
            >
              <Text className="font-semibold text-[#1E1B16]">
                Cancel
              </Text>
            </Pressable>

            {/* Submit */}
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              className={`flex-1 items-center justify-center rounded-xl px-4 py-3 ${
                canSubmit
                  ? "bg-[#1E1B16]"
                  : "bg-[#D9CFB8]"
              }`}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                  <Text className="ml-2 font-semibold text-white">
                    Submitting...
                  </Text>
                </View>
              ) : (
                <Text
                  className={`font-semibold ${
                    canSubmit
                      ? "text-white"
                      : "text-[#9A9282]"
                  }`}
                >
                  Submit Review
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}