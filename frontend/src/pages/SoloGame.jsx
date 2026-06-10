import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameField from "@/game/GameField";
import HUD from "@/game/HUD";
import { saveScore, topScore } from "@/game/highScores";
import { Pause, Home, RotateCw } from "lucide-react";

export default function SoloGame() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [levelIdx, setLevelIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalLevel, setFinalLevel] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const best = topScore("solo");

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        if (!gameOver) setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gameOver]);

  const handleGameOver = (s, lvl) => {
    setFinalScore(s);
    setFinalLevel(lvl);
    saveScore({ score: s, level: lvl, mode: "solo" }, "solo");
    setGameOver(true);
  };

  const restart = () => {
    setScore(0);
    setLives(3);
    setLevelIdx(0);
    setGameOver(false);
    setPaused(false);
    setResetKey((k) => k + 1);
  };

  return (
    <div className="relative w-full h-full bg-[#050505]">
      <GameField
        key={resetKey}
        controls={{ left: "ArrowLeft", right: "ArrowRight" }}
        shipColor="#00f3ff"
        onScoreChange={setScore}
        onLivesChange={setLives}
        onLevelChange={setLevelIdx}
        onGameOver={handleGameOver}
        paused={paused}
        active={!gameOver}
        playerLabel="solo"
      />
      <HUD score={score} lives={lives} levelIdx={levelIdx} label="PLAYER" color="#00f3ff" align="left" testId="p1" />

      {/* Top-right controls */}
      <div className="absolute top-6 right-6 z-30 flex gap-2">
        <button
          className="btn-neon px-3 py-2 text-xs"
          onClick={() => setPaused((p) => !p)}
          data-testid="pause-btn"
        >
          <Pause size={14} /> {paused ? "Resume" : "Pause"}
        </button>
        <button
          className="btn-neon btn-neon-pink px-3 py-2 text-xs"
          onClick={() => navigate("/")}
          data-testid="menu-btn"
        >
          <Home size={14} /> Menu
        </button>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 font-mono text-[11px] tracking-[0.35em] text-white/50 uppercase">
        ← / → · Move    ·    P · Pause
      </div>

      {/* Best score top-center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 text-center">
        <div className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase">High Score</div>
        <div className="font-heading text-xl font-bold tracking-tight text-glow-cyan text-cyan-300" data-testid="best-score">
          {String(best).padStart(6, "0")}
        </div>
      </div>

      {paused && !gameOver && (
        <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center" data-testid="pause-overlay">
          <div className="panel-neon p-12 text-center">
            <div className="font-mono text-xs tracking-[0.4em] text-cyan-300 text-glow-cyan">// SYSTEM PAUSED</div>
            <div className="mt-2 font-heading text-5xl font-black tracking-tighter uppercase">Paused</div>
            <div className="mt-6 flex gap-3 justify-center">
              <button className="btn-neon" onClick={() => setPaused(false)} data-testid="resume-btn">Resume</button>
              <button className="btn-neon btn-neon-pink" onClick={() => navigate("/")} data-testid="quit-btn">Quit</button>
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center" data-testid="game-over-overlay">
          <div className="panel-neon p-12 text-center max-w-md" style={{ borderColor: "rgba(255,0,60,0.6)" }}>
            <div className="font-mono text-xs tracking-[0.4em] text-[#ff003c] text-glow-pink">// SIGNAL LOST</div>
            <div className="mt-2 font-heading text-5xl sm:text-6xl font-black tracking-tighter uppercase glitch text-white">Game Over</div>
            <div className="mt-8 grid grid-cols-2 gap-6 font-mono text-sm">
              <div>
                <div className="text-white/50 text-[10px] tracking-[0.3em]">FINAL SCORE</div>
                <div className="font-heading text-3xl font-black text-cyan-300 text-glow-cyan" data-testid="final-score">{finalScore}</div>
              </div>
              <div>
                <div className="text-white/50 text-[10px] tracking-[0.3em]">REACHED LEVEL</div>
                <div className="font-heading text-3xl font-black text-[#39ff14] text-glow-green" data-testid="final-level">{finalLevel}</div>
              </div>
            </div>
            {finalScore > best && (
              <div className="mt-4 font-mono text-xs tracking-[0.3em] text-yellow-300 text-glow-yellow uppercase">★ New Personal Best ★</div>
            )}
            <div className="mt-8 flex gap-3 justify-center">
              <button className="btn-neon btn-neon-green" onClick={restart} data-testid="restart-btn">
                <RotateCw size={14} /> Run Again
              </button>
              <button className="btn-neon" onClick={() => navigate("/")} data-testid="back-menu-btn">
                <Home size={14} /> Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
