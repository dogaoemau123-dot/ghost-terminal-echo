import { useState } from "react";
import type { Mission } from "@/game/types";
import { Button } from "@/components/ui/button";

interface Props { mission: Mission; onResult: (success: boolean) => void; }

export function TerminalPuzzle({ mission, onResult }: Props) {
  const [val, setVal] = useState("");
  const [history, setHistory] = useState<string[]>([
    "GhostShell v3.1 — sessão iniciada",
    `target: ${mission.target}`,
    `objetivo: ${mission.command}`,
    "",
  ]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = val.trim();
    setHistory(h => [...h, `root@operator:~# ${cmd}`]);
    setVal("");
    if (cmd === mission.command) {
      setHistory(h => [...h, "[+] payload deployed", "[+] target compromised", ""]);
      setTimeout(() => onResult(true), 600);
    } else if (cmd === "help") {
      setHistory(h => [...h, `digite exatamente: ${mission.command}`]);
    } else {
      setHistory(h => [...h, `bash: comando inválido (digite 'help')`]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="bg-black/60 rounded-md p-3 font-mono text-[12px] h-64 overflow-y-auto border border-border">
        {history.map((l, i) => (
          <div key={i} className={l.startsWith("[+]") ? "text-neon-green" : l.startsWith("bash") ? "text-neon-pink" : "text-foreground/80"}>{l}</div>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <span className="text-neon-green self-center text-sm">$</span>
        <input
          autoFocus
          value={val}
          onChange={e => setVal(e.target.value)}
          className="flex-1 bg-transparent border border-border rounded px-2 py-1.5 text-sm font-mono outline-none focus:border-[var(--neon-green)]"
          placeholder="digite um comando..."
        />
        <Button type="submit" size="sm">EXEC</Button>
      </form>
    </div>
  );
}
