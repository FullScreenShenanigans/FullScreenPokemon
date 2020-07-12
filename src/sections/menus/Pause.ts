import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Opens and closes the root pause menu.
 */
export class Pause extends Section<FullScreenPokemon> {
    /**
     * Opens the Pause menu.
     */
    public readonly open = (): void => {
        const options: any[] = [
            {
                callback: (): void => {
                    this.game.menus.items.open({
                        backMenu: "Pause",
                    });
                },
                text: "ITEM",
            },
            {
                callback: (): void => {
                    this.game.menus.player.open({
                        backMenu: "Pause",
                    });
                },
                text: "%%%%%%%PLAYER%%%%%%%",
            },
            {
                callback: this.game.menus.save.open,
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

        if (this.game.itemsHolder.getItem(this.game.storage.names.hasPokedex)) {
            options.unshift({
                text: "%%%%%%%POKEDEX%%%%%%%",
                callback: this.open,
            });
        }

        if (this.game.itemsHolder.getItem(this.game.storage.names.pokemonInParty).length !== 0) {
            options.unshift({
                text: "%%%%%%%POKEMON%%%%%%%",
                callback: (): void => {
                    this.game.menus.pokemon.openPartyMenu({
                        onSwitch: (): void => console.log("Should switch..."),
                    });
                },
            });
        }

        this.game.menuGrapher.createMenu("Pause", {
            size: {
                height: options.length * 32 + 48,
            },
        });

        this.game.menuGrapher.addMenuList("Pause", {
            options,
        });
        this.game.menuGrapher.setActiveMenu("Pause");
    };

    /**
     * Closes the Pause menu.
     */
    public readonly close = (): void => {
        this.game.menuGrapher.deleteMenu("Pause");
    };

    /**
     * Toggles whether the Pause menu is open. If there is an active menu, A
     * Start key trigger is registered in the MenuGraphr instead.
     *
     * @param settings   Custom attributes to apply to the menu.
     */
    public readonly toggle = (): void => {
        if (this.game.menuGrapher.getActiveMenu()) {
            return;
        }

        const cutsceneSettings: any = this.game.scenePlayer.getCutsceneSettings();
        if (cutsceneSettings && cutsceneSettings.disablePauseMenu) {
            return;
        }

        this.game.menuGrapher.getMenu("Pause") === undefined ? this.open() : this.close();
    };
}
