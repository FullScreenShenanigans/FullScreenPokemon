import { IPokemon } from "../../src/components/Battles";
import { IPokemonEvolutionByLevel } from "../../src/components/constants/Pokemon";
import { FullScreenPokemon } from "../../src/FullScreenPokemon";
import { it } from "../main";
import { stubBlankGame } from "../utils/fakes";

it("evolves a Pokemon at exactly its level requirement", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = "CHARMANDER".split("");
    const pokemonEvolution: IPokemonEvolutionByLevel = {
        "method": "level",
        "level": 16
    };

    // Act
    const pokemon: IPokemon = fsp.equations.newPokemon(pokemonTitle, pokemonEvolution.level - 1);
    fsp.experience.levelup(pokemon);

    // Assert
    chai.expect(pokemon.title.toString()).to.be.equal("CHARMELEON".split("").toString());
});

it("evolves a Pokemon that exceeds its level requirement", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = "CHARMANDER".split("");
    const pokemonEvolution: IPokemonEvolutionByLevel = {
        "method": "level",
        "level": 16
    };

    // Act
    const pokemon: IPokemon = fsp.equations.newPokemon(pokemonTitle, pokemonEvolution.level + 1);
    fsp.experience.levelup(pokemon);

    // Assert
    chai.expect(pokemon.title.toString()).to.be.equal("CHARMELEON".split("").toString());
});

it("does not evolve a Pokemon that has not yet reached its level requirement", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = "CHARMANDER".split("");
    const pokemonEvolution: IPokemonEvolutionByLevel = {
        "method": "level",
        "level": 16
    };

    // Act
    const pokemon: IPokemon = fsp.equations.newPokemon(pokemonTitle, pokemonEvolution.level - 2);
    fsp.experience.levelup(pokemon);

    // Assert
    chai.expect(pokemon.title.toString()).to.be.equal("CHARMANDER".split("").toString());
});
