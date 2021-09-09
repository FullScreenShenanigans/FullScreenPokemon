import { expect } from "chai";
import * as sinon from "sinon";

import { stubBlankGame } from "../fakes.test";

import { Direction } from "./Constants";
import { Player } from "./Actors";

describe("Inputs", () => {
    describe("keyDownA", () => {
        it("activates an activatable solid when it's bordering the player", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const player = fsp.actors.add<Player>("Player");
            const solid = fsp.actors.add("FenceWide");
            const activate = (solid.activate = sinon.spy());

            fsp.actions.animateCharacterSetDirection(player, Direction.Top);
            fsp.physics.setMidXObj(player, solid);
            fsp.physics.setTop(player, solid.bottom);
            player.bordering[player.direction] = solid;

            // Act
            fsp.inputs.keyDownA(player);

            // Assert
            expect(activate).to.have.been.calledWithExactly(player, solid);
        });

        it("does not activate an activatable solid when it's not bordering the player", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const player = fsp.actors.add<Player>("Player");
            const solid = fsp.actors.add("FenceWide");
            const activate = (solid.activate = sinon.spy());

            fsp.actions.animateCharacterSetDirection(player, Direction.Top);
            fsp.physics.setMidXObj(player, solid);
            fsp.physics.setTop(player, solid.bottom + player.height);

            // Act
            fsp.inputs.keyDownA(player);

            // Assert
            expect(activate.callCount).to.be.equal(0);
        });
    });
});
