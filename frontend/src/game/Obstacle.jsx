import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PLAY_RADIUS } from "@/game/GameField";

/* A single obstacle stuck to the inside wall of the tunnel at a given angle.
   It moves toward the camera along z; collision is angular. */
export default function Obstacle({ obstacle, speed, onPass, onHit, playerAngleRef, alive }) {
  const ref = useRef();
  const passed = useRef(false);

  // Static world position derived from angle (placed inside rotating world group).
  const wx = Math.sin(obstacle.angle) * PLAY_RADIUS;
  const wy = -Math.cos(obstacle.angle) * PLAY_RADIUS;

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.position.z += speed * dt;
    ref.current.rotation.x += dt * 1.2;
    ref.current.rotation.y += dt * 1.6;

    const z = ref.current.position.z;
    if (!passed.current && z > 0.6 && z < 3.0 && alive) {
      // Player ship sits at angle 0 (bottom of tunnel) in world's rotating frame.
      // The world is rotated by -playerAngle, so collision is when
      // obstacle.angle ~ playerAngle.
      const pa = playerAngleRef?.current ?? 0;
      let diff = obstacle.angle - pa;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      if (Math.abs(diff) < 0.52) {
        passed.current = true;
        onHit?.(obstacle.id);
        return;
      }
    }
    if (!passed.current && z > 5) {
      passed.current = true;
      onPass?.(obstacle.id);
    }
  });

  const color = obstacle.color || "#ff003c";

  return (
    <mesh ref={ref} position={[wx, wy, obstacle.z]}>
      {obstacle.shape === "pyramid" ? (
        <coneGeometry args={[1.0, 1.5, 4]} />
      ) : obstacle.shape === "octa" ? (
        <octahedronGeometry args={[1.0, 0]} />
      ) : (
        <boxGeometry args={[1.0, 1.0, 1.0]} />
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