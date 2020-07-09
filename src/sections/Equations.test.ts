import { expect } from "chai";

import { stubBlankGame } from "../fakes.test";

import { IPokemon } from "./Battles";
import { IPokemonEvolution, IPokemonEvolutionByLevel } from "./constants/Pokemon";

describe("Equations", () => {
    describe("levelup", () => {
        it("evolves a Pokemon at exactly its level requirement", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const pokemonTitle: string[] = "CHARMANDER".split("");
            const evolutions: IPokemonEvolution[] = fsp.constants.pokemon.byName[pokemonTitle.join("")].evolutions!;
            const pokemonLevel: number = (evolutions[0].requirements[0] as IPokemonEvolutionByLevel).level - 1;

            // Act
            const pokemon: IPokemon = fsp.equations.newPokemon({
                level: pokemonLevel,
                title: pokemonTitle,
            });
            fsp.experience.levelup(pokemon);

            // Assert
            expect(pokemon.title.toString()).to.be.equal("CHARMELEON".split("").toString());
        });

        it("evolves a Pokemon that exceeds its level requirement", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const pokemonTitle: string[] = "CHARMANDER".split("");
            const evolutions: IPokemonEvolution[] = fsp.constants.pokemon.byName[pokemonTitle.join("")].evolutions!;
            const pokemonLevel: number = (evolutions[0].requirements[0] as IPokemonEvolutionByLevel).level + 1;

            // Act
            const pokemon: IPokemon = fsp.equations.newPokemon({
                level: pokemonLevel,
                title: pokemonTitle,
            });
            fsp.experience.levelup(pokemon);

            // Assert
            expect(pokemon.title.toString()).to.be.equal("CHARMELEON".split("").toString());
        });

        it("does not evolve a Pokemon that has not yet reached its level requirement", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const pokemonTitle: string[] = "CHARMANDER".split("");
            const evolutions: IPokemonEvolution[] = fsp.constants.pokemon.byName[pokemonTitle.join("")].evolutions!;
            const pokemonLevel: number = (evolutions[0].requirements[0] as IPokemonEvolutionByLevel).level - 2;

            // Act
            const pokemon: IPokemon = fsp.equations.newPokemon({
                level: pokemonLevel,
                title: pokemonTitle,
            });
            fsp.experience.levelup(pokemon);

            // Assert
            expect(pokemon.title.toString()).to.be.equal("CHARMANDER".split("").toString());
        });
    });

    describe("newPokemon", () => {
        const pokemonTitle: string[] = "CHARMANDER".split("");

        it("gives a new Pokemon a provided item", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const chosenItem = "Potion".split("");

            // Act
            const pokemon = fsp.equations.newPokemon({
                level: 1,
                title: pokemonTitle,
                item: chosenItem,
            });

            // Assert
            expect(pokemon.item).to.deep.equal(chosenItem);
        });
    });
});
