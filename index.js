document.onreadystatechange = function (event) {
    if (event.target.readyState !== "complete") {
        return;
    }
    
    var timeStart = Date.now(),
        UserWrapper = new UserWrappr(FullScreenPokemon.prototype.proliferate({
            "GameStartrConstructor": FullScreenPokemon
        }, FullScreenPokemon.prototype.settings.ui, true));
    
    console.log("It took " + (Date.now() - timeStart) + " milliseconds to start.");
    UserWrapper.displayHelpMenu();
};