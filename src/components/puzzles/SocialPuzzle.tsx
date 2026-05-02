import { useState } from "react";
import type { Mission } from "@/game/types";
import { Button } from "@/components/ui/button";

export function SocialPuzzle({ mission, onResult }: { mission: Mission; onResult: (s: boolean, extraHeat?: number) => void }) {
  const [reply, setReply] = useState<string | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <div className="bg-black/60 rounded-md p-3 border border-border text-xs space-y-2">
        <div className="text-neon-purple">// ALVO: {mission.target}</div>
        <div className="bg-secondary px-3 py-2 rounded">
          <div className="text-[10px] text-muted-foreground">{mission.target}</div>
          <div className="text-foreground">Olá? Quem fala?</div>
        </div>
        {chosen !== null && mission.socialChoices && (
          <>
            <div className="bg-[var(--neon-blue)]/15 px-3 py-2 rounded text-right">
              <div className="text-[10px] text-muted-foreground">YOU</div>
              <div>{mission.socialChoices[chosen].text}</div>
            </div>
            {reply && (
              <div className="bg-secondary px-3 py-2 rounded">
                <div className="text-[10px] text-muted-foreground">{mission.target}</div>
                <div>{reply}</div>
              </div>
            )}
          </>
        )}
      </div>

      {chosen === null && (
        <div className="space-y-2">
          <div className="text-[11px] text-muted-foreground">Escolha sua abordagem:</div>
          {mission.socialChoices?.map((c, i) => (
            <Button
              key={i}
              variant="secondary"
              className="w-full text-left h-auto py-2 whitespace-normal text-xs justify-start"
              onClick={() => {
                setChosen(i);
                setReply(c.reply);
                setTimeout(() => onResult(c.correct, c.correct ? 0 : 5), 1500);
              }}
            >
              <span className="text-neon-green mr-2">›</span> {c.text}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
