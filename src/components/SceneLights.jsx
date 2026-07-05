import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04).texture;
    const previousEnvironment = scene.environment;

    scene.environment = envMap;

    return () => {
      scene.environment = previousEnvironment;
      envMap.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}

export default function SceneLights({ compact = false }) {
  const keyIntensity = compact ? 1.55 : 1.85;
  const fillIntensity = compact ? 0.95 : 0.9;
  const rimIntensity = compact ? 0.65 : 0.75;

  return (
    <>
      <StudioEnvironment />
      {/* Soft ambient base prevents dark steel from crushing into the background. */}
      <ambientLight intensity={compact ? 0.28 : 0.34} color="#c9d2c4" />
      <hemisphereLight skyColor="#dce9ff" groundColor="#756242" intensity={compact ? 0.72 : 0.82} />

      <directionalLight
        position={[3.8, 6.5, 5.4]}
        intensity={keyIntensity}
        color="#fff1d8"
      />

      <directionalLight position={[-4.5, 2.4, 4.2]} intensity={fillIntensity} color="#b7d4ff" />
      <directionalLight position={[0.8, 4.5, -5.5]} intensity={rimIntensity} color="#f7c16d" />
      <pointLight position={[0, 1.6, 3.2]} intensity={compact ? 0.38 : 0.5} color="#ffffff" distance={9} />
    </>
  );
}
