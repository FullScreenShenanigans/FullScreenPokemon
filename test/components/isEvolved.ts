import { FullScreenPokemon } from "../../src/FullScreenPokemon";
import { it } from "../main";
import { stubBlankGame } from "../utils/fakes";

it("properly evolves a Pokemon at exactly its level requirement", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = "CHARMANDER".split("");

    // Act
    fsp.itemsHolder.setItem("PokemonInParty", [
        fsp.equations.newPokemon(pokemonTitle, 15)
    ]);
    fsp.experience.levelup(fsp.itemsHolder.getItem("PokemonInParty")[0]);

    // Assert
    chai.expect(fsp.itemsHolder.getItem("PokemonInParty")[0].title.toString()).to.be.equal(
        "CHARMELEON".split("").toString()
    );
});

it("properly evolves a Pokemon that exceeds its level requirement", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = "CHARMANDER".split("");

    // Act
    fsp.itemsHolder.setItem("PokemonInParty", [
        fsp.equations.newPokemon(pokemonTitle, 99)
    ]);
    fsp.experience.levelup(fsp.itemsHolder.getItem("PokemonInParty")[0]);

    // Assert
    chai.expect(fsp.itemsHolder.getItem("PokemonInParty")[0].title.toString()).to.be.equal(
        "CHARMELEON".split("").toString()
    );
});

it("does not evolve a Pokemon that has not yet reached its level requirement", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = "CHARMANDER".split("");

    // Act
    fsp.itemsHolder.setItem("PokemonInParty", [
        fsp.equations.newPokemon(pokemonTitle, 14)
    ]);
    fsp.experience.levelup(fsp.itemsHolder.getItem("PokemonInParty")[0]);

    // Assert
    chai.expect(fsp.itemsHolder.getItem("PokemonInParty")[0].title.toString()).to.be.equal(
        "CHARMANDER".split("").toString()
    );
});
