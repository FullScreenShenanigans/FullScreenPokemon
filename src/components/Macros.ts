import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Macro functions used by FullScreenPokemon instances.
 */
export class Macros<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Macro Function used to create an alternating pattern of Things.
     *
     * @param reference   Settings for a Checkered macro.
     * @returns A checkered pattern of Things.
     */
    public macroCheckered(reference: any): any[] {
        const xStart: number = reference.x || 0;
        const yStart: number = reference.y || 0;
        const xnum: number = reference.xnum || 1;
        const ynum: number = reference.ynum || 1;
        const xwidth: number = reference.xwidth || 32;
        const yheight: number = reference.yheight || 32;
        const offset: number = reference.offset || 0;
        const things: string[] = reference.things;
        const mod: number = things.length;
        const output: any[] = [];
        let y: number;

        y = yStart;
        for (let i: number = 0; i < ynum; i += 1) {
            let x: number = xStart;
            for (let j: number = 0; j < xnum; j += 1) {
                const thing: string = reference.things[(i + j + offset) % mod];
                if (thing !== "") {
                    output.push({
                        x: x,
                        y: y,
                        thing: thing
                    });
                }
                x += xwidth;
            }
            y += yheight;
        }

        return output;
    }

    /**
     * Macro Function used to create a body of water.
     *
     * @param reference   Settings for a Water macro.
     * @returns A body of water.
     */
    public macroWater(reference: any): any[] {
        const x: number = reference.x || 0;
        const y: number = reference.y || 0;
        const width: number = reference.width || 32;
        const height: number = reference.height || 32;
        const open: boolean[] = reference.open || [true, true, true, true];
        const output: any[] = [{
            thing: "Water",
            x: x,
            y: y,
            width: width,
            height: height
        }];

        if (!open[0]) {
            output.push({
                thing: "WaterEdgeTop",
                x: x,
                y: y,
                width: width
            });
        }

        if (!open[1]) {
            output.push({
                thing: "WaterEdgeRight",
                x: x + width - 16,
                y: open[0] ? y : y + 16,
                height: open[0] ? height : height - 16
            });
        }

        if (!open[2]) {
            output.push({
                thing: "WaterEdgeBottom",
                x: x,
                y: y + height - 16,
                width: width
            });
        }

        if (!open[3]) {
            output.push({
                thing: "WaterEdgeLeft",
                x: x,
                y: y,
                height: height
            });
        }

        return output;
    }

    /**
     * Macro Function used to create a House.
     *
     * @param reference   Settings for a House macro.
     * @returns A House.
     */
    public macroHouse(reference: any): any[] {
        const width: number = reference.width || 128;
        const stories: number = reference.stories || 1;
        const output: any[] = [];
        const x: number = reference.x || 0;
        let y: number = reference.y || 0;

        if (stories === 1) {
            output.push({
                thing: "HouseTopRoofLeft",
                x: x,
                y: y
            });
            output.push({
                thing: "HouseTopRoof",
                x: x + 32,
                y: y,
                width: width - 64
            });
            output.push({
                thing: "HouseTopRoofRight",
                x: x + width - 32,
                y: y
            });
            output.push({
                thing: "HouseLeft",
                x: x,
                y: y + 32
            });
            output.push({
                thing: "HouseRight",
                x: x + width - 32,
                y: y + 32
            });

            if (reference.door) {
                output.push({
                    thing: "HouseMiddle",
                    x: x + 64,
                    y: y + 32,
                    width: width - 96
                });
            } else {
                output.push({
                    thing: "HouseMiddle",
                    x: x + 32,
                    y: y + 32,
                    width: width - 64
                });
            }
        } else {
            output.push({
                thing: "HouseTop",
                x: x,
                y: y
            });
        }

        y += 64;
        for (let i: number = 1; i < stories; i += 1) {
            output.push({
                thing: "HouseCenterLeft",
                x: x,
                y: y
            });
            output.push({
                thing: "HouseCenterRight",
                x: x + 64,
                y: y,
                width: width - 64
            });
            y += 32;
        }

        if (reference.door) {
            const door: any = {
                thing: "Door",
                x: x + 32,
                y: y - 32,
                requireDirection: 0
            };
            if (reference.entrance) {
                door.entrance = reference.entrance;
            }
            if (reference.transport) {
                door.transport = reference.transport;
            }
            output.push(door);
        }

        return output;
    }

    /**
     * Macro Function used to create a Large House.
     *
     * @param reference   Settings for a Large House macro.
     * @returns A Large House.
     */
    public macroHouseLarge(reference: any): any[] {
        const x: number = reference.x || 0;
        let y: number = reference.y || 0;
        const width: number = reference.width || 192;
        const stories: number = reference.stories || 1;
        const doorOffset: number = reference.doorOffset || 64;
        const output: any[] = [
            {
                thing: "HouseLargeTopLeft",
                x: x,
                y: y
            }, {
                thing: "HouseLargeTopMiddle",
                x: x + 32,
                y: y,
                width: width - 64
            }, {
                thing: "HouseLargeTopRight",
                x: x + width - 32,
                y: y
            }];

        y += 80;
        for (let i: number = 2; i < stories; i += 1) {
            output.push({
                thing: "HouseLargeCenter",
                x: x,
                y: y,
                width: width
            });

            if (reference.white) {
                output.push({
                    thing: "HouseWallWhitewash",
                    x: reference.white.start,
                    y: y,
                    width: reference.white.end - reference.white.start,
                    position: "end"
                });
            }

            y += 64;
        }

        if (!reference.door) {
            output.push({
                thing: "HouseLargeCenterLeft",
                x: x,
                y: y,
                width: 64
            });
            output.push({
                thing: "HouseLargeCenterMiddle",
                x: x + 64,
                y: y,
                width: 32
            });
            output.push({
                thing: "HouseLargeCenterRight",
                x: x + 96,
                y: y,
                width: width - 96
            });
        } else {
            output.push({
                thing: "HouseLargeCenterLeft",
                x: x,
                y: y,
                width: doorOffset
            });
            output.push({
                thing: "HouseLargeCenterMiddle",
                x: x + doorOffset,
                y: y,
                width: 32,
                height: 16
            });
            output.push({
                thing: "HouseLargeCenterRight",
                x: x + doorOffset + 32,
                y: y,
                width: width - doorOffset - 32
            });
            if (reference.white) {
                output.push({
                    thing: "HouseWallWhitewash",
                    x: reference.white.start,
                    y: y,
                    width: reference.white.end - reference.white.start,
                    position: "end"
                });
            }

            y += 64;

            const door: any = {
                thing: "Door",
                x: x + doorOffset,
                y: y - 48,
                requireDirection: 0,
                id: reference.id
            };
            if (reference.entrance) {
                door.entrance = reference.entrance;
            }
            if (reference.transport) {
                door.transport = reference.transport;
            }
            output.push(door);
        }

        return output;
    }

    /**
     * Macro Function used to create a Gym.
     *
     * @param reference   Settings for a Gym macro.
     * @returns A Gym.
     */
    public macroGym(reference: any): any[] {
        const x: number = reference.x || 0;
        const y: number = reference.y || 0;
        const width: number = reference.width || 192;
        const stories: number = reference.stories || 2;

        return [
            {
                macro: "HouseLarge",
                x: x,
                y: y,
                width: width,
                stories: stories,
                white: {
                    start: x + 16,
                    end: x + width - 16
                },
                transport: reference.transport,
                entrance: reference.entrance,
                door: true,
                doorOffset: width - 64
            }, {
                thing: "GymLabel",
                x: x + 64,
                y: y + 64,
                width: width - 128
            }];
    }

    /**
     * Macro Function used to create a Building.
     *
     * @param reference   Settings for a Building macro.
     * @returns A Building.
     */
    public macroBuilding(reference: any): any[] {
        const x: number = reference.x || 0;
        let y: number = reference.y || 0;
        const width: number = reference.width || 128;
        const stories: number = reference.stories || 1;
        const doorOffset: number = reference.doorOffset || 32;
        const output: any[] = [
            {
                thing: "BuildingTopLeft",
                x: x,
                y: y
            }, {
                thing: "BuildingTopMiddle",
                x: x + 16,
                y: y,
                width: width - 32
            }, {
                thing: "BuildingTopRight",
                x: x + width - 16,
                y: y
            }];

        y += 64;

        for (let i: number = 0; i < stories; i += 1) {
            output.push({
                thing: "BuildingMiddleLeft",
                x: x,
                y: y
            });
            output.push({
                thing: "BuildingMiddleWindow",
                x: x + 16,
                y: y,
                width: width - 32,
                height: 16
            });
            output.push({
                thing: "BuildingMiddleMiddle",
                x: x + 16,
                y: y + 16,
                width: width - 32,
                height: 16
            });
            output.push({
                thing: "BuildingMiddleRight",
                x: x + width - 16,
                y: y
            });

            y += 32;
        }

        output.push({
            thing: "BuildingMiddleLeft",
            x: x,
            y: y,
            height: 16
        });
        output.push({
            thing: "BuildingMiddleRight",
            x: x + width - 16,
            y: y,
            height: 16
        });

        if (reference.door) {
            const door: any = {
                thing: "Door",
                x: x + doorOffset,
                y: y,
                entrance: reference.entrance
            };
            if (reference.entrance) {
                door.entrance = reference.entrance;
            }
            if (reference.transport) {
                door.transport = reference.transport;
            }

            output.push({
                thing: "BuildingMiddleMiddle",
                x: x + 16,
                y: y,
                height: 16,
                width: doorOffset - 16
            });
            output.push(door);
            output.push({
                thing: "BuildingMiddleMiddle",
                x: x + doorOffset + 32,
                y: y,
                height: 16,
                width: width - doorOffset - 48
            });
            output.push({
                thing: "BuildingBottomLeft",
                x: x,
                y: y + 16,
                width: doorOffset
            });
            output.push({
                thing: "BuildingBottomRight",
                x: x + doorOffset + 32,
                y: y + 16,
                width: width - doorOffset - 32
            });
        } else {
            output.push({
                thing: "BuildingMiddleMiddle",
                x: x + 16,
                y: y,
                width: width - 32,
                height: 16
            });
            output.push({
                thing: "BuildingBottom",
                x: x,
                y: y + 16,
                width: width
            });
        }

        if (reference.label) {
            output.push({
                thing: reference.label + "Label",
                x: x + 64,
                y: y
            });
        }

        return output;
    }

    /**
     * Macro Function used to create a Mountain.
     *
     * @param reference   Settings for a Mountain macro.
     * @returns A Mountain.
     */
    public macroMountain(reference: any): any[] {
        const openingOffset: number = reference.openingOffset || 32;
        const output: any[] = [];
        let x: number = reference.x || 0;
        let y: number = reference.y || 0;
        let width: number = reference.width || 32;
        let height: number = reference.height || 32;

        if (reference.right) {
            if (reference.top) {
                output.push({
                    thing: "MountainTopRight",
                    x: x + width - 32,
                    y: y
                });
                output.push({
                    thing: "MountainRight",
                    x: x + width - 32,
                    y: y + 16
                });
                output.push({
                    thing: "MountainTopRight",
                    x: x + width - 16,
                    y: y + 16
                });
            } else {
                output.push({
                    thing: "MountainRight",
                    x: x + width - 32,
                    y: y,
                    width: 32,
                    height: 32
                });
            }

            if (reference.bottom) {
                output.push({
                    thing: "MountainBottomRight",
                    x: x + width - 32,
                    y: y + height - 32
                });
                output.push({
                    thing: "MountainRight",
                    x: x + width - 16,
                    y: y + height - 32
                });
                output.push({
                    thing: "MountainBottom",
                    x: x + width - 32,
                    y: y + height - 16
                });
                output.push({
                    thing: "MountainBottomRight",
                    x: x + width - 16,
                    y: y + height - 16
                });
            } else {
                output.push({
                    thing: "MountainRight",
                    x: x + width - 32,
                    y: y + height - 32,
                    width: 32,
                    height: 32
                });
            }

            if (height > 64) {
                output.push({
                    thing: "MountainRight",
                    x: x + width - 32,
                    y: y + 32,
                    width: 32,
                    height: height - 64
                });
            }

            width -= 32;
        }

        if (reference.left) {
            if (reference.top) {
                output.push({
                    thing: "MountainTopLeft",
                    x: x + 16,
                    y: y
                });
                output.push({
                    thing: "MountainTopLeft",
                    x: x,
                    y: y + 16
                });
                output.push({
                    thing: "MountainLeft",
                    x: x + 16,
                    y: y + 16
                });
            } else {
                output.push({
                    thing: "MountainLeft",
                    x: x,
                    y: y,
                    width: 32,
                    height: 32
                });
            }

            if (reference.bottom) {
                output.push({
                    thing: "MountainLeft",
                    x: x,
                    y: y + height - 32
                });
                output.push({
                    thing: "MountainBottomLeft",
                    x: x + 16,
                    y: y + height - 32
                });
                output.push({
                    thing: "MountainBottomLeft",
                    x: x,
                    y: y + height - 16
                });
                output.push({
                    thing: "MountainBottom",
                    x: x + 16,
                    y: y + height - 16
                });
            } else {
                output.push({
                    thing: "MountainLeft",
                    x: x,
                    y: y + height - 32,
                    width: 32,
                    height: 32
                });
            }

            if (height > 64) {
                output.push({
                    thing: "MountainLeft",
                    x: x,
                    y: y + 32,
                    width: 32,
                    height: height - 64
                });
            }

            width -= 32;
            x += 32;
        }

        if (reference.top && width > 0) {
            output.push({
                thing: "MountainTop",
                x: x,
                y: y,
                width: width
            });
            y += 20;
            height -= 20;
        }

        if (reference.bottom && width > 0) {
            if (reference.opening) {
                if (openingOffset > 0) {
                    output.push({
                        thing: "MountainBottom",
                        x: x,
                        y: y + height - 32,
                        width: openingOffset,
                        height: 32
                    });
                }
                output.push({
                    thing: "CaveOpening",
                    x: x + openingOffset,
                    y: y + height - 32,
                    entrance: reference.entrance,
                    transport: reference.transport
                });
                if (openingOffset < width) {
                    output.push({
                        thing: "MountainBottom",
                        x: x + openingOffset + 32,
                        y: y + height - 32,
                        width: width - openingOffset - 32,
                        height: 32
                    });
                }
            } else {
                output.push({
                    thing: "MountainBottom",
                    x: x,
                    y: y + height - 32,
                    width: width,
                    height: 32
                });
            }
            height -= 32;
        }

        if (width > 0 && height > 0) {
            output.push({
                thing: "Mountain",
                x: x,
                y: y,
                width: width,
                height: height
            });
        }

        return output;
    }

    /**
     * Macro Function used to create a Pokemon Center.
     *
     * @param reference   Settings for a Pokemon Center macro.
     * @returns A Pokemon Center.
     */
    public macroPokeCenter(reference: any): any[] {
        const x: number = reference.x || 0;
        const y: number = reference.y || 0;
        const output: any = [
            {
                thing: "FloorDiamonds",
                width: 448,
                height: 256,
                x: x,
                y: y
            }, {
                thing: "SquareWallTop",
                x: x,
                y: y,
                height: 64
            }, {
                thing: "HealingMachine",
                x: x + 32,
                y: y,
                id: "HealingMachine"
            }, {
                thing: "WallIndoorHorizontalBandsDark",
                x: x + 32,
                y: y,
                width: 128
            }, {
                thing: "PokeCenterPoster",
                x: x + 112,
                y: y
            }, {
                thing: "SquareWallTop",
                x: x + 160,
                y: y,
                height: 64
            }, {
                thing: "WallIndoorHorizontalBandsDark",
                x: x + 192,
                y: y,
                width: 128
            }, {
                thing: "StairsVertical",
                x: x + 320,
                y: y
            }, {
                thing: "WallIndoorHorizontalBandsDark",
                x: x + 352,
                y: y
            }, {
                thing: "StairsVertical",
                x: x + 384,
                y: y
            }, {
                thing: "WallIndoorHorizontalBandsDark",
                x: x + 416,
                y: y
            }, {
                thing: "Nurse",
                id: "Nurse",
                x: x + 96,
                y: y + 32
            }, {
                thing: "SquareWallFront",
                x: x,
                y: y + 64
            }, {
                thing: "PokeCenterDeskLeft",
                x: x + 32,
                y: y + 64
            }, {
                thing: "PokeCenterDesk",
                x: x + 48,
                y: y + 64,
                width: 128
            }, {
                thing: "CutsceneResponder",
                x: x + 96,
                y: y + 64,
                cutscene: "PokeCenter",
                keepAlive: true
            }, {
                thing: "SquareWallFront",
                x: x + 160,
                y: y + 64
            }, {
                thing: "PokeCenterDesk",
                x: x + 192,
                y: y + 64,
                width: 128
            }, {
                thing: "PokeCenterDeskBlocker",
                x: x + 320,
                y: y + 64
            }, {
                thing: "DeskWoman",
                x: x + 352,
                y: y + 64,
                dialog: [
                    "Welcome to the Cable Club!",
                    "This area is reserved for 2 friends who are linked by cable."
                ]
            }, {
                thing: "PokeCenterDeskBlocker",
                x: x + 384,
                y: y + 64
            }, {
                thing: "PokeCenterDesk",
                x: x + 416,
                y: y + 64
            }, {
                thing: "Buzzer",
                x: x + 112,
                y: y + 76
            }, {
                thing: "Computer",
                x: x + 416,
                y: y + 96
            }, {
                thing: "SofaLeft",
                x: x,
                y: y + 128
            }, {
                thing: "PottedPalmTree",
                x: x,
                y: y + 192,
                width: 64
            }, {
                thing: "PottedPalmTree",
                x: x + 192,
                y: y + 192,
                width: 64
            }, {
                thing: "PottedPalmTree",
                x: x + 384,
                y: y + 192,
                width: 64
            }, {
                thing: "Doormat",
                x: x + 96,
                y: y + 224,
                width: 64,
                entrance: reference.entrance
            }];

        if (reference.transport) {
            output.push({
                thing: "HiddenTransporter",
                x: x + 96,
                y: y + 224,
                width: 64,
                transport: reference.transport,
                requireDirection: 2
            });
        }

        if (!reference.excludeCoolTrainer) {
            output.push({
                thing: "CoolTrainerM",
                x: x,
                y: y + 128,
                offsetX: 7,
                offsetY: 0,
                direction: 1,
                sitting: true,
                dialogDirections: true,
                dialog: reference.coolTrainerDialog || [
                    "",
                    "%%%%%%%POKEMON%%%%%%% CENTERs heal your tired, hurt, or fainted %%%%%%%POKEMON%%%%%%%!",
                    "",
                    ""
                ]
            });
        }

        return output;
    }

    /**
     * Macro Function used to create a PokeMart.
     *
     * @param reference   Settings for a PokeMart macro.
     * @returns A PokeMart.
     */
    public macroPokeMart(reference: any): any[] {
        const x: number = reference.x || 0;
        const y: number = reference.y || 0;
        const output: any[] = [
            {
                thing: "WallIndoorHorizontalBandsDark",
                x: x,
                y: y,
                width: 64,
                height: 16
            }, {
                thing: "FloorDiamonds",
                x: x,
                y: y + 32,
                width: 256,
                height: 224
            }, {
                thing: "FloorDiamondsDark",
                x: x,
                y: y + 64,
                height: 32
            }, {
                thing: "StoreFridge",
                x: x + 64,
                y: y,
                width: 128
            }, {
                thing: "WallIndoorHorizontalBandsDark",
                x: x + 192,
                y: y,
                width: 64,
                height: 16
            }, {
                thing: "StoreSaleBin",
                x: x,
                y: y + 16,
                width: 64
            }, {
                thing: "StoreSaleBin",
                x: x + 192,
                y: y + 16,
                width: 64
            }, {
                thing: "StoreAisle",
                x: x,
                y: y + 96,
                height: 32
            }, {
                thing: "StoreAisle",
                x: x + 128,
                y: y + 96,
                width: 128
            }, {
                thing: "WallIndoorHorizontalBandsDark",
                x: x,
                y: y + 128
            }, {
                thing: "WallIndoorHorizontalBandsDark",
                x: x + 32,
                y: y + 128,
                height: 16
            }, {
                thing: "FloorDiamondsDark",
                x: x + 64,
                y: y + 128,
                height: 96
            }, {
                thing: "SquareWallTop",
                x: x + 32,
                y: y + 144,
                height: 64
            }, {
                thing: "Cashier",
                x: x,
                y: y + 160,
                direction: 1
            }, {
                thing: "FloorDiamondsDark",
                x: x,
                y: y + 160
            }, {
                thing: "Register",
                x: x + 32,
                y: y + 160,
                id: reference.responderId,
                activate: this.gameStarter.actions.activateCutsceneResponder,
                cutscene: "PokeMart",
                keepAlive: true,
                items: reference.items,
                dialog: reference.responderDialog
            }, {
                thing: "PokeCenterDeskLeft",
                x: x,
                y: y + 192
            }, {
                thing: "PokeCenterDesk",
                x: x + 16,
                y: y + 192,
                width: 48
            }, {
                thing: "FloorDiamondsDark",
                x: x,
                y: y + 224
            }, {
                thing: "Doormat",
                x: x + 96,
                y: y + 224,
                width: 64,
                entrance: reference.entrance
            }];

        if (reference.transport) {
            output.push({
                thing: "HiddenTransporter",
                x: x + 96,
                y: y + 224,
                width: 64,
                transport: reference.transport,
                requireDirection: 2
            });
        }

        return output;
    }
}
