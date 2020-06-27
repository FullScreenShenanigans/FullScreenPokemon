import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";

/**
 * Menus for PC Pokemon storage.
 */
export class ComputerStorage extends Section<FullScreenPokemon> {
    public readonly open = (): void => {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Accessed %%%%%%%POKEMON%%%%%%% storage system.",
            ],
            this.listOptions);
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    private readonly listOptions = (): void => {
        const options = [
            {
                callback: (): void => {/* ... */ },
                text: "WITHDRAW PKMN",
            },
            {
                callback: (): void => {/* ... */ },
                text: "DEPOSIT PKMN",
            },
            {
                callback: (): void => {/* ... */ },
                text: "RELEASE PKMN",
            },
            {
                callback: (): void => {/* ... */ },
                text: "CHANGE PKMN",
            },
            {
                callback: this.close,
                text: "SEE YA!",
            },
        ];

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog("GeneralText", "What?");

        this.eightBitter.menuGrapher.createMenu("Computer");
        this.eightBitter.menuGrapher.addMenuList("Computer", { options });
        this.eightBitter.menuGrapher.setActiveMenu("Computer");
    }

    /**
     * Closes the storage menus.
     *
     * @todo Does this go back to the PC altogether? Should find out.
     */
    private readonly close = (): void => {
        this.eightBitter.menuGrapher.deleteMenu("Computer");
        this.eightBitter.menuGrapher.deleteMenu("GeneralText");
    }
}
