
import { useMemo, useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";

import {
  styles,
  CARD_WIDTH,
  SPACING,
  SCREEN_WIDTH_VAL,
} from "./OurCategory.styles";

import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight, X } from "lucide-react-native";
import { useGetProductCategoryQuery } from "../../services/ProductApi";

type CategoryItem = {
  _id?: string;
  id?: string | number;
  category: {
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
  image?: string;
  images?: string[];
  name?: string;
  title?: string;
};

const ITEM_WIDTH = CARD_WIDTH + SPACING;

// Virtual indexes.
// Actual categories duplicate nahi hongi.
const VIRTUAL_COUNT = 10000;

export default function OurCategory() {
  const navigation = useNavigation<any>();
  const flatListRef = useRef<FlatList>(null);

  const currentIndexRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const Api = process.env.EXPO_PUBLIC_API_URL || "";

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductCategoryQuery();

  const allowedCategories = [
    "Curtains",
    "Bedsheets",
    "Carpets-Rugs",
    "Cushions",
  ];

  // --------------------------------------------------
  // FILTER CATEGORIES
  // --------------------------------------------------

  const filteredCategories = useMemo(() => {
    const map = new Map<string, CategoryItem>();

    data.forEach((item: CategoryItem) => {
      const categoryName = (
        item.category?.name ||
        item.name ||
        ""
      ).trim();

      if (!categoryName) return;

      const isAllowed = allowedCategories.some(
        (cat) =>
          cat.toLowerCase() ===
          categoryName.toLowerCase()
      );

      if (
        isAllowed &&
        !map.has(categoryName.toLowerCase())
      ) {
        map.set(
          categoryName.toLowerCase(),
          item
        );
      }
    });

    return allowedCategories
      .map((cat) =>
        Array.from(map.values()).find(
          (item) =>
            (
              item.category?.name ||
              item.name ||
              ""
            ).toLowerCase() ===
            cat.toLowerCase()
        )
      )
      .filter(Boolean) as CategoryItem[];
  }, [data]);

  // --------------------------------------------------
  // VIRTUAL DATA
  //
  // Example actual data:
  //
  // Curtains
  // Bedsheets
  // Carpets-Rugs
  // Cushions
  //
  // Actual array ko duplicate nahi kiya.
  // --------------------------------------------------

  const virtualData = useMemo(() => {
    if (filteredCategories.length === 0) {
      return [];
    }

    return Array.from(
      { length: VIRTUAL_COUNT },
      (_, index) => index
    );
  }, [filteredCategories.length]);

  // --------------------------------------------------
  // IMAGE
  // --------------------------------------------------

  const imageByIndexUrl = (
    productId: string,
    index: number
  ) =>
    `${Api}/api/${productId}/img/${index}`;

  // --------------------------------------------------
  // CLICK
  // --------------------------------------------------

  const handleOpenNowClick = (
    item: CategoryItem
  ) => {
    const categorySlug = (
      item.category?.name ||
      item.name ||
      ""
    )
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (!categorySlug) return;

    navigation.navigate("CategoryList", {
      category: categorySlug,
    });
  };

  // --------------------------------------------------
  // START FROM CENTER
  // --------------------------------------------------

  useEffect(() => {
    if (filteredCategories.length === 0) {
      return;
    }

    const middleIndex =
      Math.floor(VIRTUAL_COUNT / 2);

    // Center index ko category ke first item
    // ke saath align karna
    const startIndex =
      middleIndex -
      (middleIndex %
        filteredCategories.length);

    currentIndexRef.current = startIndex;

    const timer = setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: startIndex * ITEM_WIDTH,
        animated: false,
      });

      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [filteredCategories.length]);

  // --------------------------------------------------
  // AUTO LOOP
  //
  // Web Swiper jaisa:
  //
  // delay = 2000ms
  // speed = smooth
  // --------------------------------------------------

  useEffect(() => {
    if (
      filteredCategories.length <= 1 ||
      !isReady
    ) {
      return;
    }

    const timer = setInterval(() => {
      const nextIndex =
        currentIndexRef.current + 1;

      // End ke paas pahunchne par
      // silently center me aa jao
      if (
        nextIndex >=
        VIRTUAL_COUNT -
        filteredCategories.length * 2
      ) {
        const middleIndex =
          Math.floor(VIRTUAL_COUNT / 2);

        const resetIndex =
          middleIndex -
          (middleIndex %
            filteredCategories.length);

        currentIndexRef.current =
          resetIndex;

        flatListRef.current?.scrollToOffset({
          offset: resetIndex * ITEM_WIDTH,
          animated: false,
        });

        setTimeout(() => {
          currentIndexRef.current =
            resetIndex + 1;

          flatListRef.current?.scrollToOffset({
            offset:
              (resetIndex + 1) *
              ITEM_WIDTH,
            animated: true,
          });
        }, 50);

        return;
      }

      currentIndexRef.current =
        nextIndex;

      flatListRef.current?.scrollToOffset({
        offset: nextIndex * ITEM_WIDTH,
        animated: true,
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [
    filteredCategories.length,
    isReady,
  ]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <View
          style={styles.headerTextContainer}
        >
          <Text style={styles.subHeader}>
            DISCOVER
          </Text>

          <Text style={styles.mainHeader}>
            Our Home Decor
          </Text>
        </View>

        <ActivityIndicator
          size="large"
          color="#A9803F"
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (isError) {
    return (
      <View
        style={[
          styles.centerContainer,
          { minHeight: 400 },
        ]}
      >
        <View style={styles.errorIconBox}>
          <X
            size={24}
            color="#9C6B3E"
          />
        </View>

        <Text style={styles.errorTitle}>
          Something went astray
        </Text>

        <Text style={styles.errorSubtitle}>
          We couldn't reach the collection.
          Please try again.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={refetch}
        >
          <Text style={styles.retryText}>
            RETRY
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --------------------------------------------------
  // RENDER CARD
  // --------------------------------------------------

  const renderItem = ({
    item: virtualIndex,
  }: ListRenderItemInfo<number>) => {
    // Actual category index
    const categoryIndex =
      virtualIndex %
      filteredCategories.length;

    const item =
      filteredCategories[categoryIndex];

    const imageUrl = item._id
      ? imageByIndexUrl(item._id, 0)
      : item.image ||
      "https://via.placeholder.com/300";

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          handleOpenNowClick(item)
        }
        style={[
          styles.cardContainer,
          {
            width: CARD_WIDTH,
            marginRight: SPACING,
          },
        ]}
      >
        {/* IMAGE */}

        <Image
          source={{ uri: imageUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        {/* GRADIENT */}

        <LinearGradient
          colors={[
            "transparent",
            "rgba(30,27,22,0.25)",
            "rgba(30,27,22,0.85)",
          ]}
          style={StyleSheet.absoluteFill}
        />

        {/* CONTENT */}

        <View style={styles.cardContent}>
          <Text style={styles.collectionTag}>
            COLLECTION
          </Text>

          <Text
            style={styles.cardTitle}
            numberOfLines={1}
          >
            {item.category?.name ||
              item.name}
          </Text>

          {item.title && (
            <Text
              style={styles.cardSubTitle}
              numberOfLines={1}
            >
              {item.title}
            </Text>
          )}

          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() =>
              handleOpenNowClick(item)
            }

          >
            <Text style={styles.exploreText}>
              EXPLORE NOW
            </Text>

            <ChevronRight
              size={13}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // --------------------------------------------------
  // MAIN
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      <View
        style={styles.headerTextContainer}
      >
        <Text style={styles.subHeader}>
          DISCOVER
        </Text>

        <Text style={styles.mainHeader}>
          Our Home Decor
        </Text>
      </View>

      {filteredCategories.length > 0 && (
        // <FlatList
        //   ref={flatListRef}

        //   // IMPORTANT:
        //   // filteredCategories nahi,
        //   // virtual indexes
        //   data={virtualData}

        //   renderItem={renderItem}

        //   keyExtractor={(item) =>
        //     `category-${item}`
        //   }

        //   horizontal
        //  snapToInterval={CARD_WIDTH + SPACING}
        //   showsHorizontalScrollIndicator={
        //     false
        //   }

        //   // snapToInterval={ITEM_WIDTH}

        //   decelerationRate="fast"

        //   disableIntervalMomentum={true}

        //   contentContainerStyle={{
        //     paddingHorizontal:
        //       (SCREEN_WIDTH_VAL -
        //         CARD_WIDTH) /
        //       2,
        //   }}

        //   getItemLayout={(_, index) => ({
        //     length: ITEM_WIDTH,
        //     offset:
        //       ITEM_WIDTH * index,
        //     index,
        //   })}

        //   initialNumToRender={8}

        //   maxToRenderPerBatch={8}

        //   windowSize={7}

        //   removeClippedSubviews={true}
        // />

        <FlatList
          ref={flatListRef}
          data={virtualData}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          disableIntervalMomentum={true}
          contentContainerStyle={{
            paddingHorizontal:
              (SCREEN_WIDTH_VAL - CARD_WIDTH) / 2,
          }}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
        />
      )}
    </View>
  );
}