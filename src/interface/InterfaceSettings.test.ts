import { expect } from "chai";
import * as sinon from "sinon";
import { AbsoluteSizeSchema, SelectSchema, UserWrapprSettings, UserWrappr } from "userwrappr";

import { stubBlankGame } from "../fakes.test";
import { FullScreenPokemon } from "../FullScreenPokemon";

import { createUserWrapprSettings } from "./InterfaceSettings";

const createStubGameWindow = () => ({
    addEventListener: sinon.spy(),
    document: {
        addEventListener: sinon.spy(),
    },
    FSP: undefined! as FullScreenPokemon,
    removeEventListener: sinon.spy(),
});

const createGame = (size: AbsoluteSizeSchema) =>
    stubBlankGame({
        height: size.height,
        width: size.width,
    }).fsp;

const saveValueAs = (wrapperSettings: UserWrapprSettings, value: string) =>
    (wrapperSettings
        .menus!.find((menu) => menu.title === "Options")!
        .options.find((options) => options.title === "Speed")! as SelectSchema).saveValue(
        value,
        "1x"
    );

describe("InterfaceSettings", () => {
    describe("Speed", () => {
        it("sets the frameTicker to a 3 1/3 game interval when the 5x speed is selected", async () => {
            // Arrange
            const gameWindow = createStubGameWindow();
            const wrapperSettings = createUserWrapprSettings({
                createGame,
                gameWindow,
            });
            const userWrapper = new UserWrappr(wrapperSettings);

            await userWrapper.createDisplay(document.createElement("div"));

            // Act
            saveValueAs(wrapperSettings, "5x");

            // Assert
            expect(gameWindow.FSP.frameTicker.getInterval()).to.be.approximately(3.33, 0.1);
        });

        it("sets the frameTicker to a 66 2/3 game interval when the 0.25x speed is selected", async () => {
            // Arrange
            const gameWindow = createStubGameWindow();
            const wrapperSettings = createUserWrapprSettings({
                createGame,
                gameWindow,
            });
            const userWrapper = new UserWrappr(wrapperSettings);

            await userWrapper.createDisplay(document.createElement("div"));

            // Act
            saveValueAs(wrapperSettings, "0.25x");

            // Assert
            expect(gameWindow.FSP.frameTicker.getInterval()).to.be.approximately(66.67, 0.1);
        });
    });
});
