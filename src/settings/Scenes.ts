import { IModuleSettingsObject } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Scene settings for the FullScreenPokemon instance.
 */
export function GenerateScenesSettings(fsp: FullScreenPokemon): IModuleSettingsObject {
    "use strict";

    return {
        cutscenes: {
            DaisyTownMap: {
                firstRoutine: "Greeting",
                routines: fsp.cutscenes.daisyTownMap
            },
            ElderTraining: {
                firstRoutine: "StartBattle",
                routines: fsp.cutscenes.elderTraining
            },
            Intro: {
                firstRoutine: "FadeIn",
                routines: fsp.cutscenes.intro
            },
            OakIntro: {
                firstRoutine: "FirstDialog",
                routines: fsp.cutscenes.oakIntro
            },
            OakIntroPokemonChoice: {
                firstRoutine: "PlayerChecksPokeball",
                routines: fsp.cutscenes.oakIntroPokemonChoice
            },
            OakIntroRivalBattle: {
                routines: fsp.cutscenes.oakIntroRivalBattle
            },
            OakIntroRivalLeaves: {
                firstRoutine: "AfterBattle",
                routines: fsp.cutscenes.oakIntroRivalLeaves
            },
            OakParcelPickup: {
                firstRoutine: "Greeting",
                routines: fsp.cutscenes.oakParcelPickup
            },
            OakParcelDelivery: {
                firstRoutine: "Greeting",
                routines: fsp.cutscenes.oakParcelDelivery
            },
            PokeCenter: {
                firstRoutine: "Welcome",
                routines: fsp.cutscenes.pokeCenter
            },
            PokeMart: {
                firstRoutine: "Greeting",
                routines: fsp.cutscenes.pokeMart
            },
            RivalRoute22: {
                firstRoutine: "RivalEmerges",
                routines: fsp.cutscenes.rivalRoute22
            },
            TrainerSpotted: {
                firstRoutine: "Exclamation",
                routines: fsp.cutscenes.trainerSpotted
            }
        }
    };
}
