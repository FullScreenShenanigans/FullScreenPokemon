/// <reference path="../typings/BattleMovr.d.ts" />
/// <reference path="../typings/EightBittr.d.ts" />
/// <reference path="../typings/MenuGraphr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import { KeysLowercase, KeysUppercase } from "./Constants";
import {
    IHMMoveSchema, IItemsMenuSettings, IItemSchema, IKeyboardMenuSettings,
    IKeyboardResultsMenu, ILevelUpStatsMenuSettings, IListMenu, IMenu,
    IPokedexInformation, IPlayer, IPokedexListing, IPokemon, IThing
} from "./IFullScreenPokemon";

/**
 * Menu functions used by FullScreenPokemon instances.
 */
export class Menus<TEightBittr extends FullScreenPokemon> extends EightBittr.Component<TEightBittr> {
    /**
     * Opens the Pause menu.
     */
    public openPauseMenu(): void {
        const options: any[] = [
            {
                "text": "%%%%%%%POKEMON%%%%%%%",
                "callback": (): void => this.openPokemonMenu({
                    // "onSwitch": ...
                })
            }, {
                "text": "ITEM",
                "callback": (settings: IItemsMenuSettings): void => this.openItemsMenu(settings)
            }, {
                "text": "%%%%%%%PLAYER%%%%%%%",
                "callback": (): void => this.openPlayerMenu()
            }, {
                "text": "SAVE",
                "callback": (): void => this.openSaveMenu()
            }, {
                "text": "OPTION"
            }, {
                "text": "Exit",
                "callback": (): void => this.closePauseMenu()
            }];

        // The Pokedex option is only shown if the Player has one
        if (this.EightBitter.ItemsHolder.getItem("hasPokedex") === true) {
            options.unshift({
                "text": "%%%%%%%POKEDEX%%%%%%%",
                "callback": (): void => this.openPokedexMenu()
            });
        }

        this.EightBitter.MenuGrapher.createMenu("Pause");
        this.EightBitter.MenuGrapher.addMenuList("Pause", {
            options: options
        });
        this.EightBitter.MenuGrapher.setActiveMenu("Pause");
    }

    /**
     * Closes the Pause menu.
     */
    public closePauseMenu(): void {
        this.EightBitter.MenuGrapher.deleteMenu("Pause");
    }

    /**
     * Toggles whether the Pause menu is open. If there is an active menu, A
     * Start key trigger is registered in the MenuGraphr instead.
     */
    public togglePauseMenu(thing: IThing): void {
        if (this.EightBitter.MenuGrapher.getActiveMenu()) {
            this.EightBitter.MenuGrapher.registerStart();
            return;
        }

        let cutsceneSettings: any = this.EightBitter.ScenePlayer.getCutsceneSettings();
        if (cutsceneSettings && cutsceneSettings.disablePauseMenu) {
            return;
        }

        this.EightBitter.MenuGrapher.getMenu("Pause")
            ? this.closePauseMenu()
            : this.openPauseMenu();
    }

    /**
     * Opens the Pokedex menu.
     */
    public openPokedexMenu(): void {
        const listings: IPokedexInformation[] = this.EightBitter.storage.getPokedexListingsOrdered();
        let currentListing: IPokedexInformation;

        this.EightBitter.MenuGrapher.createMenu("Pokedex");
        this.EightBitter.MenuGrapher.addMenuList("Pokedex", {
            "options": listings.map((listing: IPokedexInformation, i: number): any => {
                const characters: any[] = this.EightBitter.utilities.makeDigit(i + 1, 3, 0).split("");
                const output: any = {
                    "text": characters,
                    "callback": (): void => {
                        currentListing = listing;
                        this.EightBitter.MenuGrapher.setActiveMenu("PokedexOptions");
                    }
                };

                characters.push({
                    "command": true,
                    "y": 4
                });

                if (listing) {
                    if (listing.caught) {
                        characters.push({
                            "command": true,
                            "x": -4,
                            "y": 1
                        });
                        characters.push("Ball");
                        characters.push({
                            "command": true,
                            "y": -1
                        });
                    }

                    characters.push(...listing.title);
                } else {
                    characters.push(..."----------".split(""));
                }

                characters.push({
                    "command": true,
                    "y": -4
                });

                return output;
            })
        });
        this.EightBitter.MenuGrapher.setActiveMenu("Pokedex");

        this.EightBitter.MenuGrapher.createMenu("PokedexOptions");
        this.EightBitter.MenuGrapher.addMenuList("PokedexOptions", {
            "options": [
                {
                    "text": "DATA",
                    "callback": (): void => {
                        this.openPokedexListing(
                            currentListing.title,
                            (): void => this.EightBitter.MenuGrapher.setActiveMenu("PokedexOptions"));
                    }
                }, {
                    "text": "CRY"
                }, {
                    "text": "AREA",
                    "callback": (): void => {
                        this.openTownMapMenu({
                            "backMenu": "PokedexOptions"
                        });
                        this.showTownMapPokemonLocations(currentListing.title);
                    }
                }, {
                    "text": "QUIT",
                    "callback": this.EightBitter.MenuGrapher.registerB
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
        const moves: BattleMovr.IMove[] = settings.pokemon.moves;
        const options: any[] = [];

        for (const action of moves) {
            const move: IHMMoveSchema = this.EightBitter.MathDecider.getConstant("moves")[action.title];
            if (move.partyActivate && move.requiredBadge && this.EightBitter.ItemsHolder.getItem("badges")[move.requiredBadge]) {
                options.push({
                    "text": action.title.toUpperCase(),
                    "callback": (): void => {
                        this.EightBitter.animations.partyActivateCheckThing(this.EightBitter.player, settings.pokemon, move);
                    }
                });
            }
        }

        options.push(
            {
                "text": "STATS",
                "callback": (): void => this.openPokemonMenuStats(settings.pokemon)
            },
            {
                "text": "SWITCH",
                "callback": settings.onSwitch
            },
            {
                "text": "CANCEL",
                "callback": this.EightBitter.MenuGrapher.registerB
            });

        this.EightBitter.MenuGrapher.createMenu("PokemonMenuContext", {
            "backMenu": "Pokemon"
        });
        this.EightBitter.MenuGrapher.addMenuList("PokemonMenuContext", {
            "options": options
        });
        this.EightBitter.MenuGrapher.setActiveMenu("PokemonMenuContext");
    }

    /**
     * Opens a statistics menu for a Pokemon.
     * 
     * @param pokemon   A Pokemon to show statistics of.
     */
    public openPokemonMenuStats(pokemon: IPokemon): void {
        const schemas: any = this.EightBitter.MathDecider.getConstant("pokemon");
        const schema: any = schemas[pokemon.title.join("")];
        const barWidth: number = 25;
        const health: number = this.EightBitter.MathDecider.compute(
            "widthHealthBar", barWidth, pokemon.HP, pokemon.HPNormal);

        this.EightBitter.MenuGrapher.createMenu("PokemonMenuStats", {
            "backMenu": "PokemonMenuContext",
            "callback": (): void => this.openPokemonMenuStatsSecondary(pokemon),
            "container": "Pokemon"
        });

        this.openPokemonLevelUpStats({
            "pokemon": pokemon,
            "container": "PokemonMenuStats",
            "size": {
                "width": 40,
                "height": 40
            },
            "position": {
                "vertical": "bottom",
                "horizontal": "left",
                "offset": {
                    "left": 3,
                    "top": -3
                }
            },
            "textXOffset": 4
        });

        this.EightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsTitle", [pokemon.nickname]);
        this.EightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsLevel", pokemon.level.toString());
        this.EightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsHP", pokemon.HP + "/ " + pokemon.HPNormal);
        this.EightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsNumber", this.EightBitter.utilities.makeDigit(schema.number, 3, 0));
        this.EightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsStatus", "OK");
        this.EightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsType1", pokemon.types[0]);
        if (pokemon.types.length >= 2) {
            this.EightBitter.MenuGrapher.createMenu("PokemonMenuStatsType2");
            this.EightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsType2", pokemon.types[1]);
        }
        this.EightBitter.MenuGrapher.addMenuDialog("PokemonMenuStatsID", "31425");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "PokemonMenuStatsOT",
            [
                "%%%%%%%PLAYER%%%%%%%"
            ]
        );

        this.EightBitter.MenuGrapher.createMenuThing("PokemonMenuStatsHPBar", {
            "type": "thing",
            "thing": "LightGraySquare",
            "position": {
                "horizontal": "left",
                "offset": {
                    "top": 0.5,
                    "left": 8.5
                }
            },
            "args": {
                "width": Math.max(health, 1),
                "height": 1,
                "hidden": health === 0
            }
        });

        this.EightBitter.MenuGrapher.createMenuThing("PokemonMenuStats", {
            "type": "thing",
            "thing": pokemon.title.join("") + "Front",
            "args": {
                "flipHoriz": true
            },
            "position": {
                "vertical": "bottom",
                "offset": {
                    "left": 9,
                    "top": -48
                }
            }
        });

        this.EightBitter.MenuGrapher.setActiveMenu("PokemonMenuStats");
    }

    /**
     * Opens the LevelUpStats menu for a Pokemon to view its statistics.
     * 
     * @param settings   Settings to open the menu.
     */
    public openPokemonLevelUpStats(settings: ILevelUpStatsMenuSettings): void {
        const pokemon: IPokemon = settings.pokemon;
        const statistics: string[] = this.EightBitter.MathDecider.getConstant("statisticNamesDisplayed").slice();
        const numStatistics: number = statistics.length;
        const textXOffset: number = settings.textXOffset || 8;
        const menuSchema: MenuGraphr.IMenuSchema = {
            callback: (): void => this.EightBitter.MenuGrapher.deleteMenu("LevelUpStats"),
            onMenuDelete: settings.onMenuDelete,
            position: settings.position || {
                horizontal: "center",
                vertical: "center"
            }
        };
        let top: number;
        let left: number;

        for (let i: number = 0; i < numStatistics; i += 1) {
            statistics.push(this.EightBitter.utilities.makeDigit((pokemon as any)[statistics[i] + "Normal"], 3, "\t"));
            statistics[i] = statistics[i].toUpperCase();
        }

        menuSchema.childrenSchemas = statistics.map((text: string, i: number): MenuGraphr.IMenuWordSchema => {
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

        this.EightBitter.MenuGrapher.createMenu("LevelUpStats", menuSchema);
    }

    /**
     * Open the secondary statistics menu from the LevelUpStats menu.
     * 
     * @param pokemon   The Pokemon to open the menu for.
     */
    public openPokemonMenuStatsSecondary(pokemon: IPokemon): void {
        const options: any[] = pokemon.moves.map(
            (move: BattleMovr.IMove): any => {
                const characters: any[] = [" "];
                const output: any = {
                    "text": characters
                };

                characters.push({
                    "command": true,
                    "x": 40,
                    "y": 4
                });

                characters.push({
                    "command": true,
                    "y": .5
                });
                characters.push("PP", " ");
                characters.push({
                    "command": true,
                    "y": -.5
                });
                characters.push(...this.EightBitter.utilities.makeDigit(move.remaining, 2, " ").split(""));
                characters.push("/");
                characters.push(
                    ...this.EightBitter.utilities.makeDigit(
                        this.EightBitter.MathDecider.getConstant("moves")[move.title].PP, 2, " ")
                            .split(""));

                characters.push({
                    "command": true,
                    "x": -75,
                    "y": -4
                });

                // TODO: Moves should always be uppercase...
                characters.push(...move.title.toUpperCase().split(""));

                return output;
            });

        // Fill any remaining options with "-" and "--" for move and PP, respectively
        for (let i: number = options.length; i < 4; i += 1) {
            options.push({
                "text": [
                    "-",
                    {
                        "command": true,
                        "x": 40,
                        "y": 4
                    },
                    "-",
                    "-"
                ]
            });
        }

        this.EightBitter.MenuGrapher.createMenu("PokemonMenuStatsExperience");

        this.EightBitter.MenuGrapher.addMenuDialog(
            "PokemonMenuStatsExperience",
            this.EightBitter.utilities.makeDigit(pokemon.experience.current, 10, "\t"));

        this.EightBitter.MenuGrapher.addMenuDialog(
            "PokemonMenuStatsExperienceFrom",
            this.EightBitter.utilities.makeDigit(pokemon.experience.remaining, 3, "\t"));

        this.EightBitter.MenuGrapher.addMenuDialog(
            "PokemonMenuStatsExperienceNext",
            pokemon.level === 99 ? "" : (pokemon.level + 1).toString());

        this.EightBitter.MenuGrapher.createMenu("PokemonMenuStatsMoves");
        this.EightBitter.MenuGrapher.addMenuList("PokemonMenuStatsMoves", {
            "options": options
        });

        this.EightBitter.MenuGrapher.getMenu("PokemonMenuStats").callback = (): void => {
            this.EightBitter.MenuGrapher.deleteMenu("PokemonMenuStats");
        };
    }

    /**
     * Opens a Pokedex listing for a Pokemon.
     *
     * @param title   The title of the Pokemon to open the listing for.
     * @param callback   A callback for when the menu is closed.
     */
    public openPokedexListing(title: string[], callback?: (...args: any[]) => void, menuSettings?: any): void {
        let pokemon: IPokedexListing = this.EightBitter.MathDecider.getConstant("pokemon")[title.join("")],
            height: string[] = pokemon.height,
            feet: string = [].slice.call(height[0]).reverse().join(""),
            inches: string = [].slice.call(height[1]).reverse().join(""),
            onCompletion: () => any = (): void => {
                this.EightBitter.MenuGrapher.deleteMenu("PokedexListing");
                if (callback) {
                    callback();
                }
            };

        this.EightBitter.MenuGrapher.createMenu("PokedexListing", menuSettings);
        this.EightBitter.MenuGrapher.createMenuThing("PokedexListingSprite", {
            "thing": title.join("") + "Front",
            "type": "thing",
            "args": {
                "flipHoriz": true
            }
        });
        this.EightBitter.MenuGrapher.addMenuDialog("PokedexListingName", [[title]]);
        this.EightBitter.MenuGrapher.addMenuDialog("PokedexListingLabel", pokemon.label);
        this.EightBitter.MenuGrapher.addMenuDialog("PokedexListingHeightFeet", feet);
        this.EightBitter.MenuGrapher.addMenuDialog("PokedexListingHeightInches", inches);
        this.EightBitter.MenuGrapher.addMenuDialog("PokedexListingWeight", pokemon.weight.toString());
        this.EightBitter.MenuGrapher.addMenuDialog(
            "PokedexListingNumber",
            this.EightBitter.utilities.makeDigit(pokemon.number, 3, "0"));

        this.EightBitter.MenuGrapher.addMenuDialog(
            "PokedexListingInfo",
            pokemon.info[0],
            (): void => {
                if (pokemon.info.length < 2) {
                    onCompletion();
                    return;
                }

                this.EightBitter.MenuGrapher.createMenu("PokedexListingInfo");
                this.EightBitter.MenuGrapher.addMenuDialog("PokedexListingInfo", pokemon.info[1], onCompletion);
                this.EightBitter.MenuGrapher.setActiveMenu("PokedexListingInfo");
            });

        this.EightBitter.MenuGrapher.setActiveMenu("PokedexListingInfo");
    }

    /**
     * Opens a Pokemon menu for the Pokemon in the player's party.
     * 
     * @param settings   Custom attributes to apply to the menu.
     */
    public openPokemonMenu(settings: MenuGraphr.IMenuSchema): void {
        let listings: BattleMovr.IActor[] = this.EightBitter.ItemsHolder.getItem("PokemonInParty");
        if (!listings || !listings.length) {
            return;
        }

        let references: any = this.EightBitter.MathDecider.getConstant("pokemon");

        this.EightBitter.MenuGrapher.createMenu("Pokemon", settings);
        this.EightBitter.MenuGrapher.addMenuList("Pokemon", {
            "options": listings.map((listing: BattleMovr.IActor, i: number): any => {
                let sprite: string = references[listing.title.join("")].sprite + "Pokemon",
                    barWidth: number = 25,
                    health: number = this.EightBitter.MathDecider.compute(
                        "widthHealthBar", barWidth, listing.HP, listing.HPNormal);

                return {
                    "text": listing.title,
                    "callback": (): void => this.openPokemonMenuContext({
                        "pokemon": listing
                        // "onSwitch": (): void => settings.onSwitch("player", i)
                    }),
                    "things": [
                        {
                            "thing": sprite,
                            "position": {
                                "offset": {
                                    "left": 7.5,
                                    "top": .5
                                }
                            }
                        },
                        {
                            "thing": "CharLevel",
                            "position": {
                                "offset": {
                                    "left": 56,
                                    "top": 1.5
                                }
                            }
                        },
                        {
                            "thing": "CharHP",
                            "position": {
                                "offset": {
                                    "left": 20,
                                    "top": 5.5
                                }
                            }
                        },
                        {
                            "thing": "HPBar",
                            "args": {
                                "width": barWidth
                            },
                            "position": {
                                "offset": {
                                    "left": 27,
                                    "top": 5.5
                                }
                            }
                        },
                        {
                            "thing": "LightGraySquare",
                            "args": {
                                "width": Math.max(health, 1),
                                "height": 1,
                                "hidden": health === 0
                            },
                            "position": {
                                "offset": {
                                    "left": 27.5,
                                    "top": 6
                                }
                            }
                        }],
                    "textsFloating": [
                        {
                            "text": String(listing.level),
                            "x": 44.25,
                            "y": 0
                        },
                        {
                            "text": listing.HP + "/ " + listing.HPNormal,
                            "x": 43.75,
                            "y": 4
                        }]
                };
            })
        });
        this.EightBitter.MenuGrapher.setActiveMenu("Pokemon");
    }

    /**
     * Opens the Items menu for the items in the player's inventory.
     * 
     * @param settings   Custom attributes to apply to the menu, as well as items
     *                   to optionally override the player's inventory.
     */
    public openItemsMenu(settings: IItemsMenuSettings): void {
        let items: IItemSchema[] = settings.items || this.EightBitter.ItemsHolder.getItem("items").slice();

        this.EightBitter.ModAttacher.fireEvent("onOpenItemsMenu", items);

        this.EightBitter.MenuGrapher.createMenu("Items", settings);
        this.EightBitter.MenuGrapher.addMenuList("Items", {
            "options": items.map((schema: any): any => {
                return {
                    "text": schema.item,
                    "textsFloating": [
                        {
                            "text": [["Times"]],
                            "x": 32,
                            "y": 4.5
                        }, {
                            "text": this.EightBitter.utilities.makeDigit(schema.amount, 2, " "),
                            "x": 36.5,
                            "y": 4
                        }
                    ]
                };
            })
        });
        this.EightBitter.MenuGrapher.setActiveMenu("Items");

        console.warn("Once math.js contains item info, react to non-stackable items...");
    }

    /**
     * Opens the Player menu.
     */
    public openPlayerMenu(): void {
        this.EightBitter.MenuGrapher.createMenu("Player", {
            "callback": (): void => this.EightBitter.MenuGrapher.registerB()
        });
        this.EightBitter.MenuGrapher.setActiveMenu("Player");
    }

    /**
     * Opens the Save menu.
     */
    public openSaveMenu(): void {
        this.EightBitter.MenuGrapher.createMenu("Save");

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog("GeneralText", "Would you like to SAVE the game?");

        this.EightBitter.MenuGrapher.createMenu("Yes/No", {
            "backMenu": "Pause"
        });
        this.EightBitter.MenuGrapher.addMenuList("Yes/No", {
            "options": [
                {
                    "text": "YES",
                    "callback": (): void => this.EightBitter.storage.downloadSaveGame()
                }, {
                    "text": "NO",
                    "callback": (): void => this.EightBitter.MenuGrapher.registerB()
                }]
        });
        this.EightBitter.MenuGrapher.setActiveMenu("Yes/No");

        this.EightBitter.storage.autoSave();
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
        const lowercase: boolean = settings.lowercase;
        const letters: string[] = lowercase
            ? KeysLowercase
            : KeysUppercase;
        const options: any[] = letters.map((letter: string): any => {
            return {
                "text": [letter],
                "value": letter,
                "callback": letter !== "ED"
                    ? onKeyPress
                    : onComplete
            };
        });

        this.EightBitter.MenuGrapher.createMenu("Keyboard", <MenuGraphr.IMenuSchema>{
            "settings": settings,
            "onKeyPress": onKeyPress,
            "onComplete": onComplete,
            "ignoreB": false
        });

        const menuResults: IKeyboardResultsMenu = <IKeyboardResultsMenu>this.EightBitter.MenuGrapher.getMenu("KeyboardResult");

        this.EightBitter.MenuGrapher.addMenuDialog("KeyboardTitle", [[
            settings.title || "",
        ]]);

        this.EightBitter.MenuGrapher.addMenuDialog("KeyboardResult", value);

        this.EightBitter.MenuGrapher.addMenuList("KeyboardKeys", {
            "options": options,
            "selectedIndex": settings.selectedIndex,
            "bottom": {
                "text": lowercase ? "UPPER CASE" : "lower case",
                "callback": (): void => this.switchKeyboardCase(),
                "position": {
                    "top": 40,
                    "left": 0
                }
            }
        });
        this.EightBitter.MenuGrapher.getMenu("KeyboardKeys").onBPress = onBPress;
        this.EightBitter.MenuGrapher.setActiveMenu("KeyboardKeys");

        menuResults.displayedValue = value.slice()[0];
        menuResults.completeValue = settings.completeValue || [];
        menuResults.selectedChild = settings.selectedChild || 0;
        menuResults.blinker = this.EightBitter.things.add(
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
        let menuKeys: IListMenu = <IListMenu>this.EightBitter.MenuGrapher.getMenu("KeyboardKeys"),
            menuResult: IKeyboardResultsMenu = <IKeyboardResultsMenu>this.EightBitter.MenuGrapher.getMenu("KeyboardResult"),
            child: IThing = menuResult.children[menuResult.selectedChild];

        if (!child) {
            return;
        }

        let selected: MenuGraphr.IGridCell = this.EightBitter.MenuGrapher.getMenuSelectedOption("KeyboardKeys");

        this.EightBitter.physics.killNormal(child);
        menuResult.children[menuResult.selectedChild] = this.EightBitter.things.add(
            selected.title, child.left, child.top);

        menuResult.displayedValue[menuResult.selectedChild] = <string>selected.text[0];
        menuResult.completeValue.push(selected.value);
        menuResult.selectedChild += 1;

        if (menuResult.selectedChild < menuResult.children.length - 1) {
            child = menuResult.children[menuResult.selectedChild];
            child.hidden = true;
        } else {
            menuResult.blinker.hidden = true;
            this.EightBitter.MenuGrapher.setSelectedIndex(
                "KeyboardKeys",
                menuKeys.gridColumns - 1,
                menuKeys.gridRows - 2); // assume there's a bottom option
        }

        this.EightBitter.physics.setLeft(menuResult.blinker, child.left);
        this.EightBitter.physics.setTop(menuResult.blinker, child.top);
    }

    /**
     * Removes the rightmost keyboard menu value.
     */
    public removeKeyboardMenuValue(): void {
        let menuResult: IKeyboardResultsMenu = <IKeyboardResultsMenu>this.EightBitter.MenuGrapher.getMenu("KeyboardResult");
        if (menuResult.selectedChild <= 0) {
            return;
        }

        let child: IThing = menuResult.children[menuResult.selectedChild - 1];

        menuResult.selectedChild -= 1;
        menuResult.completeValue = menuResult.completeValue.slice(
            0, menuResult.completeValue.length - 1);
        menuResult.displayedValue[menuResult.selectedChild] = "_";

        this.EightBitter.physics.killNormal(child);

        child = menuResult.children[menuResult.selectedChild];

        menuResult.children[menuResult.selectedChild + 1] = this.EightBitter.things.add(
            "CharUnderscore", child.right, child.top);

        this.EightBitter.physics.setLeft(menuResult.blinker, child.left);
        this.EightBitter.physics.setTop(menuResult.blinker, child.top);
    }

    /**
     * Switches the keyboard menu's case.
     */
    public switchKeyboardCase(): void {
        let keyboard: IMenu = <IMenu>this.EightBitter.MenuGrapher.getMenu("Keyboard"),
            keyboardKeys: IListMenu = <IListMenu>this.EightBitter.MenuGrapher.getMenu("KeyboardKeys"),
            keyboardResult: IKeyboardResultsMenu = <IKeyboardResultsMenu>this.EightBitter.MenuGrapher.getMenu("KeyboardResult"),
            settings: any = keyboard.settings;

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
    public openTownMapMenu(settings?: MenuGraphr.IMenuSchema): void {
        let playerPosition: number[] = this.EightBitter.MathDecider.getConstant("townMapLocations")["Pallet Town"],
            playerSize: any = this.EightBitter.ObjectMaker.getFullPropertiesOf("Player");

        this.EightBitter.MenuGrapher.createMenu("Town Map", settings);
        this.EightBitter.MenuGrapher.createMenuThing("Town Map Inside", {
            "type": "thing",
            "thing": "Player",
            "args": {
                "nocollide": true
            },
            "position": {
                "offset": {
                    "left": playerPosition[0] - (playerSize.width / 2),
                    "top": playerPosition[1] - (playerSize.height / 2)
                }
            }
        });
        this.EightBitter.MenuGrapher.setActiveMenu("Town Map");
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

        this.EightBitter.MenuGrapher.addMenuDialog("Town Map", [dialog]);

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
     * @param thing   The Thing that triggered the error.
     * @param message   The message to be displayed.
     */
    public displayMessage(thing: IThing, message: string): void {
        if (this.EightBitter.MenuGrapher.getActiveMenu()) {
            return;
        }

        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            "deleteOnFinish": true
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                message
            ]
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }
}
