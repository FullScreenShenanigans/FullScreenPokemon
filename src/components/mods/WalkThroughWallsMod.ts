import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ModComponent } from "./ModComponent";

/**
 * Mod to allow the trainer to walk through walls.
 */
export class WalkThroughWallsMod<TGameStartr extends FullScreenPokemon> extends ModComponent<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Walk Through Walls";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            this.gameStarter.objectMaker.getClass("Solid").prototype.collide = (): boolean => true;
        },
        [this.eventNames.onModDisable]: (): void => {
            this.gameStarter.objectMaker.getClass("Solid").prototype.collide = (): boolean => false;
        }
    };
}
