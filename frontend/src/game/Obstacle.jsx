import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* A single obstacle that moves toward the camera */
export default function Obstacle({ obstacle, speed, onPass, onHit, playerXRef, alive }) {
  const ref = useRef();
  const passed = useRef(false);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.position.z += speed * dt;
    ref.current.rotation.x += dt * 1.2;
    ref.current.rotation.y += dt * 1.6;

    // Collision check at player z (~1.5)
    const z = ref.current.position.z;
    if (!passed.current && z > 0.9 && z < 2.1 && alive) {
      const dx = Math.abs(ref.current.position.x - (playerXRef?.current ?? 0));
      const dy = Math.abs(ref.current.position.y - (-0.4));
      if (dx < 0.6 && dy < 0.8) {
        passed.current = true;
        onHit?.(obstacle.id);
        return;
      }
    }
    // Passed past camera
    if (!passed.current && z > 4) {
      passed.current = true;
      onPass?.(obstacle.id);
    }
  });

  const color = obstacle.color || "#ff003c";

  return (
    <mesh ref={ref} position={[obstacle.x, obstacle.y, obstacle.z]}>
      {obstacle.shape === "pyramid" ? (
        <coneGeometry args={[0.55, 0.9, 4]} />
      ) : obstacle.shape === "octa" ? (
        <octahedronGeometry args={[0.55, 0]} />
      ) : (
        <boxGeometry args={[0.8, 0.8, 0.8]} />
      )}
      <meshStandardMaterial
        color="#1a0008"
        emissive={color}
        emissiveIntensity={1.8}
        metalness={0.4}
        roughness={0.3}
      />
    </mesh>
  );
}
