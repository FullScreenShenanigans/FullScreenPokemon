import { expect } from "chai";

import { stubBlankGame } from "../../fakes.test";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IListMenu } from "../Menus";

const stubGameWithParty = (...titles: string[]) => {
    const { fsp } = stubBlankGame();

    fsp.itemsHolder.setItem(
        fsp.storage.names.pokemonInParty, 
        titles.map(title => fsp.equations.newPokemon({
            title: title.split(""),
        })),
    );

    return { fsp, titles };
}

const openPokemonMenu = (fsp: FullScreenPokemon) => {
    fsp.menus.pause.open();
    fsp.inputs.keyDownPause(fsp.players[0]);
    fsp.menuGrapher.registerA();
};

describe("Pokemon Menu", () => {
    it("displays party pokemon in order when first opened", () => {
        // Arrange
        const { fsp, titles } = stubGameWithParty("BULBASAUR", "CHARMANDER");

        // Act
        openPokemonMenu(fsp);

        // Assert
        const { options } = fsp.menuGrapher.getMenu("Pokemon") as IListMenu;
        expect(options.map(({ text }) => text.join(""))).to.deep.equal(titles);
    });

    it("updates the party order when the switch dialog is completed", () => {
        // Arrange
        const { fsp, titles } = stubGameWithParty("BULBASAUR", "CHARMANDER");
        openPokemonMenu(fsp);
        
        // Act
        fsp.menuGrapher.registerA();
        fsp.menuGrapher.registerDown();
        fsp.menuGrapher.registerA();
        fsp.menuGrapher.registerDown();
        fsp.menuGrapher.registerA();

        // Assert
        const { options } = fsp.menuGrapher.getMenu("Pokemon") as IListMenu;
        expect(options.map(({ text }) => text.join(""))).to.deep.equal([
            titles[1],
            titles[0],
        ]);
    });
});
