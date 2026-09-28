import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";

/**
 * Sets each selected junk item's count to exactly the target — unlike the
 * outfit/weapon/pet rules (which only ever add, never remove), this one
 * matches the original saveEditor.js's updateJunk behavior of dropping
 * existing copies before re-adding, so it can also reduce a count.
 */
export function updateJunk(data: SaveData, config: EditorConfig): void {
  if (!config.giveJunk) return;

  for (const [junkId, target] of Object.entries(config.giveJunkCounts)) {
    const currentCount = data.vault.inventory.items.filter(
      (i) => i.type === "Junk" && i.id === junkId,
    ).length;
    if (currentCount === target) continue;

    data.vault.inventory.items = data.vault.inventory.items.filter(
      (i) => !(i.type === "Junk" && i.id === junkId),
    );
    for (let i = 0; i < target; i++) {
      data.vault.inventory.items.push({
        id: junkId,
        type: "Junk",
        hasBeenAssigned: false,
        hasRandonWeaponBeenAssigned: false,
      });
    }
  }
}
