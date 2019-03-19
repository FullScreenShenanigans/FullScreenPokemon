import { expect } from "chai";

import { stubBlankGame } from "../../fakes.test";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";

import { randomRoamingMaximumFrequency, randomRoamingMinimumTicks } from "./Roaming";

const getTicksForSteps = (fsp: FullScreenPokemon, minimumSteps: number) =>
    (randomRoamingMaximumFrequency + randomRoamingMinimumTicks) * fsp.frameTicker.getInterval() * minimumSteps;

describe("Roaming", () => {
    describe("startRoaming", () => {
        for (const direction of [Direction.Top, Direction.Right, Direction.Bottom, Direction.Left]) {
            it(`only allows a character to roam ${Direction[direction]} when the only allowed direction is ${Direction[direction]}`, () => {
                // Arrange
                const { clock, fsp, player } = stubBlankGame();
                const npc = fsp.things.add(
                    [
                        fsp.things.names.lady,
                        {
                            roaming: true,
                            roamingDirections: [direction],
                        },
                    ],
                    player.left,
                    player.top);

                // Act
                clock.tick(getTicksForSteps(fsp, 5));

                // Assert
                expect(fsp.physics.getDirectionBetween(player, npc)).to.be.equal(direction);
            });
        }

        for (const direction of [Direction.Top, Direction.Right, Direction.Bottom, Direction.Left]) {
            it(`doesn't allow roaming to exceed 3 steps when when the only allowed direction is ${Direction[direction]}`, () => {
                // Arrange
                const { clock, fsp, player } = stubBlankGame();
                const npc = fsp.things.add(
                    [
                        fsp.things.names.lady,
                        {
                            roaming: true,
                            roamingDirections: [direction],
                        },
                    ],
                    player.left,
                    player.top);

                // Act
                clock.tick(getTicksForSteps(fsp, 10));

                // Assert
                const distance = direction % 2 === 1
                    ? Math.abs(fsp.physics.getMidX(player) - fsp.physics.getMidX(npc))
                    : Math.abs(fsp.physics.getMidY(player) - fsp.physics.getMidY(npc));

                // NPCs seems to travel an extra 3-4 game pixels each in-between step
                // See https://github.com/FullScreenShenanigans/FullScreenPokemon/issues/410
                expect(distance).to.be.approximately(npc.width * 3 + 7, 1);
            });
        }
    });
});
