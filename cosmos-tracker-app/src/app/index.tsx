import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import useApodHook from "@/hooks/useApodHook";
import { useTheme } from "@/hooks/use-theme";
import ThemeSwitcher from "@/components/theme-switcher";

export default function HomeScreen() {
  const { loading, apodData } = useApodHook();
  const theme = useTheme();

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView
            type="backgroundElement"
            style={[
              styles.heroSection,
              {
                borderColor: theme.border,
                shadowColor: theme.text,
              },
            ]}
          >
            <View style={styles.contentStack}>
              <View style={styles.contentStack}>
                <View style={styles.headingStack}>
                  <ThemedText type="subtitle" themeColor="accent">
                    Cosmos Tracker
                  </ThemedText>
                  <ThemeSwitcher />
                  <ThemedText type="title">
                    {loading ? "Loading today's cosmos..." : apodData?.title}
                  </ThemedText>
                </View>

                {/* <View className="gap-4 ">
                <InlineDatePicker
                  date={date}
                  setDate={setDate}
                  darkTheme={isDark}
                />
              </View> */}

                <View style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    source={apodData?.src}
                    // placeholder={{ blurhash }}
                    contentFit="cover"
                  />
                </View>

                <View style={styles.descriptionStack}>
                  <ThemedText
                    style={styles.description}
                    themeColor="textSecondary"
                  >
                    {apodData?.description}
                  </ThemedText>
                </View>
              </View>
            </View>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  description: {
    textAlign: "center",
  },
});
