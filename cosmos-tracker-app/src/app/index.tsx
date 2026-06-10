import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { ImageSkeleton } from "@/components/image-skeleton";
import { SpaceBackground } from "@/components/space-background";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import {
  BottomTabInset,
  Colors,
  MaxContentWidth,
  Spacing,
} from "@/constants/theme";
import useApodHook from "@/hooks/useApodHook";
import ThemeSwitcher from "@/components/theme-switcher";
import InlineDatePicker from "@/components/date-picker";
import VideoScreen from "@/components/video-player";

export default function HomeScreen() {
  const {
    apodData,
    date,
    setDate,
    theme,
    imageSource,
    blurhash,
    setImageLoading,
    showImageSkeleton,
    isLoading,
  } = useApodHook();
  console.log("Here", isLoading);
  console.log("showImageSkeleton", showImageSkeleton);
  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SpaceBackground />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
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
                      Astronomy Picture of the Day
                    </ThemedText>

                    <View>
                      <InlineDatePicker date={date} setDate={setDate} />
                    </View>
                  </View>
                  {isLoading ? (
                    <ImageSkeleton style={styles.imageContainer} />
                  ) : (
                    <>
                      <ThemedText type="title">{apodData?.title}</ThemedText>
                      {apodData?.mediaType === "image" && (
                        <View style={styles.imageContainer}>
                          <Image
                            style={styles.image}
                            source={imageSource}
                            placeholder={{ blurhash }}
                            contentFit="contain"
                            onLoad={() => setImageLoading(false)}
                            onError={(error) => {
                              setImageLoading(false);
                              console.log("Image load error", error);
                            }}
                          />
                          {showImageSkeleton && (
                            <ImageSkeleton style={styles.imageSkeleton} />
                          )}
                        </View>
                      )}
                      {apodData?.mediaType === "video" && (
                        <VideoScreen videoSource={apodData?.src} />
                      )}
                      <View style={styles.descriptionStack}>
                        <ThemedText
                          style={styles.description}
                          themeColor="textSecondary"
                        >
                          {apodData?.description}
                        </ThemedText>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </ThemedView>
          </SafeAreaView>
        </View>
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
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
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
  descriptionStack: {
    gap: Spacing.three,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: Spacing.three,
    backgroundColor: "#020617",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageSkeleton: {
    ...StyleSheet.absoluteFill,
  },
  description: {
    textAlign: "center",
  },
});
