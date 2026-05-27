import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { SymbolView } from "expo-symbols";
import React, { useEffect, useState } from "react";
import {
  useColorScheme,
  Appearance,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";

const ThemeSwitcher = () => {
  const currentTheme = useColorScheme();
  const theme = useTheme();
  const [isDark, setIsDark] = useState(currentTheme === "dark");

  useEffect(() => {
    Appearance.setColorScheme(isDark ? "dark" : "light");
  }, [isDark]);

  const onChangeTheme = () => {
    setIsDark((prev) => !prev);
  };
  return (
    <Pressable
      onPress={onChangeTheme}
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={styles.themeStyle}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.themeButton,
            {
              backgroundColor: theme.backgroundSelected,
              borderColor: theme.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <SymbolView
            tintColor={theme.accent}
            name={isDark ? "sun.max.fill" : "moon.stars.fill"}
            size={14}
          />
          <ThemedText type="smallBold" themeColor="textSecondary">
            {isDark ? "Light" : "Dark"}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  themeStyle: {
    alignSelf: "center",
    borderRadius: Spacing.five,
  },
  themeButton: {
    borderWidth: 1,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    minWidth: 92,
    overflow: "hidden",
  },
});

export default ThemeSwitcher;
