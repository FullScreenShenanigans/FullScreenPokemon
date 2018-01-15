import { ICallbackRegister, IMod } from "modattachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IThing } from "../Things";
import { ModComponent } from "./ModComponent";

/**
 * Mod to allow the trainer to walk through walls.
 */
export class WalkThroughWallsMod<TGameStartr extends FullScreenPokemon> extends ModComponent<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Walk Through Walls";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            this.gameStarter.objectMaker.getPrototypeOf<IThing>("Solid").collide = (): boolean => true;
        },
        [this.eventNames.onModDisable]: (): void => {
            this.gameStarter.objectMaker.getPrototypeOf<IThing>("Solid").collide = (): boolean => false;
        },
    };
}
