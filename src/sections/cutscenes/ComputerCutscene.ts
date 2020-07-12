import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Computer cutscene routines.
 */
export class ComputerCutscene extends Section<FullScreenPokemon> {
    /**
     *
     */
    public readonly Open = (): void => {
        this.game.menus.computer.open();
    };
}
