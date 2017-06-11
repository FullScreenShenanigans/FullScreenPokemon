import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ModComponent } from "./ModComponent";

/**
 * Mod to prevent the player from encountering any wild Pokemon.
 */
export class InfiniteRepelMod<TGameStartr extends FullScreenPokemon> extends ModComponent<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Infinite Repel";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            this.gameStarter.actions.grass.checkPlayerGrassBattle = (): boolean => false;
        },
        [this.eventNames.onModDisable]: (): void => {
            delete this.gameStarter.actions.grass.checkPlayerGrassBattle;
        }
    };
}
