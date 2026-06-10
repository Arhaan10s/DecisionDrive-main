import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import Tunnel, { TUNNEL_RADIUS } from "@/game/Tunnel";
import Ship from "@/game/Ship";
import Obstacle from "@/game/Obstacle";
import StarField from "@/game/StarField";
import { getLevel, levelFromScore } from "@/game/levels";

const SPAWN_Z = -85;
// Radius along which player & obstacles orbit (inside the tunnel for nice visual).
export const PLAY_RADIUS = 2.0;

/* Group that rotates the entire tunnel/obstacles world around Z based on player's angle,
   so the ship appears to spin around the inside wall of the tunnel. */
function WorldRotator({ angleRef, children }) {
  const groupRef = useRef();
  useFrame((_, dt) => {
    if (!groupRef.current) return;
    // Smooth interpolation toward target rotation
    const target = -angleRef.current;
    const cur = groupRef.current.rotation.z;
    groupRef.current.rotation.z = cur + (target - cur) * Math.min(1, dt * 14);
  });
  return <group ref={groupRef}>{children}</group>;
}

/* Reusable 3D scene + game loop for a single playfield (used by solo & each VS half) */
export default function GameField({
  controls = { left: "ArrowLeft", right: "ArrowRight" },
  shipColor = "#00f3ff",
  onScoreChange,
  onLivesChange,
  onLevelChange,
  onGameOver,
  paused = false,
  active = true,
  playerLabel = "P1",
}) {
  // Angular position of the ship around the tunnel axis (radians). 0 = bottom of view.
  const playerAngle = useRef(0);
  const targetAngle = useRef(0);
  const tiltRef = useRef(0); // for ship roll animation
  const [obstacles, setObstacles] = useState([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(0);
  const aliveRef = useRef(true);
  const lastSpawnRef = useRef(0);
  const startTimeRef = useRef(performance.now());
  const obstacleIdRef = useRef(0);
  const [flashRed, setFlashRed] = useState(false);
  const [, setTick] = useState(0); // for re-render on level/lives change

  // Keyboard input -> rotate around tunnel
  useEffect(() => {
    if (!active) return;
    const keys = {};
    const handleDown = (e) => {
      keys[e.key] = true;
      if (e.key === controls.left || e.key === controls.right) e.preventDefault();
    };
    const handleUp = (e) => {
      keys[e.key] = false;
    };
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);

    const ANGULAR_STEP = 0.11; // radians per tick
    const moveInterval = setInterval(() => {
      if (paused || !aliveRef.current) return;
      // pressing "right" rotates the ship clockwise around the tunnel
      if (keys[controls.left]) targetAngle.current -= ANGULAR_STEP;
      if (keys[controls.right]) targetAngle.current += ANGULAR_STEP;
    }, 16);

    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
      clearInterval(moveInterval);
    };
  }, [controls.left, controls.right, paused, active]);

  // Smooth angular tracking + tilt
  useEffect(() => {
    let raf;
    const loop = () => {
      const prev = playerAngle.current;
      playerAngle.current += (targetAngle.current - prev) * 0.18;
      // velocity (delta) drives the ship roll animation
      const vel = playerAngle.current - prev;
      tiltRef.current += (vel * 4 - tiltRef.current) * 0.18;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Spawner & score loop
  useEffect(() => {
    if (!active) return;
    let raf;
    const loop = () => {
      if (!paused && aliveRef.current) {
        const now = performance.now();
        const lvl = getLevel(scoreRef.current);
        const delta = (lvl.speed / 24) * 0.85;
        scoreRef.current += delta;
        onScoreChange?.(Math.floor(scoreRef.current));

        const newLvlIdx = levelFromScore(scoreRef.current);
        if (newLvlIdx !== levelRef.current) {
          levelRef.current = newLvlIdx;
          onLevelChange?.(newLvlIdx);
          setTick((t) => t + 1);
        }

        // Spawn obstacles at random angles around the tunnel
        if (now - lastSpawnRef.current > lvl.spawnRate * 1000) {
          lastSpawnRef.current = now;
          const count = Math.random() < 0.3 ? 2 : 1;
          const newObs = [];
          const usedAngles = [];
          for (let i = 0; i < count; i++) {
            let attempts = 0;
            let angle;
            do {
              angle = Math.random() * Math.PI * 2;
              attempts++;
            } while (
              usedAngles.some((a) => angularDistance(a, angle) < 0.7) &&
              attempts < 6
            );
            usedAngles.push(angle);
            obstacleIdRef.current += 1;
            const shapes = ["box", "pyramid", "octa"];
            newObs.push({
              id: obstacleIdRef.current,
              angle,
              z: SPAWN_Z,
              shape: shapes[Math.floor(Math.random() * shapes.length)],
              color: i === 0 ? "#ff003c" : "#ff00d4",
            });
          }
          setObstacles((prev) => [...prev, ...newObs]);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused, active, onScoreChange, onLevelChange]);

  const handlePass = (id) => {
    setObstacles((prev) => prev.filter((o) => o.id !== id));
    scoreRef.current += 100;
    onScoreChange?.(Math.floor(scoreRef.current));
  };

  const handleHit = (id) => {
    setObstacles((prev) => prev.filter((o) => o.id !== id));
    livesRef.current -= 1;
    onLivesChange?.(livesRef.current);
    setFlashRed(true);
    setTimeout(() => setFlashRed(false), 350);
    setTick((t) => t + 1);
    if (livesRef.current <= 0) {
      aliveRef.current = false;
      onGameOver?.(Math.floor(scoreRef.current), levelRef.current + 1);
    }
  };

  const level = getLevel(scoreRef.current);
  const tunnelSpeed = level.speed;

  return (
    <>
      {flashRed && (
        <div
          className="pointer-events-none absolute inset-0 z-40 flash-red"
          data-testid={`${playerLabel}-hit-flash`}
        />
      )}
      <Canvas
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5.5], fov: 75, near: 0.1, far: 300 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#040408"]} />
        <fog attach="fog" args={["#040408", 30, 110]} />
        <ambientLight intensity={0.15} />
        <Suspense fallback={null}>
          <StarField count={250} />
          {/* Tunnel + obstacles rotate around z based on player angle */}
          <WorldRotator angleRef={playerAngle}>
            <Tunnel color={level.color} speed={tunnelSpeed} />
            {obstacles.map((o) => (
              <Obstacle
                key={o.id}
                obstacle={o}
                speed={tunnelSpeed}
                onPass={handlePass}
                onHit={handleHit}
                playerAngleRef={playerAngle}
                alive={aliveRef.current}
              />
            ))}
          </WorldRotator>
          {/* Ship stays fixed at the bottom of the tunnel from camera POV */}
          <Ship tiltRef={tiltRef} color={shipColor} glowColor={shipColor} />
        </Suspense>
      </Canvas>
    </>
  );
}

// Shortest signed angular distance between two angles (radians)
function angularDistance(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return Math.abs(d);
}
