import { useMemo, useState } from "react";
import type { Mission } from "@/game/types";

type Cell = "empty" | "wall" | "start" | "end" | "path" | "trap";

export function NetworkPuzzle({ mission, onResult }: { mission: Mission; onResult: (s: boolean, extraHeat?: number) => void }) {
  const size = mission.networkPath || 5;
  const grid = useMemo<Cell[][]>(() => {
    const g: Cell[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => "empty" as Cell));
    // random walls/traps deterministic-ish
    const seed = mission.id * 13 + 7;
    let r = seed;
    const rng = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < size * 2; i++) {
      const x = Math.floor(rng() * size), y = Math.floor(rng() * size);
      if ((x === 0 && y === 0) || (x === size - 1 && y === size - 1)) continue;
      g[y][x] = rng() > 0.5 ? "wall" : "trap";
    }
    g[0][0] = "start";
    g[size - 1][size - 1] = "end";
    return g;
  }, [size, mission.id]);

  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [traps, setTraps] = useState(0);
  const [done, setDone] = useState(false);

  const move = (dx: number, dy: number) => {
    if (done) return;
    const nx = pos[0] + dx, ny = pos[1] + dy;
    if (nx < 0 || ny < 0 || nx >= size || ny >= size) return;
    const cell = grid[ny][nx];
    if (cell === "wall") return;
    setPos([nx, ny]);
    if (cell === "trap") setTraps(t => t + 1);
    if (cell === "end") {
      setDone(true);
      setTimeout(() => onResult(true, traps * 3), 500);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">Chegue ao nó alvo. Evite firewalls (vermelho). Cada armadilha (laranja) aumenta o HEAT.</div>
      <div className="bg-black/60 rounded-md p-3 border border-border">
        <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, maxWidth: 320 }}>
          {grid.flatMap((row, y) => row.map((c, x) => {
            const here = pos[0] === x && pos[1] === y;
            const isEnd = c === "end";
            const isStart = c === "start";
            let bg = "bg-secondary";
            if (c === "wall") bg = "bg-[var(--neon-pink)]/60";
            else if (c === "trap") bg = "bg-[var(--heat)]/40";
            else if (isEnd) bg = "bg-[var(--neon-green)]/40";
            else if (isStart) bg = "bg-[var(--neon-blue)]/30";
            return (
              <div key={`${x}-${y}`} className={`aspect-square rounded ${bg} border border-border flex items-center justify-center text-xs`}>
                {here ? <span className="text-neon-green text-lg">●</span> : isEnd ? "⚑" : isStart ? "⌂" : ""}
              </div>
            );
          }))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
        <div />
        <button onClick={() => move(0, -1)} className="bg-secondary border border-border rounded h-10 hover:border-[var(--neon-green)]">↑</button>
        <div />
        <button onClick={() => move(-1, 0)} className="bg-secondary border border-border rounded h-10 hover:border-[var(--neon-green)]">←</button>
        <button onClick={() => move(0, 1)} className="bg-secondary border border-border rounded h-10 hover:border-[var(--neon-green)]">↓</button>
        <button onClick={() => move(1, 0)} className="bg-secondary border border-border rounded h-10 hover:border-[var(--neon-green)]">→</button>
      </div>
      <div className="text-[10px] text-center text-muted-foreground">armadilhas ativadas: <span className="text-neon-pink">{traps}</span></div>
    </div>
  );
}
