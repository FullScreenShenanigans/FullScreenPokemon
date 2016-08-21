/// <reference path="../typings/UserWrappr.d.ts" />

/* tslint:disable */
declare var require: any;

if (typeof require === "undefined") {
    const onLoad: () => void = (): void => {
        new UserWrappr.UserWrappr(
            (window as any).FullScreenPokemon.FullScreenPokemon.prototype.settings.ui);
        window.removeEventListener("load", onLoad);
    };
} else {
    require(["FullScreenPokemon"], (FSP: any): void => {
        new UserWrappr.UserWrappr(
            (FSP || (window as any).FullScreenPokemon).FullScreenPokemon.prototype.settings.ui);
    });
}


window.addEventListener("load", onload);
/* tslint:enable */
