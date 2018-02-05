import { expect } from "chai";

import { stubBlankGame } from "../../fakes.test";
import { IListMenu } from "../Menus";

describe("Pause", () => {
    it("opens when pause is pressed", (): void => {
        // Arrange
        const { fsp, player } = stubBlankGame();

        // Act
        fsp.inputs.keyDownPause(player);
        fsp.inputs.keyUpPause(player);

        // Assert
        expect(fsp.menuGrapher.getActiveMenuName()).to.be.equal("Pause");
    });

    it("closes after B is pressed", (): void => {
        // Arrange
        const { fsp, player } = stubBlankGame();

        fsp.inputs.keyDownPause(player);
        fsp.inputs.keyUpPause(player);

        // Act
        fsp.inputs.keyDownB(player);
        fsp.inputs.keyUpB(player);

        // Assert
        expect(fsp.menuGrapher.getActiveMenu()).to.be.equal(undefined);
    });

    describe("open", () => {
        it("doesn't include the POKEMON option when there are no Pokemon in the player's party", () => {
            // Arrange
            const { fsp } = stubBlankGame();

            // Act
            fsp.menus.pause.open();

            // Assert
            const { options } = fsp.menuGrapher.getActiveMenu() as IListMenu;
            const optionTexts = options.map((option) => option.text);

            expect(optionTexts).to.not.include("%%%%%%%POKEMON%%%%%%%");
        });

        it("includes the POKEMON option when there are Pokemon in the player's party", () => {
            // Arrange
            const { fsp } = stubBlankGame();

            fsp.itemsHolder.setItem(fsp.items.names.pokemonInParty, [
                fsp.equations.createPokemon({
                    level: 1,
                    title: "RATTATA".split(""),
                }),
            ]);

            // Act
            fsp.menus.pause.open();

            // Assert
            const { options } = fsp.menuGrapher.getActiveMenu() as IListMenu;
            const optionTexts = options.map((option) => option.text);

            expect(optionTexts).to.include("%%%%%%%POKEMON%%%%%%%");
        });

        it("doesn't include the POKEDEX option when the player doesn't have a Pokedex", () => {
            // Arrange
            const { fsp } = stubBlankGame();

            fsp.itemsHolder.setItem(fsp.items.names.hasPokedex, false);

            // Act
            fsp.menus.pause.open();

            // Assert
            const { options } = fsp.menuGrapher.getActiveMenu() as IListMenu;
            const optionTexts = options.map((option) => option.text);

            expect(optionTexts).to.not.include("%%%%%%%POKEDEX%%%%%%%");
        });

        it("includes the POKEDEX option when the player has a Pokedex", () => {
            // Arrange
            const { fsp } = stubBlankGame();

            fsp.itemsHolder.setItem(fsp.items.names.hasPokedex, true);

            // Act
            fsp.menus.pause.open();

            // Assert
            const { options } = fsp.menuGrapher.getActiveMenu() as IListMenu;
            const optionTexts = options.map((option) => option.text);

            expect(optionTexts).to.include("%%%%%%%POKEDEX%%%%%%%");
        });
    });
});
