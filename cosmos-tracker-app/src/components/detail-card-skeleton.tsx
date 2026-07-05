import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type DetailCardSkeletonProps = {
  itemCount?: number;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
};

export function DetailCardSkeleton({
  itemCount = 6,
  style,
  itemStyle,
}: DetailCardSkeletonProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
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

  const itemWidth =
    width >= 760
      ? styles.threeColumnItem
      : // width >= 520
        // ?
        styles.twoColumnItem;
  // : styles.oneColumnItem;

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
      accessibilityLabel="Details loading"
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
          style={styles.title}
        />

        <View style={styles.detailsGrid}>
          {Array.from({ length: itemCount }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.detailItem,
                itemWidth,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
                itemStyle,
              ]}
            >
              <SkeletonLine
                isDark={isDark}
                shimmerOpacity={shimmerOpacity}
                translateX={translateX}
                style={styles.detailKey}
              />
              <SkeletonLine
                isDark={isDark}
                shimmerOpacity={shimmerOpacity}
                translateX={translateX}
                style={
                  index % 3 === 1 ? styles.detailValueShort : styles.detailValue
                }
              />
            </View>
          ))}
        </View>
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
          backgroundColor: isDark
            ? Colors.dark.background
            : Colors.light.border,
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

export default DetailCardSkeleton;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minWidth: 0,
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
    minWidth: 0,
    gap: Spacing.three,
  },
  line: {
    maxWidth: "100%",
    overflow: "hidden",
    borderRadius: 999,
  },
  title: {
    width: 180,
    height: 28,
  },
  detailsGrid: {
    minWidth: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  detailItem: {
    minWidth: 0,
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.one,
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
  detailKey: {
    width: 96,
    height: 18,
  },
  detailValue: {
    width: 148,
    height: 24,
  },
  detailValueShort: {
    width: 116,
    height: 24,
  },
  shimmer: {
    position: "absolute",
    top: "-80%",
    bottom: "-80%",
    width: 72,
  },
});
