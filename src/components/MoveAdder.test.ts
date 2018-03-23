import { IMove } from "battlemovr";
import { expect } from "chai";
import { stubBlankGame } from "../fakes.test";
import { IPokemon } from "./Battles";
import { MoveAdder } from "./MoveAdder";

describe("MoveAdder", () => {
    it("test Move Adder API or addMove() function", (): void => {
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
        expect(pokemon.moves[1].title === "Peck");
    });
});
