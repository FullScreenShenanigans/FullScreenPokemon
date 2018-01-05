import { ICallbackRegister, IMod } from "modattachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ModComponent } from "./ModComponent";

/**
 * Mod to make the player move really quickly.
 */
export class SpeedRunningMod<TGameStartr extends FullScreenPokemon> extends ModComponent<TGameStartr> implements IMod {
    /**
     * Class name for the player's prototype.
     */
    private static readonly playerClassName = "Player";

    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Speed Running";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            const stats: any = this.gameStarter.objectMaker.getClass(SpeedRunningMod.playerClassName).prototype;
            this.gameStarter.players[0].speed = stats.speed = 10;
        },
        [this.eventNames.onModDisable]: (): void => {
            const stats: any = this.gameStarter.objectMaker.getClass(SpeedRunningMod.playerClassName).prototype;
            const oldSpeed: number = this.gameStarter.settings.components.objects!.properties![SpeedRunningMod.playerClassName].speed;
            this.gameStarter.players[0].speed = stats.speed = oldSpeed;
        },
    };
}
