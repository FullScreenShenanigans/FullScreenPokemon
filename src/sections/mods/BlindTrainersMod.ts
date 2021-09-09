import { CallbackRegister, Mod } from "modattachr";

import { Character } from "../Actors";
import { ModComponent } from "./ModComponent";

/**
 * Mod to make all enemy trainers blind.
 */
export class BlindTrainersMod extends ModComponent implements Mod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Blind Trainers";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: CallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            this.game.objectMaker.getPrototypeOf<Character>("SightDetector").nocollide = true;
        },
        [this.eventNames.onModDisable]: (): void => {
            this.game.objectMaker.getPrototypeOf<Character>("SightDetector").nocollide = false;
        },
    };
}
