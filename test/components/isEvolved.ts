import { IPokemon } from "../../src/components/Battles";
import { IPokemonEvolution, IPokemonEvolutionByLevel } from "../../src/components/constants/Pokemon";
import { FullScreenPokemon } from "../../src/FullScreenPokemon";
import { it } from "../main";
import { stubBlankGame } from "../utils/fakes";

it("evolves a Pokemon at exactly its level requirement", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = "CHARMANDER".split("");
    const evolutions: IPokemonEvolution[] = fsp.constants.pokemon.byName[pokemonTitle.join("")].evolutions!;
    const pokemonLevel: number = (evolutions[0].requirements[0] as IPokemonEvolutionByLevel).level - 1;

    // Act
    const pokemon: IPokemon = fsp.equations.newPokemon(pokemonTitle, pokemonLevel);
    fsp.experience.levelup(pokemon);

    // Assert
    chai.expect(pokemon.title.toString()).to.be.equal("CHARMELEON".split("").toString());
});

it("evolves a Pokemon that exceeds its level requirement", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = "CHARMANDER".split("");
    const evolutions: IPokemonEvolution[] = fsp.constants.pokemon.byName[pokemonTitle.join("")].evolutions!;
    const pokemonLevel: number = (evolutions[0].requirements[0] as IPokemonEvolutionByLevel).level + 1;

    // Act
    const pokemon: IPokemon = fsp.equations.newPokemon(pokemonTitle, pokemonLevel);
    fsp.experience.levelup(pokemon);

    // Assert
    chai.expect(pokemon.title.toString()).to.be.equal("CHARMELEON".split("").toString());
});

it("does not evolve a Pokemon that has not yet reached its level requirement", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = "CHARMANDER".split("");
    const evolutions: IPokemonEvolution[] = fsp.constants.pokemon.byName[pokemonTitle.join("")].evolutions!;
    const pokemonLevel: number = (evolutions[0].requirements[0] as IPokemonEvolutionByLevel).level - 2;

    // Act
    const pokemon: IPokemon = fsp.equations.newPokemon(pokemonTitle, pokemonLevel);
    fsp.experience.levelup(pokemon);

    // Assert
    chai.expect(pokemon.title.toString()).to.be.equal("CHARMANDER".split("").toString());
});
