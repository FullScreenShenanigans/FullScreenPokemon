import { Mod } from "modattachr";

import { Area } from "../../sections/Maps";
import { ModComponent } from "./ModComponent";

/**
 * Mod to allow cycling indoors.
 */
export class RunningIndoorsMod extends ModComponent implements Mod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Running Indoors";

    /**
     * Mod events, keyed by name.
     */
    public readonly events = {
        [this.eventNames.onModEnable]: (): void => {
            const area: Area = this.game.mapScreener.activeArea;
            if (!area) {
                return;
            }

            this.game.saves.addStateHistory(area, "allowCycling", area.allowCycling);
            area.allowCycling = true;
            this.game.mapScreener.variables.allowCycling = true;
        },
        [this.eventNames.onModDisable]: (): void => {
            const area: Area = this.game.mapScreener.activeArea;
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
