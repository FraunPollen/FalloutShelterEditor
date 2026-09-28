import { CharacterTypes } from "../data/gameConstants";
import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";

/**
 * Removes every Mr. Handy actor not assigned to a room (waiting in line or
 * out exploring), leaving everything else untouched. The original
 * vanilla-JS version of this (`setRemoveWaitingHandies`) had an inverted
 * filter that kept *only* assigned handies and discarded everything else
 * in `dwellers.actors` — including every pet — regardless of type. Fixed
 * here to filter out exactly the intended set.
 */
export function removeIdleHandies(data: SaveData, config: EditorConfig): void {
  if (!config.removeIdleHandies) return;

  data.dwellers.actors = data.dwellers.actors.filter(
    (actor) =>
      !(actor.characterType === CharacterTypes.HANDY && actor.savedRoom <= -1),
  );
}
