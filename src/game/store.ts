import { create } from "zustand";
import type { ChatLine, GameState, Skill } from "./types";
import { MISSIONS } from "./missions";

interface Actions {
  start: () => void;
  reset: () => void;
  addChat: (line: ChatLine) => void;
  completeMission: (success: boolean, extraHeat?: number) => void;
  addHeat: (n: number) => void;
  spendSkill: (s: Skill) => void;
  bust: () => void;
  finish: () => void;
  unlock: (a: string) => void;
}

const initial: GameState = {
  started: false,
  missionIndex: 0,
  xp: 0,
  level: 1,
  credits: 0,
  heat: 0,
  busted: false,
  finished: false,
  skills: { crypto: 0, social: 0, malware: 0, stealth: 0 },
  unlockedSkillPoints: 0,
  chat: [],
  achievements: [],
};

export const useGame = create<GameState & Actions>((set, get) => ({
  ...initial,
  start: () => set({ ...initial, started: true, chat: [
    { from: "system", text: "[ GHOST_NET v2.31 ] handshake estabelecido..." },
    { from: "system", text: "Conexão criptografada AES-256." },
    { from: "ghost", text: "Você é o tal hacker que andam comentando?" },
  ]}),
  reset: () => set({ ...initial }),
  addChat: (line) => set((s) => ({ chat: [...s.chat, line] })),
  addHeat: (n) => {
    const heat = Math.min(100, get().heat + n);
    set({ heat });
    if (heat >= 100) get().bust();
  },
  spendSkill: (s) => set((st) => st.unlockedSkillPoints > 0 ? {
    skills: { ...st.skills, [s]: st.skills[s] + 1 },
    unlockedSkillPoints: st.unlockedSkillPoints - 1,
  } : st),
  unlock: (a) => set((s) => s.achievements.includes(a) ? s : { achievements: [...s.achievements, a] }),
  completeMission: (success, extraHeat = 0) => {
    const s = get();
    const m = MISSIONS[s.missionIndex];
    if (!m) return;
    if (!success) {
      get().addHeat(15 + extraHeat);
      return;
    }
    const newXp = s.xp + m.xp;
    const newLevel = Math.floor(newXp / 150) + 1;
    const skillPointsGained = newLevel - s.level;
    set({
      xp: newXp,
      level: newLevel,
      credits: s.credits + m.reward,
      unlockedSkillPoints: s.unlockedSkillPoints + skillPointsGained,
    });
    get().addHeat(Math.max(1, m.heat - s.skills.stealth * 2) + extraHeat);
    if (m.id === MISSIONS.length - 1) {
      // trigger finish (twist) after small delay handled by UI
      set({ finished: true });
    } else {
      set({ missionIndex: s.missionIndex + 1 });
    }
  },
  bust: () => set({ busted: true }),
  finish: () => set({ finished: true }),
}));
