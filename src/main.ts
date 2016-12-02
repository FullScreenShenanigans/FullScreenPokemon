import { UserWrappr } from "userwrappr/lib/UserWrappr";

import { FullScreenPokemon } from "./FullScreenPokemon";

((): void => {
    const onLoad: () => void = (): void => {
        (window as any).UserWrapper = new UserWrappr(FullScreenPokemon.prototype.moduleSettings.ui);
        window.removeEventListener("load", onLoad);
    };

    window.addEventListener("load", onLoad);
})();
