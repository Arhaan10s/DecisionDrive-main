import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameField from "@/game/GameField";
import HUD from "@/game/HUD";
import { saveScore } from "@/game/highScores";
import { Pause, Home, RotateCw } from "lucide-react";

export default function VsGame() {
  const navigate = useNavigate();
  const [p1, setP1] = useState({ score: 0, lives: 3, level: 0, alive: true });
  const [p2, setP2] = useState({ score: 0, lives: 3, level: 0, alive: true });
  const [paused, setPaused] = useState(false);
  const [matchOver, setMatchOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        if (!matchOver) setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [matchOver]);

  useEffect(() => {
    if (!p1.alive && !p2.alive && !matchOver) {
      const w = p1.score > p2.score ? "P1" : p2.score > p1.score ? "P2" : "TIE";
      setWinner(w);
      setMatchOver(true);
      saveScore(
        { score: Math.max(p1.score, p2.score), p1: p1.score, p2: p2.score, winner: w, mode: "vs" },
        "vs"
      );
    }
  }, [p1, p2, matchOver]);

  const restart = () => {
    setP1({ score: 0, lives: 3, level: 0, alive: true });
    setP2({ score: 0, lives: 3, level: 0, alive: true });
    setMatchOver(false);
    setWinner(null);
    setPaused(false);
    setResetKey((k) => k + 1);
  };

  return (
    <div className="relative w-full h-full bg-[#050505] flex">
      {/* Player 1 - Left Half */}
      <div className="relative w-1/2 h-full overflow-hidden border-r border-cyan-500/40">
        <GameField
          key={`p1-${resetKey}`}
          controls={{ left: "a", right: "d" }}
          shipColor="#00f3ff"
          onScoreChange={(s) => setP1((prev) => ({ ...prev, score: s }))}
          onLivesChange={(l) => setP1((prev) => ({ ...prev, lives: l, alive: l > 0 ? prev.alive : false }))}
          onLevelChange={(lvl) => setP1((prev) => ({ ...prev, level: lvl }))}
          onGameOver={(s, lvl) => setP1((prev) => ({ ...prev, score: s, alive: false }))}
          paused={paused}
          active={p1.alive && !matchOver}
          playerLabel="p1"
        />
        <HUD score={p1.score} lives={p1.lives} levelIdx={p1.level} label="P1 · A / D" color="#00f3ff" align="left" testId="p1" />
        {!p1.alive && !matchOver && (
          <div className="absolute inset-0 z-30 bg-black/70 flex items-center justify-center" data-testid="p1-dead">
            <div className="font-heading text-5xl font-black tracking-tighter text-[#ff003c] text-glow-pink uppercase">Eliminated</div>
          </div>
        )}
      </div>

      {/* Player 2 - Right Half */}
      <div className="relative w-1/2 h-full overflow-hidden">
        <GameField
          key={`p2-${resetKey}`}
          controls={{ left: "ArrowLeft", right: "ArrowRight" }}
          shipColor="#39ff14"
          onScoreChange={(s) => setP2((prev) => ({ ...prev, score: s }))}
          onLivesChange={(l) => setP2((prev) => ({ ...prev, lives: l, alive: l > 0 ? prev.alive : false }))}
          onLevelChange={(lvl) => setP2((prev) => ({ ...prev, level: lvl }))}
          onGameOver={(s, lvl) => setP2((prev) => ({ ...prev, score: s, alive: false }))}
          paused={paused}
          active={p2.alive && !matchOver}
          playerLabel="p2"
        />
        <HUD score={p2.score} lives={p2.lives} levelIdx={p2.level} label="P2 · ← / →" color="#39ff14" align="right" testId="p2" />
        {!p2.alive && !matchOver && (
          <div className="absolute inset-0 z-30 bg-black/70 flex items-center justify-center" data-testid="p2-dead">
            <div className="font-heading text-5xl font-black tracking-tighter text-[#ff003c] text-glow-pink uppercase">Eliminated</div>
          </div>
        )}
      </div>

      {/* Center divider */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-cyan-500/50 z-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 font-heading text-2xl font-black tracking-tighter text-white/40">
        VS
      </div>

      {/* Top center controls */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        <button className="btn-neon px-3 py-2 text-xs" onClick={() => setPaused((p) => !p)} data-testid="vs-pause-btn">
          <Pause size={14} /> {paused ? "Resume" : "Pause"}
        </button>
        <button className="btn-neon btn-neon-pink px-3 py-2 text-xs" onClick={() => navigate("/")} data-testid="vs-menu-btn">
          <Home size={14} /> Menu
        </button>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 font-mono text-[11px] tracking-[0.35em] text-white/50 uppercase">
        P1 · A/D    ·    P2 · ← →    ·    P · Pause
      </div>

      {paused && !matchOver && (
        <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center" data-testid="vs-pause-overlay">
          <div className="panel-neon p-12 text-center">
            <div className="font-mono text-xs tracking-[0.4em] text-cyan-300 text-glow-cyan">// SYSTEM PAUSED</div>
            <div className="mt-2 font-heading text-5xl font-black tracking-tighter uppercase">Paused</div>
            <div className="mt-6 flex gap-3 justify-center">
              <button className="btn-neon" onClick={() => setPaused(false)} data-testid="vs-resume-btn">Resume</button>
              <button className="btn-neon btn-neon-pink" onClick={() => navigate("/")}>Quit</button>
            </div>
          </div>
        </div>
      )}

      {matchOver && (
        <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-sm flex items-center justify-center" data-testid="vs-match-over">
          <div className="panel-neon p-12 text-center max-w-lg" style={{ borderColor: "rgba(57,255,20,0.6)" }}>
            <div className="font-mono text-xs tracking-[0.4em] text-[#39ff14] text-glow-green">// MATCH COMPLETE</div>
            <div className="mt-2 font-heading text-5xl sm:text-6xl font-black tracking-tighter uppercase glitch">
              {winner === "TIE" ? "DRAW" : `${winner} WINS`}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-8 font-mono text-sm">
              <div>
                <div className="text-cyan-300 text-[10px] tracking-[0.3em] text-glow-cyan">PLAYER 1</div>
                <div className="font-heading text-3xl font-black text-cyan-300 text-glow-cyan" data-testid="vs-p1-final">{p1.score}</div>
              </div>
              <div>
                <div className="text-[#39ff14] text-[10px] tracking-[0.3em] text-glow-green">PLAYER 2</div>
                <div className="font-heading text-3xl font-black text-[#39ff14] text-glow-green" data-testid="vs-p2-final">{p2.score}</div>
              </div>
            </div>
            <div className="mt-8 flex gap-3 justify-center">
              <button className="btn-neon btn-neon-green" onClick={restart} data-testid="vs-restart-btn">
                <RotateCw size={14} /> Rematch
              </button>
              <button className="btn-neon" onClick={() => navigate("/")} data-testid="vs-back-menu-btn">
                <Home size={14} /> Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
