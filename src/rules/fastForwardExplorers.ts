import type { EditorConfig } from "../types/config";
import type { SaveData } from "../types/save";

/**
 * Advances every exploring/returning team's trip by a configurable amount,
 * rather than the old hard-coded "jump to 25 seconds from completion" hack
 * from the vanilla-JS version. That version also had a latent bug: it read
 * `returnTripDuration`/`elapsedReturningTime` off each entry in
 * `team.dwellers`, but those entries are plain dweller-ID numbers, not
 * objects — so the property reads were always `undefined` and the feature
 * silently did nothing. Those fields actually live on the team itself.
 * Clamped so a trip can't be pushed past its own duration (which would
 * leave elapsedReturningTime > returnTripDuration, a state the game
 * doesn't expect).
 */
export function fastForwardExplorerReturn(
  data: SaveData,
  config: EditorConfig,
): void {
  if (!config.fastForwardExplorerReturn) return;
  const teams = data.vault.wasteland?.teams;
  if (!teams?.length) return;

  const fastForwardSeconds = config.fastForwardExplorerReturnByHours * 3600;

  for (const team of teams) {
    if (team.returnTripDuration <= 0) continue;
    team.elapsedReturningTime = Math.min(
      team.returnTripDuration,
      team.elapsedReturningTime + fastForwardSeconds,
    );
  }
}

export function extendExplorationTime(
  data: SaveData,
  config: EditorConfig,
): void {
  if (!config.fastForwardExplorationTime) return;
  const teams = data.vault.wasteland?.teams;
  if (!teams?.length) return;

  const fastForwardSeconds = config.fastForwardExplorationTimeHours * 3600;

  for (const team of teams) {
    team.elapsedTimeAliveExploring += fastForwardSeconds;
  }
}
