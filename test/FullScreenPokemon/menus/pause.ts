import { FullScreenPokemon } from "../../../src/FullScreenPokemon";
import { it } from "../../main";
import { stubBlankGame } from "../../utils/fakes";

it("opens when pause is pressed", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();

    // Act
    fsp.inputs.keyDownPause(fsp.players[0]);
    fsp.inputs.keyUpPause(fsp.players[0]);

    // Assert
    chai.expect(fsp.menuGrapher.getActiveMenuName()).to.be.equal("Pause");
});

it("closes after B is pressed", (): void => {
    // Arrange
    const fsp: FullScreenPokemon = stubBlankGame();
    fsp.inputs.keyDownPause(fsp.players[0]);
    fsp.inputs.keyUpPause(fsp.players[0]);

    // Act
    fsp.inputs.keyDownB(fsp.players[0]);
    fsp.inputs.keyUpB(fsp.players[0]);

    // Assert
    chai.expect(fsp.menuGrapher.getActiveMenu()).to.be.undefined;
});
