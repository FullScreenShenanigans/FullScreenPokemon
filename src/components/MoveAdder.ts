import { IMove } from "battlemovr";
import { GeneralComponent } from "gamestartr";
import { IMenuSchemaPosition, IMenuSchemaPositionOffset } from "menugraphr";
import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";

export class MoveAdder<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Adds a new move to a Pokemon's set of moves.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param move   The move that's going to be added into the moveset.
     * @param index   The position the move is going into in the Pokemon's moves.
     */
    public addMove(pokemon: IPokemon, move: IMove, index: number) {
        pokemon.moves[index] = move;
    }

    /**
     * Brings up the dialog for teaching a Pokemon a new move.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param move   The move that's going to be added into the moveset.
     */
    public startDialog(pokemon: IPokemon, move: IMove): void {
        this.gameStarter.menuGrapher.deleteMenu("Yes/No");
        this.gameStarter.menuGrapher.deleteMenu("GeneralText");

        let counter = false;
        for (const element of pokemon.moves) {
            if (element.title.toUpperCase() === move.title.toUpperCase()) {
                counter = true;
            }
        }
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        if (counter) { //dialog for when a pokemon already knows the move
            this.alreadyKnowsMove(pokemon, move);
        } else if (pokemon.moves.length < 4) { //dialog for when pokemon has no move conflicts
            this.learnsNewMove(pokemon, move);
        } else { //dialog for when a pokemon has more than 4 moves and needs to delete one
            this.resolveMoveConflict(pokemon, move);
        }
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Provides the dialog in the case that a Pokemon is trying to learn a move it already knows.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param move   The move that's going to be added into the moveset.
     */
    private alreadyKnowsMove(pokemon: IPokemon, move: IMove) {
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    pokemon.title.join("") + " knows " + move.title.toUpperCase() + "!",
                ],
            ],
            (): void => {
                this.gameStarter.menuGrapher.deleteActiveMenu();
            },
        );
    }

    /**
     * Provides the dialog for when a Pokemon has an open move slot and doesn't need to swap out an old move to learn a new one.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param move   The move that's going to be added into the moveset.
     */
    private learnsNewMove(pokemon: IPokemon, move: IMove) {
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    pokemon.title.join("") + " learned " + move.title.toUpperCase() + "!",
                ],
            ],
            (): void => {
                this.addMove(pokemon, move, pokemon.moves.length);
                this.gameStarter.menuGrapher.deleteActiveMenu();
            },
        );
    }

    /**
     * Provides the dialog in the case that a Pokemon must swap out an old move for a new one.
     * This assumes that the Pokemon already has 4 moves.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param move   The move that's going to be added into the moveset.
     */
    private resolveMoveConflict(pokemon: IPokemon, move: IMove) {
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    pokemon.title.join("") + " is trying to learn " + move.title.toUpperCase() + "!",
                ],
                "But, " + pokemon.title.join("") + " can't learn more than 4 moves!",
                [
                    "Delete an older move to make room for " + move.title.toUpperCase() + "?",
                ],
            ],
            (): void => {
                this.gameStarter.menuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"],
                });
                this.gameStarter.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: () => this.acceptLearnMove(pokemon, move),
                        },
                        {
                            text: "NO",
                            callback: () => this.refuseLearnMove(pokemon, move),
                        }],
                });
                this.gameStarter.menuGrapher.setActiveMenu("Yes/No");
        });
    }

    /**
     * Brings up the dialog for selecting a move to replace with a new move.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param move   The move that's going to be added into the moveset.
     */
    private acceptLearnMove(pokemon: IPokemon, move: IMove) {
        this.gameStarter.menuGrapher.deleteMenu("Yes/No");
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "Which move should be forgotten?",
                ],
            ],
            (): void => {
                const moves: IMove[] = pokemon.moves;

                const newPos: IMenuSchemaPosition = {
                    offset: {
                        top: -80,
                        bottom: 80,
                    },
                };
                this.gameStarter.menuGrapher.createMenu("BattleFightList", {
                    position: newPos,
                    killOnB: ["GeneralText"],
                });
                this.gameStarter.menuGrapher.addMenuList("BattleFightList", {
                    options: [
                        {
                            text: moves[0].title.toUpperCase(),
                            callback: () => this.teachMove(pokemon, move, 0),
                        },
                        {
                            text: moves[1].title.toUpperCase(),
                            callback: () => this.teachMove(pokemon, move, 1),
                        },
                        {
                            text: moves[2].title.toUpperCase(),
                            callback: () => this.teachMove(pokemon, move, 2),
                        },
                        {
                            text: moves[3].title.toUpperCase(),
                            callback: () => this.teachMove(pokemon, move, 3),
                        }],
                });
                this.gameStarter.menuGrapher.setActiveMenu("BattleFightList");
            },
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * A function that gives the final dialog lines for resolving a move conflict as well as actually teaches
     * a Pokemon a new move.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param move   The move that's going to be added into the moveset.
     */
    private teachMove(pokemon: IPokemon, move: IMove, index: number) {
        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            deleteOnFinish: true,
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "1, 2 and... Poof!",
                ],
                pokemon.title.join("") + " forgot " + pokemon.moves[index].title.toUpperCase() + "!",
                [
                    "And...",
                ],
                pokemon.title.join("") + " learned " + move.title.toUpperCase() + "!",
            ],
            (): void => {
                this.addMove(pokemon, move, index);
        });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Brings up the dialog for when a move conflict exists and the player doesn't want to continue.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param move   The move that's going to be added into the moveset.
     */
    private refuseLearnMove(pokemon: IPokemon, move: IMove) {
        this.gameStarter.menuGrapher.deleteMenu("Yes/No");
        this.gameStarter.menuGrapher.deleteMenu("GeneralText");
        this.gameStarter.menuGrapher.createMenu("GeneralText");

        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "Abandon learning " + move.title.toUpperCase() + "?",
                ],
            ],
            (): void => {
                this.gameStarter.menuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"],
                });
                this.gameStarter.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: () => {
                                this.gameStarter.menuGrapher.deleteMenu("Yes/No");
                                this.gameStarter.menuGrapher.deleteMenu("GeneralText");
                                this.gameStarter.menuGrapher.createMenu("GeneralText", {
                                    deleteOnFinish: true,
                                });

                                this.gameStarter.menuGrapher.addMenuDialog(
                                    "GeneralText",
                                    [
                                        [
                                            pokemon.title.join("") + " did not learn " + move.title.toUpperCase() + "!",
                                        ],
                                    ],
                                );
                                this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
                            },
                        },
                        {
                            text: "NO",
                            callback: () => this.startDialog(pokemon, move),
                        }],
                });
                this.gameStarter.menuGrapher.setActiveMenu("Yes/No");
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
