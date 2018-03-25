import { IMove } from "battlemovr";
import { expect } from "chai";
import { stubBlankGame } from "../fakes.test";
import { IPokemon } from "./Battles";
import { MoveAdder } from "./MoveAdder";

describe("MoveAdder", () => {
    it("test Move Adder API", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const adder = new MoveAdder(fsp);
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        //Act
        adder.addMove(pokemon, peck, 1);

        //Assert
        expect(pokemon.moves[1].title === peck.title);
    });

    it("test Move Adder API - edge cases", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const adder = new MoveAdder(fsp);
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
        adder.addMove(pokemon, peck, -1);
        adder.addMove(pokemon, bite, 4);

        //Assert
        expect(pokemon.moves[-1].title !== peck.title);
        expect(pokemon.moves[4].title !== bite.title);
    });

    it("test Move Adder API - duplicate move", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const adder = new MoveAdder(fsp);
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
        adder.addMove(pokemon, peck, 1);
        adder.addMove(pokemon, bite, 2);
        adder.addMove(pokemon, peck, 2);

        //Assert
        expect(pokemon.moves[2].title === bite.title);
    });
});
