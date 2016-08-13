/// <reference path="../typings/UserWrappr.d.ts" />

/* tslint:disable */
declare var require: any;
if (typeof require === "undefined") {
    new UserWrappr.UserWrappr((window as any).FullScreenPokemon.FullScreenPokemon.prototype.settings.ui);
} else {
    require(["FullScreenPokemon"], (FSP: any): void => {
        console.log("FSP", FSP);
        console.log("window", window);
        new UserWrappr.UserWrappr(FSP.FullScreenPokemon.prototype.settings.ui);
    });
}
/* tslint:enable */
