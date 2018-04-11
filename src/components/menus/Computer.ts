import { GeneralComponent } from "gamestartr";

import { component } from "babyioc";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ComputerStorage } from "./computer/ComputerStorage";

/**
 * Menus for PokeCenter computers.
 */
export class Computer<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Menus for PC Pokemon storage.
     */
    @component(ComputerStorage)
    private readonly computerStorage: ComputerStorage<TGameStartr>;

    /**
     * Starts a dialog to turn on a PC.
     */
    public open(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% turned on the PC.",
            ],
            this.listOptions);
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
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
                callback: (): void => {/* ... */},
                text: "%%%%%%%PLAYER%%%%%%%'s PC",
            },
            {
                callback: (): void => {/* ... */},
                text: "PROF. OAK's PC",
            },
            {
                callback: this.close,
                text: "LOG OFF",
            },
        ];

        this.gameStarter.menuGrapher.createMenu("Computer");
        this.gameStarter.menuGrapher.addMenuList("Computer", { options });
        this.gameStarter.menuGrapher.setActiveMenu("Computer");
    }

    /**
     * Closes the PC.
     */
    private readonly close = (): void => {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "TOODALOO!",
            ],
            (): void => {
                this.gameStarter.menuGrapher.deleteMenu("Computer");
                this.gameStarter.menuGrapher.deleteMenu("GeneralText");
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
