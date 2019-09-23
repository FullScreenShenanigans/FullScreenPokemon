import { expect } from "chai";

import { stubBlankGame } from "../../../fakes.test";
import { IListMenu } from "../../Menus";
import { FullScreenPokemon } from "../../../FullScreenPokemon";

const menuNames = [
    "OptionTextSpeed",
    "OptionBattleAnimation",
    "OptionBattleStyle",
];

const openOptionMenu = (fsp: FullScreenPokemon) => {
    fsp.menus.pause.open();
    fsp.inputs.keyDownPause(fsp.players[0]);
    fsp.menuGrapher.registerDown();
    fsp.menuGrapher.registerDown();
    fsp.menuGrapher.registerDown();
    fsp.menuGrapher.registerA();
};

describe("Option Menu", () => {
    it("defaults menu positions to the first option when first opened", () => {
        // Arrange
        const { fsp } = stubBlankGame();

        // Act
        openOptionMenu(fsp);

        // Assert
        expect(menuNames.map(menuName => (fsp.menuGrapher.getMenu(menuName) as IListMenu).selectedIndex)).to.deep.equal([
            [0, 0],
            [0, 0],
            [0, 0],
        ]);
    });

    it("saves menu positions when reopened after closing after changing", () => {
        // Arrange
        const { fsp } = stubBlankGame();
        openOptionMenu(fsp);

        fsp.menuGrapher.registerRight();
        fsp.menuGrapher.registerRight();

        fsp.menuGrapher.registerDown();
        fsp.menuGrapher.registerRight();

        // Act
        fsp.menuGrapher.registerDown();
        fsp.menuGrapher.registerA();

        // Assert
        expect(menuNames.map(menuName => (fsp.menuGrapher.getMenu(menuName) as IListMenu).selectedIndex)).to.deep.equal([
            [2, 0],
            [1, 0],
            [0, 0],
        ]);
    });
});
