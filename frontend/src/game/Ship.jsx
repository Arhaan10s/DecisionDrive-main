import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Player ship: low-poly tetrahedron with emissive glow */
export default function Ship({ xRef, color = "#00f3ff", glowColor }) {
  const groupRef = useRef();
  const trailRef = useRef();

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    // Smooth glide to target X
    const target = xRef.current ?? 0;
    const oldX = groupRef.current.position.x;
    groupRef.current.position.x += (target - oldX) * Math.min(1, dt * 14);
    // Tilt based on movement direction
    const tiltTarget = -(target - oldX) * 6;
    groupRef.current.rotation.z += (tiltTarget - groupRef.current.rotation.z) * Math.min(1, dt * 10);
    // Hover bob
    groupRef.current.position.y = -0.4 + Math.sin(performance.now() * 0.004) * 0.06;
  });

  const emissive = glowColor || color;

  return (
    <group ref={groupRef} position={[0, -0.4, 1.5]} rotation={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
      {/* Body - cone pointing forward (negative z) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.2, 1]}>
        <coneGeometry args={[0.4, 1.4, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={1.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      {/* Wings */}
      <mesh position={[0, -0.05, 0.15]}>
        <boxGeometry args={[1.3, 0.06, 0.4]} />
        <meshStandardMaterial color="#0a0a0a" emissive={emissive} emissiveIntensity={0.8} />
      </mesh>
      {/* Engine glow */}
      <mesh position={[0, 0, 0.8]} ref={trailRef}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial color={emissive} toneMapped={false} />
      </mesh>
      <pointLight color={emissive} intensity={5} distance={8} />
    </group>
  );
}
