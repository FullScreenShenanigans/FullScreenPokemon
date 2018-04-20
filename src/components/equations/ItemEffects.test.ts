import { expect } from "chai";
import { stubBlankGame } from "../../fakes.test";
import { IPokemon } from "../Battles";
import { ItemEffects } from "./ItemEffects";

describe("ItemEffects", () => {
    describe("capturePokemon", () => {
        it("adds a new Pokemon to your party when your party has less than six Pokemon", (): void => {
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

        it("does not add a new Pokemon to your party when your party has more than six Pokemon", (): void => {
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
            for (let i = 0; i < 6; i++) {
                fsp.itemsHolder.getItem(fsp.storage.names.pokemonInParty)[i] = squirtle;
            }

            // Act
            itemEffects.capturePokemon(charmander);

            // Assert
            for (let i = 0; i < 6; i++) {
                expect(fsp.itemsHolder.getItem(fsp.storage.names.pokemonInParty)[i].title).to.be.equal(squirtle.title);
            }
        });
     });
});
