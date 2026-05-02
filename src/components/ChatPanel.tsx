import { useEffect, useRef } from "react";
import { useGame } from "@/game/store";

export function ChatPanel() {
  const chat = useGame(s => s.chat);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo({ top: 999999, behavior: "smooth" }); }, [chat.length]);

  return (
    <div className="terminal-card rounded-md flex flex-col h-full min-h-0">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] glow-green" />
          <span className="text-xs text-neon-green">@GHOST</span>
          <span className="text-[10px] text-muted-foreground">// e2e encrypted</span>
        </div>
        <span className="text-[10px] text-muted-foreground">TOR · ONION</span>
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto p-3 space-y-2 text-sm scanline">
        {chat.map((c, i) => {
          if (c.from === "system") return (
            <div key={i} className="text-[11px] text-muted-foreground italic">{c.text}</div>
          );
          const me = c.from === "me";
          return (
            <div key={i} className={`flex ${me ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3 py-1.5 rounded-md text-[12px] leading-relaxed ${
                me
                  ? "bg-[var(--neon-blue)]/15 border border-[var(--neon-blue)]/40 text-foreground"
                  : `bg-secondary border border-border ${c.suspicious ? "text-neon-pink glitch" : "text-neon-green"}`
              }`}>
                <div className="text-[9px] opacity-60 mb-0.5">{me ? "YOU" : "GHOST"}</div>
                {c.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
