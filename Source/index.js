var time = Date.now();

document.onreadystatechange = function (event) {
    if (event.target.readyState !== "complete") {
        return;
    }

    var UserWrapper = new UserWrappr.UserWrappr(FullScreenPokemon.FullScreenPokemon.prototype.proliferate(
        {
            "GameStartrConstructor": FullScreenPokemon.FullScreenPokemon
        }, FullScreenPokemon.FullScreenPokemon.settings.ui, true));

    console.log("It took " + (Date.now() - time) + " milliseconds to start.");

    UserWrapper.GameStarter.UsageHelper.displayHelpMenu();
};
