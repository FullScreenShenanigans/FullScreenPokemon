/// <reference path="../typings/GameStartr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import { IArea, IAreaBoundaries, IMap, IPreThing } from "./IFullScreenPokemon";
import { Direction } from "./Constants";

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
        let attributes: { [i: string]: any } = area.attributes;

        for (let attribute in attributes) {
            if (area[attribute]) {
                FullScreenPokemon.prototype.proliferate(area, attributes[attribute]);
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
        let thing: IThing = prething.thing,
            position: string = prething.position || thing.position;

        if (thing.spawned) {
            return;
        }
        thing.spawned = true;

        thing.areaName = thing.areaName || thing.FSP.AreaSpawner.getAreaName();
        thing.mapName = thing.mapName || thing.FSP.AreaSpawner.getMapName();

        thing.FSP.addThing(
            thing,
            prething.left * thing.FSP.unitsize - thing.FSP.MapScreener.left,
            prething.top * thing.FSP.unitsize - thing.FSP.MapScreener.top,
            true);

        // Either the prething or thing, in that order, may request to be in the
        // front or back of the container
        if (position) {
            thing.FSP.TimeHandler.addEvent(function (): void {
                switch (position) {
                    case "beginning":
                        thing.FSP.arrayToBeginning(thing, <any[]>thing.FSP.GroupHolder.getGroup(thing.groupType));
                        break;
                    case "end":
                        thing.FSP.arrayToEnd(thing, <any[]>thing.FSP.GroupHolder.getGroup(thing.groupType));
                        break;
                    default:
                        throw new Error("Unknown position: " + position + ".");
                }
            });
        }

        thing.FSP.ModAttacher.fireEvent("onAddPreThing", prething);
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
    addPlayer(left: number = 0, top: number = 0, useSavedInfo?: boolean): IPlayer {
        let player: IPlayer = this.player = this.ObjectMaker.make("Player");
        player.keys = player.getKeys();

        this.InputWriter.setEventInformation(player);

        this.addThing(player, left || 0, top || 0, useSavedInfo);

        this.ModAttacher.fireEvent("onAddPlayer", player);

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
    setMap(name: string, location?: string, noEntrance?: boolean): void {
        if (typeof name === "undefined" || name.constructor === FullScreenPokemon) {
            name = this.AreaSpawner.getMapName();
        }

        let map: IMap = <IMap>this.AreaSpawner.setMap(name);

        this.ModAttacher.fireEvent("onPreSetMap", map);

        this.NumberMaker.resetFromSeed(map.seed);
        this.InputWriter.restartHistory();

        this.ModAttacher.fireEvent("onSetMap", map);

        this.setLocation(
            location
            || map.locationDefault
            || this.settings.maps.locationDefault,
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
    setLocation(name: string, noEntrance?: boolean): void {
        name = name || "0";

        this.AudioPlayer.clearAll();
        this.GroupHolder.clearArrays();
        this.MapScreener.clearScreen();
        this.MenuGrapher.deleteAllMenus();
        this.TimeHandler.cancelAllEvents();

        this.AreaSpawner.setLocation(name);
        this.MapScreener.setVariables();

        let location: ILocation = <ILocation>this.AreaSpawner.getLocation(name);
        location.area.spawnedBy = {
            "name": name,
            "timestamp": new Date().getTime()
        };

        this.ModAttacher.fireEvent("onPreSetLocation", location);

        this.PixelDrawer.setBackground((<IArea>this.AreaSpawner.getArea()).background);

        this.StateHolder.setCollection(location.area.map.name + "::" + location.area.name);

        this.QuadsKeeper.resetQuadrants();

        let theme: string = location.theme || location.area.theme || location.area.map.theme;
        this.MapScreener.theme = theme;
        if (theme && this.AudioPlayer.getThemeName() !== theme) {
            this.AudioPlayer.playTheme(theme);
        }

        if (!noEntrance) {
            location.entry(this, location);
        }

        this.ModAttacher.fireEvent("onSetLocation", location);

        this.GamesRunner.play();

        this.animateFadeFromColor(this, {
            "color": "Black"
        });

        if (location.push) {
            this.animateCharacterStartWalking(this.player, this.player.direction);
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
            case 0:
                prething.x = boundaries.left;
                prething.y = boundaries.top - 8;
                prething.width = boundaries.right - boundaries.left;
                break;
            case 1:
                prething.x = boundaries.right;
                prething.y = boundaries.top;
                prething.height = boundaries.bottom - boundaries.top;
                break;
            case 2:
                prething.x = boundaries.left;
                prething.y = boundaries.bottom;
                prething.width = boundaries.right - boundaries.left;
                break;
            case 3:
                prething.x = boundaries.left - 8;
                prething.y = boundaries.top;
                prething.height = boundaries.bottom - boundaries.top;
                break;
            default:
                throw new Error("Unknown direction: " + direction + ".");
        }

        this.EightBitter.MapsCreator.analyzePreSwitch(prething, prethings, area, map);
    }

    /**
     * A blank Map entrance Function where no Character is placed.
     * 
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
            location.xloc ? location.xloc * this.EightBitter.unitsize : 0,
            location.yloc ? location.yloc * this.EightBitter.unitsize : 0);

        this.animateCharacterSetDirection(
            this.player,
            (typeof location.direction === "undefined"
                ? this.MapScreener.playerDirection
                : location.direction)
            || 0);

        this.centerMapScreen();

        if (location.cutscene) {
            this.ScenePlayer.startCutscene(location.cutscene, {
                "player": this.player
            });
        }

        if (location.routine && this.ScenePlayer.getCutsceneName()) {
            this.ScenePlayer.playRoutine(location.routine);
        }
    }

    /**
     * Map entrace Function used when player is added to the Map at the beginning 
     * of play. Retrieves Character position from the previous save state.
     */
    public entranceResume(): void {
        let savedInfo: any = this.EightBitter.StateHolder.getChanges("player") || {};

        this.EightBitter.addPlayer(savedInfo.xloc || 0, savedInfo.yloc || 0, true);

        this.animateCharacterSetDirection(this.EightBitter.player, savedInfo.direction || Direction.Top);

        this.EightBitter.scrolling.centerMapScreen();
    }
    
    /**
     * Runs an AreaSpawner to place its Area's Things in the map.
     * 
     * @param thing   An in-game AreaSpawner.
     * @param area   The Area associated with thing.
     */
    public activateAreaSpawner(thing: IAreaSpawner, area: IArea): void {
        let direction: Direction = thing.direction,
            MapsCreator: MapsCreatr.IMapsCreatr = this.MapsCreator,
            AreaSpawner: AreaSpawnr.IAreaSpawnr = this.AreaSpawner,
            QuadsKeeper: QuadsKeepr.IQuadsKeepr = this.QuadsKeeper,
            areaCurrent: IArea = <IArea>AreaSpawner.getArea(),
            mapCurrent: IMap = <IMap>AreaSpawner.getMap(),
            prethingsCurrent: any = AreaSpawner.getPreThings(),
            left: number = thing.left + this.MapScreener.left,
            top: number = thing.top + this.MapScreener.top;

        switch (direction) {
            case 0:
                top -= area.height * this.unitsize;
                break;
            case 1:
                left += thing.width * this.unitsize;
                break;
            case 2:
                top += thing.height * this.unitsize;
                break;
            case 3:
                left -= area.width * this.unitsize;
                break;
            default:
                throw new Error("Unknown direction: " + direction + ".");
        }

        let x: number = left / this.unitsize + (thing.offsetX || 0);
        let y: number = top / this.unitsize + (thing.offsetY || 0);

        this.expandMapBoundariesForArea(area, x, y);

        for (let creation of area.creation) {
            // A copy of the command must be used, so as to not modify the original 
            let command: any = this.proliferate(
                {
                    "noBoundaryStretch": true,
                    "areaName": area.name,
                    "mapName": area.map.name
                },
                creation);

            if (!command.x) {
                command.x = x;
            } else {
                command.x += x;
            }
            if (!command.y) {
                command.y = y;
            } else {
                command.y += y;
            }

            // Having an entrance might conflict with previously set Locations
            if (command.hasOwnProperty("entrance")) {
                delete command.entrance;
            }

            MapsCreator.analyzePreSwitch(command, prethingsCurrent, areaCurrent, mapCurrent);
        }

        AreaSpawner.spawnArea(
            DirectionSpawns[direction],
            QuadsKeeper.top / this.unitsize,
            QuadsKeeper.right / this.unitsize,
            QuadsKeeper.bottom / this.unitsize,
            QuadsKeeper.left / this.unitsize);

        area.spawned = true;
        this.killNormal(thing);
    }
}
