import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IMenuSchema } from "../Menus";

/**
 * Opens and closes the root pause menu.
 */
export class Pause<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Opens the Pause menu.
     *
     * @param settings   Custom attributes to apply to the menu.
     */
    public readonly open = (settings?: IMenuSchema): void => {
        const options: any[] = [
            {
                callback: (): void => {
                    this.gameStarter.menus.items.open({
                        backMenu: "Pause",
                    });
                },
                text: "ITEM",
            },
            {
                callback: (): void => {
                    this.gameStarter.menus.player.open({
                        backMenu: "Pause",
                    });
                },
                text: "%%%%%%%PLAYER%%%%%%%",
            },
            {
                callback: this.gameStarter.menus.save.open,
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

        if (this.gameStarter.itemsHolder.getItem(this.gameStarter.storage.names.hasPokedex)) {
            options.unshift({
                text: "%%%%%%%POKEDEX%%%%%%%",
                callback: this.open,
            });
        }

        if (this.gameStarter.itemsHolder.getItem(this.gameStarter.storage.names.pokemonInParty).length !== 0) {
            options.unshift({
                text: "%%%%%%%POKEMON%%%%%%%",
                callback: (): void => {
                    this.gameStarter.menus.pokemon.openPartyMenu({
                        onSwitch: (): void => console.log("Should switch..."),
                    });
                },
            });
        }

        this.gameStarter.menuGrapher.createMenu("Pause", {
            size: {
                height: (options.length * 32) + 48,
            },
        });

        this.gameStarter.menuGrapher.addMenuList("Pause", {
            options,
        });
        this.gameStarter.menuGrapher.setActiveMenu("Pause");
    }

    /**
     * Closes the Pause menu.
     */
    public readonly close = (): void => {
        this.gameStarter.menuGrapher.deleteMenu("Pause");
    }

    /**
     * Toggles whether the Pause menu is open. If there is an active menu, A
     * Start key trigger is registered in the MenuGraphr instead.
     *
     * @param settings   Custom attributes to apply to the menu.
     */
    public readonly toggle = (settings?: IMenuSchema): void => {
        if (this.gameStarter.menuGrapher.getActiveMenu()) {
            this.gameStarter.menuGrapher.registerStart();
            return;
        }

        const cutsceneSettings: any = this.gameStarter.scenePlayer.getCutsceneSettings();
        if (cutsceneSettings && cutsceneSettings.disablePauseMenu) {
            return;
        }

        this.gameStarter.menuGrapher.getMenu("Pause") === undefined
            ? this.open(settings)
            : this.close();
    }
}
