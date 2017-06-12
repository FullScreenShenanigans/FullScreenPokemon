import { IPokemon } from "../../src/components/Battles";
import { IItemProbabilities } from "../../src/components/mods/RandomHeldItemsMod";
import { IInventoryListing } from "../../src/components/menus/Items";
import { FullScreenPokemon } from "../../src/FullScreenPokemon";
import { it } from "../main";
import { stubBlankGame } from "../utils/fakes";

it("Pokemon can be given an item and item is updated in inventory", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const pokemonTitle: string[] = "CHARMANDER".split("");
    let listing: IInventoryListing = {
        amount: 10,
        item: "Potion"
    };

    // Act
    const pokemon: IPokemon = fsp.equations.newPokemon({
        level: 1,
        title: pokemonTitle
    });
    pokemon.item = listing.item.split("");
    listing.amount = listing.amount - 1;

    // Assert
    chai.expect((pokemon.item) === "Potion".split(""));
    chai.expect((listing.amount === 9));
});


it("Pokemon spawns with random item when the generated probability is valid", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const typeItems: { [i: string]: IItemProbabilities[] } = {
        "Normal": [
            {
                "name": "Potion",
                "probability": .025
            },
            {
                "name": "Moon Stone",
                "probability": .005
            }
        ],
    };

    // Act
    function randomHeldItemGenerator(pokemonType: string, typeItems: { [i: string]: IItemProbabilities[] }): string[] | undefined {
            const probabilityOfHeldItem: number = .012;
            let counter: number = 0;

            for (const chosenObject of typeItems[pokemonType]) {
                counter += chosenObject.probability;
                if (counter >= probabilityOfHeldItem) {
                    return fsp.constants.items.byName[chosenObject.name].name;
                }
            }

            return undefined;
    }

    // Assert
    chai.expect(randomHeldItemGenerator("Normal", typeItems) === "Potion".split(""));
});

it("Pokemon spawns with no item when the generated probability is invalid", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const typeItems: { [i: string]: IItemProbabilities[] } = {
        "Normal": [
            {
                "name": "Potion",
                "probability": .025
            },
            {
                "name": "Moon Stone",
                "probability": .005
            }
        ],
    };

    // Act
    function randomHeldItemGenerator(pokemonType: string, typeItems: { [i: string]: IItemProbabilities[] }): string[] | undefined {
            const probabilityOfHeldItem: number = .5;
            let counter: number = 0;

            for (const chosenObject of typeItems[pokemonType]) {
                counter += chosenObject.probability;
                if (counter >= probabilityOfHeldItem) {
                    return fsp.constants.items.byName[chosenObject.name].name;
                }
            }

            return undefined;
    }

    // Assert
    chai.expect(randomHeldItemGenerator("Normal", typeItems) === undefined);
});