import { FrameTickr } from "frametickr";

import { ICharacter, IThing } from "../components/Things";
import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Runner settings for the FullScreenPokemon instance.
 */
export const createFrameTicker = (fsp: FullScreenPokemon): FrameTickr =>
    new FrameTickr({
        interval: 1000 / 60,
        frame: (adjustedTimestamp: DOMHighResTimeStamp) => {
            fsp.fpsAnalyzer.tick(adjustedTimestamp);

            fsp.pixelDrawer.refillGlobalCanvas();

            fsp.quadsKeeper.determineAllQuadrants("Terrain", fsp.groupHolder.getGroup("Terrain") as IThing[]);
            fsp.quadsKeeper.determineAllQuadrants("Scenery", fsp.groupHolder.getGroup("Scenery") as IThing[]);
            fsp.quadsKeeper.determineAllQuadrants("Solid", fsp.groupHolder.getGroup("Solid") as IThing[]);

            fsp.maintenance.maintainGeneric(fsp.groupHolder.getGroup("Text") as IThing[]);
            fsp.maintenance.maintainGeneric(fsp.groupHolder.getGroup("Terrain") as IThing[]);
            fsp.maintenance.maintainGeneric(fsp.groupHolder.getGroup("Scenery") as IThing[]);
            fsp.maintenance.maintainGeneric(fsp.groupHolder.getGroup("Solid") as IThing[]);
            fsp.maintenance.maintainCharacters(fsp.groupHolder.getGroup("Character") as ICharacter[]);
            fsp.maintenance.maintainPlayer(fsp.players[0]);

            fsp.timeHandler.advance();
        },
        ...fsp.settings.components.frameTicker,
    });
