import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  LayoutChangeEvent,
  PanResponder,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Canvas, useFrame, useLoader } from "@react-three/fiber/native";
import type { RootState } from "@react-three/fiber";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, TextureLoader } from "expo-three";
import * as THREE from "three";

type RotationSpeed = { x: number; y: number };
type Size = { width: number; height: number };

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

const patchExpoGLContext = (gl: ExpoWebGLRenderingContext) => {
  const originalPixelStorei = gl.pixelStorei.bind(gl);
  const originalGetProgramInfoLog = gl.getProgramInfoLog.bind(gl);
  const originalGetShaderInfoLog = gl.getShaderInfoLog.bind(gl);

  gl.pixelStorei = ((pname: number, param: number) => {
    if (unsupportedPixelStoreParams.has(pname)) {
      return;
    }

    originalPixelStorei(pname, param);
  }) as ExpoWebGLRenderingContext["pixelStorei"];

  gl.getProgramInfoLog = ((program: WebGLProgram) =>
    originalGetProgramInfoLog(program) ??
    "") as ExpoWebGLRenderingContext["getProgramInfoLog"];

  gl.getShaderInfoLog = ((shader: WebGLShader) =>
    originalGetShaderInfoLog(shader) ??
    "") as ExpoWebGLRenderingContext["getShaderInfoLog"];

  return () => {
    gl.pixelStorei =
      originalPixelStorei as ExpoWebGLRenderingContext["pixelStorei"];
    gl.getProgramInfoLog =
      originalGetProgramInfoLog as ExpoWebGLRenderingContext["getProgramInfoLog"];
    gl.getShaderInfoLog =
      originalGetShaderInfoLog as ExpoWebGLRenderingContext["getShaderInfoLog"];
  };
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
  earthTexture.colorSpace = THREE.SRGBColorSpace;

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
      {Platform.OS === "ios" ? (
        <meshBasicMaterial map={earthTexture} />
      ) : (
        <meshPhongMaterial map={earthTexture} shininess={12} />
      )}
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
  cloudsTexture.colorSpace = THREE.SRGBColorSpace;

  useFrame(() => {
    if (!cloudsRef.current) return;
    cloudsRef.current.rotation.y += rotationSpeedRef.current.y * 1.15;
    cloudsRef.current.rotation.x += rotationSpeedRef.current.x;
  });

  return (
    <mesh ref={cloudsRef}>
      <sphereGeometry args={[1.015, 64, 64]} />
      {Platform.OS === "ios" ? (
        <meshBasicMaterial
          map={cloudsTexture}
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      ) : (
        <meshPhongMaterial
          map={cloudsTexture}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      )}
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

function EarthGlobeGLView() {
  const [size, setSize] = useState<Size | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const disposeSceneRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef(true);
  const rotationSpeedRef = useRef<RotationSpeed>({ x: 0, y: 0.004 });

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
      const restoreExpoGLContext = patchExpoGLContext(gl);
      const bufferWidth = gl.drawingBufferWidth || size.width;
      const bufferHeight = gl.drawingBufferHeight || size.height;

      const renderer = new Renderer({
        gl,
        antialias: true,
        alpha: true,
        width: size.width,
        height: size.height,
      });
      renderer.setSize(size.width, size.height);
      renderer.setClearColor(0x020617, 1);
      renderer.debug.checkShaderErrors = false;

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
        restoreExpoGLContext();
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
      ) : (
        <LoadingFallback />
      )}
    </View>
  );
}

export default function EarthGlobe() {
  if (Platform.OS === "ios") {
    return <EarthGlobeGLView />;
  }

  return <EarthGlobeCanvas />;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 430,
    position: "relative",
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#020617",
  },
  canvas: {
    flex: 1,
  },
  glView: {
    alignSelf: "stretch",
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
