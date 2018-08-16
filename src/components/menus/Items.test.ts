import { expect } from "chai";
import * as sinon from "sinon";

import { stubBlankGame } from "../../fakes.test";
import { IListMenu } from "../Menus";
import { IInventoryListing, IItemMenuSettings } from "./Items";

describe("Items", () => {
    describe("open", () => {
        const settings: IItemMenuSettings = {
            onUse: sinon.spy(),
            onToss: sinon.spy(),
        };

        it("only displays CANCEL when the player has no items", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();

            // Act
            fsp.menus.items.open(settings);

            // Assert
            const { options } = fsp.menuGrapher.getActiveMenu() as IListMenu;
            const optionTexts = options.map((option) => option.text);

            expect(optionTexts).to.be.deep.equal([
                "CANCEL",
            ]);
        });

        it("displays item names and CANCEL when the player has items", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const items: IInventoryListing[] = [
                {
                    amount: 1,
                    item: "FIRST",
                },
                {
                    amount: 1,
                    item: "SECOND",
                },
            ];

            // Act
            fsp.menus.items.open({ items, ...settings });

            // Assert
            const { options } = fsp.menuGrapher.getActiveMenu() as IListMenu;
            const optionTexts = options.map((option) => option.text);

            expect(optionTexts).to.be.deep.equal([
                "FIRST",
                "SECOND",
                "CANCEL",
            ]);
        });

        it("uses stored items item when no item listings are provided", () => {
            // Arrange
            const { fsp } = stubBlankGame();
            const items: IInventoryListing[] = [
                {
                    amount: 1,
                    item: "FIRST",
                },
                {
                    amount: 1,
                    item: "SECOND",
                },
            ];

            fsp.itemsHolder.setItem(fsp.storage.names.items, items);

            // Act
            fsp.menus.items.open(settings);

            // Assert
            const { options } = fsp.menuGrapher.getActiveMenu() as IListMenu;
            const optionTexts = options.map((option) => option.text);

            expect(optionTexts).to.be.deep.equal([
                "FIRST",
                "SECOND",
                "CANCEL",
            ]);
        });

        it("opens an item's menu when that item is selected", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();
            const items: IInventoryListing[] = [
                {
                    amount: 1,
                    item: "FIRST",
                },
                {
                    amount: 1,
                    item: "SECOND",
                },
            ];

            fsp.menus.items.open({ items, ...settings });

            // Act
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyUpA(player);

            // Assert
            expect(fsp.menuGrapher.getActiveMenuName()).to.be.deep.equal("Item");
        });
    });

    describe("openItemMenu", () => {
        const listing = {
            amount: 1,
            item: "FIRST",
        };

        it("doesn't add a GIVE option when the feature isn't enabled", () => {
            // Arrange
            const { fsp } = stubBlankGame();
            const settings = {
                onUse: sinon.spy(),
                onToss: sinon.spy(),
            };

            fsp.flagSwapper.setGeneration("I");

            // Act
            fsp.menus.items.openItem(listing, settings);

            // Assert
            const { options } = fsp.menuGrapher.getActiveMenu() as IListMenu;
            const optionTexts = options.map((option) => option.text);

            expect(optionTexts).to.be.deep.equal([
                "USE",
                "TOSS",
            ]);
        });

        it("adds a GIVE option when the feature is enabled", () => {
            // Arrange
            const { fsp } = stubBlankGame();
            const settings = {
                onUse: sinon.spy(),
                onToss: sinon.spy(),
            };

            fsp.flagSwapper.setGeneration("II");

            // Act
            fsp.menus.items.openItem(listing, settings);

            // Assert
            const { options } = fsp.menuGrapher.getActiveMenu() as IListMenu;
            const optionTexts = options.map((option) => option.text);

            expect(optionTexts).to.be.deep.equal([
                "USE",
                "TOSS",
                "GIVE",
            ]);
        });

        it("creates a menu that calls the given onUse setting when USE is selected", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();
            const settings = {
                onUse: sinon.spy(),
                onToss: sinon.spy(),
            };

            fsp.menus.items.openItem(listing, settings);

            // Act
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyUpA(player);

            // Assert
            expect(settings.onUse).to.have.been.calledWithExactly(listing);
        });

        it("creates a menu that calls the given onToss setting when TOSS is selected", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();
            const settings = {
                onUse: sinon.spy(),
                onToss: sinon.spy(),
            };

            fsp.menus.items.openItem(listing, settings);

            fsp.menuGrapher.shiftSelectedIndex("Item", 0, 1);
            fsp.inputs.keyDownDown(player);
            fsp.inputs.keyUpDown(player);

            // Act
            fsp.inputs.keyDownA(player);
            fsp.inputs.keyUpA(player);

            // Assert
            expect(settings.onToss).to.have.been.calledWithExactly(listing);
        });
    });

    describe("tossItem", () => {
        it("throws out an item when its amount reaches above zero", () => {
            // Arrange
            const { fsp } = stubBlankGame();
            fsp.saves.addItemToBag("Potion");
            fsp.saves.addItemToBag("Potion");

            // Act
            fsp.saves.removeItemFromBag("Potion");

            // Assert
            expect(fsp.itemsHolder.getItem(fsp.storage.names.items)[0].amount).to.be.equal(1);
        });

        it("throws out an item when its amount reaches below zero", () => {
            // Arrange
            const { fsp } = stubBlankGame();
            fsp.saves.addItemToBag("Potion");

            // Act
            fsp.saves.removeItemFromBag("Potion");

            // Assert
            expect(fsp.itemsHolder.getItem(fsp.storage.names.items)[0]).to.be.equal(undefined);
        });

        it("does not throw out an item when item doesn't exist", () => {
            // Arrange
            const { fsp } = stubBlankGame();
            fsp.saves.addItemToBag("Potion");

            // Act
            fsp.saves.removeItemFromBag("Fire Stone");

            // Assert
            expect(fsp.itemsHolder.getItem(fsp.storage.names.items)[0].amount).to.be.equal(1);
        });
    });
});
