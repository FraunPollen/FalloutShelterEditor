/**
 * The single source of truth for every editable option. This is the type
 * that used to be an untyped `this.config = {...}` object built up ad hoc
 * across the constructor and collectFormData(). Every field the UI can
 * change lives here, with a real type — add a field, and every rule/
 * component that reads it is checked by the compiler.
 */
export interface EditorConfig {
  // --- Dweller count management (deliberately separate features) ---
  setMaxDwellers: boolean;
  maxDwellerCount: number;

  removeWaitingDwellers: boolean;
  /** Keys are `${charType}:${id}`, matching WaitingDwellerEntry identity. */
  removeWaitingDwellerIds: string[];

  /** Bulk-removes any Mr. Handy not currently assigned to a room (waiting or exploring) — a broader, separate action from the per-entry table above. */
  removeIdleHandies: boolean;

  // --- Exploration ---
  fastForwardExplorerReturn: boolean;
  /** How far to advance each returning team's trip, in hours. */
  fastForwardExplorerReturnByHours: number;

  fastForwardExplorationTime: boolean;
  /** How far to extend each team's trip, in hours. */
  fastForwardExplorationTimeHours: number;

  giveExplorerItems: boolean;
  giveExplorerItemCounts: Record<string, number>;

  giveExplorerCaps: boolean;
  giveExplorerCapsCount: number;

  /** Fills every currently-exploring team + their dwellers to 25 StimPack/RadAway. */
  giveExplorersHealthPacks: boolean;

  // --- Per-dweller roster edits (applied to every dweller) ---
  renameDwellers: boolean;

  healDwellers: boolean;

  setMaxDwellerHealth: boolean;
  maxDwellerHealth: number;

  setDwellerRad: boolean;
  dwellerRadLevel: number;

  setDwellerHappiness: boolean;
  dwellerHappiness: number;

  /** Maxes level (50) and clears the XP-to-next-level flag. */
  setDwellerLvl: boolean;

  /** Maxes all seven SPECIAL stats. */
  setMaxStats: boolean;

  equipMaxWeapon: boolean;
  equipBestArmor: boolean;
  abortPregnancies: boolean;

  setPregnantCount: boolean;
  pregnantCount: number;

  setAllPregnanciesReady: boolean;

  // --- Mr. Handy ---
  setMaxMrHandyHealth: boolean;
  maxMrHandyHealth: number;

  healHandies: boolean;

  // --- Resources ---
  setCapsCount: boolean;
  capsCount: number;
  setStimpackCount: boolean;
  stimpackCount: number;
  setRadawayCount: boolean;
  radawayCount: number;
  setFoodCount: boolean;
  foodCount: number;
  setEnergyCount: boolean;
  energyCount: number;
  setWaterCount: boolean;
  waterCount: number;
  setNukaColaCount: boolean;
  nukaColaCount: number;
  setPokerChipCount: boolean;
  pokerChipCount: number;
  setUltraciteCount: boolean;
  ultraciteCount: number;

  /** Rebuilds the lunchbox/crate queue from the four counts below. */
  setBoxCounts: boolean;
  lunchboxCount: number;
  mrHandyBoxCount: number;
  petCrateCount: number;
  lootCrateCount: number;

  // --- Vault inventory ---
  givePets: boolean;
  givePetCounts: Record<string, number>;

  giveJunk: boolean;
  giveJunkCounts: Record<string, number>;

  /** Tops up vault outfits/weapons to selected target counts (dropdown-driven). */
  giveInventory: boolean;
  giveInventoryCounts: Record<string, number>;

  /** Adds one of each quest-reward outfit/weapon, if missing. */
  giveQuestItems: boolean;

  // --- Game settings ---
  /** Simplifies all active daily objectives to "produce 5 food". */
  setSimpleObjectives: boolean;

  setDeathClawChance: boolean;
  deathClawChance: number;

  /** Unlocks every weapon/outfit/pet/breed/recipe in survivalW. */
  discoverItems: boolean;
}

export const DEFAULT_CONFIG: EditorConfig = {
  setMaxDwellers: false,
  maxDwellerCount: 0,

  removeWaitingDwellers: false,
  removeWaitingDwellerIds: [],

  removeIdleHandies: false,

  fastForwardExplorerReturn: false,
  fastForwardExplorerReturnByHours: 24,

  fastForwardExplorationTime: false,
  fastForwardExplorationTimeHours: 24,

  giveExplorerCaps: false,
  giveExplorerCapsCount: 5000,

  giveExplorerItems: false,
  giveExplorerItemCounts: {},

  giveExplorersHealthPacks: false,

  renameDwellers: false,

  healDwellers: false,

  setMaxDwellerHealth: false,
  maxDwellerHealth: 300,

  setDwellerRad: false,
  dwellerRadLevel: 0,

  setDwellerHappiness: false,
  dwellerHappiness: 100,

  setDwellerLvl: false,
  setMaxStats: false,
  equipMaxWeapon: false,
  equipBestArmor: false,
  abortPregnancies: false,

  setPregnantCount: false,
  pregnantCount: 1,

  setAllPregnanciesReady: false,

  setMaxMrHandyHealth: false,
  maxMrHandyHealth: 300,
  healHandies: false,

  setCapsCount: false,
  capsCount: 0,
  setStimpackCount: false,
  stimpackCount: 0,
  setRadawayCount: false,
  radawayCount: 0,
  setFoodCount: false,
  foodCount: 0,
  setEnergyCount: false,
  energyCount: 0,
  setWaterCount: false,
  waterCount: 0,
  setNukaColaCount: false,
  nukaColaCount: 0,
  setPokerChipCount: false,
  pokerChipCount: 0,
  setUltraciteCount: false,
  ultraciteCount: 0,

  setBoxCounts: false,
  lunchboxCount: 0,
  mrHandyBoxCount: 0,
  petCrateCount: 0,
  lootCrateCount: 0,

  givePets: false,
  givePetCounts: {},

  giveJunk: false,
  giveJunkCounts: {},

  giveInventory: false,
  giveInventoryCounts: {},

  giveQuestItems: false,

  setSimpleObjectives: false,

  setDeathClawChance: false,
  deathClawChance: 0,

  discoverItems: false,
};
