import type { EditorConfig } from "../types/config";
import type { InventoryItem, SaveData } from "../types/save";
import {
  QUEST_ITEMS_OUTFITS,
  QUEST_ITEMS_WEAPONS,
} from "../data/gameConstants";
import { ITEM_CATALOG } from "../data/itemCatalog";

const CATALOG_BY_ID = new Map(ITEM_CATALOG.map((item) => [item.id, item]));

function newItem(id: string, type: string): InventoryItem {
  return {
    id,
    type,
    hasBeenAssigned: false,
    hasRandonWeaponBeenAssigned: false,
  };
}

function addOneIfMissing(
  items: InventoryItem[],
  id: string,
  type: string,
): void {
  if (!items.some((i) => i.id === id)) items.push(newItem(id, type));
}

/** Tops up the vault's outfits/weapons to the selected target counts. */
export function updateInventory(data: SaveData, config: EditorConfig): void {
  if (config.giveQuestItems) {
    for (const id of QUEST_ITEMS_OUTFITS)
      addOneIfMissing(data.vault.inventory.items, id, "Outfit");
    for (const id of QUEST_ITEMS_WEAPONS)
      addOneIfMissing(data.vault.inventory.items, id, "Weapon");
  }

  if (!config.giveInventory) return;

  for (const [itemId, target] of Object.entries(config.giveInventoryCounts)) {
    if (target <= 0) continue;
    const catalogEntry = CATALOG_BY_ID.get(itemId);
    if (!catalogEntry || catalogEntry.type === "Junk") continue; // junk handled separately

    const items = data.vault.inventory.items;
    const currentCount = items.filter((i) => i.id === itemId).length;
    for (let i = currentCount; i < target; i++) {
      items.push(newItem(itemId, catalogEntry.type));
    }
  }
}
