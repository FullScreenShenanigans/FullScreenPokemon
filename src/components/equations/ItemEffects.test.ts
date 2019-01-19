import { expect } from "chai";
import { stubBlankGame } from "../../fakes.test";
import { IPokemon } from "../Battles";
import { ItemEffects } from "./ItemEffects";

describe("ItemEffects", () => {
    describe("capturePokemon", () => {
        it("adds a first Pokemon to your party when your party has no Pokemon", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const pokemon: IPokemon = fsp.equations.newPokemon({
                level: 5,
                title: "SQUIRTLE".split(""),
            });
            const itemEffects = new ItemEffects(fsp);

            // Act
            itemEffects.capturePokemon(pokemon);

            // Assert
            expect(fsp.itemsHolder.getItem(fsp.storage.names.pokemonInParty)[0].title).to.be.equal(pokemon.title);
        });

        it("adds a second Pokemon to your party when your party has one Pokemon", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const pokemon: IPokemon = fsp.equations.newPokemon({
                level: 5,
                title: "SQUIRTLE".split(""),
            });
            const itemEffects = new ItemEffects(fsp);

            // Act
            itemEffects.capturePokemon(pokemon);
            itemEffects.capturePokemon(pokemon);

            // Assert
            expect(fsp.itemsHolder.getItem(fsp.storage.names.pokemonInParty)[1].title).to.be.equal(pokemon.title);
        });

        it("adds a third Pokemon to your party when your party has two Pokemon", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const pokemon: IPokemon = fsp.equations.newPokemon({
                level: 5,
                title: "SQUIRTLE".split(""),
            });
            const itemEffects = new ItemEffects(fsp);

            // Act
            itemEffects.capturePokemon(pokemon);
            itemEffects.capturePokemon(pokemon);

            // Assert
            expect(fsp.itemsHolder.getItem(fsp.storage.names.pokemonInParty)[1].title).to.be.equal(pokemon.title);
        });

        it("does not add a new Pokemon to your party when your party has six Pokemon", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const squirtle: IPokemon = fsp.equations.newPokemon({
                level: 5,
                title: "SQUIRTLE".split(""),
            });
            const charmander: IPokemon = fsp.equations.newPokemon({
                level: 5,
                title: "CHARMANDER".split(""),
            });
            const itemEffects = new ItemEffects(fsp);
            for (let i = 0; i < 6; i += 1) {
                fsp.itemsHolder.getItem(fsp.storage.names.pokemonInParty)[i] = squirtle;
            }

            // Act
            itemEffects.capturePokemon(charmander);

            // Assert
            for (let i = 0; i < 6; i += 1) {
                expect(fsp.itemsHolder.getItem(fsp.storage.names.pokemonInParty)[i].title).to.be.equal(squirtle.title);
            }
        });

        it("returns true when it successfully adds a Pokemon", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const pokemon: IPokemon = fsp.equations.newPokemon({
                level: 5,
                title: "SQUIRTLE".split(""),
            });
            const itemEffects = new ItemEffects(fsp);

            // Act
            const result = itemEffects.capturePokemon(pokemon);

            // Assert
            expect(result).to.be.equal(true);
        });

        it("returns false when it doesn't successfully add a Pokemon", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const squirtle: IPokemon = fsp.equations.newPokemon({
                level: 5,
                title: "SQUIRTLE".split(""),
            });
            const charmander: IPokemon = fsp.equations.newPokemon({
                level: 5,
                title: "CHARMANDER".split(""),
            });
            const itemEffects = new ItemEffects(fsp);
            for (let i = 0; i < 6; i += 1) {
                fsp.itemsHolder.getItem(fsp.storage.names.pokemonInParty)[i] = squirtle;
            }

            // Act
            const result = itemEffects.capturePokemon(charmander);

            // Assert
            expect(result).to.be.equal(false);
        });
     });
});
