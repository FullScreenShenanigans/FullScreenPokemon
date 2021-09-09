import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { MenuSchema } from "../Menus";

/**
 * Opens the Player menu.
 */
export class Player extends Section<FullScreenPokemon> {
    /**
     * Opens the Player menu.
     *
     * @param settings   Custom attributes to apply to the menu.
     */
    public open(settings: MenuSchema): void {
        this.game.menuGrapher.createMenu("Player", settings);
        this.game.menuGrapher.setActiveMenu("Player");
    }
}
