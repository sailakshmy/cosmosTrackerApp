import { TextureLoader, THREE } from "expo-three";
import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber/native";
import { SphereGeometry } from "three";

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
    return (
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial map={earthTexture} shininess={12} />
      </mesh>
    );
  });
}
