/**
 * Typed view of the parts of the Fallout Shelter save the editor actually
 * reads/writes. The save has hundreds of fields we never touch — rather
 * than type the whole thing (huge effort, huge maintenance burden, and
 * brittle against game updates), each top-level section is `unknown`
 * unless we specifically model it below. Add a section here the moment you
 * need to read/write a new part of the save; leave the rest alone.
 */

export interface Stat {
  value: number;
  mod: number;
  exp: number;
}

export interface DwellerRecord {
  serializeId: number;
  name: string;
  lastName: string;
  savedRoom: number;
  assigned: boolean;
  pregnant: boolean;
  babyReady: boolean;
  health: {
    healthValue: number;
    maxHealth: number;
    radiationValue: number;
    lastLevelUpdated: number;
    permaDeath: boolean;
  };
  happiness: { happinessValue: number };
  experience: {
    experienceValue: number;
    currentLevel: number;
    needLvUp: boolean;
    [key: string]: unknown;
  };
  stats: { stats: Stat[] };
  equipedWeapon: { id: string; type: string };
  equipedOutfit: { id: string; type: string };
  /** Populated only while the dweller is out exploring; null otherwise. */
  equipment?: {
    storage?: {
      resources: Record<string, number>;
      bonus: Record<string, number>;
    };
  } | null;
  relations?: {
    partner: number;
    lastPartner: number;
    ascendants: number[];
    relations: Array<number | { serializeId: number }>;
  };
  [key: string]: unknown;
}

export interface ActorRecord {
  serializeId: number;
  characterType: number;
  savedRoom: number;
  health: number;
  [key: string]: unknown;
}

export interface WaitingDwellerEntry {
  newDweller?: boolean;
  charType: string; // "Dweller" | "Handy" | "Pet" | ...
  dwellerId?: number; // present when charType === "Dweller"
  serializeId?: number; // present otherwise
}

export interface InventoryItem {
  id: string;
  type: "Junk" | "Outfit" | "Weapon" | "Pet" | string;
  hasBeenAssigned: boolean;
  hasRandonWeaponBeenAssigned: boolean;
  extraData?: {
    bonus?: string;
    uniqueName?: string;
    bonusValue?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface Room {
  type: string;
  deserializeID: number;
  dwellers: number[];
  [key: string]: unknown;
}

export interface WastelandTeam {
  /** Serialize IDs of the dwellers on this team — plain numbers, not full records. */
  dwellers: number[];
  status: string; // e.g. "Exploring", "Returning"
  returnTripDuration: number;
  elapsedReturningTime: number;
  elapsedTimeAliveExploring: number;
  teamEquipment: {
    inventory: { items: InventoryItem[] };
    storage: {
      resources: Resources;
      bonus: Resources;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface Resources extends Record<string, number> {
  Nuka: number;
  Food: number;
  Energy: number;
  Water: number;
  StimPack: number;
  RadAway: number;
  Lunchbox: number;
  MrHandy: number;
  PetCarrier: number;
  CraftedOutfit: number;
  CraftedWeapon: number;
  NukaColaQuantum: number;
  CraftedTheme: number;
  DummyUltracite: number;
  PokerChip: number;
}

export interface SaveData {
  dwellers: {
    dwellers: DwellerRecord[];
    actors: ActorRecord[];
  };
  dwellerSpawner: {
    dwellersWaiting: WaitingDwellerEntry[];
  };
  vault: {
    wasteland?: {
      teams: WastelandTeam[];
    };
    rooms: Room[];
    inventory: { items: InventoryItem[] };
    storage: {
      resources: Resources;
      bonus: Resources;
    };
    LunchBoxesByType: number[];
    LunchBoxesCount: number;
    [key: string]: unknown;
  };
  survivalW: {
    weapons: string[];
    outfits: string[];
    pets: string[];
    breeds: string[];
    recipes: string[];
    claimedRecipes: string[];
    [key: string]: unknown;
  };
  objectiveMgr: {
    shuffleBags: string[][];
    [key: string]: unknown;
  };
  DeathclawManager: {
    deathclawTotalExtraChance: number;
    [key: string]: unknown;
  };
  questDataManager?: {
    questDone: boolean;
    cancelled: boolean;
    questSucceeded: boolean;
    entranceFlow: boolean;
    questDifficulty: number;
    questTeam: {
      CurrentQuestID: string;
      randomIdentifier: number;
      DwellersDictionary: number[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
