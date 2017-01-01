import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { IEnemy } from "../../components/Things";
import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Mod to allow battling enemy trainers again.
 */
export class RepeatTrainersMod<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Repeat Trainers";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        onDialogFinish: (other: IEnemy): void => {
            if (other.trainer) {
                other.alreadyBattled = false;
            }
        }
    };
}
