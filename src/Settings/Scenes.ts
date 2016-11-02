/// <reference path="../../typings/GameStartr.d.ts" />

import { Cutscenes } from "../Cutscenes";

export function GenerateScenesSettings(): GameStartr.IScenePlayrCustoms {
    "use strict";

    return {
        cutscenes: {
            Battle: {
                firstRoutine: "Entrance",
                routines: {
                    Entrance: Cutscenes.prototype.cutsceneBattleEntrance,
                    OpeningText: Cutscenes.prototype.cutsceneBattleOpeningText,
                    OpponentIntro: Cutscenes.prototype.cutsceneBattleOpponentIntro,
                    PlayerIntro: Cutscenes.prototype.cutsceneBattlePlayerIntro,
                    ShowPlayerMenu: Cutscenes.prototype.cutsceneBattleShowPlayerMenu,
                    OpponentSendOut: Cutscenes.prototype.cutsceneBattleOpponentSendOut,
                    OpponentSendOutAppear: Cutscenes.prototype.cutsceneBattleOpponentSendOutAppear,
                    PlayerSendOut: Cutscenes.prototype.cutsceneBattlePlayerSendOut,
                    PlayerSendOutAppear: Cutscenes.prototype.cutsceneBattlePlayerSendOutAppear,
                    PlayerSwitchesSamePokemon: Cutscenes.prototype.cutsceneBattlePlayerSwitchesSamePokemon,
                    MovePlayer: Cutscenes.prototype.cutsceneBattleMovePlayer,
                    MovePlayerAnimate: Cutscenes.prototype.cutsceneBattleMovePlayerAnimate,
                    MoveOpponent: Cutscenes.prototype.cutsceneBattleMoveOpponent,
                    MoveOpponentAnimate: Cutscenes.prototype.cutsceneBattleMoveOpponentAnimate,
                    Damage: Cutscenes.prototype.cutsceneBattleDamage,
                    PokemonFaints: Cutscenes.prototype.cutsceneBattlePokemonFaints,
                    AfterPlayerPokemonFaints: Cutscenes.prototype.cutsceneBattleAfterPlayerPokemonFaints,
                    AfterOpponentPokemonFaints: Cutscenes.prototype.cutsceneBattleAfterOpponentPokemonFaints,
                    OpponentSwitchesPokemon: Cutscenes.prototype.cutsceneBattleOpponentSwitchesPokemon,
                    ExperienceGain: Cutscenes.prototype.cutsceneBattleExperienceGain,
                    LevelUp: Cutscenes.prototype.cutsceneBattleLevelUp,
                    LevelUpStats: Cutscenes.prototype.cutsceneBattleLevelUpStats,
                    BattleExitFail: Cutscenes.prototype.cutsceneBattleExitFail,
                    BattleExitFailReturn: Cutscenes.prototype.cutsceneBattleExitFailReturn,
                    Victory: Cutscenes.prototype.cutsceneBattleVictory,
                    VictorySpeech: Cutscenes.prototype.cutsceneBattleVictorySpeech,
                    VictoryWinnings: Cutscenes.prototype.cutsceneBattleVictoryWinnings,
                    Defeat: Cutscenes.prototype.cutsceneBattleDefeat,
                    Complete: Cutscenes.prototype.cutsceneBattleComplete,
                    // Attack utilities
                    ChangeStatistic: Cutscenes.prototype.cutsceneBattleChangeStatistic,
                    // Attack animations
                    AttackGrowl: Cutscenes.prototype.cutsceneBattleAttackGrowl,
                    AttackTackle: Cutscenes.prototype.cutsceneBattleAttackTackle,
                    AttackTailWhip: Cutscenes.prototype.cutsceneBattleAttackTailWhip,
                    AttackScratch: Cutscenes.prototype.cutsceneBattleAttackScratch,
                    AttackEmber: Cutscenes.prototype.cutsceneBattleAttackEmber,
                    AttackQuickAttack: Cutscenes.prototype.cutsceneBattleAttackQuickAttack,
                    AttackSandAttack: Cutscenes.prototype.cutsceneBattleAttackSandAttack
                }
            },
            TrainerSpotted: {
                firstRoutine: "Exclamation",
                routines: {
                    Exclamation: Cutscenes.prototype.cutsceneTrainerSpottedExclamation,
                    Approach: Cutscenes.prototype.cutsceneTrainerSpottedApproach,
                    Dialog: Cutscenes.prototype.cutsceneTrainerSpottedDialog
                }
            },
            PokeCenter: {
                firstRoutine: "Welcome",
                routines: {
                    Welcome: Cutscenes.prototype.cutscenePokeCenterWelcome,
                    Choose: Cutscenes.prototype.cutscenePokeCenterChoose,
                    ChooseHeal: Cutscenes.prototype.cutscenePokeCenterChooseHeal,
                    Healing: Cutscenes.prototype.cutscenePokeCenterHealing,
                    HealingAction: Cutscenes.prototype.cutscenePokeCenterHealingAction,
                    HealingComplete: Cutscenes.prototype.cutscenePokeCenterHealingComplete,
                    ChooseCancel: Cutscenes.prototype.cutscenePokeCenterChooseCancel,
                }
            },
            PokeMart: {
                firstRoutine: "Greeting",
                routines: {
                    Greeting: Cutscenes.prototype.cutscenePokeMartGreeting,
                    Options: Cutscenes.prototype.cutscenePokeMartOptions,
                    BuyMenu: Cutscenes.prototype.cutscenePokeMartBuyMenu,
                    SelectAmount: Cutscenes.prototype.cutscenePokeMartSelectAmount,
                    ConfirmPurchase: Cutscenes.prototype.cutscenePokeMartConfirmPurchase,
                    CancelPurchase: Cutscenes.prototype.cutscenePokeMartCancelPurchase,
                    TryPurchase: Cutscenes.prototype.cutscenePokeMartTryPurchase,
                    FailPurchase: Cutscenes.prototype.cutscenePokeMartFailPurchase,
                    ContinueShopping: Cutscenes.prototype.cutscenePokeMartContinueShopping,
                    Exit: Cutscenes.prototype.cutscenePokeMartExit
                }
            },
            Intro: {
                firstRoutine: "FadeIn",
                routines: {
                    FadeIn: Cutscenes.prototype.cutsceneIntroFadeIn,
                    FirstDialog: Cutscenes.prototype.cutsceneIntroFirstDialog,
                    FirstDialogFade: Cutscenes.prototype.cutsceneIntroFirstDialogFade,
                    PokemonExpo: Cutscenes.prototype.cutsceneIntroPokemonExpo,
                    PokemonExplanation: Cutscenes.prototype.cutsceneIntroPokemonExplanation,
                    PlayerAppear: Cutscenes.prototype.cutsceneIntroPlayerAppear,
                    PlayerName: Cutscenes.prototype.cutsceneIntroPlayerName,
                    PlayerSlide: Cutscenes.prototype.cutsceneIntroPlayerSlide,
                    PlayerNameOptions: Cutscenes.prototype.cutsceneIntroPlayerNameOptions,
                    PlayerNameFromMenu: Cutscenes.prototype.cutsceneIntroPlayerNameFromMenu,
                    PlayerNameFromKeyboard: Cutscenes.prototype.cutsceneIntroPlayerNameFromKeyboard,
                    PlayerNameConfirm: Cutscenes.prototype.cutsceneIntroPlayerNameConfirm,
                    PlayerNameComplete: Cutscenes.prototype.cutsceneIntroPlayerNameComplete,
                    RivalAppear: Cutscenes.prototype.cutsceneIntroRivalAppear,
                    RivalName: Cutscenes.prototype.cutsceneIntroRivalName,
                    RivalSlide: Cutscenes.prototype.cutsceneIntroRivalSlide,
                    RivalNameOptions: Cutscenes.prototype.cutsceneIntroRivalNameOptions,
                    RivalNameFromMenu: Cutscenes.prototype.cutsceneIntroRivalNameFromMenu,
                    RivalNameFromKeyboard: Cutscenes.prototype.cutsceneIntroRivalNameFromKeyboard,
                    RivalNameConfirm: Cutscenes.prototype.cutsceneIntroRivalNameConfirm,
                    RivalNameComplete: Cutscenes.prototype.cutsceneIntroRivalNameComplete,
                    LastDialogAppear: Cutscenes.prototype.cutsceneIntroLastDialogAppear,
                    LastDialog: Cutscenes.prototype.cutsceneIntroLastDialog,
                    ShrinkPlayer: Cutscenes.prototype.cutsceneIntroShrinkPlayer,
                    FadeOut: Cutscenes.prototype.cutsceneIntroFadeOut,
                    Finish: Cutscenes.prototype.cutsceneIntroFinish
                }
            },
            OakIntro: {
                firstRoutine: "FirstDialog",
                routines: {
                    FirstDialog: Cutscenes.prototype.cutsceneOakIntroFirstDialog,
                    Exclamation: Cutscenes.prototype.cutsceneOakIntroExclamation,
                    Catchup: Cutscenes.prototype.cutsceneOakIntroCatchup,
                    GrassWarning: Cutscenes.prototype.cutsceneOakIntroGrassWarning,
                    FollowToLab: Cutscenes.prototype.cutsceneOakIntroFollowToLab,
                    EnterLab: Cutscenes.prototype.cutsceneOakIntroEnterLab,
                    WalkToTable: Cutscenes.prototype.cutsceneOakIntroWalkToTable,
                    RivalComplain: Cutscenes.prototype.cutsceneOakIntroRivalComplain,
                    OakThinksToRival: Cutscenes.prototype.cutsceneOakIntroOakThinksToRival,
                    RivalProtests: Cutscenes.prototype.cutsceneOakIntroRivalProtests,
                    OakRespondsToProtest: Cutscenes.prototype.cutsceneOakIntroOakRespondsToProtest,
                }
            },
            OakIntroPokemonChoice: {
                firstRoutine: "PlayerChecksPokeball",
                routines: {
                    PlayerChecksPokeball: Cutscenes.prototype.cutsceneOakIntroPokemonChoicePlayerChecksPokeball,
                    PlayerDecidesPokemon: Cutscenes.prototype.cutsceneOakIntroPokemonChoicePlayerDecidesPokemon,
                    PlayerTakesPokemon: Cutscenes.prototype.cutsceneOakIntroPokemonChoicePlayerTakesPokemon,
                    PlayerChoosesNickname: Cutscenes.prototype.cutsceneOakIntroPokemonChoicePlayerChoosesNickname,
                    PlayerSetsNickname: Cutscenes.prototype.cutsceneOakIntroPokemonChoicePlayerSetsNickname,
                    RivalWalksToPokemon: Cutscenes.prototype.cutsceneOakIntroPokemonChoiceRivalWalksToPokemon,
                    RivalTakesPokemon: Cutscenes.prototype.cutsceneOakIntroPokemonChoiceRivalTakesPokemon
                }
            },
            OakIntroRivalBattle: {
                routines: {
                    Challenge: Cutscenes.prototype.cutsceneOakIntroRivalBattleChallenge,
                    Approach: Cutscenes.prototype.cutsceneOakIntroRivalBattleApproach
                }
            },
            OakIntroRivalLeaves: {
                firstRoutine: "AfterBattle",
                routines: {
                    AfterBattle: Cutscenes.prototype.cutsceneOakIntroRivalLeavesAfterBattle,
                    Complaint: Cutscenes.prototype.cutsceneOakIntroRivalLeavesComplaint,
                    Goodbye: Cutscenes.prototype.cutsceneOakIntroRivalLeavesGoodbye,
                    Walking: Cutscenes.prototype.cutsceneOakIntroRivalLeavesWalking
                }
            },
            OakParcelPickup: {
                firstRoutine: "Greeting",
                routines: {
                    Greeting: Cutscenes.prototype.cutsceneOakParcelPickupGreeting,
                    WalkToCounter: Cutscenes.prototype.cutsceneOakParcelPickupWalkToCounter,
                    CounterDialog: Cutscenes.prototype.cutsceneOakParcelPickupCounterDialog
                }
            },
            OakParcelDelivery: {
                firstRoutine: "Greeting",
                routines: {
                    Greeting: Cutscenes.prototype.cutsceneOakParcelDeliveryGreeting,
                    RivalInterrupts: Cutscenes.prototype.cutsceneOakParcelDeliveryRivalInterrupts,
                    RivalWalksUp: Cutscenes.prototype.cutsceneOakParcelDeliveryRivalWalksUp,
                    RivalInquires: Cutscenes.prototype.cutsceneOakParcelDeliveryRivalInquires,
                    OakRequests: Cutscenes.prototype.cutsceneOakParcelDeliveryOakRequests,
                    OakDescribesPokedex: Cutscenes.prototype.cutsceneOakParcelDeliveryOakDescribesPokedex,
                    OakGivesPokedex: Cutscenes.prototype.cutsceneOakParcelDeliveryOakGivesPokedex,
                    OakDescribesGoal: Cutscenes.prototype.cutsceneOakParcelDeliveryOakDescribesGoal,
                    RivalAccepts: Cutscenes.prototype.cutsceneOakParcelDeliveryRivalAccepts
                }
            },
            DaisyTownMap: {
                firstRoutine: "Greeting",
                routines: {
                    Greeting: Cutscenes.prototype.cutsceneDaisyTownMapGreeting,
                    ReceiveMap: Cutscenes.prototype.cutsceneDaisyTownMapReceiveMap
                }
            },
            ElderTraining: {
                firstRoutine: "StartBattle",
                routines: {
                    StartBattle: Cutscenes.prototype.cutsceneElderTrainingStartBattle
                }
            },
            RivalRoute22: {
                firstRoutine: "RivalEmerges",
                routines: {
                    RivalEmerges: Cutscenes.prototype.cutsceneRivalRoute22RivalEmerges,
                    RivalTalks: Cutscenes.prototype.cutsceneRivalRoute22RivalTalks
                }
            }
        }
    };
}
