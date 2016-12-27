import { ISizeSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../../src/FullScreenPokemon";
import { mochaLoader } from "../main";

mochaLoader.it("can be created", (): void => {
    // Arrange
    const settings: ISizeSettings = {
        width: 256,
        height: 256
    };

    // Act
    chai.expect(() => new FullScreenPokemon(settings)).to.not.throw;
});
