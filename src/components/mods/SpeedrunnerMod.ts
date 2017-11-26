import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ModComponent } from "./ModComponent";

/**
 * Mod to make the player move really quickly.
 */
export class SpeedRunnerMod<TGameStartr extends FullScreenPokemon> extends ModComponent<TGameStartr> implements IMod {
    /**
     * Class name for the player's prototype.
     */
    private static playerClassName: string = "Player";

    /**
     * Name of the mod.
     */
    public readonly name: string = "Speed Runner";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            const stats: any = this.gameStarter.objectMaker.getClass(SpeedRunnerMod.playerClassName).prototype;
            this.gameStarter.players[0].speed = stats.speed = 10;
        },
        [this.eventNames.onModDisable]: (): void => {
            const stats: any = this.gameStarter.objectMaker.getClass(SpeedRunnerMod.playerClassName).prototype;
            const oldSpeed: number = this.gameStarter.moduleSettings.objects!.properties![SpeedRunnerMod.playerClassName].speed;
            this.gameStarter.players[0].speed = stats.speed = oldSpeed;
        }
    };
}
