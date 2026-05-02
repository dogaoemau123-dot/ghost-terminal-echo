import { useState } from "react";
import type { Mission } from "@/game/types";
import { Button } from "@/components/ui/button";

export function PasswordPuzzle({ mission, onResult }: { mission: Mission; onResult: (s: boolean, extraHeat?: number) => void }) {
  const [val, setVal] = useState("");
  const [tries, setTries] = useState(0);
  const [feedback, setFeedback] = useState<string>("");

  const check = () => {
    if (val === mission.password) {
      setFeedback("✓ ACESSO LIBERADO");
      setTimeout(() => onResult(true), 500);
    } else {
      const t = tries + 1;
      setTries(t);
      const hits = val.split("").filter((c, i) => mission.password?.[i] === c).length;
      setFeedback(`✗ Falhou — ${hits}/${mission.password?.length} dígitos no lugar certo`);
      if (t >= 5) {
        setFeedback("⚠ TENTATIVAS EXCEDIDAS — RASTREADO");
        setTimeout(() => onResult(false, 10), 700);
      }
      setVal("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-black/60 rounded-md p-4 border border-border">
        <div className="text-[11px] text-muted-foreground mb-2">// COFRE: {mission.target}</div>
        <div className="text-neon-purple text-xs mb-3">DICA: {mission.hint}</div>
        <div className="text-center text-3xl font-mono tracking-[0.5em] text-neon-green my-4 min-h-[2.5rem]">
          {val.padEnd(mission.password?.length || 4, "•")}
        </div>
        <div className="text-center text-xs h-4" style={{ color: feedback.startsWith("✓") ? "var(--neon-green)" : "var(--neon-pink)" }}>{feedback}</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {["1","2","3","4","5","6","7","8","9","←","0","OK"].map(k => (
          <Button
            key={k}
            variant="secondary"
            className="h-12 text-lg font-mono"
            onClick={() => {
              if (k === "←") setVal(v => v.slice(0, -1));
              else if (k === "OK") check();
              else if (val.length < (mission.password?.length || 4)) setVal(v => v + k);
            }}
          >{k}</Button>
        ))}
      </div>
      <div className="text-[10px] text-muted-foreground text-right">tentativas: {tries}/5</div>
    </div>
  );
}
