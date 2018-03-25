import { IMove } from "battlemovr";
import { expect } from "chai";
import { stubBlankGame } from "../fakes.test";
import { IPokemon } from "./Battles";
import { MoveAdder } from "./MoveAdder";

describe("MoveAdder", () => {
    it("adds a new move to a Pokemon's moveset", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        //Act
        fsp.moveadder.addMove(pokemon, peck, 1);

        //Assert
        expect(pokemon.moves[1].title === peck.title);
    });

    it("attempts adding a move at a negative index to a Pokemon", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        //Act
        fsp.moveadder.addMove(pokemon, peck, -1);

        //Assert
        expect(pokemon.moves[-1].title !== peck.title);
    });

    it("attempts adding more than 4 moves to a Pokemon", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        //Act
        fsp.moveadder.addMove(pokemon, peck, 4);

        //Assert
        expect(pokemon.moves[4].title !== peck.title);
    });

    it("attempts to add a move a Pokemon already knows", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };
        const bite: IMove = {
            title: "Bite",
            remaining: 10,
            uses: 10,
        };

        //Act
        fsp.moveadder.addMove(pokemon, peck, 1);
        fsp.moveadder.addMove(pokemon, bite, 2);
        fsp.moveadder.addMove(pokemon, peck, 2);

        //Assert
        expect(pokemon.moves[2].title === bite.title);
    });
});
