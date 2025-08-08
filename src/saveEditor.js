/**
 * Fallout Shelter Save Editor Module
 * Handles all game data modifications
 */
class SaveEditor {
  static LUNCH_BOX_TYPES = {
    lunch: 0,
    handy: 1,
    pet: 2,
    loot: 3,
  };

  static CHARACTER_TYPES = {
    handy: 2,
    pet: 3,
  };

  static BEST_WEAPON = "PlasmaThrower_DragonsMaw";

  static QUEST_ITEMS_OUTFITS = ["LucysVaultSuit", "RottedDuster", "BOSCasual"];

  static QUEST_ITEMS_WEAPONS = [];

  static POWER_ARMORS = {
    str: "PowerArmor_MkVI",
    per: "PowerArmor_T45f",
    end: "PowerArmor_T60f",
    // mix: "PowerArmor_T51f", // str + per
  };

  static BEST_OUTFITS = {
    str: "MilitaryJumpsuit_Commander", // 7
    per: "UtilityJumpsuit_Heavy", // 7
    end: "HazmatSuit_Heavy", // 7
    cha: "AllNightware_Lucky", // 5
    int: "LabCoat_Expert", // 7
    agi: "HandymanJumpsuit_Expert", // 7
    luk: "FormalWear_Lucky", // 7
  };

  static SPECIALS = {
    str: "str",
    per: "per",
    end: "end",
    cha: "cha",
    int: "int",
    agi: "agi",
    luk: "luk",
  };
  static ROOM_STAT_MAP = {
    Bar: SaveEditor.SPECIALS.cha,
    BarberShop: SaveEditor.SPECIALS.cha,
    Casino: SaveEditor.SPECIALS.luk,
    Classroom: SaveEditor.SPECIALS.int,
    Diner: SaveEditor.SPECIALS.agi,
    Dojo: SaveEditor.SPECIALS.str,
    Energy: SaveEditor.SPECIALS.str,
    Energy2: SaveEditor.SPECIALS.str,
    Gym: SaveEditor.SPECIALS.agi,
    Hydroponic: SaveEditor.SPECIALS.agi,
    LivingQuarters: SaveEditor.SPECIALS.cha,
    MedBay: SaveEditor.SPECIALS.int,
    NukaCola: SaveEditor.SPECIALS.end,
    Radio: SaveEditor.SPECIALS.cha,
    ScienceLab: SaveEditor.SPECIALS.int,
    Storage: SaveEditor.SPECIALS.end,
    SuperRoom2: SaveEditor.SPECIALS.str, // ?
    Water: SaveEditor.SPECIALS.per,
    Water2: SaveEditor.SPECIALS.per,
  };

  constructor() {
    this.gameData = {
      weapons: [
        "O24",
        "O19",
        "O4",
        "O0",
        "O21",
        "O2",
        "O99",
        "O94",
        "O81",
        "O96",
        "O76",
        "O124",
        "O79",
        "O119",
        "O121",
        "O62",
        "O57",
        "O130",
        "O59",
        "O125",
        "O127",
        "O67",
        "O22",
        "O20",
        "O3",
        "O1",
        "O97",
        "O95",
        "O80",
        "O77",
        "O122",
        "O120",
        "O60",
        "O58",
        "O128",
        "O64",
        "O126",
        "O18",
        "O69",
        "O13",
        "O66",
        "O136",
        "O15",
        "O65",
        "O131",
        "O16",
        "O133",
        "O14",
        "O141",
        "O135",
        "O137",
        "O104",
        "O132",
        "O139",
        "O100",
        "O140",
        "O105",
        "O138",
        "O73",
        "O102",
        "O70",
        "O31",
        "O74",
        "O26",
        "O72",
        "O118",
        "O29",
        "O113",
        "O30",
        "O115",
        "O44",
        "O39",
        "O41",
        "O56",
        "O42",
        "O51",
        "O110",
        "O43",
        "O106",
        "O23",
        "O5",
        "O98",
        "O78",
        "O123",
        "O61",
        "O129",
        "O68",
        "O17",
        "O134",
        "O63",
        "O142",
        "O101",
        "O103",
        "O71",
        "O75",
        "O28",
        "O116",
        "O27",
        "O114",
        "O117",
        "O53",
        "O40",
        "O54",
        "O10",
        "O111",
        "O52",
        "O108",
        "O55",
        "O6",
        "O11",
        "O87",
        "O107",
        "O82",
        "O9",
        "O109",
        "O7",
        "O84",
        "O93",
        "O8",
        "O85",
        "O88",
        "O48",
        "O83",
        "O89",
        "O45",
        "O86",
        "O91",
        "O37",
        "O49",
        "O90",
        "O32",
        "O47",
        "O92",
        "O33",
        "O46",
        "O35",
        "O50",
        "O34",
        "O36",
      ],
      outfits: [
        "O103",
        "O106",
        "O111",
        "O13",
        "O2",
        "O33",
        "O37",
        "O41",
        "O49",
        "O55",
        "O6",
        "O78",
        "O81",
        "O84",
        "O89",
        "O95",
        "O100",
        "O101",
        "O105",
        "O108",
        "O110",
        "O112",
        "O113",
        "O117",
        "O15",
        "O16",
        "O30",
        "O31",
        "O34",
        "O36",
        "O38",
        "O4",
        "O43",
        "O47",
        "O48",
        "O50",
        "O52",
        "O54",
        "O57",
        "O59",
        "O61",
        "O76",
        "O77",
        "O79",
        "O8",
        "O83",
        "O86",
        "O9",
        "O91",
        "O92",
        "O93",
        "O96",
        "O97",
        "O98",
        "O64",
        "O63",
        "O65",
        "O67",
        "O72",
        "O68",
        "O70",
        "O73",
        "O1",
        "O10",
        "O102",
        "O104",
        "O107",
        "O109",
        "O11",
        "O12",
        "O14",
        "O27",
        "O3",
        "O32",
        "O35",
        "O39",
        "O42",
        "O51",
        "O53",
        "O56",
        "O66",
        "O69",
        "O7",
        "O71",
        "O74",
        "O80",
        "O82",
        "O85",
        "O87",
        "O90",
        "O94",
        "O75",
      ],
      pets: [
        "O10",
        "O17",
        "O18",
        "O2",
        "O23",
        "O26",
        "O27",
        "O35",
        "O42",
        "O43",
        "O48",
        "O5",
        "O51",
        "O52",
        "O53",
        "O58",
        "O63",
        "O64",
        "O65",
        "O67",
      ],
      breeds: [
        "O10",
        "O11",
        "O0",
        "O12",
        "O1",
        "O13",
        "O2",
        "O3",
        "O4",
        "O5",
        "O6",
        "O7",
        "O14",
        "O15",
        "O16",
        "O8",
        "O9",
        "O17",
        "O18",
        "O19",
      ],
      recipes: [
        "Shotgun_Rusty",
        "Railgun",
        "LaserPistol_Focused",
        "PlasmaThrower_Boosted",
        "PlasmaThrower_Overcharged",
        "PipePistol_LittleBrother",
        "CombatShotgun_Hardened",
        "Flamer_Rusty",
        "LaserRifle_Tuned",
        "HuntingRifle_OlPainless",
        "PlasmaRifle_Focused",
        "PipeRifle",
        "JunkJet_Tactical",
        "InstitutePistol_Improved",
        "BBGun_RedRocket",
        "032Pistol_Hardened",
        "InstitutePistol_Apotheosis",
        "InstitutePistol_Scattered",
        "InstituteRifle_Excited",
        "PipeRifle_Long",
        "GatlingLaser",
        "PlasmaThrower_DragonsMaw",
        "PlasmaRifle",
        "AssaultRifle_Rusty",
        "AlienBlaster_Destabilizer",
        "Fatman_Guided",
        "Melee_RaiderSword",
        "SniperRifle_Hardened",
        "Melee_BaseballBat",
        "PlasmaRifle_MeanGreenMonster",
        "032Pistol_WildBillsSidearm",
        "GaussRifle",
        "LaserRifle_WaserWifle",
        "InstitutePistol_Scoped",
        "Flamer_Pressurized",
        "AssaultRifle_ArmorPiercing",
        "Railgun_Rusty",
        "Minigun_Hardened",
        "InstituteRifle_VirgilsRifle",
        "JunkJet_Electrified",
        "Flamer_Hardened",
        "GatlingLaser_Focused",
        "Magnum_Hardened",
        "Railgun_Railmaster",
        "Melee_PoolCue",
        "Minigun_Enhanced",
        "GaussRifle_Rusty",
        "JunkJet_RecoilCompensated",
        "Pistol_LoneWanderer",
        "MissilLauncher",
        "LaserPistol",
        "InstitutePistol_Incendiary",
        "BBGun_ArmorPiercing",
        "Rifle_ArmorPiercing",
        "AssaultRifle_Enhanced",
        "LaserRifle_Rusty",
        "CombatShotgun",
        "GatlingLaser_Tuned",
        "SawedOffShotgun_Hardened",
        "PlasmaThrower_Agitated",
        "Magnum_Blackhawk",
        "AssaultRifle_Infiltrator",
        "PlasmaPistol_MPLXNovasurge",
        "HuntingRifle_ArmorPiercing",
        "Railgun_Enhanced",
        "SniperRifle_Enhanced",
        "GaussRifle_Accelerated",
        "PlasmaThrower_Tactical",
        "CombatShotgun_Rusty",
        "PipeRifle_Bayoneted",
        "GaussRifle_Hardened",
        "PlasmaThrower",
        "AlienBlaster_Focused",
        "SawedOffShotgun_Kneecapper",
        "Flamer_Enhanced",
        "Railgun_Hardened",
        "GaussRifle_Magnetro4000",
        "PipePistol_Auto",
        "SniperRifle_ArmorPiercing",
        "PipeRifle_NightVision",
        "MissilLauncher_Enhanced",
        "PipeRifle_Calibrated",
        "LaserMusket",
        "Rifle_Hardened",
        "Fatman_Enhanced",
        "JunkJet",
        "PlasmaRifle_Amplified",
        "Minigun_Rusty",
        "Melee_FireHydrantBat",
        "GatlingLaser_Amplified",
        "JunkJet_Flaming",
        "Shotgun_DoubleBarrelled",
        "LaserPistol_Amplified",
        "AlienBlaster_Amplified",
        "InstituteRifle_NightVision",
        "SniperRifle_VictoryRifle",
        "PlasmaPistol",
        "Minigun_LeadBelcher",
        "Melee_ButcherKnife",
        "AssaultRifle",
        "Shotgun_Hardened",
        "MissilLauncher_Hardened",
        "LaserRifle_Focused",
        "AlienBlaster",
        "Melee_Pickaxe",
        "032Pistol_ArmorPiercing",
        "SniperRifle",
        "Pistol_ArmorPiercing",
        "PlasmaPistol_Tuned",
        "Melee_KitchenKnife",
        "AssaultRifle_Hardened",
        "Fatman_Hardened",
        "Shotgun_FarmersDaughter",
        "CombatShotgun_CharonsShotgun",
        "AlienBlaster_Rusty",
        "GatlingLaser_Vengeance",
        "InstituteRifle_Long",
        "JunkJet_TechniciansRevenge",
        "LaserPistol_SmugglersEnd",
        "Flamer_Burnmaster",
        "SniperRifle_Rusty",
        "InstituteRifle",
        "MissilLauncher_MissLauncher",
        "InstituteRifle_Targeting",
        "Fatman_Rusty",
        "Rifle_LincolnsRepeater",
        "PipeRifle_BigSister",
        "Fatman",
        "GatlingLaser_Rusty",
        "Fatman_Mirv",
        "PlasmaPistol_Focused",
        "Shotgun_Enhanced",
        "PipePistol_Scoped",
        "Minigun",
        "InstitutePistol",
        "ProfessorSpecial",
        "PiperSpecial",
        "AllNightware_Lucky",
        "KnightSpecial",
        "BowlingShirt",
        "HunterGear_Bounty",
        "BattleArmor_Sturdy",
        "ColonelSpecial",
        "UtilityJumpsuit_Sturdy",
        "DooWopOutfit",
        "PowerArmor_51f",
        "PowerArmor_MkVI",
        "PowerArmor_51d",
        "PowerArmor_51a",
        "BishopSpecial",
        "FlightSuit_Advanced",
        "SodaFountainDress",
        "HandymanJumpsuit_Expert",
        "HandymanJumpsuit_Advanced",
        "GreaserSpecial",
        "ThreedogSpecial",
        "WastelandSurgeon_Doctor",
        "PowerArmor_T45f",
        "CromwellSpecial",
        "PowerArmor_T45d",
        "WandererArmor_Sturdy",
        "LifeguardOutfit",
        "WrestlerSpecial",
        "EngineerSpecial",
        "MilitaryJumpsuit_Officer",
        "PrestonSpecial",
        "HazmatSuit_Heavy",
        "CombatArmor_Heavy",
        "RaiderArmor_Sturdy",
        "SlasherSpecial",
        "AlistairSpecial",
        "SurvivorSpecial",
        "AllNightware_Naughty",
        "InstituteJumper_Advanced",
        "SurgeonSpecial",
        "MayorSpecial",
        "RiotGear_Sturdy",
        "ScifiSpecial",
        "MetalArmor_Sturdy",
        "BOSUniform",
        "SynthArmor_Heavy",
        "Vest",
        "BittercupSpecial",
        "SoldierSpecial",
        "UtilityJumpsuit_Heavy",
        "HunterGear_Mutant",
        "AbrahamSpecial",
        "EulogyJonesSpecial",
        "PowerArmor_MkIV",
        "BaseballUniform",
        "PowerArmor_T60a",
        "PowerArmor_T60d",
        "FormalWear_Lucky",
        "PowerArmor_T60f",
        "Swimsuit",
        "LabCoat_Expert",
        "LabCoat_Advanced",
        "EmpressSpecial",
        "LibrarianSpecial",
        "KingSpecial",
        "MilitaryJumpsuit_Commander",
        "ScribeRobe",
        "BOSUniform_Expert",
        "LucasSpecial",
        "PrinceSpecial",
        "WandererArmor_Heavy",
        "RadiationSuit_Expert",
        "ScientistScrubs_Commander",
        "HazmatSuit_Sturdy",
        "MetalArmor_Heavy",
        "ButchSpecial",
        "ComedianSpecial",
        "RaiderArmor_Heavy",
        "FlightSuit_Expert",
        "SportsfanSpecial",
        "RothchildSpecial",
        "LabCoat",
        "BattleArmor",
        "BattleArmor_Heavy",
        "CombatArmor",
        "CombatArmor_Sturdy",
        "WandererArmor",
        "RaiderArmor",
        "WastelandSurgeon",
        "HunterGear_Treasure",
        "RiotGear",
        "RiotGear_Heavy",
        "SequinDress",
        "WastelandSurgeon_Settler",
        "HandymanJumpsuit",
        "MechanicJumpsuit",
        "InstituteJumper_Expert",
        "UtilityJumpsuit",
        "AllNightware",
        "WorkDress",
        "MilitaryJumpsuit",
        "FormalWear",
        "FormalWear_Fancy",
        "CheckeredShirt",
        "SweaterVest",
        "PowerArmor",
        "PowerArmor_MkI",
        "ScribeRobe_Initiate",
        "ScribeRobe_Elder",
        "RadiationSuit_Advanced",
        "RadiationSuit",
        "MoviefanSpecial",
        "NinjaSuit",
        "FlightSuit",
        "HazmatSuit",
        "BOSUniform_Advanced",
        "ScientistScrubs_Officer",
        "ScientistScrubs",
        "PolkaDotDress",
        "032Pistol",
        "032Pistol_Enhanced",
        "032Pistol_Rusty",
        "AlienBlaster_Tuned",
        "BBGun",
        "BBGun_Enhanced",
        "BBGun_Hardened",
        "BBGun_Rusty",
        "CombatShotgun_DoubleBarrelled",
        "CombatShotgun_Enhanced",
        "Flamer",
        "GaussRifle_Enhanced",
        "HuntingRifle",
        "HuntingRifle_Enhanced",
        "HuntingRifle_Hardened",
        "HuntingRifle_Rusty",
        "LaserPistol_Rusty",
        "LaserPistol_Tuned",
        "LaserRifle",
        "LaserRifle_Amplified",
        "Magnum",
        "Magnum_ArmorPiercing",
        "Magnum_Enhanced",
        "Magnum_Rusty",
        "Minigun_ArmorPiercing",
        "MissilLauncher_Guided",
        "MissilLauncher_Rusty",
        "PipePistol",
        "PipePistol_HairTrigger",
        "PipePistol_Heavy",
        "Pistol",
        "Pistol_Enhanced",
        "Pistol_Hardened",
        "Pistol_Rusty",
        "PlasmaPistol_Amplified",
        "PlasmaPistol_Rusty",
        "PlasmaRifle_Rusty",
        "PlasmaRifle_Tuned",
        "Railgun_Accelerated",
        "Rifle",
        "Rifle_Enhanced",
        "Rifle_Rusty",
        "SawedOffShotgun",
        "SawedOffShotgun_DoubleBarrelled",
        "SawedOffShotgun_Enhanced",
        "SawedOffShotgun_Rusty",
        "Shotgun",
        "PowerArmor_T51f",
      ],
    };
  }

  /**
   * Apply all modifications to save data based on configuration
   * @param {Object} data - Save file data
   * @param {Object} config - Configuration object with modification settings
   * @returns {Object} Modified save data
   */
  modifyData(data, config) {
    console.log("Starting save file modification...");

    try {
      // Apply modifications in order
      this.manageDwellerCount(data, config);
      this.modifyDwellers(data, config);
      this.unlockItems(data, config);
      this.updateInventory(data, config);
      this.manageResources(data, config);
      this.handleExplorers(data, config);
      this.updateMrHandy(data, config);
      this.updatePets(data, config);
      this.updateGameSettings(data, config);

      console.log("Save file modification completed successfully");
      return data;
    } catch (error) {
      console.error("Error during save modification:", error);
      throw error;
    }
  }

  /**
   * Manage dweller count and pending dwellers
   * @param {Object} data - Save data
   * @param {Object} config - Configuration
   */
  manageDwellerCount(data, config) {
    if (config.setRemoveWaitingHandies) {
      console.log("Removing waiting handies...");

      data.dwellers.actors = data.dwellers.actors.filter(
        (a) =>
          a.characterType == SaveEditor.CHARACTER_TYPES.handy &&
          a.savedRoom > -1
      );
    }

    if (!config.setMaxDwellers) return;

    console.log("Managing dweller count...");

    const waitingDwellerIds = [];
    const waitingActorIds = [];

    // Collect waiting dweller IDs
    if (data.dwellerSpawner?.dwellersWaiting) {
      data.dwellerSpawner.dwellersWaiting.forEach((dweller) => {
        if (dweller.charType === "Dweller") {
          waitingDwellerIds.push(dweller.dwellerId);
        } else {
          waitingActorIds.push(dweller.serializeId);
        }
      });
    }

    // Remove excess dwellers if over limit
    if (data.dwellers.dwellers.length > config.maxDwellerCount) {
      waitingDwellerIds.forEach((waitingId) => {
        const dwellerIndex = data.dwellers.dwellers.findIndex(
          (dweller) => dweller.serializeId === waitingId
        );
        if (dwellerIndex !== -1) {
          data.dwellers.dwellers.splice(dwellerIndex, 1);
          if (data.dwellers.dwellers.length <= config.maxDwellerCount) {
            return;
          }
        }
      });
    }

    // Clear waiting lists
    data.dwellerSpawner.dwellersWaiting = [];

    // Remove waiting actors
    waitingActorIds.forEach((actorId) => {
      const actorIndex = data.dwellers.actors.findIndex(
        (actor) => actor.serializeId === actorId
      );
      if (actorIndex !== -1) {
        data.dwellers.actors.splice(actorIndex, 1);
      }
    });
  }

  /**
   * Apply modifications to individual dwellers
   * @param {Object} data - Save data
   * @param {Object} config - Configuration
   */
  modifyDwellers(data, config) {
    if (!data.dwellers?.dwellers) return;

    console.log("Modifying dwellers...");

    data.dwellers.dwellers.forEach((dweller) => {
      // Rename dwellers
      if (config.renameDwellers) {
        const id = String(dweller.serializeId).padStart(3, "0");
        dweller.name = `d${id}`;
        dweller.lastName = `vault${data.vault.VaultName}`;
      }

      // Update health
      if (config.setMaxDwellerHealth) {
        dweller.health.healthValue = config.maxDwellerHealth;
        dweller.health.maxHealth = config.maxDwellerHealth;
      }

      // Update radiation
      if (config.setDwellerRad) {
        dweller.health.radiationValue = config.dwellerRadLevel;
      }

      // Update happiness
      if (config.setDwellerHappiness) {
        dweller.happiness.happinessValue = config.dwellerHappiness;
      }

      // Update level and XP
      if (config.setDwellerLvl) {
        dweller.health.lastLevelUpdated = 50;
        dweller.experience.experienceValue = 1;
        dweller.experience.currentLevel = 50;
        dweller.experience.needLvUp = false;
      }

      // Update SPECIAL stats
      if (config.setMaxStats) {
        for (let i = 1; i < 8; i++) {
          if (dweller.stats.stats[i]) {
            dweller.stats.stats[i].value = 10;
            dweller.stats.stats[i].exp = 594000;
          }
        }
      }

      // Equip best weapon
      if (config.equipMaxWeapon) {
        dweller.equipedWeapon.id = SaveEditor.BEST_WEAPON;
      }

      // Equip best outfit
      if (config.equipBestArmor) {
        const room = data.vault.rooms.find((r) =>
          r.dwellers.includes(dweller.serializeId)
        );
        const isWasteland = data.vault.wasteland.teams.find(
          (t) =>
            t.dwellers.find((d) => d.serializeId == dweller.serializeId) != null
        );
        if (room) {
          if (["Entrance", "Overseer"].includes(room.type)) {
            dweller.equipedOutfit.id = SaveEditor.POWER_ARMORS.str;
          } else {
            const special = SaveEditor.ROOM_STAT_MAP[room.type];
            if (special) {
              switch (special) {
                case SaveEditor.SPECIALS.str:
                  dweller.equipedOutfit.id = SaveEditor.BEST_OUTFITS.str;
                  break;
                case SaveEditor.SPECIALS.per:
                  dweller.equipedOutfit.id = SaveEditor.BEST_OUTFITS.per;
                  break;
                case SaveEditor.SPECIALS.end:
                  dweller.equipedOutfit.id = SaveEditor.BEST_OUTFITS.end;
                  break;
                case SaveEditor.SPECIALS.cha:
                  dweller.equipedOutfit.id = SaveEditor.BEST_OUTFITS.cha;
                  break;
                case SaveEditor.SPECIALS.int:
                  dweller.equipedOutfit.id = SaveEditor.BEST_OUTFITS.int;
                  break;
                case SaveEditor.SPECIALS.agi:
                  dweller.equipedOutfit.id = SaveEditor.BEST_OUTFITS.agi;
                  break;
                case SaveEditor.SPECIALS.luk:
                  dweller.equipedOutfit.id = SaveEditor.BEST_OUTFITS.luk;
                  break;
                default:
                  break;
              }
            }
          }
          console.log(
            `Assigned outfit ${dweller.equipedOutfit.id} to dweller ID ${dweller.serializeId} (matched to room ${room.deserializeID}, ${room.type})`
          );
        } else if (isWasteland) {
          dweller.equipedOutfit.id = SaveEditor.POWER_ARMORS.per;
          console.log(
            `Assigned outfit ${dweller.equipedOutfit.id} to exploring dweller ID ${dweller.serializeId}`
          );
        } else {
          console.warn(
            `Could not find assigned room for dweller ID ${dweller.serializeId}`
          );
        }
      }

      // Abort pregnancies
      if (config.abortPregnancies) {
        dweller.pregnant = false;
        dweller.babyReady = false;
      }
    });
  }

  /**
   * Unlock weapons, outfits, and pets
   * @param {Object} data - Save data
   * @param {Object} config - Configuration
   */
  unlockItems(data, config) {
    if (!config.discoverItems) return;

    console.log("Unlocking items...");

    // Unlock weapons
    this.gameData.weapons.forEach((weapon) => {
      if (!data.survivalW.weapons.includes(weapon)) {
        data.survivalW.weapons.push(weapon);
      }
    });

    // Unlock outfits
    this.gameData.outfits.forEach((outfit) => {
      if (!data.survivalW.outfits.includes(outfit)) {
        data.survivalW.outfits.push(outfit);
      }
    });

    // Unlock pets
    this.gameData.pets.forEach((pet) => {
      if (!data.survivalW.pets.includes(pet)) {
        data.survivalW.pets.push(pet);
      }
    });

    // Unlock breeds
    this.gameData.breeds.forEach((breed) => {
      if (!data.survivalW.breeds.includes(breed)) {
        data.survivalW.breeds.push(breed);
      }
    });

    // Unlock recipes
    this.gameData.recipes.forEach((recipe) => {
      if (!data.survivalW.recipes.includes(recipe)) {
        data.survivalW.recipes.push(recipe);
      }
      if (!data.survivalW.claimedRecipes.includes(recipe)) {
        data.survivalW.claimedRecipes.push(recipe);
      }
    });
  }

  /**
   * Update vault inventory
   * @param {Object} data - Save data
   * @param {Object} config - Configuration
   */
  updateInventory(data, config) {
    if (config.giveQuestItems) {
      // Add 1 of each quest outfit to inventory
      SaveEditor.QUEST_ITEMS_OUTFITS.forEach((outfitId) => {
        const exists = data.vault.inventory.items.find(
          (item) => item.id === outfitId
        );

        if (!exists) {
          data.vault.inventory.items.push({
            id: outfitId,
            type: "Outfit",
            hasBeenAssigned: false,
            hasRandomWeaponBeenAssigned: false,
          });
        }
      });

      // Add 1 of each quest weapon to inventory
      SaveEditor.QUEST_ITEMS_WEAPONS.forEach((weaponId) => {
        const exists = data.vault.inventory.items.find(
          (item) => item.id === weaponId
        );

        if (!exists) {
          data.vault.inventory.items.push({
            id: weaponId,
            type: "Weapon",
            hasBeenAssigned: false,
            hasRandomWeaponBeenAssigned: false,
          });
        }
      });
    }

    if (config.giveInventory) {
      // Add outfits to inventory
      if (config.giveInventoryOutfitIds) {
        config.giveInventoryOutfitIds.forEach((outfitId) => {
          const currentCount = data.vault.inventory.items.filter(
            (item) => item.id === outfitId
          ).length;

          const needed = config.giveInventoryCount - currentCount;
          if (needed > 0) {
            for (let i = 0; i < needed; i++) {
              data.vault.inventory.items.push({
                id: outfitId,
                type: "Outfit",
                hasBeenAssigned: false,
                hasRandomWeaponBeenAssigned: false,
              });
            }
          }
        });
      }

      // Add weapons to inventory
      if (config.giveInventoryWeaponIds) {
        config.giveInventoryWeaponIds.forEach((weaponId) => {
          const currentCount = data.vault.inventory.items.filter(
            (item) => item.id === weaponId
          ).length;

          const needed = config.giveInventoryCount - currentCount;
          if (needed > 0) {
            for (let i = 0; i < needed; i++) {
              data.vault.inventory.items.push({
                id: weaponId,
                type: "Weapon",
                hasBeenAssigned: false,
                hasRandomWeaponBeenAssigned: false,
              });
            }
          }
        });
      }
    }
  }

  /**
   * Manage vault resources
   * @param {Object} data - Save data
   * @param {Object} config - Configuration
   */
  manageResources(data, config) {
    const resources = data.vault.storage.resources;
    if (!resources) return;

    console.log("Managing resources...");

    // Update basic resources
    if (config.setCapsCount) resources.Nuka = config.capsCount;
    if (config.setStimpackCount) resources.StimPack = config.stimpackCount;
    if (config.setRadawayCount) resources.RadAway = config.radawayCount;
    if (config.setFoodCount) resources.Food = config.foodCount;
    if (config.setEnergyCount) resources.Energy = config.energyCount;
    if (config.setWaterCount) resources.Water = config.waterCount;
    if (config.setNukaColaCount)
      resources.NukaColaQuantum = config.nukaColaCount;

    // Handle lunchboxes
    this.manageLunchboxes(data, config);
  }

  /**
   * Manage lunchboxes and containers
   * @param {Object} data - Save data
   * @param {Object} config - Configuration
   */
  manageLunchboxes(data, config) {
    if (!config.setRemoveBoxes) return;

    data.vault.LunchBoxesByType = [];

    // Add lunchboxes
    for (let i = 0; i < config.lunchboxCount; i++) {
      data.vault.LunchBoxesByType.push(SaveEditor.LUNCH_BOX_TYPES.lunch);
    }

    // Add Mr. Handy boxes
    for (let i = 0; i < config.mrHandyBoxCount; i++) {
      data.vault.LunchBoxesByType.push(SaveEditor.LUNCH_BOX_TYPES.handy);
    }

    // Add pet crates
    for (let i = 0; i < config.petCrateCount; i++) {
      data.vault.LunchBoxesByType.push(SaveEditor.LUNCH_BOX_TYPES.pet);
    }

    // Add loot crates
    for (let i = 0; i < config.lootCrateCount; i++) {
      data.vault.LunchBoxesByType.push(SaveEditor.LUNCH_BOX_TYPES.loot);
    }

    data.vault.LunchBoxesCount = data.vault.LunchBoxesByType.length;
  }

  /**
   * Handle explorer modifications
   * @param {Object} data - Save data
   * @param {Object} config - Configuration
   */
  handleExplorers(data, config) {
    if (!data.vault.wasteland?.teams) return;

    console.log("Handling explorers...");

    data.vault.wasteland.teams.forEach((explorer) => {
      // Return dwellers
      if (config.setReturnDwellers && explorer.returnTripDuration > 0) {
        explorer.elapsedReturningTime = explorer.returnTripDuration - 25;
      }

      // Extend exploration time
      if (
        config.setIncreaseExploreTime &&
        explorer.elapsedTimeAliveExploring < 440000
      ) {
        explorer.elapsedTimeAliveExploring = 440000;
      }

      // Give health packs to explorers
      if (config.giveExplorersHealthPacks) {
        explorer.dwellers.forEach((dwellerId) => {
          const dweller = data.dwellers.dwellers.find(
            (d) => d.serializeId === dwellerId
          );
          if (dweller && dweller.equipment && dweller.equipment.storage) {
            dweller.equipment.storage.resources.StimPack = 25;
            dweller.equipment.storage.resources.RadAway = 25;
          }
        });
      }
    });
  }

  /**
   * Update Mr. Handy units
   * @param {Object} data - Save data
   * @param {Object} config - Configuration
   */
  updateMrHandy(data, config) {
    if (!config.setMaxMrHandyHealth) return;

    console.log("Updating Mr. Handy health...");

    if (data.dwellers?.actors) {
      data.dwellers.actors.forEach((actor) => {
        if (actor.characterType == SaveEditor.CHARACTER_TYPES.handy) {
          actor.health = config.maxMrHandyHealth;
        }
      });
    }
  }

  updatePets(data, config) {
    if (!config.setPetBonusValue) return;

    console.log("Updating Pet bonuses...");

    const multipierBoosts = [
      "DamageBoost",
      "FasterWastelandReturnSpeed",
      "HealingBoost",
      "ObjectiveMultiplier",
      "RadHealingBoost",
      "TrainingBoost",
    ];

    const valueBoosts = [
      "AddMaxHP",
      "CheaperCrafting",
      "ChildMultiplier",
      "FasterAndCheaperCrafting",
      "FasterCrafting",
      "HappinessBoost",
      "Resistance",
      "WastelandItemBoost",
      "WastelandJunkBoost",
      "XPBoost",
    ];

    const VALUE_BOOST = 1000;
    const MULT_BOOST = 100;

    if (data.dwellers?.dwellers) {
      data.dwellers.dwellers.forEach((dweller) => {
        if (dweller.equippedPet?.type == "Pet") {
          if (multipierBoosts.includes(dweller.equippedPet.extraData.bonus)) {
            if (dweller.equippedPet.extraData.bonusValue < MULT_BOOST) {
              dweller.equippedPet.extraData.bonusValue = MULT_BOOST;
            }
          } else if (
            valueBoosts.includes(dweller.equippedPet.extraData.bonus)
          ) {
            if (dweller.equippedPet.extraData.bonusValue < VALUE_BOOST) {
              dweller.equippedPet.extraData.bonusValue = VALUE_BOOST;
            }
          } else {
            console.warn(
              `Unhandled pet bonus type detected: ${dweller.equippedPet.extraData.bonus}`
            );
          }
        }
      });
    }

    if (data.vault?.inventory?.items) {
      data.vault.inventory.items.forEach((item) => {
        if (item.type == "Pet") {
          if (multipierBoosts.includes(item.extraData.bonus)) {
            if (item.extraData.bonusValue < MULT_BOOST) {
              item.extraData.bonusValue = MULT_BOOST;
            }
          } else if (valueBoosts.includes(item.extraData.bonus)) {
            if (item.extraData.bonusValue < VALUE_BOOST) {
              item.extraData.bonusValue = VALUE_BOOST;
            }
          } else {
            console.warn(
              `Unhandled pet bonus type detected in inventory: ${item.extraData.bonus}`
            );
          }
        }
      });
    }
  }

  /**
   * Update game settings
   * @param {Object} data - Save data
   * @param {Object} config - Configuration
   */
  updateGameSettings(data, config) {
    console.log("Updating game settings...");

    // Simple objectives
    if (config.setSimpleObjectives) {
      data.objectiveMgr.shuffleBags = [
        ["Food5"],
        ["Food5"],
        ["Food5"],
        ["Food5"],
        ["Food5"],
      ];
    }

    // Deathclaw occurrence
    if (config.setDeathClawChance) {
      data.DeathclawManager.deathclawTotalExtraChance = config.deathClawChance;
    }
  }

  /**
   * Validate configuration object
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validation result with isValid and errors
   */
  validateConfig(config) {
    const errors = [];

    // Validate numeric values
    const numericFields = [
      "maxDwellerCount",
      "maxDwellerHealth",
      "maxMrHandyHealth",
      "dwellerRadLevel",
      "dwellerHappiness",
      "energyCount",
      "foodCount",
      "waterCount",
      "capsCount",
      "lunchboxCount",
      "stimpackCount",
      "radawayCount",
      "inventoryCount",
    ];

    numericFields.forEach((field) => {
      if (config[field] !== undefined) {
        const value = Number(config[field]);
        if (isNaN(value) || value < 0) {
          errors.push(`${field} must be a valid positive number`);
        }
      }
    });

    // Validate happiness range
    if (config.dwellerHappiness !== undefined) {
      const happiness = Number(config.dwellerHappiness);
      if (happiness < 0 || happiness > 100) {
        errors.push("Dweller happiness must be between 0 and 100");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate loaded save data object
   * @param {Object} data - Save data to validate
   * @returns {Object} Validation result with isValid and errors
   */
  validateSaveData(data) {
    const errors = [];
    try {
      if (!data?.dwellers?.dwellers) {
        errors.push("Missing dwellers.dwellers");
      }
      if (!data?.dwellers?.actors) {
        errors.push("Missing dwellers.actors");
      }
      if (!data?.vault?.rooms) {
        errors.push("Missing vault.rooms");
      }
      if (!data?.vault?.storage?.resources) {
        errors.push("Missing vault.storage.resources");
      }
    } catch (e) {
      errors.push(e);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Loads save data into form config object
   * @param {Object} data - Save data to load
   * @returns {Object} Form config object
   */
  loadSaveData(data) {
    let config = {
      dwellerHappiness: 100,
      maxMrHandyHealth: 5000,
      deathClawChance: data.DeathclawManager.deathclawTotalExtraChance,
      lunchboxCount: data.vault.LunchBoxesByType.filter(
        (box) => box === SaveEditor.LUNCH_BOX_TYPES.lunch
      ).length,
      mrHandyBoxCount: data.vault.LunchBoxesByType.filter(
        (box) => box === SaveEditor.LUNCH_BOX_TYPES.handy
      ).length,
      petCrateCount: data.vault.LunchBoxesByType.filter(
        (box) => box === SaveEditor.LUNCH_BOX_TYPES.pet
      ).length,
      lootCrateCount: data.vault.LunchBoxesByType.filter(
        (box) => box === SaveEditor.LUNCH_BOX_TYPES.loot
      ).length,
      capsCount: data.vault.storage.resources.Nuka,
      stimpackCount: data.vault.storage.resources.StimPack,
      radawayCount: data.vault.storage.resources.RadAway,
      foodCount: data.vault.storage.resources.Food,
      energyCount: data.vault.storage.resources.Energy,
      waterCount: data.vault.storage.resources.Water,
      nukaColaCount: data.vault.storage.resources.NukaColaQuantum,
      maxDwellerCount: data.dwellers.dwellers.length,
      maxDwellerHealth: data.dwellers.dwellers[0].health.maxHealth || 300,
      dwellerRadLevel: 0,
    };

    return config;
  }
}
