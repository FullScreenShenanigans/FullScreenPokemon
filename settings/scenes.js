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
                "BattleExitFail": FullScreenPokemon.prototype.cutsceneBattleExitFail,
                "BattleExitFailReturn": FullScreenPokemon.prototype.cutsceneBattleExitFailReturn,
                "Victory": FullScreenPokemon.prototype.cutsceneBattleVictory,
                "Defeat": FullScreenPokemon.prototype.cutsceneBattleDefeat,
                // Attack animations
                "AttackTackle": FullScreenPokemon.prototype.cutsceneBattleAttackTackle
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
                "RivalWalksToPokemon": FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoiceRivalWalksToPokemon,
                "RivalTakesPokemon": FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoiceRivalTakesPokemon
            }
        },
        "OakIntroRivalBattle": {
            "routines": {
                "Challenge": FullScreenPokemon.prototype.cutsceneOakIntroRivalBattleChallenge,
                "Approach": FullScreenPokemon.prototype.cutsceneOakIntroRivalBattleApproach
            }
        }
    }
};