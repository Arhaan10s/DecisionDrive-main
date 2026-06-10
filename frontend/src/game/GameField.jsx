import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import Tunnel, { TUNNEL_RADIUS } from "@/game/Tunnel";
import Ship from "@/game/Ship";
import Obstacle from "@/game/Obstacle";
import StarField from "@/game/StarField";
import { getLevel, levelFromScore } from "@/game/levels";

const MAX_X = TUNNEL_RADIUS - 0.9; // playable horizontal bounds
const SPAWN_Z = -85;

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
  cameraSplit = false,
}) {
  const playerX = useRef(0);
  const targetX = useRef(0);
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

  // Keyboard input
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

    const moveInterval = setInterval(() => {
      if (paused || !aliveRef.current) return;
      const speed = 0.18;
      if (keys[controls.left]) targetX.current = Math.max(-MAX_X, targetX.current - speed);
      if (keys[controls.right]) targetX.current = Math.min(MAX_X, targetX.current + speed);
    }, 16);

    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
      clearInterval(moveInterval);
    };
  }, [controls.left, controls.right, paused, active]);

  // Smooth player X tracking (visual)
  useEffect(() => {
    let raf;
    const loop = () => {
      playerX.current += (targetX.current - playerX.current) * 0.18;
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
        const elapsed = (now - startTimeRef.current) / 1000;
        // Score grows ~ 50/s scaled by level
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

        // Spawn obstacles
        if (now - lastSpawnRef.current > lvl.spawnRate * 1000) {
          lastSpawnRef.current = now;
          // sometimes spawn 2-3 obstacles in a wave with gaps
          const count = Math.random() < 0.25 ? 2 : 1;
          const newObs = [];
          const positions = new Set();
          for (let i = 0; i < count; i++) {
            let attempts = 0;
            let x;
            do {
              x = (Math.random() * 2 - 1) * MAX_X;
              attempts++;
            } while (
              [...positions].some((p) => Math.abs(p - x) < 1.4) &&
              attempts < 6
            );
            positions.add(x);
            obstacleIdRef.current += 1;
            const shapes = ["box", "pyramid", "octa"];
            newObs.push({
              id: obstacleIdRef.current,
              x,
              y: -0.4,
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
        camera={{ position: [0, 0.4, 4], fov: 65, near: 0.1, far: 300 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#040408"]} />
        <fog attach="fog" args={["#040408", 30, 110]} />
        <ambientLight intensity={0.15} />
        <Suspense fallback={null}>
          <StarField count={250} />
          <Tunnel color={level.color} speed={tunnelSpeed} />
          <Ship xRef={playerX} color={shipColor} glowColor={shipColor} />
          {obstacles.map((o) => (
            <Obstacle
              key={o.id}
              obstacle={{ ...o, y: -0.4 }}
              speed={tunnelSpeed}
              onPass={handlePass}
              onHit={handleHit}
              playerXRef={playerX}
              alive={aliveRef.current}
            />
          ))}
        </Suspense>
      </Canvas>
    </>
  );
}
