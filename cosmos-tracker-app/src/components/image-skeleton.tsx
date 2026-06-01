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
        duration: Platform.OS === "android" ? 1250 : 1450,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [shimmer]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const shimmerWidth = Math.max(width * 0.42, 96);
  const travelDistance = width + shimmerWidth;
  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-shimmerWidth, travelDistance],
  });

  return (
    <View
      accessibilityLabel="Image loading"
      accessibilityRole="image"
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundSelected,
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
              ? "rgba(45, 212, 191, 0.10)"
              : "rgba(99, 102, 241, 0.10)",
          },
        ]}
      />
      <Animated.View
        style={[
          styles.shimmer,
          {
            width: shimmerWidth,
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.16)"
              : "rgba(255, 255, 255, 0.74)",
            transform: [{ translateX }, { rotate: "12deg" }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.gloss,
          {
            width: shimmerWidth * 0.35,
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.22)"
              : "rgba(255, 255, 255, 0.92)",
            transform: [{ translateX }, { rotate: "12deg" }],
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
    opacity: 0.9,
  },
  shimmer: {
    position: "absolute",
    top: "-22%",
    bottom: "-22%",
    opacity: 0.9,
  },
  gloss: {
    position: "absolute",
    top: "-22%",
    bottom: "-22%",
    opacity: 0.85,
  },
  iosDepth: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  androidDepth: {
    elevation: 3,
  },
});
