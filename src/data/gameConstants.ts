import { Special } from "./itemCatalog";

/** Room type -> governing SPECIAL stat. `null` = no stat (power armor instead), missing key = unmapped. */
export const ROOM_STAT_MAP: Record<string, Special | null> = {
  Bar: "cha",
  BarberShop: "cha",
  Casino: "luk",
  Classroom: "int",
  Diner: "agi",
  Dojo: "str",
  Energy: "str",
  Energy2: "str",
  Entrance: null,
  Gym: "agi",
  Hydroponic: "agi",
  LivingQuarters: "cha",
  MedBay: "int",
  NukaCola: "end",
  Radio: "cha",
  ScienceLab: "int",
  Storage: null, // assume storage is holding cell for explorers
  SuperRoom2: "str",
  Water: "per",
  Water2: "per",
};

export enum LunchBoxTypes {
  LUNCH = 0,
  HANDY = 1,
  PET = 2,
  LOOT = 3,
}

export enum Gender {
  MALE = 0,
  FEMALE = 1,
}

export const QUEST_ITEMS_OUTFITS = [
  "LucysVaultSuit",
  "RottedDuster",
  "BOSCasual",
];
export const QUEST_ITEMS_WEAPONS: string[] = [];

export enum CharacterTypes {
  HANDY = 2,
  PET = 3,
}

export const DEFAULT_HANDY_HEALTH = 644;
