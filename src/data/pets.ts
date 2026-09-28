import type { InventoryItem } from "../types/save";

export interface PetItem extends InventoryItem {
  type: "Pet";
  extraData: {
    uniqueName: string;
    bonus: string;
    bonusValue: number;
  };
}

export const PETS: Record<string, PetItem> = {
  AddMaxHP: {
    id: "bombay_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Toby",
      bonus: "AddMaxHP",
      bonusValue: 100,
    },
  },

  CheaperCrafting: {
    id: "burmilla_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Diamond",
      bonus: "CheaperCrafting",
      bonusValue: 45,
    },
  },

  ChildMultiplier: {
    id: "dalmatian_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Pongo",
      bonus: "ChildMultiplier",
      bonusValue: 75,
    },
  },

  DamageBoost: {
    id: "militarymacaw_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Polly",
      bonus: "DamageBoost",
      bonusValue: 6,
    },
  },

  FasterAndCheaperCrafting: {
    id: "brittany_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Brittany",
      bonus: "FasterAndCheaperCrafting",
      bonusValue: 30,
    },
  },

  FasterCrafting: {
    id: "somali_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Saffron",
      bonus: "FasterCrafting",
      bonusValue: 45,
    },
  },

  HealingBoost: {
    id: "british_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Ashes",
      bonus: "HealingBoost",
      bonusValue: 4,
    },
  },

  MysteriousMagnet: {
    id: "toyger_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Toyger",
      bonus: "MysteriousMagnet",
      bonusValue: 7.5,
    },
  },

  ObjectiveMultiplier: {
    id: "blueyellowmacaw_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Vinnie",
      bonus: "ObjectiveMultiplier",
      bonusValue: 3,
    },
  },

  RadHealingBoost: {
    id: "siamese_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Goblet",
      bonus: "RadHealingBoost",
      bonusValue: 4,
    },
  },

  Resistance: {
    id: "abyssinian_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Zula",
      bonus: "Resistance",
      bonusValue: 50,
    },
  },

  TrainingBoost: {
    id: "blacklab_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Muttface",
      bonus: "TrainingBoost",
      bonusValue: 30,
    },
  },

  WastelandCapsBoost: {
    id: "sterling_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Sterling",
      bonus: "WastelandCapsBoost",
      bonusValue: 50,
    },
  },

  WastelandItemBoost: {
    id: "goldenret_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Cindy",
      bonus: "WastelandItemBoost",
      bonusValue: 30,
    },
  },

  WastelandJunkBoost: {
    id: "stbernard_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "Scout",
      bonus: "WastelandJunkBoost",
      bonusValue: 100,
    },
  },

  XPBoost: {
    id: "cx404_l",
    type: "Pet",
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
    extraData: {
      uniqueName: "CX404",
      bonus: "XPBoost",
      bonusValue: 45,
    },
  },
};
