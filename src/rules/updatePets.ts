import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";
import { PETS } from "../data/pets";

/**
 * Tops up vault pets to their target counts. Each pushed pet is a deep
 * clone of the catalog entry — pushing the same object reference multiple
 * times (the original vanilla-JS bug) would make every "copy" alias the
 * same object, so mutating one later mutates all of them.
 */
export function updatePets(data: SaveData, config: EditorConfig): void {
  if (!config.givePets) return;

  for (const [bonus, target] of Object.entries(config.givePetCounts)) {
    if (target <= 0) continue;
    const catalogEntry = PETS[bonus];
    if (!catalogEntry) continue;

    const currentCount = data.vault.inventory.items.filter(
      (item) => item.type === "Pet" && item.id === catalogEntry.id,
    ).length;

    for (let i = currentCount; i < target; i++) {
      data.vault.inventory.items.push(structuredClone(catalogEntry));
    }
  }
}
