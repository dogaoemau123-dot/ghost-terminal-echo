import { useGame } from "@/game/store";
import { MISSIONS } from "@/game/missions";

export function HUD() {
  const { level, xp, credits, heat, missionIndex, skills, unlockedSkillPoints, spendSkill } = useGame();
  const m = MISSIONS[missionIndex];
  const xpForNext = level * 150;
  const heatColor = heat > 70 ? "var(--heat)" : heat > 40 ? "var(--neon-pink)" : "var(--neon-green)";

  return (
    <div className="terminal-card rounded-md p-3 text-xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-neon-green font-bold">[ OPERATOR ]</span>
        <span className="text-muted-foreground">LVL {level} · {credits.toLocaleString()}₡</span>
      </div>

      <div>
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>XP</span><span>{xp}/{xpForNext}</span>
        </div>
        <div className="h-1.5 bg-secondary rounded overflow-hidden">
          <div className="h-full bg-[var(--neon-green)] glow-green transition-all" style={{ width: `${Math.min(100, (xp % 150) / 1.5)}%` }} />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">HEAT LEVEL</span>
          <span style={{ color: heatColor }}>{heat}%</span>
        </div>
        <div className={`h-1.5 bg-secondary rounded overflow-hidden ${heat > 70 ? "pulse-heat" : ""}`}>
          <div className="h-full transition-all" style={{ width: `${heat}%`, background: heatColor }} />
        </div>
      </div>

      {m && (
        <div className="border-t border-border pt-2 text-[11px]">
          <div className="text-neon-purple">// MISSÃO {String(m.id + 1).padStart(2, "0")}</div>
          <div className="text-foreground font-bold">{m.codename}</div>
          <div className="text-muted-foreground truncate">→ {m.target}</div>
        </div>
      )}

      <div className="border-t border-border pt-2">
        <div className="text-[10px] text-muted-foreground mb-1.5 flex justify-between">
          <span>SKILLS</span>
          {unlockedSkillPoints > 0 && <span className="text-neon-green blink">+{unlockedSkillPoints} pts</span>}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {(["crypto","social","malware","stealth"] as const).map(s => (
            <button
              key={s}
              disabled={unlockedSkillPoints === 0}
              onClick={() => spendSkill(s)}
              className="text-left text-[10px] px-2 py-1 rounded border border-border hover:border-[var(--neon-green)] disabled:opacity-60 disabled:cursor-default transition"
            >
              <div className="text-muted-foreground uppercase">{s}</div>
              <div className="text-neon-blue">lvl {skills[s]}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
