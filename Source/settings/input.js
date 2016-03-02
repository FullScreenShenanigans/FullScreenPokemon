FullScreenPokemon.FullScreenPokemon.settings.input = {
    "InputWritrArgs": {
        "aliases": {
            // Keyboard aliases
            "left":   [65, 37],     // a,     left
            "right":  [68, 39],     // d,     right
            "up":     [87, 38],     // w,     up
            "down":   [83, 40],     // s,     down
            "a":      [90, 13],     // z
            "b":      [88, 8],      // x,     backspace
            "pause":  [13, 80],     // enter, p
            "select": [17, 16],     // ctrl,  shift
            // Mouse aliases
            "rightclick": [3],
        },
        "triggers": {
            "onkeydown": {
                "left": FullScreenPokemon.FullScreenPokemon.prototype.keyDownLeft,
                "right": FullScreenPokemon.FullScreenPokemon.prototype.keyDownRight,
                "up": FullScreenPokemon.FullScreenPokemon.prototype.keyDownUp,
                "down": FullScreenPokemon.FullScreenPokemon.prototype.keyDownDown,
                "a": FullScreenPokemon.FullScreenPokemon.prototype.keyDownA,
                "b": FullScreenPokemon.FullScreenPokemon.prototype.keyDownB,
                "pause": FullScreenPokemon.FullScreenPokemon.prototype.togglePauseMenu,
                "mute": FullScreenPokemon.FullScreenPokemon.prototype.keyDownMute,
                "select": FullScreenPokemon.FullScreenPokemon.prototype.keyDownSelect
            },
            "onkeyup": {
                "left": FullScreenPokemon.FullScreenPokemon.prototype.keyUpLeft,
                "right": FullScreenPokemon.FullScreenPokemon.prototype.keyUpRight,
                "up": FullScreenPokemon.FullScreenPokemon.prototype.keyUpUp,
                "down": FullScreenPokemon.FullScreenPokemon.prototype.keyUpDown,
                "a": FullScreenPokemon.FullScreenPokemon.prototype.keyUpA,
                "b": FullScreenPokemon.FullScreenPokemon.prototype.keyUpB,
                "pause": FullScreenPokemon.FullScreenPokemon.prototype.keyUpPause
            },
            "onmousedown": {
                "rightclick": FullScreenPokemon.FullScreenPokemon.prototype.mouseDownRight
            },
            "oncontextmenu": {},
            "ondevicemotion": {
                //"devicemotion": FullScreenPokemon.FullScreenPokemon.prototype.deviceMotion
            }
        }
    }
};