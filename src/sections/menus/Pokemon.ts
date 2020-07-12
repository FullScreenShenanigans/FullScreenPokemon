import { IMove } from "battlemovr";
import { Section } from "eightbittr";
import { IMenuSchemaPosition, IMenuSchemaSize, IMenuWordSchema } from "menugraphr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokemon } from "../Battles";
import { IHMMoveSchema } from "../constants/Moves";
import { IPokemonListing } from "../constants/Pokemon";
import { IMenuSchema } from "../Menus";

/**
 * Callback for switching a Pokemon.
 *
 * @param pokemon   A selected Pokemon.
 */
export type IOnPokemonSwitch = (pokemon: IPokemon) => void;

/**
 * Settings to open the items menu.
 */
export interface IPartyMenuSettings extends IMenuSchema {
    /**
     * Callback for when a Pokemon should be switched.
     */
    onSwitch: IOnPokemonSwitch;

    /**
     * Pokemon to display, if not the player's party.
     */
    pokemon?: IPokemon[];
}

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
    onMenuDelete?(): void;

    /**
     * How to position the menu within its container.
     */
    position?: IMenuSchemaPosition;

    /**
     * How to size the menu.
     */
    size?: IMenuSchemaSize;

    /**
     * A horizontal offset for the menu.
     */
    textXOffset?: number;
}

/**
 * Manipulates Pokemon party and detail menus.
 */
export class Pokemon extends Section<FullScreenPokemon> {
    /**
     * A map to translate how status is stored in the code into in-game form.
     */
    private static readonly statusTranslate: { [i: string]: string } = {
        frozen: "FRZ",
        paralyzed: "PAR",
        poison: "PSN",
        sleep: "SLP",
    };

    /**
     * Opens the Pokemon menu for the player's party.
     *
     * @param settings   Custom attributes to apply to the menu.
     */
    public openPartyMenu(settings: IPartyMenuSettings): void {
        const listings: IPokemon[] =
            settings.pokemon ||
            this.game.itemsHolder.getItem(this.game.storage.names.pokemonInParty);

        this.game.menuGrapher.createMenu("Pokemon", settings);
        this.game.menuGrapher.addMenuList("Pokemon", {
            options: listings.map((listing: IPokemon): any => {
                const title: string = listing.title.join("");
                const sprite: string =
                    this.game.constants.pokemon.byName[title].sprite + "Pokemon";
                const barWidth = 100;
                const health: number = this.game.equations.widthHealthBar(
                    barWidth,
                    listing.statistics.health
                );

                return {
                    text: listing.title,
                    callback: (): void =>
                        this.openPokemonMenuContext({
                            pokemon: listing,
                            onSwitch: (): void => settings.onSwitch(listing),
                        }),
                    things: [
                        {
                            thing: sprite,
                            position: {
                                offset: {
                                    left: 16,
                                    top: 8,
                                },
                            },
                        },
                        {
                            thing: "CharLevel",
                            position: {
                                offset: {
                                    left: 194,
                                    top: 6,
                                },
                            },
                        },
                        {
                            thing: "CharHP",
                            position: {
                                offset: {
                                    left: 66,
                                    top: 22,
                                },
                            },
                        },
                        {
                            thing: "HPBar",
                            args: {
                                width: barWidth,
                            },
                            position: {
                                offset: {
                                    left: 94,
                                    top: 22,
                                },
                            },
                        },
                        {
                            thing: "LightGraySquare",
                            args: {
                                width: Math.max(health, 1),
                                height: 4,
                                hidden: health === 0,
                            },
                            position: {
                                offset: {
                                    left: 96,
                                    top: 24,
                                },
                            },
                        },
                    ],
                    textsFloating: [
                        {
                            text: listing.level.toString(),
                            x: 160,
                            y: 0,
                        },
                        {
                            text:
                                listing.statistics.health.current +
                                "/ " +
                                listing.statistics.health.normal,
                            x: 160,
                            y: 16,
                        },
                    ],
                };
            }),
        });
        this.game.menuGrapher.setActiveMenu("Pokemon");
    }

    /**
     * Opens the context menu within the Pokedex menu for the selected Pokemon.
     *
     * @param settings   Settings for the selected Pokemon, including its HM moves.
     */
    public openPokemonMenuContext(settings: any): void {
        const badges = this.game.itemsHolder.getItem(this.game.storage.names.badges);
        const moves: IMove[] = settings.pokemon.moves;
        const options: any[] = [];

        for (const action of moves) {
            const move: IHMMoveSchema = this.game.constants.moves.byName[action.title];
            if (move.partyActivate && move.requiredBadge && badges[move.requiredBadge]) {
                options.push({
                    text: action.title.toUpperCase(),
                    callback: (): void => {
                        this.game.actions.partyActivateCheckThing(
                            this.game.players[0],
                            settings.pokemon,
                            move
                        );
                    },
                });
            }
        }

        options.push(
            {
                text: "STATS",
                callback: (): void => this.openPokemonMenuStats(settings.pokemon),
            },
            {
                text: "SWITCH",
                callback: settings.onSwitch,
            },
            {
                text: "CANCEL",
                callback: this.game.menuGrapher.registerB,
            }
        );

        this.game.menuGrapher.createMenu("PokemonMenuContext", {
            backMenu: "Pokemon",
        });
        this.game.menuGrapher.addMenuList("PokemonMenuContext", {
            options,
        });
        this.game.menuGrapher.setActiveMenu("PokemonMenuContext");
    }

    /**
     * Returns the in-game version of the Pokemon's status (e.g. "frozen" = "FRZ")
     *
     * @param pokemon   A Pokemon to show statistics of.
     */
    private getStatus(pokemon: IPokemon): string {
        const status = pokemon.status;
        return status === undefined ? "OK" : Pokemon.statusTranslate[status];
    }

    /**
     * Opens a statistics menu for a Pokemon.
     *
     * @param pokemon   A Pokemon to show statistics of.
     */
    public openPokemonMenuStats(pokemon: IPokemon): void {
        const schema: IPokemonListing = this.game.constants.pokemon.byName[
            pokemon.title.join("")
        ];
        const barWidth = 100;
        const health: number = this.game.equations.widthHealthBar(
            barWidth,
            pokemon.statistics.health
        );

        this.game.menuGrapher.createMenu("PokemonMenuStats", {
            backMenu: "PokemonMenuContext",
            callback: (): void => this.addSecondaryStats(pokemon),
            container: "Pokemon",
        });

        this.addPrimaryStats({
            pokemon,
            container: "PokemonMenuStats",
            size: {
                width: 160,
                height: 168,
            },
            position: {
                vertical: "bottom",
                offset: {
                    left: 3,
                    top: -3,
                },
            },
            textXOffset: 16,
        });

        this.game.menuGrapher.addMenuDialog("PokemonMenuStatsTitle", [pokemon.nickname]);
        this.game.menuGrapher.addMenuDialog("PokemonMenuStatsLevel", pokemon.level.toString());
        this.game.menuGrapher.addMenuDialog(
            "PokemonMenuStatsHP",
            pokemon.statistics.health.current + "/ " + pokemon.statistics.health.normal
        );
        this.game.menuGrapher.addMenuDialog(
            "PokemonMenuStatsNumber",
            this.game.utilities.makeDigit(schema.number, 3, 0)
        );
        this.game.menuGrapher.addMenuDialog("PokemonMenuStatsStatus", this.getStatus(pokemon));
        this.game.menuGrapher.addMenuDialog("PokemonMenuStatsType1", pokemon.types[0]);
        if (pokemon.types.length >= 2) {
            this.game.menuGrapher.createMenu("PokemonMenuStatsType2");
            this.game.menuGrapher.addMenuDialog("PokemonMenuStatsType2", pokemon.types[1]);
        }
        this.game.menuGrapher.addMenuDialog("PokemonMenuStatsID", "31425");
        this.game.menuGrapher.addMenuDialog("PokemonMenuStatsOT", ["%%%%%%%PLAYER%%%%%%%"]);

        this.game.menuGrapher.createMenuThing("PokemonMenuStatsHPBar", {
            type: "thing",
            thing: "LightGraySquare",
            position: {
                offset: {
                    top: 2,
                    left: 34,
                },
            },
            args: {
                width: Math.max(health, 1),
                height: 4,
                hidden: health === 0,
            },
        });

        this.game.menuGrapher.createMenuThing("PokemonMenuStats", {
            type: "thing",
            thing: pokemon.title.join("") + "Front",
            args: {
                flipHoriz: true,
            },
            position: {
                vertical: "bottom",
                offset: {
                    left: 36,
                    top: -192,
                },
            },
        });

        this.game.menuGrapher.setActiveMenu("PokemonMenuStats");
    }

    /**
     * Adds the LevelUpStats menu for a Pokemon to view its statistics.
     *
     * @param settings   Settings to open the menu.
     */
    private addPrimaryStats(settings: ILevelUpStatsMenuSettings): void {
        const { pokemon } = settings;
        const statistics = this.game.constants.pokemon.statisticNamesDisplayed.slice();
        const numStatistics = statistics.length;
        const textXOffset = settings.textXOffset || 32;
        const menuSchema: IMenuSchema = {
            callback: (): void => this.game.menuGrapher.deleteMenu("LevelUpStats"),
            onMenuDelete: settings.onMenuDelete,
            position: settings.position || {
                horizontal: "center",
                vertical: "center",
            },
        };
        let top: number;
        let left: number;

        for (let i = 0; i < numStatistics; i += 1) {
            statistics.push(
                this.game.utilities.makeDigit(pokemon.statistics[statistics[i]].normal, 7, "\t")
            );
            statistics[i] = statistics[i].toUpperCase();
        }

        menuSchema.childrenSchemas = statistics.map(
            (text: string, i: number): IMenuWordSchema => {
                if (i < numStatistics) {
                    top = i * 32 + 16;
                    left = textXOffset;
                } else {
                    top = (i - numStatistics + 1) * 32;
                    left = textXOffset + 20;
                }

                return {
                    type: "text",
                    words: [text],
                    position: {
                        offset: {
                            top: top - 2,
                            left,
                        },
                    },
                };
            }
        );

        if (settings.container) {
            menuSchema.container = settings.container;
        }

        if (settings.size) {
            menuSchema.size = settings.size;
        }

        this.game.menuGrapher.createMenu("LevelUpStats", menuSchema);
    }

    /**
     * Open the secondary statistics menu from the LevelUpStats menu.
     *
     * @param pokemon   The Pokemon to open the menu for.
     */
    private addSecondaryStats(pokemon: IPokemon): void {
        const experienceRemaining: number = this.game.equations.experienceStarting(
            pokemon.title,
            pokemon.level + 1
        );
        const options: any[] = pokemon.moves.map((move: IMove): any => {
            const text: any[] = [" "];
            const output: any = { text };

            text.push({
                command: true,
                x: 160,
                y: 16,
            });

            text.push({
                command: true,
                y: 2,
            });
            text.push("PP", " ");
            text.push({
                command: true,
                y: -2,
            });
            text.push(...this.game.utilities.makeDigit(move.remaining, 2, " ").split(""));
            text.push("/");
            text.push(
                ...this.game.utilities
                    .makeDigit(this.game.constants.moves.byName[move.title].PP, 2, " ")
                    .split("")
            );

            text.push({
                command: true,
                x: -300,
                y: -16,
            });

            // TODO: Moves should always be uppercase...
            text.push(...move.title.toUpperCase().split(""));

            return output;
        });

        // Fill any remaining options with "-" and "--" for move and PP, respectively
        for (let i: number = options.length; i < 4; i += 1) {
            options.push({
                text: [
                    "-",
                    {
                        command: true,
                        x: 160,
                        y: 16,
                    },
                    "-",
                    "-",
                ],
            });
        }

        this.game.menuGrapher.createMenu("PokemonMenuStatsExperience");

        this.game.menuGrapher.addMenuDialog(
            "PokemonMenuStatsExperience",
            this.game.utilities.makeDigit(pokemon.experience, 10, "\t")
        );

        this.game.menuGrapher.addMenuDialog(
            "PokemonMenuStatsExperienceFrom",
            this.game.utilities.makeDigit(experienceRemaining - pokemon.experience, 3, "\t")
        );

        this.game.menuGrapher.addMenuDialog(
            "PokemonMenuStatsExperienceNext",
            pokemon.level === 99 ? "" : (pokemon.level + 1).toString()
        );

        this.game.menuGrapher.createMenu("PokemonMenuStatsMoves");
        this.game.menuGrapher.addMenuList("PokemonMenuStatsMoves", { options });

        this.game.menuGrapher.getMenu("PokemonMenuStats").callback = (): void => {
            this.game.menuGrapher.deleteMenu("PokemonMenuStats");
        };
    }
}
