import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PLAY_RADIUS } from "@/game/GameField";

/* Player ship: stays fixed at the bottom of the camera view.
   The world rotates around it (see WorldRotator), giving the illusion of
   the ship spinning around the inside of the tunnel. */
export default function Ship({ tiltRef, color = "#00f3ff", glowColor }) {
  const groupRef = useRef();
  const innerRef = useRef();
  const trailRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;
    // Hover bob in place
    groupRef.current.position.y =
      -PLAY_RADIUS + Math.sin(performance.now() * 0.004) * 0.04;
    // Roll the ship around its forward axis based on rotation velocity
    if (innerRef.current && tiltRef) {
      const tilt = tiltRef.current ?? 0;
      innerRef.current.rotation.z += (tilt - innerRef.current.rotation.z) * 0.25;
    }
  });

  const emissive = glowColor || color;

  return (
    <group ref={groupRef} position={[0, -PLAY_RADIUS, 2]}>
      <group ref={innerRef} scale={[0.45, 0.45, 0.45]}>
        {/* Body - 4-sided cone (pyramid) pointing forward (-z) */}
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
    </group>
  );
}
