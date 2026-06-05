import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const stars = [
  { left: "7%", top: "18%", size: 1.6, tone: "white", opacity: 0.72, driftX: 10, driftY: 7 },
  { left: "13%", top: "72%", size: 1.9, tone: "violet", opacity: 0.58, driftX: -8, driftY: 10 },
  { left: "18%", top: "34%", size: 1.3, tone: "white", opacity: 0.54, driftX: 7, driftY: -8 },
  { left: "22%", top: "86%", size: 1.7, tone: "cyan", opacity: 0.52, driftX: 12, driftY: -5 },
  { left: "28%", top: "11%", size: 1.8, tone: "white", opacity: 0.58, driftX: -10, driftY: 8 },
  { left: "32%", top: "58%", size: 2.1, tone: "violet", opacity: 0.62, driftX: 9, driftY: 11 },
  { left: "39%", top: "24%", size: 1.2, tone: "white", opacity: 0.48, driftX: -7, driftY: -9 },
  { left: "43%", top: "80%", size: 1.6, tone: "white", opacity: 0.58, driftX: 8, driftY: -11 },
  { left: "49%", top: "16%", size: 1.7, tone: "cyan", opacity: 0.54, driftX: -11, driftY: 7 },
  { left: "54%", top: "67%", size: 1.4, tone: "white", opacity: 0.5, driftX: 10, driftY: 6 },
  { left: "59%", top: "41%", size: 2, tone: "violet", opacity: 0.56, driftX: -8, driftY: 10 },
  { left: "65%", top: "9%", size: 1.3, tone: "white", opacity: 0.5, driftX: 7, driftY: -8 },
  { left: "69%", top: "87%", size: 1.7, tone: "cyan", opacity: 0.52, driftX: -10, driftY: -6 },
  { left: "74%", top: "31%", size: 1.8, tone: "white", opacity: 0.66, driftX: 12, driftY: 7 },
  { left: "79%", top: "63%", size: 1.7, tone: "violet", opacity: 0.54, driftX: -9, driftY: 8 },
  { left: "84%", top: "16%", size: 1.4, tone: "white", opacity: 0.58, driftX: 8, driftY: -9 },
  { left: "91%", top: "47%", size: 1.8, tone: "cyan", opacity: 0.5, driftX: -12, driftY: 5 },
  { left: "96%", top: "77%", size: 1.3, tone: "white", opacity: 0.5, driftX: -8, driftY: -10 },
  { left: "12%", top: "46%", size: 3.4, tone: "white", opacity: 0.2, driftX: 14, driftY: 9 },
  { left: "88%", top: "88%", size: 4, tone: "violet", opacity: 0.24, driftX: -14, driftY: -8 },
] as const;

const tones = {
  white: "#f8fafc",
  cyan: "#7df9ff",
  violet: "#a5b4fc",
} as const;

const shootingStars = [
  { left: "3%", top: "21%", width: 112, rotate: "13deg", opacity: 0.22, delay: 600, duration: 3900, travelX: 290, travelY: 70 },
  { left: "56%", top: "13%", width: 86, rotate: "13deg", opacity: 0.18, delay: 3600, duration: 4300, travelX: 220, travelY: 56 },
  { left: "68%", top: "56%", width: 74, rotate: "13deg", opacity: 0.14, delay: 6900, duration: 4700, travelX: 180, travelY: 44 },
] as const;

type Star = (typeof stars)[number];
type ShootingStar = (typeof shootingStars)[number];

function AnimatedStar({ star, index }: { star: Star; index: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(index * 180),
        Animated.timing(progress, {
          toValue: 1,
          duration: 5200 + index * 240,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 5200 + index * 240,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [index, progress]);

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [star.opacity * 0.46, star.opacity, star.opacity * 0.68],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, star.driftX],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, star.driftY],
  });

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: star.left,
          top: star.top,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          backgroundColor: tones[star.tone],
          opacity,
          transform: [{ translateX }, { translateY }],
        },
      ]}
    />
  );
}

function AnimatedShootingStar({ star }: { star: ShootingStar }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(star.delay),
        Animated.timing(progress, {
          toValue: 1,
          duration: star.duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(5600),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [progress, star.delay, star.duration]);

  const opacity = progress.interpolate({
    inputRange: [0, 0.16, 0.72, 1],
    outputRange: [0, star.opacity, star.opacity * 0.66, 0],
  });
  const scaleX = progress.interpolate({
    inputRange: [0, 0.18, 0.82, 1],
    outputRange: [0.2, 1, 0.76, 0.34],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, star.travelX],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, star.travelY],
  });

  return (
    <Animated.View
      style={[
        styles.shootingStar,
        {
          left: star.left,
          top: star.top,
          width: star.width,
          opacity,
          transform: [
            { translateX },
            { translateY },
            { rotate: star.rotate },
            { scaleX },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.shootingStarTail,
          {
            backgroundColor: "rgba(125, 249, 255, 0.85)",
          },
        ]}
      />
    </Animated.View>
  );
}

export function SpaceBackground() {
  return (
    <View
      pointerEvents="none"
      style={[styles.background, { backgroundColor: "#050816" }]}
    >
      <View
        style={[
          styles.baseWash,
          {
            backgroundColor: "rgba(7, 17, 31, 0.68)",
          },
        ]}
      />
      <View
        style={[
          styles.glow,
          styles.glowTopLeft,
          {
            backgroundColor: "rgba(99, 102, 241, 0.2)",
          },
        ]}
      />
      <View
        style={[
          styles.glow,
          styles.glowTopRight,
          {
            backgroundColor: "rgba(45, 212, 191, 0.12)",
          },
        ]}
      />
      <View
        style={[
          styles.glow,
          styles.glowBottom,
          {
            backgroundColor: "rgba(99, 102, 241, 0.12)",
          },
        ]}
      />
      <View style={styles.galaxyBand} />

      {stars.map((star, index) => (
        <AnimatedStar
          key={`${star.left}-${star.top}-${index}`}
          star={star}
          index={index}
        />
      ))}

      {shootingStars.map((star, index) => (
        <AnimatedShootingStar
          key={`${star.left}-${index}`}
          star={star}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  baseWash: {
    ...StyleSheet.absoluteFill,
  },
  glow: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.95,
  },
  glowTopLeft: {
    width: 260,
    height: 260,
    left: -78,
    top: -18,
    transform: [{ scaleX: 1.3 }],
  },
  glowTopRight: {
    width: 220,
    height: 220,
    right: -76,
    top: -42,
    transform: [{ scaleX: 1.16 }],
  },
  glowBottom: {
    width: 300,
    height: 300,
    right: -44,
    bottom: -96,
    transform: [{ scaleX: 1.28 }],
  },
  galaxyBand: {
    position: "absolute",
    width: "130%",
    height: 160,
    left: "-15%",
    top: "35%",
    borderRadius: 999,
    backgroundColor: "rgba(99, 102, 241, 0.14)",
    opacity: 0.42,
    transform: [{ rotate: "-14deg" }],
  },
  star: {
    position: "absolute",
  },
  shootingStar: {
    position: "absolute",
    height: 2,
  },
  shootingStarTail: {
    flex: 1,
    borderRadius: 999,
  },
});
