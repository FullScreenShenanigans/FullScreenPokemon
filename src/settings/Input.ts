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
                left: (event: Event): void => fsp.inputs.keyDownLeft(fsp.players[0], event),
                right: (event: Event): void => fsp.inputs.keyDownRight(fsp.players[0], event),
                up: (event: Event): void => fsp.inputs.keyDownUp(fsp.players[0], event),
                down: (event: Event): void => fsp.inputs.keyDownDown(fsp.players[0], event),
                a: (event: Event): void => fsp.inputs.keyDownA(fsp.players[0], event),
                b: (event: Event): void => fsp.inputs.keyDownB(fsp.players[0], event),
                pause: (event: Event): void => fsp.inputs.keyDownPause(fsp.players[0], event),
                mute: (event: Event): void => fsp.inputs.keyDownMute(fsp.players[0], event),
                select: (event: Event): void => fsp.inputs.keyDownSelect(fsp.players[0], event)
            },
            onkeyup: {
                left: (event: Event): void => fsp.inputs.keyUpLeft(fsp.players[0], event),
                right: (event: Event): void => fsp.inputs.keyUpRight(fsp.players[0], event),
                up: (event: Event): void => fsp.inputs.keyUpUp(fsp.players[0], event),
                down: (event: Event): void => fsp.inputs.keyUpDown(fsp.players[0], event),
                a: (event: Event): void => fsp.inputs.keyUpA(fsp.players[0], event),
                b: (event: Event): void => fsp.inputs.keyUpB(fsp.players[0], event),
                pause: (event: Event): void => fsp.inputs.keyUpPause(fsp.players[0], event)
            },
            onmousedown: {
                rightclick: (event: Event): void => fsp.inputs.mouseDownRight(fsp.players[0], event)
            },
            oncontextmenu: {},
            ondevicemotion: {
                // "devicemotion: fsp.inputs.deviceMotion
            }
        }
    };
}
