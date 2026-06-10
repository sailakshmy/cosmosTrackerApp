import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  useColorScheme,
  Appearance,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

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
      accessibilityState={{ checked: isDark }}
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
          <Ionicons
            color={theme.accent}
            name={isDark ? "sunny" : "moon"}
            size={18}
          />
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
    width: 40,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 12,
    marginHorizontal: 14,
  },
});

export default ThemeSwitcher;
