import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokemon } from "../Battles";
import { ICharacter, IThing } from "../Things";

/**
 * Computer cutscene routines.
 */
export class ComputerCutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     *
     */
    public readonly Open = (): void => {
        this.eightBitter.menus.computer.open();
    }
}
