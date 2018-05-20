import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IMenuSchema } from "../Menus";

/**
 * Opens and closes the root pause menu.
 */
export class Pause<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Opens the Pause menu.
     *
     * @param settings   Custom attributes to apply to the menu.
     */
    public readonly open = (settings?: IMenuSchema): void => {
        const options: any[] = [
            {
                callback: (): void => {
                    this.eightBitter.menus.items.open({
                        backMenu: "Pause",
                    });
                },
                text: "ITEM",
            },
            {
                callback: (): void => {
                    this.eightBitter.menus.player.open({
                        backMenu: "Pause",
                    });
                },
                text: "%%%%%%%PLAYER%%%%%%%",
            },
            {
                callback: this.eightBitter.menus.save.open,
                text: "SAVE",
            },
            {
                text: "OPTION",
            },
            {
                callback: this.close,
                text: "Exit",
            },
        ];

        if (this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.hasPokedex)) {
            options.unshift({
                text: "%%%%%%%POKEDEX%%%%%%%",
                callback: this.open,
            });
        }

        if (this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.pokemonInParty).length !== 0) {
            options.unshift({
                text: "%%%%%%%POKEMON%%%%%%%",
                callback: (): void => {
                    this.eightBitter.menus.pokemon.openPartyMenu({
                        onSwitch: (): void => console.log("Should switch..."),
                    });
                },
            });
        }

        this.eightBitter.menuGrapher.createMenu("Pause", {
            size: {
                height: (options.length * 32) + 48,
            },
        });

        this.eightBitter.menuGrapher.addMenuList("Pause", {
            options,
        });
        this.eightBitter.menuGrapher.setActiveMenu("Pause");
    }

    /**
     * Closes the Pause menu.
     */
    public readonly close = (): void => {
        this.eightBitter.menuGrapher.deleteMenu("Pause");
    }

    /**
     * Toggles whether the Pause menu is open. If there is an active menu, A
     * Start key trigger is registered in the MenuGraphr instead.
     *
     * @param settings   Custom attributes to apply to the menu.
     */
    public readonly toggle = (settings?: IMenuSchema): void => {
        if (this.eightBitter.menuGrapher.getActiveMenu()) {
            return;
        }

        const cutsceneSettings: any = this.eightBitter.scenePlayer.getCutsceneSettings();
        if (cutsceneSettings && cutsceneSettings.disablePauseMenu) {
            return;
        }

        this.eightBitter.menuGrapher.getMenu("Pause") === undefined
            ? this.open(settings)
            : this.close();
    }
}
