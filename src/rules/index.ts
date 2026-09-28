import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";
import { removeWaitingDwellers } from "./removeWaitingDwellers";
import { removeIdleHandies } from "./removeIdleHandies";
import {
  extendExplorationTime,
  fastForwardExplorerReturn,
} from "./fastForwardExplorers";
import { giveExplorerItems } from "./giveExplorerItems";
import {
  giveExplorersCaps,
  giveExplorersHealthPacks,
} from "./giveExplorersHealthPacks";
import { modifyDwellers } from "./modifyDwellers";
import { unlockItems } from "./unlockItems";
import { updateInventory } from "./updateInventory";
import { updateJunk } from "./updateJunk";
import { updatePets } from "./updatePets";
import { manageResources } from "./manageResources";
import { updateMrHandy } from "./updateMrHandy";
import { updateGameSettings } from "./updateGameSettings";

/**
 * Every rule is a plain, independently testable function `(data, config) => void`.
 * Each rule reads its own `config.someFlag` and no-ops if it's off, so this
 * list is just composition, not a series of hand-written if-branches.
 * Order matters where rules touch overlapping data (documented per-rule).
 */
const rules: Array<(data: SaveData, config: EditorConfig) => void> = [
  removeWaitingDwellers,
  removeIdleHandies,
  fastForwardExplorerReturn,
  extendExplorationTime,
  giveExplorerItems,
  giveExplorersHealthPacks,
  giveExplorersCaps,
  modifyDwellers,
  unlockItems,
  updateInventory,
  updateJunk,
  updatePets,
  manageResources,
  updateMrHandy,
  updateGameSettings,
];

export function applyConfig(data: SaveData, config: EditorConfig): SaveData {
  for (const rule of rules) rule(data, config);
  return data;
}
