import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";
import { Gender } from "../data/gameConstants";

/**
 * Marks up to `pregnantCount` currently-not-pregnant female dwellers as
 * pregnant. Distinct from `setBabyReady` below (impregnating vs. delivering
 * are different actions a player would want independently).
 */
export function setPregnantDwellers(
  data: SaveData,
  config: EditorConfig,
): void {
  if (!config.setPregnantCount) return;

  const candidates = data.dwellers.dwellers.filter(
    (d) => d.gender === Gender.FEMALE && !d.pregnant,
  );

  for (const dweller of candidates.slice(0, config.pregnantCount)) {
    dweller.pregnant = true;
  }
}

/** Marks every currently-pregnant dweller as ready to deliver. */
export function setBabyReady(data: SaveData, config: EditorConfig): void {
  if (!config.setAllPregnanciesReady) return;

  for (const dweller of data.dwellers.dwellers) {
    if (dweller.pregnant) dweller.babyReady = true;
  }
}
