import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Map creation macros.
 */
export class MapMacros extends Section<FullScreenPokemon> {
    /**
     * Macro Function used to create an alternating pattern of Actors.
     *
     * @param reference   Settings for a Checkered macro.
     * @returns A checkered pattern of Actors.
     */
    public macroCheckered = (reference: any): any[] => {
        const xStart: number = reference.x || 0;
        const yStart: number = reference.y || 0;
        const xnum: number = reference.xnum || 1;
        const ynum: number = reference.ynum || 1;
        const xwidth: number = reference.xwidth || 32;
        const yheight: number = reference.yheight || 32;
        const offset: number = reference.offset || 0;
        const actors: string[] = reference.actors;
        const mod: number = actors.length;
        const output: any[] = [];
        let y: number;

        y = yStart;
        for (let i = 0; i < ynum; i += 1) {
            let x: number = xStart;
            for (let j = 0; j < xnum; j += 1) {
                const actor: string = reference.actors[(i + j + offset) % mod];
                if (actor !== "") {
                    output.push({
                        x,
                        y,
                        actor,
                    });
                }
                x += xwidth;
            }
            y += yheight;
        }

        return output;
    };

    /**
     * Macro Function used to create a body of water.
     *
     * @param reference   Settings for a Water macro.
     * @returns A body of water.
     */
    public macroWater = (reference: any): any[] => {
        const x: number = reference.x || 0;
        const y: number = reference.y || 0;
        const width: number = reference.width || 32;
        const height: number = reference.height || 32;
        const open: boolean[] = reference.open || [true, true, true, true];
        const output: any[] = [
            {
                actor: "Water",
                x,
                y,
                width,
                height,
            },
        ];

        if (!open[0]) {
            output.push({
                actor: "WaterEdgeTop",
                x,
                y,
                width,
            });
        }

        if (!open[1]) {
            output.push({
                actor: "WaterEdgeRight",
                x: x + width - 16,
                y: open[0] ? y : y + 16,
                height: open[0] ? height : height - 16,
            });
        }

        if (!open[2]) {
            output.push({
                actor: "WaterEdgeBottom",
                x,
                y: y + height - 16,
                width,
            });
        }

        if (!open[3]) {
            output.push({
                actor: "WaterEdgeLeft",
                x,
                y,
                height,
            });
        }

        return output;
    };

    /**
     * Macro Function used to create a House.
     *
     * @param reference   Settings for a House macro.
     * @returns A House.
     */
    public macroHouse = (reference: any): any[] => {
        const width: number = reference.width || 128;
        const stories: number = reference.stories || 1;
        const output: any[] = [];
        const x: number = reference.x || 0;
        let y: number = reference.y || 0;

        if (stories === 1) {
            output.push({
                actor: "HouseTopRoofLeft",
                x,
                y,
            });
            output.push({
                actor: "HouseTopRoof",
                x: x + 32,
                y,
                width: width - 64,
            });
            output.push({
                actor: "HouseTopRoofRight",
                x: x + width - 32,
                y,
            });
            output.push({
                actor: "HouseLeft",
                x,
                y: y + 32,
            });
            output.push({
                actor: "HouseRight",
                x: x + width - 32,
                y: y + 32,
            });

            if (reference.door) {
                output.push({
                    actor: "HouseMiddle",
                    x: x + 64,
                    y: y + 32,
                    width: width - 96,
                });
            } else {
                output.push({
                    actor: "HouseMiddle",
                    x: x + 32,
                    y: y + 32,
                    width: width - 64,
                });
            }
        } else {
            output.push({
                actor: "HouseTop",
                x,
                y,
            });
        }

        y += 64;
        for (let i = 1; i < stories; i += 1) {
            output.push({
                actor: "HouseCenterLeft",
                x,
                y,
            });
            output.push({
                actor: "HouseCenterRight",
                x: x + 64,
                y,
                width: width - 64,
            });
            y += 32;
        }

        if (reference.door) {
            const door: any = {
                actor: "Door",
                x: x + 32,
                y: y - 32,
                requireDirection: 0,
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
    };

    /**
     * Macro Function used to create a Large House.
     *
     * @param reference   Settings for a Large House macro.
     * @returns A Large House.
     */
    public macroHouseLarge = (reference: any): any[] => {
        const x: number = reference.x || 0;
        let y: number = reference.y || 0;
        const width: number = reference.width || 192;
        const stories: number = reference.stories || 1;
        const doorOffset: number = reference.doorOffset || 64;
        const output: any[] = [
            {
                actor: "HouseLargeTopLeft",
                x,
                y,
            },
            {
                actor: "HouseLargeTopMiddle",
                x: x + 32,
                y,
                width: width - 64,
            },
            {
                actor: "HouseLargeTopRight",
                x: x + width - 32,
                y,
            },
        ];

        y += 80;
        for (let i = 2; i < stories; i += 1) {
            output.push({
                actor: "HouseLargeCenter",
                x,
                y,
                width,
            });

            if (reference.white) {
                output.push({
                    actor: "HouseWallWhitewash",
                    x: reference.white.start,
                    y,
                    width: reference.white.end - reference.white.start,
                    position: "end",
                });
            }

            y += 64;
        }

        if (!reference.door) {
            output.push({
                actor: "HouseLargeCenterLeft",
                x,
                y,
                width: 64,
            });
            output.push({
                actor: "HouseLargeCenterMiddle",
                x: x + 64,
                y,
                width: 32,
            });
            output.push({
                actor: "HouseLargeCenterRight",
                x: x + 96,
                y,
                width: width - 96,
            });
        } else {
            output.push({
                actor: "HouseLargeCenterLeft",
                x,
                y,
                width: doorOffset,
            });
            output.push({
                actor: "HouseLargeCenterMiddle",
                x: x + doorOffset,
                y,
                width: 32,
                height: 16,
            });
            output.push({
                actor: "HouseLargeCenterRight",
                x: x + doorOffset + 32,
                y,
                width: width - doorOffset - 32,
            });
            if (reference.white) {
                output.push({
                    actor: "HouseWallWhitewash",
                    x: reference.white.start,
                    y,
                    width: reference.white.end - reference.white.start,
                    position: "end",
                });
            }

            y += 64;

            const door: any = {
                actor: "Door",
                x: x + doorOffset,
                y: y - 48,
                requireDirection: 0,
                id: reference.id,
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
    };

    /**
     * Macro Function used to create a Gym.
     *
     * @param reference   Settings for a Gym macro.
     * @returns A Gym.
     */
    public macroGym = (reference: any): any[] => {
        const x: number = reference.x || 0;
        const y: number = reference.y || 0;
        const width: number = reference.width || 192;
        const stories: number = reference.stories || 2;

        return [
            {
                macro: "HouseLarge",
                x,
                y,
                width,
                stories,
                white: {
                    start: x + 16,
                    end: x + width - 16,
                },
                transport: reference.transport,
                entrance: reference.entrance,
                door: true,
                doorOffset: width - 64,
            },
            {
                actor: "GymLabel",
                x: x + 64,
                y: y + 64,
                width: width - 128,
            },
        ];
    };

    /**
     * Macro Function used to create a Building.
     *
     * @param reference   Settings for a Building macro.
     * @returns A Building.
     */
    public macroBuilding = (reference: any): any[] => {
        const x: number = reference.x || 0;
        let y: number = reference.y || 0;
        const width: number = reference.width || 128;
        const stories: number = reference.stories || 1;
        const doorOffset: number = reference.doorOffset || 32;
        const output: any[] = [
            {
                actor: "BuildingTopLeft",
                x,
                y,
            },
            {
                actor: "BuildingTopMiddle",
                x: x + 16,
                y,
                width: width - 32,
            },
            {
                actor: "BuildingTopRight",
                x: x + width - 16,
                y,
            },
        ];

        y += 64;

        for (let i = 0; i < stories; i += 1) {
            output.push({
                actor: "BuildingMiddleLeft",
                x,
                y,
            });
            output.push({
                actor: "BuildingMiddleWindow",
                x: x + 16,
                y,
                width: width - 32,
                height: 16,
            });
            output.push({
                actor: "BuildingMiddleMiddle",
                x: x + 16,
                y: y + 16,
                width: width - 32,
                height: 16,
            });
            output.push({
                actor: "BuildingMiddleRight",
                x: x + width - 16,
                y,
            });

            y += 32;
        }

        output.push({
            actor: "BuildingMiddleLeft",
            x,
            y,
            height: 16,
        });
        output.push({
            actor: "BuildingMiddleRight",
            x: x + width - 16,
            y,
            height: 16,
        });

        if (reference.door) {
            const door: any = {
                actor: "Door",
                x: x + doorOffset,
                y,
                entrance: reference.entrance,
            };
            if (reference.entrance) {
                door.entrance = reference.entrance;
            }
            if (reference.transport) {
                door.transport = reference.transport;
            }

            output.push({
                actor: "BuildingMiddleMiddle",
                x: x + 16,
                y,
                height: 16,
                width: doorOffset - 16,
            });
            output.push(door);
            output.push({
                actor: "BuildingMiddleMiddle",
                x: x + doorOffset + 32,
                y,
                height: 16,
                width: width - doorOffset - 48,
            });
            output.push({
                actor: "BuildingBottomLeft",
                x,
                y: y + 16,
                width: doorOffset,
            });
            output.push({
                actor: "BuildingBottomRight",
                x: x + doorOffset + 32,
                y: y + 16,
                width: width - doorOffset - 32,
            });
        } else {
            output.push({
                actor: "BuildingMiddleMiddle",
                x: x + 16,
                y,
                width: width - 32,
                height: 16,
            });
            output.push({
                actor: "BuildingBottom",
                x,
                y: y + 16,
                width,
            });
        }

        if (reference.label) {
            output.push({
                actor: reference.label + "Label",
                x: x + 64,
                y,
            });
        }

        return output;
    };

    /**
     * Macro Function used to create a Mountain.
     *
     * @param reference   Settings for a Mountain macro.
     * @returns A Mountain.
     */
    public macroMountain = (reference: any): any[] => {
        const openingOffset: number = reference.openingOffset || 32;
        const output: any[] = [];
        let x: number = reference.x || 0;
        let y: number = reference.y || 0;
        let width: number = reference.width || 32;
        let height: number = reference.height || 32;

        if (reference.right) {
            if (reference.top) {
                output.push({
                    actor: "MountainTopRight",
                    x: x + width - 32,
                    y,
                });
                output.push({
                    actor: "MountainRight",
                    x: x + width - 32,
                    y: y + 16,
                });
                output.push({
                    actor: "MountainTopRight",
                    x: x + width - 16,
                    y: y + 16,
                });
            } else {
                output.push({
                    actor: "MountainRight",
                    x: x + width - 32,
                    y,
                    width: 32,
                    height: 32,
                });
            }

            if (reference.bottom) {
                output.push({
                    actor: "MountainBottomRight",
                    x: x + width - 32,
                    y: y + height - 32,
                });
                output.push({
                    actor: "MountainRight",
                    x: x + width - 16,
                    y: y + height - 32,
                });
                output.push({
                    actor: "MountainBottom",
                    x: x + width - 32,
                    y: y + height - 16,
                });
                output.push({
                    actor: "MountainBottomRight",
                    x: x + width - 16,
                    y: y + height - 16,
                });
            } else {
                output.push({
                    actor: "MountainRight",
                    x: x + width - 32,
                    y: y + height - 32,
                    width: 32,
                    height: 32,
                });
            }

            if (height > 64) {
                output.push({
                    actor: "MountainRight",
                    x: x + width - 32,
                    y: y + 32,
                    width: 32,
                    height: height - 64,
                });
            }

            width -= 32;
        }

        if (reference.left) {
            if (reference.top) {
                output.push({
                    actor: "MountainTopLeft",
                    x: x + 16,
                    y,
                });
                output.push({
                    actor: "MountainTopLeft",
                    x,
                    y: y + 16,
                });
                output.push({
                    actor: "MountainLeft",
                    x: x + 16,
                    y: y + 16,
                });
            } else {
                output.push({
                    actor: "MountainLeft",
                    x,
                    y,
                    width: 32,
                    height: 32,
                });
            }

            if (reference.bottom) {
                output.push({
                    actor: "MountainLeft",
                    x,
                    y: y + height - 32,
                });
                output.push({
                    actor: "MountainBottomLeft",
                    x: x + 16,
                    y: y + height - 32,
                });
                output.push({
                    actor: "MountainBottomLeft",
                    x,
                    y: y + height - 16,
                });
                output.push({
                    actor: "MountainBottom",
                    x: x + 16,
                    y: y + height - 16,
                });
            } else {
                output.push({
                    actor: "MountainLeft",
                    x,
                    y: y + height - 32,
                    width: 32,
                    height: 32,
                });
            }

            if (height > 64) {
                output.push({
                    actor: "MountainLeft",
                    x,
                    y: y + 32,
                    width: 32,
                    height: height - 64,
                });
            }

            width -= 32;
            x += 32;
        }

        if (reference.top && width > 0) {
            output.push({
                actor: "MountainTop",
                x,
                y,
                width,
            });
            y += 20;
            height -= 20;
        }

        if (reference.bottom && width > 0) {
            if (reference.opening) {
                if (openingOffset > 0) {
                    output.push({
                        actor: "MountainBottom",
                        x,
                        y: y + height - 32,
                        width: openingOffset,
                        height: 32,
                    });
                }
                output.push({
                    actor: "CaveOpening",
                    x: x + openingOffset,
                    y: y + height - 32,
                    entrance: reference.entrance,
                    transport: reference.transport,
                });
                if (openingOffset < width) {
                    output.push({
                        actor: "MountainBottom",
                        x: x + openingOffset + 32,
                        y: y + height - 32,
                        width: width - openingOffset - 32,
                        height: 32,
                    });
                }
            } else {
                output.push({
                    actor: "MountainBottom",
                    x,
                    y: y + height - 32,
                    width,
                    height: 32,
                });
            }
            height -= 32;
        }

        if (width > 0 && height > 0) {
            output.push({
                actor: "Mountain",
                x,
                y,
                width,
                height,
            });
        }

        return output;
    };

    /**
     * Macro Function used to create a Pokemon Center.
     *
     * @param reference   Settings for a Pokemon Center macro.
     * @returns A Pokemon Center.
     */
    public macroPokeCenter = (reference: any): any[] => {
        const x: number = reference.x || 0;
        const y: number = reference.y || 0;
        const output: any = [
            {
                actor: "FloorDiamonds",
                width: 448,
                height: 256,
                x,
                y,
            },
            {
                actor: "SquareWallTop",
                x,
                y,
                height: 64,
            },
            {
                actor: "HealingMachine",
                x: x + 32,
                y,
                id: "HealingMachine",
            },
            {
                actor: "WallIndoorHorizontalBandsDark",
                x: x + 32,
                y,
                width: 128,
            },
            {
                actor: "PokeCenterPoster",
                x: x + 112,
                y,
            },
            {
                actor: "SquareWallTop",
                x: x + 160,
                y,
                height: 64,
            },
            {
                actor: "WallIndoorHorizontalBandsDark",
                x: x + 192,
                y,
                width: 128,
            },
            {
                actor: "StairsVertical",
                x: x + 320,
                y,
            },
            {
                actor: "WallIndoorHorizontalBandsDark",
                x: x + 352,
                y,
            },
            {
                actor: "StairsVertical",
                x: x + 384,
                y,
            },
            {
                actor: "WallIndoorHorizontalBandsDark",
                x: x + 416,
                y,
            },
            {
                actor: "Nurse",
                id: "Nurse",
                x: x + 96,
                y: y + 32,
            },
            {
                actor: "SquareWallFront",
                x,
                y: y + 64,
            },
            {
                actor: "PokeCenterDeskLeft",
                x: x + 32,
                y: y + 64,
            },
            {
                actor: "PokeCenterDesk",
                x: x + 48,
                y: y + 64,
                width: 128,
            },
            {
                actor: "CutsceneResponder",
                x: x + 96,
                y: y + 64,
                cutscene: "PokeCenter",
                keepAlive: true,
            },
            {
                actor: "SquareWallFront",
                x: x + 160,
                y: y + 64,
            },
            {
                actor: "PokeCenterDesk",
                x: x + 192,
                y: y + 64,
                width: 128,
            },
            {
                actor: "PokeCenterDeskBlocker",
                x: x + 320,
                y: y + 64,
            },
            {
                actor: "DeskWoman",
                x: x + 352,
                y: y + 64,
                dialog: [
                    "Welcome to the Cable Club!",
                    "This area is reserved for 2 friends who are linked by cable.",
                ],
            },
            {
                actor: "PokeCenterDeskBlocker",
                x: x + 384,
                y: y + 64,
            },
            {
                actor: "PokeCenterDesk",
                x: x + 416,
                y: y + 64,
            },
            {
                actor: "Buzzer",
                x: x + 112,
                y: y + 76,
            },
            {
                cutscene: "Computer",
                actor: "Computer",
                x: x + 416,
                y: y + 96,
            },
            {
                actor: "SofaLeft",
                x,
                y: y + 128,
            },
            {
                actor: "PottedPalmTree",
                x,
                y: y + 192,
                width: 64,
            },
            {
                actor: "PottedPalmTree",
                x: x + 192,
                y: y + 192,
                width: 64,
            },
            {
                actor: "PottedPalmTree",
                x: x + 384,
                y: y + 192,
                width: 64,
            },
            {
                actor: "Doormat",
                x: x + 96,
                y: y + 224,
                width: 64,
                entrance: reference.entrance,
            },
        ];

        if (reference.transport) {
            output.push({
                actor: "HiddenTransporter",
                x: x + 96,
                y: y + 224,
                width: 64,
                transport: reference.transport,
                requireDirection: 2,
            });
        }

        if (!reference.excludeCoolTrainer) {
            output.push({
                actor: "CoolTrainerM",
                x,
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
                    "",
                ],
            });
        }

        return output;
    };

    /**
     * Macro Function used to create a PokeMart.
     *
     * @param reference   Settings for a PokeMart macro.
     * @returns A PokeMart.
     */
    public macroPokeMart = (reference: any): any[] => {
        const x: number = reference.x || 0;
        const y: number = reference.y || 0;
        const output: any[] = [
            {
                actor: "WallIndoorHorizontalBandsDark",
                x,
                y,
                width: 64,
                height: 16,
            },
            {
                actor: "FloorDiamonds",
                x,
                y: y + 32,
                width: 256,
                height: 224,
            },
            {
                actor: "FloorDiamondsDark",
                x,
                y: y + 64,
                height: 32,
            },
            {
                actor: "StoreFridge",
                x: x + 64,
                y,
                width: 128,
            },
            {
                actor: "WallIndoorHorizontalBandsDark",
                x: x + 192,
                y,
                width: 64,
                height: 16,
            },
            {
                actor: "StoreSaleBin",
                x,
                y: y + 16,
                width: 64,
            },
            {
                actor: "StoreSaleBin",
                x: x + 192,
                y: y + 16,
                width: 64,
            },
            {
                actor: "StoreAisle",
                x,
                y: y + 96,
                height: 32,
            },
            {
                actor: "StoreAisle",
                x: x + 128,
                y: y + 96,
                width: 128,
            },
            {
                actor: "WallIndoorHorizontalBandsDark",
                x,
                y: y + 128,
            },
            {
                actor: "WallIndoorHorizontalBandsDark",
                x: x + 32,
                y: y + 128,
                height: 16,
            },
            {
                actor: "FloorDiamondsDark",
                x: x + 64,
                y: y + 128,
                height: 96,
            },
            {
                actor: "SquareWallTop",
                x: x + 32,
                y: y + 144,
                height: 64,
            },
            {
                actor: "Cashier",
                x,
                y: y + 160,
                direction: 1,
            },
            {
                actor: "FloorDiamondsDark",
                x,
                y: y + 160,
            },
            {
                actor: "Register",
                x: x + 32,
                y: y + 160,
                id: reference.responderId,
                activate: this.game.actions.activateCutsceneResponder,
                cutscene: "PokeMart",
                keepAlive: true,
                items: reference.items,
                dialog: reference.responderDialog,
            },
            {
                actor: "PokeCenterDeskLeft",
                x,
                y: y + 192,
            },
            {
                actor: "PokeCenterDesk",
                x: x + 16,
                y: y + 192,
                width: 48,
            },
            {
                actor: "FloorDiamondsDark",
                x,
                y: y + 224,
            },
            {
                actor: "Doormat",
                x: x + 96,
                y: y + 224,
                width: 64,
                entrance: reference.entrance,
            },
        ];

        if (reference.transport) {
            output.push({
                actor: "HiddenTransporter",
                x: x + 96,
                y: y + 224,
                width: 64,
                transport: reference.transport,
                requireDirection: 2,
            });
        }

        return output;
    };
}
