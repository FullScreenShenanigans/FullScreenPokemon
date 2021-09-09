import { expect } from "chai";

import { stubBlankGame } from "../../fakes.test";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { NewPokemon } from "../constants/Pokemon";

describe("RandomHeldItemsMod", () => {
    const pokemonTitle: string[] = "CHARMANDER".split("");

    const setUpFSPandGeneratedNumber = (generatedNumber: number): FullScreenPokemon => {
        const { fsp } = stubBlankGame();
        fsp.modAttacher.enableMod("Random Held Items");
        fsp.numberMaker.randomReal1 = (): number => generatedNumber;
        return fsp;
    };

    it("gives a newly spawned Pokemon a random item when generated probability is valid", (): void => {
        // Arrange
        const fsp = setUpFSPandGeneratedNumber(0.012);
        const chosenInfo: NewPokemon = {
            level: 1,
            title: pokemonTitle,
        };

        // Act
        const chosenPokemon = fsp.equations.newPokemon(chosenInfo);

        // Assert
        expect(chosenPokemon.item).to.deep.equal("Burn Heal".split(""));
    });

    it("does not give a newly spawned Pokemon a random item when generated probability is invalid", (): void => {
        // Arrange
        const fsp = setUpFSPandGeneratedNumber(1.15);
        const chosenInfo: NewPokemon = {
            level: 1,
            title: pokemonTitle,
        };

        // Act
        const chosenPokemon = fsp.equations.newPokemon(chosenInfo);

        // Assert
        expect(chosenPokemon.item).to.be.equal(undefined);
    });
});
