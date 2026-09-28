import { LunchBoxTypes } from "../data/gameConstants";
import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";

/** Each resource is independently toggled — only touches what's checked. */
export function manageResources(data: SaveData, config: EditorConfig): void {
  const resources = data.vault.storage?.resources;
  if (!resources) return;

  if (config.setCapsCount) resources.Nuka = config.capsCount;
  if (config.setStimpackCount) resources.StimPack = config.stimpackCount;
  if (config.setRadawayCount) resources.RadAway = config.radawayCount;
  if (config.setFoodCount) resources.Food = config.foodCount;
  if (config.setEnergyCount) resources.Energy = config.energyCount;
  if (config.setWaterCount) resources.Water = config.waterCount;
  if (config.setNukaColaCount) resources.NukaColaQuantum = config.nukaColaCount;
  if (config.setPokerChipCount) resources.PokerChip = config.pokerChipCount;
  if (config.setUltraciteCount)
    resources.DummyUltracite = config.ultraciteCount;

  manageLunchboxes(data, config);
}

/**
 * Rebuilds the vault's lunchbox/crate queue from the four configured
 * counts. Named `setBoxCounts` here (the original's `setRemoveBoxes` was
 * misleading — it actually *sets* the full box list, not just removes).
 */
function manageLunchboxes(data: SaveData, config: EditorConfig): void {
  if (!config.setBoxCounts) return;

  const boxes: number[] = [];
  for (let i = 0; i < config.lunchboxCount; i++)
    boxes.push(LunchBoxTypes.LUNCH);
  for (let i = 0; i < config.mrHandyBoxCount; i++)
    boxes.push(LunchBoxTypes.HANDY);
  for (let i = 0; i < config.petCrateCount; i++) boxes.push(LunchBoxTypes.PET);
  for (let i = 0; i < config.lootCrateCount; i++)
    boxes.push(LunchBoxTypes.LOOT);

  data.vault.LunchBoxesByType = boxes;
  data.vault.LunchBoxesCount = boxes.length;
}
