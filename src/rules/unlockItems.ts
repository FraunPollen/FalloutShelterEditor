import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";
import { UNLOCKABLE_GAME_DATA } from "../data/unlockableGameData";

function addAllMissing(target: string[], source: string[]): void {
  for (const id of source) {
    if (!target.includes(id)) target.push(id);
  }
}

export function unlockItems(data: SaveData, config: EditorConfig): void {
  if (!config.discoverItems) return;

  addAllMissing(data.survivalW.weapons, UNLOCKABLE_GAME_DATA.weapons);
  addAllMissing(data.survivalW.outfits, UNLOCKABLE_GAME_DATA.outfits);
  addAllMissing(data.survivalW.pets, UNLOCKABLE_GAME_DATA.pets);
  addAllMissing(data.survivalW.breeds, UNLOCKABLE_GAME_DATA.breeds);
  addAllMissing(data.survivalW.recipes, UNLOCKABLE_GAME_DATA.recipes);
  addAllMissing(data.survivalW.claimedRecipes, UNLOCKABLE_GAME_DATA.recipes);
}
