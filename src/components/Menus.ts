import { Component } from "eightbittr/lib/Component";
import * as imenugraphr from "menugraphr/lib/IMenuGraphr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokedexInformation, IPokemonListing } from "./constants/Pokemon";
import { Items } from "./menus/Items";
import { Keyboards } from "./menus/Keyboards";
import { Pokemon } from "./menus/Pokemon";
import { IThing } from "./Things";

/**
 * A description of a simple general text dialog to start.
 */
export interface IDialog {
    /**
     * An optional cutscene to start after the dialog.
     */
    cutscene?: string;

    /**
     * Options for a yes or no dialog menu with callbacks after the dialog.
     */
    options?: IDialogOptions;

    /**
     * The actual text to display in the dialog.
     */
    words: imenugraphr.IMenuDialogRaw;
}

/**
 * Dialog settings for a yes or no menu after a dialog.
 */
export interface IDialogOptions {
    /**
     * What to display after the "Yes" option is activated.
     */
    Yes: string | IDialog;

    /**
     * What to display after the "No" option is activated.
     */
    No: string | IDialog;
}

/**
 * General attributes for all menus.
 */
export interface IMenuBase extends imenugraphr.IMenuBase {
    /**
     * Whether this has the dirty visual background.
     */
    dirty?: boolean;

    /**
     * Whether this has the light visual background.
     */
    light?: boolean;

    /**
     * Whether this has the lined visual background.
     */
    lined?: boolean;

    /**
     * Whether this has the plain white visual background.
     */
    plain?: boolean;

    /**
     * Whether this has the water visual background.
     */
    watery?: boolean;
}

/**
 * A schema to specify creating a menu.
 */
export interface IMenuSchema extends imenugraphr.IMenuSchema {
    /**
     * Whether the menu should be hidden.
     */
    hidden?: boolean;
}

/**
 * A Menu Thing.
 */
export interface IMenu extends IMenuBase, IThing {
    /**
     * Children Things attached to the Menu.
     */
    children: IThing[];

    /**
     * How tall this is.
     */
    height: number;

    /**
     * Menu name this is listed under.
     */
    name: string;

    /**
     * Any settings to attach to this Menu.
     */
    settings?: any;

    /**
     * How wide this is.
     */
    width: number;
}

/**
 * A ListMenu Thing.
 */
export interface IListMenu extends IMenu, imenugraphr.IListMenuBase { }

/**
 * Menu functions used by FullScreenPokemon instances.
 */
export class Menus<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Item menu functions used by this instance.
     */
    public readonly items: Items<TGameStartr> = new Items(this.gameStarter);

    /**
     * Keyboard menu functions used by this instance.
     */
    public readonly keyboards: Keyboards<TGameStartr> = new Keyboards(this.gameStarter);

    /**
     * Keyboard menu functions used by this instance.
     */
    public readonly pokemon: Pokemon<TGameStartr> = new Pokemon(this.gameStarter);

    /**
     * Locations of known cities on town maps.
     */
    public readonly townMapLocations: { [i: string]: [number, number ] } = {
        "Pallet Town": [18, 48],
        "Pewter City": [18, 16],
        "Serebii Islands": [18, 64],
        "Viridian City": [18, 36]
    };

    /**
     * Opens the Pause menu.
     */
    public openPauseMenu(): void {
        const options: any[] = [
            {
                text: "%%%%%%%POKEMON%%%%%%%",
                callback: (): void => this.pokemon.openPartyMenu({
                    onSwitch: (): void => console.log("Should switch...")
                })
            }, {
                text: "ITEM",
                callback: (): void => this.items.openItemsMenu()
            }, {
                text: "%%%%%%%PLAYER%%%%%%%",
                callback: (): void => this.openPlayerMenu()
            }, {
                text: "SAVE",
                callback: (): void => this.openSaveMenu()
            }, {
                text: "OPTION"
            }, {
                text: "Exit",
                callback: (): void => this.closePauseMenu()
            }];

        if (this.gameStarter.itemsHolder.getItem("hasPokedex") === true) {
            options.unshift({
                text: "%%%%%%%POKEDEX%%%%%%%",
                callback: (): void => this.openPokedexMenu()
            });

            this.gameStarter.menuGrapher.createMenu("Pause", {
                size: {
                    height: 64
                }
            });
        } else {
            this.gameStarter.menuGrapher.createMenu("Pause");
        }

        this.gameStarter.menuGrapher.addMenuList("Pause", {
            options: options
        });
        this.gameStarter.menuGrapher.setActiveMenu("Pause");
    }

    /**
     * Closes the Pause menu.
     */
    public closePauseMenu(): void {
        this.gameStarter.menuGrapher.deleteMenu("Pause");
    }

    /**
     * Toggles whether the Pause menu is open. If there is an active menu, A
     * Start key trigger is registered in the MenuGraphr instead.
     */
    public togglePauseMenu(): void {
        if (this.gameStarter.menuGrapher.getActiveMenu()) {
            this.gameStarter.menuGrapher.registerStart();
            return;
        }

        const cutsceneSettings: any = this.gameStarter.scenePlayer.getCutsceneSettings();
        if (cutsceneSettings && cutsceneSettings.disablePauseMenu) {
            return;
        }

        this.gameStarter.menuGrapher.getMenu("Pause")
            ? this.closePauseMenu()
            : this.openPauseMenu();
    }

    /**
     * Opens the Pokedex menu.
     */
    public openPokedexMenu(): void {
        const listings: (IPokedexInformation | undefined)[] = this.gameStarter.saves.getPokedexListingsOrdered();
        let currentListing: IPokedexInformation;

        this.gameStarter.menuGrapher.createMenu("Pokedex");
        this.gameStarter.menuGrapher.addMenuList("Pokedex", {
            options: listings.map((listing: IPokedexInformation, i: number): any => {
                const characters: any[] = this.gameStarter.utilities.makeDigit(i + 1, 3, 0).split("");
                const output: any = {
                    text: characters,
                    callback: (): void => {
                        currentListing = listing;
                        this.gameStarter.menuGrapher.setActiveMenu("PokedexOptions");
                    }
                };

                characters.push({
                    command: true,
                    y: 4
                });

                if (listing) {
                    if (listing.caught) {
                        characters.push({
                            command: true,
                            x: -4,
                            y: 1
                        });
                        characters.push("Ball");
                        characters.push({
                            command: true,
                            y: -1
                        });
                    }

                    characters.push(...listing.title);
                } else {
                    characters.push(..."----------".split(""));
                }

                characters.push({
                    command: true,
                    y: -4
                });

                return output;
            })
        });
        this.gameStarter.menuGrapher.setActiveMenu("Pokedex");

        this.gameStarter.menuGrapher.createMenu("PokedexOptions");
        this.gameStarter.menuGrapher.addMenuList("PokedexOptions", {
            options: [
                {
                    text: "DATA",
                    callback: (): void => {
                        this.openPokedexListing(
                            currentListing.title,
                            (): void => this.gameStarter.menuGrapher.setActiveMenu("PokedexOptions"));
                    }
                }, {
                    text: "CRY"
                }, {
                    text: "AREA",
                    callback: (): void => {
                        this.openTownMapMenu({
                            backMenu: "PokedexOptions"
                        });
                        this.showTownMapPokemonLocations(currentListing.title);
                    }
                }, {
                    text: "QUIT",
                    callback: this.gameStarter.menuGrapher.registerB
                }
            ]
        });
    }

    /**
     * Opens a Pokedex listing for a Pokemon.
     *
     * @param title   The title of the Pokemon to open the listing for.
     * @param callback   A callback for when the menu is closed.
     */
    public openPokedexListing(title: string[], callback?: (...args: any[]) => void, menuSettings?: any): void {
        const pokemon: IPokemonListing = this.gameStarter.constants.pokemon.byName[title.join("")];
        const height: string[] = pokemon.height;
        const feet: string = [].slice.call(height[0]).reverse().join("");
        const inches: string = [].slice.call(height[1]).reverse().join("");
        const onCompletion: () => any = (): void => {
            this.gameStarter.menuGrapher.deleteMenu("PokedexListing");
            if (callback) {
                callback();
            }
        };

        this.gameStarter.menuGrapher.createMenu("PokedexListing", menuSettings);
        this.gameStarter.menuGrapher.createMenuThing("PokedexListingSprite", {
            thing: title.join("") + "Front",
            type: "thing",
            args: {
                flipHoriz: true
            }
        });
        this.gameStarter.menuGrapher.addMenuDialog("PokedexListingName", [[title]]);
        this.gameStarter.menuGrapher.addMenuDialog("PokedexListingLabel", pokemon.label);
        this.gameStarter.menuGrapher.addMenuDialog("PokedexListingHeightFeet", feet);
        this.gameStarter.menuGrapher.addMenuDialog("PokedexListingHeightInches", inches);
        this.gameStarter.menuGrapher.addMenuDialog("PokedexListingWeight", pokemon.weight.toString());
        this.gameStarter.menuGrapher.addMenuDialog(
            "PokedexListingNumber",
            this.gameStarter.utilities.makeDigit(pokemon.number, 3, "0"));

        this.gameStarter.menuGrapher.addMenuDialog(
            "PokedexListingInfo",
            pokemon.info[0],
            (): void => {
                if (pokemon.info.length < 2) {
                    onCompletion();
                    return;
                }

                this.gameStarter.menuGrapher.createMenu("PokedexListingInfo");
                this.gameStarter.menuGrapher.addMenuDialog("PokedexListingInfo", pokemon.info[1], onCompletion);
                this.gameStarter.menuGrapher.setActiveMenu("PokedexListingInfo");
            });

        this.gameStarter.menuGrapher.setActiveMenu("PokedexListingInfo");
    }

    /**
     * Opens the Player menu.
     */
    public openPlayerMenu(): void {
        this.gameStarter.menuGrapher.createMenu("Player", {
            callback: (): void => this.gameStarter.menuGrapher.registerB()
        });
        this.gameStarter.menuGrapher.setActiveMenu("Player");
    }

    /**
     * Opens the Save menu.
     */
    public openSaveMenu(): void {
        this.gameStarter.menuGrapher.createMenu("Save");

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog("GeneralText", "Would you like to SAVE the game?");

        this.gameStarter.menuGrapher.createMenu("Yes/No", {
            onBPress: (): void => this.gameStarter.menuGrapher.deleteAllMenus()
        });
        this.gameStarter.menuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: (): void => this.gameStarter.saves.downloadSaveGame()
                }, {
                    text: "NO",
                    callback: (): void => this.gameStarter.menuGrapher.deleteAllMenus()
                }]
        });
        this.gameStarter.menuGrapher.setActiveMenu("Yes/No");

        this.gameStarter.saves.autoSave();
    }

    /**
     * Opens the Town Map menu.
     * 
     * @param settings   Custom attributes to apply to the menu.
     */
    public openTownMapMenu(settings?: IMenuSchema): void {
        const playerPosition: number[] = this.townMapLocations["Pallet Town"];
        const playerSize: any = this.gameStarter.objectMaker.getFullPropertiesOf("Player");

        this.gameStarter.menuGrapher.createMenu("Town Map", settings);
        this.gameStarter.menuGrapher.createMenuThing("Town Map Inside", {
            type: "thing",
            thing: "Player",
            args: {
                nocollide: true
            },
            position: {
                offset: {
                    left: playerPosition[0] - (playerSize.width / 2),
                    top: playerPosition[1] - (playerSize.height / 2)
                }
            }
        });
        this.gameStarter.menuGrapher.setActiveMenu("Town Map");
    }

    /**
     * Shows allowed flying locations on the Town Map menu.
     */
    public showTownMapFlyLocations(): void {
        console.warn("Map fly locations not implemented.");
    }

    /**
     * Shows a Pokemon's nest locations on the Town Map menu.
     * 
     * @param title   The title of the Pokemon to show nest locations of.
     */
    public showTownMapPokemonLocations(title: string[]): void {
        const dialog: string[] = [].slice.call(title);

        dialog.push(..."'s NEST".split(""));

        this.gameStarter.menuGrapher.addMenuDialog("Town Map", [dialog]);

        console.warn("Pokemon map locations not implemented.");
    }

    /**
     * Displays message when a Player tries to use an item that cannot be used.
     */
    public cannotDoThat(): void {
        this.displayMessage("OAK: %%%%%%%PLAYER%%%%%%%! \n This isn't the \n time to use that!");
    }

    /**
     * Displays a message to the user.
     *
     * @param message   The message to be displayed.
     */
    public displayMessage(message: string): void {
        if (this.gameStarter.menuGrapher.getActiveMenu()) {
            return;
        }

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            deleteOnFinish: true
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                message
            ]
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
