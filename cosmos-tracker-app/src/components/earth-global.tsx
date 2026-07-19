import { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";

const earthTexture = require("../../assets/textures/earth-day.jpg");
const cloudTexture = require("../../assets/textures/earth-clouds.jpg");
const globeSize = 248;
const textureWidth = globeSize * 2;

const stars = [
  { top: 46, left: 52, opacity: 0.8 },
  { top: 76, left: 308, opacity: 0.55 },
  { top: 130, left: 32, opacity: 0.65 },
  { top: 160, left: 364, opacity: 0.7 },
  { top: 260, left: 64, opacity: 0.45 },
  { top: 306, left: 336, opacity: 0.75 },
  { top: 361, left: 132, opacity: 0.6 },
];

const latitudeLines = [
  { top: 44, left: 20, width: 208, height: 54, opacity: 0.2 },
  { top: 82, left: 12, width: 224, height: 62, opacity: 0.24 },
  { top: 124, left: 10, width: 228, height: 54, opacity: 0.2 },
  { top: 160, left: 26, width: 196, height: 44, opacity: 0.16 },
];

const longitudeLines = [
  { left: 35, width: 68, rotate: "-12deg", opacity: 0.14 },
  { left: 83, width: 72, rotate: "0deg", opacity: 0.18 },
  { left: 136, width: 68, rotate: "12deg", opacity: 0.14 },
];

const EarthGlobal = () => {
  const spin = useRef(new Animated.Value(0)).current;
  const spinAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const dragRotationRef = useRef(0);

  const startSpin = useCallback(() => {
    spinAnimationRef.current?.stop();

    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 24000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    spinAnimationRef.current = animation;
    animation.start();
  }, [spin]);

  useEffect(() => {
    startSpin();

    return () => {
      spinAnimationRef.current?.stop();
    };
  }, [startSpin]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        spin.stopAnimation((value) => {
          dragRotationRef.current = value;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        const nextValue =
          dragRotationRef.current - gestureState.dx / textureWidth;
        spin.setValue(nextValue - Math.floor(nextValue));
      },
      onPanResponderRelease: () => {
        startSpin();
      },
    }),
  ).current;

  const translateX = spin.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -textureWidth],
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {stars.map((star, index) => (
        <View key={index} style={[styles.star, star]} />
      ))}

      <View style={styles.globeStage}>
        {/* <View style={styles.outerGlow} /> */}

        <View style={styles.globe}>
          <Animated.View
            style={[styles.textureStrip, { transform: [{ translateX }] }]}
          >
            <Image
              source={earthTexture}
              style={styles.textureImage}
              resizeMode="stretch"
            />
            <Image
              source={earthTexture}
              style={styles.textureImage}
              resizeMode="stretch"
            />
          </Animated.View>

          <Animated.View
            style={[styles.cloudStrip, { transform: [{ translateX }] }]}
          >
            <Image
              source={cloudTexture}
              style={styles.cloudImage}
              resizeMode="stretch"
            />
            <Image
              source={cloudTexture}
              style={styles.cloudImage}
              resizeMode="stretch"
            />
          </Animated.View>
          <View style={styles.lightFalloff} />
          {/* <View style={styles.leftTerminator} /> */}
          {/* <View style={styles.shadow} /> */}
          <View style={styles.rimShadow} />
          <View style={styles.atmosphere} />
          <View style={styles.specularHighlight} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    minHeight: 420,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#020617",
  },
  star: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#f8fafc",
  },
  globeStage: {
    width: 318,
    height: 318,
    alignItems: "center",
    justifyContent: "center",
  },
  outerGlow: {
    position: "absolute",
    width: 286,
    height: 286,
    borderRadius: 999,
    borderWidth: 18,
    borderColor: "rgba(56, 189, 248, 0.08)",
    backgroundColor: "rgba(14, 165, 233, 0.04)",
  },
  globe: {
    width: globeSize,
    height: globeSize,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#2563eb",
    borderWidth: 2,
    borderColor: "rgba(186, 230, 253, 0.82)",
    shadowColor: "#38bdf8",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 26,
    elevation: 12,
  },
  textureStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    flexDirection: "row",
    width: textureWidth * 2,
    height: globeSize,
  },
  cloudStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    flexDirection: "row",
    width: textureWidth * 2,
    height: globeSize,
    opacity: 0.36,
  },
  textureImage: {
    width: textureWidth,
    height: globeSize,
  },
  cloudImage: {
    width: textureWidth,
    height: globeSize,
  },
  latitudeLine: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(224, 242, 254, 0.72)",
    borderRadius: 999,
    transform: [{ rotate: "-7deg" }],
  },
  longitudeLine: {
    position: "absolute",
    top: 10,
    height: 228,
    borderWidth: 1,
    borderColor: "rgba(224, 242, 254, 0.62)",
    borderRadius: 999,
  },
  lightFalloff: {
    position: "absolute",
    top: 12,
    left: 22,
    width: 132,
    height: 138,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  leftTerminator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 76,
    backgroundColor: "rgba(2, 6, 23, 0.24)",
  },
  shadow: {
    position: "absolute",
    top: -10,
    right: -22,
    width: 190,
    height: 286,
    borderRadius: 999,
    backgroundColor: "rgba(2, 6, 23, 0.42)",
  },
  rimShadow: {
    position: "absolute",
    top: 8,
    right: 6,
    bottom: 8,
    left: 6,
    borderRadius: 999,
    borderRightWidth: 18,
    borderBottomWidth: 14,
    borderColor: "rgba(2, 6, 23, 0.26)",
  },
  atmosphere: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 999,
    borderWidth: 10,
    borderColor: "rgba(125, 211, 252, 0.22)",
  },
  specularHighlight: {
    position: "absolute",
    top: 30,
    left: 48,
    width: 78,
    height: 54,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    transform: [{ rotate: "-24deg" }],
  },
});

export default EarthGlobal;
