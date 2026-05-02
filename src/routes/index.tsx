import { createFileRoute } from "@tanstack/react-router";
import { useGame } from "@/game/store";
import { BootScreen } from "@/components/BootScreen";
import { GameScreen } from "@/components/GameScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HACKER — RPG Cyberpunk de Invasões" },
      { name: "description", content: "Jogo RPG narrativo cyberpunk: aceite contratos do misterioso Ghost, resolva puzzles de hacking e suba de nível. Cuidado com seu Heat Level." },
      { property: "og:title", content: "HACKER — RPG Cyberpunk" },
      { property: "og:description", content: "Você é um hacker freelancer. Até onde você vai pelo dinheiro?" },
    ],
  }),
  component: Index,
});

function Index() {
  const started = useGame(s => s.started);
  return started ? <GameScreen /> : <BootScreen />;
}
