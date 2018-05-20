import { IMod } from "modattachr";

import { IArea } from "../../components/Maps";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ModComponent } from "./ModComponent";

/**
 * Mod to allow cycling indoors.
 */
export class RunningIndoorsMod<TEightBittr extends FullScreenPokemon> extends ModComponent<TEightBittr> implements IMod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Running Indoors";

    /**
     * Mod events, keyed by name.
     */
    public readonly events = {
        [this.eventNames.onModEnable]: (): void => {
            const area: IArea = this.eightBitter.mapScreener.activeArea;
            if (!area) {
                return;
            }

            this.eightBitter.saves.addStateHistory(area, "allowCycling", area.allowCycling);
            area.allowCycling = true;
            this.eightBitter.mapScreener.variables.allowCycling = true;
        },
        [this.eventNames.onModDisable]: (): void => {
            const area: IArea = this.eightBitter.mapScreener.activeArea;
            if (!area) {
                return;
            }

            this.eightBitter.saves.popStateHistory(area, "allowCycling");

            if (!area.allowCycling && this.eightBitter.players[0].cycling) {
                this.eightBitter.cycling.stopCycling(this.eightBitter.players[0]);
            }
            this.eightBitter.mapScreener.variables.allowCycling = area.allowCycling;
        },
        [this.eventNames.onSetLocation]: (): void => {
            this.events.onModEnable();
        },
    };
}
