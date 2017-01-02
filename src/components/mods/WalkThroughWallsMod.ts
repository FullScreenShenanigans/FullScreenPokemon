import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Mod to allow the trainer to walk through walls.
 */
export class WalkThroughWallsMod<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Walk Through Walls";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        onModEnable: (): void => {
            this.gameStarter.objectMaker.getClass("Solid").prototype.collide = (): boolean => true;
        },
        onModDisable: (): void => {
            this.gameStarter.objectMaker.getClass("Solid").prototype.collide = (): boolean => false;
        }
    };
}
