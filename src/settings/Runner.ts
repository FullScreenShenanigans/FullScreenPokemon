import { IRunnerModuleSettings } from "gamestartr/lib/IGameStartr";

import { ICharacter, IThing } from "../components/Things";
import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Runner settings for the FullScreenPokemon instance.
 */
export function GenerateRunnerSettings(fsp: FullScreenPokemon): IRunnerModuleSettings {
    "use strict";

    return {
        interval: 1000 / 60,
        adjustFramerate: true,
        games: [
            (): void => {
                fsp.pixelDrawer.refillGlobalCanvas();
            },
            (): void => {
                fsp.quadsKeeper.determineAllQuadrants("Terrain", fsp.groupHolder.getGroup("Terrain") as IThing[]);
                fsp.quadsKeeper.determineAllQuadrants("Scenery", fsp.groupHolder.getGroup("Scenery") as IThing[]);
                fsp.quadsKeeper.determineAllQuadrants("Solid", fsp.groupHolder.getGroup("Solid") as IThing[]);
            },
            (): void => {
                fsp.maintenance.maintainGeneric(fsp.groupHolder.getGroup("Text") as IThing[]);
            },
            (): void => {
                fsp.maintenance.maintainGeneric(fsp.groupHolder.getGroup("Terrain") as IThing[]);
            },
            (): void => {
                fsp.maintenance.maintainGeneric(fsp.groupHolder.getGroup("Scenery") as IThing[]);
            },
            (): void => {
                fsp.maintenance.maintainGeneric(fsp.groupHolder.getGroup("Solid") as IThing[]);
            },
            (): void => {
                fsp.maintenance.maintainCharacters(fsp.groupHolder.getGroup("Character") as ICharacter[]);
            },
            (): void => {
                fsp.maintenance.maintainPlayer(fsp.players[0]);
            },
            (): void => {
                fsp.timeHandler.handleEvents();
            }
        ]
    };
}
