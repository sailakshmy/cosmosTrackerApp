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
import { ImageResponse } from "@/utilities/types";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NasaImageGallery() {
  const { theme, imageList, isFetching, isLoading } = useImageGallery();
  // console.log("In the component", imageList);
  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SpaceBackground />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
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
                <View style={styles.contentStack}>
                  <View style={styles.headingStack}>
                    <ThemedText type="subtitle" themeColor="accent">
                      Nasa Image Gallery
                    </ThemedText>
                    <View>
                      {imageList?.map((imageData: ImageResponse) => {
                        console.log("Each item", imageData);
                        return (
                          <PolaroidImageCard
                            key={imageData?.data?.[0]?.nasa_id}
                            imageDetails={imageData}
                          />
                        );
                      })}
                    </View>
                  </View>
                </View>
              </View>
            </ThemedView>
          </SafeAreaView>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
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
    gap: Spacing.four,
  },
  headingStack: {
    gap: Spacing.three,
  },
});
