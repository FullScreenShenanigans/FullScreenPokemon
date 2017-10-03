import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ModComponent } from "./ModComponent";

/**
 * Mod to make all enemy trainers blind.
 */
export class BlindTrainersMod<TGameStartr extends FullScreenPokemon> extends ModComponent<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Blind Trainers";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            this.gameStarter.objectMaker.getClass("SightDetector").prototype.nocollide = true;
        },
        [this.eventNames.onModDisable]: (): void => {
            this.gameStarter.objectMaker.getClass("SightDetector").prototype.nocollide = false;
        }
    };
}
