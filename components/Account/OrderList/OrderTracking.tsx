
import {
  Check,
  Truck,
  Clock,
  PackageCheck,
  Gift,
  XCircle,
  RotateCcw,
  Layers,
} from "lucide-react-native";

import {
  Modal,
  Text,
  View,
} from "react-native";



export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Returned";

interface OrderTrackingProps {
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  transactionId?: string;
  orderId: string;
  paymentStatus:
  | "Paid"
  | "Pending"
  | "Failed";

  orderType:
  | "Paid"
  | "COD";

  paymentMethod?:
  | "ONLINE"
  | "COD";
}

const steps = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
] as const;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export const OrderTracking = ({
  status,
  createdAt,
  updatedAt,
  orderId,
  paymentStatus,
  orderType,
  transactionId,
}: OrderTrackingProps) => {
  const isCancelled =
    status === "Cancelled";

  const isReturned =
    status === "Returned";

  const isTerminal =
    isCancelled || isReturned;

  const currentIndex =
    steps.indexOf(
      status as (typeof steps)[number]
    );

  const getStepState = (
    stepIndex: number
  ) => {
    if (stepIndex < currentIndex) {
      return "completed";
    }

    if (stepIndex === currentIndex) {
      return "current";
    }

    return "upcoming";
  };

  return (
    <Modal

          transparent
          animationType="slide"
          // onRequestClose={handleClose}
        >
    <View className="w-full rounded-xl border border-[#E2D9C4] bg-white p-5">

      {/* -------------------------------- */}
      {/* Header */}

      {/* <Text className="ml-2 text-sm font-semibold text-white">
        Track Order
      </Text> */}
      {/* -------------------------------- */}

      <View className="flex-row items-center justify-between border-b border-[#E2D9C4] pb-5">

        <View className="flex-1">
          <View className="flex-row items-center">

            <View
              className={`h-2 w-2 rounded-full ${isTerminal
                ? "bg-red-600"
                : "bg-[#A9803F]"
                }`}
            />

            <Text className="ml-2 text-xs font-semibold uppercase tracking-wider text-[#9A9282]">
              Order ID ·{" "}
              <Text className="font-semibold text-[#1E1B16]">
                {orderId}
              </Text>
            </Text>

          </View>

          <Text className="mt-2 text-2xl font-semibold italic text-[#1E1B16]">
            Track your delivery
          </Text>
        </View>

        {/* Transaction Badge */}

        {transactionId && (
          <View className="ml-3 max-w-[130px] flex-row items-center rounded-lg border border-[#E2D9C4] bg-[#EFEAE0] px-3 py-2">
            <Layers
              size={14}
              color="#A9803F"
            />

            <Text
              numberOfLines={1}
              className="ml-1.5 flex-1 text-xs font-medium text-[#1E1B16]"
            >
              {transactionId}
            </Text>
          </View>
        )}

      </View>

      {/* -------------------------------- */}
      {/* Order Information */}
      {/* -------------------------------- */}

      <View className="my-6 rounded-xl bg-[#EFEAE0] p-4">

        {/* Placed On */}

        <View className="mb-4">
          <Text className="text-xs font-medium text-[#9A9282]">
            Placed On
          </Text>

          <Text className="mt-1 text-base font-semibold italic text-[#1E1B16]">
            {formatDate(createdAt)}
          </Text>

          <Text className="mt-0.5 text-xs text-[#9A9282]">
            {formatTime(createdAt)}
          </Text>
        </View>

        {/* Last Update */}

        <View className="mb-4">
          <Text className="text-xs font-medium text-[#9A9282]">
            Last Update
          </Text>

          <Text className="mt-1 text-base font-semibold italic text-[#1E1B16]">
            {formatDate(updatedAt)}
          </Text>

          <Text className="mt-0.5 text-xs text-[#9A9282]">
            {formatTime(updatedAt)}
          </Text>
        </View>

        {/* Order Type */}

        <View className="mb-4">
          <Text className="text-xs font-medium text-[#9A9282]">
            Order Type
          </Text>

          <Text className="mt-1 text-base font-semibold italic text-[#1E1B16]">
            {orderType}
          </Text>
        </View>

        {/* Transaction */}

        <View className="mb-4">
          <Text className="text-xs font-medium text-[#9A9282]">
            Transaction ID
          </Text>

          <Text
            numberOfLines={2}
            className="mt-1 text-xs font-medium text-[#A9803F]"
          >
            {transactionId || "N/A"}
          </Text>
        </View>

        {/* Payment */}

        <View>
          <Text className="text-xs font-medium text-[#9A9282]">
            Payment Status
          </Text>

          <Text
            className={`mt-1 text-base font-bold italic ${status === "Cancelled"
              ? "text-red-600"
              : status === "Returned"
                ? "text-orange-600"
                : "text-[#A9803F]"
              }`}
          >
            {paymentStatus}
          </Text>
        </View>

      </View>


      

      {/* -------------------------------- */}
      {/* Delivery Tracking */}
      {/* -------------------------------- */}

      <View className="mt-2">

        {isTerminal ? (

          /* Cancelled / Returned */

          <View
            className={`flex-row items-center rounded-xl border p-4 ${isCancelled
              ? "border-red-200 bg-red-50"
              : "border-orange-200 bg-orange-50"
              }`}
          >

            <View
              className={`h-11 w-11 items-center justify-center rounded-lg ${isCancelled
                ? "bg-red-100"
                : "bg-orange-100"
                }`}
            >
              {isCancelled ? (
                <XCircle
                  size={22}
                  color="#DC2626"
                />
              ) : (
                <RotateCcw
                  size={22}
                  color="#EA580C"
                />
              )}
            </View>

            <View className="ml-3 flex-1">
              <Text
                className={`text-base font-bold italic ${isCancelled
                  ? "text-red-800"
                  : "text-orange-800"
                  }`}
              >
                This order was{" "}
                {status.toLowerCase()}
              </Text>

              <Text
                className={`mt-1 text-xs ${isCancelled
                  ? "text-red-700"
                  : "text-orange-700"
                  }`}
              >
                Process completed on{" "}
                {formatDate(updatedAt)}{" "}
                at{" "}
                {formatTime(updatedAt)}
              </Text>
            </View>

          </View>

        ) : (

          /* Normal Tracking */

          <View className="px-1">

            {steps.map(
              (step, index) => {
                const state =
                  getStepState(index);

                const isLast =
                  index ===
                  steps.length - 1;

                return (
                  <View
                    key={step}
                    className="flex-row"
                  >

                    {/* Left Timeline */}

                    <View className="w-11 items-center">

                      {/* Circle */}

                      <View
                        className={`z-10 h-10 w-10 items-center justify-center rounded-xl ${state ===
                          "completed"
                          ? "bg-[#A9803F]"
                          : state ===
                            "current"
                            ? "border-2 border-[#A9803F] bg-white"
                            : "border border-[#E2D9C4] bg-[#EFEAE0]"
                          }`}
                      >
                        {state ===
                          "completed" ? (
                          <Check
                            size={18}
                            color="#FFFFFF"
                            strokeWidth={2.5}
                          />
                        ) : step ===
                          "Pending" ? (
                          <Clock
                            size={17}
                            color={
                              state ===
                                "current"
                                ? "#A9803F"
                                : "#9A9282"
                            }
                          />
                        ) : step ===
                          "Confirmed" ? (
                          <Check
                            size={17}
                            color={
                              state ===
                                "current"
                                ? "#A9803F"
                                : "#9A9282"
                            }
                          />
                        ) : step ===
                          "Processing" ? (
                          <PackageCheck
                            size={17}
                            color={
                              state ===
                                "current"
                                ? "#A9803F"
                                : "#9A9282"
                            }
                          />
                        ) : step ===
                          "Shipped" ? (
                          <Truck
                            size={17}
                            color={
                              state ===
                                "current"
                                ? "#A9803F"
                                : "#9A9282"
                            }
                          />
                        ) :

                          <Gift
                            size={17}
                            color={
                              state ===
                                "current"
                                ? "#A9803F"
                                : "#9A9282"
                            }
                          />
                        }
                      </View>

                      {/* Connector */}

                      {!isLast && (
                        <View className="absolute left-[19px] top-10 h-14 w-[2px] bg-[#E2D9C4]">

                          {state ===
                            "completed" && (
                              <View className="h-full w-full bg-[#A9803F]" />
                            )}

                        </View>
                      )}

                    </View>

                    {/* Step Information */}

                    <View className="ml-4 flex-1 pb-8">

                      <Text
                        className={`text-sm font-bold italic ${state ===
                          "upcoming"
                          ? "text-[#9A9282]"
                          : "text-[#1E1B16]"
                          }`}
                      >
                        {step}
                      </Text>

                      {state ===
                        "current" && (
                          <View className="mt-1 self-start rounded-md border border-[#E2D9C4] bg-[#EFEAE0] px-2 py-1">
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-[#A9803F]">
                              Active Step
                            </Text>
                          </View>
                        )}

                      {state ===
                        "completed" && (
                          <Text className="mt-1 text-xs text-[#9A9282]">
                            Done
                          </Text>
                        )}

                    </View>

                  </View>
                );
              }
            )}

          </View>
        )}

      </View>

    </View>
    </Modal>
  );
}