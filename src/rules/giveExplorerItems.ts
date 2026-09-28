import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";
import { ITEM_CATALOG } from "../data/itemCatalog";

const CATALOG_BY_ID = new Map(ITEM_CATALOG.map((item) => [item.id, item]));

/**
 * Tops up every team currently out exploring (any team with at least one
 * dweller assigned) with the selected items, up to the configured target
 * count each — same "add only what's missing" behavior as the existing
 * vault-inventory rules, applied to team.teamEquipment.inventory.items
 * instead of data.vault.inventory.items.
 */
export function giveExplorerItems(data: SaveData, config: EditorConfig): void {
  if (!config.giveExplorerItems) return;
  const teams = data.vault.wasteland?.teams;
  if (!teams?.length) return;

  const targets = Object.entries(config.giveExplorerItemCounts).filter(
    ([, count]) => count > 0,
  );
  if (targets.length === 0) return;

  for (const team of teams) {
    if (team.dwellers.length === 0) continue; // not actually out exploring

    for (const [itemId, target] of targets) {
      const catalogEntry = CATALOG_BY_ID.get(itemId);
      if (!catalogEntry) continue; // unknown id, skip rather than write garbage

      const items = team.teamEquipment.inventory.items;
      const currentCount = items.filter((i) => i.id === itemId).length;
      const needed = target - currentCount;

      for (let i = 0; i < needed; i++) {
        items.push({
          id: itemId,
          type: catalogEntry.type,
          hasBeenAssigned: false,
          hasRandonWeaponBeenAssigned: false,
        });
      }
    }
  }
}
