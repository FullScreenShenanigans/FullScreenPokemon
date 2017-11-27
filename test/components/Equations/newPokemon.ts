import { expect } from "chai";

import { IPokemon } from "./../../../src/components/Battles";
import { FullScreenPokemon } from "./../../../src/FullScreenPokemon";
import { it } from "./../../main";
import { stubBlankGame } from "./../../utils/fakes";

const pokemonTitle: string[] = "CHARMANDER".split("");

it("gives a new Pokemon a provided item", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const chosenItem = "Potion".split("");

    // Act
    const pokemon: IPokemon = fsp.equations.newPokemon({
        level: 1,
        title: pokemonTitle,
        item: chosenItem
    });

    // Assert
    expect(pokemon.item).to.deep.equal(chosenItem);
});
