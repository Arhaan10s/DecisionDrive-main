import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { loadScores } from "@/game/highScores";

export default function HighScores() {
  const [mode, setMode] = useState("solo");
  const scores = loadScores(mode);

  const clearScores = () => {
    if (window.confirm("Clear all high scores for this mode?")) {
      localStorage.removeItem(mode === "vs" ? "tunnel_runner_scores_vs" : "tunnel_runner_scores_solo");
      window.location.reload();
    }
  };

  return (
    <div className="relative w-full h-full overflow-y-auto bg-[#050505] p-8 sm:p-12">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="btn-neon px-3 py-2 text-xs inline-flex" data-testid="back-to-menu-hs">
          <ArrowLeft size={14} /> Back
        </Link>

        <h1 className="mt-8 font-heading text-5xl sm:text-6xl font-black tracking-tighter uppercase text-white">
          High <span className="text-cyan-300 text-glow-cyan">Scores</span>
        </h1>

        <div className="mt-6 flex gap-2">
          <button
            className={`btn-neon ${mode === "solo" ? "bg-cyan-500 text-black" : ""}`}
            onClick={() => setMode("solo")}
            data-testid="tab-solo"
          >
            Solo
          </button>
          <button
            className={`btn-neon btn-neon-green ${mode === "vs" ? "bg-[#39ff14] text-black" : ""}`}
            onClick={() => setMode("vs")}
            data-testid="tab-vs"
          >
            VS Mode
          </button>
          <button className="btn-neon btn-neon-pink ml-auto px-3 py-2 text-xs" onClick={clearScores} data-testid="clear-btn">
            <Trash2 size={14} /> Clear
          </button>
        </div>

        <div className="mt-8 panel-neon p-6" data-testid="scores-list">
          {scores.length === 0 ? (
            <div className="font-mono text-sm text-white/50 text-center py-12">
              // NO RUNS RECORDED — RUN THE GAUNTLET TO REGISTER A SCORE
            </div>
          ) : (
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="text-white/40 text-[10px] tracking-[0.35em] uppercase">
                  <th className="text-left py-2 w-12">#</th>
                  <th className="text-left py-2">Score</th>
                  <th className="text-left py-2">{mode === "vs" ? "Winner" : "Level"}</th>
                  <th className="text-right py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr key={`${s.at}-${i}`} className="border-t border-cyan-500/20" data-testid={`score-row-${i}`}>
                    <td className="py-3 text-white/40">{String(i + 1).padStart(2, "0")}</td>
                    <td className="py-3 font-heading text-xl font-bold text-cyan-300 text-glow-cyan">{s.score}</td>
                    <td className="py-3">
                      {mode === "vs" ? (
                        <span className={s.winner === "TIE" ? "text-yellow-300" : "text-[#39ff14]"}>
                          {s.winner} ({s.p1}:{s.p2})
                        </span>
                      ) : (
                        <span className="text-white/70">LVL {s.level}</span>
                      )}
                    </td>
                    <td className="py-3 text-right text-white/50 text-xs">
                      {new Date(s.at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
