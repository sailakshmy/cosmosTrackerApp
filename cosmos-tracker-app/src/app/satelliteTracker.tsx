import { SpaceBackground } from "@/components/space-background";
import { useTheme } from "../hooks/use-theme";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import EarthGlobal from "@/components/earth-global";
import { ThemedView } from "@/components/themed-view";
import {
  BottomTabInset,
  Colors,
  MaxContentWidth,
  Spacing,
} from "@/constants/theme";
import { ThemedText } from "@/components/themed-text";

const SatelliteTrackerScreen = () => {
  const theme = useTheme();
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
                      Satellite Tracker
                    </ThemedText>
                    <View style={styles.globeContainer}>
                      <EarthGlobal />
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
};

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
    width: "100%",
    flex: 1,
    paddingHorizontal: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    width: "100%",
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
    width: "100%",
    gap: Spacing.four,
  },
  headingStack: {
    width: "100%",
    gap: Spacing.three,
  },
  globeContainer: {
    width: "100%",
    alignSelf: "stretch",
    height: 420,
    minHeight: 420,
  },
});

export default SatelliteTrackerScreen;
