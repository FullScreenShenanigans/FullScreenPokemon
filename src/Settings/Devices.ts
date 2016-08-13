/// <reference path="../../typings/GameStartr.d.ts" />

export function GenerateDevicesSettings(): GameStartr.IDeviceLayrCustoms {
    "use strict";

    return {
        triggers: {
            a: {
                trigger: "a"
            },
            b: {
                trigger: "b"
            },
            dpadUp: {
                trigger: "up"
            },
            dpadDown: {
                trigger: "down"
            },
            dpadLeft: {
                trigger: "left"
            },
            dpadRight: {
                trigger: "right"
            },
            select: {
                trigger: "pause"
            },
            start: {
                trigger: "pause"
            },
            leftJoystick: {
                x: {
                    negative: "left",
                    positive: "right"
                },
                y: {
                    negative: "up",
                    positive: "down"
                }
            },
            rightJoystick: {
                x: {
                    negative: "left",
                    positive: "right"
                },
                y: {
                    negative: "up",
                    positive: "down"
                }
            }
        },
        aliases: {
            on: "onkeydown",
            off: "onkeyup"
        }
    };
}
