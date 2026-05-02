import { useState } from "react";
import { useGame } from "@/game/store";
import { Button } from "@/components/ui/button";
import { Typewriter } from "./Typewriter";

const BOOT = [
  "BIOS v4.20 — GhostNet OS",
  "checando interfaces...........[OK]",
  "rotando via TOR................[OK]",
  "spoofing MAC...................[OK]",
  "carregando perfil OPERATOR.....[OK]",
  "",
  "bem-vindo, hacker.",
];

export function BootScreen() {
  const start = useGame(s => s.start);
  const [step, setStep] = useState(0);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 z-10">
      <div className="terminal-card rounded-md p-6 md:p-10 max-w-lg w-full space-y-6 scanline">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-black text-neon-green tracking-[0.3em] crt-flicker">
            HACKER
          </h1>
          <div className="text-[10px] text-neon-purple tracking-widest mt-2">
            // ANONYMOUS · UNTRACEABLE · ILLEGAL
          </div>
        </div>

        <div className="bg-black/70 rounded p-3 font-mono text-[12px] min-h-[180px] border border-border">
          {BOOT.slice(0, step).map((l, i) => (
            <div key={i} className={l.includes("[OK]") ? "text-neon-green" : "text-foreground/80"}>{l}</div>
          ))}
          {step < BOOT.length && (
            <Typewriter
              text={BOOT[step]}
              speed={12}
              onDone={() => setTimeout(() => setStep(s => s + 1), 120)}
              className={BOOT[step].includes("[OK]") ? "text-neon-green" : "text-foreground/80"}
            />
          )}
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
          Um cliente anônimo te contatou na deep web. Diz se chamar <span className="text-neon-green">Ghost</span>. Promete pagar muito bem por trabalhos discretos.
          <br/><br/>
          Confiança é luxo. Toda conexão deixa rastro.
        </p>

        <Button
          disabled={step < BOOT.length}
          onClick={start}
          className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 glow-green font-bold tracking-[0.2em]"
        >
          {step < BOOT.length ? "INICIALIZANDO..." : "ACEITAR CONTRATO ▶"}
        </Button>

        <div className="text-[9px] text-center text-muted-foreground">
          v1.0 — toda semelhança com a realidade é mera coincidência
        </div>
      </div>
    </div>
  );
}
