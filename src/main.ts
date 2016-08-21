/// <reference path="../typings/UserWrappr.d.ts" />

/* tslint:disable */
declare var require: any;

const onLoad: () => void = (): void => {
    if (typeof require === "undefined") {
        new UserWrappr.UserWrappr(
            (window as any).FullScreenPokemon.FullScreenPokemon.prototype.settings.ui);
    } else {
        require(["FullScreenPokemon"], (FSP: any): void => {
            new UserWrappr.UserWrappr(
                (FSP || (window as any).FullScreenPokemon).FullScreenPokemon.prototype.settings.ui);
        });
    }

    document.removeEventListener("load", onLoad);
};

document.addEventListener("load", onload);
/* tslint:enable */
