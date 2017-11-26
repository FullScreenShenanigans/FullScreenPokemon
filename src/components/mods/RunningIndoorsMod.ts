import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { IArea } from "../../components/Maps";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ModComponent } from "./ModComponent";

/**
 * Mod to allow cycling indoors.
 */
export class RunningIndoorsMod<TGameStartr extends FullScreenPokemon> extends ModComponent<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Running Indoors";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onModEnable]: (): void => {
            const area: IArea = this.gameStarter.areaSpawner.getArea() as IArea;
            if (!area) {
                return;
            }

            this.gameStarter.saves.addStateHistory(area, "allowCycling", area.allowCycling);
            area.allowCycling = true;
            this.gameStarter.mapScreener.variables.allowCycling = true;
        },
        [this.eventNames.onModDisable]: (): void => {
            const area: IArea = this.gameStarter.areaSpawner.getArea() as IArea;
            if (!area) {
                return;
            }

            this.gameStarter.saves.popStateHistory(area, "allowCycling");

            if (!area.allowCycling && this.gameStarter.players[0].cycling) {
                this.gameStarter.cycling.stopCycling(this.gameStarter.players[0]);
            }
            this.gameStarter.mapScreener.variables.allowCycling = area.allowCycling;
        },
        [this.eventNames.onSetLocation]: (): void => {
            this.events.onModEnable!();
        }
    };
}
