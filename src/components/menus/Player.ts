import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IMenuSchema } from "../Menus";

/**
 * Opens the Player menu.
 */
export class Player<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Opens the Player menu.
     *
     * @param settings   Custom attributes to apply to the menu.
     */
    public open(settings: IMenuSchema): void {
        this.gameStarter.menuGrapher.createMenu("Player", settings);
        this.gameStarter.menuGrapher.setActiveMenu("Player");
    }
}
