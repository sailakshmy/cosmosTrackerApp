import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type CardSkeletonProps = {
  style?: StyleProp<ViewStyle>;
};

export function CardSkeleton({ style }: CardSkeletonProps) {
  const theme = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;
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

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 180],
  });
  const shimmerOpacity = shimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.05, isDark ? 0.24 : 0.44, 0.05],
  });

  return (
    <View
      accessibilityLabel="Card loading"
      accessibilityRole="progressbar"
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
          shadowColor: theme.text,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <SkeletonLine
          isDark={isDark}
          shimmerOpacity={shimmerOpacity}
          translateX={translateX}
          style={styles.subtitle}
        />
        <SkeletonLine
          isDark={isDark}
          shimmerOpacity={shimmerOpacity}
          translateX={translateX}
          style={styles.title}
        />
        <SkeletonLine
          isDark={isDark}
          shimmerOpacity={shimmerOpacity}
          translateX={translateX}
          style={styles.copy}
        />
        <SkeletonLine
          isDark={isDark}
          shimmerOpacity={shimmerOpacity}
          translateX={translateX}
          style={styles.copyShort}
        />
      </View>
    </View>
  );
}

type SkeletonLineProps = {
  isDark: boolean;
  shimmerOpacity: Animated.AnimatedInterpolation<number>;
  translateX: Animated.AnimatedInterpolation<number>;
  style: StyleProp<ViewStyle>;
};

function SkeletonLine({
  isDark,
  shimmerOpacity,
  translateX,
  style,
}: SkeletonLineProps) {
  return (
    <View
      style={[
        styles.line,
        {
          backgroundColor: isDark ? Colors.dark.background : Colors.light.border,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            backgroundColor: isDark
              ? "rgba(148, 163, 184, 0.38)"
              : "rgba(255, 255, 255, 0.85)",
            opacity: shimmerOpacity,
            transform: [{ translateX }, { rotate: "8deg" }],
          },
        ]}
      />
    </View>
  );
}

export default CardSkeleton;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minWidth: 0,
    minHeight: 210,
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.four,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  line: {
    maxWidth: "100%",
    overflow: "hidden",
    borderRadius: 999,
  },
  subtitle: {
    width: 150,
    height: 18,
  },
  title: {
    width: 220,
    height: 30,
  },
  copy: {
    width: 260,
    height: 16,
  },
  copyShort: {
    width: 180,
    height: 16,
  },
  shimmer: {
    position: "absolute",
    top: "-80%",
    bottom: "-80%",
    width: 72,
  },
});
