// Level configurations - color theme + speed scaling
export const LEVELS = [
  { id: 1, name: "GENESIS",    color: "#00f3ff", speed: 38, spawnRate: 0.52 },
  { id: 2, name: "SURGE",      color: "#ff00d4", speed: 48, spawnRate: 0.43 },
  { id: 3, name: "PYRE",       color: "#ffe600", speed: 58, spawnRate: 0.36 },
  { id: 4, name: "VOID",       color: "#39ff14", speed: 68, spawnRate: 0.30 },
  { id: 5, name: "INFERNO",    color: "#ff003c", speed: 80, spawnRate: 0.25 },
  { id: 6, name: "TRANSCEND",  color: "#a855f7", speed: 96, spawnRate: 0.20 },
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