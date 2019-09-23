import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IStorageItems } from "../../Storage";

interface IOptionMenuList {
    itemName: keyof IStorageItems;;
    menuName: string;
    options: string[];
}

/**
 * Opens and runs the personal options menu.
 */
export class Option<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    private readonly battleAnimationOptions: IOptionMenuList[] = [
        {
            itemName: this.eightBitter.storage.names.optionTextSpeed,
            menuName: "OptionTextSpeed",
            options: ["FAST", "MEDIUM", "SLOW"]
        },
        {
            itemName: this.eightBitter.storage.names.optionBattleAnimations,
            menuName: "OptionBattleAnimation",
            options: ["ON", "OFF"]
        },
        {
            itemName: this.eightBitter.storage.names.optionBattleStyle,
            menuName: "OptionBattleStyle",
            options: ["SHIFT", "SET"]
        },
    ];

    /**
     * Opens the personal options menu.
     */
    public readonly open = (): void => {
        this.eightBitter.menuGrapher.createMenu("Option");

        for (const { itemName, menuName, options } of this.battleAnimationOptions) {
            this.eightBitter.menuGrapher.addMenuList(menuName, {
                options: options.map(option => ({
                    callback: () => {
                        this.eightBitter.itemsHolder.setItem(itemName, option);
                    },
                    text: option,
                })),
                selectedIndex: [
                    options.indexOf(this.eightBitter.itemsHolder.getItem(itemName) as string),
                    0,
                ],
            });
        }

        this.eightBitter.menuGrapher.addMenuList("OptionCancel", {
            options: [
                {
                    callback: () => {
                        this.eightBitter.menuGrapher.deleteMenu("Option"),
                        this.eightBitter.menuGrapher.setActiveMenu("Pause");
                    },
                    text: "CANCEL",
                },
            ],
        });

        this.eightBitter.menuGrapher.setActiveMenu("OptionTextSpeed");
    }
}
