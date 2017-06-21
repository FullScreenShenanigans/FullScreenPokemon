import { INewPokemon } from "./../../../src/components/constants/Pokemon";
import { FullScreenPokemon } from "./../../../src/FullScreenPokemon";
import { it } from "./../../main";
import { stubBlankGame } from "./../../utils/fakes";

const pokemonTitle: string[] = "CHARMANDER".split("");

const setUpFSPandGeneratedNumber(generatedNumber: number): FullScreenPokemon {
    const fsp: FullScreenPokemon = stubBlankGame();
    fsp.modAttacher.enableMod("Random Held Items");
    fsp.numberMaker.randomReal1 = (): number => generatedNumber;
    return fsp;
}

it("gives a newly spawned Pokemon a random item", (): void => {
    // Arrange
    const fsp = setUpFSPandGeneratedNumber(.012);
    const chosenInfo: INewPokemon = {
        level: 1,
        title: pokemonTitle
    };

    // Act
    const chosenPokemon = fsp.equations.newPokemon(chosenInfo);

    // Assert
    chai.expect(chosenPokemon.item).to.deep.equal("Burn Heal".split(""));
});

it("does not give a newly spawned Pokemon a random item", (): void => {
    // Arrange
    const fsp = setUpFSPandGeneratedNumber(1.15);
    const chosenInfo: INewPokemon = {
        level: 1,
        title: pokemonTitle
    };

    // Act
    const chosenPokemon = fsp.equations.newPokemon(chosenInfo);

    // Assert
    chai.expect(chosenPokemon.item).to.be.equal(undefined);
});
