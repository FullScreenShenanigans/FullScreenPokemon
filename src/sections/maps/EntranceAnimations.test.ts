import { expect } from "chai";

import { stubBlankGame } from "../../fakes.test";

describe("EntranceAnimations", () => {
    describe("resume", () => {
        it("defaults player position to (0, 0) when not previously saved", () => {
            // Arrange
            const { fsp } = stubBlankGame();
            const zeroCorner = fsp.things.add(fsp.things.names.grass, 0, 0);

            // Act
            fsp.maps.entranceAnimations.resume();

            // Assert
            expect(fsp.groupHolder.getThing("player")).to.deep.include({
                left: zeroCorner.left,
                top: zeroCorner.top,
            });
        });

        it("restores player position to the saved value when previously saved", () => {
            // Arrange
            const xloc = 40;
            const yloc = 24;
            const { fsp } = stubBlankGame();
            const zeroCorner = fsp.things.add(fsp.things.names.grass, 0, 0);

            fsp.stateHolder.addChange("player", "xloc", xloc);
            fsp.stateHolder.addChange("player", "yloc", yloc);

            // Act
            document.body.appendChild(fsp.canvas);
            fsp.maps.entranceAnimations.resume();

            // Assert
            expect(fsp.groupHolder.getThing("player")).to.deep.include({
                left: zeroCorner.left + xloc,
                top: zeroCorner.top + yloc,
            });
        });
    });
});
