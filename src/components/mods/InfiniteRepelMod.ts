import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Mod to prevent the player from encountering any wild Pokemon.
 */
export class InfiniteRepelMod<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Infinite Repel";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        onModEnable: (): void => {
            this.gameStarter.actions.grass.checkPlayerGrassBattle = (): boolean => false;
        },
        onModDisable: (): void => {
            delete this.gameStarter.actions.grass.checkPlayerGrassBattle;
        }
    };
}
