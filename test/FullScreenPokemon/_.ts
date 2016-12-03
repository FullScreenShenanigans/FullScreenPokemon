import { IGameStartrSettings } from "gamestartr/lib/IGameStartr";

import { mochaLoader } from "../main";
import { FullScreenPokemon } from "../../src/FullScreenPokemon";

mochaLoader.it("can be created", (): void => {
    // Arrange
    const settings: IGameStartrSettings = {
        width: 256,
        height: 256
    };

    // Act
    chai.expect(() => new FullScreenPokemon(settings)).to.not.throw;
});
