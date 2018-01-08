import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IMenuSchema } from "../Menus";

/**
 * Opens the Save menu.
 */
export class Save<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Opens the Save menu.
     */
    public readonly open = (): void => {
        this.gameStarter.menuGrapher.createMenu("Save");

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog("GeneralText", "Would you like to SAVE the game?");

        this.gameStarter.menuGrapher.createMenu("Yes/No", {
            onBPress: (): void => this.gameStarter.menuGrapher.deleteAllMenus(),
        });
        this.gameStarter.menuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: (): void => this.gameStarter.saves.downloadSaveGame(),
                },
                {
                    text: "NO",
                    callback: (): void => this.gameStarter.menuGrapher.deleteAllMenus(),
                },
            ],
        });
        this.gameStarter.menuGrapher.setActiveMenu("Yes/No");

        this.gameStarter.saves.autoSaveIfEnabled();
    }
}
