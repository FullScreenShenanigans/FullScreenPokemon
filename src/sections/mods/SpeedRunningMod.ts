import { ICallbackRegister, IMod } from "modattachr";

import { ModComponent } from "./ModComponent";

/**
 * Mod to make the player move really quickly.
 */
export class SpeedRunningMod extends ModComponent implements IMod {
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
            const stats: any = this.game.objectMaker.getPrototypeOf(
                SpeedRunningMod.playerClassName
            );
            this.game.players[0].speed = stats.speed = 10;
        },
        [this.eventNames.onModDisable]: (): void => {
            const stats: any = this.game.objectMaker.getPrototypeOf(
                SpeedRunningMod.playerClassName
            );
            const oldSpeed: number = this.game.settings.components.objectMaker!.properties![
                SpeedRunningMod.playerClassName
            ].speed;
            this.game.players[0].speed = stats.speed = oldSpeed;
        },
    };
}
