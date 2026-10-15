import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  Dimensions,
} from 'react-native';

import {
  X,
  Copy,
  CalendarDays,
  Check,

} from 'lucide-react-native';

import { palette } from '../../globaltheme/colors';

import Swiper from 'react-native-swiper';

import {
  useGetActiveBannersQuery,
  useIncreaseBannerClickMutation,
  useIncreaseBannerViewMutation,
} from '../../services/BannerApi';

import { useGetActiveCouponsQuery } from '../../services/CouponApi';



const { width } = Dimensions.get('window');
export const Heroslider = () => {

  const Api = process.env.EXPO_PUBLIC_API_URL;
  const { data,error } = useGetActiveBannersQuery();
   
  const [increaseBannerClick] =useIncreaseBannerClickMutation();
  const [increaseBannerView] =useIncreaseBannerViewMutation();
  const { data: couponData } =useGetActiveCouponsQuery();
 
  const coupons = couponData?.coupons || [];
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
   
  const viewed = useRef(new Set<string>());

  const slideGroup = 'home-top';

  const visibleCoupons = coupons.filter(
    (coupon: any) =>
      coupon.status === 'Active' ||
      coupon.status === 'Upcoming'
  );

  const banners = (data?.data as any[])?.filter(
    (item) =>
      item.isActive &&
      item.slideGroup === slideGroup
  ) || [];

  const banner = banners[0];

  // --------------------------------
  // Banner View
  // --------------------------------

  useEffect(() => {
    if (!banner?._id) return;

    if (!viewed.current.has(banner._id)) {
      viewed.current.add(banner._id);

      increaseBannerView(banner._id);
    }
  }, [banner?._id]);

  // --------------------------------
  // Banner Click
  // --------------------------------

  const handleBannerClick = async (bannerItem: any) => {
    try {
      await increaseBannerClick(
        bannerItem._id
      ).unwrap();

      // React Native mein window.open use nahi hota.
      // Agar URL open karna hai to Linking use karenge.

      Alert.alert(
        'Banner',
        `Opening ${bannerItem.title || 'banner'}`
      );

    } catch (err) {
      console.error(
        'Click Error:',
        err
      );
    }
  };

  // --------------------------------
  // Copy Coupon
  // --------------------------------

  const copyCoupon = async (code: string) => {
    try {

      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);

    } catch (err) {
      console.error(
        'Failed to copy coupon:',
        err
      );
    }
  };


  // --------------------------------
  // Error
  // --------------------------------


  // --------------------------------
  // No Banner
  // --------------------------------

  if (
    error ||
    !banner ||
    banners.length === 0
  ) {
    return null;
  }

  // --------------------------------
  // Main UI
  // --------------------------------



  return (
 
    <View
      className="w-full bg-bgcream px-2"
    >
      <View
        className="w-full max-h-[200px] rounded-xl overflow-hidden relative shadow-sm group mb-3"
        style={{ height: width * 0.50 }}
      >

        <Swiper
          autoplay={banners.length > 1}
          autoplayTimeout={4}
          loop={banners.length > 1}
          showsPagination={banners.length > 1}
          dot={<View
            className="mx-[3px]"
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: "#FFFFFF80",
            }}
          />}
          activeDot={<View
            className="mx-[3px]"
            style={{
              width: 20,
              height: 6,
              borderRadius: 3,
              backgroundColor: "#FFFFFF",
            }}

          />}
          paginationStyle={{ bottom: 8, alignItems: "center", }}
          showsButtons={false}
          onIndexChanged={(index) => {
            const activeBanner = banners[index];

            if (
              activeBanner?._id &&
              !viewed.current.has(activeBanner._id)
            ) {
              viewed.current.add(activeBanner._id);

              increaseBannerView(activeBanner._id);
            }
          }}
        >
          {banners.map((bannerItem: any) => (
            <Pressable
              key={bannerItem._id}
              className="flex-1 relative bg-[#171717] rounded-xl overflow-hidden"

              onPress={() => handleBannerClick(bannerItem)}
            >
              {/* Banner Image */}
              <Image
                source={{
                  uri: `${Api}/api${bannerItem.mobileImage}`,
                }}
                className="w-full h-full"

                resizeMode="cover"
              />

              {/* Dark Overlay */}
              <View
                className="absolute inset-0 bg-black/55"

              />

              {/* Content */}
              <View

                className="absolute inset-0 justify-center px-4 py-9"
              >

                {/* Badges */}
                <View className="flex-row flex-wrap items-center gap-1.5 mb-2">
                  {bannerItem.bannerType && (
                    <View
                      className="px-2 py-1 rounded-[20px] border "
                      style={{
                        borderColor: palette.goldAccents,
                        backgroundColor: palette.blackOverlays,
                      }}
                    >
                      <Text
                        className=" text-[9px] font-bold uppercase"
                        style={{
                          color: palette.WarmBrass,

                        }}
                      >
                        {bannerItem.bannerType}
                      </Text>
                    </View>
                  )}

                  {bannerItem.endDate && (
                    <View
                      className="flex-row items-center gap-1 px-2 py-1 rounded-[20px] border "

                      style={{
                        borderColor: palette.lightRed,
                        backgroundColor: palette.darkRedOverlay,
                      }}
                    >
                      <CalendarDays
                        size={12}
                        color="#FFFFFF"
                      />

                      <Text
                        className=" text-[9px] text-white "

                      >
                        Ends{' '}
                        <Text
                          className="font-bold"

                        >
                          {new Date(
                            bannerItem.endDate
                          ).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </Text>
                      </Text>
                    </View>
                  )}
                </View>

                {/* Title */}
                <Text
                  className="text-white text-2xl italic font-medium leading-8 mb-[5px]"

                  numberOfLines={2}
                >
                  {bannerItem.title}
                </Text>

                {/* Subtitle */}
                {bannerItem.subtitle && (
                  <Text
                    className=" text-[14px] font-medium mb-2"
                    style={{
                      color: palette.creamBeige,
                    }}

                    numberOfLines={1}
                  >
                    {bannerItem.subtitle}
                  </Text>
                )}

                {/* Coupon */}
                {visibleCoupons.length > 0 && (
                  <View
                    className="self-start my-[5px]"

                  >
                    <View
                      className="flex-row items-center gap-2 px-2.5 py-1 rounded-lg border  "
                      style={{
                        borderColor: palette.SoftGolds,
                        backgroundColor: palette.blackOverlay
                      }}

                    >
                      <Text
                        className="text-white text-[10px]"

                      >
                        {visibleCoupons[0].discountType ===
                          'Percentage'
                          ? 'Coupon:'
                          : `₹${visibleCoupons[0].discountValue} OFF:`}
                      </Text>

                      <Text
                        className=" text-xs font-bold tracking-[1px]"
                        style={{
                          color: palette.SoftGold,
                          padding: 4
                        }}

                      >
                        {visibleCoupons[0].code}
                      </Text>


                      <Pressable
                        className="p-1 rounded-[4px]  justify-center items-center"
                        style={{
                          backgroundColor: palette.SoftGold,
                          padding: 4
                        }}
                        onPress={(e) => {
                          e.stopPropagation();

                          copyCoupon(
                            visibleCoupons[0].code
                          );
                        }}
                      >
                        {copiedCode ===
                          visibleCoupons[0].code ? (
                          <Check
                            size={14}
                            color="#166534"
                          />
                        ) : (
                          <Copy
                            size={14}
                            color={palette.charcoal}
                          />
                        )}
                      </Pressable>

                    </View>
                  </View>
                )}

                {/* Description */}
                {bannerItem.description && (
                  <Text
                    className="text-white/80 text-xs leading-[17px] mt-[5px] max-w-[90%]"

                    numberOfLines={2}
                  >
                    {bannerItem.description}
                  </Text>
                )}

                {/* CTA */}
                <Pressable

                  className="self-start mt-2  bg-white px-3 py-[7px] rounded-1"
                  onPress={(e) => {
                    e.stopPropagation();

                    handleBannerClick(bannerItem);
                  }}
                >
                  <Text

                    className="text-blacktext p-1 text-[11px] font-bold tracking-[1px] uppercase rounded-[12px]"
                  >
                    {bannerItem.buttonText || 'Shop Now'}
                  </Text>
                </Pressable>

              </View>
            </Pressable>
          ))}
        </Swiper>
      </View>
    </View>
    
  );
};

