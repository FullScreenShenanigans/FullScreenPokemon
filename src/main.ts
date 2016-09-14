/// <reference path="../node_modules/@types/chai/index.d.ts" />
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../typings/UserWrappr.d.ts" />

/* tslint:disable */
declare var require: any;

if (typeof require === "undefined") {
    const onLoad: () => void = (): void => {
        new UserWrappr.UserWrappr(
            (window as any).FullScreenPokemon.FullScreenPokemon.prototype.settings.ui);
        window.removeEventListener("load", onLoad);
    };
    window.addEventListener("load", onLoad);
}
// https://github.com/FullScreenShenanigans/gulp-shenanigans/issues/22
// FSP is being required during testing, which throws out-of-test errors
else if (typeof mocha !== "undefined" && typeof chai !== "undefined") {
    require(["FullScreenPokemon"], (FSP: any): void => {
        new UserWrappr.UserWrappr(
            (FSP || (window as any).FullScreenPokemon).FullScreenPokemon.prototype.settings.ui);
    });
}
/* tslint:enable */
