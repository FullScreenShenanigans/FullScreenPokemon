FullScreenPokemon.prototype.settings.input = {
    "InputWritrArgs": {
        "aliases": {
            // Keyboard aliases
            "left":   [65, 37],     // a,     left
            "right":  [68, 39],     // d,     right
            "up":     [87, 38, 32], // w,     up,    space
            "down":   [83, 40],     // s,     down
            "sprint": [16, 17],     // shift, ctrl
            "pause":  [80],         // p (pause)
            // Mouse aliases
            "rightclick": [3],
        },
        "triggers": {
            "onkeydown": {
                "left": FullScreenPokemon.prototype.keyDownLeft,
                "right": FullScreenPokemon.prototype.keyDownRight,
                "up": FullScreenPokemon.prototype.keyDownUp,
                "down": FullScreenPokemon.prototype.keyDownDown,
                "pause": FullScreenPokemon.prototype.keyDownPause,
                "mute": FullScreenPokemon.prototype.keyDownMute,
            },
            "onkeyup": {
                "left": FullScreenPokemon.prototype.keyUpLeft,
                "right": FullScreenPokemon.prototype.keyUpRight,
                "up": FullScreenPokemon.prototype.keyUpUp,
                "down": FullScreenPokemon.prototype.keyUpDown,
                "pause": FullScreenPokemon.prototype.keyUpPause
            },
            "onmousedown": {
                "rightclick": FullScreenPokemon.prototype.mouseDownRight
            },
            "oncontextmenu": {},
            "ondevicemotion": {
                //"devicemotion": FullScreenPokemon.prototype.deviceMotion
            }
        }
    }
};