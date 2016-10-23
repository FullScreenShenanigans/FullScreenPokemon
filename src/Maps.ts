/// <reference path="../typings/GameStartr.d.ts" />

import { Direction, DirectionSpawns } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import {
    IArea, IAreaBoundaries, IAreaGate, IAreaSpawner, ILocation,
    IMap, IPlayer, IPreThing, IThing
} from "./IFullScreenPokemon";

/**
 * Map functions used by FullScreenPokemon instances.
 */
export class Maps<TEightBittr extends FullScreenPokemon> extends GameStartr.Maps<TEightBittr> {
    /**
     * Processes additional Thing attributes. For each attribute the Area's
     * class says it may have, if it has it, the attribute value proliferated 
     * onto the Area.
     * 
     * @param area The Area being processed.
     */
    public areaProcess(area: IArea): void {
        const attributes: { [i: string]: any } = area.attributes;

        for (const attribute in attributes) {
            if ((area as any)[attribute]) {
                this.EightBitter.utilities.proliferate(area, attributes[attribute]);
            }
        }
    }

    /**
     * Adds a Thing via addPreThing based on the specifications in a PreThing.
     * This is done relative to MapScreener.left and MapScreener.top.
     * 
     * @param prething   A PreThing whose Thing is to be added to the game.
     */
    public addPreThing(prething: IPreThing): void {
        const thing: IThing = prething.thing;
        const position: string = prething.position || thing.position;

        if (thing.spawned) {
            return;
        }
        thing.spawned = true;

        thing.areaName = thing.areaName || this.EightBitter.AreaSpawner.getAreaName();
        thing.mapName = thing.mapName || this.EightBitter.AreaSpawner.getMapName();

        this.EightBitter.things.add(
            thing,
            prething.left * this.EightBitter.unitsize - this.EightBitter.MapScreener.left,
            prething.top * this.EightBitter.unitsize - this.EightBitter.MapScreener.top,
            true);

        // Either the prething or thing, in that order, may request to be in the
        // front or back of the container
        if (position) {
            this.EightBitter.TimeHandler.addEvent((): void => {
                switch (position) {
                    case "beginning":
                        this.EightBitter.utilities.arrayToBeginning(
                            thing, this.EightBitter.GroupHolder.getGroup(thing.groupType) as IThing[]);
                        break;
                    case "end":
                        this.EightBitter.utilities.arrayToEnd(
                            thing, this.EightBitter.GroupHolder.getGroup(thing.groupType) as IThing[]);
                        break;
                    default:
                        throw new Error("Unknown position: " + position + ".");
                }
            });
        }

        this.EightBitter.ModAttacher.fireEvent("onAddPreThing", prething);
    }

    /**
     * Adds a new Player Thing to the game and sets it as EightBitter.player. Any
     * required additional settings (namely keys, power/size, and swimming) are
     * applied here.
     * 
     * @param left   A left edge to place the Thing at (by default, 0).
     * @param bottom   A top to place the Thing upon (by default, 0).
     * @param useSavedInfo   Whether an Area's saved info in StateHolder should be 
     *                       applied to the Thing's position (by default, false).
     * @returns A newly created Player in the game.
     */
    public addPlayer(left: number = 0, top: number = 0, useSavedInfo?: boolean): IPlayer {
        const player: IPlayer = this.EightBitter.player = this.EightBitter.ObjectMaker.make("Player");
        player.keys = player.getKeys();

        this.EightBitter.InputWriter.setEventInformation(player);

        this.EightBitter.things.add(player, left || 0, top || 0, useSavedInfo);

        this.EightBitter.ModAttacher.fireEvent("onAddPlayer", player);

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
    public setMap(name: string, location?: string, noEntrance?: boolean): void {
        if (typeof name === "undefined" || name.constructor === FullScreenPokemon) {
            name = this.EightBitter.AreaSpawner.getMapName();
        }

        const map: IMap = this.EightBitter.AreaSpawner.setMap(name) as IMap;

        this.EightBitter.ModAttacher.fireEvent("onPreSetMap", map);
        this.EightBitter.NumberMaker.resetFromSeed(map.seed);
        this.EightBitter.InputWriter.restartHistory();
        this.EightBitter.ModAttacher.fireEvent("onSetMap", map);

        this.setLocation(
            location
            || map.locationDefault
            || this.EightBitter.settings.maps.locationDefault,
            noEntrance);
    }

    /**
     * Sets the game state to a Location within the current map, resetting all
     * Things, inputs, the current Area, PixelRender, and MapScreener in the
     * process. The Location's entry Function is called to bring a new Player
     * into the game if specified. The mod events are fired.
     * 
     * @param name   The name of the Location within the Map.
     * @param noEntrance   Whether or not an entry Function should
     *                     be skipped (by default, false).
     */
    public setLocation(name: string, noEntrance?: boolean): void {
        name = name || "0";

        this.EightBitter.AudioPlayer.clearAll();
        this.EightBitter.GroupHolder.clearArrays();
        this.EightBitter.MapScreener.clearScreen();
        this.EightBitter.MenuGrapher.deleteAllMenus();
        this.EightBitter.TimeHandler.cancelAllEvents();

        this.EightBitter.AreaSpawner.setLocation(name);
        this.EightBitter.MapScreener.setVariables();

        const location: ILocation = this.EightBitter.AreaSpawner.getLocation(name) as ILocation;
        location.area.spawnedBy = {
            name: name,
            timestamp: new Date().getTime()
        };

        this.EightBitter.ModAttacher.fireEvent("onPreSetLocation", location);

        this.EightBitter.PixelDrawer.setBackground((this.EightBitter.AreaSpawner.getArea() as IArea).background);

        this.EightBitter.StateHolder.setCollection(location.area.map.name + "::" + location.area.name);

        this.EightBitter.QuadsKeeper.resetQuadrants();

        const theme: string = location.theme || location.area.theme || location.area.map.theme;

        this.EightBitter.MapScreener.theme = theme;
        if (theme && this.EightBitter.AudioPlayer.getThemeName() !== theme) {
            this.EightBitter.AudioPlayer.playTheme(theme);
        }

        if (!noEntrance) {
            location.entry.call(this, location);
        }

        this.EightBitter.ModAttacher.fireEvent("onSetLocation", location);

        this.EightBitter.GamesRunner.play();

        this.EightBitter.animations.animateFadeFromColor({
            color: "Black"
        });

        if (location.push) {
            this.EightBitter.animations.animateCharacterStartWalking(
                this.EightBitter.player,
                this.EightBitter.player.direction,
                (): void => this.EightBitter.storage.autoSave());
        }
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
    public addAfter(prething: IPreThing, direction: Direction): void {
        const prethings: any = this.EightBitter.AreaSpawner.getPreThings();
        const area: IArea = this.EightBitter.AreaSpawner.getArea() as IArea;
        const map: IMap = this.EightBitter.AreaSpawner.getMap() as IMap;
        const boundaries: IAreaBoundaries = this.EightBitter.AreaSpawner.getArea().boundaries as IAreaBoundaries;

        prething.direction = direction;
        switch (direction) {
            case Direction.Top:
                prething.x = boundaries.left;
                prething.y = boundaries.top - 8;
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
                prething.x = boundaries.left - 8;
                prething.y = boundaries.top;
                prething.height = boundaries.bottom - boundaries.top;
                break;

            default:
                throw new Error(`Unknown direction: '${direction}'.`);
        }

        this.EightBitter.MapsCreator.analyzePreSwitch(prething, prethings, area, map);
    }

    /**
     * A blank Map entrance Function where no Character is placed.
     */
    public entranceBlank(): void {
        this.addPlayer(0, 0);
        this.EightBitter.player.hidden = true;
    }

    /**
     * Standard Map entrance Function. Character is placed based on specified Location. 
     * 
     * @param location   The name of the Location within the Map.
     */
    public entranceNormal(location: ILocation): void {
        this.addPlayer(
            location.xloc ? location.xloc * this.EightBitter.unitsize : 0,
            location.yloc ? location.yloc * this.EightBitter.unitsize : 0);

        this.EightBitter.animations.animateCharacterSetDirection(
            this.EightBitter.player,
            (typeof location.direction === "undefined"
                ? this.EightBitter.MapScreener.playerDirection
                : location.direction)
            || 0);

        this.EightBitter.scrolling.centerMapScreen();

        if (location.cutscene) {
            this.EightBitter.ScenePlayer.startCutscene(location.cutscene, {
                player: this.EightBitter.player
            });
        }

        if (location.routine && this.EightBitter.ScenePlayer.getCutsceneName()) {
            this.EightBitter.ScenePlayer.playRoutine(location.routine);
        }
    }

    /**
     * Map entrace Function used when player is added to the Map at the beginning 
     * of play. Retrieves Character position from the previous save state.
     */
    public entranceResume(): void {
        const savedInfo: any = this.EightBitter.StateHolder.getChanges("player") || {};

        this.EightBitter.maps.addPlayer(savedInfo.xloc || 0, savedInfo.yloc || 0, true);

        this.EightBitter.animations.animateCharacterSetDirection(this.EightBitter.player, savedInfo.direction || Direction.Top);

        this.EightBitter.scrolling.centerMapScreen();
    }

    /**
     * Runs an AreaSpawner to place its Area's Things in the map.
     * 
     * @param thing   An in-game AreaSpawner.
     * @param area   The Area associated with thing.
     */
    public activateAreaSpawner(thing: IAreaSpawner, area: IArea): void {
        const direction: Direction = thing.direction;
        const areaCurrent: IArea = this.EightBitter.AreaSpawner.getArea() as IArea;
        const mapCurrent: IMap = this.EightBitter.AreaSpawner.getMap() as IMap;
        const prethingsCurrent: MapsCreatr.IPreThingsContainers = this.EightBitter.AreaSpawner.getPreThings();
        let left: number = thing.left + this.EightBitter.MapScreener.left;
        let top: number = thing.top + this.EightBitter.MapScreener.top;

        switch (direction) {
            case Direction.Top:
                top -= area.height * this.EightBitter.unitsize;
                break;

            case Direction.Right:
                left += thing.width * this.EightBitter.unitsize;
                break;

            case Direction.Bottom:
                top += thing.height * this.EightBitter.unitsize;
                break;

            case Direction.Left:
                left -= area.width * this.EightBitter.unitsize;
                break;

            default:
                throw new Error(`Unknown direction: '${direction}'.`);
        }

        const x: number = left / this.EightBitter.unitsize + (thing.offsetX || 0);
        const y: number = top / this.EightBitter.unitsize + (thing.offsetY || 0);

        this.EightBitter.scrolling.expandMapBoundariesForArea(area, x, y);

        for (const creation of area.creation) {
            // A copy of the command must be used, so as to not modify the original
            const command: any = this.EightBitter.utilities.proliferate(
                {
                    noBoundaryStretch: true,
                    areaName: area.name,
                    mapName: area.map.name
                },
                creation);

            command.x = (command.x || 0) + x;
            command.y = (command.y || 0) + y;

            // Having an entrance might conflict with previously set Locations
            if ("entrance" in command) {
                delete command.entrance;
            }

            this.EightBitter.MapsCreator.analyzePreSwitch(command, prethingsCurrent, areaCurrent, mapCurrent);
        }

        this.EightBitter.AreaSpawner.spawnArea(
            DirectionSpawns[direction],
            this.EightBitter.QuadsKeeper.top / this.EightBitter.unitsize,
            this.EightBitter.QuadsKeeper.right / this.EightBitter.unitsize,
            this.EightBitter.QuadsKeeper.bottom / this.EightBitter.unitsize,
            this.EightBitter.QuadsKeeper.left / this.EightBitter.unitsize);
        this.addAreaGate(thing, area, x, y);

        area.spawned = true;
        this.EightBitter.physics.killNormal(thing);
    }

    /**
     * Adds an AreaGate on top of an AreaSpawner.
     * 
     * @param thing   An AreaSpawner that should have a gate.
     * @param area   The Area to spawn into.
     * @param offsetX   Horizontal spawning offset for the Area.
     * @param offsetY   Vertical spawning offset for the Area.
     * @returns The added AreaGate.
     */
    public addAreaGate(thing: IAreaSpawner, area: IArea, offsetX: number, offsetY: number): IAreaGate {
        const properties: any = {
            area: thing.area,
            areaOffsetX: offsetX,
            areaOffsetY: offsetY,
            direction: thing.direction,
            height: 8,
            map: thing.map,
            width: 8
        };
        let left: number = thing.left;
        let top: number = thing.top;

        switch (thing.direction) {
            case Direction.Top:
                top -= this.EightBitter.unitsize * 8;
                properties.width = area.width;
                break;

            case Direction.Right:
                properties.height = area.height;
                break;

            case Direction.Bottom:
                properties.width = area.width;
                break;

            case Direction.Left:
                left -= this.EightBitter.unitsize * 8;
                properties.height = area.height;
                break;

            default:
                throw new Error(`Unknown direction: '${thing.direction}'.`);
        }

        return this.EightBitter.things.add(["AreaGate", properties], left, top) as IAreaGate;
    }
}
