import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IMenuSchema } from "../Menus";

/**
 * Opens the Save menu.
 */
export class Save<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Opens the Save menu.
     */
    public readonly open = (): void => {
        this.eightBitter.menuGrapher.createMenu("Save");

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog("GeneralText", "Would you like to SAVE the game?");

        this.eightBitter.menuGrapher.createMenu("Yes/No", {
            onBPress: (): void => this.eightBitter.menuGrapher.deleteAllMenus(),
        });
        this.eightBitter.menuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: (): void => this.eightBitter.saves.downloadSaveGame(),
                },
                {
                    text: "NO",
                    callback: (): void => this.eightBitter.menuGrapher.deleteAllMenus(),
                },
            ],
        });
        this.eightBitter.menuGrapher.setActiveMenu("Yes/No");

        this.eightBitter.saves.autoSaveIfEnabled();
    }
}
