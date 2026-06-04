import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type ImageSkeletonProps = {
  style?: StyleProp<ViewStyle>;
};

export function ImageSkeleton({ style }: ImageSkeletonProps) {
  const theme = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);
  const isDark = theme.background === Colors.dark.background;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: Platform.OS === "android" ? 2200 : 2400,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [shimmer]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const shimmerWidth = Math.max(width * 0.28, 72);
  const travelDistance = width + shimmerWidth;
  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-shimmerWidth, travelDistance],
  });
  const shimmerOpacity = shimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.04, isDark ? 0.18 : 0.14, 0.04],
  });

  return (
    <View
      accessibilityLabel="Image loading"
      accessibilityRole="image"
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? theme.backgroundElement : theme.background,
          borderColor: theme.border,
          shadowColor: theme.text,
        },
        Platform.OS === "ios" && styles.iosDepth,
        Platform.OS === "android" && styles.androidDepth,
        style,
      ]}
    >
      <View
        style={[
          styles.softGlow,
          {
            backgroundColor: isDark
              ? "rgba(45, 212, 191, 0.06)"
              : "rgba(99, 102, 241, 0.05)",
          },
        ]}
      />
      <View
        style={[
          styles.distantGlow,
          {
            backgroundColor: isDark
              ? "rgba(99, 102, 241, 0.08)"
              : "rgba(45, 212, 191, 0.07)",
          },
        ]}
      />
      <Animated.View
        style={[
          styles.shimmer,
          {
            width: shimmerWidth,
            backgroundColor: isDark
              ? "rgba(203, 213, 225, 0.34)"
              : "rgba(255, 255, 255, 0.72)",
            opacity: shimmerOpacity,
            transform: [{ translateX }, { rotate: "8deg" }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: Spacing.three,
  },
  softGlow: {
    ...StyleSheet.absoluteFill,
    opacity: 1,
  },
  distantGlow: {
    position: "absolute",
    width: "70%",
    height: "70%",
    right: "-22%",
    bottom: "-18%",
    borderRadius: 999,
    opacity: 0.7,
  },
  shimmer: {
    position: "absolute",
    top: "-18%",
    bottom: "-18%",
  },
  iosDepth: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  androidDepth: {
    elevation: 1,
  },
});
