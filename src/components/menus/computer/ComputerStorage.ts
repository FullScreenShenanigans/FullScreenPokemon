import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";

/**
 * Menus for PC Pokemon storage.
 */
export class ComputerStorage<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    public readonly open = (): void => {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Accessed %%%%%%%POKEMON%%%%%%% storage system.",
            ],
            this.listOptions);
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    private readonly listOptions = (): void => {
        const options = [
            {
                callback: (): void => {/* ... */},
                text: "WITHDRAW PKMN",
            },
            {
                callback: (): void => {/* ... */},
                text: "DEPOSIT PKMN",
            },
            {
                callback: (): void => {/* ... */},
                text: "RELEASE PKMN",
            },
            {
                callback: (): void => {/* ... */},
                text: "CHANGE PKMN",
            },
            {
                callback: this.close,
                text: "SEE YA!",
            },
        ];

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog("GeneralText", "What?");

        this.gameStarter.menuGrapher.createMenu("Computer");
        this.gameStarter.menuGrapher.addMenuList("Computer", { options });
        this.gameStarter.menuGrapher.setActiveMenu("Computer");
    }

    /**
     * Closes the storage menus.
     *
     * @todo Does this go back to the PC altogether? Should find out.
     */
    private readonly close = (): void => {
        this.gameStarter.menuGrapher.deleteMenu("Computer");
        this.gameStarter.menuGrapher.deleteMenu("GeneralText");
    }
}
