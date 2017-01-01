import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Mod to make all enemy trainers blind.
 */
export class BlindTrainersMod<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Blind Trainers";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        onModEnable: (): void => {
            this.gameStarter.objectMaker.getClass("SightDetector").prototype.nocollide = true;
        },
        onModDisable: (): void => {
            this.gameStarter.objectMaker.getClass("SightDetector").prototype.nocollide = false;
        }
    };
}
