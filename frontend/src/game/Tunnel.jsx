import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TUNNEL_LENGTH = 200;
const RING_COUNT = 30;
const RADIUS = 3.5;

/* Animated tunnel made of glowing rings flying past the camera */
export default function Tunnel({ color = "#00f3ff", speed = 24 }) {
  const groupRef = useRef();
  const rings = useMemo(() => {
    const arr = [];
    for (let i = 0; i < RING_COUNT; i++) {
      arr.push((-i * TUNNEL_LENGTH) / RING_COUNT + 5);
    }
    return arr;
  }, []);

  const ringRefs = useRef([]);

  useFrame((_, dt) => {
    const move = speed * dt;
    ringRefs.current.forEach((m) => {
      if (!m) return;
      m.position.z += move;
      if (m.position.z > 6) m.position.z -= TUNNEL_LENGTH;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Glow rings */}
      {rings.map((z, i) => (
        <mesh
          key={i}
          ref={(el) => (ringRefs.current[i] = el)}
          position={[0, 0, z]}
          rotation={[0, 0, 0]}
        >
          <torusGeometry args={[RADIUS, 0.05, 8, 64]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}

      {/* Inner tunnel cylinder for subtle ambient glow */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, -TUNNEL_LENGTH / 2 + 5]}>
        <cylinderGeometry args={[RADIUS + 0.01, RADIUS + 0.01, TUNNEL_LENGTH, 64, 1, true]} />
        <meshBasicMaterial
          color={color}
          side={THREE.BackSide}
          transparent
          opacity={0.07}
          toneMapped={false}
        />
      </mesh>

      {/* Lane guide lines (8 longitudinal lines for depth perception) - only behind camera */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={`l${i}`}
            position={[Math.cos(angle) * (RADIUS - 0.05), Math.sin(angle) * (RADIUS - 0.05), -TUNNEL_LENGTH / 2 + 2]}
          >
            <boxGeometry args={[0.025, 0.025, TUNNEL_LENGTH - 6]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

export const TUNNEL_RADIUS = RADIUS;
