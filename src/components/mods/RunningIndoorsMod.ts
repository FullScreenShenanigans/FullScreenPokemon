import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { IArea } from "../../components/Maps";
import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Mod to allow cycling indoors.
 */
export class RunningIndoorsMod<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Running Indoors";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        onModEnable: (): void => {
            const area: IArea = this.gameStarter.areaSpawner.getArea() as IArea;
            if (!area) {
                return;
            }

            this.gameStarter.saves.addStateHistory(area, "allowCycling", area.allowCycling);
            area.allowCycling = true;
            this.gameStarter.mapScreener.variables.allowCycling = true;
        },
        onModDisable: (): void => {
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
        onSetLocation: (): void => {
            this.events.onModEnable!();
        }
    };
}
