import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";
import { CharacterTypes, DEFAULT_HANDY_HEALTH } from "../data/gameConstants";

export function updateMrHandy(data: SaveData, config: EditorConfig): void {
  for (const actor of data.dwellers.actors.filter(
    (a) => a.characterType === CharacterTypes.HANDY,
  )) {
    if (config.setMaxMrHandyHealth) {
      actor.health = config.maxMrHandyHealth;
    }

    if (config.healHandies) {
      actor.health = DEFAULT_HANDY_HEALTH;
    }
  }
}
