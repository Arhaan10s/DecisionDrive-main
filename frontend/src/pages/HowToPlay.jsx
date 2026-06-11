import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LEVELS } from "@/game/levels";

export default function HowToPlay() {
  return (
    <div className="relative w-full h-full overflow-y-auto bg-[#050505] p-8 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="btn-neon px-3 py-2 text-xs inline-flex" data-testid="back-to-menu-htp">
          <ArrowLeft size={14} /> Back
        </Link>

        <h1 className="mt-8 font-heading text-5xl sm:text-6xl font-black tracking-tighter uppercase text-glow-cyan text-white">
          How To <span className="text-[#ff003c] text-glow-pink">Play</span>
        </h1>
        <p className="mt-3 font-mono text-sm text-white/60 max-w-2xl">
          Pilot your ship through an electrified neon tunnel. Dodge incoming geometry, survive longer, score higher. Each level cranks up speed & obstacle density.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          <div className="panel-neon p-6">
            <div className="font-mono text-xs tracking-[0.35em] text-cyan-300 text-glow-cyan">// SOLO</div>
            <div className="mt-2 font-heading text-2xl font-bold tracking-tight">Player Controls</div>
            <div className="mt-4 font-mono text-sm space-y-2">
              <div><kbd className="px-2 py-1 border border-cyan-500/60">←</kbd> / <kbd className="px-2 py-1 border border-cyan-500/60">→</kbd> Move ship</div>
              <div><kbd className="px-2 py-1 border border-cyan-500/60">P</kbd> / <kbd className="px-2 py-1 border border-cyan-500/60">ESC</kbd> Pause</div>
            </div>
          </div>

          <div className="panel-neon p-6" style={{ borderColor: "rgba(255,0,60,0.5)" }}>
            <div className="font-mono text-xs tracking-[0.35em] text-[#ff003c] text-glow-pink">// VS MODE</div>
            <div className="mt-2 font-heading text-2xl font-bold tracking-tight">Split-Screen Duel</div>
            <div className="mt-4 font-mono text-sm space-y-2">
              <div><span className="text-cyan-300">P1:</span> <kbd className="px-2 py-1 border border-cyan-500/60">A</kbd> / <kbd className="px-2 py-1 border border-cyan-500/60">D</kbd></div>
              <div><span className="text-[#39ff14]">P2:</span> <kbd className="px-2 py-1 border border-green-500/60">←</kbd> / <kbd className="px-2 py-1 border border-green-500/60">→</kbd></div>
              <div className="text-white/60 text-xs mt-2">Last pilot standing wins — or whoever has the higher score on double KO.</div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="font-mono text-xs tracking-[0.35em] text-white/50">// LEVEL PROGRESSION</div>
          <div className="mt-3 grid sm:grid-cols-3 gap-3">
            {LEVELS.map((lvl, i) => (
              <div
                key={lvl.id}
                className="border p-4"
                style={{ borderColor: lvl.color + "80", boxShadow: `0 0 12px ${lvl.color}33 inset` }}
              >
                <div className="font-mono text-[10px] tracking-[0.35em]" style={{ color: lvl.color, textShadow: `0 0 6px ${lvl.color}` }}>
                  LVL {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-1 font-heading text-xl font-bold tracking-tight">{lvl.name}</div>
                <div className="mt-2 font-mono text-xs text-white/60">SPD {lvl.speed} · DENSITY {Math.round((1 / lvl.spawnRate) * 10) / 10}/s</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 panel-neon p-6" style={{ borderColor: "rgba(255,230,0,0.5)" }}>
          <div className="font-mono text-xs tracking-[0.35em] text-yellow-300 text-glow-yellow">// TIPS</div>
          <ul className="mt-3 font-mono text-sm text-white/70 space-y-2 list-none">
            <li>· Surviving past obstacles earns <span className="text-cyan-300">+100</span> bonus.</li>
            <li>· Levels unlock with score milestones: 800, 2K, 4K, 7K, 11K.</li>
            <li>· You have <span className="text-[#ff003c]">3 lives</span>. One hit per obstacle.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
