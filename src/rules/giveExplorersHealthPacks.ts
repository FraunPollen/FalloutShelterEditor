import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";

/**
 * Fills each currently-exploring team's carried supplies, and each of
 * their dwellers' personal supplies (when populated — vault-assigned
 * dwellers don't have `equipment.storage`), to 25 StimPack/RadAway.
 */
export function giveExplorersHealthPacks(
  data: SaveData,
  config: EditorConfig,
): void {
  if (!config.giveExplorersHealthPacks) return;
  const teams = data.vault.wasteland?.teams;
  if (!teams?.length) return;

  for (const team of teams) {
    if (team.dwellers.length === 0) continue;

    team.teamEquipment.storage.resources.StimPack = 25;
    team.teamEquipment.storage.resources.RadAway = 25;

    for (const dwellerId of team.dwellers) {
      const dweller = data.dwellers.dwellers.find(
        (d) => d.serializeId === dwellerId,
      );
      const storage = dweller?.equipment?.storage;
      if (storage?.resources) {
        storage.resources.StimPack = 25;
        storage.resources.RadAway = 25;
      }
    }
  }
}

export function giveExplorersCaps(data: SaveData, config: EditorConfig): void {
  if (!config.giveExplorersHealthPacks) return;
  const teams = data.vault.wasteland?.teams;
  if (!teams?.length) return;

  for (const team of teams) {
    if (team.dwellers.length === 0) continue;

    team.teamEquipment.storage.resources.Nuka += config.giveExplorerCapsCount;

    for (const dwellerId of team.dwellers) {
      const dweller = data.dwellers.dwellers.find(
        (d) => d.serializeId === dwellerId,
      );
      const storage = dweller?.equipment?.storage;
      if (storage?.resources) {
        storage.resources.Nuka += config.giveExplorerCapsCount;
      }
    }
  }
}
