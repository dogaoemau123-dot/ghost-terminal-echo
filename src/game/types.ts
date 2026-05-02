export type Skill = "crypto" | "social" | "malware" | "stealth";

export type PuzzleType = "terminal" | "password" | "social" | "network";

export interface ChatLine {
  from: "ghost" | "me" | "system";
  text: string;
  suspicious?: boolean;
}

export interface Mission {
  id: number;
  codename: string;
  target: string;
  brief: string;
  reward: number;
  xp: number;
  heat: number;
  puzzle: PuzzleType;
  intro: ChatLine[];
  outro: ChatLine[];
  // puzzle-specific data
  password?: string;
  hint?: string;
  command?: string;
  socialChoices?: { text: string; correct: boolean; reply: string }[];
  networkPath?: number; // grid size
}

export interface GameState {
  started: boolean;
  missionIndex: number;
  xp: number;
  level: number;
  credits: number;
  heat: number; // 0-100
  busted: boolean;
  finished: boolean;
  skills: Record<Skill, number>;
  unlockedSkillPoints: number;
  chat: ChatLine[];
  achievements: string[];
}
