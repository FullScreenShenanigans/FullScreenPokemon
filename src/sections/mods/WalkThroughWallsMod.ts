import { CallbackRegister, Mod } from "modattachr";

import { Actor } from "../Actors";
import { ModComponent } from "./ModComponent";

/**
 * Mod to allow the trainer to walk through walls.
 */
export class WalkThroughWallsMod extends ModComponent implements Mod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Walk Through Walls";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: CallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            this.game.objectMaker.getPrototypeOf<Actor>("Solid").collide = (): boolean => true;
        },
        [this.eventNames.onModDisable]: (): void => {
            this.game.objectMaker.getPrototypeOf<Actor>("Solid").collide = (): boolean => false;
        },
    };
}
