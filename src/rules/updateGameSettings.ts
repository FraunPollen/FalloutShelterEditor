import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";

export function updateGameSettings(data: SaveData, config: EditorConfig): void {
  if (config.setSimpleObjectives) {
    data.objectiveMgr.shuffleBags = [
      ["Food5"],
      ["Food5"],
      ["Food5"],
      ["Food5"],
      ["Food5"],
    ];
  }
  if (config.setDeathClawChance) {
    data.DeathclawManager.deathclawTotalExtraChance = config.deathClawChance;
  }
}
