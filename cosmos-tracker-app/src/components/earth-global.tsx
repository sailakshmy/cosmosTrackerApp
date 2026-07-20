import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, TextureLoader } from "expo-three";
import * as THREE from "three";

interface Size {
  width: number;
  height: number;
}

const unsupportedPixelStoreParams = new Set([
  0x9240, // UNPACK_FLIP_Y_WEBGL
  0x9241, // UNPACK_PREMULTIPLY_ALPHA_WEBGL
  0x9243, // UNPACK_COLORSPACE_CONVERSION_WEBGL
]);

const silenceUnsupportedPixelStorei = (gl: ExpoWebGLRenderingContext) => {
  const originalPixelStorei = gl.pixelStorei.bind(gl);

  gl.pixelStorei = ((pname: number, param: number) => {
    if (unsupportedPixelStoreParams.has(pname)) {
      return;
    }

    originalPixelStorei(pname, param);
  }) as ExpoWebGLRenderingContext["pixelStorei"];

  return () => {
    gl.pixelStorei =
      originalPixelStorei as ExpoWebGLRenderingContext["pixelStorei"];
  };
};

const EarthGlobal = () => {
  const [size, setSize] = useState<Size | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const disposeSceneRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef(true);
  const rotationSpeedRef = useRef({ x: 0, y: 0.004 });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    if (!width || !height) return;

    setSize((currentSize) => {
      if (currentSize?.width === width && currentSize?.height === height) {
        return currentSize;
      }

      return { width, height };
    });
  };

  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      disposeSceneRef.current?.();
    };
  }, []);

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

      disposeSceneRef.current?.();
      const restorePixelStorei = silenceUnsupportedPixelStorei(gl);
      const bufferWidth = gl.drawingBufferWidth;
      const bufferHeight = gl.drawingBufferHeight;

      const renderer = new Renderer({
        gl,
        antialias: true,
        alpha: true,
        width: size.width, //bufferWidth,
        height: size.height, //bufferHeight,
      });
      renderer.setSize(size.width, size.height);
      // renderer.setSize(bufferWidth, bufferHeight);
      // renderer.setViewport(0, 0, bufferWidth, bufferHeight);
      renderer.setClearColor(0x020617, 1);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        bufferWidth / bufferHeight,
        0.1,
        100,
      );
      camera.position.set(0, 0, 2.9);

      const textureLoader = new TextureLoader();
      const earthTexture = textureLoader.load(
        require("../../assets/textures/earth-day-2048.jpg"),
      );
      const cloudTexture = textureLoader.load(
        require("../../assets/textures/earth-clouds-2048.jpg"),
      );

      const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
      const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: earthTexture,
        shininess: 12,
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      earth.rotation.x = -0.18;
      earthRef.current = earth;
      scene.add(earth);

      const cloudGeometry = new THREE.SphereGeometry(1.012, 64, 64);
      const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });
      const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
      clouds.rotation.x = -0.18;
      cloudRef.current = clouds;
      scene.add(clouds);

      const atmosphereGeometry = new THREE.SphereGeometry(1.04, 64, 64);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.09,
        side: THREE.BackSide,
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
      sunLight.position.set(4, 2, 5);
      scene.add(sunLight);

      const starGeometry = new THREE.BufferGeometry();
      const starCount = 1000;
      const starPositions = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 20;
        starPositions[i + 1] = (Math.random() - 0.5) * 20;
        starPositions[i + 2] = (Math.random() - 0.5) * 20;
      }

      starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(starPositions, 3),
      );

      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.015,
        sizeAttenuation: true,
      });
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      const render = () => {
        if (!isMountedRef.current) return;

        animationFrameRef.current = requestAnimationFrame(render);

        if (earthRef.current) {
          earthRef.current.rotation.y += rotationSpeedRef.current.y;
          earthRef.current.rotation.x += rotationSpeedRef.current.x;
        }

        if (cloudRef.current) {
          cloudRef.current.rotation.y += rotationSpeedRef.current.y * 1.2;
          cloudRef.current.rotation.x += rotationSpeedRef.current.x;
        }

        rotationSpeedRef.current.x *= 0.98;

        if (Math.abs(rotationSpeedRef.current.y) < 0.004) {
          rotationSpeedRef.current.y += 0.00002;
        }

        // renderer.setViewport(0, 0, bufferWidth, bufferHeight);
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };

      render();

      disposeSceneRef.current = () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        earthGeometry.dispose();
        earthMaterial.dispose();
        earthTexture.dispose();
        cloudGeometry.dispose();
        cloudMaterial.dispose();
        cloudTexture.dispose();
        atmosphereGeometry.dispose();
        atmosphereMaterial.dispose();
        starGeometry.dispose();
        starMaterial.dispose();
        renderer.dispose();
        restorePixelStorei();
      };
    },
    [size],
  );

  return (
    <View
      style={styles.container}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
    >
      {size ? (
        <GLView
          key={`${size.width}x${size.height}`}
          style={[styles.glView, size]}
          onContextCreate={onContextCreate}
          msaaSamples={4}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    minHeight: 420,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#020617",
  },
  glView: {
    alignSelf: "stretch",
  },
});

export default EarthGlobal;
