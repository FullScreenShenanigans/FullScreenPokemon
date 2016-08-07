/// <reference path="../typings/UserWrappr.d.ts" />

/* tslint:disable */
declare var require: any;
require(["FullScreenPokemon"], (FSP: any): void => {
    new UserWrappr.UserWrappr(FSP.FullScreenPokemon.prototype.settings.ui);
});
