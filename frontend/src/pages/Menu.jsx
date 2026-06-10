import { Link } from "react-router-dom";
import { Rocket, Swords, BookOpen, Trophy } from "lucide-react";
import { topScore } from "@/game/highScores";

export default function Menu() {
  const best = topScore("solo");
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050505]">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(0,243,255,0.18), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(255,0,60,0.18), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,243,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <div className="relative z-10 h-full w-full flex">
        {/* Left: Title block */}
        <div className="flex-1 flex flex-col justify-center pl-10 sm:pl-20 lg:pl-32 pr-8 max-w-3xl">
          <div className="font-mono text-xs tracking-[0.35em] text-cyan-400/80 mb-4 text-glow-cyan">
            // VECTOR/RUN.V1
          </div>
          <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
            <span className="text-white text-glow-cyan">NEON</span>
            <br />
            <span className="text-[#ff003c] text-glow-pink">TUNNEL</span>
            <br />
            <span className="text-white">RUNNER</span>
          </h1>
          <p className="mt-6 font-mono text-sm text-white/70 max-w-md tracking-wide">
            Pilot through an electrified void. Dodge obstacles, survive escalating levels and outrun your friend in split-screen VS mode.
          </p>

          <div className="mt-10 flex flex-col gap-3 max-w-sm">
            <Link to="/play" className="btn-neon" data-testid="play-solo-btn">
              <Rocket size={16} /> Play Solo
            </Link>
            <Link to="/vs" className="btn-neon btn-neon-pink" data-testid="vs-mode-btn">
              <Swords size={16} /> VS Mode (Split-Screen)
            </Link>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <Link to="/how-to-play" className="btn-neon btn-neon-green" data-testid="how-to-play-btn">
                <BookOpen size={16} /> How To Play
              </Link>
              <Link to="/scores" className="btn-neon" data-testid="scores-btn">
                <Trophy size={16} /> High Scores
              </Link>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-6 font-mono text-xs tracking-[0.3em] uppercase text-white/40">
            <div>Best · <span className="text-cyan-400 text-glow-cyan" data-testid="menu-best-score">{best}</span></div>
            <div>v1.0</div>
          </div>
        </div>

        {/* Right: Big stylized stat */}
        <div className="hidden lg:flex flex-1 items-center justify-center relative">
          <div className="absolute right-20 top-20 panel-neon p-6 w-72">
            <div className="font-mono text-[10px] tracking-[0.4em] text-cyan-400/80">SYSTEM STATUS</div>
            <div className="mt-3 font-heading text-3xl font-black tracking-tighter">ONLINE</div>
            <div className="mt-4 flex justify-between font-mono text-xs">
              <span className="text-white/50">SECTOR</span>
              <span className="text-cyan-300">07-ALPHA</span>
            </div>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-white/50">GRID</span>
              <span className="text-cyan-300">VECTOR/SYNC</span>
            </div>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-white/50">UPLINK</span>
              <span className="text-[#39ff14]">STABLE</span>
            </div>
          </div>
          <div
            className="absolute right-44 bottom-32 font-heading text-[12rem] font-black leading-none opacity-[0.07] select-none"
            aria-hidden
          >
            //01
          </div>
          <div className="absolute right-32 bottom-20 panel-neon p-5 w-60" style={{ borderColor: "rgba(255,0,60,0.55)" }}>
            <div className="font-mono text-[10px] tracking-[0.4em] text-[#ff003c]">// WARNING</div>
            <div className="mt-2 font-heading text-lg font-bold tracking-tight">
              HOSTILE GEOMETRY
            </div>
            <div className="mt-1 font-mono text-xs text-white/60">
              Avoid red emissive obstacles. One mistake costs a life.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
