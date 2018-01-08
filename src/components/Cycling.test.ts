import { expect } from "chai";

import { stubBlankGame } from "../fakes.test";
import { ICharacter } from "./Things";

describe("Cycling", () => {
    describe("startCycling", () => {
        it("starts the player cycling when the area allows it", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();

            fsp.mapScreener.variables.allowCycling = true;
            player.cycling = false;

            // Act
            const cycling = fsp.cycling.startCycling(player);

            // Assert
            expect(cycling).to.be.equal(player.cycling).and.to.be.equal(true);
        });

        it("doesn't start the player cycling when the map area doesn't allow it", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();

            fsp.mapScreener.variables.allowCycling = false;
            player.cycling = false;

            // Act
            const cycling = fsp.cycling.startCycling(player);

            // Assert
            expect(cycling).to.be.equal(player.cycling).and.to.be.equal(false);
        });

        it("doesn't start the player cycling when the player is surfing", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();

            fsp.mapScreener.variables.allowCycling = true;
            player.cycling = false;
            player.surfing = true;

            // Act
            const cycling = fsp.cycling.startCycling(player);

            // Assert
            expect(cycling).to.be.equal(player.cycling).and.to.be.equal(false);
        });

        it("adds the 'cycling' class to the player when the player starts cycling", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();

            fsp.mapScreener.variables.allowCycling = true;
            player.cycling = false;

            // Act
            const cycling = fsp.cycling.startCycling(player);

            // Assert
            expect(fsp.graphics.hasClass(player, "cycling")).to.be.equal(true);
        });

        it("doubles the player's speed when the player starts cycling", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();
            const speed = 11.7;

            fsp.mapScreener.variables.allowCycling = true;
            player.cycling = false;
            player.speed = speed;

            // Act
            const cycling = fsp.cycling.startCycling(player);

            // Assert
            expect(player.speed).to.be.equal(speed * 2);
        });

        it("activates a GeneralText menu when the player starts cycling", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();

            fsp.mapScreener.variables.allowCycling = true;
            player.cycling = false;

            // Act
            const cycling = fsp.cycling.startCycling(player);

            // Assert
            expect(fsp.menuGrapher.getActiveMenuName()).to.be.equal("GeneralText");
        });
    });

    describe("stopCycling", () => {
        it("restores the player's old speed when the player stops cycling", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();
            const speed = 11.7;

            fsp.mapScreener.variables.allowCycling = true;
            player.speed = speed;
            fsp.cycling.startCycling(player);

            // Act
            fsp.cycling.stopCycling(player);

            // Assert
            expect(player.speed).to.be.equal(speed);
        });

        it("removes the cycling class from the player when the player stops cycling", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();

            fsp.mapScreener.variables.allowCycling = true;
            fsp.cycling.startCycling(player);

            // Act
            fsp.cycling.stopCycling(player);

            // Assert
            expect(fsp.graphics.hasClass(player, "cycling")).to.be.equal(false);
        });

        it("activates a GeneralText menu when the player starts cycling", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();

            fsp.mapScreener.variables.allowCycling = true;
            fsp.cycling.startCycling(player);

            // Act
            fsp.cycling.stopCycling(player);

            // Assert
            expect(fsp.menuGrapher.getActiveMenuName()).to.be.equal("GeneralText");
        });
    });
});
