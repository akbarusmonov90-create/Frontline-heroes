
export enum Faction {
  DRAGONS = 'Dragons',
  KNIGHTS = 'Knights',
  NECROMANCY = 'Necromancy',
  MAGES = 'Mages'
}

export enum GamePhase {
  DRAW = 'Draw',
  PLACEMENT = 'Placement',
  ATTACK = 'Attack',
  BATTLE = 'Battle',
  RECOVERY = 'Recovery'
}

export enum View {
  MAIN_MENU = 'MAIN_MENU',
  RULEBOOK = 'RULEBOOK',
  FACTION_INFO = 'FACTION_INFO',
  GAME_MODE_SELECT = 'GAME_MODE_SELECT',
  FACTION_FUSION = 'FACTION_FUSION',
  GAME = 'GAME',
  GAME_OVER = 'GAME_OVER'
}

export interface HeroCard {
  id: string;
  name: string;
  faction: Faction;
  atk: number;
  maxHp: number;
  currentHp: number;
  effect: string;
  quote?: string;
  hasAttacked?: boolean;
}

export interface PlayerState {
  id: number;
  name: string;
  isAi: boolean;
  selectedFactions: Faction[];
  deck: HeroCard[];
  hand: HeroCard[];
  board: (HeroCard | null)[]; // Max 3 slots
  deathPile: HeroCard[];
  deathCounter: number;
}

export interface GameState {
  players: [PlayerState, PlayerState];
  activePlayerIndex: number;
  turnCount: number;
  phase: GamePhase;
  logs: string[];
}
