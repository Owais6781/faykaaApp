import  { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';

import {
  // ChevronLeft,
  // ChevronRight,
  Copy,
  CalendarDays,
  Check,
  X,
} from 'lucide-react-native';

import { styles,  } from "./HeroSlide.styles";
import { palette } from '../../globaltheme/colors';

import Swiper from 'react-native-swiper';

import {
  useGetActiveBannersQuery,
  useIncreaseBannerClickMutation,
  useIncreaseBannerViewMutation,
} from '../../services/BannerApi';

import { useGetActiveCouponsQuery } from '../../services/CouponApi';


const { width } = Dimensions.get('window');

const HeroSlideSection = () => {

    const Api = process.env.EXPO_PUBLIC_API_URL;


  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetActiveBannersQuery();


  console.log("Banner API DATA:", data);
console.log("Banner API ERROR:", error);
console.log("Banner isLoading:", isLoading);

  const [increaseBannerClick] =
    useIncreaseBannerClickMutation();

  const [increaseBannerView] =
    useIncreaseBannerViewMutation();

  const { data: couponData } =
    useGetActiveCouponsQuery();

  const coupons = couponData?.coupons || [];

  const [copiedCode, setCopiedCode] =
    useState<string | null>(null);

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
      // Clipboard package use karna hoga
      // @react-native-clipboard/clipboard

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
  // Loading
  // --------------------------------

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>

        <Text style={styles.discoverText}>
          DISCOVER
        </Text>

        <Text style={styles.loadingTitle}>
         Hero  Banners
        </Text>

        <ActivityIndicator
          size="large"
          color={palette.terracotta}
          style={styles.loader}
        />

      </View>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (isError) {
    return (
      <View style={styles.errorContainer}>

        <View style={styles.errorIcon}>
          <X
            size={20}
            color="#9C6B3E"
          />
        </View>

        <Text style={styles.errorTitle}>
          Something went astray
        </Text>

        <Text style={styles.errorDescription}>
          We couldn't reach the collection.
          Please try again.
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => {
            // RTK Query automatically refetches
            // when needed.
          }}
        >
          <Text style={styles.retryText}>
            RETRY
          </Text>
        </Pressable>

      </View>
    );
  }

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
    <View style={styles.section}>

      <View style={styles.sliderContainer}>

        <Swiper
          autoplay={banners.length > 1}
          autoplayTimeout={4}
          loop={banners.length > 1}
          showsPagination={banners.length > 1}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          paginationStyle={styles.pagination}
          // showsButtons={banners.length > 1}
            showsButtons={false}
        //   nextButton={
        //     <View style={styles.arrowButton}>
        //       <ChevronRight
        //         size={20}
        //         color={palette.charcoal}
        //       />
        //     </View>
        //   }
        //   prevButton={
        //     <View style={styles.arrowButton}>
        //       <ChevronLeft
        //         size={20}
        //         color={palette.charcoal}
        //       />
        //     </View>
        //   }
          onIndexChanged={(index) => {

            const activeBanner =
              banners[index];

            if (
              activeBanner?._id &&
              !viewed.current.has(
                activeBanner._id
              )
            ) {
              viewed.current.add(
                activeBanner._id
              );

              increaseBannerView(
                activeBanner._id
              );
            }
          }}
        >

          {banners.map(
            (bannerItem: any) => (

              <Pressable
                key={bannerItem._id}
                style={styles.slide}
                onPress={() =>
                  handleBannerClick(
                    bannerItem
                  )
                }
              >

                {/* Banner Image */}

                <Image
                  source={{
                    uri: `${Api}/api${bannerItem.mobileImage}`,
                  }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />

                {/* Dark Overlay */}

                <View
                  style={styles.overlay}
                />

                {/* Content */}

                <View style={styles.content}>

                  {/* Badges */}

                  <View style={styles.badges}>

                    {bannerItem.bannerType && (
                      <View
                        style={styles.typeBadge}
                      >
                        <Text
                          style={styles.typeText}
                        >
                          {bannerItem.bannerType}
                        </Text>
                      </View>
                    )}

                    {bannerItem.endDate && (
                      <View
                        style={styles.dateBadge}
                      >

                        <CalendarDays
                          size={12}
                          color="#FFB3B3"
                        />

                        <Text
                          style={styles.dateText}
                        >
                          Ends{' '}
                          <Text
                            style={styles.dateBold}
                          >
                            {new Date(
                              bannerItem.endDate
                            ).toLocaleDateString(
                              'en-IN',
                              {
                                day: '2-digit',
                                month: 'short',
                              }
                            )}
                          </Text>
                        </Text>

                      </View>
                    )}

                  </View>

                  {/* Title */}

                  <Text
                    style={styles.title}
                    numberOfLines={2}
                  >
                    {bannerItem.title}
                  </Text>

                  {/* Subtitle */}

                  {bannerItem.subtitle && (
                    <Text
                      style={styles.subtitle}
                      numberOfLines={1}
                    >
                      {bannerItem.subtitle}
                    </Text>
                  )}

                  {/* Coupon */}

                  {visibleCoupons.length > 0 && (
                    <View
                      style={styles.couponWrapper}
                    >

                      <View
                        style={styles.couponBox}
                      >

                        <Text
                          style={styles.couponLabel}
                        >
                          {visibleCoupons[0]
                            .discountType ===
                          'Percentage'
                            ? 'Coupon:'
                            : `₹${visibleCoupons[0].discountValue} OFF:`}
                        </Text>

                        <Text
                          style={styles.couponCode}
                        >
                          {visibleCoupons[0].code}
                        </Text>

                        <Pressable
                          style={styles.copyButton}
                          onPress={(e) => {
                            e.stopPropagation();

                            copyCoupon(
                              visibleCoupons[0]
                                .code
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
                              color={
                                palette.charcoal
                              }
                            />
                          )}

                        </Pressable>

                      </View>

                    </View>
                  )}

                  {/* Description */}

                  {bannerItem.description && (
                    <Text
                      style={styles.description}
                      numberOfLines={2}
                    >
                      {bannerItem.description}
                    </Text>
                  )}

                  {/* CTA */}

                  <Pressable
                    style={styles.ctaButton}
                    onPress={(e) => {
                      e.stopPropagation();

                      handleBannerClick(
                        bannerItem
                      );
                    }}
                  >
                    <Text
                      style={styles.ctaText}
                    >
                      {bannerItem.buttonText ||
                        'Shop Now'}
                    </Text>
                  </Pressable>

                </View>

              </Pressable>
            )
          )}

        </Swiper>

      </View>

    </View>
  );
};

export default HeroSlideSection;