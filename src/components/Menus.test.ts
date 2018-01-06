import { expect } from "chai";

import { stubBlankGame } from "../fakes.test";

describe("Menus", () => {
    describe("pause", () => {
        it("opens when pause is pressed", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();

            // Act
            fsp.inputs.keyDownPause(fsp.players[0]);
            fsp.inputs.keyUpPause(fsp.players[0]);

            // Assert
            expect(fsp.menuGrapher.getActiveMenuName()).to.be.equal("Pause");
        });

        it("closes after B is pressed", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            fsp.inputs.keyDownPause(fsp.players[0]);
            fsp.inputs.keyUpPause(fsp.players[0]);

            // Act
            fsp.inputs.keyDownB(fsp.players[0]);
            fsp.inputs.keyUpB(fsp.players[0]);

            // Assert
            expect(fsp.menuGrapher.getActiveMenu()).to.be.equal(undefined);
        });
    });
});
