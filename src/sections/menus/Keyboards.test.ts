import { expect } from "chai";
import { Direction } from "menugraphr";
import * as sinon from "sinon";

import { stubBlankGame } from "../../fakes.test";

import { KeyboardResultsMenu } from "./Keyboards";

describe("Keyboards", () => {
    it("doesn't call callback before ED is pressed", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const { keyboards } = fsp.menus;
        const callback = sinon.spy();

        // Act
        keyboards.openKeyboardMenu({ callback });

        // Assert
        expect(callback.callCount).to.be.equal(0);
    });

    it("calls callback when ED is pressed", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const { keyboards } = fsp.menus;
        const callback = sinon.spy();

        keyboards.openKeyboardMenu({ callback });

        fsp.menuGrapher.registerDirection(Direction.Left);
        fsp.menuGrapher.registerDirection(Direction.Top);
        fsp.menuGrapher.registerDirection(Direction.Top);

        // Act
        fsp.menuGrapher.registerA();

        // Assert
        expect(callback.callCount).to.be.equal(1);
    });

    it("stores a typed name when ED is pressed", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const { keyboards } = fsp.menus;

        keyboards.openKeyboardMenu();

        fsp.menuGrapher.registerA();

        fsp.menuGrapher.registerDirection(Direction.Right);
        fsp.menuGrapher.registerA();

        fsp.menuGrapher.registerDirection(Direction.Left);
        fsp.menuGrapher.registerDirection(Direction.Left);
        fsp.menuGrapher.registerDirection(Direction.Top);
        fsp.menuGrapher.registerDirection(Direction.Top);

        // Act
        fsp.menuGrapher.registerA();

        // Assert
        const menu = fsp.menuGrapher.getMenu("KeyboardResult") as KeyboardResultsMenu;
        expect(menu.completeValue).to.be.deep.equal(["A", "B"]);
    });

    it("appends lowercase characters when switched to lowercase", () => {
        const { fsp } = stubBlankGame();
        const { keyboards } = fsp.menus;

        keyboards.openKeyboardMenu();

        fsp.menuGrapher.registerA();

        fsp.menuGrapher.registerDirection(Direction.Top);
        fsp.menuGrapher.registerA();

        fsp.menuGrapher.registerDirection(Direction.Right);
        fsp.menuGrapher.registerDirection(Direction.Bottom);
        fsp.menuGrapher.registerA();

        fsp.menuGrapher.registerDirection(Direction.Left);
        fsp.menuGrapher.registerDirection(Direction.Left);
        fsp.menuGrapher.registerDirection(Direction.Top);

        // Act
        fsp.menuGrapher.registerA();

        // Assert
        const menu = fsp.menuGrapher.getMenu("KeyboardResult") as KeyboardResultsMenu;
        expect(menu.completeValue).to.be.deep.equal(["A", "b"]);
    });
});
