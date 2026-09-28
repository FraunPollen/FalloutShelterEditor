export type ItemType = "Junk" | "Outfit" | "Weapon";

export interface CatalogItem {
  id: string;
  type: ItemType;
  stats?: string;
}

export interface WeaponStat {
  name: string;
  dmgMin: number;
  dmgMax: number;
  type: "Pistol" | "Rifle" | "Shotgun" | "Heavy" | "Melee";
}
export const getWeaponStats = (weapon?: WeaponStat): string => {
  if (weapon == null) {
    return "";
  }
  return `(${weapon.type}: ${weapon.dmgMin}-${weapon.dmgMax})`;
};

export interface OutfitStat {
  name: string;
  str?: number;
  per?: number;
  end?: number;
  cha?: number;
  int?: number;
  agi?: number;
  luk?: number;
}
export const getOutfitStats = (outfit?: OutfitStat): string => {
  if (outfit == null) {
    return "";
  }
  const specials = [
    ["STR", outfit.str],
    ["PER", outfit.per],
    ["END", outfit.end],
    ["CHA", outfit.cha],
    ["INT", outfit.int],
    ["AGI", outfit.agi],
    ["LUK", outfit.luk],
  ].filter(([, value]) => value != null);

  return specials.length
    ? `(${specials.map(([letter, value]) => `${letter}: ${value}`).join(", ")})`
    : "";
};

export type Special =
  "str" | "per" | "end" | "cha" | "int" | "agi" | "luk" | "explore";
const JUNK_IDS = [
  "AlarmClock",
  "BaseballGlove",
  "BrahminHide",
  "Camera",
  "ChemistrySet",
  "DeskFan",
  "DuctTape",
  "GiddyupButtercup",
  "Globe",
  "GoldWatch",
  "MagnifyingGlass",
  "Microscope",
  "MilitaryCircuitBoard",
  "MilitaryDuctTape",
  "Shovel",
  "TeddyBear",
  "TriFoldFlag",
  "ToyCar",
  "Wonderglue",
  "YaoGuaiHide",
  "Yarn",
];

export const BEST_WEAPONS = {
  Defense: {
    name: "Fatman_Mirv",
    dmgMin: 22,
    dmgMax: 27,
    type: "Heavy",
  } satisfies WeaponStat,
  Quest: {
    name: "GatlingLaser_Vengeance",
    dmgMin: 21,
    dmgMax: 26,
    type: "Heavy",
  } satisfies WeaponStat,
  Explore: {
    name: "PlasmaThrower_DragonsMaw",
    dmgMin: 22,
    dmgMax: 29,
    type: "Rifle",
  } satisfies WeaponStat,
};

const WEAPONS: WeaponStat[] = [
  ...Object.values(BEST_WEAPONS),
  { name: "Melee_FireHydrantBat", dmgMin: 19, dmgMax: 31, type: "Melee" },
  { name: "Super_sledge", dmgMin: 18, dmgMax: 32, type: "Melee" },
];

export const POWER_ARMORS = {
  MK: { name: "PowerArmor_MkVI", str: 5, per: 1, end: 1 },
  T45: { name: "PowerArmor_T45f", str: 2, per: 5 },
  T60: { name: "PowerArmor_T60f", str: 1, per: 1, end: 5 },
  Scarred: { name: "ScarredPowerArmor", str: 4, per: 2, end: 4, cha: 2 },
  Enclave: { name: "EnclavePowerArmor", str: 6, end: 6, int: 2 },
  War: { name: "Horseman_WarArmor", str: 4, per: 4, end: 4, cha: 4 }, // quest reward
};

export const BEST_OUTFITS: Record<Special, OutfitStat> = {
  str: { name: "MilitaryJumpsuit_Commander", str: 7 },
  per: { name: "UtilityJumpsuit_Heavy", per: 7 },
  end: { name: "HazmatSuit_Heavy", end: 7 },
  cha: { name: "AllNightware_Lucky", cha: 7 },
  int: { name: "LabCoat_Expert", int: 7 },
  agi: { name: "HandymanJumpsuit_Expert", agi: 7 },
  luk: { name: "FormalWear_Lucky", luk: 7 },
  explore: POWER_ARMORS.War,
};

const OUTFITS: OutfitStat[] = [
  ...Object.values(BEST_OUTFITS),
  ...Object.values(POWER_ARMORS),
  { name: "LucysVaultSuit" }, // quest req
  { name: "RottedDuster" }, // quest req
  { name: "BOSCasual" }, // quest req
  { name: "Horseman_FamineVestment", str: 4, end: 4, int: 4, luk: 4 }, // quest reward
  { name: "Horseman_PestilencePlating", end: 4, cha: 4, int: 4, agi: 4 }, // quest reward
  { name: "Horseman_DeathJacket", per: 4, end: 4, agi: 4, luk: 4 }, // quest reward
].reduce((acc: OutfitStat[], curr: OutfitStat) => {
  if (!acc.some((a) => a.name === curr.name)) {
    return [...acc, curr];
  }
  return acc;
}, [] satisfies OutfitStat[]);

export const ITEM_CATALOG: CatalogItem[] = [
  ...JUNK_IDS.sort().map((id) => ({ id, type: "Junk" }) satisfies CatalogItem),
  ...OUTFITS.map(
    (outfit) =>
      ({
        id: outfit.name,
        type: "Outfit",
        stats: getOutfitStats(outfit),
      }) as CatalogItem,
  ).sort((a, b) => (a.id < b.id ? -1 : 1)),
  ...WEAPONS.map(
    (weapon) =>
      ({
        id: weapon.name,
        type: "Weapon",
        stats: getWeaponStats(weapon),
      }) satisfies CatalogItem,
  ).sort((a, b) => (a.id < b.id ? -1 : 1)),
];
