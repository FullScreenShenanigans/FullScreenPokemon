import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Mod to make the player move really quickly.
 */
export class SpeedrunnerMod<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IMod {
    /**
     * Class name for the player's prototype.
     */
    private static playerClassName: string = "Player";

    /**
     * Name of the mod.
     */
    public readonly name: string = "Speedrunner";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        onModEnable: (): void => {
            const stats: any = this.gameStarter.objectMaker.getClass(SpeedrunnerMod.playerClassName).prototype;
            this.gameStarter.players[0].speed = stats.speed = 10;
        },
        onModDisable: (): void => {
            const stats: any = this.gameStarter.objectMaker.getClass(SpeedrunnerMod.playerClassName).prototype;
            const oldSpeed: number = this.gameStarter.moduleSettings.objects!.properties![SpeedrunnerMod.playerClassName].speed;
            this.gameStarter.players[0].speed = stats.speed = oldSpeed;
        }
    };
}
