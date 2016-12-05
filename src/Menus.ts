import { IMove } from "battlemovr/lib/IBattleMovr";
import { Component } from "eightbittr/lib/Component";
import { IGridCell, IMenuSchema, IMenuWordSchema } from "menugraphr/lib/IMenuGraphr";

import { KeysLowercase, KeysUppercase } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import {
    IHMMoveSchema, IItemSchema, IItemsMenuSettings, IKeyboardMenuSettings,
    IKeyboardResultsMenu, ILevelUpStatsMenuSettings, IListMenu, IMenu,
    IPlayer, IPokedexInformation, IPokedexListing, IPokemon, IThing
} from "./IFullScreenPokemon";

/**
 * Menu functions used by FullScreenPokemon instances.
 */
export class Menus<TEightBittr extends FullScreenPokemon> extends Component<TEightBittr> {
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
        if (this.eightBitter.itemsHolder.getItem("hasPokedex") === true) {
            const attributes: any = {
                "size": {
                    "height": 64
                }
            };

            options.unshift({
                text: "%%%%%%%POKEDEX%%%%%%%",
                callback: (): void => this.openPokedexMenu()
            });

            this.eightBitter.MenuGrapher.createMenu("Pause", attributes);
        } else {
            this.eightBitter.MenuGrapher.createMenu("Pause");
        }

        this.eightBitter.MenuGrapher.addMenuList("Pause", {
            options: options
        });
        this.eightBitter.MenuGrapher.setActiveMenu("Pause");
    }

    /**
     * Closes the Pause menu.
     */
    public closePauseMenu(): void {
        this.eightBitter.MenuGrapher.deleteMenu("Pause");
    }

    /**
     * Toggles whether the Pause menu is open. If there is an active menu, A
     * Start key trigger is registered in the MenuGraphr instead.
     */
    public togglePauseMenu(): void {
        if (this.eightBitter.MenuGrapher.getActiveMenu()) {
            this.eightBitter.MenuGrapher.registerStart();
            return;
        }

        let cutsceneSettings: any = this.eightBitter.scenePlayer.getCutsceneSettings();
        if (cutsceneSettings && cutsceneSettings.disablePauseMenu) {
            return;
        }

        this.eightBitter.MenuGrapher.getMenu("Pause")
            ? this.closePauseMenu()
            : this.openPauseMenu();
    }

    /**
     * Opens the Pokedex menu.
     */
    public openPokedexMenu(): void {
        const listings: (IPokedexInformation | undefined)[] = this.eightBitter.storage.getPokedexListingsOrdered();
        let currentListing: IPokedexInformation;

        this.eightBitter.MenuGrapher.createMenu("Pokedex");
        this.eightBitter.MenuGrapher.addMenuList("Pokedex", {
            options: listings.map((listing: IPokedexInformation, i: number): any => {
                const characters: any[] = this.eightBitter.utilities.makeDigit(i + 1, 3, 0).split("");
                const output: any = {
                    text: characters,
                    callback: (): void => {
                        currentListing = listing;
                        this.eightBitter.MenuGrapher.setActiveMenu("PokedexOptions");
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
        this.eightBitter.MenuGrapher.setActiveMenu("Pokedex");

        this.eightBitter.MenuGrapher.createMenu("PokedexOptions");
        this.eightBitter.MenuGrapher.addMenuList("PokedexOptions", {
            options: [
                {
                    text: "DATA",
                    callback: (): void => {
                        this.openPokedexListing(
                            currentListing.title,
                            (): void => this.eightBitter.MenuGrapher.setActiveMenu("PokedexOptions"));
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
                    callback: this.eightBitter.MenuGrapher.registerB
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
        const moves: IMove[] = settings.pokemon.moves;
        const options: any[] = [];

        for (const action of moves) {
            const move: IHMMoveSchema = this.eightBitter.mathDecider.getConstant("moves")[action.title];
            if (move.partyActivate && move.requiredBadge && this.eightBitter.itemsHolder.getItem("badges")[move.requiredBadge]) {
                options.push({
                    text: action.title.toUpperCase(),
                    callback: (): void => {
                        this.eightBitter.animations.partyActivateCheckThing(this.eightBitter.player, settings.pokemon, move);
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
                callback: this.eightBitter.MenuGrapher.registerB
            });

        this.eightBitter.MenuGrapher.createMenu("PokemonMenuContext", {
            backMenu: "Pokemon"
        });
        this.eightBitter.MenuGrapher.addMenuList("PokemonMenuContext", {
            options: options
        });
        this.eightBitter.MenuGrapher.setActiveMenu("PokemonMenuContext");
    }

    /**
     * Opens a statistics menu for a Pokemon.
     * 
     * @param pokemon   A Pokemon to show statistics of.
     */
    public openPokemonMenuStats(pokemon: IPokemon): void {
        const schemas: any = this.eightBitter.mathDecider.getConstant("pokemon");
        const schema: any = schemas[pokemon.title.join("")];
        const barWidth: number = 25;
        const health: number = this.eightBitter.mathDecider.compute(
            "widthHealthBar", barWidth, pokemon.HP, pokemon.HPNormal);

        this.eightBitter.MenuGrapher.createMenu("PokemonMenuStats", {
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

        this.eightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsTitle", [pokemon.nickname]);
        this.eightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsLevel", pokemon.level.toString());
        this.eightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsHP", pokemon.HP + "/ " + pokemon.HPNormal);
        this.eightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsNumber", this.eightBitter.utilities.makeDigit(schema.number, 3, 0));
        this.eightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsStatus", "OK");
        this.eightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsType1", pokemon.types[0]);
        if (pokemon.types.length >= 2) {
            this.eightBitter.MenuGrapher.createMenu("PokemonMenuStatsType2");
            this.eightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsType2", pokemon.types[1]);
        }
        this.eightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsID", "31425");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "PokemonMenuStatsOT",
            [
                "%%%%%%%PLAYER%%%%%%%"
            ]
        );

        this.eightBitter.MenuGrapher.createMenuThing("PokemonMenuStatsHPBar", {
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

        this.eightBitter.MenuGrapher.createMenuThing("PokemonMenuStats", {
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

        this.eightBitter.MenuGrapher.setActiveMenu("PokemonMenuStats");
    }

    /**
     * Opens the LevelUpStats menu for a Pokemon to view its statistics.
     * 
     * @param settings   Settings to open the menu.
     */
    public openPokemonLevelUpStats(settings: ILevelUpStatsMenuSettings): void {
        const pokemon: IPokemon = settings.pokemon;
        const statistics: string[] = this.eightBitter.mathDecider.getConstant("statisticNamesDisplayed").slice();
        const numStatistics: number = statistics.length;
        const textXOffset: number = settings.textXOffset || 8;
        const menuSchema: IMenuSchema = {
            callback: (): void => this.eightBitter.MenuGrapher.deleteMenu("LevelUpStats"),
            onMenuDelete: settings.onMenuDelete,
            position: settings.position || {
                horizontal: "center",
                vertical: "center"
            }
        };
        let top: number;
        let left: number;

        for (let i: number = 0; i < numStatistics; i += 1) {
            statistics.push(this.eightBitter.utilities.makeDigit((pokemon as any)[statistics[i] + "Normal"], 3, "\t"));
            statistics[i] = statistics[i].toUpperCase();
        }

        menuSchema.childrenSchemas = statistics.map((text: string, i: number): IMenuWordSchema => {
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

        this.eightBitter.MenuGrapher.createMenu("LevelUpStats", menuSchema);
    }

    /**
     * Open the secondary statistics menu from the LevelUpStats menu.
     * 
     * @param pokemon   The Pokemon to open the menu for.
     */
    public openPokemonMenuStatsSecondary(pokemon: IPokemon): void {
        const options: any[] = pokemon.moves.map(
            (move: IMove): any => {
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
                characters.push(...this.eightBitter.utilities.makeDigit(move.remaining, 2, " ").split(""));
                characters.push("/");
                characters.push(
                    ...this.eightBitter.utilities.makeDigit(
                        this.eightBitter.mathDecider.getConstant("moves")[move.title].PP, 2, " ")
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

        this.eightBitter.MenuGrapher.createMenu("PokemonMenuStatsExperience");

        this.eightBitter.MenuGrapher.addMenuDialog(
            "PokemonMenuStatsExperience",
            this.eightBitter.utilities.makeDigit(pokemon.experience.current, 10, "\t"));

        this.eightBitter.MenuGrapher.addMenuDialog(
            "PokemonMenuStatsExperienceFrom",
            this.eightBitter.utilities.makeDigit(
                (pokemon.experience.next - pokemon.experience.current), 3, "\t"));

        this.eightBitter.MenuGrapher.addMenuDialog(
            "PokemonMenuStatsExperienceNext",
            pokemon.level === 99 ? "" : (pokemon.level + 1).toString());

        this.eightBitter.MenuGrapher.createMenu("PokemonMenuStatsMoves");
        this.eightBitter.MenuGrapher.addMenuList("PokemonMenuStatsMoves", {
            options: options
        });

        this.eightBitter.MenuGrapher.getMenu("PokemonMenuStats").callback = (): void => {
            this.eightBitter.MenuGrapher.deleteMenu("PokemonMenuStats");
        };
    }

    /**
     * Opens a Pokedex listing for a Pokemon.
     *
     * @param title   The title of the Pokemon to open the listing for.
     * @param callback   A callback for when the menu is closed.
     */
    public openPokedexListing(title: string[], callback?: (...args: any[]) => void, menuSettings?: any): void {
        const pokemon: IPokedexListing = this.eightBitter.mathDecider.getConstant("pokemon")[title.join("")];
        const height: string[] = pokemon.height;
        const feet: string = [].slice.call(height[0]).reverse().join("");
        const inches: string = [].slice.call(height[1]).reverse().join("");
        const onCompletion: () => any = (): void => {
            this.eightBitter.MenuGrapher.deleteMenu("PokedexListing");
            if (callback) {
                callback();
            }
        };

        this.eightBitter.MenuGrapher.createMenu("PokedexListing", menuSettings);
        this.eightBitter.MenuGrapher.createMenuThing("PokedexListingSprite", {
            thing: title.join("") + "Front",
            type: "thing",
            args: {
                flipHoriz: true
            }
        });
        this.eightBitter.MenuGrapher.addMenuDialog("PokedexListingName", [[title]]);
        this.eightBitter.MenuGrapher.addMenuDialog("PokedexListingLabel", pokemon.label);
        this.eightBitter.MenuGrapher.addMenuDialog("PokedexListingHeightFeet", feet);
        this.eightBitter.MenuGrapher.addMenuDialog("PokedexListingHeightInches", inches);
        this.eightBitter.MenuGrapher.addMenuDialog("PokedexListingWeight", pokemon.weight.toString());
        this.eightBitter.MenuGrapher.addMenuDialog(
            "PokedexListingNumber",
            this.eightBitter.utilities.makeDigit(pokemon.number, 3, "0"));

        this.eightBitter.MenuGrapher.addMenuDialog(
            "PokedexListingInfo",
            pokemon.info[0],
            (): void => {
                if (pokemon.info.length < 2) {
                    onCompletion();
                    return;
                }

                this.eightBitter.MenuGrapher.createMenu("PokedexListingInfo");
                this.eightBitter.MenuGrapher.addMenuDialog("PokedexListingInfo", pokemon.info[1], onCompletion);
                this.eightBitter.MenuGrapher.setActiveMenu("PokedexListingInfo");
            });

        this.eightBitter.MenuGrapher.setActiveMenu("PokedexListingInfo");
    }

    /**
     * Opens a Pokemon menu for the Pokemon in the player's party.
     * 
     * @param settings   Custom attributes to apply to the menu.
     */
    public openPokemonMenu(settings: IMenuSchema): void {
        const listings: IPokemon[] = this.eightBitter.itemsHolder.getItem("PokemonInParty");
        if (!listings || !listings.length) {
            return;
        }

        const references: any = this.eightBitter.mathDecider.getConstant("pokemon");

        this.eightBitter.MenuGrapher.createMenu("Pokemon", settings);
        this.eightBitter.MenuGrapher.addMenuList("Pokemon", {
            options: listings.map((listing: IPokemon): any => {
                const sprite: string = references[listing.title.join("")].sprite + "Pokemon";
                const barWidth: number = 25;
                const health: number = this.eightBitter.mathDecider.compute(
                    "widthHealthBar", barWidth, listing.HP, listing.HPNormal);

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
        this.eightBitter.MenuGrapher.setActiveMenu("Pokemon");
    }

    /**
     * Opens the Items menu for the items in the player's inventory.
     * 
     * @param settings   Custom attributes to apply to the menu, as well as items
     *                   to optionally override the player's inventory.
     */
    public openItemsMenu(settings: IItemsMenuSettings): void {
        let items: IItemSchema[] = settings.items || this.eightBitter.itemsHolder.getItem("items").slice();

        this.eightBitter.modAttacher.fireEvent("onOpenItemsMenu", items);

        this.eightBitter.MenuGrapher.createMenu("Items", settings);
        this.eightBitter.MenuGrapher.addMenuList("Items", {
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
                            text: this.eightBitter.utilities.makeDigit(schema.amount, 2, " "),
                            x: 36.5,
                            y: 4
                        }
                    ]
                };
            })
        });
        this.eightBitter.MenuGrapher.setActiveMenu("Items");

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

        this.eightBitter.modAttacher.fireEvent("onOpenItemMenu", itemName);

        this.eightBitter.MenuGrapher.createMenu("Item", settings);
        this.eightBitter.MenuGrapher.addMenuList("Item", {
            options: options
        });
        this.eightBitter.MenuGrapher.setActiveMenu("Item");
    }

    /**
     * Opens the Player menu.
     */
    public openPlayerMenu(): void {
        this.eightBitter.MenuGrapher.createMenu("Player", {
            callback: (): void => this.eightBitter.MenuGrapher.registerB()
        });
        this.eightBitter.MenuGrapher.setActiveMenu("Player");
    }

    /**
     * Opens the Save menu.
     */
    public openSaveMenu(): void {
        this.eightBitter.MenuGrapher.createMenu("Save");

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog("GeneralText", "Would you like to SAVE the game?");

        this.eightBitter.MenuGrapher.createMenu("Yes/No", {
            backMenu: "Pause"
        });
        this.eightBitter.MenuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: (): void => this.eightBitter.storage.downloadSaveGame()
                }, {
                    text: "NO",
                    callback: (): void => this.eightBitter.MenuGrapher.registerB()
                }]
        });
        this.eightBitter.MenuGrapher.setActiveMenu("Yes/No");

        this.eightBitter.storage.autoSave();
    }

    /**
     * Opens the Keyboard menu and binds it to some required callbacks.
     * 
     * @param settings   Settings to apply to the menu and for callbacks.
     */
    public openKeyboardMenu(settings: IKeyboardMenuSettings = {}): void {
        const value: string[][] = [settings.value || ["_", "_", "_", "_", "_", "_", "_"]];
        const onKeyPress: () => void = (): void => this.addKeyboardMenuValue();
        const onBPress: () => void = (): void => this.removeKeyboardMenuValue();
        const onComplete: (...args: any[]) => void = (settings.callback || onKeyPress).bind(this);
        const lowercase: boolean = !!settings.lowercase;
        const letters: string[] = lowercase
            ? KeysLowercase
            : KeysUppercase;
        const options: any[] = letters.map((letter: string): any => {
            return {
                text: [letter],
                value: letter,
                callback: letter !== "ED"
                    ? onKeyPress
                    : onComplete
            };
        });

        this.eightBitter.MenuGrapher.createMenu("Keyboard", {
            settings: settings,
            onKeyPress: onKeyPress,
            onComplete: onComplete,
            ignoreB: false
        } as IMenuSchema);

        const menuResults: IKeyboardResultsMenu = this.eightBitter.MenuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu;

        this.eightBitter.MenuGrapher.addMenuDialog("KeyboardTitle", [[
            settings.title || "",
        ]]);

        this.eightBitter.MenuGrapher.addMenuDialog("KeyboardResult", value);

        this.eightBitter.MenuGrapher.addMenuList("KeyboardKeys", {
            options: options,
            selectedIndex: settings.selectedIndex,
            bottom: {
                text: lowercase ? "UPPER CASE" : "lower case",
                callback: (): void => this.switchKeyboardCase(),
                position: {
                    top: 40,
                    left: 0
                }
            }
        });
        this.eightBitter.MenuGrapher.getMenu("KeyboardKeys").onBPress = onBPress;
        this.eightBitter.MenuGrapher.setActiveMenu("KeyboardKeys");

        menuResults.displayedValue = value.slice()[0];
        menuResults.completeValue = settings.completeValue || [];
        menuResults.selectedChild = settings.selectedChild || 0;
        menuResults.blinker = this.eightBitter.things.add(
            "CharMDash",
            menuResults.children[menuResults.selectedChild].left,
            menuResults.children[menuResults.selectedChild].top);
        menuResults.children.push(menuResults.blinker);
        menuResults.children[menuResults.selectedChild].hidden = true;
    }

    /**
     * Adds a value to the keyboard menu from the currently selected item.
     */
    public addKeyboardMenuValue(): void {
        const menuKeys: IListMenu = this.eightBitter.MenuGrapher.getMenu("KeyboardKeys") as IListMenu;
        const menuResult: IKeyboardResultsMenu = this.eightBitter.MenuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu;
        let child: IThing = menuResult.children[menuResult.selectedChild];
        if (!child) {
            return;
        }

        const selected: IGridCell = this.eightBitter.MenuGrapher.getMenuSelectedOption("KeyboardKeys");

        this.eightBitter.physics.killNormal(child);
        menuResult.children[menuResult.selectedChild] = this.eightBitter.things.add(
            selected.title!, child.left, child.top);

        menuResult.displayedValue[menuResult.selectedChild] = selected.text[0] as string;
        menuResult.completeValue.push(selected.value);
        menuResult.selectedChild += 1;

        if (menuResult.selectedChild < menuResult.children.length - 1) {
            child = menuResult.children[menuResult.selectedChild];
            child.hidden = true;
        } else {
            menuResult.blinker.hidden = true;
            this.eightBitter.MenuGrapher.setSelectedIndex(
                "KeyboardKeys",
                menuKeys.gridColumns - 1,
                menuKeys.gridRows - 2); // assume there's a bottom option
        }

        this.eightBitter.physics.setLeft(menuResult.blinker, child.left);
        this.eightBitter.physics.setTop(menuResult.blinker, child.top);
    }

    /**
     * Removes the rightmost keyboard menu value.
     */
    public removeKeyboardMenuValue(): void {
        let menuResult: IKeyboardResultsMenu = this.eightBitter.MenuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu;
        if (menuResult.selectedChild <= 0) {
            return;
        }

        let child: IThing = menuResult.children[menuResult.selectedChild - 1];

        menuResult.selectedChild -= 1;
        menuResult.completeValue = menuResult.completeValue.slice(
            0, menuResult.completeValue.length - 1);
        menuResult.displayedValue[menuResult.selectedChild] = "_";

        this.eightBitter.physics.killNormal(child);

        child = menuResult.children[menuResult.selectedChild];

        menuResult.children[menuResult.selectedChild + 1] = this.eightBitter.things.add(
            "CharUnderscore", child.right, child.top);

        this.eightBitter.physics.setLeft(menuResult.blinker, child.left);
        this.eightBitter.physics.setTop(menuResult.blinker, child.top);
    }

    /**
     * Switches the keyboard menu's case.
     */
    public switchKeyboardCase(): void {
        const keyboard: IMenu = this.eightBitter.MenuGrapher.getMenu("Keyboard") as IMenu;
        const keyboardKeys: IListMenu = this.eightBitter.MenuGrapher.getMenu("KeyboardKeys") as IListMenu;
        const keyboardResult: IKeyboardResultsMenu = this.eightBitter.MenuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu;
        const settings: any = keyboard.settings;

        settings.lowercase = !settings.lowercase;
        settings.value = keyboardResult.displayedValue;
        settings.selectedChild = keyboardResult.selectedChild;
        settings.displayedValue = keyboardResult.displayedValue;
        settings.completeValue = keyboardResult.completeValue;
        settings.selectedIndex = keyboardKeys.selectedIndex;

        this.openKeyboardMenu(settings);
    }

    /**
     * Opens the Town Map menu.
     * 
     * @param settings   Custom attributes to apply to the menu.
     */
    public openTownMapMenu(settings?: IMenuSchema): void {
        const playerPosition: number[] = this.eightBitter.mathDecider.getConstant("townMapLocations")["Pallet Town"];
        const playerSize: any = this.eightBitter.objectMaker.getFullPropertiesOf("Player");

        this.eightBitter.MenuGrapher.createMenu("Town Map", settings);
        this.eightBitter.MenuGrapher.createMenuThing("Town Map Inside", {
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
        this.eightBitter.MenuGrapher.setActiveMenu("Town Map");
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

        this.eightBitter.MenuGrapher.addMenuDialog("Town Map", [dialog]);

        console.warn("Pokemon map locations not implemented.");
    }

    /**
     * Displays message when a Player tries to use an item that cannot be used.
     *
     * @param player   A Player who cannot use an item.
     */
    public cannotDoThat(player: IPlayer): void {
        this.displayMessage(player, "OAK: %%%%%%%PLAYER%%%%%%%! \n This isn't the \n time to use that!");
    }

    /**
     * Displays a message to the user.
     *
     * @param _thing   The Thing that triggered the error.
     * @param message   The message to be displayed.
     */
    public displayMessage(_thing: IThing, message: string): void {
        if (this.eightBitter.MenuGrapher.getActiveMenu()) {
            return;
        }

        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            deleteOnFinish: true
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                message
            ]
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }
}
