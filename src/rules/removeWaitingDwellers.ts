import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";

/** Stable identity for a waiting-line entry, used as the checklist key. */
export function waitingDwellerKey(entry: {
  charType: string;
  dwellerId?: number;
  serializeId?: number;
}): string {
  const id = entry.charType === "Dweller" ? entry.dwellerId : entry.serializeId;
  return `${entry.charType}:${id}`;
}

/**
 * Removes selected entries from the arrival queue. Deliberately independent
 * of setMaxDwellers/maxDwellerCount — those cap the *assigned* population;
 * this targets specific waiting entries regardless of that cap.
 *
 * Waiting entries already have a full record elsewhere in the save even
 * though they aren't assigned to a room:
 *   - charType "Dweller" -> record lives in data.dwellers.dwellers
 *   - anything else      -> record lives in data.dwellers.actors
 */
export function removeWaitingDwellers(
  data: SaveData,
  config: EditorConfig,
): void {
  if (!config.removeWaitingDwellers) return;
  const waiting = data.dwellerSpawner?.dwellersWaiting;
  if (!waiting?.length) return;

  const targetKeys = new Set(config.removeWaitingDwellerIds);
  const remaining = [];

  for (const entry of waiting) {
    const key = waitingDwellerKey(entry);
    if (!targetKeys.has(key)) {
      remaining.push(entry);
      continue;
    }

    if (entry.charType === "Dweller") {
      const idx = data.dwellers.dwellers.findIndex(
        (d) => d.serializeId === entry.dwellerId,
      );
      if (idx !== -1) {
        const [removed] = data.dwellers.dwellers.splice(idx, 1);
        scrubDwellerRelations(data, removed.serializeId);
      }
    } else {
      const idx = data.dwellers.actors.findIndex(
        (a) => a.serializeId === entry.serializeId,
      );
      if (idx !== -1) data.dwellers.actors.splice(idx, 1);
    }
    // not pushed to `remaining` -> dropped from the queue
  }

  data.dwellerSpawner.dwellersWaiting = remaining;
}

function scrubDwellerRelations(data: SaveData, removedId: number): void {
  for (const d of data.dwellers.dwellers) {
    const rel = d.relations;
    if (!rel) continue;
    if (rel.partner === removedId) rel.partner = -1;
    if (rel.lastPartner === removedId) rel.lastPartner = -1;
    rel.ascendants = rel.ascendants.map((a) => (a === removedId ? -1 : a));
    rel.relations = rel.relations.filter((r) =>
      typeof r === "object" ? r.serializeId !== removedId : r !== removedId,
    );
  }
}
