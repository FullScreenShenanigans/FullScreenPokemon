import { expect } from "chai";

import { stubBlankGame } from "../fakes.test";
import { IListMenu } from "./Menus";

describe("Gameplay", () => {
    describe("startOptions", () => {
        it("starts in the Blank map", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();

            // Act
            fsp.gameplay.startOptions();

            // Assert
            expect(fsp.areaSpawner.getMapName()).to.be.equal("Blank");
        });

        it("opens the StartOptions menu as the active menu", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();

            // Act
            fsp.gameplay.startOptions();

            // Assert
            expect(fsp.menuGrapher.getActiveMenuName()).to.be.equal("StartOptions");
        });

        it("adds only the NEW GAME and LOAD FILE when no game data exists", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();

            // Act
            fsp.gameplay.startOptions();

            // Assert
            const { options } = fsp.menuGrapher.getActiveMenu() as IListMenu;
            const optionTexts = options.map((option) => option.text);

            expect(optionTexts).to.be.deep.equal([
                "NEW GAME",
                "LOAD FILE",
            ]);
        });

        it("also includes the CONTINUE option when the game was started", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();

            fsp.itemsHolder.setItem(fsp.items.names.gameStarted, true);

            // Act
            fsp.gameplay.startOptions();

            // Assert
            const { options } = fsp.menuGrapher.getActiveMenu() as IListMenu;
            const optionTexts = options.map((option) => option.text);
            expect(optionTexts).to.be.deep.equal([
                "CONTINUE",
                "NEW GAME",
                "LOAD FILE",
            ]);
        });
    });
});
