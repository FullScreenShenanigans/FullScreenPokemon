import { UserWrappr } from "userwrappr/lib/UserWrappr";

import { FullScreenPokemon } from "./FullScreenPokemon";

((): void => {
    /* tslint:disable */
    new UserWrappr(FullScreenPokemon.prototype.moduleSettings.ui);
    /* tslint:enable */
})();
