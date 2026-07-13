import { useCallback, useRef, useState } from "react";
import { LayoutChangeEvent, PanResponder, View } from "react-native";
import * as THREE from "three";
import { ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer, TextureLoader } from "expo-three";

interface Size {
  width: number;
  height: number;
}

const EarthGlobal = () => {
  const [size, setSize] = useState<Size | null>();
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rotationSpeedRef = useRef({ x: 0, y: 0.004 });
  const cameraDistanceRef = useRef(4);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setSize({ width, height });
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        rotationSpeedRef.current.y = gestureState.dx * 0.00008;
        rotationSpeedRef.current.x = gestureState.dy * 0.00008;
      },
      onPanResponderRelease: () => {
        rotationSpeedRef.current.x *= 0.92;
        rotationSpeedRef.current.y *= 0.92;

        if (Math.abs(rotationSpeedRef.current.y) < 0.001) {
          rotationSpeedRef.current.y = 0.004;
        }
      },
    }),
  ).current;

  const onContextCreate = useCallback(
    async (gl: ExpoWebGLRenderingContext) => {
      if (!size) return;
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor(0x20617, 1);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        45,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        100,
      );
      camera.position.set(0, 0, cameraDistanceRef.current);

      const textureLoader = new TextureLoader();

      const earthTexture = textureLoader.load(
        require("../../assets/textures/earth-day.jpg"),
      );
      const cloudTexture = textureLoader.load(
        require("../../assets/textures/earth-clouds.jpg"),
      );
    },
    [size],
  );

  return <View></View>;
};

export default EarthGlobal;
