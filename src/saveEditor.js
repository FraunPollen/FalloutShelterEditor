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

  static BEST_WEAPON_DEF = "Fatman_Mirv";
  static BEST_WEAPON_QUEST = "GatlingLaser_Vengeance";
  static BEST_WEAPON_EXPLORE = "PlasmaThrower_DragonsMaw";

  static WEAPONS = [
    SaveEditor.BEST_WEAPON_DEF,
    SaveEditor.BEST_WEAPON_QUEST,
    SaveEditor.BEST_WEAPON_EXPLORE,
  ];

  static QUEST_ITEMS_OUTFITS = ["LucysVaultSuit", "RottedDuster", "BOSCasual"];

  static QUEST_ITEMS_WEAPONS = [];

  static POWER_ARMORS = {
    str: "PowerArmor_MkVI",
    per: "PowerArmor_T45f",
    end: "PowerArmor_T60f",
    mix1: "ScarredPowerArmor",
    mix2: "EnclavePowerArmor", // always available? (was season)
  };

  static BEST_OUTFITS = {
    str: "MilitaryJumpsuit_Commander", // 7
    per: "UtilityJumpsuit_Heavy", // 7
    end: "HazmatSuit_Heavy", // 7
    cha: "AllNightware_Lucky", // 7
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
    Entrance: null,
    Gym: SaveEditor.SPECIALS.agi,
    Hydroponic: SaveEditor.SPECIALS.agi,
    LivingQuarters: SaveEditor.SPECIALS.cha,
    MedBay: SaveEditor.SPECIALS.int,
    NukaCola: SaveEditor.SPECIALS.end,
    Radio: SaveEditor.SPECIALS.cha,
    ScienceLab: SaveEditor.SPECIALS.int,
    Storage: null, // assume storage is holding cell for explorers
    SuperRoom2: SaveEditor.SPECIALS.str, // ?
    Water: SaveEditor.SPECIALS.per,
    Water2: SaveEditor.SPECIALS.per,
  };

  static JUNK_IDS = [
    "AlarmClock",
    "BaseballGlove",
    "BrahminHide",
    "Camera",
    "ChemistrySet",
    "DeskFan",
    "DuctTape",
    "GiddyupButtercup",
    "Globe",
    "GoldWatch",
    "MagnifyingGlass",
    "Microscope",
    "MilitaryCircuitBoard",
    "MilitaryDuctTape",
    "Shovel",
    "TeddyBear",
    "TriFoldFlag",
    "ToyCar",
    "Wonderglue",
    "YaoGuaiHide",
    "Yarn",
  ];

  static PETS = {
    ObjectiveMultiplier: {
      id: "blueyellowmacaw_l2",
      type: "Pet",
      hasBeenAssigned: false,
      hasRandonWeaponBeenAssigned: false,
      extraData: {
        uniqueName: "Vinnie",
        bonus: "ObjectiveMultiplier",
        bonusValue: 2,
      },
    },
    FasterAndCheaperCrafting: {
      id: "brittany_c",
      type: "Pet",
      hasBeenAssigned: false,
      hasRandonWeaponBeenAssigned: false,
      extraData: {
        uniqueName: "Brittany",
        bonus: "FasterAndCheaperCrafting",
        bonusValue: 9,
      },
    },
    WastelandJunkBoost: {
      id: "stbernard_r",
      type: "Pet",
      hasBeenAssigned: false,
      hasRandonWeaponBeenAssigned: false,
      extraData: {
        uniqueName: "Scout",
        bonus: "WastelandJunkBoost",
        bonusValue: 64,
      },
    },
    FasterCrafting: {
      id: "somali_l",
      type: "Pet",
      hasBeenAssigned: false,
      hasRandonWeaponBeenAssigned: false,
      extraData: {
        uniqueName: "Saffron",
        bonus: "FasterCrafting",
        bonusValue: 40,
      },
    },
    XPBoost: {
      id: "cx404_l",
      type: "Pet",
      hasBeenAssigned: false,
      hasRandonWeaponBeenAssigned: false,
      extraData: {
        uniqueName: "CX404",
        bonus: "XPBoost",
        bonusValue: 41,
      },
    },
    DamageBoost: {
      id: "Alien_Drone",
      type: "Pet",
      hasBeenAssigned: false,
      hasRandonWeaponBeenAssigned: false,
      extraData: {
        uniqueName: "Alien Drone",
        bonus: "DamageBoost",
        bonusValue: 4,
      },
    },
    Resistance: {
      id: "abyssinian_l",
      type: "Pet",
      hasBeenAssigned: false,
      hasRandonWeaponBeenAssigned: false,
      extraData: {
        uniqueName: "Zula",
        bonus: "Resistance",
        bonusValue: 47,
      },
    },
    RadHealingBoost: {
      id: "siamese_l",
      type: "Pet",
      hasBeenAssigned: false,
      hasRandonWeaponBeenAssigned: false,
      extraData: {
        uniqueName: "Goblet",
        bonus: "RadHealingBoost",
        bonusValue: 4,
      },
    },
    WastelandCapsBoost: {
      id: "cattledog_r",
      type: "Pet",
      hasBeenAssigned: false,
      hasRandonWeaponBeenAssigned: false,
      extraData: {
        uniqueName: "Max",
        bonus: "WastelandCapsBoost",
        bonusValue: 26,
      },
    },
    WastelandJunkBoost: {
      id: "pallascat_c",
      type: "Pet",
      hasBeenAssigned: false,
      hasRandonWeaponBeenAssigned: false,
      extraData: {
        uniqueName: "Pallas's Cat",
        bonus: "WastelandJunkBoost",
        bonusValue: 26,
      },
    },
    MysteriousMagnet: {
      id: "toyger_c",
      type: "Pet",
      hasBeenAssigned: false,
      hasRandonWeaponBeenAssigned: false,
      extraData: {
        uniqueName: "Toyger",
        bonus: "MysteriousMagnet",
        bonusValue: 2.5,
      },
    },
  };

  constructor() {
    this.gameData = {
      weapons: [
        "N160",
        "N179",
        "N180",
        "N181",
        "N182",
        "N183",
        "N184",
        "N185",
        "N188",
        "N193",
        "N195",
        "N203",
        "N216",
        "N218",
        "N219",
        "N220",
        "N221",
        "N226",
        "N228",
        "N231",
        "N232",
        "N234",
        "N235",
        "N238",
        "N239",
        "O0",
        "O1",
        "O10",
        "O100",
        "O101",
        "O102",
        "O103",
        "O104",
        "O105",
        "O106",
        "O107",
        "O108",
        "O109",
        "O11",
        "O110",
        "O111",
        "O113",
        "O114",
        "O115",
        "O116",
        "O117",
        "O118",
        "O119",
        "O120",
        "O121",
        "O122",
        "O123",
        "O124",
        "O125",
        "O126",
        "O127",
        "O128",
        "O129",
        "O13",
        "O130",
        "O131",
        "O132",
        "O133",
        "O134",
        "O135",
        "O136",
        "O137",
        "O138",
        "O139",
        "O14",
        "O140",
        "O141",
        "O142",
        "O15",
        "O16",
        "O17",
        "O18",
        "O19",
        "O2",
        "O20",
        "O21",
        "O22",
        "O23",
        "O24",
        "O26",
        "O27",
        "O28",
        "O29",
        "O3",
        "O30",
        "O31",
        "O32",
        "O33",
        "O34",
        "O35",
        "O36",
        "O37",
        "O39",
        "O4",
        "O40",
        "O41",
        "O42",
        "O43",
        "O44",
        "O45",
        "O46",
        "O47",
        "O48",
        "O49",
        "O5",
        "O50",
        "O51",
        "O52",
        "O53",
        "O54",
        "O55",
        "O56",
        "O57",
        "O58",
        "O59",
        "O6",
        "O60",
        "O61",
        "O62",
        "O63",
        "O64",
        "O65",
        "O66",
        "O67",
        "O68",
        "O69",
        "O7",
        "O70",
        "O71",
        "O72",
        "O73",
        "O74",
        "O75",
        "O76",
        "O77",
        "O78",
        "O79",
        "O8",
        "O80",
        "O81",
        "O82",
        "O83",
        "O84",
        "O85",
        "O86",
        "O87",
        "O88",
        "O89",
        "O9",
        "O90",
        "O91",
        "O92",
        "O93",
        "O94",
        "O95",
        "O96",
        "O97",
        "O98",
        "O99",
      ],
      outfits: [
        "N0",
        "N146",
        "N148",
        "N149",
        "N150",
        "N151",
        "N153",
        "N154",
        "N155",
        "N164",
        "N168",
        "N171",
        "N172",
        "N173",
        "N174",
        "N175",
        "N176",
        "N177",
        "N178",
        "N180",
        "N184",
        "N199",
        "N200",
        "N202",
        "O1",
        "O10",
        "O100",
        "O101",
        "O102",
        "O103",
        "O104",
        "O105",
        "O106",
        "O107",
        "O108",
        "O109",
        "O11",
        "O110",
        "O111",
        "O112",
        "O113",
        "O117",
        "O12",
        "O13",
        "O14",
        "O15",
        "O16",
        "O2",
        "O27",
        "O3",
        "O30",
        "O31",
        "O32",
        "O33",
        "O34",
        "O35",
        "O36",
        "O37",
        "O38",
        "O39",
        "O4",
        "O41",
        "O42",
        "O43",
        "O47",
        "O48",
        "O49",
        "O50",
        "O51",
        "O52",
        "O53",
        "O54",
        "O55",
        "O56",
        "O57",
        "O59",
        "O6",
        "O61",
        "O63",
        "O64",
        "O65",
        "O66",
        "O67",
        "O68",
        "O69",
        "O7",
        "O70",
        "O71",
        "O72",
        "O73",
        "O74",
        "O75",
        "O76",
        "O77",
        "O78",
        "O79",
        "O8",
        "O80",
        "O81",
        "O82",
        "O83",
        "O84",
        "O85",
        "O86",
        "O87",
        "O89",
        "O9",
        "O90",
        "O91",
        "O92",
        "O93",
        "O94",
        "O95",
        "O96",
        "O97",
        "O98",
      ],
      pets: [
        "N126",
        "N20",
        "N29",
        "N47",
        "N80",
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
        "N22",
        "N23",
        "N24",
        "N28",
        "N32",
        "N33",
        "N42",
        "O0",
        "O1",
        "O10",
        "O11",
        "O12",
        "O13",
        "O14",
        "O15",
        "O16",
        "O17",
        "O18",
        "O19",
        "O2",
        "O3",
        "O4",
        "O5",
        "O6",
        "O7",
        "O8",
        "O9",
      ],
      recipes: [
        "032Pistol_ArmorPiercing",
        "032Pistol_Enhanced",
        "032Pistol_Hardened",
        "032Pistol_Rusty",
        "032Pistol_WildBillsSidearm",
        "032Pistol",
        "50CalMachineGun",
        "AbrahamSpecial",
        "ActionWeddingDress",
        "AlienBlaster_Amplified",
        "AlienBlaster_Destabilizer",
        "AlienBlaster_Focused",
        "AlienBlaster_Rusty",
        "AlienBlaster_Tuned",
        "AlienBlaster",
        "AlienDisintegrator_Rusty",
        "AlistairSpecial",
        "AllNightware_Lucky",
        "AllNightware_Naughty",
        "AllNightware",
        "AssaultRifle_ArmorPiercing",
        "AssaultRifle_Enhanced",
        "AssaultRifle_Hardened",
        "AssaultRifle_Infiltrator",
        "AssaultRifle_Rusty",
        "AssaultRifle",
        "AssaultronHead",
        "BaseballUniform",
        "BattleArmor_Heavy",
        "BattleArmor_Sturdy",
        "BattleArmor",
        "BBGun_ArmorPiercing",
        "BBGun_Enhanced",
        "BBGun_Hardened",
        "BBGun_RedRocket",
        "BBGun_Rusty",
        "BBGun",
        "BishopSpecial",
        "BittercupSpecial",
        "BOSAssaultRifle_Hardened",
        "BOSCasual",
        "BOSUniform_Advanced",
        "BOSUniform_Expert",
        "BOSUniform",
        "BowlingShirt",
        "ButchSpecial",
        "CafeteriaAnniversary",
        "CafeteriaMinutemen",
        "CafeteriaRailroad",
        "CafeteriaVault33",
        "CheckeredShirt",
        "ColonelSpecial",
        "CombatArmor_Heavy",
        "CombatArmor_Sturdy",
        "CombatArmor",
        "CombatShotgun_CharonsShotgun",
        "CombatShotgun_DoubleBarrelled",
        "CombatShotgun_Enhanced",
        "CombatShotgun_Hardened",
        "CombatShotgun_Rusty",
        "CombatShotgun",
        "ComedianSpecial",
        "CromwellSpecial",
        "DooWopOutfit",
        "EmpressSpecial",
        "EnclaveExterior",
        "EnclavePowerArmor",
        "EnclaveSecurityOutfit",
        "EngineerSpecial",
        "EulogyJonesSpecial",
        "Fatman_Enhanced",
        "Fatman_Guided",
        "Fatman_Hardened",
        "Fatman_Mirv",
        "Fatman_Rusty",
        "Fatman",
        "Flamer_Burnmaster",
        "Flamer_Enhanced",
        "Flamer_Hardened",
        "Flamer_Pressurized",
        "Flamer_Rusty",
        "Flamer",
        "FlightSuit_Advanced",
        "FlightSuit_Expert",
        "FlightSuit",
        "FormalWear_Fancy",
        "FormalWear_Lucky",
        "FormalWear",
        "GatlingLaser_Amplified",
        "GatlingLaser_Focused",
        "GatlingLaser_Rusty",
        "GatlingLaser_Tuned",
        "GatlingLaser_Vengeance",
        "GatlingLaser",
        "GaussPistol_Enhanced",
        "GaussPistol_Focused",
        "GaussPistol_Rusty",
        "GaussRifle_Accelerated",
        "GaussRifle_Enhanced",
        "GaussRifle_Hardened",
        "GaussRifle_Magnetro4000",
        "GaussRifle_Rusty",
        "GaussRifle",
        "GhoulRevolver",
        "GreaserSpecial",
        "GrognaksAxe",
        "HandymanJumpsuit_Advanced",
        "HandymanJumpsuit_Expert",
        "HandymanJumpsuit",
        "HazmatSuit_Heavy",
        "HazmatSuit_Sturdy",
        "HazmatSuit",
        "HunterGear_Bounty",
        "HunterGear_Mutant",
        "HunterGear_Treasure",
        "HuntingRifle_ArmorPiercing",
        "HuntingRifle_Enhanced",
        "HuntingRifle_Hardened",
        "HuntingRifle_OlPainless",
        "HuntingRifle_Rusty",
        "HuntingRifle",
        "InstituteJumper_Advanced",
        "InstituteJumper_Expert",
        "InstitutePistol_Apotheosis",
        "InstitutePistol_Improved",
        "InstitutePistol_Incendiary",
        "InstitutePistol_Scattered",
        "InstitutePistol_Scoped",
        "InstitutePistol",
        "InstituteRifle_Excited",
        "InstituteRifle_Long",
        "InstituteRifle_NightVision",
        "InstituteRifle_Targeting",
        "InstituteRifle_VirgilsRifle",
        "InstituteRifle",
        "JunkJet_Electrified",
        "JunkJet_Flaming",
        "JunkJet_RecoilCompensated",
        "JunkJet_Tactical",
        "JunkJet_TechniciansRevenge",
        "JunkJet",
        "KingSpecial",
        "KnightSpecial",
        "LabCoat_Advanced",
        "LabCoat_Expert",
        "LabCoat",
        "LaserMusket",
        "LaserPistol_Amplified",
        "LaserPistol_Focused",
        "LaserPistol_Rusty",
        "LaserPistol_SmugglersEnd",
        "LaserPistol_Tuned",
        "LaserPistol",
        "LaserRifle_Amplified",
        "LaserRifle_Focused",
        "LaserRifle_Rusty",
        "LaserRifle_Tuned",
        "LaserRifle_WaserWifle",
        "LaserRifle",
        "LibrarianSpecial",
        "LifeguardOutfit",
        "LivingQuartersAnniversary",
        "LivingQuartersBrotherOfStell",
        "LivingQuartersInstitute",
        "LivingQuartersVault33",
        "LucasSpecial",
        "Magnum_ArmorPiercing",
        "Magnum_Blackhawk",
        "Magnum_Enhanced",
        "Magnum_Hardened",
        "Magnum_Rusty",
        "Magnum",
        "MaJuneJacket",
        "MayorSpecial",
        "MechanicJumpsuit",
        "Melee_BaseballBat",
        "Melee_ButcherKnife",
        "Melee_FireHydrantBat",
        "Melee_KitchenKnife",
        "Melee_Pickaxe",
        "Melee_PoolCue",
        "Melee_RaiderSword",
        "MetalArmor_Heavy",
        "MetalArmor_Sturdy",
        "MilitaryJumpsuit_Commander",
        "MilitaryJumpsuit_Officer",
        "MilitaryJumpsuit",
        "Minigun_ArmorPiercing",
        "Minigun_Enhanced",
        "Minigun_Hardened",
        "Minigun_LeadBelcher",
        "Minigun_Rusty",
        "Minigun",
        "MissilLauncher_Enhanced",
        "MissilLauncher_Guided",
        "MissilLauncher_Hardened",
        "MissilLauncher_MissLauncher",
        "MissilLauncher_Rusty",
        "MissilLauncher",
        "MoviefanSpecial",
        "NCR_Ranger",
        "NinjaSuit",
        "PipePistol_Auto",
        "PipePistol_HairTrigger",
        "PipePistol_Heavy",
        "PipePistol_LittleBrother",
        "PipePistol_Scoped",
        "PipePistol",
        "PipeRifle_Bayoneted",
        "PipeRifle_BigSister",
        "PipeRifle_Calibrated",
        "PipeRifle_Long",
        "PipeRifle_NightVision",
        "PipeRifle",
        "PiperSpecial",
        "Pistol_ArmorPiercing",
        "Pistol_Enhanced",
        "Pistol_Hardened",
        "Pistol_LoneWanderer",
        "Pistol_Rusty",
        "Pistol",
        "PlasmaCaster_Enhanced",
        "PlasmaPistol_Amplified",
        "PlasmaPistol_Focused",
        "PlasmaPistol_MPLXNovasurge",
        "PlasmaPistol_Rusty",
        "PlasmaPistol_Tuned",
        "PlasmaPistol",
        "PlasmaRifle_Amplified",
        "PlasmaRifle_Focused",
        "PlasmaRifle_MeanGreenMonster",
        "PlasmaRifle_Rusty",
        "PlasmaRifle_Tuned",
        "PlasmaRifle",
        "PlasmaThrower_Agitated",
        "PlasmaThrower_Boosted",
        "PlasmaThrower_DragonsMaw",
        "PlasmaThrower_Overcharged",
        "PlasmaThrower_Tactical",
        "PlasmaThrower",
        "PolkaDotDress",
        "PowerArmor_51a",
        "PowerArmor_51d",
        "PowerArmor_51f",
        "PowerArmor_MkI",
        "PowerArmor_MkIV",
        "PowerArmor_MkVI",
        "PowerArmor_T45d",
        "PowerArmor_T45f",
        "PowerArmor_T51f",
        "PowerArmor_T60a",
        "PowerArmor_T60d",
        "PowerArmor_T60f",
        "PowerArmor",
        "PowerFist_Enhanced",
        "PrestonSpecial",
        "PrewarCowboy",
        "PrinceSpecial",
        "ProfessorSpecial",
        "PulseRifle_Enhanced",
        "RadiationSuit_Advanced",
        "RadiationSuit_Expert",
        "RadiationSuit",
        "RaiderArmor_Heavy",
        "RaiderArmor_Sturdy",
        "RaiderArmor",
        "Railgun_Accelerated",
        "Railgun_Enhanced",
        "Railgun_Hardened",
        "Railgun_Railmaster",
        "Railgun_Rusty",
        "Railgun",
        "Rifle_ArmorPiercing",
        "Rifle_Enhanced",
        "Rifle_Hardened",
        "Rifle_LincolnsRepeater",
        "Rifle_Rusty",
        "Rifle",
        "RiotGear_Heavy",
        "RiotGear_Sturdy",
        "RiotGear",
        "Ripper_Hardened",
        "RothchildSpecial",
        "RottedDuster",
        "SawedOffShotgun_DoubleBarrelled",
        "SawedOffShotgun_Enhanced",
        "SawedOffShotgun_Hardened",
        "SawedOffShotgun_Kneecapper",
        "SawedOffShotgun_Rusty",
        "SawedOffShotgun",
        "ScarredPowerArmor",
        "ScientistScrubs_Commander",
        "ScientistScrubs_Officer",
        "ScientistScrubs",
        "ScifiSpecial",
        "ScribeRobe_Elder",
        "ScribeRobe_Initiate",
        "ScribeRobe",
        "SequinDress",
        "Shotgun_DoubleBarrelled",
        "Shotgun_Enhanced",
        "Shotgun_FarmersDaughter",
        "Shotgun_Hardened",
        "Shotgun_Rusty",
        "Shotgun",
        "SlasherSpecial",
        "SleazySuit",
        "SleekSuit",
        "SniperRifle_ArmorPiercing",
        "SniperRifle_Enhanced",
        "SniperRifle_Hardened",
        "SniperRifle_Rusty",
        "SniperRifle_VictoryRifle",
        "SniperRifle",
        "SodaFountainDress",
        "SoldierSpecial",
        "SportsfanSpecial",
        "SurgeonSpecial",
        "SurgicalRipper",
        "SurvivorSpecial",
        "SweaterVest",
        "Swimsuit",
        "SynthArmor_Heavy",
        "T60Pistol_ArmorPiercing",
        "T60Pistol_Enhanced",
        "T60Pistol_Hardened",
        "T60Pistol",
        "ThreedogSpecial",
        "TranqPistol_Enhanced",
        "TranqPistol_Rusty",
        "TranqPistol",
        "UltraciteGatling1",
        "UltraciteGatling2",
        "UltracitePlasma1",
        "UltracitePlasma2",
        "UltraciteSword1",
        "UltraciteSword2",
        "UtilityJumpsuit_Heavy",
        "UtilityJumpsuit_Sturdy",
        "UtilityJumpsuit",
        "Vault33Suit",
        "VaultSecurityOutfit",
        "Vest",
        "WandererArmor_Heavy",
        "WandererArmor_Sturdy",
        "WandererArmor",
        "WastelandSurgeon_Doctor",
        "WastelandSurgeon_Settler",
        "WastelandSurgeon",
        "WeddingDress",
        "WorkDress",
        "WrestlerSpecial",
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
      this.updatePets(data, config);
      this.updateJunk(data, config);
      this.manageResources(data, config);
      this.handleExplorers(data, config);
      this.updateMrHandy(data, config);
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
          a.savedRoom > -1,
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
          (dweller) => dweller.serializeId === waitingId,
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
        (actor) => actor.serializeId === actorId,
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
        dweller.name = id;
        dweller.lastName = "";
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

      // Equip best def weapon
      if (config.equipMaxWeapon) {
        dweller.equipedWeapon.id = SaveEditor.BEST_WEAPON_DEF;
      }

      // Equip best outfit
      if (config.equipBestArmor) {
        const room = data.vault.rooms.find((r) =>
          r.dwellers.includes(dweller.serializeId),
        );
        const isWasteland = data.vault.wasteland.teams.find(
          (t) =>
            t.dwellers.find((d) => d.serializeId == dweller.serializeId) !=
            null,
        );
        if (room) {
          const special = SaveEditor.ROOM_STAT_MAP[room.type];
          switch (special) {
            case null:
              if (
                ![
                  SaveEditor.POWER_ARMORS.mix1,
                  SaveEditor.POWER_ARMORS.mix2,
                ].includes(dweller.equipedOutfit.id)
              ) {
                dweller.equipedOutfit.id = SaveEditor.POWER_ARMORS.mix1;
              }
              break;
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
          console.log(
            `Assigned outfit ${dweller.equipedOutfit.id} to dweller ID ${dweller.serializeId} (matched to room ${room.deserializeID}, ${room.type})`,
          );
        } else if (isWasteland) {
          if (
            ![
              SaveEditor.POWER_ARMORS.mix1,
              SaveEditor.POWER_ARMORS.mix2,
            ].includes(dweller.equipedOutfit.id)
          ) {
            dweller.equipedOutfit.id = SaveEditor.POWER_ARMORS.mix1;
            console.log(
              `Assigned outfit ${dweller.equipedOutfit.id} to exploring dweller ID ${dweller.serializeId}`,
            );
          }
        } else {
          console.warn(
            `Could not find assigned room for dweller ID ${dweller.serializeId}`,
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
   * Update vault inventory.
   * Uses config.giveInventoryCounts (a per-item map of { itemId -> targetCount })
   * when config.giveInventory is true. Falls back to config.giveInventoryCount
   * (the old single-count field) if the per-item map is absent, for
   * backward-compatibility with any callers that haven't migrated yet.
   * @param {Object} data - Save data
   * @param {Object} config - Configuration
   */
  updateInventory(data, config) {
    console.log("Updating inventory items...");
    if (config.giveQuestItems) {
      // Add 1 of each quest outfit to inventory
      SaveEditor.QUEST_ITEMS_OUTFITS.forEach((outfitId) => {
        const exists = data.vault.inventory.items.find(
          (item) => item.id === outfitId,
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
          (item) => item.id === weaponId,
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
      /**
       * Returns the target count for a given item ID.
       * Prefers the per-item map (giveInventoryCounts); falls back to the
       * legacy scalar (giveInventoryCount) when the map is missing.
       * @param {string} id
       * @returns {number}
       */
      const targetCountFor = (id) => {
        if (
          config.giveInventoryCounts &&
          config.giveInventoryCounts[id] !== undefined
        ) {
          return config.giveInventoryCounts[id];
        }
        // Legacy fallback
        return config.giveInventoryCount ?? 0;
      };

      // Add outfits to inventory
      if (config.giveInventoryOutfitIds) {
        config.giveInventoryOutfitIds.forEach((outfitId) => {
          const target = targetCountFor(outfitId);
          const currentCount = data.vault.inventory.items.filter(
            (item) => item.id === outfitId,
          ).length;

          const needed = target - currentCount;
          if (needed > 0) {
            console.log(
              `Adding ${needed} of outfit "${outfitId}" (current: ${currentCount}, target: ${target})`,
            );
            for (let i = 0; i < needed; i++) {
              data.vault.inventory.items.push({
                id: outfitId,
                type: "Outfit",
                hasBeenAssigned: false,
                hasRandomWeaponBeenAssigned: false,
              });
            }
          } else {
            console.log(
              `Skipping outfit "${outfitId}" — already at or above target (current: ${currentCount}, target: ${target})`,
            );
          }
        });
      }

      // Add weapons to inventory
      if (config.giveInventoryWeaponIds) {
        config.giveInventoryWeaponIds.forEach((weaponId) => {
          const target = targetCountFor(weaponId);
          const currentCount = data.vault.inventory.items.filter(
            (item) => item.id === weaponId,
          ).length;

          const needed = target - currentCount;
          if (needed > 0) {
            console.log(
              `Adding ${needed} of weapon "${weaponId}" (current: ${currentCount}, target: ${target})`,
            );
            for (let i = 0; i < needed; i++) {
              data.vault.inventory.items.push({
                id: weaponId,
                type: "Weapon",
                hasBeenAssigned: false,
                hasRandomWeaponBeenAssigned: false,
              });
            }
          } else {
            console.log(
              `Skipping weapon "${weaponId}" — already at or above target (current: ${currentCount}, target: ${target})`,
            );
          }
        });
      }
    }
  }

  /**
   * Update vault inventory.
   * Uses config.giveInventoryCounts (a per-item map of { itemId -> targetCount }) when config.giveJunk is true. Will reduce item counts to match target if necessary
   * @param {Object} data - Save data
   * @param {Object} config - Configuration
   */
  updateJunk(data, config) {
    console.log("Updating inventory junk...");
    if (config.giveJunk) {
      Object.keys(config.giveJunkCounts).forEach((junkId) => {
        const target = config.giveJunkCounts[junkId];
        const currentCount = data.vault.inventory.items.filter(
          (item) => item.type === "Junk" && item.id === junkId,
        ).length;

        if (currentCount === target) {
          return;
        }

        console.log(
          `Adjusting count of junk "${junkId}" to ${target} (current: ${currentCount})`,
        );
        data.vault.inventory.items = data.vault.inventory.items.filter(
          (i) => !(i.type === "Junk" && i.id === junkId),
        );
        for (let i = 0; i < target; i++) {
          data.vault.inventory.items.push({
            id: junkId,
            type: "Junk",
            hasBeenAssigned: false,
            hasRandonWeaponBeenAssigned: false,
          });
        }
      });
    }
  }

  /**
   * Update vault inventory.
   * Uses config.givePetCounts (a per-item map of { itemId -> targetCount }) when config.givePets is true. Will not touch pets who are already at or above target.
   * @param {Object} data - Save data
   * @param {Object} config - Configuration
   */
  updatePets(data, config) {
    console.log("Updating inventory pets...");
    if (config.givePets) {
      Object.keys(config.givePetCounts).forEach((petBonus) => {
        const target = config.givePetCounts[petBonus];
        if (target === 0) {
          return;
        }

        const currentCount = data.vault.inventory.items.filter(
          (item) => item.type === "Pet" && item.extraData?.bonus === petBonus,
        ).length;

        const needed = target - currentCount;
        if (needed > 0) {
          console.log(
            `Adding ${needed} of pet "${petBonus}" (current: ${currentCount}, target: ${target})`,
          );
          for (let i = 0; i < needed; i++) {
            data.vault.inventory.items.push(SaveEditor.PETS[petBonus]);
          }
        } else {
          console.log(
            `Skipping pet "${petBonus}" — already at or above target (current: ${currentCount}, target: ${target})`,
          );
        }
      });
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
    if (config.setPokerChipCount) resources.PokerChip = config.pokerChipCount;
    if (config.setUltraciteCount)
      resources.DummyUltracite = config.ultraciteCount;

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
      if (config.setIncreaseExploreTime) {
        explorer.elapsedTimeAliveExploring += 440000;
        explorer.teamEquipment.storage.resources.Nuka += 150000;
      }

      // Give health packs to explorers
      if (config.giveExplorersHealthPacks) {
        explorer.teamEquipment.storage.resources.StimPack = 25;
        explorer.teamEquipment.storage.resources.RadAway = 25;
        explorer.dwellers.forEach((dwellerId) => {
          const dweller = data.dwellers.dwellers.find(
            (d) => d.serializeId === dwellerId,
          );
          if (dweller?.equipment?.storage) {
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

    // Validate per-item inventory counts
    if (config.giveInventory && config.giveInventoryCounts) {
      Object.entries(config.giveInventoryCounts).forEach(([itemId, count]) => {
        const value = Number(count);
        if (isNaN(value) || value < 0) {
          errors.push(
            `Inventory count for "${itemId}" must be a valid non-negative number`,
          );
        }
      });
    }

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
        (box) => box === SaveEditor.LUNCH_BOX_TYPES.lunch,
      ).length,
      mrHandyBoxCount: data.vault.LunchBoxesByType.filter(
        (box) => box === SaveEditor.LUNCH_BOX_TYPES.handy,
      ).length,
      petCrateCount: data.vault.LunchBoxesByType.filter(
        (box) => box === SaveEditor.LUNCH_BOX_TYPES.pet,
      ).length,
      lootCrateCount: data.vault.LunchBoxesByType.filter(
        (box) => box === SaveEditor.LUNCH_BOX_TYPES.loot,
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
      ultraciteCount: data.vault.storage.resources.DummyUltracite,
      pokerChipCount: data.vault.storage.resources.PokerChip,
      // giveInventoryCounts is populated by updatePlaceholders() in the UI layer,
      // since it depends on which item IDs are in the configured lists.
      giveInventoryCounts: {},
      givePetCounts: {},
      giveJunkCounts: {},
    };

    return config;
  }
}
