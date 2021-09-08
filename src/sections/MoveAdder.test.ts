import { Move } from "battlemovr";
import { expect } from "chai";

import { stubBlankGame } from "../fakes.test";

import { Pokemon } from "./Battles";

describe("moveAdder", () => {
    it("adds a new move to a Pokemon's moveset when the move index is valid", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const pokemon: Pokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
            moves: [
                {
                    remaining: 10,
                    title: "Bide",
                    uses: 10,
                },
            ],
        });
        const peck: Move = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        // Act
        fsp.moveAdder.addMove(pokemon, peck, 1);

        // Assert
        expect(pokemon.moves[1].title).to.be.equal(peck.title);
    });

    it("replaces an old move with a new one in a Pokemon's moveset when the move index is valid", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const pokemon: Pokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
            moves: [
                {
                    remaining: 10,
                    title: "Bide",
                    uses: 10,
                },
            ],
        });
        const peck: Move = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        // Act
        fsp.moveAdder.addMove(pokemon, peck, 0);

        // Assert
        expect(pokemon.moves[0].title).to.be.equal(peck.title);
    });

    it("does not add a move when a negative move index is given", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const pokemon: Pokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const peck: Move = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        // Act
        const action = () => fsp.moveAdder.addMove(pokemon, peck, -1);

        // Assert
        expect(action).to.throw("Invalid move parameters.");
    });

    it("does not add a move when given move index is larger than the 4 allotted moveslots per Pokemon", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const pokemon: Pokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const peck: Move = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        // Act
        const action = () => fsp.moveAdder.addMove(pokemon, peck, 4);

        // Assert
        expect(action).to.throw("Invalid move parameters.");
    });

    it("does not add a move when the Pokemon already knows the move in another moveslot", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const pokemon: Pokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const peck: Move = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };
        const bite: Move = {
            title: "Bite",
            remaining: 10,
            uses: 10,
        };
        fsp.moveAdder.addMove(pokemon, peck, 1);
        fsp.moveAdder.addMove(pokemon, bite, 2);

        // Act
        const action = () => fsp.moveAdder.addMove(pokemon, peck, 2);

        // Assert
        expect(action).to.throw("This Pokemon already knows this move.");
    });

    describe("Dialog Menu", () => {
        it("teaches you a move when you have less than four moves", (): void => {
            // Arrange
            const { fsp } = stubBlankGame({
                automaticallyAdvanceMenus: true,
            });

            const pokemon: Pokemon = fsp.equations.newPokemon({
                level: 5,
                title: "SQUIRTLE".split(""),
                moves: [
                    {
                        remaining: 10,
                        title: "Bide",
                        uses: 10,
                    },
                ],
            });
            const peck: Move = {
                title: "Peck",
                remaining: 10,
                uses: 10,
            };

            // Act
            fsp.moveAdder.startDialog(pokemon, peck);

            // Assert
            expect(pokemon.moves[1].title).to.be.equal("Peck");
        });

        it("does not teach you a move when you have four moves and refuse to learn more", (): void => {
            // Arrange
            const { fsp, player } = stubBlankGame({
                automaticallyAdvanceMenus: true,
            });
            const pokemon: Pokemon = fsp.equations.newPokemon({
                level: 5,
                title: "SQUIRTLE".split(""),
                moves: [
                    { title: "Bide", remaining: 10, uses: 10 },
                    { title: "Bite", remaining: 10, uses: 10 },
                    { title: "Bubble", remaining: 10, uses: 10 },
                    { title: "Roar", remaining: 10, uses: 10 },
                ],
            });
            const peck: Move = {
                title: "Peck",
                remaining: 10,
                uses: 10,
            };

            // Act
            fsp.moveAdder.startDialog(pokemon, peck);
            fsp.inputs.keyDownA(player);
            fsp.menuGrapher.registerDirection(2);
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyDownA(player);

            // Assert
            expect(pokemon.moves[0].title).to.be.equal("Bide");
            expect(pokemon.moves[1].title).to.be.equal("Bite");
            expect(pokemon.moves[2].title).to.be.equal("Bubble");
            expect(pokemon.moves[3].title).to.be.equal("Roar");
        });

        it("teaches you a move in your second slot when you have four moves and select the second to replace", (): void => {
            // Arrange
            const { fsp, player } = stubBlankGame({
                automaticallyAdvanceMenus: true,
            });
            const pokemon: Pokemon = fsp.equations.newPokemon({
                level: 5,
                title: "SQUIRTLE".split(""),
                moves: [
                    { title: "Bide", remaining: 10, uses: 10 },
                    { title: "Bite", remaining: 10, uses: 10 },
                    { title: "Bubble", remaining: 10, uses: 10 },
                    { title: "Roar", remaining: 10, uses: 10 },
                ],
            });
            const peck: Move = {
                title: "Peck",
                remaining: 10,
                uses: 10,
            };

            // Act
            fsp.moveAdder.startDialog(pokemon, peck);
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyDownA(player);
            fsp.menuGrapher.registerDirection(2);
            fsp.inputs.keyDownA(player);

            // Assert
            expect(pokemon.moves[0].title).to.be.equal("Bide");
            expect(pokemon.moves[1].title).to.be.equal("Peck");
            expect(pokemon.moves[2].title).to.be.equal("Bubble");
            expect(pokemon.moves[3].title).to.be.equal("Roar");
        });

        it("teaches you a move in your fourth slot when you have four moves and select the fourth to replace", (): void => {
            // Arrange
            const { fsp, player } = stubBlankGame({
                automaticallyAdvanceMenus: true,
            });
            const pokemon: Pokemon = fsp.equations.newPokemon({
                level: 5,
                title: "SQUIRTLE".split(""),
                moves: [
                    { title: "Bide", remaining: 10, uses: 10 },
                    { title: "Bite", remaining: 10, uses: 10 },
                    { title: "Bubble", remaining: 10, uses: 10 },
                    { title: "Roar", remaining: 10, uses: 10 },
                ],
            });
            const peck: Move = {
                title: "Peck",
                remaining: 10,
                uses: 10,
            };

            // Act
            fsp.moveAdder.startDialog(pokemon, peck);
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyDownA(player);
            fsp.menuGrapher.registerDirection(2);
            fsp.menuGrapher.registerDirection(2);
            fsp.menuGrapher.registerDirection(2);
            fsp.inputs.keyDownA(player);

            // Assert
            expect(pokemon.moves[0].title).to.be.equal("Bide");
            expect(pokemon.moves[1].title).to.be.equal("Bite");
            expect(pokemon.moves[2].title).to.be.equal("Bubble");
            expect(pokemon.moves[3].title).to.be.equal("Peck");
        });

        it("teaches you a move when you respond no to abandoning learning a new move", (): void => {
            // Arrange
            const { fsp, player } = stubBlankGame({
                automaticallyAdvanceMenus: true,
            });
            const pokemon: Pokemon = fsp.equations.newPokemon({
                level: 5,
                title: "SQUIRTLE".split(""),
                moves: [
                    { title: "Bide", remaining: 10, uses: 10 },
                    { title: "Bite", remaining: 10, uses: 10 },
                    { title: "Bubble", remaining: 10, uses: 10 },
                    { title: "Roar", remaining: 10, uses: 10 },
                ],
            });
            const peck: Move = {
                title: "Peck",
                remaining: 10,
                uses: 10,
            };

            // Act
            fsp.moveAdder.startDialog(pokemon, peck);
            fsp.inputs.keyDownA(player);
            fsp.menuGrapher.registerDirection(2);
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyDownA(player);
            fsp.menuGrapher.registerDirection(2);
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyDownA(player);

            // Assert
            expect(pokemon.moves[0].title).to.be.equal("Peck");
            expect(pokemon.moves[1].title).to.be.equal("Bite");
            expect(pokemon.moves[2].title).to.be.equal("Bubble");
            expect(pokemon.moves[3].title).to.be.equal("Roar");
        });
    });
});
