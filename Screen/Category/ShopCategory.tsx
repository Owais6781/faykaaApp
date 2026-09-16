
import { useMemo, useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { X } from "lucide-react-native";

import { styles, AVATAR_SIZE } from "./ShopeCategory.styles";
import { AppText } from "../../components/FontProvider/FontProvider"; // From your previous AppText setup
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
  name?: string;
};

const ITEM_WIDTH = AVATAR_SIZE + 20;

// Kitne virtual items screen par loop ke liye use honge
const VIRTUAL_COUNT = 10000;

export default function ShopCategory() {
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

  // --------------------------------------------------
  // UNIQUE CATEGORIES
  // --------------------------------------------------

  const uniqueCategories = useMemo(() => {
    const map = new Map<string, CategoryItem>();

    (data || []).forEach((item: CategoryItem) => {
      const categoryName =
        item.category?.name || item.name || "";

      if (!categoryName) return;

      if (!map.has(categoryName)) {
        map.set(categoryName, item);
      }
    });

    return Array.from(map.values());
  }, [data]);

  // --------------------------------------------------
  // VIRTUAL DATA
  // IMPORTANT:
  // API DATA DUPLICATE NAHI HO RAHA
  // Sirf indexes virtual hain.
  // --------------------------------------------------

  const virtualData = useMemo(() => {
    if (uniqueCategories.length === 0) {
      return [];
    }

    return Array.from(
      { length: VIRTUAL_COUNT },
      (_, index) => index
    );
  }, [uniqueCategories.length]);

  // --------------------------------------------------
  // IMAGE URL
  // --------------------------------------------------

  const imageByIndexUrl = (
    productId: string,
    index: number
  ) => {
    return `${Api}/api/${productId}/img/${index}`;
  };

  // --------------------------------------------------
  // CATEGORY CLICK
  // --------------------------------------------------

  const handleCategoryClick = (item: CategoryItem) => {
    const categoryName =
      item.category?.name || item.name || "";

    if (!categoryName) return;

    const categorySlug = categoryName
      .toLowerCase()
      .replace(/\s+/g, "-");

    navigation.navigate("CategoryList", {
      category: categorySlug,
    });
  };

  // --------------------------------------------------
  // START POSITION
  //
  // Center se start kar rahe hain.
  // Isliye user ko beginning/end ka pata nahi chalega.
  // --------------------------------------------------

  useEffect(() => {
    if (uniqueCategories.length === 0) return;

    const middleIndex =
      Math.floor(VIRTUAL_COUNT / 2);

    // Middle index ko actual category ke start
    // par align karna
    const startIndex =
      middleIndex -
      (middleIndex % uniqueCategories.length);

    currentIndexRef.current = startIndex;

    const timer = setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: startIndex * ITEM_WIDTH,
        animated: false,
      });

      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [uniqueCategories.length]);

  // --------------------------------------------------
  // AUTO PLAY
  // Web Swiper:
  //
  // delay: 2000
  // speed: 1500
  //
  // RN me approximately same smooth behavior.
  // --------------------------------------------------

  useEffect(() => {
    if (
      uniqueCategories.length <= 1 ||
      !isReady
    ) {
      return;
    }

    const timer = setInterval(() => {
      const nextIndex =
        currentIndexRef.current + 1;

      // End ke paas pahunchne se pehle
      // silently center par shift kar denge.
      if (
        nextIndex >=
        VIRTUAL_COUNT - uniqueCategories.length * 2
      ) {
        const middleIndex =
          Math.floor(VIRTUAL_COUNT / 2);

        const resetIndex =
          middleIndex -
          (middleIndex % uniqueCategories.length);

        currentIndexRef.current = resetIndex;

        flatListRef.current?.scrollToOffset({
          offset: resetIndex * ITEM_WIDTH,
          animated: false,
        });

        // Next tick par continue
        setTimeout(() => {
          currentIndexRef.current =
            resetIndex + 1;

          flatListRef.current?.scrollToOffset({
            offset:
              (resetIndex + 1) * ITEM_WIDTH,
            animated: true,
          });
        }, 50);

        return;
      }

      currentIndexRef.current = nextIndex;

      flatListRef.current?.scrollToOffset({
        offset: nextIndex * ITEM_WIDTH,
        animated: true,
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [
    uniqueCategories.length,
    isReady,
  ]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.headerContainer}>
          <AppText
            variant="uiSemiBold"
            style={styles.subHeader}
          >
            EXPLORE
          </AppText>

          <AppText
            variant="displaySemiBold"
            style={styles.mainHeader}
          >
            Shop by Category
          </AppText>
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
          <X size={24} color="#9C6B3E" />
        </View>

        <AppText
          variant="displaySemiBold"
          style={styles.errorTitle}
        >
          Something went astray
        </AppText>

        <AppText
          variant="ui"
          style={styles.errorSubtitle}
        >
          We couldn't reach the collection.
          Please try again.
        </AppText>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={refetch}
        >
          <AppText
            variant="uiSemiBold"
            style={styles.retryText}
          >
            RETRY
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.headerContainer}>
        <AppText
          variant="uiSemiBold"
          style={styles.subHeader}
        >
          EXPLORE 
        </AppText>

        <AppText
          variant="displaySemiBold"
          style={styles.mainHeader}
        >
          Shop by Category
        </AppText>
      </View>

      {/* CATEGORY SLIDER */}

      {uniqueCategories.length > 0 && (
        <View
          style={{
            height: AVATAR_SIZE + 45,
          }}
        >
          <FlatList
            ref={flatListRef}

            data={virtualData}

            horizontal

            showsHorizontalScrollIndicator={false}

            keyExtractor={(item) =>
              `virtual-category-${item}`
            }

            snapToInterval={ITEM_WIDTH}

            decelerationRate="fast"

            disableIntervalMomentum={true}

            getItemLayout={(_, index) => ({
              length: ITEM_WIDTH,
              offset: ITEM_WIDTH * index,
              index,
            })}

            initialNumToRender={12}

            maxToRenderPerBatch={12}

            windowSize={7}

            removeClippedSubviews={true}

            renderItem={({ item: virtualIndex }) => {

              // Actual API category
              const categoryIndex =
                virtualIndex %
                uniqueCategories.length;

              const item =
                uniqueCategories[categoryIndex];

              const imageUrl = item?._id
                ? imageByIndexUrl(
                    item._id,
                    0
                  )
                : item?.image ||
                  "https://via.placeholder.com/150";

              const categoryName =
                item?.category?.name ||
                item?.name ||
                "";

              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    handleCategoryClick(item)
                  }
                  style={[
                    styles.itemContainer,
                    {
                      width: AVATAR_SIZE,
                      marginRight: 20,
                    },
                  ]}
                >
                  {/* IMAGE */}

                  <View
                    style={styles.imageWrapper}
                  >
                    <Image
                      source={{
                        uri: imageUrl,
                      }}
                      style={
                        styles.categoryImage
                      }
                      resizeMode="cover"
                    />
                  </View>

                  {/* NAME */}

                  <AppText
                    variant="uiMedium"
                    style={styles.categoryName}
                    numberOfLines={1}
                  >
                    {categoryName}
                  </AppText>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}