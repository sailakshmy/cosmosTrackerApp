import { TextureLoader, THREE } from "expo-three";
import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber/native";
import type { RootState } from "@react-three/fiber";
import { SphereGeometry } from "three";
import {
  ActivityIndicator,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";

type RotationSpeed = { x: number; y: number };

const unsupportedPixelStoreParams = new Set([
  0x9240, // UNPACK_FLIP_Y_WEBGL
  0x9241, // UNPACK_PREMULTIPLY_ALPHA_WEBGL
  0x9243, // UNPACK_COLORSPACE_CONVERSION_WEBGL
]);

type ExpoGLContext = ReturnType<THREE.WebGLRenderer["getContext"]>;

function patchExpoGLContext(gl: ExpoGLContext) {
  const originalPixelStorei = gl.pixelStorei.bind(gl);
  const originalGetProgramInfoLog = gl.getProgramInfoLog.bind(gl);
  const originalGetShaderInfoLog = gl.getShaderInfoLog.bind(gl);

  gl.pixelStorei = ((pname: number, param: number) => {
    if (unsupportedPixelStoreParams.has(pname)) {
      return;
    }

    originalPixelStorei(pname, param);
  }) as ExpoGLContext["pixelStorei"];

  gl.getProgramInfoLog = ((program: WebGLProgram) =>
    originalGetProgramInfoLog(program) ??
    "") as ExpoGLContext["getProgramInfoLog"];

  gl.getShaderInfoLog = ((shader: WebGLShader) =>
    originalGetShaderInfoLog(shader) ?? "") as ExpoGLContext["getShaderInfoLog"];
}

function EarthScene({
  rotationSpeedRef,
}: {
  rotationSpeedRef: React.MutableRefObject<RotationSpeed>;
}) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.8} />
      <Stars />
      <Earth rotationSpeedRef={rotationSpeedRef} />
      <Clouds rotationSpeedRef={rotationSpeedRef} />
      <Atmosphere />
    </>
  );
}

function Earth({
  rotationSpeedRef,
}: {
  rotationSpeedRef: React.MutableRefObject<RotationSpeed>;
}) {
  const earthRef = useRef<THREE.Mesh>(null);
  const earthTexture = useLoader(
    TextureLoader,
    require("../../assets/textures/earth-day-2048.jpg"),
  ) as THREE.Texture;

  useFrame(() => {
    if (!earthRef.current) return;

    earthRef.current.rotation.y += rotationSpeedRef.current.y;
    earthRef.current.rotation.x += rotationSpeedRef.current.x;

    rotationSpeedRef.current.x *= 0.98;

    if (Math.abs(rotationSpeedRef.current.y) < 0.003) {
      rotationSpeedRef.current.y += 0.00003;
    }
  });
  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial map={earthTexture} shininess={12} />
    </mesh>
  );
}

function Clouds({
  rotationSpeedRef,
}: {
  rotationSpeedRef: React.MutableRefObject<RotationSpeed>;
}) {
  const cloudsRef = useRef<THREE.Mesh>(null);
  const cloudsTexture = useLoader(
    TextureLoader,
    require("../../assets/textures/earth-clouds-2048.jpg"),
  ) as THREE.Texture;

  useFrame(() => {
    if (!cloudsRef.current) return;
    cloudsRef.current.rotation.y += rotationSpeedRef.current.y * 1.15;
    cloudsRef.current.rotation.x += rotationSpeedRef.current.x;
  });

  return (
    <mesh ref={cloudsRef}>
      <sphereGeometry args={[1.015, 64, 64]} />
      <meshPhongMaterial
        map={cloudsTexture}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.08, 64, 64]} />
      <meshBasicMaterial
        color="#60a5fa"
        transparent
        opacity={0.16}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function Stars() {
  const starPositions = useMemo(() => {
    const starCount = 900;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.18} sizeAttenuation />
    </points>
  );
}

function LoadingFallback() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color="#93c5fd" />
    </View>
  );
}

export default function EarthGlobe() {
  const rotationSpeedRef = useRef<RotationSpeed>({
    x: 0,
    y: 0.004,
  });

  const handleCanvasCreated = (state: RootState) => {
    patchExpoGLContext(state.gl.getContext());
    state.gl.debug.checkShaderErrors = false;
  };

  const panResponder = useMemo(
    () =>
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
    [],
  );

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{
            position: [0, 0, 4],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
          }}
          onCreated={handleCanvasCreated}
          style={styles.canvas}
        >
          <color attach="background" args={["#020617"]} />
          <EarthScene rotationSpeedRef={rotationSpeedRef} />
        </Canvas>
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 430,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#020617",
  },
  canvas: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
  },
});
