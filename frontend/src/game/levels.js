// Level configurations - color theme + speed scaling
export const LEVELS = [
  { id: 1, name: "GENESIS",    color: "#00f3ff", speed: 24, spawnRate: 0.85 },
  { id: 2, name: "SURGE",      color: "#ff00d4", speed: 30, spawnRate: 0.70 },
  { id: 3, name: "PYRE",       color: "#ffe600", speed: 36, spawnRate: 0.58 },
  { id: 4, name: "VOID",       color: "#39ff14", speed: 42, spawnRate: 0.48 },
  { id: 5, name: "INFERNO",    color: "#ff003c", speed: 50, spawnRate: 0.40 },
  { id: 6, name: "TRANSCEND",  color: "#a855f7", speed: 60, spawnRate: 0.32 },
];

// Score required to advance to next level
export const LEVEL_THRESHOLDS = [0, 800, 2000, 4000, 7000, 11000];

export function levelFromScore(score) {
  let lvl = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (score >= LEVEL_THRESHOLDS[i]) lvl = i;
  }
  return Math.min(lvl, LEVELS.length - 1);
}

export function getLevel(score) {
  return LEVELS[levelFromScore(score)];
}
