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
    "giveInventoryCount",
  ];

  BOOLEAN_FIELDS = [
    "abortPregnancies",
    "discoverItems",
    "equipBestArmor",
    "equipMaxWeapon",
    "giveExplorersHealthPacks",
    "giveInventory",
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
    "setPetBonusValue",
    "giveQuestItems",
  ];

  constructor() {
    this.config = {
      giveInventoryOutfitIds: [
        SaveEditor.POWER_ARMORS.str,
        SaveEditor.POWER_ARMORS.per,
        SaveEditor.POWER_ARMORS.end,
        SaveEditor.BEST_OUTFITS.str,
        SaveEditor.BEST_OUTFITS.per,
        SaveEditor.BEST_OUTFITS.end,
        SaveEditor.BEST_OUTFITS.cha,
        SaveEditor.BEST_OUTFITS.int,
        SaveEditor.BEST_OUTFITS.agi,
        SaveEditor.BEST_OUTFITS.luk,
      ],
      giveInventoryWeaponIds: [SaveEditor.BEST_WEAPON],
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
        targets: ["equipMaxWeapon", "equipBestArmor", "giveInventory", "giveQuestItems"],
      },
      {
        checkbox: "giveInventory",
        targets: ["giveInventoryCount"],
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
          this.resetValidation();
        });

        // Trigger initial state
        checkboxEl.dispatchEvent(new Event("change"));
      }
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
          "<br>"
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
        "Failed to find current save data. Try loading it again"
      );
      return;
    }

    try {
      this.showLoading(true);

      // Apply modifications
      const editor = new SaveEditor();
      this.modifiedSaveData = editor.modifyData(
        this.currentSaveData,
        this.config
      );
      const exportUpdated = document.getElementById("exportUpdatedBtn");
      if (exportUpdated) {
        exportUpdated.disabled = false;
      }

      // Encrypt and download
      const encryptor = new FileEncryptor();
      await encryptor.encryptObject(this.filename, this.modifiedSaveData);

      this.showSaveSuccess(
        "Save file processed successfully! Download should start automatically."
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
        "Failed to find current save data. Try loading it again"
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
      console.error("No updated sae data detected");
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
          "Failed to load save file: " + validation.errors.join(", ")
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
          a.savedRoom == -1
      ).length;
      waitingHandyCountPlaceholder.textContent = `(current waiting: ${cnt})`;
    }

    // Returning explorers count
    const returningDwellersPlaceholder = document.getElementById(
      "returning-dwellers-placeholder"
    );
    if (returningDwellersPlaceholder) {
      const cnt = this.currentSaveData.vault.wasteland?.teams.reduce(
        (prev, team) => {
          if (team.elapsedReturningTime == 0) {
            return prev;
          }
          return prev + team.dwellers.length;
        },
        0
      );
      returningDwellersPlaceholder.textContent = `(current returning: ${cnt})`;
    }

    // Exploring dweller count
    const exploringDwellersPlaceholder = document.getElementById(
      "exploring-dwellers-placeholder"
    );
    if (exploringDwellersPlaceholder) {
      const cnt = this.currentSaveData.vault.wasteland?.teams.reduce(
        (prev, team) => prev + team.dwellers.length,
        0
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
   * Writes config values to placeholder DOM elements
   */
  updatePlaceholders(data) {
    // add inventory list
    const listContainer = document.getElementById("inventoryList");
    if (listContainer && this.config) {
      listContainer.innerHTML = "";

      const items = new Set([
        ...this.config.giveInventoryOutfitIds,
        ...this.config.giveInventoryWeaponIds,
      ]);

      [...items].sort().forEach((name) => {
        const listItem = document.createElement("li");
        let existingCount = null;
        if (data) {
          existingCount = data.vault.inventory.items.filter(
            (item) => item.id === name
          ).length;
        }

        listItem.textContent =
          existingCount == null
            ? `"${name}"`
            : `"${name}" (current: ${existingCount})`;
        listContainer.appendChild(listItem);
      });
    }

    // best weapon
    const bestWeaponPlaceholder = document.getElementById("bestWeaponName");
    if (bestWeaponPlaceholder) {
      bestWeaponPlaceholder.textContent = SaveEditor.BEST_WEAPON;
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
