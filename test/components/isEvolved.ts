import { FullScreenPokemon } from "../../src/FullScreenPokemon";
import { it } from "../main";
import { stubBlankGame } from "../utils/fakes";

it("Properly evolves a Pokemon at exactly its level requirement", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = ["C", "H", "A", "R", "M", "A", "N", "D", "E", "R"];

    // Act
    fsp.itemsHolder.setItem("PokemonInParty", [
        fsp.equations.newPokemon(pokemonTitle, 15)
    ]);
    fsp.experience.levelup(fsp.itemsHolder.getItem("PokemonInParty")[0]);

    // Assert
    chai.expect(fsp.itemsHolder.getItem("PokemonInParty")[0].title.toString()).to.be.equal(
        ["C", "H", "A", "R", "M", "E", "L", "E", "O", "N"].toString()
    );
});

it("Properly evolves a Pokemon that exceeds its level requirement", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = ["C", "H", "A", "R", "M", "A", "N", "D", "E", "R"];

    // Act
    fsp.itemsHolder.setItem("PokemonInParty", [
        fsp.equations.newPokemon(pokemonTitle, 99)
    ]);
    fsp.experience.levelup(fsp.itemsHolder.getItem("PokemonInParty")[0]);

    // Assert
    chai.expect(fsp.itemsHolder.getItem("PokemonInParty")[0].title.toString()).to.be.equal(
        ["C", "H", "A", "R", "M", "E", "L", "E", "O", "N"].toString()
    );
});

it("Does not evolve a Pokemon that has not yet reached its level requirement", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = ["C", "H", "A", "R", "M", "A", "N", "D", "E", "R"];

    // Act
    fsp.itemsHolder.setItem("PokemonInParty", [
        fsp.equations.newPokemon(pokemonTitle, 14)
    ]);
    fsp.experience.levelup(fsp.itemsHolder.getItem("PokemonInParty")[0]);

    // Assert
    chai.expect(fsp.itemsHolder.getItem("PokemonInParty")[0].title.toString()).to.be.equal(
        ["C", "H", "A", "R", "M", "A", "N", "D", "E", "R"].toString()
    );
});
