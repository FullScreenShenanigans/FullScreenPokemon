import { CallbackRegister, Mod } from "modattachr";

import { Enemy } from "../../sections/Actors";
import { ModComponent } from "./ModComponent";

/**
 * Mod to allow battling enemy trainers again.
 */
export class RepeatTrainersMod extends ModComponent implements Mod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Repeat Trainers";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: CallbackRegister = {
        [this.eventNames.onDialogFinish]: (other: Enemy): void => {
            if (other.trainer) {
                other.alreadyBattled = false;
            }
        },
    };
}
