/// <reference path="../typings/EightBittr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";

/**
 * Macro functions used by FullScreenPokemon instances.
 */
export class Macros<TEightBittr extends FullScreenPokemon> extends EightBittr.Component<TEightBittr> {
    /**
     * Macro Function used to create an alternating pattern of Things.
     *
     * @param reference   Settings for a Checkered macro.
     * @returns A checkered pattern of Things.
     */
    public macroCheckered(reference: any): any[] {
        let xStart: number = reference.x || 0,
            yStart: number = reference.y || 0,
            xnum: number = reference.xnum || 1,
            ynum: number = reference.ynum || 1,
            xwidth: number = reference.xwidth || 8,
            yheight: number = reference.yheight || 8,
            offset: number = reference.offset || 0,
            things: string[] = reference.things,
            mod: number = things.length,
            output: any[] = [],
            y: number;

        y = yStart;
        for (let i: number = 0; i < ynum; i += 1) {
            let x: number = xStart;
            for (let j: number = 0; j < xnum; j += 1) {
                let thing: string = reference.things[(i + j + offset) % mod];
                if (thing !== "") {
                    output.push({
                        "x": x,
                        "y": y,
                        "thing": thing
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
        let x: number = reference.x || 0,
            y: number = reference.y || 0,
            width: number = reference.width || 8,
            height: number = reference.height || 8,
            open: boolean[] = reference.open || [true, true, true, true],
            output: any[] = [{
                "thing": "Water",
                "x": x,
                "y": y,
                "width": width,
                "height": height
            }];

        if (!open[0]) {
            output.push({
                "thing": "WaterEdgeTop",
                "x": x,
                "y": y,
                "width": width
            });
        }

        if (!open[1]) {
            output.push({
                "thing": "WaterEdgeRight",
                "x": x + width - 4,
                "y": open[0] ? y : y + 4,
                "height": open[0] ? height : height - 4
            });
        }

        if (!open[2]) {
            output.push({
                "thing": "WaterEdgeBottom",
                "x": x,
                "y": y + height - 4,
                "width": width
            });
        }

        if (!open[3]) {
            output.push({
                "thing": "WaterEdgeLeft",
                "x": x,
                "y": y,
                "height": height
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
        let x: number = reference.x || 0,
            y: number = reference.y || 0,
            width: number = reference.width || 32,
            stories: number = reference.stories || 1,
            output: any[] = [];

        if (stories === 1) {
            output.push({
                "thing": "HouseTopRoofLeft",
                "x": x,
                "y": y
            });
            output.push({
                "thing": "HouseTopRoof",
                "x": x + 8,
                "y": y,
                "width": width - 16
            });
            output.push({
                "thing": "HouseTopRoofRight",
                "x": x + width - 8,
                "y": y
            });
            output.push({
                "thing": "HouseLeft",
                "x": x,
                "y": y + 8
            });
            output.push({
                "thing": "HouseRight",
                "x": x + width - 8,
                "y": y + 8
            });

            if (reference.door) {
                output.push({
                    "thing": "HouseMiddle",
                    "x": x + 16,
                    "y": y + 8,
                    "width": width - 24
                });
            } else {
                output.push({
                    "thing": "HouseMiddle",
                    "x": x + 8,
                    "y": y + 8,
                    "width": width - 16
                });
            }
        } else {
            output.push({
                "thing": "HouseTop",
                "x": x,
                "y": y
            });
        }

        y += 16;
        for (let i: number = 1; i < stories; i += 1) {
            output.push({
                "thing": "HouseCenterLeft",
                "x": x,
                "y": y
            });
            output.push({
                "thing": "HouseCenterRight",
                "x": x + 16,
                "y": y,
                "width": width - 16
            });
            y += 8;
        }

        if (reference.door) {
            let door: any = {
                "thing": "Door",
                "x": x + 8,
                "y": y - 8,
                "requireDirection": 0
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
        let x: number = reference.x || 0,
            y: number = reference.y || 0,
            width: number = reference.width || 48,
            stories: number = reference.stories || 1,
            doorOffset: number = reference.doorOffset || 16,
            output: any[] = [
                {
                    "thing": "HouseLargeTopLeft",
                    "x": x,
                    "y": y
                }, {
                    "thing": "HouseLargeTopMiddle",
                    "x": x + 8,
                    "y": y,
                    "width": width - 16
                }, {
                    "thing": "HouseLargeTopRight",
                    "x": x + width - 8,
                    "y": y
                }];

        y += 20;
        for (let i: number = 2; i < stories; i += 1) {
            output.push({
                "thing": "HouseLargeCenter",
                "x": x,
                "y": y,
                "width": width
            });

            if (reference.white) {
                output.push({
                    "thing": "HouseWallWhitewash",
                    "x": reference.white.start,
                    "y": y,
                    "width": reference.white.end - reference.white.start,
                    "position": "end"
                });
            }

            y += 16;
        }

        if (!reference.door) {
            output.push({
                "thing": "HouseLargeCenterLeft",
                "x": x,
                "y": y,
                "width": 16
            });
            output.push({
                "thing": "HouseLargeCenterMiddle",
                "x": x + 16,
                "y": y,
                "width": 8
            });
            output.push({
                "thing": "HouseLargeCenterRight",
                "x": x + 24,
                "y": y,
                "width": width - 24
            });
        } else {
            output.push({
                "thing": "HouseLargeCenterLeft",
                "x": x,
                "y": y,
                "width": doorOffset
            });
            output.push({
                "thing": "HouseLargeCenterMiddle",
                "x": x + doorOffset,
                "y": y,
                "width": 8,
                "height": 4
            });
            output.push({
                "thing": "HouseLargeCenterRight",
                "x": x + doorOffset + 8,
                "y": y,
                "width": width - doorOffset - 8
            });
            if (reference.white) {
                output.push({
                    "thing": "HouseWallWhitewash",
                    "x": reference.white.start,
                    "y": y,
                    "width": reference.white.end - reference.white.start,
                    "position": "end"
                });
            }

            y += 16;

            let door: any = {
                "thing": "Door",
                "x": x + doorOffset,
                "y": y - 12,
                "requireDirection": 0,
                "id": reference.id
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
        let x: number = reference.x || 0,
            y: number = reference.y || 0,
            width: number = reference.width || 48,
            stories: number = reference.stories || 2,
            output: any[] = [
                {
                    "macro": "HouseLarge",
                    "x": x,
                    "y": y,
                    "width": width,
                    "stories": stories,
                    "white": {
                        "start": x + 4,
                        "end": x + width - 4
                    },
                    "transport": reference.transport,
                    "entrance": reference.entrance,
                    "door": true,
                    "doorOffset": width - 16
                }, {
                    "thing": "GymLabel",
                    "x": x + 16,
                    "y": y + 16,
                    "width": width - 32
                }];

        return output;
    }

    /**
     * Macro Function used to create a Building.
     *
     * @param reference   Settings for a Building macro.
     * @returns A Building.
     */
    public macroBuilding(reference: any): any[] {
        let x: number = reference.x || 0,
            y: number = reference.y || 0,
            width: number = reference.width || 32,
            stories: number = reference.stories || 1,
            doorOffset: number = reference.doorOffset || 8,
            output: any[] = [
                {
                    "thing": "BuildingTopLeft",
                    "x": x,
                    "y": y
                }, {
                    "thing": "BuildingTopMiddle",
                    "x": x + 4,
                    "y": y,
                    "width": width - 8
                }, {
                    "thing": "BuildingTopRight",
                    "x": x + width - 4,
                    "y": y
                }];

        y += 16;

        for (let i: number = 0; i < stories; i += 1) {
            output.push({
                "thing": "BuildingMiddleLeft",
                "x": x,
                "y": y
            });
            output.push({
                "thing": "BuildingMiddleWindow",
                "x": x + 4,
                "y": y,
                "width": width - 8,
                "height": 4
            });
            output.push({
                "thing": "BuildingMiddleMiddle",
                "x": x + 4,
                "y": y + 4,
                "width": width - 8,
                "height": 4
            });
            output.push({
                "thing": "BuildingMiddleRight",
                "x": x + width - 4,
                "y": y
            });

            y += 8;
        }

        output.push({
            "thing": "BuildingMiddleLeft",
            "x": x,
            "y": y,
            "height": 4
        });
        output.push({
            "thing": "BuildingMiddleRight",
            "x": x + width - 4,
            "y": y,
            "height": 4
        });

        if (reference.door) {
            let door: any = {
                "thing": "Door",
                "x": x + doorOffset,
                "y": y,
                "entrance": reference.entrance
            };
            if (reference.entrance) {
                door.entrance = reference.entrance;
            }
            if (reference.transport) {
                door.transport = reference.transport;
            }

            output.push({
                "thing": "BuildingMiddleMiddle",
                "x": x + 4,
                "y": y,
                "height": 4,
                "width": doorOffset - 4
            });
            output.push(door);
            output.push({
                "thing": "BuildingMiddleMiddle",
                "x": x + doorOffset + 8,
                "y": y,
                "height": 4,
                "width": width - doorOffset - 12
            });
            output.push({
                "thing": "BuildingBottomLeft",
                "x": x,
                "y": y + 4,
                "width": doorOffset
            });
            output.push({
                "thing": "BuildingBottomRight",
                "x": x + doorOffset + 8,
                "y": y + 4,
                "width": width - doorOffset - 8
            });
        } else {
            output.push({
                "thing": "BuildingMiddleMiddle",
                "x": x + 4,
                "y": y,
                "width": width - 8,
                "height": 4
            });
            output.push({
                "thing": "BuildingBottom",
                "x": x,
                "y": y + 4,
                "width": width
            });
        }

        if (reference.label) {
            output.push({
                "thing": reference.label + "Label",
                "x": x + 16,
                "y": y
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
        let x: number = reference.x || 0,
            y: number = reference.y || 0,
            width: number = reference.width || 8,
            height: number = reference.height || 8,
            openingOffset: number = reference.openingOffset || 8,
            output: any[] = [];

        if (reference.right) {
            if (reference.top) {
                output.push({
                    "thing": "MountainTopRight",
                    "x": x + width - 8,
                    "y": y
                });
                output.push({
                    "thing": "MountainRight",
                    "x": x + width - 8,
                    "y": y + 4
                });
                output.push({
                    "thing": "MountainTopRight",
                    "x": x + width - 4,
                    "y": y + 4
                });
            } else {
                output.push({
                    "thing": "MountainRight",
                    "x": x + width - 8,
                    "y": y,
                    "width": 8,
                    "height": 8
                });
            }

            if (reference.bottom) {
                output.push({
                    "thing": "MountainBottomRight",
                    "x": x + width - 8,
                    "y": y + height - 8
                });
                output.push({
                    "thing": "MountainRight",
                    "x": x + width - 4,
                    "y": y + height - 8
                });
                output.push({
                    "thing": "MountainBottom",
                    "x": x + width - 8,
                    "y": y + height - 4
                });
                output.push({
                    "thing": "MountainBottomRight",
                    "x": x + width - 4,
                    "y": y + height - 4
                });
            } else {
                output.push({
                    "thing": "MountainRight",
                    "x": x + width - 8,
                    "y": y + height - 8,
                    "width": 8,
                    "height": 8
                });
            }

            if (height > 16) {
                output.push({
                    "thing": "MountainRight",
                    "x": x + width - 8,
                    "y": y + 8,
                    "width": 8,
                    "height": height - 16
                });
            }

            width -= 8;
        }

        if (reference.left) {
            if (reference.top) {
                output.push({
                    "thing": "MountainTopLeft",
                    "x": x + 4,
                    "y": y
                });
                output.push({
                    "thing": "MountainTopLeft",
                    "x": x,
                    "y": y + 4
                });
                output.push({
                    "thing": "MountainLeft",
                    "x": x + 4,
                    "y": y + 4
                });
            } else {
                output.push({
                    "thing": "MountainLeft",
                    "x": x,
                    "y": y,
                    "width": 8,
                    "height": 8
                });
            }

            if (reference.bottom) {
                output.push({
                    "thing": "MountainLeft",
                    "x": x,
                    "y": y + height - 8
                });
                output.push({
                    "thing": "MountainBottomLeft",
                    "x": x + 4,
                    "y": y + height - 8
                });
                output.push({
                    "thing": "MountainBottomLeft",
                    "x": x,
                    "y": y + height - 4
                });
                output.push({
                    "thing": "MountainBottom",
                    "x": x + 4,
                    "y": y + height - 4
                });
            } else {
                output.push({
                    "thing": "MountainLeft",
                    "x": x,
                    "y": y + height - 8,
                    "width": 8,
                    "height": 8
                });
            }

            if (height > 16) {
                output.push({
                    "thing": "MountainLeft",
                    "x": x,
                    "y": y + 8,
                    "width": 8,
                    "height": height - 16
                });
            }

            width -= 8;
            x += 8;
        }

        if (reference.top && width > 0) {
            output.push({
                "thing": "MountainTop",
                "x": x,
                "y": y,
                "width": width
            });
            y += 5;
            height -= 5;
        }

        if (reference.bottom && width > 0) {
            if (reference.opening) {
                if (openingOffset > 0) {
                    output.push({
                        "thing": "MountainBottom",
                        "x": x,
                        "y": y + height - 8,
                        "width": openingOffset,
                        "height": 8
                    });
                }
                output.push({
                    "thing": "CaveOpening",
                    "x": x + openingOffset,
                    "y": y + height - 8,
                    "entrance": reference.entrance,
                    "transport": reference.transport
                });
                if (openingOffset < width) {
                    output.push({
                        "thing": "MountainBottom",
                        "x": x + openingOffset + 8,
                        "y": y + height - 8,
                        "width": width - openingOffset - 8,
                        "height": 8
                    });
                }
            } else {
                output.push({
                    "thing": "MountainBottom",
                    "x": x,
                    "y": y + height - 8,
                    "width": width,
                    "height": 8
                });
            }
            height -= 8;
        }

        if (width > 0 && height > 0) {
            output.push({
                "thing": "Mountain",
                "x": x,
                "y": y,
                "width": width,
                "height": height
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
        let x: number = reference.x || 0,
            y: number = reference.y || 0,
            output: any = [
                {
                    "thing": "FloorDiamonds",
                    "width": 112,
                    "height": 64,
                    "x": x,
                    "y": y
                }, {
                    "thing": "SquareWallTop",
                    "x": x,
                    "y": y,
                    "height": 16
                }, {
                    "thing": "HealingMachine",
                    "x": x + 8,
                    "y": y,
                    "id": "HealingMachine"
                }, {
                    "thing": "WallIndoorHorizontalBandsDark",
                    "x": x + 8,
                    "y": y,
                    "width": 32
                }, {
                    "thing": "PokeCenterPoster",
                    "x": x + 28,
                    "y": y
                }, {
                    "thing": "SquareWallTop",
                    "x": x + 40,
                    "y": y,
                    "height": 16
                }, {
                    "thing": "WallIndoorHorizontalBandsDark",
                    "x": x + 48,
                    "y": y,
                    "width": 32
                }, {
                    "thing": "StairsVertical",
                    "x": x + 80,
                    "y": y
                }, {
                    "thing": "WallIndoorHorizontalBandsDark",
                    "x": x + 88,
                    "y": y
                }, {
                    "thing": "StairsVertical",
                    "x": x + 96,
                    "y": y
                }, {
                    "thing": "WallIndoorHorizontalBandsDark",
                    "x": x + 104,
                    "y": y
                }, {
                    "thing": "Nurse",
                    "id": "Nurse",
                    "x": x + 24,
                    "y": y + 8
                }, {
                    "thing": "SquareWallFront",
                    "x": x,
                    "y": y + 16
                }, {
                    "thing": "PokeCenterDeskLeft",
                    "x": x + 8,
                    "y": y + 16
                }, {
                    "thing": "PokeCenterDesk",
                    "x": x + 12,
                    "y": y + 16,
                    "width": 32
                }, {
                    "thing": "CutsceneResponder",
                    "x": x + 24,
                    "y": y + 16,
                    "cutscene": "PokeCenter",
                    "keepAlive": true
                }, {
                    "thing": "SquareWallFront",
                    "x": x + 40,
                    "y": y + 16
                }, {
                    "thing": "PokeCenterDesk",
                    "x": x + 48,
                    "y": y + 16,
                    "width": 32
                }, {
                    "thing": "PokeCenterDeskBlocker",
                    "x": x + 80,
                    "y": y + 16
                }, {
                    "thing": "DeskWoman",
                    "x": x + 88,
                    "y": y + 16,
                    "dialog": [
                        "Welcome to the Cable Club!",
                        "This area is reserved for 2 friends who are linked by cable."
                    ]
                }, {
                    "thing": "PokeCenterDeskBlocker",
                    "x": x + 96,
                    "y": y + 16
                }, {
                    "thing": "PokeCenterDesk",
                    "x": x + 104,
                    "y": y + 16
                }, {
                    "thing": "Buzzer",
                    "x": x + 28,
                    "y": y + 19
                }, {
                    "thing": "Computer",
                    "x": x + 104,
                    "y": y + 24
                }, {
                    "thing": "SofaLeft",
                    "x": x,
                    "y": y + 32
                }, {
                    "thing": "PottedPalmTree",
                    "x": x,
                    "y": y + 48,
                    "width": 16
                }, {
                    "thing": "PottedPalmTree",
                    "x": x + 48,
                    "y": y + 48,
                    "width": 16
                }, {
                    "thing": "PottedPalmTree",
                    "x": x + 96,
                    "y": y + 48,
                    "width": 16
                }, {
                    "thing": "Doormat",
                    "x": x + 24,
                    "y": y + 56,
                    "width": 16,
                    "entrance": reference.entrance
                }];

        if (reference.transport) {
            output.push({
                "thing": "HiddenTransporter",
                "x": x + 24,
                "y": y + 56,
                "width": 16,
                "transport": reference.transport,
                "requireDirection": 2
            });
        }

        if (!reference.excludeCoolTrainer) {
            output.push({
                "thing": "CoolTrainerM",
                "x": x,
                "y": y + 32,
                "offsetX": FullScreenPokemon.unitsize * 1.75,
                "offsetY": 0,
                "direction": 1,
                "sitting": true,
                "dialogDirections": true,
                "dialog": reference.coolTrainerDialog || [
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
        let x: number = reference.x || 0,
            y: number = reference.y || 0,
            output: any[] = [
                {
                    "thing": "WallIndoorHorizontalBandsDark",
                    "x": x,
                    "y": y,
                    "width": 16,
                    "height": 4
                }, {
                    "thing": "FloorDiamonds",
                    "x": x,
                    "y": y + 8,
                    "width": 64,
                    "height": 56
                }, {
                    "thing": "FloorDiamondsDark",
                    "x": x,
                    "y": y + 16,
                    "height": 8
                }, {
                    "thing": "StoreFridge",
                    "x": x + 16,
                    "y": y,
                    "width": 32
                }, {
                    "thing": "WallIndoorHorizontalBandsDark",
                    "x": x + 48,
                    "y": y,
                    "width": 16,
                    "height": 4
                }, {
                    "thing": "StoreSaleBin",
                    "x": x,
                    "y": y + 4,
                    "width": 16
                }, {
                    "thing": "StoreSaleBin",
                    "x": x + 48,
                    "y": y + 4,
                    "width": 16
                }, {
                    "thing": "StoreAisle",
                    "x": x,
                    "y": y + 24,
                    "height": 8
                }, {
                    "thing": "StoreAisle",
                    "x": x + 32,
                    "y": y + 24,
                    "width": 32
                }, {
                    "thing": "WallIndoorHorizontalBandsDark",
                    "x": x,
                    "y": y + 32
                }, {
                    "thing": "WallIndoorHorizontalBandsDark",
                    "x": x + 8,
                    "y": y + 32,
                    "height": 4
                }, {
                    "thing": "FloorDiamondsDark",
                    "x": x + 16,
                    "y": y + 32,
                    "height": 24
                }, {
                    "thing": "SquareWallTop",
                    "x": x + 8,
                    "y": y + 36,
                    "height": 16
                }, {
                    "thing": "Cashier",
                    "x": x,
                    "y": y + 40,
                    "direction": 1
                }, {
                    "thing": "FloorDiamondsDark",
                    "x": x,
                    "y": y + 40
                }, {
                    "thing": "Register",
                    "x": x + 8,
                    "y": y + 40,
                    "id": reference.responderId,
                    "activate": FullScreenPokemon.prototype.activateCutsceneResponder,
                    "cutscene": "PokeMart",
                    "keepAlive": true,
                    "items": reference.items,
                    "dialog": reference.responderDialog
                }, {
                    "thing": "PokeCenterDeskLeft",
                    "x": x,
                    "y": y + 48
                }, {
                    "thing": "PokeCenterDesk",
                    "x": x + 4,
                    "y": y + 48,
                    "width": 12
                }, {
                    "thing": "FloorDiamondsDark",
                    "x": x,
                    "y": y + 56
                }, {
                    "thing": "Doormat",
                    "x": x + 24,
                    "y": y + 56,
                    "width": 16,
                    "entrance": reference.entrance
                }];

        if (reference.transport) {
            output.push({
                "thing": "HiddenTransporter",
                "x": x + 24,
                "y": y + 56,
                "width": 16,
                "transport": reference.transport,
                "requireDirection": 2
            });
        }

        return output;
    }
}
