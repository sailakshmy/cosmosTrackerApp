import { TextureLoader, THREE } from "expo-three";
import React, { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber/native";
import { SphereGeometry } from "three";
import { ActivityIndicator, PanResponder, View } from "react-native";

type RotationSpeed = { x: number; y: number };

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

function Earth(rotationSpeedRef: {
  rotationSpeedRef: React.MutableRefObject<RotationSpeed>;
}) {
  const earthRef = useRef<THREE.Mesh>(null);
  const earthTexture = useLoader(
    TextureLoader,
    require("../../assets/textures/earth-day-2048.jpg"),
  );

  useFrame(() => {
    if (!earthRef.current) return;
    earthRef.current.rotation.y += rotationSpeedRef.current.y;
    earthRef.current.rotation.x += rotationSpeedRef.current.x;

    rotationSpeedRef.current.x += 0.98;
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
  );

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
    <View>
      <ActivityIndicator color="#93c5fd" />
    </View>
  );
}

export default function EarthGlobe() {
  const rotationSpeedRef = useRef<RotationSpeed>({
    x: 0,
    y: 0.004,
  });

  const panResponder = useMemo(() => {
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
    });
  }, []);
}
