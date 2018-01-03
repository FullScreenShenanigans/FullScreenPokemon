import { IGamesRunnrSettings } from "gamesrunnr";

import { ICharacter, IThing } from "../components/Things";
import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Runner settings for the FullScreenPokemon instance.
 */
export const GenerateRunnerSettings = (fsp: FullScreenPokemon): Partial<IGamesRunnrSettings> => ({
    interval: 1000 / 60,
    games: [
        (): void => {
            fsp.fpsAnalyzer.tick();
        },
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
        },
    ],
});
