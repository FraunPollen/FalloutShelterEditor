/**
 * Main controller for Fallout Shelter Save Editor
 * Handles UI interactions and orchestrates the editing process
 */
class FalloutSaveEditorApp {
  NUMBER_FIELDS = [
    "capsCount",
    "deathClawChance",
    "dwellerHappiness",
    "dwellerRadLevel",
    "energyCount",
    "foodCount",
    "inventoryCount",
    "lootCrateCount",
    "maxDwellerCount",
    "maxDwellerHealth",
    "maxMrHandyHealth",
    "mrHandyBoxCount",
    "nukaColaCount",
    "petCrateCount",
    "radawayCount",
    "stimpackCount",
    "waterCount",
    "lunchboxCount",
    "pokerChipCount",
    "ultraciteCount",
  ];

  BOOLEAN_FIELDS = [
    "abortPregnancies",
    "discoverItems",
    "equipBestArmor",
    "equipMaxWeapon",
    "giveExplorersHealthPacks",
    "giveInventory",
    "givePets",
    "giveJunk",
    "renameDwellers",
    "setCapsCount",
    "setDeathClawChance",
    "setDwellerHappiness",
    "setDwellerLvl",
    "setDwellerRad",
    "setEnergyCount",
    "setFoodCount",
    "setIncreaseExploreTime",
    "setLootCrateCount",
    "setMaxDwellerHealth",
    "setMaxDwellers",
    "setMaxMrHandyHealth",
    "setMaxStats",
    "setMrHandyBoxCount",
    "setNukaColaCount",
    "setPetCrateCount",
    "setRadawayCount",
    "setRemoveBoxes",
    "setReturnDwellers",
    "setSimpleObjectives",
    "setStimpackCount",
    "setWaterCount",
    "setRemoveWaitingHandies",
    "giveQuestItems",
    "setPokerChipCount",
    "setUltraciteCount",
    "setJunkCount",
  ];

  constructor() {
    this.config = {
      giveInventoryOutfitIds: [
        SaveEditor.POWER_ARMORS.str,
        SaveEditor.POWER_ARMORS.per,
        SaveEditor.POWER_ARMORS.end,
        SaveEditor.POWER_ARMORS.mix1,
        SaveEditor.POWER_ARMORS.mix2,
        SaveEditor.BEST_OUTFITS.str,
        SaveEditor.BEST_OUTFITS.per,
        SaveEditor.BEST_OUTFITS.end,
        SaveEditor.BEST_OUTFITS.cha,
        SaveEditor.BEST_OUTFITS.int,
        SaveEditor.BEST_OUTFITS.agi,
        SaveEditor.BEST_OUTFITS.luk,
      ],
      giveInventoryWeaponIds: [
        SaveEditor.BEST_WEAPON_DEF,
        ...SaveEditor.WEAPONS,
      ],
      // Per-item target counts; keyed by item ID. Populated by updatePlaceholders().
      giveInventoryCounts: {},
      givePetCounts: {},
      giveJunkCounts: {},
    };
    this.currentSaveData = null;
    this.modifiedSaveData = null;
    this.filename = null;

    // Bind methods
    this.handleValidation = this.handleValidation.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleDecryptFile = this.handleDecryptFile.bind(this);
    this.handleEncryptFile = this.handleEncryptFile.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleExportSaveJson = this.handleExportSaveJson.bind(this);
    this.handleExportUpdatedJson = this.handleExportUpdatedJson.bind(this);

    // Initialize form
    this.initializeEventListeners();
    this.setupFormValidation();
  }

  /**
   * Initialize event listeners for all UI elements
   */
  initializeEventListeners() {
    // Validation button
    const validateBtn = document.getElementById("validateBtn");
    if (validateBtn) {
      validateBtn.addEventListener("click", this.handleValidation);
    }

    // Save button
    const fileInput = document.getElementById("saveBtn");
    if (fileInput) {
      fileInput.addEventListener("click", this.handleSave);
    }

    // Main file input for editing
    const fileLoad = document.getElementById("fileLoad");
    if (fileLoad) {
      fileLoad.addEventListener("change", this.handleFileUpload);
    }

    // Advanced decrypt/encrypt inputs
    const decryptInput = document.getElementById("decryptInput");
    if (decryptInput) {
      decryptInput.addEventListener("change", this.handleDecryptFile);
    }

    const encryptInput = document.getElementById("encryptInput");
    if (encryptInput) {
      encryptInput.addEventListener("change", this.handleEncryptFile);
    }

    // Form change listeners to reset validation
    const form = document.getElementById("editorForm");
    if (form) {
      form.addEventListener("change", this.resetValidation.bind(this));
      form.addEventListener("input", this.resetValidation.bind(this));
    }

    // Export uploaded save to JSON button
    const exportSave = document.getElementById("exportSaveBtn");
    if (exportSave) {
      exportSave.addEventListener("click", this.handleExportSaveJson);
    }
    const exportUpdated = document.getElementById("exportUpdatedBtn");
    if (exportUpdated) {
      exportUpdated.addEventListener("click", this.handleExportUpdatedJson);
    }

    // Checkbox dependencies
    this.setupCheckboxDependencies();
  }

  /**
   * Setup checkbox dependencies and enable/disable logic
   */
  setupCheckboxDependencies() {
    const dependencies = [
      {
        checkbox: "setMaxDwellers",
        targets: ["maxDwellerCount"],
      },
      {
        checkbox: "setMaxDwellerHealth",
        targets: ["maxDwellerHealth"],
      },
      {
        checkbox: "setMaxMrHandyHealth",
        targets: ["maxMrHandyHealth"],
      },
      {
        checkbox: "setDwellerRad",
        targets: ["dwellerRadLevel"],
      },
      {
        checkbox: "setDwellerHappiness",
        targets: ["dwellerHappiness"],
      },
      {
        checkbox: "setEnergyCount",
        targets: ["energyCount"],
      },
      {
        checkbox: "setFoodCount",
        targets: ["foodCount"],
      },
      {
        checkbox: "setWaterCount",
        targets: ["waterCount"],
      },
      {
        checkbox: "setCapsCount",
        targets: ["capsCount"],
      },
      {
        checkbox: "setNukaColaCount",
        targets: ["nukaColaCount"],
      },
      {
        checkbox: "discoverItems",
        targets: [
          "equipMaxWeapon",
          "equipBestArmor",
          "giveInventory",
          "giveQuestItems",
        ],
      },
      {
        checkbox: "giveInventory",
        targets: [], // per-item inputs are handled separately via _refreshInventoryInputState
      },
      {
        checkbox: "givePets",
        targets: [], // per-item inputs are handled separately via _refreshInventoryInputState
      },
      {
        checkbox: "giveJunk",
        targets: [], // per-item inputs are handled separately via _refreshInventoryInputState
      },
      {
        checkbox: "setRemoveBoxes",
        targets: [
          "lunchboxCount",
          "petCrateCount",
          "mrHandyBoxCount",
          "lootCrateCount",
        ],
      },
      {
        checkbox: "setPokerChipCount",
        targets: ["pokerChipCount"],
      },
      {
        checkbox: "setUltraciteCount",
        targets: ["ultraciteCount"],
      },
    ];

    dependencies.forEach(({ checkbox, targets }) => {
      const checkboxEl = document.getElementById(checkbox);
      if (checkboxEl) {
        checkboxEl.addEventListener("change", () => {
          targets.forEach((targetId) => {
            const target = document.getElementById(targetId);
            if (target) {
              target.checked = !checkboxEl.checked ? false : target.checked;
              target.disabled = !checkboxEl.checked;
            }
          });

          // Special handling: enable/disable all per-item inventory inputs
          if (checkbox === "giveInventory") {
            this._refreshInventoryInputState(checkboxEl.checked);
          }
          if (checkbox === "giveJunk") {
            this._refreshJunkInputState(checkboxEl.checked);
          }
          if (checkbox === "givePets") {
            this._refreshPetsInputState(checkboxEl.checked);
          }

          this.resetValidation();
        });

        // Trigger initial state
        checkboxEl.dispatchEvent(new Event("change"));
      }
    });
  }

  /**
   * Enable or disable all per-item inventory count inputs inside #inventoryList
   * @param {boolean} enabled
   */
  _refreshInventoryInputState(enabled) {
    const listContainer = document.getElementById("inventoryList");
    if (!listContainer) return;
    listContainer.querySelectorAll("input[type='number']").forEach((input) => {
      input.disabled = !enabled;
    });
  }

  /**
   * Enable or disable all per-item junk count inputs inside #junkList
   * @param {boolean} enabled
   */
  _refreshJunkInputState(enabled) {
    const listContainer = document.getElementById("junkList");
    if (!listContainer) return;
    listContainer.querySelectorAll("input[type='number']").forEach((input) => {
      input.disabled = !enabled;
    });
  }

  /**
   * Enable or disable all per-item pet count inputs inside #petList
   * @param {boolean} enabled
   */
  _refreshPetsInputState(enabled) {
    const listContainer = document.getElementById("petList");
    if (!listContainer) return;
    listContainer.querySelectorAll("input[type='number']").forEach((input) => {
      input.disabled = !enabled;
    });
  }

  /**
   * Setup form validation
   */
  setupFormValidation() {
    // Initial state
    this.resetValidation();
  }

  /**
   * Reset validation state
   */
  resetValidation() {
    const exportButton = document.getElementById("saveBtn");
    const validationMsg = document.getElementById("validationMsg");
    const exportSave = document.getElementById("exportSaveBtn");
    const exportUpdated = document.getElementById("exportUpdatedBtn");

    if (exportButton) exportButton.disabled = true;
    if (exportSave) exportSave.disabled = true;
    if (exportUpdated) exportUpdated.disabled = true;

    if (validationMsg) {
      validationMsg.textContent = "Validate changes to enable Save";
      validationMsg.className = "validation-message";
    }
  }

  /**
   * Handle validation button click
   */
  handleValidation() {
    try {
      this.config = this.collectFormData();

      const editor = new SaveEditor();
      const validation = editor.validateConfig(this.config);

      const validationMsg = document.getElementById("validationMsg");
      const saveBtn = document.getElementById("saveBtn");

      if (validation.isValid) {
        validationMsg.textContent =
          "Settings validated successfully! You can save your modified file.";
        validationMsg.className = "validation-message success";
        if (saveBtn) saveBtn.disabled = false;
      } else {
        validationMsg.innerHTML = `Validation errors:<br>${validation.errors.join(
          "<br>",
        )}`;
        validationMsg.className = "validation-message error";
        if (saveBtn) saveBtn.disabled = true;
      }
    } catch (error) {
      console.error("Validation error:", error);
      this.showSaveError("Validation failed: " + error.message);
    }
  }

  /**
   * Handle Save button click
   */
  async handleSave() {
    if (!this.currentSaveData) {
      console.error("No save data detected");
      this.showSaveError(
        "Failed to find current save data. Try loading it again",
      );
      return;
    }

    try {
      this.showLoading(true);

      // Apply modifications
      const editor = new SaveEditor();
      this.modifiedSaveData = editor.modifyData(
        this.currentSaveData,
        this.config,
      );
      const exportUpdated = document.getElementById("exportUpdatedBtn");
      if (exportUpdated) {
        exportUpdated.disabled = false;
      }

      // Encrypt and download
      const encryptor = new FileEncryptor();
      await encryptor.encryptObject(this.filename, this.modifiedSaveData);

      this.showSaveSuccess(
        "Save file processed successfully! Download should start automatically.",
      );
    } catch (error) {
      console.error("File processing error:", error);
      this.showSaveError("Failed to process save file: " + error.message);
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Exports current save data to JSON file
   */
  async handleExportSaveJson() {
    if (!this.currentSaveData) {
      console.error("No save data detected");
      this.showLoadError(
        "Failed to find current save data. Try loading it again",
      );
      return;
    }

    try {
      this.showLoading(true);

      // Encrypt and download
      const encryptor = new FileEncryptor();
      encryptor.saveJsonToFile(this.currentSaveData, this.filename);
    } catch (error) {
      console.error("File processing error:", error);
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Exports updated save data to JSON file
   */
  async handleExportUpdatedJson() {
    if (!this.modifiedSaveData) {
      console.error("No updated save data detected");
      this.showSaveError("Failed to find updated save data. Try saving again");
      return;
    }

    try {
      this.showLoading(true);

      // Encrypt and download
      const encryptor = new FileEncryptor();
      encryptor.saveJsonToFile(this.modifiedSaveData, this.filename);
    } catch (error) {
      console.error("File processing error:", error);
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Collect form data into configuration object
   */
  collectFormData() {
    const config = {
      ...this.config,
    };

    // Boolean settings
    this.BOOLEAN_FIELDS.forEach((setting) => {
      const element = document.getElementById(setting);
      if (element) {
        config[setting] = element.checked;
      }
    });

    // Numeric settings
    this.NUMBER_FIELDS.forEach((setting) => {
      const element = document.getElementById(setting);
      if (element && !element.disabled) {
        const value =
          setting === "deathClawChance"
            ? parseFloat(element.value)
            : parseInt(element.value, 10);
        config[setting] = value;
      }
    });

    // Per-item inventory counts — read from dynamically-rendered inputs
    const giveInventoryCounts = {};
    const allItemIds = new Set([
      ...this.config.giveInventoryOutfitIds,
      ...this.config.giveInventoryWeaponIds,
    ]);
    allItemIds.forEach((itemId) => {
      const input = document.getElementById(`inventoryCount_${itemId}`);
      if (input) {
        giveInventoryCounts[itemId] = parseInt(input.value, 10) || 0;
      }
    });
    config.giveInventoryCounts = giveInventoryCounts;

    // Per-item pet counts — read from dynamically-rendered inputs
    const givePetCounts = {};
    const allPetIds = new Set([...Object.keys(SaveEditor.PETS)]);
    allPetIds.forEach((petBonus) => {
      const input = document.getElementById(`petCount_${petBonus}`);
      if (input) {
        givePetCounts[petBonus] = parseInt(input.value, 10) || 0;
      }
    });
    config.givePetCounts = givePetCounts;

    // Per-item junk counts — read from dynamically-rendered inputs
    const giveJunkCounts = {};
    const allJunkIds = new Set([...SaveEditor.JUNK_IDS]);
    allJunkIds.forEach((itemId) => {
      const input = document.getElementById(`junkCount_${itemId}`);
      if (input) {
        giveJunkCounts[itemId] = parseInt(input.value, 10) || 0;
      }
    });
    config.giveJunkCounts = giveJunkCounts;

    return config;
  }

  /**
   * Handle main file upload for editing
   */
  async handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.filename = file.name;

    try {
      this.showLoading(true);

      const encryptor = new FileEncryptor();
      this.currentSaveData = await encryptor.decryptToObject(file);

      const editor = new SaveEditor();
      const validation = editor.validateSaveData(this.currentSaveData);
      if (!validation.isValid) {
        console.error("File load errors:", validation.errors);
        this.showLoadError(
          "Failed to load save file: " + validation.errors.join(", "),
        );
      } else {
        this.config = {
          ...this.config,
          ...editor.loadSaveData(this.currentSaveData),
        };

        this.modifiedSaveData = null;

        this.refreshForm();
        this.showLoadSuccess(`Successfully loaded save "${this.filename}"`);
      }
    } catch (error) {
      console.error("File load error:", error);
      this.showLoadError("Failed to load save file: " + error.message);
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Updates form numeric fields based on config values
   */
  refreshForm() {
    // Numerical values from save
    this.NUMBER_FIELDS.forEach((setting) => {
      const element = document.getElementById(setting);
      if (
        element &&
        this.config &&
        Object.keys(this.config).includes(setting)
      ) {
        element.value = this.config[setting];
      }
    });

    // Pending Mr Handy count
    const waitingHandyCountPlaceholder =
      document.getElementById("waitingHandyCount");
    if (waitingHandyCountPlaceholder) {
      const cnt = this.currentSaveData.dwellers.actors.filter(
        (a) =>
          a.characterType == SaveEditor.CHARACTER_TYPES.handy &&
          a.savedRoom == -1,
      ).length;
      waitingHandyCountPlaceholder.textContent = `(current waiting: ${cnt})`;
    }

    // Returning explorers count
    const returningDwellersPlaceholder = document.getElementById(
      "returning-dwellers-placeholder",
    );
    if (returningDwellersPlaceholder) {
      const cnt = this.currentSaveData.vault.wasteland?.teams.reduce(
        (prev, team) => {
          if (team.elapsedReturningTime == 0) {
            return prev;
          }
          return prev + team.dwellers.length;
        },
        0,
      );
      returningDwellersPlaceholder.textContent = `(current returning: ${cnt})`;
    }

    // Exploring dweller count
    const exploringDwellersPlaceholder = document.getElementById(
      "exploring-dwellers-placeholder",
    );
    if (exploringDwellersPlaceholder) {
      const cnt = this.currentSaveData.vault.wasteland?.teams.reduce(
        (prev, team) => prev + team.dwellers.length,
        0,
      );
      exploringDwellersPlaceholder.textContent = ` (current explorers: ${cnt})`;
    }

    // Export to JSON button
    if (this.currentSaveData) {
      const exportSave = document.getElementById("exportSaveBtn");
      if (exportSave) {
        exportSave.disabled = false;
      }
    }
    if (!this.modifiedSaveData) {
      const exportUpdated = document.getElementById("exportUpdatedBtn");
      if (exportUpdated) {
        exportUpdated.disabled = true;
      }
    }

    // Update other placeholders with save data context
    this.updatePlaceholders(this.currentSaveData);
  }

  /**
   * Handle decrypt file (advanced feature)
   */
  async handleDecryptFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      this.showLoading(true);
      const encryptor = new FileEncryptor();
      await encryptor.decrypt(file);
      this.showSaveSuccess("File decrypted successfully!");
    } catch (error) {
      console.error("Decryption error:", error);
      this.showSaveError("Failed to decrypt file: " + error.message);
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Handle encrypt file (advanced feature)
   */
  async handleEncryptFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      this.showLoading(true);

      const encryptor = new FileEncryptor();
      await encryptor.encrypt(file);

      this.showSaveSuccess("File encrypted successfully!");
    } catch (error) {
      console.error("Encryption error:", error);
      this.showSaveError("Failed to encrypt file: " + error.message);
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Show loading state
   */
  showLoading(isLoading) {
    const validateBtn = document.getElementById("validateBtn");
    if (validateBtn) {
      validateBtn.disabled = isLoading;
      if (isLoading) {
        validateBtn.classList.add("loading");
      } else {
        validateBtn.classList.remove("loading");
      }
    }
  }

  /**
   * Show success message
   */
  showSaveSuccess(message) {
    const validationMsg = document.getElementById("validationMsg");
    if (validationMsg) {
      validationMsg.textContent = message;
      validationMsg.className = "validation-message success";
    }
  }

  /**
   * Show error message
   */
  showSaveError(message) {
    const validationMsg = document.getElementById("validationMsg");
    if (validationMsg) {
      validationMsg.textContent = message;
      validationMsg.className = "validation-message error";
    }
  }

  /**
   * Show success message
   */
  showLoadSuccess(message) {
    const msg = document.getElementById("loadMsg");
    if (msg) {
      msg.textContent = message;
      msg.className = "validation-message success";
    }
  }

  /**
   * Show error message
   */
  showLoadError(message) {
    const msg = document.getElementById("loadMsg");
    if (msg) {
      msg.textContent = message;
      msg.className = "validation-message error";
    }
  }

  /**
   * Renders per-item count inputs inside #inventoryList.
   * @param {Object|null} data - Current save data (may be null on initial load)
   */
  updatePlaceholdersInventory(data) {
    // Per-item inventory list with individual count inputs
    const listContainer = document.getElementById("inventoryList");
    if (listContainer && this.config) {
      // Preserve any values the user has already typed before re-rendering
      const existingValues = {};
      listContainer
        .querySelectorAll("input[type='number']")
        .forEach((input) => {
          existingValues[input.dataset.itemId] = input.value;
        });

      listContainer.innerHTML = "";

      const items = new Set([
        ...this.config.giveInventoryOutfitIds,
        ...this.config.giveInventoryWeaponIds,
      ]);

      const giveInventoryEnabled =
        document.getElementById("giveInventory")?.checked ?? false;

      [...items].sort().forEach((itemId) => {
        const currentCount = data
          ? data.vault.inventory.items.filter((item) => item.id === itemId)
              .length
          : null;

        // Determine the starting value for this input:
        //   1. A previously-typed value (preserved across re-renders)
        //   2. The per-item target stored in config.giveInventoryCounts
        //   3. The current in-save count, or 0 as a fallback
        const savedTarget =
          this.config.giveInventoryCounts?.[itemId] ?? currentCount ?? 0;
        const displayValue =
          currentCount != null 
            ? currentCount
            : existingValues[itemId] !== undefined
            ? existingValues[itemId]
            : savedTarget;

        const li = document.createElement("li");
        li.style.cssText =
          "display:flex;align-items:center;gap:8px;margin-bottom:4px;";

        const label = document.createElement("span");
        label.style.cssText = "flex:1;font-size:0.9em;";
        label.textContent =
          currentCount !== null
            ? `${itemId} (current: ${currentCount})`
            : itemId;

        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.step = "1";
        input.className = "number-input";
        input.id = `inventoryCount_${itemId}`;
        input.dataset.itemId = itemId;
        input.value = displayValue;
        input.disabled = !giveInventoryEnabled;
        input.style.cssText = "width:70px;";
        // Trigger validation reset when the user edits a count
        input.addEventListener("input", this.resetValidation.bind(this));

        li.appendChild(label);
        li.appendChild(input);
        listContainer.appendChild(li);
      });
    }
  }

  /**
   * Renders per-item count inputs inside #petList.
   * @param {Object|null} data - Current save data (may be null on initial load)
   */
  updatePlaceholdersPets(data) {
    // Per-item pet list with individual count inputs
    const listContainer = document.getElementById("petList");
    if (listContainer && this.config) {
      // Preserve any values the user has already typed before re-rendering
      const existingValues = {};
      listContainer
        .querySelectorAll("input[type='number']")
        .forEach((input) => {
          existingValues[input.dataset.itemId] = input.value;
        });

      listContainer.innerHTML = "";

      const pets = new Set([...Object.keys(SaveEditor.PETS)]);

      const givePetsEnabled =
        document.getElementById("givePets")?.checked ?? false;

      [...pets].sort().forEach((petBonus) => {
        const currentCount = data
          ? data.vault.inventory.items.filter(
              (item) =>
                item.type === "Pet" && item.extraData.bonus === petBonus,
            ).length
          : null;

        // Determine the starting value for this input:
        //   1. A previously-typed value (preserved across re-renders)
        //   2. The per-item target stored in config.givePetCounts
        //   3. The current in-save count, or 0 as a fallback
        const savedTarget =
          this.config.givePetCounts?.[petBonus] ?? currentCount ?? 0;
        const displayValue =
          currentCount != null 
            ? currentCount
            : existingValues[petBonus] !== undefined
            ? existingValues[petBonus]
            : savedTarget;

        const li = document.createElement("li");
        li.style.cssText =
          "display:flex;align-items:center;gap:8px;margin-bottom:4px;margin-left:25px;";

        const label = document.createElement("span");
        label.style.cssText = "flex:1;font-size:0.9em;";
        label.textContent =
          currentCount !== null
            ? `${petBonus} (bonus: ${SaveEditor.PETS[petBonus].extraData.bonusValue}) (current: ${currentCount})`
            : `${petBonus} (bonus: ${SaveEditor.PETS[petBonus].extraData.bonusValue})`;

        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.step = "1";
        input.className = "number-input";
        input.id = `petCount_${petBonus}`;
        input.dataset.itemId = petBonus;
        input.value = displayValue;
        input.disabled = !givePetsEnabled;
        input.style.cssText = "width:70px;";
        // Trigger validation reset when the user edits a count
        input.addEventListener("input", this.resetValidation.bind(this));

        li.appendChild(label);
        li.appendChild(input);
        listContainer.appendChild(li);
      });
    }
  }

  /**
   * Renders per-item count inputs inside #junkList.
   * @param {Object|null} data - Current save data (may be null on initial load)
   */
  updatePlaceholdersJunk(data) {
    // Per-item junk list with individual count inputs
    const listContainer = document.getElementById("junkList");
    if (listContainer && this.config) {
      // Preserve any values the user has already typed before re-rendering
      const existingValues = {};
      listContainer
        .querySelectorAll("input[type='number']")
        .forEach((input) => {
          existingValues[input.dataset.itemId] = input.value;
        });

      listContainer.innerHTML = "";

      const junkIds = new Set([...SaveEditor.JUNK_IDS]);

      const giveJunkEnabled =
        document.getElementById("giveJunk")?.checked ?? false;

      [...junkIds].sort().forEach((junkId) => {
        const currentCount = data
          ? data.vault.inventory.items.filter(
              (item) => item.type === "Junk" && item.id === junkId,
            ).length
          : null;

        // Determine the starting value for this input:
        //   1. A previously-typed value (preserved across re-renders)
        //   2. The per-item target stored in config.giveJunkCounts
        //   3. The current in-save count, or 0 as a fallback
        const savedTarget =
          this.config.giveJunkCounts?.[junkId] ?? currentCount ?? 0;
        const displayValue =
          currentCount != null 
            ? currentCount
            : existingValues[junkId] !== undefined
            ? existingValues[junkId]
            : savedTarget;

        const li = document.createElement("li");
        li.style.cssText =
          "display:flex;align-items:center;gap:8px;margin-bottom:4px;margin-left:25px;";

        const label = document.createElement("span");
        label.style.cssText = "flex:1;font-size:0.9em;";
        label.textContent =
          currentCount !== null
            ? `${junkId} (current: ${currentCount})`
            : junkId;

        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.step = "1";
        input.className = "number-input";
        input.id = `junkCount_${junkId}`;
        input.dataset.itemId = junkId;
        input.value = displayValue;
        input.disabled = !giveJunkEnabled;
        input.style.cssText = "width:70px;";
        // Trigger validation reset when the user edits a count
        input.addEventListener("input", this.resetValidation.bind(this));

        li.appendChild(label);
        li.appendChild(input);
        listContainer.appendChild(li);
      });
    }
  }

  /**
   * Writes config values to placeholder DOM elements.
   * @param {Object|null} data - Current save data (may be null on initial load)
   */
  updatePlaceholders(data) {
    // Per-item inventory list with individual count inputs
    this.updatePlaceholdersInventory(data);
    this.updatePlaceholdersJunk(data);
    this.updatePlaceholdersPets(data);

    // Best weapon name
    const bestWeaponPlaceholder = document.getElementById("bestWeaponName");
    if (bestWeaponPlaceholder) {
      bestWeaponPlaceholder.textContent = SaveEditor.BEST_WEAPON_DEF;
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the application
  window.app = new FalloutSaveEditorApp();
  window.app.updatePlaceholders();

  console.log("Fallout Shelter Save Editor v2.0 initialized");
});
