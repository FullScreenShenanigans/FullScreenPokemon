import { IMove } from "battlemovr";
import { Section } from "eightbittr";
import { IMenuSchemaPosition } from "menugraphr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { IPokemon } from "./Battles";

export class MoveAdder extends Section<FullScreenPokemon> {
    /**
     * Adds a new move to a Pokemon's set of moves.
     *
     * @param pokemon   Pokemon whose moveset is being modified.
     * @param move   Move that's going to be added into the moveset.
     * @param index   Position the move is going into in the Pokemon's moves.
     */
    public addMove(pokemon: IPokemon, move: IMove, index: number) {
        if (index < 0 || index > 3) {
            throw new Error("Invalid move parameters.");
        }
        for (const element of pokemon.moves) {
            if (element.title === move.title) {
                throw new Error("This Pokemon already knows this move.");
            }
        }
        pokemon.moves[index] = move;
    }

    /**
     * Brings up the dialog for teaching a Pokemon a new move.
     *
     * @param pokemon   Pokemon whose moveset is being modified.
     * @param move   Move that's going to be added into the moveset.
     */
    public startDialog(pokemon: IPokemon, move: IMove): void {
        this.game.menuGrapher.deleteMenu("Yes/No");
        this.game.menuGrapher.deleteMenu("GeneralText");

        this.game.menuGrapher.createMenu("GeneralText");
        if (this.alreadyKnowsMove(pokemon, move)) {
            return;
        }

        if (pokemon.moves.length < 4) {
            this.learnsNewMove(pokemon, move);
        } else {
            this.resolveMoveConflict(pokemon, move);
        }
    }

    /**
     * Checks if a Pokemon is trying to learn a move it already knows.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param move   The move that's going to be added into the moveset.
     */
    private alreadyKnowsMove(pokemon: IPokemon, move: IMove): boolean {
        for (const element of pokemon.moves) {
            if (element.title === move.title) {
                this.game.menuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        [
                            pokemon.title.join("") + " knows " + move.title.toUpperCase() + "!",
                        ],
                    ],
                    (): void => {
                        this.game.menuGrapher.deleteActiveMenu();
                    },
                );
                this.game.menuGrapher.setActiveMenu("GeneralText");
                return true;
            }
        }

        return false;
    }

    /**
     * Provides dialog for when a Pokemon has an open move slot.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param move   The move that's going to be added into the moveset.
     */
    private learnsNewMove(pokemon: IPokemon, move: IMove) {
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    pokemon.title.join("") + " learned " + move.title.toUpperCase() + "!",
                ],
            ],
            (): void => {
                this.addMove(pokemon, move, pokemon.moves.length);
                this.game.menuGrapher.deleteActiveMenu();
            },
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Provides dialog in the case that a Pokemon must swap out an old move for a new one.
     * This assumes that the Pokemon already has 4 moves.
     *
     * @param pokemon   The pokemon whose moveset is being modified.
     * @param move   The move that's going to be added into the moveset.
     */
    private resolveMoveConflict(pokemon: IPokemon, move: IMove) {
        this.game.menuGrapher.addMenuDialog(
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
                this.game.menuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"],
                });
                this.game.menuGrapher.addMenuList("Yes/No", {
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
                this.game.menuGrapher.setActiveMenu("Yes/No");
            });
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Provides dialog for selecting an old move to be replaced.
     *
     * @param pokemon   Pokemon whose moveset is being modified.
     * @param move   Move that's going to be added into the moveset.
     */
    private acceptLearnMove(pokemon: IPokemon, move: IMove) {
        this.game.menuGrapher.deleteMenu("Yes/No");
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "Which move should be forgotten?",
                ],
            ],
            (): void => {
                const moves: IMove[] = pokemon.moves;

                const options: any[] = moves.map((temp: IMove): any =>
                    ({
                        text: temp.title.toUpperCase(),
                        callback: () => this.teachMove(pokemon, move, pokemon.moves.indexOf(temp)),
                    }));

                const newPos: IMenuSchemaPosition = {
                    offset: {
                        top: -80,
                        bottom: 80,
                    },
                };
                this.game.menuGrapher.createMenu("BattleFightList", {
                    position: newPos,
                    killOnB: ["GeneralText"],
                });
                this.game.menuGrapher.addMenuList("BattleFightList", { options });
                this.game.menuGrapher.setActiveMenu("BattleFightList");
            },
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Provides dialog for resolving a move conflict and teaching a Pokemon a new move.
     *
     * @param pokemon   Pokemon whose moveset is being modified.
     * @param move   Move that's going to be added into the moveset.
     */
    private teachMove(pokemon: IPokemon, move: IMove, index: number) {
        this.game.menuGrapher.createMenu("GeneralText", {
            deleteOnFinish: true,
        });
        this.game.menuGrapher.addMenuDialog(
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
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Provides dialog for when a move conflict exists and the player doesn't want to continue.
     *
     * @param pokemon   Pokemon whose moveset is being modified.
     * @param move   Move that's going to be added into the moveset.
     */
    private refuseLearnMove(pokemon: IPokemon, move: IMove) {
        this.game.menuGrapher.deleteMenu("Yes/No");
        this.game.menuGrapher.deleteMenu("GeneralText");
        this.game.menuGrapher.createMenu("GeneralText");

        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "Abandon learning " + move.title.toUpperCase() + "?",
                ],
            ],
            (): void => {
                this.game.menuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"],
                });
                this.game.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: () => {
                                this.game.menuGrapher.deleteMenu("Yes/No");
                                this.game.menuGrapher.deleteMenu("GeneralText");
                                this.game.menuGrapher.createMenu("GeneralText", {
                                    deleteOnFinish: true,
                                });

                                this.game.menuGrapher.addMenuDialog(
                                    "GeneralText",
                                    [
                                        [
                                            pokemon.title.join("") + " did not learn " + move.title.toUpperCase() + "!",
                                        ],
                                    ],
                                );
                                this.game.menuGrapher.setActiveMenu("GeneralText");
                            },
                        },
                        {
                            text: "NO",
                            callback: () => this.startDialog(pokemon, move),
                        }],
                });
                this.game.menuGrapher.setActiveMenu("Yes/No");
            });
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }
}
