FullScreenPokemon.prototype.settings.scenes = {
    "cutscenes": {
        "Battle": {
            "firstRoutine": "Entrance",
            "routines": {
                "Entrance": FullScreenPokemon.prototype.cutsceneBattleEntrance,
                "OpeningText": FullScreenPokemon.prototype.cutsceneBattleOpeningText,
                "EnemyIntro": FullScreenPokemon.prototype.cutsceneBattleEnemyIntro,
                "PlayerIntro": FullScreenPokemon.prototype.cutsceneBattlePlayerIntro,
                "ShowPlayerMenu": FullScreenPokemon.prototype.cutsceneBattleShowPlayerMenu,
                "OpponentSendOut": FullScreenPokemon.prototype.cutsceneBattleOpponentSendOut,
                "OpponentSendOutAppear": FullScreenPokemon.prototype.cutsceneBattleOpponentSendOutAppear,
                "PlayerSendOut": FullScreenPokemon.prototype.cutsceneBattlePlayerSendOut,
                "PlayerSendOutAppear": FullScreenPokemon.prototype.cutsceneBattlePlayerSendOutAppear,
                "MovePlayer": FullScreenPokemon.prototype.cutsceneBattleMovePlayer,
                "MovePlayerAnimate": FullScreenPokemon.prototype.cutsceneBattleMovePlayerAnimate,
                "MoveOpponent": FullScreenPokemon.prototype.cutsceneBattleMoveOpponent,
                "MoveOpponentAnimate": FullScreenPokemon.prototype.cutsceneBattleMoveOpponentAnimate,
                "Damage": FullScreenPokemon.prototype.cutsceneBattleDamage,
                "PokemonFaints": FullScreenPokemon.prototype.cutsceneBattlePokemonFaints,
                "AfterPlayerPokemonFaints": FullScreenPokemon.prototype.cutsceneBattleAfterPlayerPokemonFaints,
                "AfterOpponentPokemonFaints": FullScreenPokemon.prototype.cutsceneBattleAfterOpponentPokemonFaints,
                "ExperienceGain": FullScreenPokemon.prototype.cutsceneBattleExperienceGain,
                "LevelUp": FullScreenPokemon.prototype.cutsceneBattleLevelUp,
                "LevelUpStats": FullScreenPokemon.prototype.cutsceneBattleLevelUpStats,
                "BattleExitFail": FullScreenPokemon.prototype.cutsceneBattleExitFail,
                "BattleExitFailReturn": FullScreenPokemon.prototype.cutsceneBattleExitFailReturn,
                "Victory": FullScreenPokemon.prototype.cutsceneBattleVictory,
                "VictorySpeech": FullScreenPokemon.prototype.cutsceneBattleVictorySpeech,
                "VictoryWinnings": FullScreenPokemon.prototype.cutsceneBattleVictoryWinnings,
                "Defeat": FullScreenPokemon.prototype.cutsceneBattleDefeat,
                "Complete": FullScreenPokemon.prototype.cutsceneBattleComplete,
                // Attack utilities
                "ChangeStatistic": FullScreenPokemon.prototype.cutsceneBattleChangeStatistic,
                // Attack animations
                "AttackGrowl": FullScreenPokemon.prototype.cutsceneBattleAttackGrowl,
                "AttackTackle": FullScreenPokemon.prototype.cutsceneBattleAttackTackle,
                "AttackTailWhip": FullScreenPokemon.prototype.cutsceneBattleAttackTailWhip
            }
        },
        "TrainerSpotted": {
            "firstRoutine": "Exclamation",
            "routines": {
                "Exclamation": FullScreenPokemon.prototype.cutsceneTrainerSpottedExclamation,
                "Approach": FullScreenPokemon.prototype.cutsceneTrainerSpottedApproach,
                "Dialog": FullScreenPokemon.prototype.cutsceneTrainerSpottedDialog
            }
        },
        "PokeCenter": {
            "firstRoutine": "Welcome",
            "routines": {
                "Welcome": FullScreenPokemon.prototype.cutscenePokeCenterWelcome,
                "Choose": FullScreenPokemon.prototype.cutscenePokeCenterChoose,
                "ChooseHeal": FullScreenPokemon.prototype.cutscenePokeCenterChooseHeal,
                "Healing": FullScreenPokemon.prototype.cutscenePokeCenterHealing,
                "HealingAction": FullScreenPokemon.prototype.cutscenePokeCenterHealingAction,
                "HealingComplete": FullScreenPokemon.prototype.cutscenePokeCenterHealingComplete,
                "ChooseCancel": FullScreenPokemon.prototype.cutscenePokeCenterChooseCancel,
            }
        },
        "PokeMart": {
            "firstRoutine": "Greeting",
            "routines": {
                "Greeting": FullScreenPokemon.prototype.cutscenePokeMartGreeting,
                "Options": FullScreenPokemon.prototype.cutscenePokeMartOptions,
                "BuyMenu": FullScreenPokemon.prototype.cutscenePokeMartBuyMenu,
                "SelectAmount": FullScreenPokemon.prototype.cutscenePokeMartSelectAmount,
                "ConfirmPurchase": FullScreenPokemon.prototype.cutscenePokeMartConfirmPurchase,
                "CancelPurchase": FullScreenPokemon.prototype.cutscenePokeMartCancelPurchase,
                "TryPurchase": FullScreenPokemon.prototype.cutscenePokeMartTryPurchase,
                "FailPurchase": FullScreenPokemon.prototype.cutscenePokeMartFailPurchase,
                "ContinueShopping": FullScreenPokemon.prototype.cutscenePokeMartContinueShopping,
                "Exit": FullScreenPokemon.prototype.cutscenePokeMartExit
            }
        },
        "Intro": {
            "firstRoutine": "FirstDialog",
            "routines": {
                "FirstDialog": FullScreenPokemon.prototype.cutsceneIntroFirstDialog,
                "FirstDialogFade": FullScreenPokemon.prototype.cutsceneIntroFirstDialogFade,
                "PokemonExpo": FullScreenPokemon.prototype.cutsceneIntroPokemonExpo,
                "PokemonExplanation": FullScreenPokemon.prototype.cutsceneIntroPokemonExplanation,
                "PlayerAppear": FullScreenPokemon.prototype.cutsceneIntroPlayerAppear,
                "PlayerName": FullScreenPokemon.prototype.cutsceneIntroPlayerName,
                "PlayerSlide": FullScreenPokemon.prototype.cutsceneIntroPlayerSlide,
                "PlayerNameOptions": FullScreenPokemon.prototype.cutsceneIntroPlayerNameOptions,
                "PlayerNameFromMenu": FullScreenPokemon.prototype.cutsceneIntroPlayerNameFromMenu,
                "PlayerNameFromKeyboard": FullScreenPokemon.prototype.cutsceneIntroPlayerNameFromKeyboard,
                "PlayerNameConfirm": FullScreenPokemon.prototype.cutsceneIntroPlayerNameConfirm,
                "PlayerNameComplete": FullScreenPokemon.prototype.cutsceneIntroPlayerNameComplete,
                "RivalAppear": FullScreenPokemon.prototype.cutsceneIntroRivalAppear,
                "RivalName": FullScreenPokemon.prototype.cutsceneIntroRivalName,
                "RivalSlide": FullScreenPokemon.prototype.cutsceneIntroRivalSlide,
                "RivalNameOptions": FullScreenPokemon.prototype.cutsceneIntroRivalNameOptions,
                "RivalNameFromMenu": FullScreenPokemon.prototype.cutsceneIntroRivalNameFromMenu,
                "RivalNameFromKeyboard": FullScreenPokemon.prototype.cutsceneIntroRivalNameFromKeyboard,
                "RivalNameConfirm": FullScreenPokemon.prototype.cutsceneIntroRivalNameConfirm,
                "RivalNameComplete": FullScreenPokemon.prototype.cutsceneIntroRivalNameComplete,
                "LastDialogAppear": FullScreenPokemon.prototype.cutsceneIntroLastDialogAppear,
                "LastDialog": FullScreenPokemon.prototype.cutsceneIntroLastDialog,
                "ShrinkPlayer": FullScreenPokemon.prototype.cutsceneIntroShrinkPlayer,
                "FadeOut": FullScreenPokemon.prototype.cutsceneIntroFadeOut,
                "Finish": FullScreenPokemon.prototype.cutsceneIntroFinish
            }
        },
        "OakIntro": {
            "firstRoutine": "FirstDialog",
            "routines": {
                "FirstDialog": FullScreenPokemon.prototype.cutsceneOakIntroFirstDialog,
                "Exclamation": FullScreenPokemon.prototype.cutsceneOakIntroExclamation,
                "Catchup": FullScreenPokemon.prototype.cutsceneOakIntroCatchup,
                "GrassWarning": FullScreenPokemon.prototype.cutsceneOakIntroGrassWarning,
                "FollowToLab": FullScreenPokemon.prototype.cutsceneOakIntroFollowToLab,
                "EnterLab": FullScreenPokemon.prototype.cutsceneOakIntroEnterLab,
                "WalkToTable": FullScreenPokemon.prototype.cutsceneOakIntroWalkToTable,
                "RivalComplain": FullScreenPokemon.prototype.cutsceneOakIntroRivalComplain,
                "OakThinksToRival": FullScreenPokemon.prototype.cutsceneOakIntroOakThinksToRival,
                "RivalProtests": FullScreenPokemon.prototype.cutsceneOakIntroRivalProtests,
                "OakRespondsToProtest": FullScreenPokemon.prototype.cutsceneOakIntroOakRespondsToProtest,
            }
        },
        "OakIntroPokemonChoice": {
            "firstRoutine": "PlayerChecksPokeball",
            "routines": {
                "PlayerChecksPokeball": FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerChecksPokeball,
                "PlayerDecidesPokemon": FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerDecidesPokemon,
                "PlayerTakesPokemon": FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerTakesPokemon,
                "PlayerChoosesNickname": FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerChoosesNickname,
                "PlayerSetsNickname": FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerSetsNickname,
                "RivalWalksToPokemon": FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoiceRivalWalksToPokemon,
                "RivalTakesPokemon": FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoiceRivalTakesPokemon
            }
        },
        "OakIntroRivalBattle": {
            "routines": {
                "Challenge": FullScreenPokemon.prototype.cutsceneOakIntroRivalBattleChallenge,
                "Approach": FullScreenPokemon.prototype.cutsceneOakIntroRivalBattleApproach
            }
        },
        "OakIntroRivalLeaves": {
            "firstRoutine": "AfterBattle",
            "routines": {
                "AfterBattle": FullScreenPokemon.prototype.cutsceneOakIntroRivalLeavesAfterBattle,
                "Complaint": FullScreenPokemon.prototype.cutsceneOakIntroRivalLeavesComplaint,
                "Goodbye": FullScreenPokemon.prototype.cutsceneOakIntroRivalLeavesGoodbye,
                "Walking": FullScreenPokemon.prototype.cutsceneOakIntroRivalLeavesWalking
            }
        },
        "OakParcelPickup": {
            "firstRoutine": "Greeting",
            "routines": {
                "Greeting": FullScreenPokemon.prototype.cutsceneOakParcelPickupGreeting,
                "WalkToCounter": FullScreenPokemon.prototype.cutsceneOakParcelPickupWalkToCounter,
                "CounterDialog": FullScreenPokemon.prototype.cutsceneOakParcelPickupCounterDialog
            }
        },
        "OakParcelDelivery": {
            "firstRoutine": "Greeting",
            "routines": {
                "Greeting": FullScreenPokemon.prototype.cutsceneOakParcelDeliveryGreeting,
                "RivalInterrupts": FullScreenPokemon.prototype.cutsceneOakParcelDeliveryRivalInterrupts,
                "RivalWalksUp": FullScreenPokemon.prototype.cutsceneOakParcelDeliveryRivalWalksUp,
                "RivalInquires": FullScreenPokemon.prototype.cutsceneOakParcelDeliveryRivalInquires,
                "OakRequests": FullScreenPokemon.prototype.cutsceneOakParcelDeliveryOakRequests,
                "OakDescribesPokedex": FullScreenPokemon.prototype.cutsceneOakParcelDeliveryOakDescribesPokedex,
                "OakGivesPokedex": FullScreenPokemon.prototype.cutsceneOakParcelDeliveryOakGivesPokedex,
                "OakDescribesGoal": FullScreenPokemon.prototype.cutsceneOakParcelDeliveryOakDescribesGoal,
                "RivalAccepts": FullScreenPokemon.prototype.cutsceneOakParcelDeliveryRivalAccepts
            }
        },
        "DaisyTownMap": {
            "firstRoutine": "Greeting",
            "routines": {
                "Greeting": FullScreenPokemon.prototype.cutsceneDaisyTownMapGreeting,
                "ReceiveMap": FullScreenPokemon.prototype.cutsceneDaisyTownMapReceiveMap
            }
        },
        "OldManTraining": {
            "firstRoutine": "StartBattle",
            "routines": {
                "StartBattle": FullScreenPokemon.prototype.cutsceneOldManTrainingStartBattle
            }
        },
        "RivalRoute22": {
            "firstRoutine": "RivalEmerges",
            "routines": {
                "RivalEmerges": FullScreenPokemon.prototype.cutsceneRivalRoute22RivalEmerges,
                "RivalTalks": FullScreenPokemon.prototype.cutsceneRivalRoute22RivalTalks
            }
        }
    }
};