import { IPokemon } from "../../src/components/Battles";
import { INewPokemon } from "../../src/components/constants/Pokemon";
import { FullScreenPokemon } from "../../src/FullScreenPokemon";
import { it } from "../main";
import { stubBlankGame } from "../utils/fakes";

const pokemonTitle: string[] = "CHARMANDER".split("");

it("Pokemon can be given an item when created", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    // Act
    const pokemon: IPokemon = fsp.equations.newPokemon({
        level: 1,
        title: pokemonTitle,
        item: "Potion".split("")
    });


    // Assert
    chai.expect(pokemon.item).to.deep.equal("Potion".split(""));
});

it("RandomHeldItemMod makes Pokemon spawn with random item when the generated probability is valid", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    fsp.modAttacher.enableMod("Random Held Items");
    fsp.numberMaker.randomReal1 = (): number => .012;
    const chosenInfo: INewPokemon = {
        level: 1,
        title: pokemonTitle
    };

    // Act
    const chosenPokemon = fsp.equations.newPokemon(chosenInfo);

    // Assert
    chai.expect(chosenPokemon.item).to.be.deep.equal("Burn Heal".split(""));
});

it("RandomHeldItemMod makes Pokemon spawn with no item when the generated probability is invalid", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    fsp.modAttacher.enableMod("Random Held Items");
    fsp.numberMaker.randomReal1 = (): number => 1.15;
    const chosenInfo: INewPokemon = {
        level: 1,
        title: pokemonTitle
    };

    // Act
    const chosenPokemon = fsp.equations.newPokemon(chosenInfo);

    // Assert
    chai.expect(chosenPokemon.item).to.be.deep.equal(undefined);
});
