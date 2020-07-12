import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Opens the Save menu.
 */
export class Save extends Section<FullScreenPokemon> {
    /**
     * Opens the Save menu.
     */
    public readonly open = (): void => {
        this.game.menuGrapher.createMenu("Save");

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog("GeneralText", "Would you like to SAVE the game?");

        this.game.menuGrapher.createMenu("Yes/No", {
            onBPress: (): void => this.game.menuGrapher.deleteAllMenus(),
        });
        this.game.menuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: (): void => this.game.saves.downloadSaveGame(),
                },
                {
                    text: "NO",
                    callback: (): void => this.game.menuGrapher.deleteAllMenus(),
                },
            ],
        });
        this.game.menuGrapher.setActiveMenu("Yes/No");

        this.game.saves.autoSaveIfEnabled();
    };
}
