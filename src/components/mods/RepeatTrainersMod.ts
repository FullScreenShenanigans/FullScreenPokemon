import { ICallbackRegister, IMod } from "modattachr";

import { IEnemy } from "../../components/Things";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ModComponent } from "./ModComponent";

/**
 * Mod to allow battling enemy trainers again.
 */
export class RepeatTrainersMod<TGameStartr extends FullScreenPokemon> extends ModComponent<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Repeat Trainers";

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
