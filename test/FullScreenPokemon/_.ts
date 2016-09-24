/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />

import { mocks } from "../utils/mocks";
import { mochaLoader } from "../main";

mochaLoader.it("_", (): void => {
    chai.expect(() => mocks.mockFullScreenPokemon()).to.not.throw();
});
