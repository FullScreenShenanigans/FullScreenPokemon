import { Maps as GameStartrMaps } from "gamestartr/lib/components/Maps";
import { IPreThingsContainers } from "mapscreatr/lib/IMapsCreatr";

import { Direction, DirectionSpawns } from "../Constants";
import { FullScreenPokemon } from "../FullScreenPokemon";
import {
    IArea, IAreaBoundaries, IAreaGate, IareaSpawner, ILocation,
    IMap, IPlayer, IPreThing, IThing
} from "../IFullScreenPokemon";

/**
 * Map functions used by FullScreenPokemon instances.
 */
export class Maps<TGameStartr extends FullScreenPokemon> extends GameStartrMaps<TGameStartr> {

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
                this.gameStarter.utilities.proliferate(area, attributes[attribute]);
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

        thing.areaName = thing.areaName || this.gameStarter.areaSpawner.getAreaName();
        thing.mapName = thing.mapName || this.gameStarter.areaSpawner.getMapName();

        this.gameStarter.things.add(
            thing,
            prething.left * 4 - this.gameStarter.mapScreener.left,
            prething.top * 4 - this.gameStarter.mapScreener.top,
            true);

        // Either the prething or thing, in that order, may request to be in the
        // front or back of the container
        if (position) {
            this.gameStarter.timeHandler.addEvent((): void => {
                switch (position) {
                    case "beginning":
                        this.gameStarter.utilities.arrayToBeginning(
                            thing, this.gameStarter.groupHolder.getGroup(thing.groupType) as IThing[]);
                        break;
                    case "end":
                        this.gameStarter.utilities.arrayToEnd(
                            thing, this.gameStarter.groupHolder.getGroup(thing.groupType) as IThing[]);
                        break;
                    default:
                        throw new Error("Unknown position: " + position + ".");
                }
            });
        }

        this.gameStarter.modAttacher.fireEvent("onAddPreThing", prething);
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
        const player: IPlayer = this.gameStarter.objectMaker.make("Player");
        player.keys = player.getKeys();

        this.gameStarter.players = [player];
        this.gameStarter.inputWriter.setEventInformation(player);
        this.gameStarter.things.add(player, left || 0, top || 0, useSavedInfo);
        this.gameStarter.modAttacher.fireEvent("onAddPlayer", player);

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
            name = this.gameStarter.areaSpawner.getMapName();
        }

        const map: IMap = this.gameStarter.areaSpawner.setMap(name) as IMap;

        this.gameStarter.modAttacher.fireEvent("onPreSetMap", map);
        this.gameStarter.numberMaker.resetFromSeed(map.seed);
        this.gameStarter.inputWriter.restartHistory();
        this.gameStarter.modAttacher.fireEvent("onSetMap", map);

        return this.gameStarter.maps.setLocation(
            location
            || map.locationDefault
            || this.gameStarter.moduleSettings.maps.locationDefault!,
            noEntrance);
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
        this.gameStarter.audioPlayer.clearAll();
        this.gameStarter.groupHolder.clearArrays();
        this.gameStarter.mapScreener.clearScreen();
        this.gameStarter.menuGrapher.deleteAllMenus();
        this.gameStarter.timeHandler.cancelAllEvents();

        this.gameStarter.areaSpawner.setLocation(name);
        this.gameStarter.mapScreener.setVariables();

        const location: ILocation = this.gameStarter.areaSpawner.getLocation(name) as ILocation;
        location.area.spawnedBy = {
            name: name,
            timestamp: new Date().getTime()
        };

        this.gameStarter.modAttacher.fireEvent("onPreSetLocation", location);

        this.gameStarter.pixelDrawer.setBackground((this.gameStarter.areaSpawner.getArea() as IArea).background);

        if (location.area.map.name !== "Blank") {
            this.gameStarter.itemsHolder.setItem("map", location.area.map.name);
            this.gameStarter.itemsHolder.setItem("area", location.area.name);
            this.gameStarter.itemsHolder.setItem("location", name);
        }
        this.gameStarter.stateHolder.setCollection(location.area.map.name + "::" + location.area.name);

        this.gameStarter.quadsKeeper.resetQuadrants();

        const theme: string = location.theme || location.area.theme || location.area.map.theme;

        this.gameStarter.mapScreener.theme = theme;
        if (theme && this.gameStarter.audioPlayer.getThemeName() !== theme) {
            this.gameStarter.audioPlayer.playTheme(theme);
        }

        if (!noEntrance && location.entry) {
            location.entry.call(this, location);
        }

        this.gameStarter.modAttacher.fireEvent("onSetLocation", location);

        this.gameStarter.gamesRunner.play();

        this.gameStarter.actions.animateFadeFromColor({
            color: "Black"
        });

        if (location.push) {
            this.gameStarter.actions.animateCharacterStartWalking(
                this.gameStarter.players[0],
                this.gameStarter.players[0].direction,
                (): void => this.gameStarter.saves.autoSave());
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
    public addAfter(prething: IPreThing, direction: Direction): void {
        const prethings: any = this.gameStarter.areaSpawner.getPreThings();
        const area: IArea = this.gameStarter.areaSpawner.getArea() as IArea;
        const map: IMap = this.gameStarter.areaSpawner.getMap() as IMap;
        const boundaries: IAreaBoundaries = this.gameStarter.areaSpawner.getArea().boundaries as IAreaBoundaries;

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

        this.gameStarter.mapsCreator.analyzePreSwitch(prething, prethings, area, map);
    }

    /**
     * A blank Map entrance Function where no Character is placed.
     */
    public entranceBlank(): void {
        this.addPlayer(0, 0);

        this.gameStarter.players[0].hidden = true;
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

        this.gameStarter.actions.animateCharacterSetDirection(
            this.gameStarter.players[0],
            (typeof location.direction === "undefined"
                ? this.gameStarter.mapScreener.playerDirection
                : location.direction)
            || 0);

        this.gameStarter.scrolling.centerMapScreen();

        if (location.cutscene) {
            this.gameStarter.scenePlayer.startCutscene(location.cutscene, {
                player: this.gameStarter.players[0]
            });
        }

        if (location.routine && this.gameStarter.scenePlayer.getCutsceneName()) {
            this.gameStarter.scenePlayer.playRoutine(location.routine);
        }
    }

    /**
     * Map entrace Function used when player is added to the Map at the beginning 
     * of play. Retrieves Character position from the previous save state.
     */
    public entranceResume(): void {
        const savedInfo: any = this.gameStarter.stateHolder.getChanges("player") || {};

        this.addPlayer(savedInfo.xloc || 0, savedInfo.yloc || 0, true);
        this.gameStarter.actions.animateCharacterSetDirection(this.gameStarter.players[0], savedInfo.direction || Direction.Top);
        this.gameStarter.scrolling.centerMapScreen();
    }

    /**
     * Runs an areaSpawner to place its Area's Things in the map.
     * 
     * @param thing   An in-game areaSpawner.
     * @param area   The Area associated with thing.
     */
    public activateareaSpawner(thing: IareaSpawner, area: IArea): void {
        const direction: Direction = thing.direction;
        const areaCurrent: IArea = this.gameStarter.areaSpawner.getArea() as IArea;
        const mapCurrent: IMap = this.gameStarter.areaSpawner.getMap() as IMap;
        const prethingsCurrent: IPreThingsContainers = this.gameStarter.areaSpawner.getPreThings();
        let left: number = thing.left + this.gameStarter.mapScreener.left;
        let top: number = thing.top + this.gameStarter.mapScreener.top;

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

        this.gameStarter.scrolling.expandMapBoundariesForArea(area, x, y);

        for (const creation of area.creation) {
            // A copy of the command must be used, so as to not modify the original
            const command: any = this.gameStarter.utilities.proliferate(
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

            this.gameStarter.mapsCreator.analyzePreSwitch(command, prethingsCurrent, areaCurrent, mapCurrent);
        }

        this.gameStarter.areaSpawner.spawnArea(
            DirectionSpawns[direction],
            this.gameStarter.quadsKeeper.top / 4,
            this.gameStarter.quadsKeeper.right / 4,
            this.gameStarter.quadsKeeper.bottom / 4,
            this.gameStarter.quadsKeeper.left / 4);
        this.gameStarter.maps.addAreaGate(thing, area, x, y);

        area.spawned = true;
        this.gameStarter.physics.killNormal(thing);
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

        return this.gameStarter.things.add(["AreaGate", properties], left, top) as IAreaGate;
    }
}
