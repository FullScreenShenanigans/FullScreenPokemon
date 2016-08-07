import { Inputs } from "../Inputs";
import { FullScreenPokemon } from "../FullScreenPokemon";

FullScreenPokemon.prototype.settings.input = {
    InputWritrArgs: {
        aliases: {
            // Keyboard aliases
            left:   [65, 37],     // a,     left
            right:  [68, 39],     // d,     right
            up:     [87, 38],     // w,     up
            down:   [83, 40],     // s,     down
            a:      [90, 13],     // z
            b:      [88, 8],      // x,     backspace
            pause:  [13, 80],     // enter, p
            select: [17, 16],     // ctrl,  shift
            // Mouse aliases
            rightclick: [3],
        },
        triggers: {
            onkeydown: {
                left: Inputs.prototype.keyDownLeft,
                right: Inputs.prototype.keyDownRight,
                up: Inputs.prototype.keyDownUp,
                down: Inputs.prototype.keyDownDown,
                a: Inputs.prototype.keyDownA,
                b: Inputs.prototype.keyDownB,
                pause: Inputs.prototype.keyDownPause,
                mute: Inputs.prototype.keyDownMute,
                select: Inputs.prototype.keyDownSelect
            },
            onkeyup: {
                left: Inputs.prototype.keyUpLeft,
                right: Inputs.prototype.keyUpRight,
                up: Inputs.prototype.keyUpUp,
                down: Inputs.prototype.keyUpDown,
                a: Inputs.prototype.keyUpA,
                b: Inputs.prototype.keyUpB,
                pause: Inputs.prototype.keyUpPause
            },
            onmousedown: {
                rightclick: Inputs.prototype.mouseDownRight
            },
            oncontextmenu: {},
            ondevicemotion: {
                // "devicemotion: Inputs.prototype.deviceMotion
            }
        }
    }
};
