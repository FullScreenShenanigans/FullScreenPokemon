import { ICallbackRegister, IMod } from "modattachr";

import { IEnemy } from "../../components/Things";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ModComponent } from "./ModComponent";

/**
 * Mod to allow battling enemy trainers again.
 */
export class RepeatTrainersMod<TEightBittr extends FullScreenPokemon> extends ModComponent<TEightBittr> implements IMod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Repeat Trainers";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onDialogFinish]: (other: IEnemy): void => {
            if (other.trainer) {
                other.alreadyBattled = false;
            }
        },
    };
}
