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

      const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        shininess: 12,
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      earthRef.current = earth;
      scene.add(earth);

      const cloudGeometry = new THREE.SphereGeometry(1.015, 64, 64);
      const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });

      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloudRef.current = cloud;
      scene.add(cloud);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
      scene.add(ambientLight);

      const sunlight = new THREE.DirectionalLight(0xffffff, 1.8);
      sunlight.position.set(5, 3, 5);
      scene.add(sunlight);

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
        size: 0.018,
        sizeAttenuation: true,
      });

      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      const render = () => {
        animationFrameRef.current = requestAnimationFrame(render);

        if (earthRef.current) {
          earthRef.current.rotation.y += rotationSpeedRef.current.y;
          earthRef.current.rotation.x += rotationSpeedRef.current.x;
        }

        if (cloudRef.current) {
          cloudRef.current.rotation.y += rotationSpeedRef.current.y * 1.15;
          cloudRef.current.rotation.x += rotationSpeedRef.current.x;
        }

        rotationSpeedRef.current.x *= 0.98;

        if (Math.abs(rotationSpeedRef.current.y) < 0.004) {
          rotationSpeedRef.current.y += 0.00002;
        }

        camera.position.z = cameraDistanceRef.current;

        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      render();
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        earthGeometry.dispose();
        earthMaterial.dispose();
        cloudGeometry.dispose();
        cloudMaterial.dispose();
        starGeometry.dispose();
        starMaterial.dispose();
        earthTexture.dispose();
        cloudTexture.dispose();
        renderer.dispose();
      };
    },
    [size],
  );

  return <View></View>;
};

export default EarthGlobal;
