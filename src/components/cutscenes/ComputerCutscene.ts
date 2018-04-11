import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokemon } from "../Battles";
import { ICharacter, IThing } from "../Things";

/**
 * Computer cutscene routines.
 */
export class ComputerCutscene<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     *
     */
    public readonly Open = (): void => {
        this.gameStarter.menus.computer.open();
    }
}
