import { Maps as GameStartrMaps } from "gamestartr/lib/Maps";
import { IPreThingsContainers } from "mapscreatr/lib/IMapsCreatr";

import { Direction, DirectionSpawns } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import {
    IArea, IAreaBoundaries, IAreaGate, IareaSpawner, ILocation,
    IMap, IPlayer, IPreThing, IThing
} from "./IFullScreenPokemon";

/**
 * Map functions used by FullScreenPokemon instances.
 */
export class Maps<TEightBittr extends FullScreenPokemon> extends GameStartrMaps<TEightBittr> {
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
                this.eightBitter.utilities.proliferate(area, attributes[attribute]);
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

        thing.areaName = thing.areaName || this.eightBitter.areaSpawner.getAreaName();
        thing.mapName = thing.mapName || this.eightBitter.areaSpawner.getMapName();

        this.eightBitter.things.add(
            thing,
            prething.left * this.eightBitter.unitsize - this.eightBitter.mapScreener.left,
            prething.top * this.eightBitter.unitsize - this.eightBitter.mapScreener.top,
            true);

        // Either the prething or thing, in that order, may request to be in the
        // front or back of the container
        if (position) {
            this.eightBitter.timeHandler.addEvent((): void => {
                switch (position) {
                    case "beginning":
                        this.eightBitter.utilities.arrayToBeginning(
                            thing, this.eightBitter.groupHolder.getGroup(thing.groupType) as IThing[]);
                        break;
                    case "end":
                        this.eightBitter.utilities.arrayToEnd(
                            thing, this.eightBitter.groupHolder.getGroup(thing.groupType) as IThing[]);
                        break;
                    default:
                        throw new Error("Unknown position: " + position + ".");
                }
            });
        }

        this.eightBitter.modAttacher.fireEvent("onAddPreThing", prething);
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
        const player: IPlayer = this.eightBitter.player = this.eightBitter.objectMaker.make("Player");
        player.keys = player.getKeys();

        this.eightBitter.inputWriter.setEventInformation(player);

        this.eightBitter.things.add(player, left || 0, top || 0, useSavedInfo);

        this.eightBitter.modAttacher.fireEvent("onAddPlayer", player);

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
            name = this.eightBitter.areaSpawner.getMapName();
        }

        const map: IMap = this.eightBitter.areaSpawner.setMap(name) as IMap;

        this.eightBitter.modAttacher.fireEvent("onPreSetMap", map);
        this.eightBitter.numberMaker.resetFromSeed(map.seed);
        this.eightBitter.inputWriter.restartHistory();
        this.eightBitter.modAttacher.fireEvent("onSetMap", map);

        this.setLocation(
            location
            || map.locationDefault
            || this.eightBitter.moduleSettings.maps.locationDefault,
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

        this.eightBitter.audioPlayer.clearAll();
        this.eightBitter.groupHolder.clearArrays();
        this.eightBitter.mapScreener.clearScreen();
        this.eightBitter.menuGrapher.deleteAllMenus();
        this.eightBitter.timeHandler.cancelAllEvents();

        this.eightBitter.areaSpawner.setLocation(name);
        this.eightBitter.mapScreener.setVariables();

        const location: ILocation = this.eightBitter.areaSpawner.getLocation(name) as ILocation;
        location.area.spawnedBy = {
            name: name,
            timestamp: new Date().getTime()
        };

        this.eightBitter.modAttacher.fireEvent("onPreSetLocation", location);

        this.eightBitter.pixelDrawer.setBackground((this.eightBitter.areaSpawner.getArea() as IArea).background);

        if (location.area.map.name !== "Blank") {
            this.eightBitter.itemsHolder.setItem("map", location.area.map.name);
            this.eightBitter.itemsHolder.setItem("area", location.area.name);
            this.eightBitter.itemsHolder.setItem("location", name);
        }
        this.eightBitter.stateHolder.setCollection(location.area.map.name + "::" + location.area.name);

        this.eightBitter.quadsKeeper.resetQuadrants();

        const theme: string = location.theme || location.area.theme || location.area.map.theme;

        this.eightBitter.mapScreener.theme = theme;
        if (theme && this.eightBitter.audioPlayer.getThemeName() !== theme) {
            this.eightBitter.audioPlayer.playTheme(theme);
        }

        if (!noEntrance && location.entry) {
            location.entry.call(this, location);
        }

        this.eightBitter.modAttacher.fireEvent("onSetLocation", location);

        this.eightBitter.gamesRunner.play();

        this.eightBitter.animations.animateFadeFromColor({
            color: "Black"
        });

        if (location.push) {
            this.eightBitter.animations.animateCharacterStartWalking(
                this.eightBitter.player,
                this.eightBitter.player.direction,
                (): void => this.eightBitter.storage.autoSave());
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
        const prethings: any = this.eightBitter.areaSpawner.getPreThings();
        const area: IArea = this.eightBitter.areaSpawner.getArea() as IArea;
        const map: IMap = this.eightBitter.areaSpawner.getMap() as IMap;
        const boundaries: IAreaBoundaries = this.eightBitter.areaSpawner.getArea().boundaries as IAreaBoundaries;

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

        this.eightBitter.mapsCreator.analyzePreSwitch(prething, prethings, area, map);
    }

    /**
     * A blank Map entrance Function where no Character is placed.
     */
    public entranceBlank(): void {
        this.addPlayer(0, 0);
        this.eightBitter.player.hidden = true;
    }

    /**
     * Standard Map entrance Function. Character is placed based on specified Location. 
     * 
     * @param location   The name of the Location within the Map.
     */
    public entranceNormal(location: ILocation): void {
        this.addPlayer(
            location.xloc ? location.xloc * this.eightBitter.unitsize : 0,
            location.yloc ? location.yloc * this.eightBitter.unitsize : 0);

        this.eightBitter.animations.animateCharacterSetDirection(
            this.eightBitter.player,
            (typeof location.direction === "undefined"
                ? this.eightBitter.mapScreener.playerDirection
                : location.direction)
            || 0);

        this.eightBitter.scrolling.centerMapScreen();

        if (location.cutscene) {
            this.eightBitter.scenePlayer.startCutscene(location.cutscene, {
                player: this.eightBitter.player
            });
        }

        if (location.routine && this.eightBitter.scenePlayer.getCutsceneName()) {
            this.eightBitter.scenePlayer.playRoutine(location.routine);
        }
    }

    /**
     * Map entrace Function used when player is added to the Map at the beginning 
     * of play. Retrieves Character position from the previous save state.
     */
    public entranceResume(): void {
        const savedInfo: any = this.eightBitter.stateHolder.getChanges("player") || {};

        this.eightBitter.maps.addPlayer(savedInfo.xloc || 0, savedInfo.yloc || 0, true);

        this.eightBitter.animations.animateCharacterSetDirection(this.eightBitter.player, savedInfo.direction || Direction.Top);

        this.eightBitter.scrolling.centerMapScreen();
    }

    /**
     * Runs an areaSpawner to place its Area's Things in the map.
     * 
     * @param thing   An in-game areaSpawner.
     * @param area   The Area associated with thing.
     */
    public activateareaSpawner(thing: IareaSpawner, area: IArea): void {
        const direction: Direction = thing.direction;
        const areaCurrent: IArea = this.eightBitter.areaSpawner.getArea() as IArea;
        const mapCurrent: IMap = this.eightBitter.areaSpawner.getMap() as IMap;
        const prethingsCurrent: IPreThingsContainers = this.eightBitter.areaSpawner.getPreThings();
        let left: number = thing.left + this.eightBitter.mapScreener.left;
        let top: number = thing.top + this.eightBitter.mapScreener.top;

        switch (direction) {
            case Direction.Top:
                top -= area.height * this.eightBitter.unitsize;
                break;

            case Direction.Right:
                left += thing.width * this.eightBitter.unitsize;
                break;

            case Direction.Bottom:
                top += thing.height * this.eightBitter.unitsize;
                break;

            case Direction.Left:
                left -= area.width * this.eightBitter.unitsize;
                break;

            default:
                throw new Error(`Unknown direction: '${direction}'.`);
        }

        const x: number = left / this.eightBitter.unitsize + (thing.offsetX || 0);
        const y: number = top / this.eightBitter.unitsize + (thing.offsetY || 0);

        this.eightBitter.scrolling.expandMapBoundariesForArea(area, x, y);

        for (const creation of area.creation) {
            // A copy of the command must be used, so as to not modify the original
            const command: any = this.eightBitter.utilities.proliferate(
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

            this.eightBitter.mapsCreator.analyzePreSwitch(command, prethingsCurrent, areaCurrent, mapCurrent);
        }

        this.eightBitter.areaSpawner.spawnArea(
            DirectionSpawns[direction],
            this.eightBitter.quadsKeeper.top / this.eightBitter.unitsize,
            this.eightBitter.quadsKeeper.right / this.eightBitter.unitsize,
            this.eightBitter.quadsKeeper.bottom / this.eightBitter.unitsize,
            this.eightBitter.quadsKeeper.left / this.eightBitter.unitsize);
        this.addAreaGate(thing, area, x, y);

        area.spawned = true;
        this.eightBitter.physics.killNormal(thing);
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
                top -= this.eightBitter.unitsize * 8;
                properties.width = area.width;
                break;

            case Direction.Right:
                properties.height = area.height;
                break;

            case Direction.Bottom:
                properties.width = area.width;
                break;

            case Direction.Left:
                left -= this.eightBitter.unitsize * 8;
                properties.height = area.height;
                break;

            default:
                throw new Error(`Unknown direction: '${thing.direction}'.`);
        }

        return this.eightBitter.things.add(["AreaGate", properties], left, top) as IAreaGate;
    }
}
