import { IAudioModuleSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param _fsp   A generating FullScreenPokemon instance.
 * @returns Audio settings for the FullScreenPokemon instance.
 */
export function GenerateAudioSettings(_fsp: FullScreenPokemon): IAudioModuleSettings {
    "use strict";

    return {
        directory: "sounds",
        fileTypes: ["mp3"],
        library: {
            Sounds: [
                "Menu Bleep",
                "Open Pause Menu"
            ],
            Themes: [
                "Battle Gym Leader",
                "Battle Trainer",
                "Battle Wild Pokemon",
                "Bill Origin from Cerulean",
                "Casino",
                "Celadon City",
                "Cerulean City",
                "Cerulean from Mount Moon",
                "Cinnabor Island",
                "Cycling",
                "Ending",
                "Evolution",
                "Guide",
                "Gym",
                "Into the Hall",
                "Item Fanfare",
                "Jigglypuff Song",
                "Last Battle Rival",
                "Lavender Town from Vermilion",
                "Lavender Town",
                "Level Up Fanfare",
                "Mt Moon Cave",
                "Oak Research Lab",
                "Ocean",
                "Opening Part 1",
                "Opening Part 2",
                "Pallet Town",
                "Pewter City",
                "PokeCenter",
                "Pokemon Capture Fanfare",
                "Pokemon Fanfare 1",
                "Pokemon Fanfare 2",
                "Pokemon Mansion",
                "Pokemon Received Fanfare",
                "Pokemon Recovery",
                "Pokemon Tower",
                "Professor Oak",
                "Rival Appears",
                "St Anne",
                "Sylph Company",
                "Team Rocket Hideout",
                "The Last Road",
                "Trainer Appears Bad Guy",
                "Trainer Appears Boy",
                "Trainer Appears Girl",
                "Vermilion City",
                "Victory Gym Leader",
                "Victory Trainer",
                "Victory Wild Pokemon",
                "Viridian City from Pallet Town",
                "Viridian Forest"
            ]
        }
    };
}
