FullScreenPokemon.FullScreenPokemon.settings.scenes = {
    "cutscenes": {
        "Battle": {
            "firstRoutine": "Entrance",
            "routines": {
                "Entrance": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleEntrance,
                "OpeningText": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleOpeningText,
                "EnemyIntro": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleEnemyIntro,
                "PlayerIntro": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattlePlayerIntro,
                "ShowPlayerMenu": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleShowPlayerMenu,
                "OpponentSendOut": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleOpponentSendOut,
                "OpponentSendOutAppear": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleOpponentSendOutAppear,
                "PlayerSendOut": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattlePlayerSendOut,
                "PlayerSendOutAppear": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattlePlayerSendOutAppear,
                "PlayerSwitchesSamePokemon": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattlePlayerSwitchesSamePokemon,
                "MovePlayer": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleMovePlayer,
                "MovePlayerAnimate": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleMovePlayerAnimate,
                "MoveOpponent": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleMoveOpponent,
                "MoveOpponentAnimate": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleMoveOpponentAnimate,
                "Damage": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleDamage,
                "PokemonFaints": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattlePokemonFaints,
                "AfterPlayerPokemonFaints": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleAfterPlayerPokemonFaints,
                "AfterOpponentPokemonFaints": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleAfterOpponentPokemonFaints,
                "OpponentSwitchesPokemon": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleOpponentSwitchesPokemon,
                "ExperienceGain": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleExperienceGain,
                "LevelUp": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleLevelUp,
                "LevelUpStats": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleLevelUpStats,
                "BattleExitFail": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleExitFail,
                "BattleExitFailReturn": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleExitFailReturn,
                "Victory": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleVictory,
                "VictorySpeech": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleVictorySpeech,
                "VictoryWinnings": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleVictoryWinnings,
                "Defeat": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleDefeat,
                "Complete": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleComplete,
                // Attack utilities
                "ChangeStatistic": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleChangeStatistic,
                // Attack animations
                "AttackGrowl": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleAttackGrowl,
                "AttackTackle": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleAttackTackle,
                "AttackTailWhip": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneBattleAttackTailWhip
            }
        },
        "TrainerSpotted": {
            "firstRoutine": "Exclamation",
            "routines": {
                "Exclamation": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneTrainerSpottedExclamation,
                "Approach": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneTrainerSpottedApproach,
                "Dialog": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneTrainerSpottedDialog
            }
        },
        "PokeCenter": {
            "firstRoutine": "Welcome",
            "routines": {
                "Welcome": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeCenterWelcome,
                "Choose": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeCenterChoose,
                "ChooseHeal": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeCenterChooseHeal,
                "Healing": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeCenterHealing,
                "HealingAction": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeCenterHealingAction,
                "HealingComplete": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeCenterHealingComplete,
                "ChooseCancel": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeCenterChooseCancel,
            }
        },
        "PokeMart": {
            "firstRoutine": "Greeting",
            "routines": {
                "Greeting": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeMartGreeting,
                "Options": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeMartOptions,
                "BuyMenu": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeMartBuyMenu,
                "SelectAmount": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeMartSelectAmount,
                "ConfirmPurchase": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeMartConfirmPurchase,
                "CancelPurchase": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeMartCancelPurchase,
                "TryPurchase": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeMartTryPurchase,
                "FailPurchase": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeMartFailPurchase,
                "ContinueShopping": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeMartContinueShopping,
                "Exit": FullScreenPokemon.FullScreenPokemon.prototype.cutscenePokeMartExit
            }
        },
        "Intro": {
            "firstRoutine": "FadeIn",
            "routines": {
                "FadeIn": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroFadeIn,
                "FirstDialog": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroFirstDialog,
                "FirstDialogFade": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroFirstDialogFade,
                "PokemonExpo": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroPokemonExpo,
                "PokemonExplanation": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroPokemonExplanation,
                "PlayerAppear": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroPlayerAppear,
                "PlayerName": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroPlayerName,
                "PlayerSlide": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroPlayerSlide,
                "PlayerNameOptions": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroPlayerNameOptions,
                "PlayerNameFromMenu": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroPlayerNameFromMenu,
                "PlayerNameFromKeyboard": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroPlayerNameFromKeyboard,
                "PlayerNameConfirm": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroPlayerNameConfirm,
                "PlayerNameComplete": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroPlayerNameComplete,
                "RivalAppear": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroRivalAppear,
                "RivalName": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroRivalName,
                "RivalSlide": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroRivalSlide,
                "RivalNameOptions": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroRivalNameOptions,
                "RivalNameFromMenu": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroRivalNameFromMenu,
                "RivalNameFromKeyboard": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroRivalNameFromKeyboard,
                "RivalNameConfirm": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroRivalNameConfirm,
                "RivalNameComplete": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroRivalNameComplete,
                "LastDialogAppear": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroLastDialogAppear,
                "LastDialog": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroLastDialog,
                "ShrinkPlayer": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroShrinkPlayer,
                "FadeOut": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroFadeOut,
                "Finish": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneIntroFinish
            }
        },
        "OakIntro": {
            "firstRoutine": "FirstDialog",
            "routines": {
                "FirstDialog": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroFirstDialog,
                "Exclamation": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroExclamation,
                "Catchup": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroCatchup,
                "GrassWarning": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroGrassWarning,
                "FollowToLab": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroFollowToLab,
                "EnterLab": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroEnterLab,
                "WalkToTable": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroWalkToTable,
                "RivalComplain": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroRivalComplain,
                "OakThinksToRival": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroOakThinksToRival,
                "RivalProtests": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroRivalProtests,
                "OakRespondsToProtest": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroOakRespondsToProtest,
            }
        },
        "OakIntroPokemonChoice": {
            "firstRoutine": "PlayerChecksPokeball",
            "routines": {
                "PlayerChecksPokeball": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerChecksPokeball,
                "PlayerDecidesPokemon": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerDecidesPokemon,
                "PlayerTakesPokemon": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerTakesPokemon,
                "PlayerChoosesNickname": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerChoosesNickname,
                "PlayerSetsNickname": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerSetsNickname,
                "RivalWalksToPokemon": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoiceRivalWalksToPokemon,
                "RivalTakesPokemon": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoiceRivalTakesPokemon
            }
        },
        "OakIntroRivalBattle": {
            "routines": {
                "Challenge": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroRivalBattleChallenge,
                "Approach": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroRivalBattleApproach
            }
        },
        "OakIntroRivalLeaves": {
            "firstRoutine": "AfterBattle",
            "routines": {
                "AfterBattle": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroRivalLeavesAfterBattle,
                "Complaint": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroRivalLeavesComplaint,
                "Goodbye": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroRivalLeavesGoodbye,
                "Walking": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakIntroRivalLeavesWalking
            }
        },
        "OakParcelPickup": {
            "firstRoutine": "Greeting",
            "routines": {
                "Greeting": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakParcelPickupGreeting,
                "WalkToCounter": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakParcelPickupWalkToCounter,
                "CounterDialog": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakParcelPickupCounterDialog
            }
        },
        "OakParcelDelivery": {
            "firstRoutine": "Greeting",
            "routines": {
                "Greeting": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakParcelDeliveryGreeting,
                "RivalInterrupts": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakParcelDeliveryRivalInterrupts,
                "RivalWalksUp": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakParcelDeliveryRivalWalksUp,
                "RivalInquires": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakParcelDeliveryRivalInquires,
                "OakRequests": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakParcelDeliveryOakRequests,
                "OakDescribesPokedex": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakParcelDeliveryOakDescribesPokedex,
                "OakGivesPokedex": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakParcelDeliveryOakGivesPokedex,
                "OakDescribesGoal": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakParcelDeliveryOakDescribesGoal,
                "RivalAccepts": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneOakParcelDeliveryRivalAccepts
            }
        },
        "DaisyTownMap": {
            "firstRoutine": "Greeting",
            "routines": {
                "Greeting": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneDaisyTownMapGreeting,
                "ReceiveMap": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneDaisyTownMapReceiveMap
            }
        },
        "ElderTraining": {
            "firstRoutine": "StartBattle",
            "routines": {
                "StartBattle": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneElderTrainingStartBattle
            }
        },
        "RivalRoute22": {
            "firstRoutine": "RivalEmerges",
            "routines": {
                "RivalEmerges": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneRivalRoute22RivalEmerges,
                "RivalTalks": FullScreenPokemon.FullScreenPokemon.prototype.cutsceneRivalRoute22RivalTalks
            }
        }
    }
};