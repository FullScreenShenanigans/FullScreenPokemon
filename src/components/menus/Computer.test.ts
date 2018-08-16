import { expect } from "chai";

import { stubBlankGame } from "../../fakes.test";
import { IListMenu } from "../Menus";

describe("Computer", () => {
    it("creates a list of PC options after the dialog when opened", () => {
        // Arrange
        const { fsp } = stubBlankGame({
            automaticallyAdvanceMenus: true,
        });

        // Act
        fsp.menus.computer.open();
        fsp.menuGrapher.registerA();

        // Assert
        const menu = fsp.menuGrapher.getActiveMenu() as IListMenu;
        const options = menu.grid[0].map((option) => option.text);
        expect(options).to.be.deep.equal([
            "BILL's PC",
            "%%%%%%%PLAYER%%%%%%%'s PC",
            "PROF. OAK's PC",
            "LOG OFF",
        ]);
    });

    describe("LOG OFF", () => {
        it("logs off when the LOG OFF option is selected", () => {
            // Arrange
            const { fsp } = stubBlankGame({
                automaticallyAdvanceMenus: true,
            });

            fsp.menus.computer.open();
            fsp.menuGrapher.registerA();
            fsp.menuGrapher.registerDown();
            fsp.menuGrapher.registerDown();
            fsp.menuGrapher.registerDown();

            // Act
            fsp.menuGrapher.registerA();

            // Assert
            expect(fsp.menuGrapher.getActiveMenu()).to.be.equal(undefined);
        });
    });
});
