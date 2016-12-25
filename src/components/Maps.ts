import { Maps as GameStartrMaps } from "gamestartr/lib/Maps";
import { IPreThingsContainers } from "mapscreatr/lib/IMapsCreatr";

import { Direction, DirectionSpawns } from "./Constants";
import {
    IArea, IAreaBoundaries, IAreaGate, IareaSpawner, ILocation,
    IMap, IPlayer, IPreThing, IThing
} from "./IFullScreenPokemon";

/**
 * Map functions used by FullScreenPokemon instances.
 */
export class Maps extends GameStartrMaps {
    /**
     * Processes additional Thing attributes. For each attribute the Area's
     * class says it may have, if it has it, the attribute value proliferated 
     * onto the Area.
     * 
     * @param area The Area being processed.
     */
    public areaProcess(area: IArea): void {
        const attributes: { [i: string]: any } | undefined = area.attributes;
        if (!attributes) {
            return;
        }

        for (const attribute in attributes) {
            if ((area as any)[attribute]) {
                this.utilities.proliferate(area, attributes[attribute]);
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

        thing.areaName = thing.areaName || this.areaSpawner.getAreaName();
        thing.mapName = thing.mapName || this.areaSpawner.getMapName();

        this.things.add(
            thing,
            prething.left * 4 - this.mapScreener.left,
            prething.top * 4 - this.mapScreener.top,
            true);

        // Either the prething or thing, in that order, may request to be in the
        // front or back of the container
        if (position) {
            this.timeHandler.addEvent((): void => {
                switch (position) {
                    case "beginning":
                        this.utilities.arrayToBeginning(
                            thing, this.groupHolder.getGroup(thing.groupType) as IThing[]);
                        break;
                    case "end":
                        this.utilities.arrayToEnd(
                            thing, this.groupHolder.getGroup(thing.groupType) as IThing[]);
                        break;
                    default:
                        throw new Error("Unknown position: " + position + ".");
                }
            });
        }

        this.modAttacher.fireEvent("onAddPreThing", prething);
    }

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
    public addPlayer(left: number = 0, top: number = 0, useSavedInfo?: boolean): IPlayer {
        const player: IPlayer = this.player = this.objectMaker.make("Player");
        player.keys = player.getKeys();

        this.inputWriter.setEventInformation(player);

        this.things.add(player, left || 0, top || 0, useSavedInfo);

        this.modAttacher.fireEvent("onAddPlayer", player);

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
            name = this.areaSpawner.getMapName();
        }

        const map: IMap = this.areaSpawner.setMap(name) as IMap;

        this.modAttacher.fireEvent("onPreSetMap", map);
        this.numberMaker.resetFromSeed(map.seed);
        this.inputWriter.restartHistory();
        this.modAttacher.fireEvent("onSetMap", map);

        this.setLocation(
            location
            || map.locationDefault
            || this.moduleSettings.maps.locationDefault,
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

        this.audioPlayer.clearAll();
        this.groupHolder.clearArrays();
        this.mapScreener.clearScreen();
        this.menuGrapher.deleteAllMenus();
        this.timeHandler.cancelAllEvents();

        this.areaSpawner.setLocation(name);
        this.mapScreener.setVariables();

        const location: ILocation = this.areaSpawner.getLocation(name) as ILocation;
        location.area.spawnedBy = {
            name: name,
            timestamp: new Date().getTime()
        };

        this.modAttacher.fireEvent("onPreSetLocation", location);

        this.pixelDrawer.setBackground((this.areaSpawner.getArea() as IArea).background);

        if (location.area.map.name !== "Blank") {
            this.itemsHolder.setItem("map", location.area.map.name);
            this.itemsHolder.setItem("area", location.area.name);
            this.itemsHolder.setItem("location", name);
        }
        this.stateHolder.setCollection(location.area.map.name + "::" + location.area.name);

        this.quadsKeeper.resetQuadrants();

        const theme: string = location.theme || location.area.theme || location.area.map.theme;

        this.mapScreener.theme = theme;
        if (theme && this.audioPlayer.getThemeName() !== theme) {
            this.audioPlayer.playTheme(theme);
        }

        if (!noEntrance && location.entry) {
            location.entry.call(this, location);
        }

        this.modAttacher.fireEvent("onSetLocation", location);

        this.gamesRunner.play();

        this.animations.animateFadeFromColor({
            color: "Black"
        });

        if (location.push) {
            this.animations.animateCharacterStartWalking(
                this.player,
                this.player.direction,
                (): void => this.storage.autoSave());
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
        const prethings: any = this.areaSpawner.getPreThings();
        const area: IArea = this.areaSpawner.getArea() as IArea;
        const map: IMap = this.areaSpawner.getMap() as IMap;
        const boundaries: IAreaBoundaries = this.areaSpawner.getArea().boundaries as IAreaBoundaries;

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

        this.mapsCreator.analyzePreSwitch(prething, prethings, area, map);
    }

    /**
     * A blank Map entrance Function where no Character is placed.
     */
    public entranceBlank(): void {
        this.addPlayer(0, 0);
        this.player.hidden = true;
    }

    /**
     * Standard Map entrance Function. Character is placed based on specified Location. 
     * 
     * @param location   The name of the Location within the Map.
     */
    public entranceNormal(location: ILocation): void {
        this.addPlayer(
            location.xloc ? location.xloc * 4 : 0,
            location.yloc ? location.yloc * 4 : 0);

        this.animations.animateCharacterSetDirection(
            this.player,
            (typeof location.direction === "undefined"
                ? this.mapScreener.playerDirection
                : location.direction)
            || 0);

        this.scrolling.centerMapScreen();

        if (location.cutscene) {
            this.scenePlayer.startCutscene(location.cutscene, {
                player: this.player
            });
        }

        if (location.routine && this.scenePlayer.getCutsceneName()) {
            this.scenePlayer.playRoutine(location.routine);
        }
    }

    /**
     * Map entrace Function used when player is added to the Map at the beginning 
     * of play. Retrieves Character position from the previous save state.
     */
    public entranceResume(): void {
        const savedInfo: any = this.stateHolder.getChanges("player") || {};

        this.maps.addPlayer(savedInfo.xloc || 0, savedInfo.yloc || 0, true);

        this.animations.animateCharacterSetDirection(this.player, savedInfo.direction || Direction.Top);

        this.scrolling.centerMapScreen();
    }

    /**
     * Runs an areaSpawner to place its Area's Things in the map.
     * 
     * @param thing   An in-game areaSpawner.
     * @param area   The Area associated with thing.
     */
    public activateareaSpawner(thing: IareaSpawner, area: IArea): void {
        const direction: Direction = thing.direction;
        const areaCurrent: IArea = this.areaSpawner.getArea() as IArea;
        const mapCurrent: IMap = this.areaSpawner.getMap() as IMap;
        const prethingsCurrent: IPreThingsContainers = this.areaSpawner.getPreThings();
        let left: number = thing.left + this.mapScreener.left;
        let top: number = thing.top + this.mapScreener.top;

        switch (direction) {
            case Direction.Top:
                top -= area.height * 4;
                break;

            case Direction.Right:
                left += thing.width * 4;
                break;

            case Direction.Bottom:
                top += thing.height * 4;
                break;

            case Direction.Left:
                left -= area.width * 4;
                break;

            default:
                throw new Error(`Unknown direction: '${direction}'.`);
        }

        const x: number = left / 4 + (thing.offsetX || 0);
        const y: number = top / 4 + (thing.offsetY || 0);

        this.scrolling.expandMapBoundariesForArea(area, x, y);

        for (const creation of area.creation) {
            // A copy of the command must be used, so as to not modify the original
            const command: any = this.utilities.proliferate(
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

            this.mapsCreator.analyzePreSwitch(command, prethingsCurrent, areaCurrent, mapCurrent);
        }

        this.areaSpawner.spawnArea(
            DirectionSpawns[direction],
            this.quadsKeeper.top / 4,
            this.quadsKeeper.right / 4,
            this.quadsKeeper.bottom / 4,
            this.quadsKeeper.left / 4);
        this.addAreaGate(thing, area, x, y);

        area.spawned = true;
        this.physics.killNormal(thing);
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
    public addAreaGate(thing: IareaSpawner, area: IArea, offsetX: number, offsetY: number): IAreaGate {
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
                top -= 4 * 8;
                properties.width = area.width;
                break;

            case Direction.Right:
                properties.height = area.height;
                break;

            case Direction.Bottom:
                properties.width = area.width;
                break;

            case Direction.Left:
                left -= 4 * 8;
                properties.height = area.height;
                break;

            default:
                throw new Error(`Unknown direction: '${thing.direction}'.`);
        }

        return this.things.add(["AreaGate", properties], left, top) as IAreaGate;
    }
}
