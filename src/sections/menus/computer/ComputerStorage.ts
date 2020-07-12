import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";

/**
 * Menus for PC Pokemon storage.
 */
export class ComputerStorage extends Section<FullScreenPokemon> {
    public readonly open = (): void => {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            ["Accessed %%%%%%%POKEMON%%%%%%% storage system."],
            this.listOptions
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    };

    private readonly listOptions = (): void => {
        const options = [
            {
                callback: (): void => {
                    /* ... */
                },
                text: "WITHDRAW PKMN",
            },
            {
                callback: (): void => {
                    /* ... */
                },
                text: "DEPOSIT PKMN",
            },
            {
                callback: (): void => {
                    /* ... */
                },
                text: "RELEASE PKMN",
            },
            {
                callback: (): void => {
                    /* ... */
                },
                text: "CHANGE PKMN",
            },
            {
                callback: this.close,
                text: "SEE YA!",
            },
        ];

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog("GeneralText", "What?");

        this.game.menuGrapher.createMenu("Computer");
        this.game.menuGrapher.addMenuList("Computer", { options });
        this.game.menuGrapher.setActiveMenu("Computer");
    };

    /**
     * Closes the storage menus.
     *
     * @todo Does this go back to the PC altogether? Should find out.
     */
    private readonly close = (): void => {
        this.game.menuGrapher.deleteMenu("Computer");
        this.game.menuGrapher.deleteMenu("GeneralText");
    };
}
