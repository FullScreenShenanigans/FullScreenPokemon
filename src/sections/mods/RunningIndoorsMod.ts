import { IMod } from "modattachr";

import { IArea } from "../../sections/Maps";
import { ModComponent } from "./ModComponent";

/**
 * Mod to allow cycling indoors.
 */
export class RunningIndoorsMod extends ModComponent implements IMod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Running Indoors";

    /**
     * Mod events, keyed by name.
     */
    public readonly events = {
        [this.eventNames.onModEnable]: (): void => {
            const area: IArea = this.game.mapScreener.activeArea;
            if (!area) {
                return;
            }

            this.game.saves.addStateHistory(area, "allowCycling", area.allowCycling);
            area.allowCycling = true;
            this.game.mapScreener.variables.allowCycling = true;
        },
        [this.eventNames.onModDisable]: (): void => {
            const area: IArea = this.game.mapScreener.activeArea;
            if (!area) {
                return;
            }

            this.game.saves.popStateHistory(area, "allowCycling");

            if (!area.allowCycling && this.game.players[0].cycling) {
                this.game.cycling.stopCycling(this.game.players[0]);
            }
            this.game.mapScreener.variables.allowCycling = area.allowCycling;
        },
        [this.eventNames.onSetLocation]: (): void => {
            this.events.onModEnable();
        },
    };
}
