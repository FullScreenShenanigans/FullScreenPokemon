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

        this.gameStarter.menuGrapher.createMenu("GeneralText");
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
        let counter = false;
        for (const element of pokemon.moves) {
            if (element.title === move.title) {
                counter = true;
            }
        }

        if (counter) {
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
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
        return counter;
    }

    /**
     * Provides dialog for when a Pokemon has an open move slot.
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
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Provides dialog in the case that a Pokemon must swap out an old move for a new one.
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
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Provides dialog for selecting an old move to be replaced.
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
                this.gameStarter.menuGrapher.createMenu("BattleFightList", {
                    position: newPos,
                    killOnB: ["GeneralText"],
                });
                this.gameStarter.menuGrapher.addMenuList("BattleFightList", { options });
                this.gameStarter.menuGrapher.setActiveMenu("BattleFightList");
            },
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Provides dialog for resolving a move conflict and teaching a Pokemon a new move.
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
     * Provides dialog for when a move conflict exists and the player doesn't want to continue.
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
