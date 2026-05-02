import { useEffect, useState } from "react";
import { useGame } from "@/game/store";
import { MISSIONS } from "@/game/missions";
import { HUD } from "./HUD";
import { ChatPanel } from "./ChatPanel";
import { TerminalPuzzle } from "./puzzles/TerminalPuzzle";
import { PasswordPuzzle } from "./puzzles/PasswordPuzzle";
import { SocialPuzzle } from "./puzzles/SocialPuzzle";
import { NetworkPuzzle } from "./puzzles/NetworkPuzzle";
import { Button } from "@/components/ui/button";

type Phase = "brief" | "puzzle" | "result";

export function GameScreen() {
  const { missionIndex, addChat, completeMission, finished, busted, heat, unlock } = useGame();
  const mission = MISSIONS[missionIndex];
  const [phase, setPhase] = useState<Phase>("brief");
  const [introIdx, setIntroIdx] = useState(0);
  const [success, setSuccess] = useState<boolean | null>(null);

  // push intro lines progressively
  useEffect(() => {
    if (phase !== "brief") return;
    if (introIdx >= mission.intro.length) return;
    const t = setTimeout(() => {
      addChat(mission.intro[introIdx]);
      setIntroIdx(i => i + 1);
    }, introIdx === 0 ? 200 : 900);
    return () => clearTimeout(t);
  }, [phase, introIdx, mission, addChat]);

  // reset when mission changes
  useEffect(() => {
    setPhase("brief");
    setIntroIdx(0);
    setSuccess(null);
  }, [missionIndex]);

  // ending trigger
  if (finished && !busted) {
    return <EndingScreen variant="twist" />;
  }
  if (busted) {
    return <EndingScreen variant="busted" />;
  }

  const onPuzzleResult = (ok: boolean, extraHeat = 0) => {
    setSuccess(ok);
    if (ok) {
      mission.outro.forEach((l, i) => setTimeout(() => addChat(l), 600 + i * 800));
      if (mission.id === 0) unlock("FIRST_BLOOD");
      if (heat < 20) unlock("STEALTHY");
    }
    setTimeout(() => {
      completeMission(ok, extraHeat);
      setPhase("result");
    }, ok ? 1200 + mission.outro.length * 800 : 1200);
  };

  const renderPuzzle = () => {
    switch (mission.puzzle) {
      case "terminal": return <TerminalPuzzle mission={mission} onResult={onPuzzleResult} />;
      case "password": return <PasswordPuzzle mission={mission} onResult={onPuzzleResult} />;
      case "social": return <SocialPuzzle mission={mission} onResult={onPuzzleResult} />;
      case "network": return <NetworkPuzzle mission={mission} onResult={onPuzzleResult} />;
    }
  };

  return (
    <div className="relative min-h-screen p-3 md:p-6 max-w-6xl mx-auto z-10">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-widest text-neon-green crt-flicker">&gt; HACKER_</h1>
        <span className="text-[10px] text-muted-foreground">SESSION #{String(missionIndex + 1).padStart(3, "0")}</span>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr_320px] gap-3 lg:gap-4">
        <div className="order-2 lg:order-1"><HUD /></div>

        <main className="order-1 lg:order-2 terminal-card rounded-md p-4 min-h-[60vh]">
          {phase === "brief" && (
            <div className="space-y-4">
              <div>
                <div className="text-[11px] text-muted-foreground">// BRIEFING</div>
                <h2 className="text-lg font-bold text-neon-green">{mission.codename}</h2>
                <div className="text-xs text-neon-purple mt-1">target: {mission.target}</div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{mission.brief}</p>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="bg-secondary p-2 rounded border border-border">
                  <div className="text-muted-foreground">REWARD</div>
                  <div className="text-neon-green">{mission.reward.toLocaleString()}₡</div>
                </div>
                <div className="bg-secondary p-2 rounded border border-border">
                  <div className="text-muted-foreground">XP</div>
                  <div className="text-neon-blue">+{mission.xp}</div>
                </div>
                <div className="bg-secondary p-2 rounded border border-border">
                  <div className="text-muted-foreground">RISK</div>
                  <div className="text-neon-pink">+{mission.heat}%</div>
                </div>
              </div>
              <Button
                disabled={introIdx < mission.intro.length}
                onClick={() => setPhase("puzzle")}
                className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 glow-green font-bold tracking-widest"
              >
                {introIdx < mission.intro.length ? "AGUARDE GHOST..." : "INICIAR INVASÃO ▶"}
              </Button>
            </div>
          )}

          {phase === "puzzle" && (
            <div className="space-y-3">
              <div className="text-[11px] text-muted-foreground">// LIVE OPERATION — {mission.target}</div>
              {renderPuzzle()}
            </div>
          )}

          {phase === "result" && success !== null && (
            <div className="space-y-3 text-center py-8">
              <div className={`text-3xl font-bold ${success ? "text-neon-green" : "text-neon-pink"}`}>
                {success ? "✓ INVASÃO CONCLUÍDA" : "✗ DETECTADO"}
              </div>
              <div className="text-xs text-muted-foreground">
                {success ? `+${mission.reward}₡  ·  +${mission.xp} XP` : "Tente novamente."}
              </div>
              <Button
                onClick={() => { setPhase("brief"); setIntroIdx(0); setSuccess(null); }}
                className="mt-4"
              >
                {success ? "PRÓXIMA MISSÃO ▶" : "TENTAR DE NOVO"}
              </Button>
            </div>
          )}
        </main>

        <aside className="order-3 h-[60vh] lg:h-auto lg:max-h-[80vh]"><ChatPanel /></aside>
      </div>
    </div>
  );
}

function EndingScreen({ variant }: { variant: "twist" | "busted" }) {
  const reset = useGame(s => s.reset);
  const { credits, level, achievements } = useGame();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const lines = variant === "twist" ? 6 : 4;
    if (stage < lines) {
      const t = setTimeout(() => setStage(s => s + 1), stage === 0 ? 800 : 1400);
      return () => clearTimeout(t);
    }
  }, [stage, variant]);

  const twistLines = [
    ">> CONEXÃO PERDIDA <<",
    ">> RASTREANDO IP DE ORIGEM... <<",
    "[ POLÍCIA FEDERAL — DIVISÃO DE CRIMES CIBERNÉTICOS ]",
    "GHOST: Operação 'White Knight' — agente Marco Vieira reportando.",
    "GHOST: Suspeito identificado. Equipe tática a caminho.",
    "*** PORTA ARROMBADA ***",
  ];
  const bustLines = [
    ">> HEAT LEVEL CRÍTICO <<",
    ">> SUA LOCALIZAÇÃO FOI EXPOSTA <<",
    "[ SIRENES À DISTÂNCIA ]",
    "*** VOCÊ FOI PRESO ***",
  ];
  const lines = variant === "twist" ? twistLines : bustLines;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black">
      <div className="absolute inset-0 opacity-20" style={{
        background: "repeating-linear-gradient(0deg, var(--neon-pink) 0 2px, transparent 2px 6px)"
      }} />
      <div className="relative max-w-xl w-full text-center space-y-6">
        <div className="space-y-2 font-mono text-sm md:text-base text-left bg-black/80 p-4 rounded border border-[var(--destructive)] glow-purple">
          {lines.slice(0, stage).map((l, i) => (
            <div key={i} className={i >= 2 && variant === "twist" ? "text-neon-pink" : "text-neon-green"}>
              {l}
            </div>
          ))}
          {stage < lines.length && <span className="blink text-neon-green">▋</span>}
        </div>

        {stage >= lines.length && (
          <>
            <div className="space-y-3 pt-4">
              <h1 className="text-3xl md:text-5xl font-black text-neon-pink glitch tracking-widest">GAME OVER</h1>
              <p className="text-foreground/90 text-sm md:text-base italic">
                "Você nunca foi o caçador...<br/>sempre foi a caça."
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-left">
              <div className="bg-secondary/50 p-2 rounded border border-border">
                <div className="text-muted-foreground">LEVEL</div>
                <div className="text-neon-blue">{level}</div>
              </div>
              <div className="bg-secondary/50 p-2 rounded border border-border">
                <div className="text-muted-foreground">CRÉDITOS</div>
                <div className="text-neon-green">{credits.toLocaleString()}₡</div>
              </div>
              <div className="bg-secondary/50 p-2 rounded border border-border">
                <div className="text-muted-foreground">CONQUISTAS</div>
                <div className="text-neon-purple">{achievements.length}</div>
              </div>
            </div>

            {achievements.length > 0 && (
              <div className="text-[11px] text-muted-foreground">
                Desbloqueado: {achievements.join(" · ")}
              </div>
            )}

            <Button
              onClick={reset}
              className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 glow-green font-bold tracking-widest"
            >
              JOGAR NOVAMENTE
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
