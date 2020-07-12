import { ICallbackRegister, IMod } from "modattachr";

import { IThing } from "../Things";
import { ModComponent } from "./ModComponent";

/**
 * Mod to allow the trainer to walk through walls.
 */
export class WalkThroughWallsMod extends ModComponent implements IMod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Walk Through Walls";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            this.game.objectMaker.getPrototypeOf<IThing>("Solid").collide = (): boolean => true;
        },
        [this.eventNames.onModDisable]: (): void => {
            this.game.objectMaker.getPrototypeOf<IThing>("Solid").collide = (): boolean => false;
        },
    };
}
