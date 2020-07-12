import { member } from "babyioc";
import { Maps as EightBittrMaps } from "eightbittr";
import {
    IArea as IMapsCreatrIArea,
    IAreaRaw as IMapsCreatrAreaRaw,
    ILocation as IMapsCreatrLocation,
    ILocationRaw as IMapsCreatrLocationRaw,
    IMap as IMapsCreatrIMap,
    IMapRaw as IMapsCreatrIMapRaw,
    IPreThing as IMapsCreatrPreThing,
    IPreThingsContainers,
} from "mapscreatr";
import { MapScreenr as EightBittrMapScreenr } from "mapscreenr";

import { PalletTown } from "../creators/mapsLibrary/PalletTown";
import { PewterCity } from "../creators/mapsLibrary/PewterCity";
import { Route1 } from "../creators/mapsLibrary/Route1";
import { Route2 } from "../creators/mapsLibrary/Route2";
import { Route21 } from "../creators/mapsLibrary/Route21";
import { Route22 } from "../creators/mapsLibrary/Route22";
import { ViridianCity } from "../creators/mapsLibrary/ViridianCity";
import { ViridianForest } from "../creators/mapsLibrary/ViridianForest";
import { FullScreenPokemon } from "../FullScreenPokemon";

import { Direction } from "./Constants";
import { EntranceAnimations } from "./maps/EntranceAnimations";
import { MapMacros } from "./maps/MapMacros";
import { IStateSaveable } from "./Saves";
import { IAreaGate, IAreaSpawner, IPlayer, IThing } from "./Things";

/**
 * A flexible container for map attributes and viewport.
 */
export interface IMapScreenr extends EightBittrMapScreenr {
    /**
     * Which are the player is currently active in.
     *
     * @todo Consider moving this into EightBittr core.
     */
    activeArea: IArea;

    /**
     * Whether user inputs should be ignored.
     */
    blockInputs: boolean;

    /**
     * The currently playing cutscene, if any.
     */
    cutscene?: string;

    /**
     * What theme is currently playing.
     */
    theme?: string;

    /**
     * Known variables, keyed by name.
     */
    variables: {
        /**
         * Whether the current Area allows bicycling.
         */
        allowCycling?: boolean;

        /**
         * The current size of the area Things are placed in.
         */
        boundaries: IAreaBoundaries;

        /**
         * What form of scrolling is currently capable on the screen.
         */
        scrollability: number;
    };
}

/**
 * A raw JSON-friendly description of a map.
 */
export interface IMapRaw extends IMapsCreatrIMapRaw {
    /**
     * A listing of areas in the Map, keyed by name.
     */
    areas: {
        [i: number]: IAreaRaw;
        [i: string]: IAreaRaw;
    };

    /**
     * The default location for the Map.
     */
    locationDefault: number | string;

    /**
     * Descriptions of locations in the map.
     */
    locations: {
        [i: number]: ILocationRaw;
        [i: string]: ILocationRaw;
    };

    /**
     * A starting seed to initialize random number generation.
     */
    seed?: number | number[];

    /**
     * What theme to play by default, such as "Pallet Town".
     */
    theme?: string;
}

/**
 * A Map parsed from its raw JSON-friendly description.
 */
export interface IMap extends IStateSaveable, IMapsCreatrIMap {
    /**
     * A listing of areas in the Map, keyed by name.
     */
    areas: {
        [i: string]: IArea;
        [i: number]: IArea;
    };

    /**
     * The name of the Map, such as "Pallet Town".
     */
    name: string;

    /**
     * The default location for the Map.
     */
    locationDefault?: string;

    /**
     * A starting seed to initialize random number generation.
     */
    seed: number | number[];

    /**
     * What theme to play by default, such as "Pallet Town".
     */
    theme: string;
}

/**
 * A raw JSON-friendly description of a map area.
 */
export interface IAreaRaw extends IMapsCreatrAreaRaw {
    /**
     * Whether the Area allows bicycling.
     */
    allowCycling?: boolean;

    /**
     * Any additional attributes that should add extra properties to this Area.
     */
    attributes?: {
        [i: string]: any;
    };

    /**
     * What background to display behind all Things.
     */
    background?: string;

    /**
     * How tall the area is.
     * @todo It's not clear if this is different from boundaries.height.
     */
    height?: number;

    /**
     * Whether the area should have invisible borders added around it.
     */
    invisibleWallBorders?: boolean;

    /**
     * A default theme to override the parent Map's.
     */
    theme?: string;

    /**
     * How wide the area is.
     * @todo It's not clear if this is different from boundaries.width.
     */
    width?: number;

    /**
     * Wild Pokemon that may appear in this Area.
     */
    wildPokemon?: IAreaWildPokemonOptionGroups;
}

/**
 * An Area parsed from a raw JSON-friendly Area description.
 */
export interface IArea extends IAreaRaw, IStateSaveable, IMapsCreatrIArea {
    /**
     * Whether the Area allows bicycling.
     */
    allowCycling: boolean;

    /**
     * What background to display behind all Things.
     */
    background: string;

    /**
     * In-game boundaries of all placed Things.
     */
    boundaries: IAreaBoundaries;

    /**
     * The Map this Area is within.
     */
    map: IMap;

    /**
     * Whether this Area has been spawned.
     */
    spawned: boolean;

    /**
     * Which Map spawned this Area and when.
     */
    spawnedBy: IAreaSpawnedBy;

    /**
     * Whether the Player has encountered a Pokemon in this area's grass.
     */
    pokemonEncountered?: boolean;

    /**
     * Wild Pokemon that may appear in this Area.
     */
    wildPokemon?: IAreaWildPokemonOptionGroups;
}

/**
 * A description of how an Area has been stretched by its placed Things.
 */
export interface IAreaBoundaries {
    /**
     * How wide the Area is.
     */
    width: number;

    /**
     * How tall the Area is.
     */
    height: number;

    /**
     * The top border of the boundaries' bounding box.
     */
    top: number;

    /**
     * The right border of the boundaries' bounding box.
     */
    right: number;

    /**
     * The bottom border of the boundaries' bounding box.
     */
    bottom: number;

    /**
     * The left border of the boundaries' bounding box.
     */
    left: number;
}

/**
 * A description of which Map spawned an Area and when.
 */
export interface IAreaSpawnedBy {
    /**
     * The name of the Map that spawned the Area.
     */
    name: string;

    /**
     * When the spawning occurred.
     */
    timestamp: number;
}

/**
 * Types of Pokemon that may appear in an Area, keyed by terrain type, such as "grass".
 */
export interface IAreaWildPokemonOptionGroups {
    /**
     * Types of Pokemon that may appear in grass.
     */
    grass?: IWildPokemonSchema[];

    /**
     * Types of Pokemon that may appear while fishing.
     */
    fishing?: IWildFishingPokemon;

    /**
     * Types of Pokemon that may appear while surfing.
     */
    surfing?: IWildPokemonSchema[];

    /**
     * Types of Pokemon that may appear while walking.
     */
    walking?: IWildPokemonSchema[];
}

/**
 * A description of a type of Pokemon that may appear in an Area.
 */
export interface IWildPokemonSchemaBase {
    /**
     * The type of Pokemon.
     */
    title: string[];

    /**
     * Concatenated names of moves the Pokemon should have.
     */
    moves?: string[];

    /**
     * The rate of appearance for this type of Pokemon, in [0, 1].
     */
    rate?: number;
}

/**
 * A wild Pokemon description with only one possible level.
 */
export interface IWildPokemonSchemaWithLevel extends IWildPokemonSchemaBase {
    /**
     * What level the Pokemon may be.
     */
    level: number;
}

/**
 * A wild Pokemon description with multiple possible levels.
 */
export interface IWildPokemonSchemaWithLevels extends IWildPokemonSchemaBase {
    /**
     * What levels the Pokemon may be.
     */
    levels: number[];
}

export type IWildPokemonSchema = IWildPokemonSchemaWithLevel | IWildPokemonSchemaWithLevels;

/**
 * A raw JSON-friendly description of a location.
 */
export interface ILocationRaw extends IMapsCreatrLocationRaw {
    /**
     * A cutscene to immediately start upon entering.
     */
    cutscene?: string;

    /**
     * A direction to immediately face the player towards.
     */
    direction?: number;

    /**
     * Whether the player should immediately walk forward.
     */
    push?: boolean;

    /**
     * A cutscene routine to immediately start upon entering.
     */
    routine?: string;

    /**
     * A theme to immediately play upon entering.
     */
    theme?: string;

    /**
     * The x-location in the parent Area.
     */
    xloc?: number;

    /**
     * The y-location in the parent Area.
     */
    yloc?: number;
}

/**
 * A Location parsed from a raw JSON-friendly Map description.
 */
export interface ILocation extends IStateSaveable, IMapsCreatrLocation {
    /**
     * The Area this Location is a part of.
     */
    area: IArea;

    /**
     * A cutscene to immediately start upon entering.
     */
    cutscene?: string;

    /**
     * A direction to immediately face the player towards.
     */
    direction?: number;

    /**
     * Whether the player should immediately walk forward.
     */
    push?: boolean;

    /**
     * A cutscene routine to immediately start upon entering.
     */
    routine?: string;

    /**
     * A theme to immediately play upon entering.
     */
    theme?: string;

    /**
     * The x-location in the parent Area.
     */
    xloc?: number;

    /**
     * The y-location in the parent Area.
     */
    yloc?: number;
}

/**
 * The types of Pokemon that can be caught with different rods.
 */
export interface IWildFishingPokemon {
    /**
     * The Pokemon that can be caught using an Old Rod.
     */
    old?: IWildPokemonSchema[];

    /**
     * The Pokemon that can be caught using a Good Rod.
     */
    good?: IWildPokemonSchema[];

    /**
     * The Pokemon that can be caught using a Super Rod.
     */
    super?: IWildPokemonSchema[];
}

/**
 * A position holder around an in-game Thing.
 */
export interface IPreThing extends IMapsCreatrPreThing {
    /**
     * A starting direction to face (by default, up).
     */
    direction?: number;

    /**
     * The in-game Thing.
     */
    thing: IThing;

    /**
     * The raw x-location from the Area's creation command.
     */
    x: number;

    /**
     * The raw y-location from the Area's creation command.
     */
    y: number;

    /**
     * How wide the Thing should be.
     */
    width?: number;

    /**
     * How tall the Thing should be.
     */
    height: number;
}

/**
 * Enters and spawns map areas.
 */
export class Maps<TEightBittr extends FullScreenPokemon> extends EightBittrMaps<TEightBittr> {
    /**
     * Map entrance animations.
     */
    @member(EntranceAnimations)
    public readonly entranceAnimations: EntranceAnimations;

    /**
     * Map creation macros.
     */
    @member(MapMacros)
    public readonly mapMacros: MapMacros;

    /**
     * Entrance Functions that may be used as the openings for Locations.
     */
    public readonly entrances = {
        Blank: this.entranceAnimations.blank,
        Normal: this.entranceAnimations.normal,
    };

    /**
     * Macros that can be used to automate common operations.
     */
    public readonly macros = {
        Checkered: this.mapMacros.macroCheckered,
        Water: this.mapMacros.macroWater,
        House: this.mapMacros.macroHouse,
        HouseLarge: this.mapMacros.macroHouseLarge,
        Building: this.mapMacros.macroBuilding,
        Gym: this.mapMacros.macroGym,
        Mountain: this.mapMacros.macroMountain,
        PokeCenter: this.mapMacros.macroPokeCenter,
        PokeMart: this.mapMacros.macroPokeMart,
    };

    public readonly maps = {
        Blank: {
            name: "Blank",
            locationDefault: "Black",
            locations: {
                Black: {
                    area: "Black",
                    entry: "Blank",
                },
                White: {
                    area: "White",
                    entry: "Blank",
                },
            },
            areas: {
                Black: {
                    creation: [],
                },
                White: {
                    background: "white",
                    creation: [],
                },
            },
        },
        "Pallet Town": PalletTown,
        "Pewter City": PewterCity,
        "Route 1": Route1,
        "Route 2": Route2,
        "Route 21": Route21,
        "Route 22": Route22,
        "Viridian City": ViridianCity,
        "Viridian Forest": ViridianForest,
    };

    /**
     * Property names to copy from Areas to the MapScreenr during setLocation.
     */
    public readonly screenAttributes = ["allowCycling"];

    /**
     * Processes additional Thing attributes. For each attribute the Area's
     * class says it may have, if it has it, the attribute value proliferated
     * onto the Area.
     *
     * @param area The Area being processed.
     */
    public areaProcess = (area: IArea): void => {
        const attributes: { [i: string]: any } | undefined = area.attributes;
        if (!attributes) {
            return;
        }

        for (const attribute in attributes) {
            if ((area as any)[attribute]) {
                this.game.utilities.proliferate(area, attributes[attribute]);
            }
        }
    };

    /**
     * Adds a Thing via addPreThing based on the specifications in a PreThing.
     * This is done relative to MapScreener.left and MapScreener.top.
     *
     * @param prething   A PreThing whose Thing is to be added to the game.
     */
    public addPreThing = (prething: IPreThing): void => {
        const thing: IThing = prething.thing;
        const position: string = prething.position || thing.position;

        if (thing.spawned) {
            return;
        }
        thing.spawned = true;

        thing.areaName = thing.areaName || this.game.areaSpawner.getAreaName();
        thing.mapName = thing.mapName || this.game.areaSpawner.getMapName();

        this.game.things.add(
            thing,
            prething.left - this.game.mapScreener.left,
            prething.top - this.game.mapScreener.top,
            true
        );

        // Either the prething or thing, in that order, may request to be in the
        // front or back of the container
        if (position) {
            this.game.timeHandler.addEvent((): void => {
                switch (position) {
                    case "beginning":
                        this.game.utilities.arrayToBeginning(
                            thing,
                            this.game.groupHolder.getGroup(thing.groupType)
                        );
                        break;
                    case "end":
                        this.game.utilities.arrayToEnd(
                            thing,
                            this.game.groupHolder.getGroup(thing.groupType)
                        );
                        break;
                    default:
                        throw new Error("Unknown position: " + position + ".");
                }
            });
        }

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onAddPreThing, prething);
    };

    /**
     * Adds a new Player Thing to the game and sets it as eightBitter.player. Any
     * required additional settings (namely keys, power/size, and swimming) are
     * applied here.
     *
     * @param left   A left edge to place the Thing at (by default, 0).
     * @param bottom   A top to place the Thing upon (by default, 0).
     * @param useSavedInfo   Whether an Area's saved info in StateHolder should be
     *                       applied to the Thing's position (by default, false).
     * @returns A newly created Player in the game.
     */
    public addPlayer(left = 0, top = 0, useSavedInfo?: boolean): IPlayer {
        const player: IPlayer = this.game.objectMaker.make<IPlayer>(
            this.game.things.names.player
        );
        player.keys = player.getKeys();

        this.game.players[0] = player;
        this.game.things.add(player, left || 0, top || 0, useSavedInfo);
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onAddPlayer, player);

        return player;
    }

    /**
     * Sets the game state to a new Map, resetting all Things and inputs in the
     * process. The mod events are fired.
     *
     * @param name   The name of the Map.
     * @param location   The name of the Location within the Map.
     * @param noEntrance    Whether or not an entry Function should
     *                      be skipped (by default, false).
     * @remarks Most of the work here is done by setLocation.
     */
    public setMap(name: string, location?: string, noEntrance?: boolean): ILocation {
        if (!name) {
            name = this.game.areaSpawner.getMapName();
        }

        const map: IMap = this.game.areaSpawner.setMap(name) as IMap;

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onPreSetMap, map);
        this.game.numberMaker.resetFromSeed(map.seed);
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onSetMap, map);

        return this.setLocation(location || map.locationDefault || "Blank", noEntrance);
    }

    /**
     * Sets the game state to a Location within the current map, resetting all
     * Things, inputs, the current Area, PixelRender, and MapScreener in the
     * process. The Location's entry Function is called to bring a new Player
     * into the game if specified. The mod events are fired.
     *
     * @param name   The name of the Location within the Map.
     * @param noEntrance   Whether an entry function should be skipped (by default, false).
     * @todo Separate external module logic to their equivalent components then
     *       pass them as an onPreSetLocation/onSetLocation here to reduce dependencies.
     */
    public setLocation(name: string, noEntrance?: boolean): ILocation {
        this.game.groupHolder.clear();
        this.game.mapScreener.clearScreen();
        this.game.menuGrapher.deleteAllMenus();
        this.game.timeHandler.cancelAllEvents();

        this.game.areaSpawner.setLocation(name);
        this.game.mapScreener.setVariables();

        const location: ILocation = this.game.areaSpawner.getLocation(name) as ILocation;
        location.area.spawnedBy = {
            name,
            timestamp: new Date().getTime(),
        };

        this.game.mapScreener.activeArea = location.area;
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onPreSetLocation, location);
        this.game.pixelDrawer.setBackground(
            (this.game.areaSpawner.getArea() as IArea).background
        );

        if (location.area.map.name !== "Blank") {
            this.game.itemsHolder.setItem(this.game.storage.names.map, location.area.map.name);
            this.game.itemsHolder.setItem(this.game.storage.names.area, location.area.name);
            this.game.itemsHolder.setItem(this.game.storage.names.location, name);
        }
        this.setStateCollection(location.area);

        this.game.quadsKeeper.resetQuadrants();

        const theme: string = location.theme || location.area.theme || location.area.map.theme;

        this.game.mapScreener.theme = theme;
        if (theme && !this.game.audioPlayer.hasSound(this.game.audio.aliases.theme, theme)) {
            this.game.audioPlayer.play(theme, {
                alias: this.game.audio.aliases.theme,
                loop: true,
            });
        }

        if (!noEntrance && location.entry) {
            location.entry.call(this, location);
        }

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onSetLocation, location);

        this.game.frameTicker.play();

        this.game.animations.fading.animateFadeFromColor({
            color: "Black",
        });

        if (location.push) {
            this.game.actions.walking.startWalkingOnPath(this.game.players[0], [
                {
                    blocks: 1,
                    direction: this.game.players[0].direction,
                },
                (): void => this.game.saves.autoSaveIfEnabled(),
            ]);
        }

        return location;
    }

    /**
     * Analyzes a PreThing to be placed in one of the
     * cardinal directions of the current Map's boundaries
     * (just outside of the current Area).
     *
     * @param prething   A PreThing whose Thing is to be added to the game.
     * @param direction   The cardinal direction the Character is facing.
     * @remarks Direction is taken in by the .forEach call as the index.
     */
    public addAfter = (prething: IPreThing, direction: Direction): void => {
        const prethings: any = this.game.areaSpawner.getPreThings();
        const area: IArea = this.game.areaSpawner.getArea() as IArea;
        const map: IMap = this.game.areaSpawner.getMap() as IMap;
        const boundaries: IAreaBoundaries = this.game.areaSpawner.getArea()
            .boundaries as IAreaBoundaries;

        prething.direction = direction;
        switch (direction) {
            case Direction.Top:
                prething.x = boundaries.left;
                prething.y = boundaries.top - 32;
                prething.width = boundaries.right - boundaries.left;
                break;

            case Direction.Right:
                prething.x = boundaries.right;
                prething.y = boundaries.top;
                prething.height = boundaries.bottom - boundaries.top;
                break;

            case Direction.Bottom:
                prething.x = boundaries.left;
                prething.y = boundaries.bottom;
                prething.width = boundaries.right - boundaries.left;
                break;

            case Direction.Left:
                prething.x = boundaries.left - 32;
                prething.y = boundaries.top;
                prething.height = boundaries.bottom - boundaries.top;
                break;

            default:
                throw new Error(`Unknown direction: '${direction}'.`);
        }

        this.game.mapsCreator.analyzePreSwitch(prething, prethings, area, map);
    };

    /**
     * Runs an areaSpawner to place its Area's Things in the map.
     *
     * @param thing   An in-game areaSpawner.
     * @param area   The Area associated with thing.
     */
    public activateAreaSpawner(thing: IAreaSpawner, area: IArea): void {
        const direction: Direction = thing.direction;
        const areaCurrent: IArea = this.game.areaSpawner.getArea() as IArea;
        const mapCurrent: IMap = this.game.areaSpawner.getMap() as IMap;
        const prethingsCurrent: IPreThingsContainers = this.game.areaSpawner.getPreThings();
        let left: number = thing.left + this.game.mapScreener.left;
        let top: number = thing.top + this.game.mapScreener.top;

        switch (direction) {
            case Direction.Top:
                top -= area.height!;
                break;

            case Direction.Right:
                left += thing.width;
                break;

            case Direction.Bottom:
                top += thing.height;
                break;

            case Direction.Left:
                left -= area.width!;
                break;

            default:
                throw new Error(`Unknown direction: '${direction}'.`);
        }

        const x: number = left + (thing.offsetX || 0);
        const y: number = top + (thing.offsetY || 0);

        this.game.scrolling.expandMapBoundariesForArea(area, x, y);

        for (const creation of area.creation) {
            // A copy of the command must be used, so as to not modify the original
            const command: any = this.game.utilities.proliferate(
                {
                    noBoundaryStretch: true,
                    areaName: area.name,
                    mapName: area.map.name,
                },
                creation
            );

            command.x = (command.x || 0) + x;
            command.y = (command.y || 0) + y;

            // Having an entrance might conflict with previously set Locations
            if ("entrance" in command) {
                delete command.entrance;
            }

            this.game.mapsCreator.analyzePreSwitch(
                command,
                prethingsCurrent,
                areaCurrent,
                mapCurrent
            );
        }

        this.game.areaSpawner.spawnArea(
            this.game.constants.directionSpawns[direction],
            this.game.quadsKeeper.top,
            this.game.quadsKeeper.right,
            this.game.quadsKeeper.bottom,
            this.game.quadsKeeper.left
        );
        this.game.maps.addAreaGate(thing, area, x, y);

        area.spawned = true;
        this.game.death.kill(thing);
    }

    /**
     * Adds an AreaGate on top of an areaSpawner.
     *
     * @param thing   An areaSpawner that should have a gate.
     * @param area   The Area to spawn into.
     * @param offsetX   Horizontal spawning offset for the Area.
     * @param offsetY   Vertical spawning offset for the Area.
     * @returns The added AreaGate.
     */
    public addAreaGate(
        thing: IAreaGate,
        area: IArea,
        offsetX: number,
        offsetY: number
    ): IAreaGate {
        const properties: any = {
            area: thing.area,
            areaOffsetX: offsetX,
            areaOffsetY: offsetY,
            direction: thing.direction,
            height: 8,
            map: thing.map,
            width: 8,
        };
        let left: number = thing.left;
        let top: number = thing.top;

        switch (thing.direction) {
            case Direction.Top:
                top -= this.game.constants.blockSize;
                properties.width = area.width;
                break;

            case Direction.Right:
                properties.height = area.height;
                break;

            case Direction.Bottom:
                properties.width = area.width;
                break;

            case Direction.Left:
                left -= this.game.constants.blockSize;
                properties.height = area.height;
                break;

            default:
                throw new Error(`Unknown direction: '${thing.direction}'.`);
        }

        return this.game.things.add(
            [this.game.things.names.areaGate, properties],
            left,
            top
        );
    }

    /**
     * Sets the current StateHoldr collection to an area.
     *
     * @param area   Area to store changes within.
     */
    public setStateCollection(area: IArea): void {
        this.game.stateHolder.setCollection(`${area.map.name}::${area.name}`);
    }
}
