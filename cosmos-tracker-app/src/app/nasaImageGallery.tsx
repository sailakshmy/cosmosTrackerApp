import { useCallback } from "react";
import PolaroidImageCard from "@/components/polaroid-image-card";
import { SpaceBackground } from "@/components/space-background";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  BottomTabInset,
  Colors,
  MaxContentWidth,
  Spacing,
} from "@/constants/theme";
import useImageGallery from "@/hooks/useImageGallery";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";

export default function NasaImageGallery() {
  const {
    theme,
    imageList,
    isLoading,
    width,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    fetchNextPage,
  } = useImageGallery();
  console.log("In the component", imageList?.length);

  const itemWidth =
    width >= 760 ? styles.threeColumnItem : styles.twoColumnItem;
  const columnCount = width >= 760 ? 3 : 2;

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SpaceBackground />
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView
            type="backgroundElement"
            style={[
              styles.heroSection,
              {
                borderColor: theme.border,
                backgroundColor:
                  theme.background === Colors.dark.background
                    ? "rgba(17, 24, 39, 0.9)"
                    : "rgba(255, 255, 255, 0.92)",
                shadowColor: theme.text,
              },
            ]}
          >
            <View style={styles.contentStack}>
              <ThemedText type="subtitle" themeColor="accent">
                Nasa Image Gallery
              </ThemedText>
              <FlashList
                style={styles.list}
                data={imageList}
                renderItem={({ item }) => (
                  <View style={styles.imageContainer}>
                    <PolaroidImageCard
                      imageDetails={item}
                      cardStyle={itemWidth}
                    />
                  </View>
                )}
                keyExtractor={(item) =>
                  `${item?.data?.[0]?.nasa_id}_${item?.data?.[0]?.title}`
                }
                ListFooterComponent={
                  isFetchingNextPage || isRefetching || isLoading ? (
                    <ActivityIndicator color={theme.accent} />
                  ) : null
                }
                masonry
                numColumns={columnCount}
                onEndReachedThreshold={0.2}
                onEndReached={handleEndReached}
              />
            </View>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignSelf: "stretch",
    flex: 1,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  contentStack: {
    flex: 1,
    gap: Spacing.four,
  },
  list: {
    flex: 1,
    alignSelf: "stretch",
  },
  imageContainer: {
    margin: 3,
  },
  oneColumnItem: {
    flexBasis: "100%",
  },
  twoColumnItem: {
    flexBasis: "48%",
  },
  threeColumnItem: {
    flexBasis: "31.5%",
  },
  masonryContainer: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  masonryColumn: {
    flex: 1,
    gap: Spacing.two,
  },
});
