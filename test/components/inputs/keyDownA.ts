import { spy } from "sinon";

import { Direction } from "../../../src/components/Constants";
import { IPlayer, IThing } from "../../../src/components/Things";
import { FullScreenPokemon } from "../../../src/FullScreenPokemon";
import { it } from "../../main";
import { stubBlankGame } from "../../utils/fakes";

it("activates a bordering activatable solid", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const player: IPlayer = fsp.things.add("Player") as IPlayer;
    const solid: IThing = fsp.things.add("FenceWide") as IThing;

    solid.activate = spy();
    fsp.actions.animateCharacterSetDirection(player, Direction.Top);
    fsp.physics.setMidXObj(player, solid);
    fsp.physics.setTop(player, solid.bottom);

    // Act
    fsp.inputs.keyDownA(player);

    // Assert
    chai.expect(solid.activate).to.have.been.called;
});

it("does not activate a non-bordering activatable solid", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    const player: IPlayer = fsp.things.add("Player") as IPlayer;
    const solid: IThing = fsp.things.add("FenceWide") as IThing;

    solid.activate = spy();
    fsp.actions.animateCharacterSetDirection(player, Direction.Top);
    fsp.physics.setMidXObj(player, solid);
    fsp.physics.setTop(player, solid.bottom + player.height);

    // Act
    fsp.inputs.keyDownA(player);

    // Assert
    chai.expect(solid.activate).to.not.have.been.called;
});
