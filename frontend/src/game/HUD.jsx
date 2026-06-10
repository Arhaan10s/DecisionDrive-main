import { Heart } from "lucide-react";
import { getLevel } from "@/game/levels";

export default function HUD({ score, lives, levelIdx, label = "P1", color = "#00f3ff", align = "left", testId = "p1" }) {
  const level = getLevel(score);
  const isLeft = align === "left";
  return (
    <div
      className={`absolute top-0 ${isLeft ? "left-0" : "right-0"} p-6 z-30 pointer-events-none`}
      data-testid={`${testId}-hud`}
    >
      <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"} gap-2`}>
        <div
          className="font-mono text-xs tracking-[0.35em] font-bold uppercase"
          style={{ color, textShadow: `0 0 8px ${color}` }}
        >
          {label}
        </div>
        <div
          className="font-heading text-4xl sm:text-5xl font-black tracking-tighter"
          style={{ color: "#fff", textShadow: `0 0 10px ${color}` }}
          data-testid={`${testId}-score`}
        >
          {String(Math.floor(score)).padStart(6, "0")}
        </div>
        <div className="flex gap-2 mt-1" data-testid={`${testId}-lives`}>
          {[0, 1, 2].map((i) => (
            <Heart
              key={i}
              size={22}
              fill={i < lives ? color : "transparent"}
              color={i < lives ? color : "rgba(255,255,255,0.25)"}
              style={i < lives ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined}
            />
          ))}
        </div>
        <div className={`mt-3 flex flex-col ${isLeft ? "items-start" : "items-end"}`}>
          <div className="font-mono text-[10px] tracking-[0.35em] text-white/50 uppercase">Level</div>
          <div
            className="font-heading font-bold tracking-tight text-lg"
            style={{ color: level.color, textShadow: `0 0 8px ${level.color}` }}
            data-testid={`${testId}-level`}
          >
            {String(levelIdx + 1).padStart(2, "0")} · {level.name}
          </div>
          <div className="font-mono text-[10px] tracking-[0.35em] text-white/40 mt-1">
            SPD {level.speed}
          </div>
        </div>
      </div>
    </div>
  );
}
