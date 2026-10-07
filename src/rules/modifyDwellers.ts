import type { EditorConfig } from "../types/config";
import type { DwellerRecord, SaveData } from "../types/save";
import { ROOM_STAT_MAP } from "../data/gameConstants";
import { BEST_OUTFITS, BEST_WEAPONS, POWER_ARMORS } from "../data/itemCatalog";

/**
 * Applies every per-dweller toggle to every dweller in the roster. Each
 * sub-block guards on its own config flag and no-ops otherwise, mirroring
 * the original saveEditor.js's single forEach loop.
 */
export function modifyDwellers(data: SaveData, config: EditorConfig): void {
  for (const dweller of data.dwellers.dwellers) {
    const isExploring = data.vault.wasteland?.teams.some((t) =>
      t.dwellers.includes(dweller.serializeId),
    );
    const isQuesting =
      data.questDataManager?.questDone == false &&
      data.questDataManager?.questTeam.DwellersDictionary.includes(
        dweller.serializeId,
      );

    if (config.renameDwellers) renameDweller(dweller);
    if (config.setMaxDwellerHealth) {
      dweller.health.healthValue = config.maxDwellerMaxHealth;
      dweller.health.maxHealth = config.maxDwellerMaxHealth;
    }
    if (config.healDwellers) {
      dweller.health.healthValue = dweller.health.maxHealth;
    }
    if (config.setDwellerRad)
      dweller.health.radiationValue = config.dwellerRadLevel;
    if (config.setDwellerHappiness)
      dweller.happiness.happinessValue = config.dwellerHappiness;
    if (config.setDwellerLvl) maxOutLevel(dweller);
    if (config.setMaxStats) maxOutStats(dweller);
    if (config.equipMaxWeapon) {
      if (isExploring) {
        dweller.equipedWeapon.id = BEST_WEAPONS.Explore.name;
      } else if (isQuesting) {
        dweller.equipedWeapon.id = BEST_WEAPONS.Quest.name;
      } else {
        dweller.equipedWeapon.id = BEST_WEAPONS.Defense.name;
      }
    }
    if (config.equipBestArmor) equipBestArmor(data, dweller);
    if (config.abortPregnancies) {
      dweller.pregnant = false;
      dweller.babyReady = false;
    }
  }
}

function renameDweller(dweller: DwellerRecord): void {
  dweller.name = String(dweller.serializeId).padStart(3, "0");
  dweller.lastName = "";
}

function maxOutLevel(dweller: DwellerRecord): void {
  dweller.health.lastLevelUpdated = 50;
  dweller.experience.experienceValue = 1;
  dweller.experience.currentLevel = 50;
  dweller.experience.needLvUp = false;
}

function maxOutStats(dweller: DwellerRecord): void {
  for (let i = 1; i < 8; i++) {
    const stat = dweller.stats.stats[i];
    if (stat) {
      stat.value = 10;
      stat.exp = 594000;
    }
  }
}

/**
 * Equips the best outfit for wherever the dweller currently is: matched to
 * their assigned room's governing SPECIAL stat, or power armor if they're
 * out exploring. `team.dwellers` holds plain dweller-ID numbers (not
 * objects), so membership is checked with `includes`, not a `.find` over
 * object fields.
 */
function equipBestArmor(data: SaveData, dweller: DwellerRecord): void {
  const room = data.vault.rooms.find((r) =>
    r.dwellers.includes(dweller.serializeId),
  );
  const isExploring = data.vault.wasteland?.teams.some((t) =>
    t.dwellers.includes(dweller.serializeId),
  );

  if (room) {
    const special = ROOM_STAT_MAP[room.type];
    if (special === undefined) return; // unmapped room type, leave as-is
    if (special === null) {
      if (
        !Object.values(POWER_ARMORS).find(
          (a) => a.name === dweller.equipedOutfit.id,
        ) !== undefined
      ) {
        dweller.equipedOutfit.id = BEST_OUTFITS.explore.name;
      }
      return;
    }
    dweller.equipedOutfit.id = BEST_OUTFITS[special].name;
  } else if (isExploring) {
    if (
      !Object.values(POWER_ARMORS).find(
        (a) => a.name === dweller.equipedOutfit.id,
      ) !== undefined
    ) {
      dweller.equipedOutfit.id = BEST_OUTFITS.explore.name;
    }
  }
}
