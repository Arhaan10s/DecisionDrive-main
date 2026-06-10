const KEY_SOLO = "tunnel_runner_scores_solo";
const KEY_VS = "tunnel_runner_scores_vs";

export function loadScores(mode = "solo") {
  try {
    const raw = localStorage.getItem(mode === "vs" ? KEY_VS : KEY_SOLO);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveScore(entry, mode = "solo") {
  const scores = loadScores(mode);
  scores.push({ ...entry, at: Date.now() });
  scores.sort((a, b) => b.score - a.score);
  const top = scores.slice(0, 10);
  localStorage.setItem(mode === "vs" ? KEY_VS : KEY_SOLO, JSON.stringify(top));
  return top;
}

export function topScore(mode = "solo") {
  const s = loadScores(mode);
  return s.length ? s[0].score : 0;
}
