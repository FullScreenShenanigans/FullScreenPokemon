import { IScenesModuleSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Scene settings for the FullScreenPokemon instance.
 */
export function GenerateScenesSettings(fsp: FullScreenPokemon): IScenesModuleSettings {
    "use strict";

    return {
        cutscenes: {
            Battle: {
                firstRoutine: "Entrance",
                routines: {
                    Entrance: fsp.cutscenes.cutsceneBattleEntrance.bind(fsp.cutscenes),
                    OpeningText: fsp.cutscenes.cutsceneBattleOpeningText.bind(fsp.cutscenes),
                    OpponentIntro: fsp.cutscenes.cutsceneBattleOpponentIntro.bind(fsp.cutscenes),
                    PlayerIntro: fsp.cutscenes.cutsceneBattlePlayerIntro.bind(fsp.cutscenes),
                    ShowPlayerMenu: fsp.cutscenes.cutsceneBattleShowPlayerMenu.bind(fsp.cutscenes),
                    OpponentSendOut: fsp.cutscenes.cutsceneBattleOpponentSendOut.bind(fsp.cutscenes),
                    OpponentSendOutAppear: fsp.cutscenes.cutsceneBattleOpponentSendOutAppear.bind(fsp.cutscenes),
                    PlayerSendOut: fsp.cutscenes.cutsceneBattlePlayerSendOut.bind(fsp.cutscenes),
                    PlayerSendOutAppear: fsp.cutscenes.cutsceneBattlePlayerSendOutAppear.bind(fsp.cutscenes),
                    PlayerSwitchesSamePokemon: fsp.cutscenes.cutsceneBattlePlayerSwitchesSamePokemon.bind(fsp.cutscenes),
                    MovePlayer: fsp.cutscenes.cutsceneBattleMovePlayer.bind(fsp.cutscenes),
                    MovePlayerAnimate: fsp.cutscenes.cutsceneBattleMovePlayerAnimate.bind(fsp.cutscenes),
                    MoveOpponent: fsp.cutscenes.cutsceneBattleMoveOpponent.bind(fsp.cutscenes),
                    MoveOpponentAnimate: fsp.cutscenes.cutsceneBattleMoveOpponentAnimate.bind(fsp.cutscenes),
                    Damage: fsp.cutscenes.cutsceneBattleDamage.bind(fsp.cutscenes),
                    PokemonFaints: fsp.cutscenes.cutsceneBattlePokemonFaints.bind(fsp.cutscenes),
                    AfterPlayerPokemonFaints: fsp.cutscenes.cutsceneBattleAfterPlayerPokemonFaints.bind(fsp.cutscenes),
                    AfterOpponentPokemonFaints: fsp.cutscenes.cutsceneBattleAfterOpponentPokemonFaints.bind(fsp.cutscenes),
                    OpponentSwitchesPokemon: fsp.cutscenes.cutsceneBattleOpponentSwitchesPokemon.bind(fsp.cutscenes),
                    ExperienceGain: fsp.cutscenes.cutsceneBattleExperienceGain.bind(fsp.cutscenes),
                    LevelUp: fsp.cutscenes.cutsceneBattleLevelUp.bind(fsp.cutscenes),
                    LevelUpStats: fsp.cutscenes.cutsceneBattleLevelUpStats.bind(fsp.cutscenes),
                    BattleExitFail: fsp.cutscenes.cutsceneBattleExitFail.bind(fsp.cutscenes),
                    BattleExitFailReturn: fsp.cutscenes.cutsceneBattleExitFailReturn.bind(fsp.cutscenes),
                    Victory: fsp.cutscenes.cutsceneBattleVictory.bind(fsp.cutscenes),
                    VictorySpeech: fsp.cutscenes.cutsceneBattleVictorySpeech.bind(fsp.cutscenes),
                    VictoryWinnings: fsp.cutscenes.cutsceneBattleVictoryWinnings.bind(fsp.cutscenes),
                    Defeat: fsp.cutscenes.cutsceneBattleDefeat.bind(fsp.cutscenes),
                    Complete: fsp.cutscenes.cutsceneBattleComplete.bind(fsp.cutscenes),
                    // Attack utilities
                    ChangeStatistic: fsp.cutscenes.cutsceneBattleChangeStatistic.bind(fsp.cutscenes),
                    // Attack animations
                    AttackGrowl: fsp.cutscenes.cutsceneBattleAttackGrowl.bind(fsp.cutscenes),
                    AttackTackle: fsp.cutscenes.cutsceneBattleAttackTackle.bind(fsp.cutscenes),
                    AttackTailWhip: fsp.cutscenes.cutsceneBattleAttackTailWhip.bind(fsp.cutscenes),
                    AttackScratch: fsp.cutscenes.cutsceneBattleAttackScratch.bind(fsp.cutscenes),
                    AttackEmber: fsp.cutscenes.cutsceneBattleAttackEmber.bind(fsp.cutscenes),
                    AttackQuickAttack: fsp.cutscenes.cutsceneBattleAttackQuickAttack.bind(fsp.cutscenes),
                    AttackBubble: fsp.cutscenes.cutsceneBattleAttackBubble.bind(fsp.cutscenes),
                    AttackSandAttack: fsp.cutscenes.cutsceneBattleAttackSandAttack.bind(fsp.cutscenes),
                    AttackGust: fsp.cutscenes.cutsceneBattleAttackGust.bind(fsp.cutscenes)
                }
            },
            TrainerSpotted: {
                firstRoutine: "Exclamation",
                routines: {
                    Exclamation: fsp.cutscenes.cutsceneTrainerSpottedExclamation.bind(fsp.cutscenes),
                    Approach: fsp.cutscenes.cutsceneTrainerSpottedApproach.bind(fsp.cutscenes),
                    Dialog: fsp.cutscenes.cutsceneTrainerSpottedDialog.bind(fsp.cutscenes)
                }
            },
            PokeCenter: {
                firstRoutine: "Welcome",
                routines: {
                    Welcome: fsp.cutscenes.cutscenePokeCenterWelcome.bind(fsp.cutscenes),
                    Choose: fsp.cutscenes.cutscenePokeCenterChoose.bind(fsp.cutscenes),
                    ChooseHeal: fsp.cutscenes.cutscenePokeCenterChooseHeal.bind(fsp.cutscenes),
                    Healing: fsp.cutscenes.cutscenePokeCenterHealing.bind(fsp.cutscenes),
                    HealingAction: fsp.cutscenes.cutscenePokeCenterHealingAction.bind(fsp.cutscenes),
                    HealingComplete: fsp.cutscenes.cutscenePokeCenterHealingComplete.bind(fsp.cutscenes),
                    ChooseCancel: fsp.cutscenes.cutscenePokeCenterChooseCancel.bind(fsp.cutscenes),
                }
            },
            PokeMart: {
                firstRoutine: "Greeting",
                routines: {
                    Greeting: fsp.cutscenes.cutscenePokeMartGreeting.bind(fsp.cutscenes),
                    Options: fsp.cutscenes.cutscenePokeMartOptions.bind(fsp.cutscenes),
                    BuyMenu: fsp.cutscenes.cutscenePokeMartBuyMenu.bind(fsp.cutscenes),
                    SelectAmount: fsp.cutscenes.cutscenePokeMartSelectAmount.bind(fsp.cutscenes),
                    ConfirmPurchase: fsp.cutscenes.cutscenePokeMartConfirmPurchase.bind(fsp.cutscenes),
                    CancelPurchase: fsp.cutscenes.cutscenePokeMartCancelPurchase.bind(fsp.cutscenes),
                    TryPurchase: fsp.cutscenes.cutscenePokeMartTryPurchase.bind(fsp.cutscenes),
                    FailPurchase: fsp.cutscenes.cutscenePokeMartFailPurchase.bind(fsp.cutscenes),
                    ContinueShopping: fsp.cutscenes.cutscenePokeMartContinueShopping.bind(fsp.cutscenes),
                    Exit: fsp.cutscenes.cutscenePokeMartExit.bind(fsp.cutscenes)
                }
            },
            Intro: {
                firstRoutine: "FadeIn",
                routines: {
                    FadeIn: fsp.cutscenes.cutsceneIntroFadeIn.bind(fsp.cutscenes),
                    FirstDialog: fsp.cutscenes.cutsceneIntroFirstDialog.bind(fsp.cutscenes),
                    FirstDialogFade: fsp.cutscenes.cutsceneIntroFirstDialogFade.bind(fsp.cutscenes),
                    PokemonExpo: fsp.cutscenes.cutsceneIntroPokemonExpo.bind(fsp.cutscenes),
                    PokemonExplanation: fsp.cutscenes.cutsceneIntroPokemonExplanation.bind(fsp.cutscenes),
                    PlayerAppear: fsp.cutscenes.cutsceneIntroPlayerAppear.bind(fsp.cutscenes),
                    PlayerName: fsp.cutscenes.cutsceneIntroPlayerName.bind(fsp.cutscenes),
                    PlayerSlide: fsp.cutscenes.cutsceneIntroPlayerSlide.bind(fsp.cutscenes),
                    PlayerNameOptions: fsp.cutscenes.cutsceneIntroPlayerNameOptions.bind(fsp.cutscenes),
                    PlayerNameFromMenu: fsp.cutscenes.cutsceneIntroPlayerNameFromMenu.bind(fsp.cutscenes),
                    PlayerNameFromKeyboard: fsp.cutscenes.cutsceneIntroPlayerNameFromKeyboard.bind(fsp.cutscenes),
                    PlayerNameConfirm: fsp.cutscenes.cutsceneIntroPlayerNameConfirm.bind(fsp.cutscenes),
                    PlayerNameComplete: fsp.cutscenes.cutsceneIntroPlayerNameComplete.bind(fsp.cutscenes),
                    RivalAppear: fsp.cutscenes.cutsceneIntroRivalAppear.bind(fsp.cutscenes),
                    RivalName: fsp.cutscenes.cutsceneIntroRivalName.bind(fsp.cutscenes),
                    RivalSlide: fsp.cutscenes.cutsceneIntroRivalSlide.bind(fsp.cutscenes),
                    RivalNameOptions: fsp.cutscenes.cutsceneIntroRivalNameOptions.bind(fsp.cutscenes),
                    RivalNameFromMenu: fsp.cutscenes.cutsceneIntroRivalNameFromMenu.bind(fsp.cutscenes),
                    RivalNameFromKeyboard: fsp.cutscenes.cutsceneIntroRivalNameFromKeyboard.bind(fsp.cutscenes),
                    RivalNameConfirm: fsp.cutscenes.cutsceneIntroRivalNameConfirm.bind(fsp.cutscenes),
                    RivalNameComplete: fsp.cutscenes.cutsceneIntroRivalNameComplete.bind(fsp.cutscenes),
                    LastDialogAppear: fsp.cutscenes.cutsceneIntroLastDialogAppear.bind(fsp.cutscenes),
                    LastDialog: fsp.cutscenes.cutsceneIntroLastDialog.bind(fsp.cutscenes),
                    ShrinkPlayer: fsp.cutscenes.cutsceneIntroShrinkPlayer.bind(fsp.cutscenes),
                    FadeOut: fsp.cutscenes.cutsceneIntroFadeOut.bind(fsp.cutscenes),
                    Finish: fsp.cutscenes.cutsceneIntroFinish.bind(fsp.cutscenes)
                }
            },
            OakIntro: {
                firstRoutine: "FirstDialog",
                routines: {
                    FirstDialog: fsp.cutscenes.cutsceneOakIntroFirstDialog.bind(fsp.cutscenes),
                    Exclamation: fsp.cutscenes.cutsceneOakIntroExclamation.bind(fsp.cutscenes),
                    Catchup: fsp.cutscenes.cutsceneOakIntroCatchup.bind(fsp.cutscenes),
                    GrassWarning: fsp.cutscenes.cutsceneOakIntroGrassWarning.bind(fsp.cutscenes),
                    FollowToLab: fsp.cutscenes.cutsceneOakIntroFollowToLab.bind(fsp.cutscenes),
                    EnterLab: fsp.cutscenes.cutsceneOakIntroEnterLab.bind(fsp.cutscenes),
                    WalkToTable: fsp.cutscenes.cutsceneOakIntroWalkToTable.bind(fsp.cutscenes),
                    RivalComplain: fsp.cutscenes.cutsceneOakIntroRivalComplain.bind(fsp.cutscenes),
                    OakThinksToRival: fsp.cutscenes.cutsceneOakIntroOakThinksToRival.bind(fsp.cutscenes),
                    RivalProtests: fsp.cutscenes.cutsceneOakIntroRivalProtests.bind(fsp.cutscenes),
                    OakRespondsToProtest: fsp.cutscenes.cutsceneOakIntroOakRespondsToProtest.bind(fsp.cutscenes),
                }
            },
            OakIntroPokemonChoice: {
                firstRoutine: "PlayerChecksPokeball",
                routines: {
                    PlayerChecksPokeball: fsp.cutscenes.cutsceneOakIntroPokemonChoicePlayerChecksPokeball.bind(fsp.cutscenes),
                    PlayerDecidesPokemon: fsp.cutscenes.cutsceneOakIntroPokemonChoicePlayerDecidesPokemon.bind(fsp.cutscenes),
                    PlayerTakesPokemon: fsp.cutscenes.cutsceneOakIntroPokemonChoicePlayerTakesPokemon.bind(fsp.cutscenes),
                    PlayerChoosesNickname: fsp.cutscenes.cutsceneOakIntroPokemonChoicePlayerChoosesNickname.bind(fsp.cutscenes),
                    PlayerSetsNickname: fsp.cutscenes.cutsceneOakIntroPokemonChoicePlayerSetsNickname.bind(fsp.cutscenes),
                    RivalWalksToPokemon: fsp.cutscenes.cutsceneOakIntroPokemonChoiceRivalWalksToPokemon.bind(fsp.cutscenes),
                    RivalTakesPokemon: fsp.cutscenes.cutsceneOakIntroPokemonChoiceRivalTakesPokemon.bind(fsp.cutscenes)
                }
            },
            OakIntroRivalBattle: {
                routines: {
                    Challenge: fsp.cutscenes.cutsceneOakIntroRivalBattleChallenge.bind(fsp.cutscenes),
                    Approach: fsp.cutscenes.cutsceneOakIntroRivalBattleApproach.bind(fsp.cutscenes)
                }
            },
            OakIntroRivalLeaves: {
                firstRoutine: "AfterBattle",
                routines: {
                    AfterBattle: fsp.cutscenes.cutsceneOakIntroRivalLeavesAfterBattle.bind(fsp.cutscenes),
                    Complaint: fsp.cutscenes.cutsceneOakIntroRivalLeavesComplaint.bind(fsp.cutscenes),
                    Goodbye: fsp.cutscenes.cutsceneOakIntroRivalLeavesGoodbye.bind(fsp.cutscenes),
                    Walking: fsp.cutscenes.cutsceneOakIntroRivalLeavesWalking.bind(fsp.cutscenes)
                }
            },
            OakParcelPickup: {
                firstRoutine: "Greeting",
                routines: {
                    Greeting: fsp.cutscenes.cutsceneOakParcelPickupGreeting,
                    WalkToCounter: fsp.cutscenes.cutsceneOakParcelPickupWalkToCounter.bind(fsp.cutscenes),
                    CounterDialog: fsp.cutscenes.cutsceneOakParcelPickupCounterDialog.bind(fsp.cutscenes)
                }
            },
            OakParcelDelivery: {
                firstRoutine: "Greeting",
                routines: {
                    Greeting: fsp.cutscenes.cutsceneOakParcelDeliveryGreeting.bind(fsp.cutscenes),
                    RivalInterrupts: fsp.cutscenes.cutsceneOakParcelDeliveryRivalInterrupts.bind(fsp.cutscenes),
                    RivalWalksUp: fsp.cutscenes.cutsceneOakParcelDeliveryRivalWalksUp.bind(fsp.cutscenes),
                    RivalInquires: fsp.cutscenes.cutsceneOakParcelDeliveryRivalInquires.bind(fsp.cutscenes),
                    OakRequests: fsp.cutscenes.cutsceneOakParcelDeliveryOakRequests.bind(fsp.cutscenes),
                    OakDescribesPokedex: fsp.cutscenes.cutsceneOakParcelDeliveryOakDescribesPokedex.bind(fsp.cutscenes),
                    OakGivesPokedex: fsp.cutscenes.cutsceneOakParcelDeliveryOakGivesPokedex.bind(fsp.cutscenes),
                    OakDescribesGoal: fsp.cutscenes.cutsceneOakParcelDeliveryOakDescribesGoal.bind(fsp.cutscenes),
                    RivalAccepts: fsp.cutscenes.cutsceneOakParcelDeliveryRivalAccepts.bind(fsp.cutscenes)
                }
            },
            DaisyTownMap: {
                firstRoutine: "Greeting",
                routines: {
                    Greeting: fsp.cutscenes.cutsceneDaisyTownMapGreeting.bind(fsp.cutscenes),
                    ReceiveMap: fsp.cutscenes.cutsceneDaisyTownMapReceiveMap.bind(fsp.cutscenes)
                }
            },
            ElderTraining: {
                firstRoutine: "StartBattle",
                routines: {
                    StartBattle: fsp.cutscenes.cutsceneElderTrainingStartBattle.bind(fsp.cutscenes)
                }
            },
            RivalRoute22: {
                firstRoutine: "RivalEmerges",
                routines: {
                    RivalEmerges: fsp.cutscenes.cutsceneRivalRoute22RivalEmerges.bind(fsp.cutscenes),
                    RivalTalks: fsp.cutscenes.cutsceneRivalRoute22RivalTalks.bind(fsp.cutscenes)
                }
            }
        }
    };
}
