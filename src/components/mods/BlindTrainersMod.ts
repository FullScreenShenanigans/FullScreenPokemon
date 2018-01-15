import { ICallbackRegister, IMod } from "modattachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ICharacter } from "../Things";
import { ModComponent } from "./ModComponent";

/**
 * Mod to make all enemy trainers blind.
 */
export class BlindTrainersMod<TGameStartr extends FullScreenPokemon> extends ModComponent<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Blind Trainers";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            this.gameStarter.objectMaker.getPrototypeOf<ICharacter>("SightDetector").nocollide = true;
        },
        [this.eventNames.onModDisable]: (): void => {
            this.gameStarter.objectMaker.getPrototypeOf<ICharacter>("SightDetector").nocollide = false;
        },
    };
}
