import {
  Suspense,
  useMemo,
  useRef,
} from "react";
import {
  ActivityIndicator,
  Image,
  PanResponder,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Canvas, useFrame, useLoader } from "@react-three/fiber/native";
import type { RootState } from "@react-three/fiber";
import { TextureLoader, THREE } from "expo-three";

type RotationSpeed = { x: number; y: number };

const unsupportedPixelStoreParams = new Set([
  0x9240, // UNPACK_FLIP_Y_WEBGL
  0x9241, // UNPACK_PREMULTIPLY_ALPHA_WEBGL
  0x9243, // UNPACK_COLORSPACE_CONVERSION_WEBGL
]);

type R3FExpoGLContext = ReturnType<THREE.WebGLRenderer["getContext"]>;

const patchR3FExpoGLContext = (gl: R3FExpoGLContext) => {
  const originalPixelStorei = gl.pixelStorei.bind(gl);
  const originalGetProgramInfoLog = gl.getProgramInfoLog.bind(gl);
  const originalGetShaderInfoLog = gl.getShaderInfoLog.bind(gl);

  gl.pixelStorei = ((pname: number, param: number) => {
    if (unsupportedPixelStoreParams.has(pname)) {
      return;
    }

    originalPixelStorei(pname, param);
  }) as R3FExpoGLContext["pixelStorei"];

  gl.getProgramInfoLog = ((program: WebGLProgram) =>
    originalGetProgramInfoLog(program) ??
    "") as R3FExpoGLContext["getProgramInfoLog"];

  gl.getShaderInfoLog = ((shader: WebGLShader) =>
    originalGetShaderInfoLog(shader) ??
    "") as R3FExpoGLContext["getShaderInfoLog"];
};

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
      <pointsMaterial size={0.015} sizeAttenuation />
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

function EarthGlobeCanvas() {
  const rotationSpeedRef = useRef<RotationSpeed>({
    x: 0,
    y: 0.004,
  });

  const handleCanvasCreated = (state: RootState) => {
    patchR3FExpoGLContext(state.gl.getContext());
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

function EarthGlobeImage() {
  return (
    <View style={[styles.container, styles.imageContainer]}>
      <View style={styles.starField} />
      <View style={styles.imageGlobe}>
        <Image
          source={require("../../assets/textures/earth-day-2048.jpg")}
          style={styles.earthImage}
          resizeMode="cover"
        />
        <Image
          source={require("../../assets/textures/earth-clouds-2048.jpg")}
          style={styles.cloudImage}
          resizeMode="cover"
        />
        <View style={styles.globeShade} />
      </View>
    </View>
  );
}

export default function EarthGlobe() {
  if (Platform.OS === "ios") {
    return <EarthGlobeImage />;
  }

  return <EarthGlobeCanvas />;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 430,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#020617",
  },
  canvas: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  starField: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#020617",
  },
  imageGlobe: {
    width: "78%",
    maxWidth: 320,
    aspectRatio: 1,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#0f172a",
    shadowColor: "#38bdf8",
    shadowOpacity: 0.32,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
  },
  earthImage: {
    width: "122%",
    height: "100%",
    marginLeft: "-11%",
  },
  cloudImage: {
    position: "absolute",
    width: "122%",
    height: "100%",
    marginLeft: "-11%",
    opacity: 0.24,
  },
  globeShade: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderWidth: 10,
    borderColor: "rgba(96, 165, 250, 0.18)",
    borderRadius: 999,
    backgroundColor: "rgba(2, 6, 23, 0.04)",
  },
  loading: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
  },
});
