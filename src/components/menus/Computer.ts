import { GeneralComponent } from "eightbittr";

import { component } from "babyioc";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ComputerStorage } from "./computer/ComputerStorage";

/**
 * Menus for PokeCenter computers.
 */
export class Computer<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Menus for PC Pokemon storage.
     */
    @component(ComputerStorage)
    private readonly computerStorage: ComputerStorage<TEightBittr>;

    /**
     * Starts a dialog to turn on a PC.
     */
    public open(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% turned on the PC.",
            ],
            this.listOptions);
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
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

        this.eightBitter.menuGrapher.createMenu("Computer");
        this.eightBitter.menuGrapher.addMenuList("Computer", { options });
        this.eightBitter.menuGrapher.setActiveMenu("Computer");
    }

    /**
     * Closes the PC.
     */
    private readonly close = (): void => {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "TOODALOO!",
            ],
            (): void => {
                this.eightBitter.menuGrapher.deleteMenu("Computer");
                this.eightBitter.menuGrapher.deleteMenu("GeneralText");
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }
}
