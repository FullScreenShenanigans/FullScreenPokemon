import { member } from "babyioc";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

import { ComputerStorage } from "./computer/ComputerStorage";

/**
 * Menus for PokeCenter computers.
 */
export class Computer extends Section<FullScreenPokemon> {
    /**
     * Menus for PC Pokemon storage.
     */
    @member(ComputerStorage)
    private readonly computerStorage: ComputerStorage;

    /**
     * Starts a dialog to turn on a PC.
     */
    public open(): void {
        this.game.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            ["%%%%%%%PLAYER%%%%%%% turned on the PC."],
            this.listOptions
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Lists the PC's menu options.
     */
    private readonly listOptions = (): void => {
        const options = [
            {
                callback: this.computerStorage.open,
                text: "BILL's PC",
            },
            {
                callback: (): void => {
                    /* ... */
                },
                text: "%%%%%%%PLAYER%%%%%%%'s PC",
            },
            {
                callback: (): void => {
                    /* ... */
                },
                text: "PROF. OAK's PC",
            },
            {
                callback: this.close,
                text: "LOG OFF",
            },
        ];

        this.game.menuGrapher.createMenu("Computer");
        this.game.menuGrapher.addMenuList("Computer", { options });
        this.game.menuGrapher.setActiveMenu("Computer");
    };

    /**
     * Closes the PC.
     */
    private readonly close = (): void => {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog("GeneralText", ["TOODALOO!"], (): void => {
            this.game.menuGrapher.deleteMenu("Computer");
            this.game.menuGrapher.deleteMenu("GeneralText");
        });
        this.game.menuGrapher.setActiveMenu("GeneralText");
    };
}
