import { useMemo, useRef, useState } from "react";
import { DEFAULT_CONFIG, type EditorConfig } from "./types/config";
import type { SaveData, WaitingDwellerEntry } from "./types/save";
import { waitingDwellerKey } from "./rules/removeWaitingDwellers";
import { applyConfig } from "./rules";
import { BooleanField } from "./components/BooleanField";
import { NumberField } from "./components/NumberField";
import { ToggledNumberField } from "./components/ToggledNumberField";
import { ChecklistTable } from "./components/ChecklistTable";
import { ItemPicker } from "./components/ItemPicker";
import { StandaloneTools } from "./components/StandaloneTools";
import {
  BEST_OUTFITS,
  BEST_WEAPONS,
  getOutfitStats,
  getWeaponStats,
  ITEM_CATALOG,
} from "./data/itemCatalog";
import { PETS } from "./data/pets";
import {
  CharacterTypes,
  DEFAULT_HANDY_HEALTH,
  LunchBoxTypes,
} from "./data/gameConstants";
import {
  FileDropZone,
  type FileDropZoneHandle,
} from "./components/FileDropZone";
import {
  decryptFile,
  encryptAndDownload,
  downloadJson,
} from "./crypto/fileEncryptor";
import pkg from "../package.json" with { type: "json" };

type ConfigSetter = <K extends keyof EditorConfig>(
  key: K,
  value: EditorConfig[K],
) => void;

const TABS = [
  "Roster",
  "Exploration",
  "Resources",
  "Inventory",
  "Settings",
] as const;
type Tab = (typeof TABS)[number];

/**
 * Tabs are grouped by what the user is trying to *do*, not by where a
 * field lives in the .sv2 JSON — "Roster" covers both dweller count/
 * waiting-line management AND per-dweller stat edits, which used to be
 * split across separate "dweller" vs "vault" accordion panels in the
 * original app even though they're the same task from a user's
 * perspective.
 *
 * The whole form renders before a file is loaded (so people can see what's
 * editable up front) but is inert — every tab panel is wrapped in a plain
 * HTML <fieldset disabled>, which natively disables every descendant
 * input/select/button without threading a `disabled` prop through each one.
 */
export default function App() {
  const [saveData, setSaveData] = useState<SaveData | null>(null);
  const [config, setConfigState] = useState<EditorConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<Tab>("Roster");
  const fileInputRef = useRef<FileDropZoneHandle>(null);
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [maxDwellerMaxHealth, setMaxDwellerMaxHealth] = useState(0);
  const [minDwellerMaxHealth, setMinDwellerMaxHealth] = useState(0);

  const [maxHandyHealth, setMaxHandyHealth] = useState(0);
  const [minHandyHealth, setMinHandyHealth] = useState(0);

  const [minDwellerHappiness, setMinDwellerHappiness] = useState(0);
  const [maxDwellerHappiness, setMaxDwellerHappiness] = useState(0);

  const [maxDwellerRadiation, setMaxDwellerRadiation] = useState(0);
  const [minDwellerRadiation, setMinDwellerRadiation] = useState(0);

  const [pregnantDwellers, setPregnantDwellers] = useState(0);
  const [exploringDwellers, setExploringDwellers] = useState(0);
  const [questingDwellers, setQuestingDwellers] = useState(0);

  // A single typed setter, rather than spreading `config` by hand at every
  // call site.
  const set: ConfigSetter = (key, value) =>
    setConfigState((prev) => ({ ...prev, [key]: value }));

  const waitingDwellers: WaitingDwellerEntry[] =
    saveData?.dwellerSpawner.dwellersWaiting ?? [];

  const countBoxType = (data: SaveData | null, type: LunchBoxTypes): number =>
    data?.vault.LunchBoxesByType.filter((d) => d === type).length ?? 0;

  async function handleFile(file: File | null) {
    if (!file) {
      setSaveData(null);
      return;
    }

    setStatus("Decrypting...");
    try {
      const data = await decryptFile(file);
      setSaveData(data);
      setOriginalFileName(file.name);

      const resources = data.vault.storage?.resources ?? {};
      const minDwellerMaxHealth = Math.min(
        ...(data.dwellers.dwellers.map((d) => d.health.maxHealth) ?? 0),
      );
      const maxDwellerMaxHealth = Math.min(
        ...(data.dwellers.dwellers.map((d) => d.health.maxHealth) ?? 0),
      );
      const minDwellerRadLevel = Math.max(
        ...(data.dwellers.dwellers.map((d) => d.health.radiationValue) ?? 0),
      );
      const maxDwellerRadLevel = Math.max(
        ...(data.dwellers.dwellers.map((d) => d.health.radiationValue) ?? 0),
      );
      const minDwellerHappiness = Math.min(
        ...(data.dwellers.dwellers.map((d) => d.happiness.happinessValue) ?? 0),
      );
      const maxDwellerHappiness = Math.max(
        ...(data.dwellers.dwellers.map((d) => d.happiness.happinessValue) ?? 0),
      );
      const minMrHandyHealth = Math.min(
        ...(data.dwellers.actors
          .filter((a) => a.characterType === CharacterTypes.HANDY)
          .map((d) => d.health) ?? 0),
      );
      const maxMrHandyHealth = Math.min(
        ...(data.dwellers.actors
          .filter((a) => a.characterType === CharacterTypes.HANDY)
          .map((d) => d.health) ?? 0),
      );

      // Every default below is read straight from the loaded save, so the
      // form starts in a "does nothing yet" state that matches reality,
      // rather than requiring the user to re-enter current values first.
      const newConfig: EditorConfig = {
        ...DEFAULT_CONFIG,
        maxDwellerCount: data.dwellers.dwellers.length,
        maxDwellerMaxHealth: minDwellerMaxHealth, // set to lowest
        dwellerRadLevel: maxDwellerRadLevel, // set to highest
        dwellerHappiness: minDwellerHappiness, // set to lowest
        maxMrHandyHealth: minMrHandyHealth, // set to lowest
        capsCount: resources.Nuka ?? 0,
        stimpackCount: resources.StimPack ?? 0,
        radawayCount: resources.RadAway ?? 0,
        foodCount: resources.Food ?? 0,
        energyCount: resources.Energy ?? 0,
        waterCount: resources.Water ?? 0,
        nukaColaCount: resources.NukaColaQuantum ?? 0,
        pokerChipCount: resources.PokerChip ?? 0,
        ultraciteCount: resources.DummyUltracite ?? 0,
        lunchboxCount: countBoxType(data, LunchBoxTypes.LUNCH),
        mrHandyBoxCount: countBoxType(data, LunchBoxTypes.HANDY),
        petCrateCount: countBoxType(data, LunchBoxTypes.PET),
        lootCrateCount: countBoxType(data, LunchBoxTypes.LOOT),
        pregnantCount: data.dwellers.dwellers.map((d) => d.pregnant == true)
          .length,
      };

      setPregnantDwellers(newConfig.pregnantCount);

      setMaxDwellerHappiness(maxDwellerHappiness);
      setMaxDwellerRadiation(maxDwellerRadLevel);
      setMaxDwellerMaxHealth(maxDwellerMaxHealth);
      setMaxHandyHealth(maxMrHandyHealth);

      setMinDwellerHappiness(minDwellerHappiness);
      setMinDwellerRadiation(minDwellerRadLevel);
      setMinDwellerMaxHealth(minDwellerMaxHealth);
      setMinHandyHealth(minMrHandyHealth);

      const explorers =
        data.vault.wasteland?.teams.reduce(
          (prev, curr) => prev + curr.dwellers.length,
          0,
        ) ?? 0;
      setExploringDwellers(explorers);
      setQuestingDwellers(
        data.questDataManager?.questDone != false
          ? 0
          : data.questDataManager?.questTeam.DwellersDictionary.length,
      );

      setConfigState(newConfig);
      setStatus(`Loaded ${data.dwellers.dwellers.length} dwellers.`);
    } catch (err) {
      setStatus(`Failed to load file: ${(err as Error).message}`);
    }
  }

  async function handleApplyAndDownload() {
    if (!saveData) return;
    setStatus("Applying changes...");
    try {
      const next = applyConfig(structuredClone(saveData), config);
      await encryptAndDownload(next, originalFileName);
      setStatus("Downloaded. Load another file to keep editing.");
      fileInputRef.current?.reset();
      setSaveData(null);
    } catch (err) {
      setStatus(`Failed to apply changes: ${(err as Error).message}`);
    }
  }

  function handleExportLoadedJson() {
    if (!saveData) return;
    downloadJson(saveData, originalFileName.replace(/\.(sav|sv2)$/i, ".json"));
  }

  function handleExportEditedJson() {
    if (!saveData) return;
    const next = applyConfig(structuredClone(saveData), config);
    downloadJson(
      next,
      originalFileName.replace(/\.(sav|sv2)$/i, "-edited.json"),
    );
  }

  const dwellerCountLabel = useMemo(
    () =>
      saveData
        ? `${saveData.dwellers.dwellers.length} total dwellers`
        : "Load a save file to begin.",
    [saveData],
  );

  const petCatalogEntries = useMemo(
    () =>
      Object.entries(PETS).sort(([, a], [, b]) =>
        a.extraData.bonus.localeCompare(b.extraData.bonus),
      ),
    [],
  );

  const currentJunkCount = (id: string) =>
    saveData?.vault.inventory.items.filter(
      (i) => i.type === "Junk" && i.id === id,
    ).length ?? 0;
  const currentInventoryCount = (id: string) =>
    saveData?.vault.inventory.items.filter(
      (i) => (i.type === "Outfit" || i.type === "Weapon") && i.id === id,
    ).length ?? 0;

  return (
    <main className="app">
      <h1>
        Fallout Shelter Save Editor <small>v{pkg.version}</small>
      </h1>
      <div className="load-file-area">
        <div className="load-file-selector">
          <FileDropZone
            ref={fileInputRef}
            label="Load save file (.sv2):"
            accept=".sv2"
            onFileSelected={handleFile}
          />
          {saveData && (
            <button
              type="button"
              className="link-button"
              onClick={handleExportLoadedJson}
            >
              Export to JSON
            </button>
          )}
        </div>
        {status && <p className="status-line">{status}</p>}
      </div>

      <StandaloneTools />

      <nav className="tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === activeTab ? "tab tab--active" : "tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <fieldset disabled={!saveData} className="tab-fieldset">
        {activeTab === "Roster" && (
          <div className="tab-panel">
            <section>
              <h2>Roster size</h2>
              <p className="section-note">{dwellerCountLabel}</p>

              <ToggledNumberField
                label="Cap total dweller count"
                checked={config.setMaxDwellers}
                onCheckedChange={(v) => set("setMaxDwellers", v)}
                value={config.maxDwellerCount}
                onValueChange={(v) => set("maxDwellerCount", v)}
                min={0}
              />

              <BooleanField
                label="Remove specific waiting-line entries"
                checked={config.removeWaitingDwellers}
                onChange={(v) => set("removeWaitingDwellers", v)}
              />
              <ChecklistTable
                mode="check"
                items={waitingDwellers}
                getKey={waitingDwellerKey}
                disabled={!config.removeWaitingDwellers}
                selected={config.removeWaitingDwellerIds}
                onChange={(selected) =>
                  set("removeWaitingDwellerIds", selected)
                }
                emptyMessage="No dwellers currently waiting."
                columns={[
                  {
                    header: "Name",
                    render: (entry) =>
                      entry.charType === "Dweller" && saveData
                        ? nameForWaitingDweller(saveData, entry)
                        : `${entry.charType} #${entry.serializeId}`,
                  },
                  { header: "Type", render: (entry) => entry.charType },
                ]}
              />

              <BooleanField
                label="Remove idle Mr. Handies (waiting or exploring)"
                checked={config.removeIdleHandies}
                onChange={(v) => set("removeIdleHandies", v)}
              />
            </section>

            <section>
              <h2>Roster-wide edits</h2>
              <p className="section-note">
                Applied to every dweller currently in the vault.
              </p>

              <BooleanField
                label="Rename all dwellers to their ID"
                checked={config.renameDwellers}
                onChange={(v) => set("renameDwellers", v)}
              />
              <BooleanField
                label="Heal all dwellers"
                checked={config.healDwellers}
                onChange={(v) => set("healDwellers", v)}
              />
              <ToggledNumberField
                label={`Heal all dwellers and set max health (current min: ${minDwellerMaxHealth}, max: ${maxDwellerMaxHealth})`}
                checked={config.setMaxDwellerHealth}
                onCheckedChange={(v) => set("setMaxDwellerHealth", v)}
                value={config.maxDwellerMaxHealth}
                onValueChange={(v) => set("maxDwellerMaxHealth", v)}
                min={1}
                max={9999}
              />
              <ToggledNumberField
                label={`Set radiation level (current min: ${minDwellerRadiation}, max: ${maxDwellerRadiation})`}
                checked={config.setDwellerRad}
                onCheckedChange={(v) => set("setDwellerRad", v)}
                value={config.dwellerRadLevel}
                onValueChange={(v) => set("dwellerRadLevel", v)}
                min={0}
                max={100}
              />
              <ToggledNumberField
                label={`Set happiness (current min: ${minDwellerHappiness}, max: ${maxDwellerHappiness})`}
                checked={config.setDwellerHappiness}
                onCheckedChange={(v) => set("setDwellerHappiness", v)}
                value={config.dwellerHappiness}
                onValueChange={(v) => set("dwellerHappiness", v)}
                min={0}
                max={100}
              />
              <BooleanField
                label="Max out level (50)"
                checked={config.setDwellerLvl}
                onChange={(v) => set("setDwellerLvl", v)}
              />
              <BooleanField
                label="Max out all SPECIAL stats"
                checked={config.setMaxStats}
                onChange={(v) => set("setMaxStats", v)}
              />
              <BooleanField
                label={`Equip best weapon`}
                checked={config.equipMaxWeapon}
                onChange={(v) => set("equipMaxWeapon", v)}
                help={
                  <ul style={{ marginLeft: "15px", marginTop: 0 }}>
                    <li>
                      Exploration: {BEST_WEAPONS.Explore.name}&nbsp;
                      {getWeaponStats(BEST_WEAPONS.Explore)}
                    </li>
                    <li>
                      Quests: {BEST_WEAPONS.Quest.name}&nbsp;
                      {getWeaponStats(BEST_WEAPONS.Quest)}
                    </li>
                    <li>
                      Vault Defense: {BEST_WEAPONS.Defense.name}&nbsp;
                      {getWeaponStats(BEST_WEAPONS.Defense)}
                    </li>
                  </ul>
                }
              />
              <BooleanField
                label="Equip best outfit for room/wasteland"
                checked={config.equipBestArmor}
                onChange={(v) => set("equipBestArmor", v)}
                help={
                  <ul style={{ marginLeft: "15px", marginTop: 0 }}>
                    <li>
                      STR: {BEST_OUTFITS.str.name}&nbsp;
                      {getOutfitStats(BEST_OUTFITS.str)}
                    </li>
                    <li>
                      PER: {BEST_OUTFITS.per.name}&nbsp;
                      {getOutfitStats(BEST_OUTFITS.per)}
                    </li>
                    <li>
                      END: {BEST_OUTFITS.end.name}&nbsp;
                      {getOutfitStats(BEST_OUTFITS.end)}
                    </li>
                    <li>
                      CHA: {BEST_OUTFITS.cha.name}&nbsp;
                      {getOutfitStats(BEST_OUTFITS.cha)}
                    </li>
                    <li>
                      INT: {BEST_OUTFITS.int.name}&nbsp;
                      {getOutfitStats(BEST_OUTFITS.int)}
                    </li>
                    <li>
                      AGI: {BEST_OUTFITS.agi.name}&nbsp;
                      {getOutfitStats(BEST_OUTFITS.agi)}
                    </li>
                    <li>
                      LUK: {BEST_OUTFITS.luk.name}&nbsp;
                      {getOutfitStats(BEST_OUTFITS.luk)}
                    </li>
                    <li>
                      Explore: {BEST_OUTFITS.explore.name}&nbsp;
                      {getOutfitStats(BEST_OUTFITS.explore)}
                    </li>
                  </ul>
                }
              />
            </section>

            <section>
              <h2>Family</h2>
              <p className="section-note">
                Pregnant dwellers: {pregnantDwellers}
              </p>
              <ToggledNumberField
                label="Make this many female dwellers pregnant"
                checked={config.setPregnantCount}
                onCheckedChange={(v) => set("setPregnantCount", v)}
                value={config.pregnantCount}
                onValueChange={(v) => set("pregnantCount", v)}
              />
              <BooleanField
                label="Make all pregnant dwellers ready to deliver"
                checked={config.setAllPregnanciesReady}
                onChange={(v) => set("setAllPregnanciesReady", v)}
              />
              <BooleanField
                label="Abort all pregnancies"
                checked={config.abortPregnancies}
                onChange={(v) => set("abortPregnancies", v)}
              />
            </section>

            <section>
              <h2>Mr. Handy</h2>
              <BooleanField
                label={`Heal all Mr. Handies (sets health to default ${DEFAULT_HANDY_HEALTH})`}
                checked={config.healHandies}
                onChange={(v) => set("healHandies", v)}
              />
              <ToggledNumberField
                label={`Heal all Mr. Handies and set max health (current min: ${minHandyHealth}, max: ${maxHandyHealth})`}
                checked={config.setMaxMrHandyHealth}
                onCheckedChange={(v) => set("setMaxMrHandyHealth", v)}
                value={config.maxMrHandyHealth}
                onValueChange={(v) => set("maxMrHandyHealth", v)}
                min={1}
                max={9999}
              />
            </section>
          </div>
        )}

        {activeTab === "Exploration" && (
          <div className="tab-panel">
            <section>
              <h2>Summary</h2>
              <p className="section-note">
                <div>Exploring dwellers: {exploringDwellers}</div>
                <div>Questing dwellers: {questingDwellers}</div>
              </p>
            </section>
            <section>
              <h2>Trip Time</h2>
              <ToggledNumberField
                label="Extend every team's trip by"
                checked={config.fastForwardExplorationTime}
                onCheckedChange={(v) => set("fastForwardExplorationTime", v)}
                value={config.fastForwardExplorationTimeHours}
                onValueChange={(v) => set("fastForwardExplorationTimeHours", v)}
                suffix="hours"
              />
              <ToggledNumberField
                label="Advance every team's return trip by"
                checked={config.fastForwardExplorerReturn}
                onCheckedChange={(v) => set("fastForwardExplorerReturn", v)}
                value={config.fastForwardExplorerReturnByHours}
                onValueChange={(v) =>
                  set("fastForwardExplorerReturnByHours", v)
                }
                suffix="hours"
              />
            </section>

            <section>
              <h2>Supplies</h2>
              <BooleanField
                label="Fill exploring dweller StimPacks & RadAways"
                checked={config.giveExplorersHealthPacks}
                onChange={(v) => set("giveExplorersHealthPacks", v)}
              />

              <ToggledNumberField
                label="Give exploring dwellers caps"
                checked={config.giveExplorerCaps}
                onCheckedChange={(v) => set("giveExplorerCaps", v)}
                value={config.giveExplorerCapsCount}
                onValueChange={(v) => set("giveExplorerCapsCount", v)}
              />

              <BooleanField
                label="Give exploring dweller specific items"
                checked={config.giveExplorerItems}
                onChange={(v) => set("giveExplorerItems", v)}
              />
              <ItemPicker
                catalog={ITEM_CATALOG}
                disabled={!config.giveExplorerItems}
                value={config.giveExplorerItemCounts}
                onChange={(counts) => set("giveExplorerItemCounts", counts)}
              />
            </section>
          </div>
        )}

        {activeTab === "Resources" && (
          <div className="tab-panel">
            <section>
              <h2>Vault resources</h2>
              <ToggledNumberField
                label="Caps"
                checked={config.setCapsCount}
                onCheckedChange={(v) => set("setCapsCount", v)}
                value={config.capsCount}
                onValueChange={(v) => set("capsCount", v)}
              />
              <ToggledNumberField
                label="Food"
                checked={config.setFoodCount}
                onCheckedChange={(v) => set("setFoodCount", v)}
                value={config.foodCount}
                onValueChange={(v) => set("foodCount", v)}
              />
              <ToggledNumberField
                label="Water"
                checked={config.setWaterCount}
                onCheckedChange={(v) => set("setWaterCount", v)}
                value={config.waterCount}
                onValueChange={(v) => set("waterCount", v)}
              />
              <ToggledNumberField
                label="Energy"
                checked={config.setEnergyCount}
                onCheckedChange={(v) => set("setEnergyCount", v)}
                value={config.energyCount}
                onValueChange={(v) => set("energyCount", v)}
              />
              <ToggledNumberField
                label="Nuka-Cola Quantum"
                checked={config.setNukaColaCount}
                onCheckedChange={(v) => set("setNukaColaCount", v)}
                value={config.nukaColaCount}
                onValueChange={(v) => set("nukaColaCount", v)}
              />
              <ToggledNumberField
                label="Stimpacks"
                checked={config.setStimpackCount}
                onCheckedChange={(v) => set("setStimpackCount", v)}
                value={config.stimpackCount}
                onValueChange={(v) => set("stimpackCount", v)}
              />
              <ToggledNumberField
                label="RadAway"
                checked={config.setRadawayCount}
                onCheckedChange={(v) => set("setRadawayCount", v)}
                value={config.radawayCount}
                onValueChange={(v) => set("radawayCount", v)}
              />
              <ToggledNumberField
                label="Poker chips"
                checked={config.setPokerChipCount}
                onCheckedChange={(v) => set("setPokerChipCount", v)}
                value={config.pokerChipCount}
                onValueChange={(v) => set("pokerChipCount", v)}
              />
              <ToggledNumberField
                label="Ultracite"
                checked={config.setUltraciteCount}
                onCheckedChange={(v) => set("setUltraciteCount", v)}
                value={config.ultraciteCount}
                onValueChange={(v) => set("ultraciteCount", v)}
              />
            </section>

            <section>
              <h2>Boxes &amp; crates</h2>
              <BooleanField
                label="Set exact box/crate counts (replaces the current queue)"
                checked={config.setBoxCounts}
                onChange={(v) => set("setBoxCounts", v)}
              />
              <NumberField
                label={`Lunchboxes (have: ${countBoxType(saveData, LunchBoxTypes.LUNCH)})`}
                disabled={!config.setBoxCounts}
                value={config.lunchboxCount}
                onChange={(v) => set("lunchboxCount", v)}
              />
              <NumberField
                label={`Mr. Handy boxes (have: ${countBoxType(saveData, LunchBoxTypes.HANDY)})`}
                disabled={!config.setBoxCounts}
                value={config.mrHandyBoxCount}
                onChange={(v) => set("mrHandyBoxCount", v)}
              />
              <NumberField
                label={`Pet carriers (have: ${countBoxType(saveData, LunchBoxTypes.PET)})`}
                disabled={!config.setBoxCounts}
                value={config.petCrateCount}
                onChange={(v) => set("petCrateCount", v)}
              />
              <NumberField
                label={`Loot crates (have: ${countBoxType(saveData, LunchBoxTypes.LOOT)})`}
                disabled={!config.setBoxCounts}
                value={config.lootCrateCount}
                onChange={(v) => set("lootCrateCount", v)}
              />
            </section>
          </div>
        )}

        {activeTab === "Inventory" && (
          <div className="tab-panel">
            <section>
              <h2>Outfits &amp; weapons</h2>
              <BooleanField
                label="Add one of each quest-reward outfit/weapon, if missing"
                checked={config.giveQuestItems}
                onChange={(v) => set("giveQuestItems", v)}
              />
              <BooleanField
                label="Give specific outfits/weapons"
                checked={config.giveInventory}
                onChange={(v) => set("giveInventory", v)}
              />
              <ItemPicker
                catalog={ITEM_CATALOG.filter((i) => i.type !== "Junk")}
                disabled={!config.giveInventory}
                value={config.giveInventoryCounts}
                onChange={(counts) => set("giveInventoryCounts", counts)}
                getCurrentCount={currentInventoryCount}
              />
            </section>

            <section>
              <h2>Junk</h2>
              <BooleanField
                label="Give specific junk items"
                checked={config.giveJunk}
                onChange={(v) => set("giveJunk", v)}
              />
              <ItemPicker
                catalog={ITEM_CATALOG.filter((i) => i.type === "Junk")}
                disabled={!config.giveJunk}
                value={config.giveJunkCounts}
                onChange={(counts) => set("giveJunkCounts", counts)}
                getCurrentCount={currentJunkCount}
              />
            </section>

            <section>
              <h2>Pets</h2>
              <BooleanField
                label="Give specific pets"
                checked={config.givePets}
                onChange={(v) => set("givePets", v)}
              />
              <ChecklistTable
                mode="count"
                items={petCatalogEntries}
                getKey={([key]) => key}
                disabled={!config.givePets}
                counts={config.givePetCounts}
                onChange={(counts) => set("givePetCounts", counts)}
                columns={[
                  {
                    header: "Bonus",
                    render: ([, pet]) =>
                      `${pet.extraData.bonus} (${pet.extraData.bonusValue})`,
                  },
                  {
                    header: "Pet",
                    render: ([bonus, pet]) => {
                      const currentTypeCount = saveData
                        ? saveData.vault.inventory.items.filter(
                            (item) =>
                              item.type === "Pet" &&
                              item.extraData?.bonus === bonus,
                          ).length
                        : 0;

                      return `${pet.extraData.uniqueName} (have: ${currentTypeCount} of bonus type)`;
                    },
                  },
                ]}
              />
            </section>
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="tab-panel">
            <section>
              <h2>Game settings</h2>
              <BooleanField
                label="Simplify all active daily objectives to 'produce 5 food'"
                checked={config.setSimpleObjectives}
                onChange={(v) => set("setSimpleObjectives", v)}
              />
              <ToggledNumberField
                label="Set deathclaw event chance"
                checked={config.setDeathClawChance}
                onCheckedChange={(v) => set("setDeathClawChance", v)}
                value={config.deathClawChance}
                onValueChange={(v) => set("deathClawChance", v)}
              />
              <BooleanField
                label="Unlock every weapon/outfit/pet/breed/recipe"
                checked={config.discoverItems}
                onChange={(v) => set("discoverItems", v)}
              />
            </section>
          </div>
        )}

        <div className="apply-row">
          <button
            type="button"
            className="apply-button"
            onClick={handleApplyAndDownload}
            disabled={saveData == null}
          >
            Apply &amp; Download .sv2
          </button>
          <button
            type="button"
            className="link-button"
            onClick={handleExportEditedJson}
            disabled={saveData == null}
          >
            Export edited save as JSON
          </button>
        </div>
      </fieldset>
    </main>
  );
}

function nameForWaitingDweller(
  data: SaveData,
  entry: WaitingDwellerEntry,
): string {
  const record = data.dwellers.dwellers.find(
    (d) => d.serializeId === entry.dwellerId,
  );
  const full = [record?.name, record?.lastName].filter(Boolean).join(" ");
  return full || `Dweller #${entry.dwellerId}`;
}
