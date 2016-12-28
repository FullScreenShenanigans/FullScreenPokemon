import { IInputModuleSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Input settings for the FullScreenPokemon instance.
 */
export function GenerateInputSettings(fsp: FullScreenPokemon): IInputModuleSettings {
    "use strict";

    return {
        aliases: {
            // Keyboard aliases
            left:   [65, 37],     // a,     left
            right:  [68, 39],     // d,     right
            up:     [87, 38],     // w,     up
            down:   [83, 40],     // s,     down
            a:      [90, 13],     // z,     enter
            b:      [88, 8],      // x,     backspace
            pause:  [80, 27],     // p,     escape
            select: [17, 16],     // ctrl,  shift
            // Mouse aliases
            rightclick: [3],
        },
        triggers: {
            onkeydown: {
                left: fsp.inputs.keyDownLeft.bind(fsp.inputs),
                right: fsp.inputs.keyDownRight.bind(fsp.inputs),
                up: fsp.inputs.keyDownUp.bind(fsp.inputs),
                down: fsp.inputs.keyDownDown.bind(fsp.inputs),
                a: fsp.inputs.keyDownA.bind(fsp.inputs),
                b: fsp.inputs.keyDownB.bind(fsp.inputs),
                pause: fsp.inputs.keyDownPause.bind(fsp.inputs),
                mute: fsp.inputs.keyDownMute.bind(fsp.inputs),
                select: fsp.inputs.keyDownSelect.bind(fsp.inputs)
            },
            onkeyup: {
                left: fsp.inputs.keyUpLeft.bind(fsp.inputs),
                right: fsp.inputs.keyUpRight.bind(fsp.inputs),
                up: fsp.inputs.keyUpUp.bind(fsp.inputs),
                down: fsp.inputs.keyUpDown.bind(fsp.inputs),
                a: fsp.inputs.keyUpA.bind(fsp.inputs),
                b: fsp.inputs.keyUpB.bind(fsp.inputs),
                pause: fsp.inputs.keyUpPause.bind(fsp.inputs)
            },
            onmousedown: {
                rightclick: fsp.inputs.mouseDownRight.bind(fsp.inputs)
            },
            oncontextmenu: {},
            ondevicemotion: {
                // "devicemotion: fsp.inputs.deviceMotion
            }
        }
    };
}
