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
                routines: fsp.cutscenes.battle,
                scope: fsp.cutscenes.battle
            },
            DaisyTownMap: {
                firstRoutine: "Greeting",
                routines: fsp.cutscenes.daisyTownMap,
                scope: fsp.cutscenes.daisyTownMap
            },
            ElderTraining: {
                firstRoutine: "StartBattle",
                routines: fsp.cutscenes.elderTraining,
                scope: fsp.cutscenes.elderTraining
            },
            Intro: {
                firstRoutine: "FadeIn",
                routines: fsp.cutscenes.intro,
                scope: fsp.cutscenes.intro
            },
            OakIntro: {
                firstRoutine: "FirstDialog",
                routines: fsp.cutscenes.oakIntro,
                scope: fsp.cutscenes.oakIntro
            },
            OakIntroPokemonChoice: {
                firstRoutine: "PlayerChecksPokeball",
                routines: fsp.cutscenes.oakIntroPokemonChoice,
                scope: fsp.cutscenes.oakIntroPokemonChoice
            },
            OakIntroRivalBattle: {
                routines: fsp.cutscenes.oakIntroRivalBattle,
                scope: fsp.cutscenes.oakIntroRivalBattle
            },
            OakIntroRivalLeaves: {
                firstRoutine: "AfterBattle",
                routines: fsp.cutscenes.oakIntroRivalLeaves,
                scope: fsp.cutscenes.oakIntroRivalLeaves
            },
            OakParcelPickup: {
                firstRoutine: "Greeting",
                routines: fsp.cutscenes.oakParcelPickup,
                scope: fsp.cutscenes.oakParcelPickup
            },
            OakParcelDelivery: {
                firstRoutine: "Greeting",
                routines: fsp.cutscenes.oakParcelDelivery,
                scope: fsp.cutscenes.oakParcelDelivery
            },
            PokeCenter: {
                firstRoutine: "Welcome",
                routines: fsp.cutscenes.pokeCenter,
                scope: fsp.cutscenes.pokeCenter
            },
            PokeMart: {
                firstRoutine: "Greeting",
                routines: fsp.cutscenes.pokeMart,
                scope: fsp.cutscenes.pokeMart
            },
            RivalRoute22: {
                firstRoutine: "RivalEmerges",
                routines: fsp.cutscenes.rivalRoute22,
                scope: fsp.cutscenes.rivalRoute22
            },
            TrainerSpotted: {
                firstRoutine: "Exclamation",
                routines: fsp.cutscenes.trainerSpotted,
                scope: fsp.cutscenes.trainerSpotted
            }
        }
    };
}
