import * as ibattlemovr from "battlemovr/lib/IBattleMovr";
import { Component } from "eightbittr/lib/Component";
import * as imenugraphr from "menugraphr/lib/IMenuGraphr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";
import { IItemSchema } from "./constants/Items";
import { IHMMoveSchema } from "./constants/Moves";
import { IPokedexInformation, IPokemonListing } from "./constants/Pokemon";
import { Keyboards } from "./menus/Keyboards";
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
 * Settings to open the LevelUpStats menu for a Pokemon.
 */
export interface ILevelUpStatsMenuSettings {
    /**
     * The Pokemon to display the statistics for.
     */
    pokemon: IPokemon;

    /**
     * A menu container for LevelUpStats.
     */
    container?: string;

    /**
     * A callback for when the menu is deleted.
     */
    onMenuDelete?: () => void;

    /**
     * How to position the menu within its container.
     */
    position?: imenugraphr.IMenuSchemaPosition;

    /**
     * How to size the menu.
     */
    size?: imenugraphr.IMenuSchemaSize;

    /**
     * A horizontal offset for the menu.
     */
    textXOffset?: number;
}

/**
 * Settings to open the Items menu.
 * 
 * @todo Refactor this interface's usage to contain IMenuSchema instead of inheritance.
 */
export interface IItemsMenuSettings extends IMenuSchema {
    /**
     * Items to override the player's inventory.
     */
    items?: IItemSchema[];
}

/**
 * Menu functions used by FullScreenPokemon instances.
 */
export class Menus<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Keyboard functions used by this instance.
     */
    public readonly keyboards: Keyboards<TGameStartr> = new Keyboards(this.gameStarter);

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
                callback: (): void => this.openPokemonMenu({
                    // "onSwitch": ...
                })
            }, {
                text: "ITEM",
                callback: (settings: IItemsMenuSettings): void => this.openItemsMenu(settings)
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

        // The Pokedex option is only shown if the Player has one
        if (this.gameStarter.itemsHolder.getItem("hasPokedex") === true) {
            const attributes: any = {
                "size": {
                    "height": 64
                }
            };

            options.unshift({
                text: "%%%%%%%POKEDEX%%%%%%%",
                callback: (): void => this.openPokedexMenu()
            });

            this.gameStarter.menuGrapher.createMenu("Pause", attributes);
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

        let cutsceneSettings: any = this.gameStarter.scenePlayer.getCutsceneSettings();
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
     * Opens the context menu within the Pokedex menu for the selected Pokemon.
     *
     * @param settings   Settings for the selected Pokemon, including its HM moves.
     */
    public openPokemonMenuContext(settings: any): void {
        const moves: ibattlemovr.IMove[] = settings.pokemon.moves;
        const options: any[] = [];

        for (const action of moves) {
            const move: IHMMoveSchema = this.gameStarter.constants.moves.byName[action.title];
            if (move.partyActivate && move.requiredBadge && this.gameStarter.itemsHolder.getItem("badges")[move.requiredBadge]) {
                options.push({
                    text: action.title.toUpperCase(),
                    callback: (): void => {
                        this.gameStarter.actions.partyActivateCheckThing(this.gameStarter.players[0], settings.pokemon, move);
                    }
                });
            }
        }

        options.push(
            {
                text: "STATS",
                callback: (): void => this.openPokemonMenuStats(settings.pokemon)
            },
            {
                text: "SWITCH",
                callback: settings.onSwitch
            },
            {
                text: "CANCEL",
                callback: this.gameStarter.menuGrapher.registerB
            });

        this.gameStarter.menuGrapher.createMenu("PokemonMenuContext", {
            backMenu: "Pokemon"
        });
        this.gameStarter.menuGrapher.addMenuList("PokemonMenuContext", {
            options: options
        });
        this.gameStarter.menuGrapher.setActiveMenu("PokemonMenuContext");
    }

    /**
     * Opens a statistics menu for a Pokemon.
     * 
     * @param pokemon   A Pokemon to show statistics of.
     */
    public openPokemonMenuStats(pokemon: IPokemon): void {
        const schema: IPokemonListing = this.gameStarter.constants.pokemon.byName[pokemon.title.join("")];
        const barWidth: number = 25;
        const health: number = this.gameStarter.equations.widthHealthBar(barWidth, pokemon.HP, pokemon.HPNormal);

        this.gameStarter.menuGrapher.createMenu("PokemonMenuStats", {
            backMenu: "PokemonMenuContext",
            callback: (): void => this.openPokemonMenuStatsSecondary(pokemon),
            container: "Pokemon"
        });

        this.openPokemonLevelUpStats({
            pokemon: pokemon,
            container: "PokemonMenuStats",
            size: {
                width: 40,
                height: 40
            },
            position: {
                vertical: "bottom",
                horizontal: "left",
                offset: {
                    left: 3,
                    top: -3
                }
            },
            textXOffset: 4
        });

        this.gameStarter.menuGrapher.addMenuDialog("PokemonMenuStatsTitle", [pokemon.nickname]);
        this.gameStarter.menuGrapher.addMenuDialog("PokemonMenuStatsLevel", pokemon.level.toString());
        this.gameStarter.menuGrapher.addMenuDialog("PokemonMenuStatsHP", pokemon.HP + "/ " + pokemon.HPNormal);
        this.gameStarter.menuGrapher.addMenuDialog("PokemonMenuStatsNumber", this.gameStarter.utilities.makeDigit(schema.number, 3, 0));
        this.gameStarter.menuGrapher.addMenuDialog("PokemonMenuStatsStatus", "OK");
        this.gameStarter.menuGrapher.addMenuDialog("PokemonMenuStatsType1", pokemon.types[0]);
        if (pokemon.types.length >= 2) {
            this.gameStarter.menuGrapher.createMenu("PokemonMenuStatsType2");
            this.gameStarter.menuGrapher.addMenuDialog("PokemonMenuStatsType2", pokemon.types[1]);
        }
        this.gameStarter.menuGrapher.addMenuDialog("PokemonMenuStatsID", "31425");
        this.gameStarter.menuGrapher.addMenuDialog(
            "PokemonMenuStatsOT",
            [
                "%%%%%%%PLAYER%%%%%%%"
            ]
        );

        this.gameStarter.menuGrapher.createMenuThing("PokemonMenuStatsHPBar", {
            type: "thing",
            thing: "LightGraySquare",
            position: {
                horizontal: "left",
                offset: {
                    top: 0.5,
                    left: 8.5
                }
            },
            args: {
                width: Math.max(health, 1),
                height: 1,
                hidden: health === 0
            }
        });

        this.gameStarter.menuGrapher.createMenuThing("PokemonMenuStats", {
            type: "thing",
            thing: pokemon.title.join("") + "Front",
            args: {
                flipHoriz: true
            },
            position: {
                vertical: "bottom",
                offset: {
                    left: 9,
                    top: -48
                }
            }
        });

        this.gameStarter.menuGrapher.setActiveMenu("PokemonMenuStats");
    }

    /**
     * Opens the LevelUpStats menu for a Pokemon to view its statistics.
     * 
     * @param settings   Settings to open the menu.
     */
    public openPokemonLevelUpStats(settings: ILevelUpStatsMenuSettings): void {
        const pokemon: IPokemon = settings.pokemon;
        const statistics: string[] = this.gameStarter.constants.pokemon.statisticNamesDisplayed.slice();
        const numStatistics: number = statistics.length;
        const textXOffset: number = settings.textXOffset || 8;
        const menuSchema: IMenuSchema = {
            callback: (): void => this.gameStarter.menuGrapher.deleteMenu("LevelUpStats"),
            onMenuDelete: settings.onMenuDelete,
            position: settings.position || {
                horizontal: "center",
                vertical: "center"
            }
        };
        let top: number;
        let left: number;

        for (let i: number = 0; i < numStatistics; i += 1) {
            statistics.push(this.gameStarter.utilities.makeDigit((pokemon as any)[statistics[i] + "Normal"], 3, "\t"));
            statistics[i] = statistics[i].toUpperCase();
        }

        menuSchema.childrenSchemas = statistics.map((text: string, i: number): imenugraphr.IMenuWordSchema => {
            if (i < numStatistics) {
                top = i * 8 + 4;
                left = textXOffset;
            } else {
                top = (i - numStatistics + 1) * 8;
                left = textXOffset + 20;
            }

            return {
                type: "text",
                words: [text],
                position: {
                    offset: {
                        top: top - .5,
                        left: left
                    }
                }
            };
        });

        if (settings.container) {
            menuSchema.container = settings.container;
        }

        if (settings.size) {
            menuSchema.size = settings.size;
        }

        this.gameStarter.menuGrapher.createMenu("LevelUpStats", menuSchema);
    }

    /**
     * Open the secondary statistics menu from the LevelUpStats menu.
     * 
     * @param pokemon   The Pokemon to open the menu for.
     */
    public openPokemonMenuStatsSecondary(pokemon: IPokemon): void {
        const options: any[] = pokemon.moves.map(
            (move: ibattlemovr.IMove): any => {
                const characters: any[] = [" "];
                const output: any = {
                    text: characters
                };

                characters.push({
                    command: true,
                    x: 40,
                    y: 4
                });

                characters.push({
                    command: true,
                    y: .5
                });
                characters.push("PP", " ");
                characters.push({
                    command: true,
                    y: -.5
                });
                characters.push(...this.gameStarter.utilities.makeDigit(move.remaining, 2, " ").split(""));
                characters.push("/");
                characters.push(
                    ...this.gameStarter.utilities.makeDigit(
                        this.gameStarter.constants.moves.byName[move.title].PP, 2, " ")
                            .split(""));

                characters.push({
                    command: true,
                    x: -75,
                    y: -4
                });

                // TODO: Moves should always be uppercase...
                characters.push(...move.title.toUpperCase().split(""));

                return output;
            });

        // Fill any remaining options with "-" and "--" for move and PP, respectively
        for (let i: number = options.length; i < 4; i += 1) {
            options.push({
                text: [
                    "-",
                    {
                        command: true,
                        x: 40,
                        y: 4
                    },
                    "-",
                    "-"
                ]
            });
        }

        this.gameStarter.menuGrapher.createMenu("PokemonMenuStatsExperience");

        this.gameStarter.menuGrapher.addMenuDialog(
            "PokemonMenuStatsExperience",
            this.gameStarter.utilities.makeDigit(pokemon.experience.current, 10, "\t"));

        this.gameStarter.menuGrapher.addMenuDialog(
            "PokemonMenuStatsExperienceFrom",
            this.gameStarter.utilities.makeDigit(
                (pokemon.experience.next - pokemon.experience.current), 3, "\t"));

        this.gameStarter.menuGrapher.addMenuDialog(
            "PokemonMenuStatsExperienceNext",
            pokemon.level === 99 ? "" : (pokemon.level + 1).toString());

        this.gameStarter.menuGrapher.createMenu("PokemonMenuStatsMoves");
        this.gameStarter.menuGrapher.addMenuList("PokemonMenuStatsMoves", {
            options: options
        });

        this.gameStarter.menuGrapher.getMenu("PokemonMenuStats").callback = (): void => {
            this.gameStarter.menuGrapher.deleteMenu("PokemonMenuStats");
        };
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
     * Opens a Pokemon menu for the Pokemon in the player's party.
     * 
     * @param settings   Custom attributes to apply to the menu.
     */
    public openPokemonMenu(settings: IMenuSchema): void {
        const listings: IPokemon[] = this.gameStarter.itemsHolder.getItem("PokemonInParty");
        if (!listings || !listings.length) {
            return;
        }

        this.gameStarter.menuGrapher.createMenu("Pokemon", settings);
        this.gameStarter.menuGrapher.addMenuList("Pokemon", {
            options: listings.map((listing: IPokemon): any => {
                const title: string = listing.title.join("");
                const sprite: string = this.gameStarter.constants.pokemon.byName[title].sprite + "Pokemon";
                const barWidth: number = 25;
                const health: number = this.gameStarter.equations.widthHealthBar(barWidth, listing.HP, listing.HPNormal);

                return {
                    text: listing.title,
                    callback: (): void => this.openPokemonMenuContext({
                        pokemon: listing
                        // "onSwitch": (): void => settings.onSwitch("player", i)
                    }),
                    things: [
                        {
                            thing: sprite,
                            position: {
                                offset: {
                                    left: 7.5,
                                    top: .5
                                }
                            }
                        },
                        {
                            thing: "CharLevel",
                            position: {
                                offset: {
                                    left: 56,
                                    top: 1.5
                                }
                            }
                        },
                        {
                            thing: "CharHP",
                            position: {
                                offset: {
                                    left: 20,
                                    top: 5.5
                                }
                            }
                        },
                        {
                            thing: "HPBar",
                            args: {
                                width: barWidth
                            },
                            position: {
                                offset: {
                                    left: 27,
                                    top: 5.5
                                }
                            }
                        },
                        {
                            thing: "LightGraySquare",
                            args: {
                                width: Math.max(health, 1),
                                height: 1,
                                hidden: health === 0
                            },
                            position: {
                                offset: {
                                    left: 27.5,
                                    top: 6
                                }
                            }
                        }],
                    textsFloating: [
                        {
                            text: listing.level.toString(),
                            x: 44.25,
                            y: 0
                        },
                        {
                            text: listing.HP + "/ " + listing.HPNormal,
                            x: 43.75,
                            y: 4
                        }]
                };
            })
        });
        this.gameStarter.menuGrapher.setActiveMenu("Pokemon");
    }

    /**
     * Opens the Items menu for the items in the player's inventory.
     * 
     * @param settings   Custom attributes to apply to the menu, as well as items
     *                   to optionally override the player's inventory.
     */
    public openItemsMenu(settings: IItemsMenuSettings): void {
        let items: IItemSchema[] = settings.items || this.gameStarter.itemsHolder.getItem("items").slice();

        this.gameStarter.modAttacher.fireEvent("onOpenItemsMenu", items);

        this.gameStarter.menuGrapher.createMenu("Items", settings);
        this.gameStarter.menuGrapher.addMenuList("Items", {
            options: items.map((schema: any): any => {
                return {
                    text: schema.item,
                    callback: (): void => this.openItemMenu(schema.item),
                    textsFloating: [
                        {
                            text: [["Times"]],
                            x: 32,
                            y: 4.5
                        }, {
                            text: this.gameStarter.utilities.makeDigit(schema.amount, 2, " "),
                            x: 36.5,
                            y: 4
                        }
                    ]
                };
            })
        });
        this.gameStarter.menuGrapher.setActiveMenu("Items");

        console.warn("Once math.js contains item info, react to non-stackable items...");
    }

    /**
     * Opens the Item menu for the item the player selected from the inventory.
     * 
     * @param settings   Custom attributes to apply to the menu, as well as items
     *                   to optionally override the player's inventory.
     * 
     * @todo Fix #364.
     */
    public openItemMenu(itemName: string, settings?: any): void {
        const options: any[] = [{
                text: "USE",
                callback: (): void => console.log("Use " + itemName)
            }, {
                text: "TOSS",
                callback: (): void => console.log("Toss " + itemName)
            }];

        this.gameStarter.modAttacher.fireEvent("onOpenItemMenu", itemName);

        this.gameStarter.menuGrapher.createMenu("Item", settings);
        this.gameStarter.menuGrapher.addMenuList("Item", {
            options: options
        });
        this.gameStarter.menuGrapher.setActiveMenu("Item");
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
        let dialog: string[] = [].slice.call(title);

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
