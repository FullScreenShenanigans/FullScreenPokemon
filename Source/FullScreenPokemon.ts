// @echo '/// <reference path="BattleMovr-0.2.0.ts" />'
// @echo '/// <reference path="GameStartr-0.2.0.ts" />'
// @echo '/// <reference path="MenuGraphr-0.2.0.ts" />'
// @echo '/// <reference path="StateHoldr-0.2.0.ts" />'

// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/BattleMovr-0.2.0.ts" />
/// <reference path="References/GameStartr-0.2.0.ts" />
/// <reference path="References/MenuGraphr-0.2.0.ts" />
/// <reference path="References/StateHoldr-0.2.0.ts" />
/// <reference path="FullScreenPokemon.d.ts" />
// @endif

// @include ../Source/FullScreenPokemon.d.ts

module FullScreenPokemon {
    "use strict";

    /**
     * Cardinal directions a Thing may face in-game.
     */
    export enum Direction {
        Top = 0,
        Right = 1,
        Bottom = 2,
        Left = 3
    };

    /**
     * String aliases of directions, keyed by the direction.
     */
    export var DirectionsToAliases: IDirectionsToAliases = [
        "top",
        "right",
        "bottom",
        "left"
    ];

    /**
     * Directions, keyed by their string aliases.
     */
    export var DirectionAliases: IDirectionAliases = {
        top: Direction.Top,
        right: Direction.Right,
        bottom: Direction.Bottom,
        left: Direction.Left
    };

    export class FullScreenPokemon extends GameStartr.GameStartr implements IFullScreenPokemon {
        // For the sake of reset functions, constants are stored as members of the 
        // FullScreenPokemon Function itself - this allows prototype setters to use 
        // them regardless of whether the prototype has been instantiated yet.

        /**
         * Static settings passed to individual reset Functions. Each of these
         * should be filled out separately, after the FullScreenPokemon class
         * has been declared but before an instance has been instantiated.
         */
        public static settings: IFullScreenPokemonStoredSettings = {
            "audio": undefined,
            "battles": undefined,
            "collisions": undefined,
            "devices": undefined,
            "editor": undefined,
            "generator": undefined,
            "groups": undefined,
            "events": undefined,
            "input": undefined,
            "maps": undefined,
            "math": undefined,
            "menus": undefined,
            "mods": undefined,
            "objects": undefined,
            "quadrants": undefined,
            "renderer": undefined,
            "runner": undefined,
            "scenes": undefined,
            "sprites": undefined,
            "states": undefined,
            "statistics": undefined,
            "touch": undefined,
            "ui": undefined
        };

        /**
         * Static unitsize of 4, as that's how Pokemon. is.
         */
        public static unitsize: number = 4;

        /**
         * Static scale of 2, to exand to two pixels per one game pixel.
         */
        public static scale: number = 2;

        /**
         * General statistics each Pokemon actor should have.
         */
        public static statisticNames: string[] = [
            "HP", "Attack", "Defense", "Speed", "Special"
        ];

        /**
         * Quickly tapping direction keys means to look in a direction, not walk.
         */
        public static inputTimeTolerance: number = 4;

        /**
         * The allowed uppercase keys to be shown in a keyboard.
         */
        public static keysUppercase: string[] = [
            "A", "J", "S", "Times", "-",
            "B", "K", "T", "(", "?",
            "C", "L", "U", ")", "!",
            "D", "M", "V", ":", "MaleSymbol",
            "E", "N", "W", ";", "FemaleSymbol",
            "F", "O", "X", "[", "/",
            "G", "P", "Y", "]", ".",
            "H", "Q", "Z", "Poke", ",",
            "I", "R", " ", "Mon", "ED"
        ];



        /*
         * The allowed lowercase keys to be shown in a keyboard.
         */
        public static keysLowercase: string[] = [
            "a", "j", "s", "Times", "-",
            "b", "k", "t", "(", "?",
            "c", "l", "u", ")", "!",
            "d", "m", "v", ":", "MaleSymbol",
            "e", "n", "w", ";", "FemaleSymbol",
            "f", "o", "x", "[", "/",
            "g", "p", "y", "]", ".",
            "h", "q", "z", "Poke", ",",
            "i", "r", " ", "Mon", "ED"
        ];

        /**
         * Overriden MapScreenr refers to the IMapScreenr defined in FullScreenPokemon.d.ts.
         */
        public MapScreener: IMapScreenr;

        /**
         * 
         */
        public StateHolder: StateHoldr.IStateHoldr;

        /**
         * 
         */
        public MenuGrapher: MenuGraphr.IMenuGraphr;

        /**
         * 
         */
        public BattleMover: BattleMovr.IBattleMovr;

        /**
         * Internal reference to the static settings.
         */
        public settings: IFullScreenPokemonStoredSettings = FullScreenPokemon.settings;

        /**
         * Internal reference to the static unitsize.
         */
        public unitsize: number;

        /**
         * Timed result summaries of the constructor, if resetTimed was passed
         * as true. Otherwise, this is undefined.
         */
        public resetTimes: any[];

        /**
         * The game's player, which (when defined) will always be a Player Thing.
         */
        public player: IPlayer;

        /**
         * Constructor for a new FullScreenPokemon game object.
         * Static game settings are stored in the appropriate settings/*.js object
         * as members of the FullScreenPokemon.prototype object.
         * Dynamic game settings may be given as members of the "customs" argument.
         */
        constructor(customs: GameStartr.IGameStartrCustoms) {
            super({
                "constantsSource": FullScreenPokemon,
                "constants": [
                    "unitsize",
                    "scale"
                ],
                "extraResets": [
                    "resetStateHolder",
                    "resetMenuGrapher",
                    "resetBattleMover",
                ]
            });

            if (customs.resetTimed) {
                this.resetTimes = this.resetTimed(this, customs);
            } else {
                this.reset(this, customs);
            }
        }


        /* Resets
        */

        /**
         * Sets this.ObjectMaker.
         * 
         * @param {FullScreenPokemon} FSP
         * @param {Object} customs
         */
        resetObjectMaker(FSP: FullScreenPokemon, customs: GameStartr.IGameStartrCustoms): void {
            FSP.ObjectMaker = new ObjectMakr.ObjectMakr(
                FSP.proliferate(
                    {
                        "properties": {
                            "Quadrant": {
                                "EightBitter": FSP,
                                "GameStarter": FSP,
                                "FSP": FSP
                            },
                            "Thing": {
                                "EightBitter": FSP,
                                "GameStarter": FSP,
                                "FSP": FSP
                            }
                        }
                    },
                    FSP.settings.objects));
        }

        /**
         * Sets this.MathDecider.
         * 
         * @param {FullScreenPokemon} FSP
         * @param {Object} customs
         */
        resetMathDecider(FSP: FullScreenPokemon, customs: GameStartr.IGameStartrCustoms): void {
            FSP.MathDecider = new MathDecidr.MathDecidr(
                FSP.proliferate(
                    {
                        "constants": {
                            "NumberMaker": FSP.NumberMaker,
                            "statisticNames": FullScreenPokemon.statisticNames
                        }
                    },
                    FSP.settings.math));
        }

        /**
         * Sets this.StateHolder.
         * 
         * @param {FullScreenPokemon} FSP
         * @param {Object} customs
         */
        resetStateHolder(FSP: FullScreenPokemon, customs: GameStartr.IGameStartrCustoms): void {
            FSP.StateHolder = new StateHoldr.StateHoldr(
                FSP.proliferate(
                    {
                        "ItemsHolder": FSP.ItemsHolder
                    },
                    FSP.settings.states));
        }

        /**
         * Sets this.MenuGrapher.
         * 
         * @param {FullScreenPokemon} FSP
         * @param {Object} customs
         */
        resetMenuGrapher(FSP: FullScreenPokemon, customs: GameStartr.IGameStartrCustoms): void {
            FSP.MenuGrapher = new MenuGraphr.MenuGraphr(
                FSP.proliferate(
                    {
                        "GameStarter": FSP
                    },
                    FSP.settings.menus));
        }

        /**
         * Sets this.BattleMover.
         * 
         * @param {FullScreenPokemon} FSP
         * @param {Object} customs
         */
        resetBattleMover(FSP: FullScreenPokemon, customs: GameStartr.IGameStartrCustoms): void {
            FSP.BattleMover = new BattleMovr.BattleMovr(
                FSP.proliferate(
                    {
                        "GameStarter": FSP,
                        "MenuGrapher": FSP.MenuGrapher
                    },
                    FSP.settings.battles));
        }

        /**
         * 
         */
        resetContainer(FSP: FullScreenPokemon, customs: GameStartr.IGameStartrCustoms): void {
            super.resetContainer(FSP, customs);

            FSP.container.style.fontFamily = "Press Start";
            FSP.container.className += " FullScreenPokemon";

            FSP.PixelDrawer.setThingArrays([
                <GameStartr.IThing[]>FSP.GroupHolder.getGroup("Terrain"),
                <GameStartr.IThing[]>FSP.GroupHolder.getGroup("Solid"),
                <GameStartr.IThing[]>FSP.GroupHolder.getGroup("Scenery"),
                <GameStartr.IThing[]>FSP.GroupHolder.getGroup("Character"),
                <GameStartr.IThing[]>FSP.GroupHolder.getGroup("Text")
            ]);
        }


        /* Global manipulations
        */

        /**
         * 
         */
        gameStart(): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this);

            // if (EightBitter.ItemsHolder.getItem("gameStarted")) {
            //     EightBitter.gameStartPlay(EightBitter);
            // } else {
            FSP.gameStartOptions(FSP);
            // }
            FSP.ModAttacher.fireEvent("onGameStart");
        }

        /**
         * 
         */
        gameStartOptions(FSP: FullScreenPokemon): void {
            var options: any[] = [
                {
                    "text": "NEW GAME",
                    "callback": FSP.gameStartIntro.bind(FSP, FSP)
                }, {
                    "text": "LOAD FILE",
                    "callback": FSP.gameLoadFile.bind(FSP, FSP)
                    // }, {
                    //     "text": "OPTION"
                }];

            if (FSP.ItemsHolder.getItem("gameStarted")) {
                options.unshift({
                    "text": "CONTINUE",
                    "callback": FSP.gameStartPlay.bind(FSP, FSP)
                });
            }

            FSP.setMap("Blank");
            FSP.MenuGrapher.createMenu("StartOptions");
            FSP.MenuGrapher.addMenuList("StartOptions", {
                "options": options
            });
            FSP.MenuGrapher.setActiveMenu("StartOptions");
        }

        /**
         * 
         */
        gameStartPlay(FSP: FullScreenPokemon): void {
            FSP.MenuGrapher.deleteActiveMenu();
            FSP.setMap(
                FSP.ItemsHolder.getItem("map") || FSP.settings.maps.mapDefault,
                FSP.ItemsHolder.getItem("location"),
                true);
            FSP.mapEntranceResume(FSP);

            FSP.ModAttacher.fireEvent("onGameStartPlay");
        }

        /**
         * 
         * 
         */
        gameStartIntro(FSP: FullScreenPokemon): void {
            FSP.ItemsHolder.clear();
            FSP.ScenePlayer.startCutscene("Intro", {
                "disablePauseMenu": true
            });

            FSP.ModAttacher.fireEvent("onGameStartIntro");
        }

        /**
         * 
         */
        gameLoadFile(FSP: FullScreenPokemon): void {
            var dummy: HTMLInputElement = <HTMLInputElement>FSP.createElement(
                "input",
                {
                    "type": "file",
                    "onchange": function (event: LevelEditr.IDataMouseEvent): void {
                        var file: File = (dummy.files || event.dataTransfer.files)[0],
                            reader: FileReader;

                        event.preventDefault();
                        event.stopPropagation();

                        if (!file) {
                            return;
                        }

                        reader = new FileReader();
                        reader.onloadend = function (event: LevelEditr.IDataProgressEvent): void {
                            FSP.gameLoadData(FSP, event.currentTarget.result);
                        };
                        reader.readAsText(file);
                    }
                });

            dummy.click();

            FSP.ModAttacher.fireEvent("onGameStartIntro");
        }

        /**
         * 
         */
        gameLoadData(FSP: FullScreenPokemon, dataRaw: string): void {
            var data: ISaveFile = JSON.parse(dataRaw),
                key: string,
                keyStart: string = "StateHolder::",
                split: string[];

            for (key in data) {
                if (!data.hasOwnProperty(key)) {
                    continue;
                }

                if (key.slice(0, keyStart.length) === keyStart) {
                    split = key.split("::");

                    FSP.StateHolder.setCollection(split[1] + "::" + split[2], data[key]);

                    continue;
                }

                FSP.ItemsHolder.setItem(key, data[key]);
            }

            FSP.MenuGrapher.deleteActiveMenu();
            FSP.gameStartPlay(FSP);
            FSP.ItemsHolder.setItem("gameStarted", true);
        }

        /**
         * Slight addition to the parent thingProcess Function. The Thing's hit
         * check type is cached immediately, and a default id is assigned if an id
         * isn't already present.
         */
        thingProcess(thing: IThing, title: string, settings: any, defaults: any): void {
            super.thingProcess(thing, title, settings, defaults);

            // ThingHittr becomes very non-performant if functions aren't generated
            // for each Thing constructor (optimization does not respect prototypal 
            // inheritance, sadly).
            thing.FSP.ThingHitter.cacheHitCheckType(thing.title, thing.groupType);

            thing.bordering = [undefined, undefined, undefined, undefined];

            if (typeof thing.id === "undefined") {
                thing.id = [
                    thing.FSP.MapsHandler.getMapName(),
                    thing.FSP.MapsHandler.getAreaName(),
                    thing.title,
                    (thing.name || "Anonymous")
                ].join("::");
            }
        }

        /**
         * 
         */
        onGamePlay(FSP: FullScreenPokemon): void {
            console.log("Playing!");
        }

        /**
         * 
         */
        onGamePause(FSP: FullScreenPokemon): void {
            console.log("Paused.");
        }

        /**
         * Overriden Function to adds a new Thing to the game at a given position,
         * relative to the top left corner of the screen. The Thing is also 
         * added to the MapScreener.thingsById container.
         * 
         * @param {Mixed} thingRaw   What type of Thing to add. This may be a String of
         *                           the class title, an Array containing the String
         *                           and an Object of settings, or an actual Thing.
         * @param {Number} [left]   Defaults to 0.
         * @param {Number} [top]   Defaults to 0.
         * @param {Boolean} [useSavedInfo]   Whether an Area's saved info in 
         *                                   StateHolder should be applied to the
         *                                   Thing's position (by default, false).
         */
        addThing(thingRaw: string | IThing | any[], left: number = 0, top: number = 0, useSavedInfo?: boolean): IThing {
            var thing: IThing = <IThing>super.addThing.call(this, thingRaw, left, top);

            if (useSavedInfo) {
                var savedInfo: any = thing.FSP.StateHolder.getChanges(thing.id);

                if (savedInfo) {
                    if (savedInfo.xloc) {
                        thing.FSP.setLeft(
                            thing,
                            thing.FSP.MapScreener.left + savedInfo.xloc * thing.FSP.unitsize);
                    }
                    if (savedInfo.yloc) {
                        thing.FSP.setTop(
                            thing,
                            thing.FSP.MapScreener.top + savedInfo.yloc * thing.FSP.unitsize);
                    }
                }
            }

            if (thing.id) {
                thing.FSP.StateHolder.applyChanges(thing.id, thing);
                thing.FSP.MapScreener.thingsById[thing.id] = thing;
            }

            if (typeof thing.direction !== "undefined") {
                thing.FSP.animateCharacterSetDirection(thing, thing.direction);
            }

            return thing;
        }

        /**
         * Adds a Thing via addPreThing based on the specifications in a PreThing.
         * This is done relative to MapScreener.left and MapScreener.top.
         * 
         * @param {PreThing} prething
         */
        addPreThing(prething: IPreThing): void {
            var thing: IThing = prething.thing,
                position: string = prething.position || thing.position;

            if (thing.spawned) {
                return;
            }
            thing.spawned = true;

            thing.areaName = thing.areaName || thing.FSP.MapsHandler.getAreaName();
            thing.mapName = thing.mapName || thing.FSP.MapsHandler.getMapName();

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
         * 
         */
        addPlayer(left: number = 0, top: number = 0, useSavedInfo?: boolean): IPlayer {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                player: IPlayer;

            left = left || 0;
            top = top || 0;

            player = FSP.player = FSP.ObjectMaker.make("Player");
            player.keys = player.getKeys();

            FSP.InputWriter.setEventInformation(player);

            FSP.addThing(player, left, top, useSavedInfo);

            FSP.ModAttacher.fireEvent("onAddPlayer", player);

            return player;
        }

        /**
         * 
         */
        getThingById(id: string): IThing {
            return FullScreenPokemon.prototype.ensureCorrectCaller(this).MapScreener.thingsById[id];
        }


        /* Inputs
        */

        /**
         * 
         */
        canInputsTrigger(FSP: FullScreenPokemon): boolean {
            return true;
        }

        /**
         * 
         */
        canDirectionsTrigger(FSP: FullScreenPokemon): boolean {
            if (FSP.GamesRunner.getPaused()) {
                return false;
            }

            if (FSP.MenuGrapher.getActiveMenu()) {
                return true;
            }

            return !FSP.MapScreener.blockInputs;
        }

        /**
         * 
         */
        keyDownGeneric(thing: ICharacter, direction: Direction, event?: Event): void {
            switch (direction) {
                case 0:
                    return thing.FSP.keyDownUp(thing, event);
                case 1:
                    return thing.FSP.keyDownRight(thing, event);
                case 2:
                    return thing.FSP.keyDownDown(thing, event);
                case 3:
                    return thing.FSP.keyDownLeft(thing, event);
                default:
                    throw new Error("Unknown direction: " + direction + ".");
            }
        }

        /**
         * 
         * @param {Player} player
         */
        keyDownLeft(thing: ICharacter, event?: Event): void {
            if (!thing.FSP.canDirectionsTrigger(thing.FSP)) {
                return;
            }

            if (thing.player) {
                (<IPlayer>thing).keys[3] = true;
            }

            thing.FSP.TimeHandler.addEvent(
                thing.FSP.keyDownDirectionReal,
                FullScreenPokemon.inputTimeTolerance,
                thing,
                3);


            thing.FSP.ModAttacher.fireEvent("onKeyDownLeft");
        }

        /**
         * 
         * @param {Player} player
         */
        keyDownRight(thing: ICharacter, event?: Event): void {
            if (!thing.FSP.canDirectionsTrigger(thing.FSP)) {
                return;
            }

            if (thing.player) {
                (<IPlayer>thing).keys[1] = true;
            }

            thing.FSP.TimeHandler.addEvent(
                thing.FSP.keyDownDirectionReal,
                FullScreenPokemon.inputTimeTolerance,
                thing,
                1);

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         * @param {Player} player
         */
        keyDownUp(thing: ICharacter, event?: Event): void {
            if (!thing.FSP.canDirectionsTrigger(thing.FSP)) {
                return;
            }

            if (thing.player) {
                (<IPlayer>thing).keys[0] = true;
            }

            thing.FSP.TimeHandler.addEvent(
                thing.FSP.keyDownDirectionReal,
                FullScreenPokemon.inputTimeTolerance,
                thing,
                0);

            thing.FSP.ModAttacher.fireEvent("onKeyDownUpReal");

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         * @param {Player} player
         */
        keyDownDown(thing: ICharacter, event?: Event): void {
            if (!thing.FSP.canDirectionsTrigger(thing.FSP)) {
                return;
            }

            if (thing.player) {
                (<IPlayer>thing).keys[2] = true;
            }

            thing.FSP.TimeHandler.addEvent(
                thing.FSP.keyDownDirectionReal,
                FullScreenPokemon.inputTimeTolerance,
                thing,
                2);

            thing.FSP.ModAttacher.fireEvent("onKeyDownDown");

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         */
        keyDownDirectionReal(thing: ICharacter, direction: Direction): void {
            if (!thing.player || !(<IPlayer>thing).keys[direction]) {
                return;
            }

            if (thing.FSP.MenuGrapher.getActiveMenu()) {
                thing.FSP.MenuGrapher.registerDirection(direction);
            } else if (!thing.FSP.MenuGrapher.getActiveMenu()) {
                if (thing.direction !== direction) {
                    thing.turning = direction;
                }

                if (thing.player) {
                    if ((<IPlayer>thing).canKeyWalking) {
                        thing.FSP.setPlayerDirection(<IPlayer>thing, direction);
                    } else {
                        (<IPlayer>thing).nextDirection = direction;
                    }
                }
            }

            thing.FSP.ModAttacher.fireEvent("onKeyDownDirectionReal", direction);
        }

        /**
         * 
         */
        keyDownA(thing: ICharacter, event?: Event): void {
            if (thing.FSP.GamesRunner.getPaused()) {
                return;
            }

            if (thing.FSP.MenuGrapher.getActiveMenu()) {
                thing.FSP.MenuGrapher.registerA();
            } else if (thing.bordering[thing.direction]) {
                if (thing.bordering[thing.direction].activate) {
                    thing.bordering[thing.direction].activate(
                        thing,
                        thing.bordering[thing.direction]);
                }

                if ((<IPlayer>thing).keys) {
                    (<IPlayer>thing).keys.a = true;
                }
            }

            thing.FSP.ModAttacher.fireEvent("onKeyDownA");

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         */
        keyDownB(thing: ICharacter, event?: Event): void {
            if (thing.FSP.GamesRunner.getPaused()) {
                return;
            }

            if (thing.FSP.MenuGrapher.getActiveMenu()) {
                thing.FSP.MenuGrapher.registerB();
            } else if ((<IPlayer>thing).keys) {
                (<IPlayer>thing).keys.b = true;
            }

            thing.FSP.ModAttacher.fireEvent("onKeyDownB");

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         * @param {Player} player
         */
        keyDownPause(thing: ICharacter, event?: Event): void {
            if (!thing.FSP.GamesRunner.getPaused()) {
                thing.FSP.TimeHandler.addEvent(thing.FSP.GamesRunner.pause, 7, true);
            }

            thing.FSP.ModAttacher.fireEvent("onKeyDownPause");

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         * @param {Player} player
         */
        keyDownMute(thing: ICharacter, event?: Event): void {
            if (thing.FSP.GamesRunner.getPaused()) {
                return;
            }

            thing.FSP.AudioPlayer.toggleMuted();
            thing.FSP.ModAttacher.fireEvent("onKeyDownMute");

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         */
        keyUpGeneric(thing: ICharacter, direction: Direction, event?: Event): void {
            switch (direction) {
                case 0:
                    return thing.FSP.keyUpUp(thing, event);
                case 1:
                    return thing.FSP.keyUpRight(thing, event);
                case 2:
                    return thing.FSP.keyUpDown(thing, event);
                case 3:
                    return thing.FSP.keyUpLeft(thing, event);
                default:
                    throw new Error("Unknown direction: " + direction + ".");
            }
        }

        /**
         * 
         * @param {Player} player
         */
        keyUpLeft(thing: ICharacter, event?: Event): void {
            thing.FSP.ModAttacher.fireEvent("onKeyUpLeft");

            if (thing.player) {
                (<IPlayer>thing).keys[3] = false;

                if ((<IPlayer>thing).nextDirection === 3) {
                    delete (<IPlayer>thing).nextDirection;
                }
            }

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         * @param {Player} player
         */
        keyUpRight(thing: ICharacter, event?: Event): void {
            thing.FSP.ModAttacher.fireEvent("onKeyUpRight");

            if (thing.player) {
                (<IPlayer>thing).keys[1] = false;

                if ((<IPlayer>thing).nextDirection === 1) {
                    delete (<IPlayer>thing).nextDirection;
                }
            }

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         * @param {Player} player
         */
        keyUpUp(thing: ICharacter, event?: Event): void {
            thing.FSP.ModAttacher.fireEvent("onKeyUpUp");

            if (thing.player) {
                (<IPlayer>thing).keys[0] = false;

                if ((<IPlayer>thing).nextDirection === 0) {
                    delete (<IPlayer>thing).nextDirection;
                }
            }

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         * @param {Player} player
         */
        keyUpDown(thing: ICharacter, event?: Event): void {
            thing.FSP.ModAttacher.fireEvent("onKeyUpDown");

            if (thing.player) {
                (<IPlayer>thing).keys[2] = false;

                if ((<IPlayer>thing).nextDirection === 2) {
                    delete (<IPlayer>thing).nextDirection;
                }
            }

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /*
         * 
         */
        keyUpA(thing: ICharacter, event?: Event): void {
            thing.FSP.ModAttacher.fireEvent("onKeyUpA");

            if (thing.player) {
                (<IPlayer>thing).keys.a = false;
            }

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         */
        keyUpB(thing: ICharacter, event?: Event): void {
            thing.FSP.ModAttacher.fireEvent("onKeyUpB");

            if (thing.player) {
                (<IPlayer>thing).keys.b = false;
            }

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         * @param {Player} player
         */
        keyUpPause(thing: ICharacter, event?: Event): void {
            if (thing.FSP.GamesRunner.getPaused()) {
                thing.FSP.GamesRunner.play();
            }
            thing.FSP.ModAttacher.fireEvent("onKeyUpPause");

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }

        /**
         * 
         * @param {Player} player
         */
        mouseDownRight(thing: ICharacter, event?: Event): void {
            thing.FSP.togglePauseMenu(thing);

            thing.FSP.ModAttacher.fireEvent("onMouseDownRight");

            if (event && event.preventDefault) {
                event.preventDefault();
            }
        }


        /* Upkeep maintenance
        */

        /**
         * 
         */
        maintainGeneric(FSP: FullScreenPokemon, things: IThing[]): void {
            var thing: IThing,
                i: number;

            for (i = 0; i < things.length; i += 1) {
                thing = things[i];

                if (!thing.alive) {
                    FSP.arrayDeleteThing(thing, things, i);
                    i -= 1;
                }
            }
        }

        /**
         * 
         */
        maintainCharacters(FSP: FullScreenPokemon, characters: ICharacter[]): void {
            var character: ICharacter,
                i: number;

            for (i = 0; i < characters.length; i += 1) {
                character = characters[i];
                character.FSP.shiftCharacter(character);

                if (character.isMoving) {
                    FSP.shiftBoth(character, character.xvel, character.yvel);
                } else if (character.shouldWalk && !FSP.MenuGrapher.getActiveMenu()) {
                    character.onWalkingStart(character, character.direction);
                    character.shouldWalk = false;
                }

                if (character.grass) {
                    FSP.maintainCharacterGrass(FSP, character, character.grass);
                }

                if (!character.alive && !character.outerOk) {
                    FSP.arrayDeleteThing(character, characters, i);
                    i -= 1;
                    continue;
                }

                FSP.QuadsKeeper.determineThingQuadrants(character);
                FSP.ThingHitter.checkHitsOf[character.title](character);
            }
        }

        /**
         * 
         */
        maintainCharacterGrass(FSP: FullScreenPokemon, thing: ICharacter, other: IGrass): void {
            if (thing.FSP.isThingWithinGrass(thing, other)) {
                thing.FSP.setLeft(thing.shadow, thing.left);
                thing.FSP.setTop(thing.shadow, thing.top);
                if (thing.shadow.className !== thing.className) {
                    thing.FSP.setClass(thing.shadow, thing.className);
                }
            } else {
                thing.FSP.killNormal(thing.shadow);
                thing.canvas.height = thing.height * thing.FSP.unitsize;
                thing.FSP.PixelDrawer.setThingSprite(thing);
                delete thing.shadow;
                delete thing.grass;
            }
        }

        /**
         * 
         */
        maintainPlayer(FSP: FullScreenPokemon, player: IPlayer): void {
            if (!player || !player.alive) {
                return;
            }

            switch (FSP.MapScreener.scrollability) {
                case "horizontal":
                    FSP.scrollWindow(FSP.getHorizontalScrollAmount(FSP));
                    return;
                case "vertical":
                    FSP.scrollWindow(0, FSP.getVerticalScrollAmount(FSP));
                    return;
                case "both":
                    FSP.scrollWindow(
                        FSP.getHorizontalScrollAmount(FSP),
                        FSP.getVerticalScrollAmount(FSP));
                    return;
                default:
                    return;
            }
        }

        getHorizontalScrollAmount(FSP: FullScreenPokemon): number {
            if (!FSP.player.xvel) {
                return 0;
            }

            if (FSP.player.xvel > 0) {
                return FSP.player.bordering[1] ? 0 : FSP.player.xvel;
            } else {
                return FSP.player.bordering[3] ? 0 : FSP.player.xvel;
            }
        }

        getVerticalScrollAmount(FSP: FullScreenPokemon): number {
            if (!FSP.player.yvel) {
                return 0;
            }

            if (FSP.player.yvel > 0) {
                return FSP.player.bordering[2] ? 0 : FSP.player.yvel;
            } else {
                return FSP.player.bordering[0] ? 0 : FSP.player.yvel;
            }
        }


        /* General animations
        */

        /**
         * 
         */
        animateSnapToGrid(thing: IThing): void {
            var grid: number = thing.FSP.unitsize * 8,
                x: number = (thing.FSP.MapScreener.left + thing.left) / grid,
                y: number = (thing.FSP.MapScreener.top + thing.top) / grid;

            thing.FSP.setLeft(thing, Math.round(x) * grid - thing.FSP.MapScreener.left);
            thing.FSP.setTop(thing, Math.round(y) * grid - thing.FSP.MapScreener.top);
        }

        /**
         * 
         */
        animatePlayerDialogFreeze(thing: ICharacter): void {
            thing.FSP.animateCharacterPreventWalking(thing);

            thing.FSP.TimeHandler.cancelClassCycle(thing, "walking");
            if (thing.walkingFlipping) {
                thing.FSP.TimeHandler.cancelEvent(thing.walkingFlipping);
            }
        }

        /**
         * 
         */
        animateFadeAttribute(
            thing: IThing,
            attribute: string,
            change: number,
            goal: number,
            speed: number,
            onCompletion?: (thing: IThing) => void): void {

            thing[attribute] += change;

            if (change > 0) {
                if (thing[attribute] >= goal) {
                    thing[attribute] = goal;
                    if (typeof onCompletion === "function") {
                        onCompletion(thing);
                    }
                    return;
                }
            } else {
                if (thing[attribute] <= goal) {
                    thing[attribute] = goal;
                    if (typeof onCompletion === "function") {
                        onCompletion(thing);
                    }
                    return;
                }
            }

            thing.FSP.TimeHandler.addEvent(
                thing.FSP.animateFadeAttribute,
                speed,
                thing,
                attribute,
                change,
                goal,
                speed,
                onCompletion);
        }

        /**
         * 
         */
        animateFadeHorizontal(
            thing: IThing,
            change: number,
            goal: number,
            speed: number,
            onCompletion?: (thing: IThing) => void): void {
            thing.FSP.shiftHoriz(thing, change);

            if (change > 0) {
                if (thing.FSP.getMidX(thing) >= goal) {
                    thing.FSP.setMidX(thing, goal);
                    if (onCompletion) {
                        onCompletion(thing);
                    }
                    return;
                }
            } else {
                if (thing.FSP.getMidX(thing) <= goal) {
                    thing.FSP.setMidX(thing, goal);
                    if (onCompletion) {
                        onCompletion(thing);
                    }
                    return;
                }
            }

            thing.FSP.TimeHandler.addEvent(
                thing.FSP.animateFadeHorizontal,
                speed,
                thing,
                change,
                goal,
                speed,
                onCompletion);
        }

        /**
         * 
         */
        animateFadeVertical(
            thing: IThing,
            change: number,
            goal: number,
            speed: number,
            onCompletion?: (thing: IThing) => void): void {
            thing.FSP.shiftVert(thing, change);

            if (change > 0) {
                if (thing.FSP.getMidY(thing) >= goal) {
                    thing.FSP.setMidY(thing, goal);
                    if (onCompletion) {
                        onCompletion(thing);
                    }
                    return;
                }
            } else {
                if (thing.FSP.getMidY(thing) <= goal) {
                    thing.FSP.setMidY(thing, goal);
                    if (onCompletion) {
                        onCompletion(thing);
                    }
                    return;
                }
            }

            thing.FSP.TimeHandler.addEvent(
                thing.FSP.animateFadeVertical,
                speed,
                thing,
                change,
                goal,
                speed,
                onCompletion);
        }

        /**
         * 
         */
        animateGrassBattleStart(thing: ICharacter, grass: IThing): void {
            var grassMap: IMap = <IMap>thing.FSP.MapsHandler.getMap(grass.mapName),
                grassArea: IArea = <IArea>grassMap.areas[grass.areaName],
                options: IPokemonSchema[] = grassArea.wildPokemon.grass,
                chosen: IPokemonSchema = thing.FSP.chooseRandomWildPokemon(thing.FSP, options),
                chosenPokemon: BattleMovr.IActor = thing.FSP.createPokemon(chosen);

            thing.FSP.removeClass(thing, "walking");
            if (thing.shadow) {
                thing.FSP.removeClass(thing.shadow, "walking");
            }

            thing.FSP.animateCharacterPreventWalking(thing);

            thing.FSP.startBattle({
                "opponent": {
                    "actors": [chosenPokemon],
                    "category": "Wild",
                    "name": chosen.title,
                    "sprite": chosen.title + "Front"
                }
            });
        }

        /**
         * 
         */
        animateTrainerBattleStart(thing: ICharacter, other: IEnemy): void {
            var battleName: string = other.battleName || other.title,
                battleSprite: string = other.battleSprite || battleName;

            thing.FSP.startBattle({
                "opponent": {
                    "name": battleName,
                    "sprite": battleSprite + "Front",
                    "category": "Trainer",
                    "hasActors": true,
                    "reward": other.reward,
                    "actors": <BattleMovr.IActor[]>other.actors.map(thing.FSP.createPokemon.bind(thing.FSP))
                },
                "textStart": ["", " wants to fight!"],
                "textDefeat": other.textDefeat,
                "textAfterBattle": other.textAfterBattle,
                "giftAfterBattle": other.giftAfterBattle,
                "badge": other.badge,
                "textVictory": other.textVictory,
                "nextCutscene": other.nextCutscene
            });
        }

        /**
         * 
         */
        animatePlayerLeaveLeft(thing: IPlayer, callback?: (thing: IPlayer) => void): void {
            var width: number = thing.width,
                dt: number = 3,
                dx: number = -thing.FSP.unitsize * 4;

            thing.FSP.TimeHandler.addEventInterval(
                thing.FSP.shiftHoriz, dt, width, thing, dx
            );

            console.log("Should implement collapseLeft...");
            // thing.FSP.TimeHandler.addEventInterval(
            //     thing.FSP.collapseLeft, speed, width, thing, dx
            // );

            if (callback) {
                thing.FSP.TimeHandler.addEvent(
                    callback,
                    (width * (dt + 2)),
                    thing);
            }
        }

        /**
         * 
         */
        animateThingCorners(
            FSP: FullScreenPokemon,
            x: number,
            y: number,
            title: string,
            settings: any,
            groupType: string): IThing[] {

            var things: IThing[] = [],
                i: number;

            for (i = 0; i < 4; i += 1) {
                things.push(FSP.addThing([title, settings]));
            }

            if (groupType) {
                for (i = 0; i < things.length; i += 1) {
                    things[0].FSP.GroupHolder.switchObjectGroup(
                        things[i],
                        things[i].groupType,
                        groupType);
                }
            }

            FSP.setLeft(things[0], x);
            FSP.setLeft(things[1], x);

            FSP.setRight(things[2], x);
            FSP.setRight(things[3], x);

            FSP.setBottom(things[0], y);
            FSP.setBottom(things[3], y);

            FSP.setTop(things[1], y);
            FSP.setTop(things[2], y);

            FSP.flipHoriz(things[0]);
            FSP.flipHoriz(things[1]);

            FSP.flipVert(things[1]);
            FSP.flipVert(things[2]);

            return things;
        }

        /**
         * 
         */
        animateExpandCorners(things: IThing[], amount: number): void {
            var FSP: FullScreenPokemon = things[0].FSP;

            FSP.shiftHoriz(things[0], amount);
            FSP.shiftHoriz(things[1], amount);
            FSP.shiftHoriz(things[2], -amount);
            FSP.shiftHoriz(things[3], -amount);

            FSP.shiftVert(things[0], -amount);
            FSP.shiftVert(things[1], amount);
            FSP.shiftVert(things[2], amount);
            FSP.shiftVert(things[3], -amount);
        }

        /**
         * 
         */
        animateSmokeSmall(FSP: FullScreenPokemon, x: number, y: number, callback: (thing: IThing) => void): void {
            var things: IThing[] = FSP.animateThingCorners(FSP, x, y, "SmokeSmall", undefined, "Text");

            FSP.TimeHandler.addEvent(things.forEach.bind(things), 7, FSP.killNormal);

            FSP.TimeHandler.addEvent(FSP.animateSmokeMedium, 7, FSP, x, y, callback);
        }

        /**
         * 
         */
        animateSmokeMedium(FSP: FullScreenPokemon, x: number, y: number, callback: (thing: IThing) => void): void {
            var things: IThing[] = FSP.animateThingCorners(FSP, x, y, "SmokeMedium", undefined, "Text");

            FSP.TimeHandler.addEvent(FSP.animateExpandCorners, 7, things, FSP.unitsize);

            FSP.TimeHandler.addEvent(things.forEach.bind(things), 14, FSP.killNormal);

            FSP.TimeHandler.addEvent(FSP.animateSmokeLarge, 14, FSP, x, y, callback);
        }

        /**
         * 
         */
        animateSmokeLarge(FSP: FullScreenPokemon, x: number, y: number, callback: (thing: IThing) => void): void {
            var things: IThing[] = FSP.animateThingCorners(FSP, x, y, "SmokeLarge", undefined, "Text");

            FSP.animateExpandCorners(things, FSP.unitsize * 2.5);

            FSP.TimeHandler.addEvent(
                FSP.animateExpandCorners,
                7,
                things,
                FSP.unitsize * 2);

            FSP.TimeHandler.addEvent(things.forEach.bind(things), 21, FSP.killNormal);

            if (callback) {
                FSP.TimeHandler.addEvent(callback, 21);
            }
        }

        /**
         * 
         */
        animateExclamation(thing: IThing, timeout: number = 140, callback?: () => void): IThing {
            var exclamation: IThing = thing.FSP.addThing("Exclamation");

            timeout = timeout || 140;

            thing.FSP.setMidXObj(exclamation, thing);
            thing.FSP.setBottom(exclamation, thing.top);

            thing.FSP.TimeHandler.addEvent(thing.FSP.killNormal, timeout, exclamation);

            if (callback) {
                thing.FSP.TimeHandler.addEvent(callback, timeout);
            }

            return exclamation;
        }

        /**
         * 
         */
        animateFadeToColor(FSP: FullScreenPokemon, settings: any = {}): IThing {
            var color: string = settings.color || "White",
                callback: (...args: any[]) => void = settings.callback,
                change: number = settings.change || .33,
                blank: IThing = FSP.ObjectMaker.make(color + "Square", {
                    "width": FSP.MapScreener.width,
                    "height": FSP.MapScreener.height,
                    "opacity": 0
                }),
                args: IArguments = arguments;

            FSP.addThing(blank);

            FSP.animateFadeAttribute(
                blank,
                "opacity",
                change,
                1,
                4,
                function (): void {
                    FSP.killNormal(blank);
                    if (callback) {
                        callback.apply(this, args);
                    }
                });

            return blank;
        }

        /**
         * 
         */
        animateFadeFromColor(FSP: FullScreenPokemon, settings?: any): IThing {
            var color: string = settings.color || "White",
                callback: (...args: any[]) => void = settings.callback,
                change: number = settings.change || .33,
                speed: number = settings.speed || 4,
                blank: IThing = FSP.ObjectMaker.make(color + "Square", {
                    "width": FSP.MapScreener.width,
                    "height": FSP.MapScreener.height,
                    "opacity": 1
                }),
                args: IArguments = arguments;

            FSP.addThing(blank);

            FSP.animateFadeAttribute(
                blank,
                "opacity",
                -change,
                0,
                speed,
                function (): void {
                    FSP.killNormal(blank);
                    if (callback) {
                        callback.apply(this, args);
                    }
                });

            return blank;
        }

        /**
         * Animates a "flicker" effect on a Thing by repeatedly toggling its hidden
         * flag for a little while.
         * 
         * @param {Thing} thing
         * @param {Number} [cleartime]   How long to wait to stop the effect (by 
         *                               default, 49).
         * @param {Number} [interval]   How many steps between hidden toggles (by
         *                              default, 2).
         * @param {Function} [callback]   A Function that may be called on the Thing
         *                                when flickering is done.
         */
        animateFlicker(thing: IThing, cleartime: number = 49, interval: number = 2, callback?: (thing: IThing) => void): void {
            var timeTotal: number = ((cleartime * interval) | 0) + 1;

            thing.flickering = true;

            thing.FSP.TimeHandler.addEventInterval(
                function (): void {
                    thing.hidden = !thing.hidden;
                    if (!thing.hidden) {
                        thing.FSP.PixelDrawer.setThingSprite(thing);
                    }
                },
                interval | 0,
                cleartime | 0);

            thing.FSP.TimeHandler.addEvent(
                function (): void {
                    thing.flickering = thing.hidden = false;
                    thing.FSP.PixelDrawer.setThingSprite(thing);

                    if (callback) {
                        callback(thing);
                    }
                },
                timeTotal);
        }

        /**
         * 
         */
        animateScreenShake(
            FSP: FullScreenPokemon,
            dx: number = 0,
            dy: number = 0,
            cleartime: number = 8,
            interval: number = 8,
            callback?: TimeHandlr.IEventCallback): void {

            var intervalEnd: number = (interval / 2) | 0;

            FSP.TimeHandler.addEventInterval(
                function (): void {
                    FSP.GroupHolder.callOnAll(FSP, FSP.shiftHoriz, dx);
                    FSP.GroupHolder.callOnAll(FSP, FSP.shiftVert, dy);
                },
                1,
                cleartime * interval);

            FSP.TimeHandler.addEvent(
                function (): void {
                    dx *= -1;
                    dy *= -1;

                    FSP.TimeHandler.addEventInterval(
                        function (): void {
                            dx *= -1;
                            dy *= -1;
                        },
                        interval,
                        cleartime);

                    if (callback) {
                        FSP.TimeHandler.addEvent(callback, interval * cleartime, FSP);
                    }
                },
                intervalEnd);
        }


        /* Character movement animations
        */

        /**
         * 
         */
        animateCharacterSetDistanceVelocity(thing: ICharacter, distance: number): void {
            thing.distance = distance;

            switch (thing.direction) {
                case 0:
                    thing.xvel = 0;
                    thing.yvel = -thing.speed;
                    thing.destination = thing.top - distance;
                    break;
                case 1:
                    thing.xvel = thing.speed;
                    thing.yvel = 0;
                    thing.destination = thing.right + distance;
                    break;
                case 2:
                    thing.xvel = 0;
                    thing.yvel = thing.speed;
                    thing.destination = thing.bottom + distance;
                    break;
                case 3:
                    thing.xvel = -thing.speed;
                    thing.yvel = 0;
                    thing.destination = thing.left - distance;
                    break;
                default:
                    throw new Error("Unknown direction: " + thing.direction + ".");
            }
        }

        /**
         * 
         */
        animateCharacterStartTurning(thing: ICharacter, direction: Direction, onStop: any): void {
            if (onStop.length === 0) {
                return;
            }

            if (onStop[0] === 0) {
                if (onStop.length > 1) {
                    if (typeof onStop[1] === "function") {
                        onStop[1](thing);
                        return;
                    }

                    thing.FSP.animateCharacterSetDirection(thing, DirectionAliases[onStop[1]]);

                    thing.FSP.animateCharacterStartTurning(
                        thing,
                        DirectionAliases[onStop[1]],
                        onStop.slice(2));
                }

                return;
            }

            if (thing.follower) {
                thing.walkingCommands.push(direction);
            }

            thing.FSP.animateCharacterStartWalking(thing, direction, onStop);

            thing.FSP.shiftBoth(thing, -thing.xvel, -thing.yvel);
        }

        /**
         * 
         */
        animateCharacterStartWalking(thing: ICharacter, direction: Direction, onStop?: any): void {
            var repeats: number = thing.FSP.getCharacterWalkingInterval(thing),
                distance: number = repeats * thing.speed;

            direction = direction || 0;
            thing.FSP.animateCharacterSetDirection(thing, direction);
            thing.FSP.animateCharacterSetDistanceVelocity(thing, distance);

            if (!thing.cycles || !thing.cycles.walking) {
                thing.FSP.TimeHandler.addClassCycle(
                    thing,
                    ["walking", "standing"],
                    "walking",
                    repeats / 2);
            }

            if (!thing.walkingFlipping) {
                thing.walkingFlipping = thing.FSP.TimeHandler.addEventInterval(
                    thing.FSP.animateSwitchFlipOnDirection, repeats, Infinity, thing);
            }

            if (thing.sight) {
                thing.sightDetector.nocollide = true;
            }

            thing.FSP.TimeHandler.addEventInterval(
                thing.onWalkingStop, repeats, Infinity, thing, onStop);

            thing.FSP.shiftBoth(thing, thing.xvel, thing.yvel);
        }

        /**
         * 
         */
        animateCharacterStartWalkingRandom(thing: ICharacter): void {
            var totalAllowed: number = 0,
                direction: Direction,
                i: number;

            for (i = 0; i < 4; i += 1) {
                if (!thing.bordering[i]) {
                    totalAllowed += 1;
                }
            }

            if (totalAllowed === 0) {
                return;
            }

            direction = thing.FSP.NumberMaker.randomInt(totalAllowed);

            for (i = 0; i <= direction; i += 1) {
                if (thing.bordering[i]) {
                    direction += 1;
                }
            }

            if (thing.roamingDirections.indexOf(direction) === -1) {
                thing.FSP.animateCharacterSetDirection(thing, direction);
            } else {
                thing.FSP.animateCharacterStartWalking(thing, direction);
            }
        }

        /**
         * 
         */
        animatePlayerStartWalking(thing: IPlayer): void {
            if (typeof thing.turning !== "undefined") {
                if (!thing.keys[thing.turning]) {
                    thing.FSP.animateCharacterSetDirection(thing, thing.turning);
                    thing.turning = undefined;
                    return;
                }
                thing.turning = undefined;
            }

            thing.canKeyWalking = false;
            thing.FSP.animateCharacterStartWalking(thing, thing.direction);
        }

        /**
         * 
         */
        animateCharacterSetDirection(thing: IThing, direction: Direction): void {
            thing.direction = direction;

            if (direction !== 1) {
                thing.FSP.unflipHoriz(thing);
            } else {
                thing.FSP.flipHoriz(thing);
            }

            thing.FSP.removeClasses(thing, "up left down");

            switch (direction) {
                case 0:
                    thing.FSP.addClass(thing, "up");
                    break;
                case 1:
                    thing.FSP.addClass(thing, "left");
                    break;
                case 2:
                    thing.FSP.addClass(thing, "down");
                    break;
                case 3:
                    thing.FSP.addClass(thing, "left");
                    break;
                default:
                    throw new Error("Unknown direction: " + direction + ".");
            }
        }

        /**
         * 
         */
        animateCharacterSetDirectionRandom(thing: ICharacter): void {
            thing.FSP.animateCharacterSetDirection(thing, thing.FSP.NumberMaker.randomIntWithin(0, 3));
        }

        /**
         * 
         */
        animateCharacterStopWalking(thing: ICharacter, onStop?: any): boolean {
            thing.xvel = 0;
            thing.yvel = 0;

            thing.FSP.removeClass(thing, "walking");
            thing.FSP.TimeHandler.cancelClassCycle(thing, "walking");

            if (thing.walkingFlipping) {
                thing.FSP.TimeHandler.cancelEvent(thing.walkingFlipping);
                thing.walkingFlipping = undefined;
            }

            thing.FSP.animateSnapToGrid(thing);

            if (thing.sight) {
                thing.sightDetector.nocollide = false;
                thing.FSP.animatePositionSightDetector(thing);
            }

            if (!onStop) {
                return true;
            }

            switch (onStop.constructor) {
                case Number:
                    console.warn("Should this be animateCharacterStartWalking?");
                    thing.FSP.animatePlayerStartWalking(<IPlayer>thing);
                    return true;
                case Array:
                    if (onStop[0] > 0) {
                        onStop[0] -= 1;
                        thing.FSP.animateCharacterStartTurning(thing, thing.direction, onStop);
                    } else if (onStop.length === 0) {
                        return true;
                    } else {
                        if (onStop[1] instanceof Function) {
                            return onStop[1](thing);
                        }
                        thing.FSP.animateCharacterStartTurning(
                            thing,
                            DirectionAliases[onStop[1]],
                            onStop.slice(2));
                    }
                    return true;
                case Function:
                    return (<any>onStop)(thing);
                default:
                    throw new Error("Unknown onStop: " + onStop + ".");
            }
        }

        /**
         * 
         */
        animatePlayerStopWalking(thing: IPlayer, onStop: any): boolean {
            if (thing.FSP.checkPlayerGrassBattle(thing)) {
                return;
            }

            if (thing.following) {
                return thing.FSP.animateCharacterStopWalking(thing, onStop);
            }

            if (
                !thing.FSP.MenuGrapher.getActiveMenu()
                && thing.keys[thing.direction]) {
                thing.FSP.animateCharacterSetDistanceVelocity(thing, thing.distance);
                return false;
            } else {
                if (typeof thing.nextDirection !== "undefined") {
                    if (thing.nextDirection !== thing.direction) {
                        thing.FSP.setPlayerDirection(thing, thing.nextDirection);
                    }
                    delete thing.nextDirection;
                }
            }

            thing.canKeyWalking = true;
            return thing.FSP.animateCharacterStopWalking(thing, onStop);
        }

        /**
         * 
         */
        animateCharacterPreventWalking(thing: ICharacter): void {
            thing.isMoving = thing.shouldWalk = false;
            thing.xvel = thing.yvel = 0;

            if (thing.player) {
                (<IPlayer>thing).keys = (<IPlayer>thing).getKeys();
            }

            thing.FSP.MapScreener.blockInputs = true;
        }

        /**
         * 
         */
        animateFlipOnDirection(thing: ICharacter): void {
            if (thing.direction % 2 === 0) {
                thing.FSP.flipHoriz(thing);
            }
        }

        /**
         * 
         */
        animateUnflipOnDirection(thing: ICharacter): void {
            if (thing.direction % 2 === 0) {
                thing.FSP.unflipHoriz(thing);
            }
        }

        /**
         * 
         */
        animateSwitchFlipOnDirection(thing: ICharacter): void {
            if (thing.direction % 2 !== 0) {
                return;
            }

            if (thing.flipHoriz) {
                thing.FSP.unflipHoriz(thing);
            } else {
                thing.FSP.flipHoriz(thing);
            }
        }

        /**
         * 
         */
        animatePositionSightDetector(thing: ICharacter): void {
            var detector: ISightDetector = thing.sightDetector,
                direction: Direction = thing.direction,
                sight: number = Number(thing.sight);

            if (detector.direction !== direction) {
                if (thing.direction % 2 === 0) {
                    thing.FSP.setWidth(detector, thing.width);
                    thing.FSP.setHeight(detector, sight * 8);
                } else {
                    thing.FSP.setWidth(detector, sight * 8);
                    thing.FSP.setHeight(detector, thing.height);
                }
                detector.direction = direction;
            }

            switch (direction) {
                case 0:
                    thing.FSP.setBottom(detector, thing.top);
                    thing.FSP.setMidXObj(detector, thing);
                    break;
                case 1:
                    thing.FSP.setLeft(detector, thing.right);
                    thing.FSP.setMidYObj(detector, thing);
                    break;
                case 2:
                    thing.FSP.setTop(detector, thing.bottom);
                    thing.FSP.setMidXObj(detector, thing);
                    break;
                case 3:
                    thing.FSP.setRight(detector, thing.left);
                    thing.FSP.setMidYObj(detector, thing);
                    break;
                default:
                    throw new Error("Unknown direction: " + direction + ".");
            }
        }

        /**
         * 
         */
        animateCharacterDialogFinish(thing: IPlayer, other: ICharacter): void {
            var onStop: any;

            if (other.pushSteps) {
                onStop = other.pushSteps;
            }

            thing.talking = false;
            other.talking = false;
            thing.canKeyWalking = true;

            if (other.directionPreferred) {
                thing.FSP.animateCharacterSetDirection(other, other.directionPreferred);
            }

            if (other.transport) {
                other.active = true;
                thing.FSP.activateTransporter(thing, <ITransporter><any>other);
                return;
            }

            if (typeof other.pushDirection !== "undefined") {
                thing.FSP.animateCharacterStartTurning(
                    thing, other.pushDirection, onStop
                );
            }

            if (other.gift) {
                thing.FSP.MenuGrapher.createMenu("GeneralText");
                thing.FSP.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        "%%%%%%%PLAYER%%%%%%% got " + other.gift.toUpperCase() + "!"
                    ],
                    thing.FSP.animateCharacterDialogFinish.bind(
                        thing, other
                    )
                );
                thing.FSP.MenuGrapher.setActiveMenu("GeneralText");

                thing.FSP.addItemToBag(thing.FSP, other.gift);

                other.gift = undefined;
                thing.FSP.StateHolder.addChange(other.id, "gift", undefined);

                return;
            }

            if (other.dialogNext) {
                other.dialog = other.dialogNext;
                other.dialogNext = undefined;
                thing.FSP.StateHolder.addChange(other.id, "dialog", other.dialog);
                thing.FSP.StateHolder.addChange(other.id, "dialogNext", undefined);
            }

            if (other.trainer) {
                other.trainer = false;
                thing.FSP.StateHolder.addChange(other.id, "trainer", false);

                if (other.sight) {
                    other.sight = undefined;
                    thing.FSP.StateHolder.addChange(other.id, "sight", undefined);
                }
            }

            if (other.dialogOptions) {
                thing.FSP.animateCharacterDialogOptions(thing, other, other.dialogOptions);
            } else if (other.trainer) {
                thing.FSP.animateTrainerBattleStart(thing, <IEnemy>other);
            }
        }

        /**
         * 
         */
        animateCharacterDialogOptions(thing: IPlayer, other: ICharacter, dialog: IDialog): void {
            var options: IDialogOptions = dialog.options,
                generateCallback: any = function (dialog: string | IDialog): () => void {
                    var callback: (...args: any[]) => void,
                        words: string;

                    if (!dialog) {
                        return undefined;
                    }

                    if (dialog.constructor === Object && (<IDialog>dialog).options) {
                        words = (<IDialog>dialog).words;
                        callback = thing.FSP.animateCharacterDialogOptions.bind(
                            thing.FSP, thing, other, dialog);
                    } else {
                        words = (<IDialog>dialog).words || <string>dialog;
                        if ((<IDialog>dialog).cutscene) {
                            callback = thing.FSP.ScenePlayer.bindCutscene(
                                (<IDialog>dialog).cutscene,
                                {
                                    "player": thing,
                                    "tirggerer": other
                                });
                        }
                    }

                    return function (): void {
                        thing.FSP.MenuGrapher.deleteMenu("Yes/No");
                        thing.FSP.MenuGrapher.createMenu("GeneralText", {
                            // "deleteOnFinish": true
                        });
                        thing.FSP.MenuGrapher.addMenuDialog(
                            "GeneralText", words, callback);
                        thing.FSP.MenuGrapher.setActiveMenu("GeneralText");
                    };
                };

            console.warn("DialogOptions assumes type = Yes/No for now...");

            thing.FSP.MenuGrapher.createMenu("Yes/No", {
                "position": {
                    "offset": {
                        "left": 28
                    }
                }
            });
            thing.FSP.MenuGrapher.addMenuList("Yes/No", {
                "options": [
                    {
                        "text": "YES",
                        "callback": generateCallback(options.Yes)
                    }, {
                        "text": "NO",
                        "callback": generateCallback(options.No)
                    }]
            });
            thing.FSP.MenuGrapher.setActiveMenu("Yes/No");
        }

        /**
         * 
         */
        animateCharacterFollow(thing: ICharacter, other: ICharacter): void {
            var direction: Direction = thing.FSP.getDirectionBordering(thing, other);

            thing.nocollide = true;

            if (thing.player) {
                (<IPlayer>thing).allowDirectionAsKeys = true;
            }

            thing.following = other;
            other.follower = thing;

            thing.speedOld = thing.speed;
            thing.speed = other.speed;

            other.walkingCommands = [direction];

            thing.FSP.animateCharacterSetDirection(thing, direction);

            switch (direction) {
                case 0:
                    thing.FSP.setTop(thing, other.bottom);
                    break;
                case 1:
                    thing.FSP.setRight(thing, other.left);
                    break;
                case 2:
                    thing.FSP.setBottom(thing, other.top);
                    break;
                case 3:
                    thing.FSP.setLeft(thing, other.right);
                    break;
                default:
                    break;
            }

            thing.followingLoop = thing.FSP.TimeHandler.addEventInterval(
                thing.FSP.animateCharacterFollowContinue,
                thing.FSP.getCharacterWalkingInterval(thing),
                Infinity,
                thing,
                other);
        }

        /**
         * 
         */
        animateCharacterFollowContinue(thing: ICharacter, other: ICharacter): void {
            if (other.walkingCommands.length <= 1) {
                return;
            }

            var direction: Direction = other.walkingCommands.shift();

            thing.FSP.animateCharacterStartWalking(thing, direction, 0);
        }

        /**
         * 
         */
        animateCharacterFollowStop(thing: ICharacter): boolean {
            var other: ICharacter = thing.following;
            if (!other) {
                return true;
            }

            thing.nocollide = false;
            delete thing.following;
            delete other.follower;

            thing.FSP.animateCharacterStopWalking(thing);
            thing.FSP.TimeHandler.cancelEvent(thing.followingLoop);
        }

        /**
         * 
         */
        getCharacterWalkingInterval(thing: ICharacter): number {
            return Math.round(8 * thing.FSP.unitsize / thing.speed);
        }

        /**
         * 
         */
        animateCharacterHopLedge(thing: ICharacter, other: IThing): void {
            var shadow: IThing = thing.FSP.addThing("Shadow"),
                dy: number = -thing.FSP.unitsize,
                speed: number = 2,
                steps: number = 14,
                changed: number = 0,
                hesitant: boolean = (<IPlayer>thing).keys && !(<IPlayer>thing).keys[thing.direction];

            thing.shadow = shadow;
            thing.ledge = other;

            if (hesitant) {
                thing.FSP.keyDownGeneric(thing, thing.direction);
            }

            thing.FSP.setMidXObj(shadow, thing);
            thing.FSP.setBottom(shadow, thing.bottom);

            thing.FSP.TimeHandler.addEventInterval(
                function (): void {
                    thing.FSP.setBottom(shadow, thing.bottom);

                    if (changed % speed === 0) {
                        thing.offsetY += dy;
                    }

                    changed += 1;
                },
                1,
                steps * speed);

            thing.FSP.TimeHandler.addEvent(
                function (): void {
                    dy *= -1;
                },
                speed * (steps / 2) | 0);

            thing.FSP.TimeHandler.addEvent(
                function (): void {
                    delete thing.ledge;
                    thing.FSP.killNormal(shadow);

                    if (hesitant) {
                        thing.FSP.keyUpGeneric(thing, thing.direction);
                    }
                },
                steps * speed);
        }


        /* Collision detection
        */

        /**
         * 
         */
        generateCanThingCollide(): (thing: IThing) => boolean {
            return function (thing: IThing): boolean {
                return thing.alive;
            };
        }

        /**
         * 
         */
        generateIsCharacterTouchingCharacter(): (thing: ICharacter, other: ICharacter) => boolean {
            return function isCharacterTouchingCharacter(thing: ICharacter, other: ICharacter): boolean {
                // if (other.xvel || other.yvel) {
                //     // check destination...
                // }
                return (
                    !thing.nocollide && !other.nocollide
                    && thing.right >= (other.left + other.tolLeft)
                    && thing.left <= (other.right - other.tolRight)
                    && thing.bottom >= (other.top + other.tolTop)
                    && thing.top <= (other.bottom - other.tolBottom));
            };
        }

        /**
         * 
         */
        generateIsCharacterTouchingSolid(): (thing: ICharacter, other: IThing) => boolean {
            return function isCharacterTouchingSolid(thing: ICharacter, other: IThing): boolean {
                return (
                    !thing.nocollide && !other.nocollide
                    && thing.right >= (other.left + other.tolLeft)
                    && thing.left <= (other.right - other.tolRight)
                    && thing.bottom >= (other.top + other.tolTop)
                    && thing.top <= (other.bottom - other.tolBottom));
            };
        }

        /**
         * 
         */
        generateHitCharacterThing(): (thing: ICharacter, other: IThing) => boolean {
            return function hitCharacterSolid(thing: ICharacter, other: ICharacter): boolean {
                // If either Thing is the player, it should be the first
                if (other.player && !thing.player) {
                    var temp: ICharacter = other;
                    other = thing;
                    thing = temp;
                }

                // The other's collide may return true to cancel overlapping checks
                if (other.collide && other.collide(thing, other)) {
                    return;
                }

                // Both the thing and other should know they're bordering each other
                // If other is a large solid, this will be irreleveant, so it's ok
                // that multiple borderings will be replaced by the most recent
                switch (thing.FSP.getDirectionBordering(thing, other)) {
                    case 0:
                        if (
                            thing.left !== other.right - other.tolRight
                            && thing.right !== other.left + other.tolLeft
                        ) {
                            thing.bordering[0] = other;
                            other.bordering[2] = thing;
                            thing.FSP.setTop(thing, other.bottom - other.tolBottom);
                        }

                        break;

                    case 1:
                        if (
                            thing.top !== other.bottom - other.tolBottom
                            && thing.bottom !== other.top + other.tolTop
                        ) {
                            thing.bordering[1] = other;
                            other.bordering[3] = thing;
                            thing.FSP.setRight(thing, other.left + other.tolLeft);
                        }
                        break;

                    case 2:
                        if (
                            thing.left !== other.right - other.tolRight
                            && thing.right !== other.left + other.tolLeft
                        ) {
                            thing.bordering[2] = other;
                            other.bordering[0] = thing;
                            thing.FSP.setBottom(thing, other.top + other.tolTop);
                        }
                        break;

                    case 3:
                        if (
                            thing.top !== other.bottom - other.tolBottom
                            && thing.bottom !== other.top + other.tolTop
                        ) {
                            thing.bordering[3] = other;
                            other.bordering[1] = thing;
                            thing.FSP.setLeft(thing, other.right - other.tolRight);
                        }
                        break;

                    default:
                        break;
                }
            };
        }

        /**
         * 
         */
        collideCollisionDetector(thing: IPlayer, other: IDetector): boolean {
            if (!thing.player) {
                return;
            }

            if (other.active) {
                if (
                    (!other.requireOverlap && !thing.isWalking)
                    || thing.FSP.isThingWithinOther(thing, other)
                ) {
                    if (
                        typeof other.requireDirection !== "undefined"
                        && !thing.keys[other.requireDirection]
                        && !thing.allowDirectionAsKeys
                        && thing.direction !== other.requireDirection
                    ) {
                        return;
                    }
                    if (other.singleUse) {
                        other.active = false;
                    }
                    other.activate(thing, other);
                }
                return true;
            }

            // Find direction of movement using xvel, yvel
            // if towards other, transport
            var directionMovement: Direction = thing.direction,
                directionActual: Direction = thing.FSP.getDirectionBordering(thing, other);

            if (directionMovement === directionActual) {
                other.active = true;
                return true;
            }
        }

        /**
         * 
         */
        collideCharacterDialog(thing: IPlayer, other: ICharacter): void {
            var dialog: string | string[] = other.dialog,
                direction: Direction;

            if (other.cutscene) {
                thing.FSP.ScenePlayer.startCutscene(other.cutscene, {
                    "thing": thing,
                    "triggerer": other
                });
            }

            if (!dialog) {
                return;
            }

            direction = thing.FSP.getDirectionBordering(other, thing);

            if (other.dialogDirections) {
                dialog = dialog[direction];
                if (!dialog) {
                    return;
                }
            }

            thing.talking = true;
            other.talking = true;
            thing.canKeyWalking = false;

            if (!thing.FSP.MenuGrapher.getActiveMenu()) {
                thing.FSP.MenuGrapher.createMenu("GeneralText", {
                    "deleteOnFinish": !other.dialogOptions
                });
                thing.FSP.MenuGrapher.setActiveMenu("GeneralText");
                thing.FSP.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    dialog,
                    thing.FSP.animateCharacterDialogFinish.bind(thing.FSP, thing, other)
                );
            }

            if (other.switchDirectionOnDialog) {
                thing.FSP.animateCharacterSetDirection(other, direction);
            }
        }

        /**
         * 
         */
        collidePokeball(thing: IThing, other: IPokeball): void {
            switch (other.action) {
                case "item":
                    thing.FSP.MenuGrapher.createMenu("GeneralText");
                    thing.FSP.MenuGrapher.addMenuDialog(
                        "GeneralText",
                        [
                            "%%%%%%%PLAYER%%%%%%% found " + other.item + "!"
                        ],
                        function (): void {
                            thing.FSP.MenuGrapher.deleteActiveMenu();
                            thing.FSP.killNormal(other);
                            thing.FSP.StateHolder.addChange(
                                other.id, "alive", false
                            );
                        }
                    );
                    thing.FSP.MenuGrapher.setActiveMenu("GeneralText");

                    thing.FSP.addItemToBag(thing.FSP, other.item, other.amount);
                    break;

                case "cutscene":
                    thing.FSP.ScenePlayer.startCutscene(other.cutscene, {
                        "player": thing,
                        "triggerer": other
                    });
                    if (other.routine) {
                        thing.FSP.ScenePlayer.playRoutine(other.routine);
                    }
                    break;

                case "pokedex":
                    thing.FSP.openPokedexListing(other.pokemon);
                    break;

                case "dialog":
                    thing.FSP.MenuGrapher.createMenu("GeneralText");
                    thing.FSP.MenuGrapher.addMenuDialog("GeneralText", other.dialog);
                    thing.FSP.MenuGrapher.setActiveMenu("GeneralText");
                    break;

                case "yes/no":
                    thing.FSP.MenuGrapher.createMenu("Yes/No", {
                        "killOnB": ["GeneralText"]
                    });
                    thing.FSP.MenuGrapher.addMenuList("Yes/No", {
                        "options": [
                            {
                                "text": "YES",
                                "callback": console.log.bind(console, "What do, yes?")
                            }, {
                                "text": "NO",
                                "callback": console.log.bind(console, "What do, no?")
                            }]
                    });
                    thing.FSP.MenuGrapher.setActiveMenu("Yes/No");
                    break;

                default:
                    throw new Error("Unknown Pokeball action: " + other.action + ".");
            }
        }

        /**
         * 
         */
        collideCharacterGrass(thing: ICharacter, other: IGrass): boolean {
            if (
                thing.grass
                || !thing.FSP.isThingWithinGrass(thing, other)) {
                return true;
            }

            thing.grass = other;
            thing.heightOld = thing.height;

            thing.canvas.height = thing.heightGrass * thing.FSP.unitsize;
            thing.FSP.PixelDrawer.setThingSprite(thing);

            thing.shadow = thing.FSP.ObjectMaker.make(thing.title, {
                "nocollide": true
            });

            if (thing.shadow.className !== thing.className) {
                thing.FSP.setClass(thing.shadow, thing.className);
            }

            delete thing.shadow.id;
            thing.FSP.addThing(thing.shadow, thing.left, thing.top);

            thing.FSP.GroupHolder.switchObjectGroup(
                thing.shadow, thing.shadow.groupType, "Terrain"
            );

            thing.FSP.arrayToEnd(
                thing.shadow, <IThing[]>thing.FSP.GroupHolder.getGroup("Terrain"));

            return true;
        }

        /**
         * 
         */
        collideLedge(thing: ICharacter, other: IThing): boolean {
            if (thing.ledge) {
                return true;
            }

            if (thing.direction !== other.direction) {
                return false;
            }

            if (thing.direction % 2 === 0) {
                if (thing.left === other.right || thing.right === other.left) {
                    return true;
                }
            } else {
                if (thing.top === other.bottom || thing.bottom === other.top) {
                    return true;
                }
            }

            thing.FSP.animateCharacterHopLedge(thing, other);

            return true;
        }


        /* Death
        */

        /**
         * Standard Function to kill a Thing, which means marking it as dead and
         * clearing its numquads, resting, movement, and cycles. It will later be
         * removed by its maintain* Function.
         * 
         * @param {Thing} thing
         */
        killNormal(thing: IThing): void {
            if (!thing) {
                return;
            }

            thing.nocollide = thing.hidden = thing.dead = true;
            thing.alive = false;
            thing.numquads = 0;
            thing.movement = undefined;

            if (thing.FSP) {
                thing.FSP.TimeHandler.cancelAllCycles(thing);
                thing.FSP.ModAttacher.fireEvent("onKillNormal", thing);

                if (thing.id) {
                    delete thing.FSP.MapScreener.thingsById[thing.id];
                }
            }
        }


        /* Activations
        */

        /**
         * 
         */
        activateCutsceneTriggerer(thing: ICharacter, other: IDetector): void {
            if (!other.alive || thing.collidedTrigger === other) {
                return;
            }

            thing.collidedTrigger = other;
            thing.FSP.animatePlayerDialogFreeze(thing);

            if (!other.keepAlive) {
                other.alive = false;

                if (other.id.indexOf("Anonymous") !== -1) {
                    console.warn("Deleting anonymous CutsceneTriggerer:", other.id);
                }

                thing.FSP.StateHolder.addChange(other.id, "alive", false);
                thing.FSP.killNormal(other);
            }

            if (other.cutscene) {
                thing.FSP.ScenePlayer.startCutscene(other.cutscene, {
                    "player": thing,
                    "triggerer": other
                });
            }

            if (other.routine) {
                thing.FSP.ScenePlayer.playRoutine(other.routine);
            }
        }

        /**
         * 
         */
        activateThemePlayer(thing: ICharacter, other: IThemeDetector): void {
            if (thing.FSP.AudioPlayer.getThemeName() === other.theme) {
                return;
            }

            thing.FSP.AudioPlayer.play(other.theme);
        }

        /**
         * 
         */
        activateCutsceneResponder(thing: ICharacter, other: IDetector): void {
            if (!thing.player || !other.alive) {
                return;
            }

            if (other.dialog) {
                thing.FSP.activateMenuTriggerer(thing, other);
                return;
            }

            thing.FSP.ScenePlayer.startCutscene(other.cutscene, {
                "player": thing,
                "triggerer": other
            });
        }

        /**
         * 
         */
        activateMenuTriggerer(thing: ICharacter, other: IMenuTriggerer): void {
            if (!other.alive || thing.collidedTrigger === other) {
                return;
            }

            var name: string = other.menu || "GeneralText",
                dialog: string | string[] = other.dialog;

            thing.collidedTrigger = other;
            thing.FSP.animateCharacterPreventWalking(thing);

            if (!other.keepAlive) {
                other.alive = false;
                thing.FSP.killNormal(other);
            }

            if (!thing.FSP.MenuGrapher.getMenu(name)) {
                thing.FSP.MenuGrapher.createMenu(name, other.menuAttributes);
            }

            if (dialog) {
                thing.FSP.MenuGrapher.addMenuDialog(
                    name,
                    dialog,
                    function (): void {
                        var onStop: any;

                        if (other.pushSteps) {
                            onStop = other.pushSteps.slice();
                        }

                        thing.FSP.MenuGrapher.deleteMenu("GeneralText");

                        if (typeof other.pushDirection !== "undefined") {
                            onStop.push(function (): void {
                                thing.FSP.MapScreener.blockInputs = false;
                                delete thing.collidedTrigger;
                            });
                            thing.FSP.animateCharacterStartTurning(
                                thing, other.pushDirection, onStop);
                        } else {
                            thing.FSP.MapScreener.blockInputs = false;
                            delete thing.collidedTrigger;
                        }
                    });
            }

            thing.FSP.MenuGrapher.setActiveMenu(name);
        }

        /**
         * 
         */
        activateSightDetector(thing: ICharacter, other: ISightDetector): void {
            if (other.viewer.talking) {
                return;
            }
            other.viewer.talking = true;
            other.active = false;

            thing.FSP.MapScreener.blockInputs = true;

            thing.FSP.ScenePlayer.startCutscene("TrainerSpotted", {
                "player": thing,
                "sightDetector": other,
                "triggerer": other.viewer
            });
        }

        /**
         * Activation callback for level transports (any Thing with a .transport 
         * attribute). Depending on the transport, either the map or location are 
         * shifted to it.
         * 
         * @param {Player} thing
         * @param {Thing} other
         */
        activateTransporter(thing: ICharacter, other: ITransporter): void {
            if (!thing.player || !other.active) {
                return;
            }

            if (typeof other.transport === "undefined") {
                throw new Error("No transport given to activateTransporter");
            }

            var transport: ITransportSchema = <ITransportSchema>other.transport,
                callback: Function,
                args: any[];

            if (transport.constructor === String) {
                callback = thing.FSP.setLocation.bind(thing.FSP);
                args = [transport];
            } else if (typeof transport.map !== "undefined") {
                callback = thing.FSP.setMap.bind(thing.FSP);
                args = [transport.map, transport.location];
            } else if (typeof transport.location !== "undefined") {
                callback = thing.FSP.setLocation.bind(thing.FSP);
                args = [transport.location];
            } else {
                throw new Error("Unknown transport type:" + transport);
            }

            other.active = false;

            thing.FSP.animateFadeToColor(thing.FSP, {
                "color": "Black",
                "callback": callback.apply.bind(callback, thing.FSP, args)
            });
        }

        /**
         * 
         */
        activateGymStatue(thing: ICharacter, other: IGymDetector): void {
            if (thing.direction !== 0) {
                return;
            }

            var gym: string = other.gym,
                leader: string = other.leader,
                dialog: string[] = [
                    gym.toUpperCase()
                    + " \n %%%%%%%POKEMON%%%%%%% GYM \n LEADER: "
                    + leader.toUpperCase(),
                    "WINNING TRAINERS: %%%%%%%RIVAL%%%%%%%"
                ];

            if (thing.FSP.ItemsHolder.getItem("badges")[leader]) {
                dialog[1] += " \n %%%%%%%PLAYER%%%%%%%";
            }

            thing.FSP.MenuGrapher.createMenu("GeneralText");
            thing.FSP.MenuGrapher.addMenuDialog("GeneralText", dialog);
            thing.FSP.MenuGrapher.setActiveMenu("GeneralText");
        }


        /* Physics
        */

        /**
         * 
         * 
         * @todo I would like this to be more elegant. 
         */
        getDirectionBordering(thing: IThing, other: IThing): number {
            if (Math.abs((thing.top) - (other.bottom - other.tolBottom)) < thing.FSP.unitsize) {
                return 0;
            }

            if (Math.abs(thing.right - other.left) < thing.FSP.unitsize) {
                return 1;
            }

            if (Math.abs(thing.bottom - other.top) < thing.FSP.unitsize) {
                return 2;
            }

            if (Math.abs(thing.left - other.right) < thing.FSP.unitsize) {
                return 3;
            }

            return undefined;
        }

        /**
         * 
         */
        isThingWithinOther(thing: IThing, other: IThing): boolean {
            return (
                thing.top >= other.top - thing.FSP.unitsize
                && thing.right <= other.right + thing.FSP.unitsize
                && thing.bottom <= other.bottom + thing.FSP.unitsize
                && thing.left >= other.left - thing.FSP.unitsize);
        }

        /**
         * 
         */
        isThingWithinGrass(thing: ICharacter, other: IGrass): boolean {
            if (thing.right <= other.left) {
                return false;
            }

            if (thing.left >= other.right) {
                return false;
            }

            if (other.top > (
                thing.top + thing.heightGrass * thing.FSP.unitsize)) {
                return false;
            }

            if (other.bottom < (
                thing.top + thing.heightGrass * thing.FSP.unitsize)) {
                return false;
            }

            return true;
        }

        /**
         * 
         */
        shiftCharacter(thing: ICharacter): void {
            if (thing.xvel !== 0) {
                thing.bordering[1] = thing.bordering[3] = undefined;
            } else if (thing.yvel !== 0) {
                thing.bordering[0] = thing.bordering[2] = undefined;
            } else {
                return;
            }

            thing.FSP.shiftBoth(thing, thing.xvel, thing.yvel);
        }

        /**
         * 
         */
        setPlayerDirection(thing: IPlayer, direction: Direction): void {
            thing.direction = direction;
            thing.FSP.MapScreener.playerDirection = direction;
            thing.shouldWalk = true;
        }


        /* Spawning
        */

        /**
         * 
         * 
         * @remarks Should be the line after snaptogrid...
         */
        spawnCharacter(thing: ICharacter): void {
            if (thing.sight) {
                thing.sightDetector = <ISightDetector>thing.FSP.addThing(
                    [
                        "SightDetector",
                        {
                            "direction": thing.direction
                        }
                    ]);
                thing.sightDetector.viewer = thing;
                thing.FSP.animatePositionSightDetector(thing);
            }

            if (thing.roaming) {
                thing.FSP.TimeHandler.addEvent(
                    thing.FSP.activateCharacterRoaming,
                    thing.FSP.NumberMaker.randomInt(70),
                    thing);
            }
        }

        /**
         * 
         */
        activateCharacterRoaming(thing: ICharacter): boolean {
            if (!thing.alive) {
                return true;
            }

            thing.FSP.TimeHandler.addEvent(
                thing.FSP.activateCharacterRoaming,
                70 + thing.FSP.NumberMaker.randomInt(210),
                thing);

            if (!thing.talking && !thing.FSP.MenuGrapher.getActiveMenu()) {
                thing.FSP.animateCharacterStartWalkingRandom(thing);
            }

            return false;
        }

        /**
         * 
         */
        activateSpawner(thing: IDetector): void {
            thing.activate(thing);
        }

        /**
         * 
         */
        spawnWindowDetector(thing: IDetector): void {
            if (!thing.FSP.checkWindowDetector(thing)) {
                thing.FSP.TimeHandler.addEventInterval(
                    thing.FSP.checkWindowDetector, 7, Infinity, thing);
            }
        }

        /**
         * 
         */
        checkWindowDetector(thing: IDetector): boolean {
            if (
                thing.bottom < 0
                || thing.left > thing.FSP.MapScreener.width
                || thing.top > thing.FSP.MapScreener.height
                || thing.right < 0) {
                return false;
            }

            thing.activate(thing);
            thing.FSP.killNormal(thing);
            return true;
        }

        /**
         * 
         */
        spawnAreaSpawner(thing: IAreaSpawner): void {
            var map: IMap = <IMap>thing.FSP.MapsHandler.getMap(thing.map),
                area: IArea = <IArea>map.areas[thing.area];

            if (area === thing.FSP.MapsHandler.getArea()) {
                thing.FSP.killNormal(thing);
                return;
            }

            if (
                area.spawnedBy
                && area.spawnedBy === (<IArea>thing.FSP.MapsHandler.getArea()).spawnedBy
            ) {
                thing.FSP.killNormal(thing);
                return;
            }

            area.spawnedBy = (<IArea>thing.FSP.MapsHandler.getArea()).spawnedBy;

            thing.FSP.activateAreaSpawner(thing, area);
        }

        /**
         * 
         */
        activateAreaSpawner(thing: IAreaSpawner, area: IArea): void {
            var creation: any[] = area.creation,
                FSP: FullScreenPokemon = thing.FSP,
                MapsCreator: MapsCreatr.IMapsCreatr = FSP.MapsCreator,
                MapsHandler: MapsHandlr.IMapsHandlr = FSP.MapsHandler,
                QuadsKeeper: QuadsKeepr.IQuadsKeepr = FSP.QuadsKeeper,
                areaCurrent: IArea = <IArea>MapsHandler.getArea(),
                mapCurrent: IMap = <IMap>MapsHandler.getMap(),
                prethingsCurrent: any = MapsHandler.getPreThings(),
                left: number = thing.left + thing.FSP.MapScreener.left,
                top: number = thing.top + thing.FSP.MapScreener.top,
                x: number,
                y: number,
                command: any,
                i: number;

            switch (thing.direction) {
                case 0:
                    top -= area.height * thing.FSP.unitsize;
                    break;
                case 1:
                    left += thing.width * thing.FSP.unitsize;
                    break;
                case 2:
                    top += thing.height * thing.FSP.unitsize;
                    break;
                case 3:
                    left -= area.width * thing.FSP.unitsize;
                    break;
                default:
                    throw new Error("Unknown direction: " + thing.direction + ".");
            }

            x = left / FSP.unitsize + (thing.offsetX || 0);
            y = top / FSP.unitsize + (thing.offsetY || 0);

            FSP.expandMapBoundaries(FSP, area, x, y);

            for (i = 0; i < creation.length; i += 1) {
                // A copy of the command must be used, so as to not modify the original 
                command = FSP.proliferate(
                    {
                        "noBoundaryStretch": true,
                        "areaName": area.name,
                        "mapName": area.map.name
                    },
                    creation[i]);

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

            MapsHandler.spawnMap(
                "xInc",
                QuadsKeeper.top / FSP.unitsize,
                QuadsKeeper.right / FSP.unitsize,
                QuadsKeeper.bottom / FSP.unitsize,
                QuadsKeeper.left / FSP.unitsize);

            area.spawned = true;
            FSP.killNormal(thing);

            // MapScreener.setVariables();
        }

        /**
         * 
         * 
         * @todo It would be nice to intelligently do this based on boundaries, but
         *       this works and that doesn't (easily / yet / without bugs).
         */
        expandMapBoundaries(FSP: FullScreenPokemon, area: IArea, x: number, y: number): void {
            FSP.MapScreener.scrollability = "both";
        }


        /* Menus
        */

        /**
         * 
         */
        openPauseMenu(): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this);

            FSP.MenuGrapher.createMenu("Pause");
            FSP.MenuGrapher.setActiveMenu("Pause");
            FSP.MenuGrapher.addMenuList("Pause", {
                "options": [
                    {
                        "text": "%%%%%%%POKEDEX%%%%%%%",
                        "callback": FSP.openPokedexMenu.bind(FSP)
                    }, {
                        "text": "%%%%%%%POKEMON%%%%%%%",
                        "callback": FSP.openPokemonMenu.bind(FSP)
                    }, {
                        "text": "ITEM",
                        "callback": FSP.openItemsMenu.bind(FSP)
                    }, {
                        "text": "%%%%%%%PLAYER%%%%%%%",
                        "callback": FSP.openPlayerMenu.bind(FSP)
                    }, {
                        "text": "SAVE",
                        "callback": FSP.openSaveMenu.bind(FSP)
                    }, {
                        "text": "OPTION"
                    }, {
                        "text": "Exit",
                        "callback": FSP.closePauseMenu.bind(FSP)
                    }]
            });
        }

        /**
         * 
         */
        closePauseMenu(): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this);

            FSP.MenuGrapher.deleteMenu("Pause");
        }

        /**
         * 
         */
        togglePauseMenu(thing: IThing): void {
            if (thing.FSP.MenuGrapher.getActiveMenu()) {
                thing.FSP.MenuGrapher.registerStart();
                return;
            }

            var cutsceneSettings: any = thing.FSP.ScenePlayer.getCutsceneSettings();
            if (cutsceneSettings && cutsceneSettings.disablePauseMenu) {
                return;
            }

            thing.FSP.MenuGrapher.getMenu("Pause")
                ? thing.FSP.closePauseMenu()
                : thing.FSP.openPauseMenu();
        }

        /**
         * 
         */
        openPokedexMenu(): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                listings: IPokedexListing[] = FSP.ItemsHolder.getItem("Pokedex");

            FSP.MenuGrapher.createMenu("Pokedex");
            FSP.MenuGrapher.setActiveMenu("Pokedex");
            FSP.MenuGrapher.addMenuList("Pokedex", {
                "options": listings.map(function (listing: IPokedexListing, i: number): any {
                    var characters: any[] = FSP.makeDigit(i + 1, 3, 0).split("");

                    characters.push({
                        "command": true,
                        "y": 4
                    });

                    if (listing.caught) {
                        characters.push({
                            "command": true,
                            "x": -4,
                            "y": 1
                        });
                        characters.push("Ball");
                        characters.push({
                            "command": true,
                            "y": -1
                        });
                    }

                    if (listing.seen) {
                        characters.push.apply(characters, listing.title.split(""));
                    } else {
                        characters.push.apply(characters, "----------".split(""));
                    }

                    characters.push({
                        "command": true,
                        "y": -4
                    });

                    return {
                        "text": characters
                    };
                })
            });

            FSP.MenuGrapher.createMenu("PokedexOptions");
            FSP.MenuGrapher.addMenuList("PokedexOptions", {
                "options": [
                    {
                        "text": "DATA"
                    }, {
                        "text": "CRY"
                    }, {
                        "text": "AREA"
                    }, {
                        "text": "QUIT",
                        "callback": FSP.MenuGrapher.registerB
                    }
                ]
            });
        }

        /**
         * 
         */
        openPokemonMenuContext(settings: any): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this);

            FSP.MenuGrapher.createMenu("PokemonMenuContext", {
                "backMenu": "Pokemon"
            });
            FSP.MenuGrapher.addMenuList("PokemonMenuContext", {
                "options": [
                    {
                        "text": "STATS",
                        "callback": FSP.openPokemonMenuStats.bind(
                            FSP,
                            {
                                "pokemon": settings.pokemon
                            })
                    }, {
                        "text": "SWITCH",
                        "callback": settings.onSwitch
                    }, {
                        "text": "CANCEL",
                        "callback": FSP.MenuGrapher.registerB
                    }]
            });
            FSP.MenuGrapher.setActiveMenu("PokemonMenuContext");
        }

        /**
         * 
         */
        openPokemonMenuStats(settings: any): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                pokemon: BattleMovr.IActor = settings.pokemon,
                schemas: any = FSP.MathDecider.getConstant("pokemon"),
                schema: any = schemas[pokemon.title.join("")];

            FSP.MenuGrapher.createMenu("PokemonMenuStats", {
                "backMenu": "PokemonMenuContext",
                "container": "Pokemon"
            });

            FSP.openPokemonStats({
                "pokemon": pokemon,
                "container": "PokemonMenuStats",
                "size": {
                    "width": 36,
                    "height": 40
                },
                "position": {
                    "vertical": "bottom",
                    "horizontal": "left"
                },
                "textXOffset": 4
            });

            FSP.MenuGrapher.addMenuDialog(
                "PokemonMenuStatsTitle", pokemon.nickname);
            FSP.MenuGrapher.addMenuDialog(
                "PokemonMenuStatsLevel", pokemon.level);
            FSP.MenuGrapher.addMenuDialog(
                "PokemonMenuStatsHP", pokemon.HP + "/ " + pokemon.HPNormal);
            FSP.MenuGrapher.addMenuDialog(
                "PokemonMenuStatsNumber", FSP.makeDigit(schema.number, 3, 0));
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsStatus", "OK");
            FSP.MenuGrapher.addMenuDialog(
                "PokemonMenuStatsType", pokemon.types.join(" \n "));
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsID", "H819");
            FSP.MenuGrapher.addMenuDialog(
                "PokemonMenuStatsOT",
                [
                    "%%%%%%%PLAYER%%%%%%%"
                ]
            );

            FSP.MenuGrapher.createMenuThing("PokemonMenuStats", {
                "type": "thing",
                "thing": "SquirtleFront", // pokemon.title + "Front",
                "args": {
                    "flipHoriz": true
                },
                "position": {
                    "vertical": "bottom",
                    "offset": {
                        "left": 8,
                        "top": -44
                    }
                }
            });

            FSP.MenuGrapher.setActiveMenu("PokemonMenuStats");
        }

        /**
         * 
         */
        openPokemonStats(settings: any): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                pokemon: IPokemonSchema = settings.pokemon,
                statistics: string[] = FSP.MathDecider.getConstant("statisticNames").filter(
                    function (statistic: string): boolean {
                        return statistic !== "HP";
                    }),
                numStatistics: number = statistics.length,
                textXOffset: number = settings.textXOffset || 8,
                top: number,
                left: number,
                i: number;

            for (i = 0; i < numStatistics; i += 1) {
                statistics.push(FSP.makeDigit(pokemon[statistics[i]], 3, " "));
                statistics[i] = statistics[i].toUpperCase();
            }

            FSP.MenuGrapher.createMenu("LevelUpStats", {
                "container": settings.container,
                "size": settings.size || {
                    "width": 44,
                    "height": 40
                },
                "position": settings.position || {
                    "horizontal": "center",
                    "vertical": "center"
                },
                "onMenuDelete": settings.onMenuDelete,
                "childrenSchemas": statistics.map(function (text: string, i: number): any {
                    if (i < numStatistics) {
                        top = i * 8 + 4;
                        left = textXOffset;
                    } else {
                        top = (i - numStatistics + 1) * 8;
                        left = textXOffset + 16;
                    }

                    return {
                        "type": "text",
                        "words": [text],
                        "position": {
                            "offset": {
                                "top": top - .5,
                                "left": left
                            }
                        }
                    };
                })
            });
        }

        /**
         * 
         */
        openPokedexListing(title: string, callback?: (...args: any[]) => void, settings?: any): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                pokemon: IPokedexListing = FSP.MathDecider.getConstant("pokemon")[title],
                height: string[] = pokemon.height,
                feet: string = [].slice.call(height[0]).reverse().join(""),
                inches: string = [].slice.call(height[1]).reverse().join("");

            FSP.MenuGrapher.createMenu("PokedexListing", settings);
            FSP.MenuGrapher.createMenuThing("PokedexListingSprite", {
                "thing": title + "Front",
                "type": "thing",
                "args": {
                    "flipHoriz": true
                }
            });
            FSP.MenuGrapher.addMenuDialog(
                "PokedexListingName", title.toUpperCase());
            FSP.MenuGrapher.addMenuDialog(
                "PokedexListingLabel", pokemon.label);
            FSP.MenuGrapher.addMenuDialog(
                "PokedexListingHeightFeet", feet);
            FSP.MenuGrapher.addMenuDialog(
                "PokedexListingHeightInches", inches);
            FSP.MenuGrapher.addMenuDialog(
                "PokedexListingWeight", pokemon.weight);
            FSP.MenuGrapher.addMenuDialog(
                "PokedexListingNumber",
                FSP.makeDigit(pokemon.index, 3, "0"));
            FSP.MenuGrapher.addMenuDialog(
                "PokedexListingInfo",
                pokemon.info[0],
                function (): void {
                    FSP.MenuGrapher.createMenu("PokedexListingInfo");
                    FSP.MenuGrapher.addMenuDialog(
                        "PokedexListingInfo",
                        pokemon.info[1],
                        function (): void {
                            FSP.MenuGrapher.deleteMenu("PokedexListing");
                            if (callback) {
                                callback();
                            }
                        }
                    );
                    FSP.MenuGrapher.setActiveMenu("PokedexListingInfo");
                });

            FSP.MenuGrapher.setActiveMenu("PokedexListingInfo");
        }

        /**
         * 
         */
        openPokemonMenu(settings: any): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                listings: BattleMovr.IActor[] = FSP.ItemsHolder.getItem("PokemonInParty"),
                references: any = FSP.MathDecider.getConstant("pokemon");

            FSP.MenuGrapher.createMenu("Pokemon", settings);
            FSP.MenuGrapher.addMenuList("Pokemon", {
                "options": listings.map(function (listing: BattleMovr.IActor, i: number): any {
                    var sprite: string = references[listing.title.join("")].sprite + "Pokemon",
                        barWidth: number = 25,
                        health: number = FSP.MathDecider.compute(
                            "widthHealthBar", barWidth, listing.HP, listing.HPNormal);

                    return {
                        "text": listing.title,
                        "callback": FSP.openPokemonMenuContext.bind(
                            FSP, {
                                "pokemon": listing,
                                "onSwitch": settings.onSwitch.bind(FSP, "player", i)
                            }),
                        "things": [
                            {
                                "thing": sprite,
                                "position": {
                                    "offset": {
                                        "left": 7.5,
                                        "top": .5
                                    }
                                }
                            },
                            {
                                "thing": "CharLevel",
                                "position": {
                                    "offset": {
                                        "left": 56,
                                        "top": 1.5
                                    }
                                }
                            },
                            {
                                "thing": "CharHP",
                                "position": {
                                    "offset": {
                                        "left": 20,
                                        "top": 5.5
                                    }
                                }
                            },
                            {
                                "thing": "HPBar",
                                "args": {
                                    "width": barWidth
                                },
                                "position": {
                                    "offset": {
                                        "left": 27,
                                        "top": 5.5
                                    }
                                }
                            },
                            {
                                "thing": "LightGraySquare",
                                "args": {
                                    "width": Math.max(health, 1),
                                    "height": 1,
                                    "hidden": health === 0
                                },
                                "position": {
                                    "offset": {
                                        "left": 27.5,
                                        "top": 6
                                    }
                                }
                            }],
                        "textsFloating": [
                            {
                                "text": String(listing.level),
                                "x": 44.25,
                                "y": 0
                            },
                            {
                                "text": listing.HP + "/ " + listing.HPNormal,
                                "x": 43.75,
                                "y": 4
                            }]
                    };
                })
            });
            FSP.MenuGrapher.setActiveMenu("Pokemon");
        }

        /**
         * 
         */
        openItemsMenu(settings: any): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                items: any[] = settings.items || FSP.ItemsHolder.getItem("items");

            FSP.MenuGrapher.createMenu("Items", settings);
            FSP.MenuGrapher.addMenuList("Items", {
                "options": items.map(function (schema: any): any {
                    return {
                        "text": schema.item,
                        "textsFloating": [
                            {
                                "text": [["Times"]],
                                "x": 32,
                                "y": 4.5
                            }, {
                                "text": FSP.makeDigit(schema.amount, 2, " "),
                                "x": 36.5,
                                "y": 4
                            }
                        ]
                    };
                })
            });
            FSP.MenuGrapher.setActiveMenu("Items");

            console.warn("Once math.js contains item info, react to non-stackable items...");
        }

        /**
         * 
         */
        openPlayerMenu(): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this);

            FSP.MenuGrapher.createMenu("Player");
            FSP.MenuGrapher.setActiveMenu("Player");
        }

        /**
         * 
         */
        openSaveMenu(): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this);

            FSP.MenuGrapher.createMenu("Save");

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Would you like to SAVE the game?"
                ]);

            FSP.MenuGrapher.createMenu("Yes/No", {
                "backMenu": "Pause",
                "killOnB": ["GeneralText", "Save"]
            });
            FSP.MenuGrapher.addMenuList("Yes/No", {
                "options": [
                    {
                        "text": "YES",
                        "callback": FSP.downloadSaveGame.bind(FSP)
                    }, {
                        "text": "NO",
                        "callback": FSP.MenuGrapher.registerB
                    }]
            });
            FSP.MenuGrapher.setActiveMenu("Yes/No");
        }

        /**
         * 
         */
        openKeyboardMenu(settings: any): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                value: string[][] = [
                    settings.value || ["_", "_", "_", "_", "_", "_", "_"]
                ],
                onKeyPress: (...args: any[]) => void = FSP.addKeyboardMenuValue.bind(FSP),
                onBPress: (...args: any[]) => void = FSP.removeKeyboardMenuValue.bind(FSP),
                onComplete: (...args: any[]) => void = (settings.callback || onKeyPress).bind(FSP),
                lowercase: boolean = settings.lowercase,
                letters: string[] = lowercase
                    ? FullScreenPokemon.keysLowercase
                    : FullScreenPokemon.keysUppercase,
                options: any[] = letters.map(function (letter: string): any {
                    return {
                        "text": [letter],
                        "value": letter,
                        "callback": letter !== "ED"
                            ? onKeyPress
                            : onComplete
                    };
                }),
                menuResults: IKeyboardResultsMenu;

            FSP.MenuGrapher.createMenu("Keyboard", <MenuGraphr.IMenuSchema>{
                "settings": settings,
                "onKeyPress": onKeyPress,
                "onComplete": onComplete,
                "ignoreB": false
            });
            menuResults = <IKeyboardResultsMenu>FSP.MenuGrapher.getMenu("KeyboardResult");

            FSP.MenuGrapher.addMenuDialog("KeyboardTitle", [[
                settings.title || "",
            ]]);

            FSP.MenuGrapher.addMenuDialog("KeyboardResult", value);

            FSP.MenuGrapher.addMenuList("KeyboardKeys", {
                "options": options,
                "selectedIndex": settings.selectedIndex,
                "bottom": {
                    "text": lowercase ? "UPPER CASE" : "lower case",
                    "callback": FSP.switchKeyboardCase.bind(FSP),
                    "position": {
                        "top": 40,
                        "left": 0
                    }
                }
            });
            FSP.MenuGrapher.getMenu("KeyboardKeys").onBPress = onBPress;
            FSP.MenuGrapher.setActiveMenu("KeyboardKeys");

            menuResults.displayedValue = value.slice()[0];
            menuResults.completeValue = settings.completeValue || [];
            menuResults.selectedChild = settings.selectedChild || 0;
            menuResults.blinker = FSP.addThing(
                "CharMDash",
                menuResults.children[menuResults.selectedChild].left,
                menuResults.children[menuResults.selectedChild].top);
            menuResults.children.push(menuResults.blinker);
            menuResults.children[menuResults.selectedChild].hidden = true;
        }

        /**
         * 
         */
        addKeyboardMenuValue(): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                menuKeys: IKeyboardKeysMenu = <IKeyboardKeysMenu>FSP.MenuGrapher.getMenu("KeyboardKeys"),
                menuResult: IKeyboardResultsMenu = <IKeyboardResultsMenu>FSP.MenuGrapher.getMenu("KeyboardResult"),
                child: IThing = menuResult.children[menuResult.selectedChild],
                selected: IKeyboardKey = FSP.MenuGrapher.getMenuSelectedOption("KeyboardKeys");

            if (!child) {
                return;
            }

            FSP.killNormal(child);
            menuResult.children[menuResult.selectedChild] = FSP.addThing(
                selected.title, child.left, child.top);

            menuResult.displayedValue[menuResult.selectedChild] = selected.text[0];
            menuResult.completeValue.push(selected.value);
            menuResult.selectedChild += 1;

            if (menuResult.selectedChild < menuResult.children.length - 1) {
                child = menuResult.children[menuResult.selectedChild];
                child.hidden = true;
            } else {
                menuResult.blinker.hidden = true;
                FSP.MenuGrapher.setSelectedIndex(
                    "KeyboardKeys",
                    menuKeys.gridColumns - 1,
                    menuKeys.gridRows - 2); // assume there's a bottom option
            }

            FSP.setLeft(menuResult.blinker, child.left);
            FSP.setTop(menuResult.blinker, child.top);
        }

        /**
         * 
         */
        removeKeyboardMenuValue(): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                menuResult: IKeyboardResultsMenu = <IKeyboardResultsMenu>FSP.MenuGrapher.getMenu("KeyboardResult"),
                child: IThing = menuResult.children[menuResult.selectedChild - 1];

            if (menuResult.selectedChild <= 0) {
                return;
            }

            menuResult.selectedChild -= 1;
            menuResult.completeValue = menuResult.completeValue.slice(
                0, menuResult.completeValue.length - 1);
            menuResult.displayedValue[menuResult.selectedChild] = "_";

            FSP.killNormal(child);

            child = menuResult.children[menuResult.selectedChild];

            menuResult.children[menuResult.selectedChild + 1] = FSP.addThing(
                "CharUnderscore", child.right, child.top);

            FSP.setLeft(menuResult.blinker, child.left);
            FSP.setTop(menuResult.blinker, child.top);
        }

        /**
         * 
         */
        switchKeyboardCase(): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                keyboard: IMenu = <IMenu>FSP.MenuGrapher.getMenu("Keyboard"),
                keyboardKeys: IKeyboardKeysMenu = <IKeyboardKeysMenu>FSP.MenuGrapher.getMenu("KeyboardKeys"),
                keyboardResult: IKeyboardResultsMenu = <IKeyboardResultsMenu>FSP.MenuGrapher.getMenu("KeyboardResult"),
                settings: any = keyboard.settings;

            settings.lowercase = !settings.lowercase;
            settings.value = keyboardResult.displayedValue;
            settings.selectedChild = keyboardResult.selectedChild;
            settings.displayedValue = keyboardResult.displayedValue;
            settings.completeValue = keyboardResult.completeValue;
            settings.selectedIndex = keyboardKeys.selectedIndex;

            FSP.openKeyboardMenu(settings);
        }


        /* Battles
        */

        /**
         * 
         */
        startBattle(battleInfo: IBattleInfo): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                animations: string[] = battleInfo.animations || [
                // "LineSpiral", "Flash"
                    "Flash"
                ],
                animation: string = FSP.NumberMaker.randomArrayMember(animations),
                player: any = battleInfo.player;

            if (!player) {
                battleInfo.player = player = <any>{};
            }

            player.name = player.name || "%%%%%%%PLAYER%%%%%%%";
            player.sprite = player.sprite || "PlayerBack";
            player.category = player.category || "Trainer";
            player.actors = player.actors || FSP.ItemsHolder.getItem("PokemonInParty");
            player.hasActors = typeof player.hasActors === "undefined"
                ? true : player.hasActors;

            FSP.AudioPlayer.play(battleInfo.theme || "Trainer Battle");

            FSP["cutsceneBattleTransition" + animation](FSP, {
                "callback": FSP.BattleMover.startBattle.bind(
                    FSP.BattleMover, battleInfo)
            });
        }

        /**
         * 
         */
        createPokemon(schema: any): BattleMovr.IActor {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                level: number = typeof schema.levels !== "undefined"
                    ? FSP.NumberMaker.randomArrayMember(schema.levels)
                    : schema.level,
                pokemon: BattleMovr.IActor = FSP.MathDecider.compute("newPokemon", schema.title, level);

            if (schema.moves) {
                pokemon.moves = schema.moves;
            }

            return pokemon;
        }

        /**
         * 
         */
        healPokemon(pokemon: BattleMovr.IActor): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                moves: BattleMovr.IMove[] = FSP.MathDecider.getConstant("moves"),
                statisticNames: string[] = FSP.MathDecider.getConstant("statisticNames"),
                i: number;

            for (i = 0; i < statisticNames.length; i += 1) {
                pokemon[statisticNames[i]] = pokemon[statisticNames[i] + "Normal"];
            }

            for (i = 0; i < pokemon.moves.length; i += 1) {
                pokemon.moves[i].remaining = moves[pokemon.moves[i].title].PP;
            }

            pokemon.status = "";
        }

        /**
         * 
         */
        checkPlayerGrassBattle(thing: IPlayer): void {
            if (!thing.grass || thing.FSP.MenuGrapher.getActiveMenu()) {
                return;
            }

            if (!thing.FSP.ThingHitter.checkHit(
                thing, thing.grass, thing.title, thing.grass.groupType)) {
                delete thing.grass;
                return;
            }

            if (!thing.FSP.MathDecider.compute("doesGrassEncounterHappen", thing.grass)) {
                return;
            }

            thing.keys = thing.getKeys();
            thing.FSP.animateGrassBattleStart(thing, thing.grass);
        }

        /**
         * 
         */
        chooseRandomWildPokemon(FSP: FullScreenPokemon, options: IPokemonSchema[]): IPokemonSchema {
            var choice: number = FSP.NumberMaker.random(),
                sum: number = 0,
                i: number;

            for (i = 0; i < options.length; i += 1) {
                sum += options[i].rate;
                if (sum >= choice) {
                    return options[i];
                }
            }
        }

        /**
         * 
         */
        addBattleDisplayPokeballs(FSP: FullScreenPokemon, menu: IMenu, battler: BattleMovr.IBattleThingInfo, opposite?: boolean): void {
            var text: string[] = [],
                i: number;

            for (i = 0; i < battler.actors.length; i += 1) {
                text.push("Ball");
            }

            for (; i < 6; i += 1) {
                text.push("BallEmpty");
            }

            if (opposite) {
                text.reverse();
            }

            FSP.MenuGrapher.addMenuDialog(menu.name, [[text]]);
        }

        /**
         * 
         */
        addBattleDisplayPokemonHealth(FSP: FullScreenPokemon, battlerName: string): void {
            var battleInfo: IBattleInfo = <IBattleInfo>FSP.BattleMover.getBattleInfo(),
                pokemon: BattleMovr.IActor = battleInfo[battlerName].selectedActor,
                menu: string = [
                    "Battle",
                    battlerName[0].toUpperCase(),
                    battlerName.slice(1),
                    "Health"
                ].join("");

            FSP.MenuGrapher.createMenu(menu);
            FSP.MenuGrapher.createMenu(menu + "Title");
            FSP.MenuGrapher.createMenu(menu + "Level");
            FSP.MenuGrapher.createMenu(menu + "Amount");

            FSP.setBattleDisplayPokemonHealthBar(
                FSP,
                battlerName,
                pokemon.HP,
                pokemon.HPNormal);

            FSP.MenuGrapher.addMenuDialog(menu + "Title", pokemon.nickname);

            FSP.MenuGrapher.addMenuDialog(menu + "Level", String(pokemon.level));
        }

        /**
         * 
         * 
         * @param {String} actor
         */
        setBattleDisplayPokemonHealthBar(FSP: FullScreenPokemon, battlerName: string, hp: number, hpNormal: number): void {
            var nameUpper: string = battlerName[0].toUpperCase() + battlerName.slice(1),
                menuNumbers: string = "Battle" + nameUpper + "HealthNumbers",
                bar: IThing = FSP.getThingById("HPBarFill" + nameUpper),
                health: number = FSP.MathDecider.compute("widthHealthBar", 25, hp, hpNormal);

            if (FSP.MenuGrapher.getMenu(menuNumbers)) {
                FSP.MenuGrapher.getMenu(menuNumbers).children.forEach(FSP.killNormal);
                FSP.MenuGrapher.addMenuDialog(
                    menuNumbers,
                    [
                        [
                            FSP.makeDigit(hp, 3, " ")
                            + "/"
                            + FSP.makeDigit(hpNormal, 3, " ")
                        ]
                    ]);
            }

            FSP.setWidth(bar, health);
            bar.hidden = health === 0;
        }

        /**
         * 
         */
        animateBattleDisplayPokemonHealthBar(
            FSP: FullScreenPokemon,
            actorName: string,
            hpStart: number,
            hpEnd: number,
            hpNormal: number,
            callback?: (...args: any[]) => void): void {
            var direction: number = hpStart > hpEnd ? -1 : 1,
                hpNew: number = Math.round(hpStart + direction);

            FSP.setBattleDisplayPokemonHealthBar(FSP, actorName, hpNew, hpNormal);

            if (hpNew === hpEnd) {
                if (callback) {
                    callback();
                }
                return;
            }

            FSP.TimeHandler.addEvent(
                FSP.animateBattleDisplayPokemonHealthBar,
                2,
                FSP,
                actorName,
                hpNew,
                hpEnd,
                hpNormal,
                callback);
        }


        /* Cutscenes
        */

        /**
         * 
         */
        cutsceneBattleEntrance(FSP: FullScreenPokemon, settings: any): void {
            var things: any = settings.things,
                battleInfo: IBattleInfo = settings.battleInfo,
                player: IPlayer = things.player,
                opponent: ICharacter = things.opponent,
                menu: IMenu = <IMenu>FSP.MenuGrapher.getMenu("BattleDisplayInitial"),
                playerX: number,
                opponentX: number,
                playerGoal: number,
                opponentGoal: number,
                timeout: number = 70;

            battleInfo.player.selectedIndex = 0;
            battleInfo.player.selectedActor = battleInfo.player.actors[0];
            battleInfo.opponent.selectedIndex = 0;
            battleInfo.opponent.selectedActor = battleInfo.opponent.actors[0];

            player.opacity = 0;
            opponent.opacity = 0;

            FSP.setLeft(player, menu.right + player.width * FSP.unitsize);
            FSP.setRight(opponent, menu.left);
            FSP.setTop(opponent, menu.top);

            // They should be visible halfway through (2 * (1 / timeout))
            FSP.animateFadeAttribute(player, "opacity", 2 / timeout, 1, 1);
            FSP.animateFadeAttribute(opponent, "opacity", 2 / timeout, 1, 1);

            playerX = FSP.getMidX(player);
            opponentX = FSP.getMidX(opponent);
            playerGoal = menu.left + player.width * FSP.unitsize / 2;
            opponentGoal = menu.right - opponent.width * FSP.unitsize / 2;

            FSP.animateFadeHorizontal(
                player,
                (playerGoal - playerX) / timeout,
                playerGoal,
                1);

            FSP.animateFadeHorizontal(
                opponent,
                (opponentGoal - opponentX) / timeout,
                opponentGoal,
                1);

            FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine("OpeningText"), timeout);

            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneBattleOpeningText(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = settings.battleInfo,
                textStart: string[] = battleInfo.textStart,
                nextRoutine: string,
                callback: (...args: any[]) => void;

            if (settings.battleInfo.opponent.hasActors) {
                nextRoutine = "EnemyIntro";
            } else {
                nextRoutine = "PlayerIntro";
            }

            if (battleInfo.automaticMenus) {
                callback = FSP.TimeHandler.addEvent.bind(
                    FSP.TimeHandler,
                    FSP.ScenePlayer.playRoutine.bind(FSP.ScenePlayer),
                    70,
                    nextRoutine);
            } else {
                callback = FSP.ScenePlayer.bindRoutine(nextRoutine);
            }

            FSP.MenuGrapher.createMenu("BattlePlayerHealth");
            FSP.addBattleDisplayPokeballs(
                FSP,
                <IMenu>FSP.MenuGrapher.getMenu("BattlePlayerHealth"),
                battleInfo.player);

            if (battleInfo.opponent.hasActors) {
                FSP.MenuGrapher.createMenu("BattleOpponentHealth");
                FSP.addBattleDisplayPokeballs(
                    FSP,
                    <IMenu>FSP.MenuGrapher.getMenu("BattleOpponentHealth"),
                    battleInfo.player,
                    true);
            } else {
                FSP.addBattleDisplayPokemonHealth(FSP, "opponent");
            }

            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": battleInfo.automaticMenus
            });
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                textStart[0] + battleInfo.opponent.name.toUpperCase() + textStart[1],
                callback
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneBattleEnemyIntro(FSP: FullScreenPokemon, settings: any): void {
            var things: any = settings.things,
                opponent: ICharacter = things.opponent,
                menu: IMenu = <IMenu>FSP.MenuGrapher.getMenu("GeneralText"),
                opponentX: number = FSP.getMidX(opponent),
                opponentGoal: number = menu.right + opponent.width * FSP.unitsize / 2,
                battleInfo: IBattleInfo = settings.battleInfo,
                callback: string = battleInfo.opponent.hasActors
                    ? "OpponentSendOut"
                    : "PlayerIntro",
                timeout: number = 49;

            FSP.animateFadeHorizontal(
                opponent,
                (opponentGoal - opponentX) / timeout,
                opponentGoal,
                1);

            FSP.TimeHandler.addEvent(
                FSP.animateFadeAttribute,
                (timeout / 2) | 0,
                opponent,
                "opacity",
                -2 / timeout,
                0,
                1);

            FSP.MenuGrapher.deleteMenu("BattleOpponentHealth");
            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": true
            });
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    battleInfo.textOpponentSendOut[0]
                    + battleInfo.opponent.name
                    + battleInfo.textOpponentSendOut[1]
                    + battleInfo.opponent.actors[0].nickname
                    + battleInfo.textOpponentSendOut[2]
                ]
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");

            FSP.TimeHandler.addEvent(
                FSP.ScenePlayer.bindRoutine(
                    callback,
                    [
                        {
                            "nextRoutine": "PlayerIntro"
                        }
                    ]),
                timeout);
        }

        /**
         * 
         */
        cutsceneBattlePlayerIntro(FSP: FullScreenPokemon, settings: any): void {
            var things: any = settings.things,
                player: IPlayer = things.player,
                menu: IMenu = <IMenu>FSP.MenuGrapher.getMenu("GeneralText"),
                playerX: number = FSP.getMidX(player),
                playerGoal: number = menu.left - player.width * FSP.unitsize / 2,
                battleInfo: IBattleInfo = settings.battleInfo,
                timeout: number = 24;

            FSP.MenuGrapher.deleteMenu("BattlePlayerHealth");

            if (!battleInfo.player.hasActors) {
                FSP.ScenePlayer.playRoutine("ShowPlayerMenu");
                return;
            }

            FSP.animateFadeHorizontal(
                player,
                (playerGoal - playerX) / timeout,
                playerGoal,
                1);

            FSP.TimeHandler.addEvent(
                FSP.animateFadeAttribute,
                (timeout / 2) | 0,
                player,
                "opacity",
                -2 / timeout,
                0,
                1);

            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": true
            });
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    battleInfo.textPlayerSendOut[0]
                    + battleInfo.player.actors[0].title
                    + battleInfo.textPlayerSendOut[1]
                ]
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");

            FSP.TimeHandler.addEvent(
                FSP.ScenePlayer.bindRoutine(
                    "PlayerSendOut",
                    [
                        {
                            "nextRoutine": "ShowPlayerMenu"
                        }
                    ]),
                timeout);
        }

        /**
         * 
         */
        cutsceneBattleShowPlayerMenu(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.deleteMenu("Yes/No");

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.BattleMover.showPlayerMenu();

            if (settings.battleInfo.onShowPlayerMenu) {
                settings.battleInfo.onShowPlayerMenu(FSP);
            }
        }

        /**
         * 
         */
        cutsceneBattleOpponentSendOut(FSP: FullScreenPokemon, settings: any): void {
            var menu: IMenu = settings.things.menu,
                left: number = menu.right - FSP.unitsize * 8,
                top: number = menu.top + FSP.unitsize * 32;

            console.warn("Should reset *Normal statistics for opponent Pokemon.");

            settings.opponentLeft = left;
            settings.opponentTop = top;

            FSP.MenuGrapher.setActiveMenu(undefined);

            FSP.animateSmokeSmall(
                FSP,
                left,
                top,
                FSP.ScenePlayer.bindRoutine(
                    "OpponentSendOutAppear",
                    settings.routineArguments)
            );
        }

        /**
         * 
         */
        cutsceneBattleOpponentSendOutAppear(FSP: FullScreenPokemon, settings: any): void {
            var opponentInfo: BattleMovr.IBattleThingInfo = settings.battleInfo.opponent,
                pokemonInfo: BattleMovr.IActor = opponentInfo.actors[opponentInfo.selectedIndex],
                pokemon: BattleMovr.IThing = FSP.BattleMover.setThing(
                    "opponent", pokemonInfo.title + "Front");

            console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);

            FSP.addBattleDisplayPokemonHealth(FSP, "opponent");

            FSP.ScenePlayer.playRoutine(settings.routineArguments.nextRoutine);
        }

        /**
         * 
         */
        cutsceneBattlePlayerSendOut(FSP: FullScreenPokemon, settings: any): void {
            var menu: IMenu = settings.things.menu,
                left: number = menu.left + FSP.unitsize * 8,
                top: number = menu.bottom - FSP.unitsize * 8;

            console.warn("Should reset *Normal statistics for player Pokemon.");

            settings.playerLeft = left;
            settings.playerTop = top;

            FSP.MenuGrapher.setActiveMenu(undefined);

            FSP.animateSmokeSmall(
                FSP,
                left,
                top,
                FSP.ScenePlayer.bindRoutine(
                    "PlayerSendOutAppear",
                    settings.routineArguments
                ));
        }

        /**
         * 
         */
        cutsceneBattlePlayerSendOutAppear(FSP: FullScreenPokemon, settings: any): void {
            var playerInfo: BattleMovr.IBattleThingInfo = settings.battleInfo.player,
                pokemonInfo: BattleMovr.IActor = playerInfo.selectedActor,
                pokemon: BattleMovr.IThing = FSP.BattleMover.setThing("player", pokemonInfo.title + "Back");

            console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);

            FSP.addBattleDisplayPokemonHealth(FSP, "player");

            FSP.MenuGrapher.createMenu("BattlePlayerHealthNumbers");
            FSP.MenuGrapher.addMenuDialog(
                "BattlePlayerHealthNumbers",
                [
                    [
                        FSP.makeDigit(pokemonInfo.HP, 3, " ")
                        + "/"
                        + FSP.makeDigit(pokemonInfo.HPNormal, 3, " ")
                    ]
                ]);

            FSP.ScenePlayer.playRoutine(settings.routineArguments.nextRoutine);
        }

        /**
         * 
         */
        cutsceneBattlePlayerSwitchesSamePokemon(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText", {
                "backMenu": "PokemonMenuContext"
            });
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    settings.battleInfo.player.selectedActor.nickname + " is already out!"
                ]);
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneBattleMovePlayer(FSP: FullScreenPokemon, settings: any): void {
            var player: BattleMovr.IBattleThingInfo = settings.battleInfo.player,
                playerActor: BattleMovr.IActor = player.selectedActor,
                opponent: BattleMovr.IBattleThingInfo = settings.battleInfo.opponent,
                opponentActor: BattleMovr.IActor = opponent.selectedActor,
                routineArguments: any = settings.routineArguments,
                choice: string = routineArguments.choicePlayer;

            routineArguments.damage = FSP.MathDecider.compute(
                "damage", choice, playerActor, opponentActor);

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    playerActor.nickname + " used " + choice + "!"
                ],
                FSP.ScenePlayer.bindRoutine(
                    "MovePlayerAnimate", routineArguments
                )
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneBattleMovePlayerAnimate(FPS: FullScreenPokemon, settings: any): void {
            var routineArguments: any = settings.routineArguments,
                choice: string = routineArguments.choicePlayer,
                move: IPokedexMove = FPS.MathDecider.getConstant("moves")[choice];

            console.log("Should do something with", move);

            routineArguments.attackerName = "player";
            routineArguments.defenderName = "opponent";

            routineArguments.callback = function (): void {
                var callback: Function;

                routineArguments.movePlayerDone = true;

                if (routineArguments.moveOpponentDone) {
                    callback = function (): void {
                        routineArguments.movePlayerDone = false;
                        routineArguments.moveOpponentDone = false;
                        FPS.MenuGrapher.createMenu("GeneralText");
                        FPS.BattleMover.showPlayerMenu();
                    };
                } else {
                    callback = FPS.TimeHandler.addEvent.bind(
                        FPS.TimeHandler,
                        FPS.ScenePlayer.bindRoutine(
                            "MoveOpponent", settings.routineArguments
                        ),
                        7);
                }

                FPS.ScenePlayer.playRoutine("Damage", {
                    "battlerName": "opponent",
                    "damage": routineArguments.damage,
                    "callback": callback
                });
            };

            // @todo: When all moves have been implemented, this will be simplified.
            if (!FPS.ScenePlayer.getOtherRoutine("Attack" + choice)) {
                console.warn(choice + " attack animation not implemented...");
                routineArguments.callback();
            } else {
                FPS.ScenePlayer.playRoutine(
                    "Attack" + choice.replace(" ", ""), routineArguments);
            }
        }

        /**
         * 
         */
        cutsceneBattleMoveOpponent(FSP: FullScreenPokemon, settings: any): void {
            var opponent: BattleMovr.IBattleThingInfo = settings.battleInfo.opponent,
                opponentActor: BattleMovr.IActor = opponent.selectedActor,
                player: BattleMovr.IBattleThingInfo = settings.battleInfo.player,
                playerActor: BattleMovr.IActor = player.selectedActor,
                routineArguments: any = settings.routineArguments,
                choice: string = routineArguments.choiceOpponent;

            routineArguments.damage = FSP.MathDecider.compute(
                "damage", choice, opponentActor, playerActor);

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [opponent.selectedActor.nickname + " used " + choice + "!"],
                FSP.ScenePlayer.bindRoutine("MoveOpponentAnimate", routineArguments));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneBattleMoveOpponentAnimate(FSP: FullScreenPokemon, settings: any): void {
            var routineArguments: any = settings.routineArguments,
                choice: string = routineArguments.choiceOpponent,
                move: string = FSP.MathDecider.getConstant("moves")[choice];

            console.log("Should do something with", move);

            routineArguments.attackerName = "opponent";
            routineArguments.defenderName = "player";

            routineArguments.callback = function (): void {
                var callback: Function;

                routineArguments.moveOpponentDone = true;

                if (routineArguments.movePlayerDone) {
                    callback = function (): void {
                        routineArguments.movePlayerDone = false;
                        routineArguments.moveOpponentDone = false;
                        FSP.MenuGrapher.createMenu("GeneralText");
                        FSP.BattleMover.showPlayerMenu();
                    };
                } else {
                    callback = FSP.TimeHandler.addEvent.bind(
                        FSP.TimeHandler,
                        FSP.ScenePlayer.bindRoutine(
                            "MovePlayer", settings.routineArguments
                        ),
                        7);
                }

                FSP.ScenePlayer.playRoutine("Damage", {
                    "battlerName": "player",
                    "damage": routineArguments.damage,
                    "callback": callback
                });
            };

            // @todo: When all moves have been implemented, this will be simplified.
            if (!FSP.ScenePlayer.getOtherRoutine("Attack" + choice)) {
                console.warn(choice + " attack animation not implemented...");
                routineArguments.callback();
            } else {
                FSP.ScenePlayer.playRoutine(
                    "Attack" + choice.replace(" ", ""), routineArguments);
            }
        }

        /**
         * 
         */
        cutsceneBattleDamage(FSP: FullScreenPokemon, settings: any): void {
            var battlerName: string = settings.routineArguments.battlerName,
                damage: number = settings.routineArguments.damage,
                battleInfo: IBattleInfo = <IBattleInfo>FSP.BattleMover.getBattleInfo(),
                battler: BattleMovr.IBattleThingInfo = battleInfo[battlerName],
                actor: BattleMovr.IActor = battler.selectedActor,
                hpStart: number = actor.HP,
                hpEnd: number = Math.max(hpStart - damage, 0),
                callback: (...args: any[]) => void = hpEnd === 0
                    ? FSP.TimeHandler.addEvent.bind(
                        FSP.TimeHandler,
                        FSP.ScenePlayer.bindRoutine(
                            "PokemonFaints",
                            [{
                                "battlerName": battlerName
                            }]),
                        49)
                    : settings.routineArguments.callback;

            if (damage !== 0) {
                FSP.animateBattleDisplayPokemonHealthBar(
                    FSP,
                    battlerName,
                    hpStart,
                    hpEnd,
                    actor.HPNormal,
                    callback);

                actor.HP = hpEnd;
            } else {
                callback(FSP);
            }
        }

        /**
         * 
         */
        cutsceneBattlePokemonFaints(FSP: FullScreenPokemon, settings: any): void {
            var routineArguments: any = settings.routineArguments,
                battlerName: string = routineArguments.battlerName,
                battleInfo: IBattleInfo = <IBattleInfo>FSP.BattleMover.getBattleInfo(),
                actor: BattleMovr.IActor = battleInfo[battlerName].selectedActor,
                thing: IThing = settings.things[battlerName],
                blank: IThing = FSP.ObjectMaker.make(
                    "WhiteSquare",
                    {
                        "width": thing.width * thing.scale,
                        "height": thing.height * thing.scale
                    }),
                texts: IThing[] = <IThing[]>FSP.GroupHolder.getGroup("Text"),
                background: IThing = <IThing>FSP.BattleMover.getBackgroundThing(),
                backgroundIndex: number = texts.indexOf(background),
                nextRoutine: string = battlerName === "player"
                    ? "AfterPlayerPokemonFaints" : "AfterOpponentPokemonFaints";

            FSP.addThing(
                blank,
                thing.left,
                thing.top + thing.height * thing.scale * thing.FSP.unitsize);

            FSP.arrayToIndex(blank, texts, backgroundIndex + 1);
            FSP.arrayToIndex(thing, texts, backgroundIndex + 1);

            FSP.animateFadeVertical(
                thing,
                FSP.unitsize * 2,
                FSP.getMidY(thing) + thing.height * thing.scale * FSP.unitsize,
                1,
                function (): void {
                    FSP.killNormal(thing);
                    FSP.killNormal(blank);
                    FSP.MenuGrapher.createMenu("GeneralText");
                    FSP.MenuGrapher.addMenuDialog(
                        "GeneralText",
                        [
                            actor.nickname + " fainted!"
                        ],
                        FSP.ScenePlayer.bindRoutine(
                            nextRoutine, routineArguments
                        )
                    );
                    FSP.MenuGrapher.setActiveMenu("GeneralText");
                });
        }

        /**
         * 
         */
        cutsceneBattleAfterPlayerPokemonFaints(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = <IBattleInfo>FSP.BattleMover.getBattleInfo(),
                actorAvailable: boolean = FSP.checkArrayMembersIndex(battleInfo.player.actors, "HP");

            if (actorAvailable) {
                FSP.ScenePlayer.playRoutine("PlayerChoosesPokemon");
            } else {
                FSP.ScenePlayer.playRoutine("Defeat");
            }
        }

        /**
         * 
         */
        cutsceneBattleAfterOpponentPokemonFaints(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = settings.battleInfo,
                opponent: BattleMovr.IBattleThingInfo = battleInfo.opponent,
                actorAvailable: boolean = FSP.checkArrayMembersIndex(opponent.actors, "HP"),
                experienceGained: number = FSP.MathDecider.compute(
                    "experienceGained", battleInfo.player, battleInfo.opponent),
                callback: Function;

            if (actorAvailable) {
                callback = FSP.ScenePlayer.bindRoutine("OpponentSwitchesPokemon");
            } else {
                callback = FSP.ScenePlayer.bindRoutine("Victory");
            }

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    [
                        battleInfo.player.selectedActor.nickname,
                        "gained",
                        experienceGained,
                        "EXP. points!"
                    ].join(" ")
                ],
                FSP.ScenePlayer.bindRoutine(
                    "ExperienceGain",
                    [
                        {
                            "experienceGained": experienceGained,
                            "callback": callback
                        }
                    ]));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneBattleOpponentSwitchesPokemon(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = settings.battleInfo,
                opponent: BattleMovr.IBattleThingInfo = battleInfo.opponent;

            FSP.BattleMover.switchActor("opponent", opponent.selectedIndex + 1);
            opponent.selectedIndex += 1;
            opponent.selectedActor = opponent.actors[opponent.selectedIndex];

            FSP.MenuGrapher.createMenu("GeneralText", {
                "deleteOnFinish": false
            });
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    opponent.name + " is \n about to use " + opponent.selectedActor.nickname + "!",
                    "Will %%%%%%%PLAYER%%%%%%% change %%%%%%%POKEMON%%%%%%%?"
                ],
                function (): void {
                    FSP.MenuGrapher.createMenu("Yes/No");
                    FSP.MenuGrapher.addMenuList("Yes/No", {
                        "options": [
                            {
                                "text": "Yes",
                                "callback": FSP.ScenePlayer.bindRoutine(
                                    "PlayerSwitchesPokemon",
                                    [
                                        {
                                            "nextRoutine": "OpponentSendOut"
                                        }
                                    ])
                            }, {
                                "text": "No",
                                "callback": FSP.ScenePlayer.bindRoutine(
                                    "OpponentSendOut",
                                    [
                                        {
                                            "nextRoutine": "ShowPlayerMenu"
                                        }
                                    ])
                            }]
                    });
                    FSP.MenuGrapher.setActiveMenu("Yes/No");
                }
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");

        }

        /**
         * 
         */
        cutsceneBattleExperienceGain(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = settings.battleInfo,
                routineArguments: any = settings.routineArguments,
                gains: number = routineArguments.experienceGained,
                actor: BattleMovr.IActor = battleInfo.player.selectedActor,
                experience: BattleMovr.IActorExperience = actor.experience;

            console.warn("Experience gain is hardcoded to the current actor...");

            experience.current += gains;
            experience.remaining -= gains;

            if (experience.remaining < 0) {
                gains -= experience.remaining;
                FSP.ScenePlayer.playRoutine("LevelUp", {
                    "experienceGained": gains,
                    "callback": routineArguments.callback
                });
            } else {
                routineArguments.callback();
            }
        }

        /**
         * 
         */
        cutsceneBattleLevelUp(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = settings.battleInfo,
                routineArguments: any = settings.routineArguments,
                // gains: number = routineArguments.experienceGained,
                actor: BattleMovr.IActor = battleInfo.player.selectedActor;

            actor.level += 1;
            actor.experience = FSP.MathDecider.compute(
                "newPokemonExperience", actor.title, actor.level);

            console.warn("Leveling up does not yet increase stats...");

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    actor.nickname + " grew to level " + actor.level + "!"
                ],
                FSP.ScenePlayer.bindRoutine(
                    "LevelUpStats", routineArguments
                )
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneBattleLevelUpStats(FSP: FullScreenPokemon, settings: any): void {
            var routineArguments: any = settings.routineArguments;

            FSP.openPokemonStats({
                "container": "BattleDisplayInitial",
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom",
                    "offset": {
                        "left": 4
                    }
                },
                "pokemon": settings.battleInfo.player.selectedActor,
                "onMenuDelete": routineArguments.callback
            });
            FSP.MenuGrapher.setActiveMenu("LevelUpStats");

            console.warn("For stones, LevelUpStats should be taken out of battles.");
        }

        /**
         * 
         */
        cutsceneBattlePlayerChoosesPokemon(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("Pokemon", {
                "position": {
                    "vertical": "center",
                    "offset": {
                        "left": 0
                    }
                }
            });
        }

        /**
         * 
         */
        cutsceneBattleExitFail(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                "No! There's no running from a trainer battle!",
                FSP.ScenePlayer.bindRoutine("BattleExitFailReturn"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneBattleExitFailReturn(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.BattleMover.showPlayerMenu();
        }

        /**
         * 
         */
        cutsceneBattleVictory(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = <IBattleInfo>FSP.BattleMover.getBattleInfo(),
                opponent: BattleMovr.IBattleThingInfo = battleInfo.opponent;

            if (FSP.MapScreener.theme) {
                FSP.AudioPlayer.play(FSP.MapScreener.theme);
            }

            if (!opponent.hasActors) {
                FSP.BattleMover.closeBattle(
                    FSP.animateFadeFromColor.bind(
                        FSP, FSP, {
                            "color": "White"
                        })
                );
                return;
            }

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%PLAYER%%%%%%% defeated " + opponent.name + "!"
                ],
                FSP.ScenePlayer.bindRoutine("VictorySpeech")
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneBattleVictorySpeech(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = settings.battleInfo,
                menu: IMenu = <IMenu>FSP.MenuGrapher.getMenu("BattleDisplayInitial"),
                opponent: IThing = <IThing>FSP.BattleMover.setThing("opponent", battleInfo.opponent.sprite),
                timeout: number = 35,
                opponentX: number,
                opponentGoal: number;

            opponent.opacity = 0;

            FSP.setTop(opponent, menu.top);
            FSP.setLeft(opponent, menu.right);
            opponentX = FSP.getMidX(opponent);
            opponentGoal = menu.right - opponent.width * FSP.unitsize / 2;

            FSP.animateFadeAttribute(opponent, "opacity", 4 / timeout, 1, 1);
            FSP.animateFadeHorizontal(
                opponent,
                (opponentGoal - opponentX) / timeout,
                opponentGoal,
                1,
                function (): void {
                    FSP.MenuGrapher.createMenu("GeneralText");
                    FSP.MenuGrapher.addMenuDialog(
                        "GeneralText",
                        battleInfo.textVictory,
                        FSP.ScenePlayer.bindRoutine("VictoryWinnings"));
                    FSP.MenuGrapher.setActiveMenu("GeneralText");
                });
        }

        /**
         * 
         */
        cutsceneBattleVictoryWinnings(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = settings.battleInfo,
                reward: number = settings.battleInfo.opponent.reward,
                animationSettings: any = {
                    "color": "White"
                },
                callback: () => void = FSP.BattleMover.closeBattle.bind(
                    FSP.BattleMover,
                    FSP.animateFadeFromColor.bind(FSP, FSP, animationSettings));

            if (battleInfo.giftAfterBattle) {
                FSP.addItemToBag(FSP, battleInfo.giftAfterBattle, battleInfo.giftAfterBattleAmount || 1);
            }

            if (battleInfo.badge) {
                FSP.ItemsHolder.getItem("badges")[battleInfo.badge] = true;
            }

            if (battleInfo.textAfterBattle) {
                animationSettings.callback = function (): void {
                    FSP.MenuGrapher.createMenu("GeneralText");
                    FSP.MenuGrapher.addMenuDialog(
                        "GeneralText", battleInfo.textAfterBattle);
                    FSP.MenuGrapher.setActiveMenu("GeneralText");
                };
            }

            if (!reward) {
                callback();
                return;
            }

            FSP.ItemsHolder.increase("money", reward);

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%PLAYER%%%%%%% got $" + reward + " for winning!"
                ],
                callback);
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneBattleDefeat(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = settings.battleInfo,
                message: string[] = [
                    "%%%%%%%PLAYER%%%%%%% is out of useable %%%%%%%POKEMON%%%%%%%!"
                ],
                transport: ITransportSchema,
                callback: Function;

            if (!battleInfo.noBlackout) {
                message.push("%%%%%%%PLAYER%%%%%%% blacked out!");
                transport = FSP.ItemsHolder.getItem("lastPokecenter");
                callback = FSP.setMap.bind(FSP, transport.map, transport.location);
            } else {
                callback = FSP.BattleMover.closeBattle;
            }

            if (FSP.MapScreener.theme) {
                FSP.AudioPlayer.play(FSP.MapScreener.theme);
            }

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                message,
                FSP.animateFadeToColor.bind(FSP, FSP, {
                    "color": "Black",
                    "callback": callback
                }));
            FSP.MenuGrapher.setActiveMenu("GeneralText");

            FSP.ScenePlayer.stopCutscene();
        }

        /**
         * 
         */
        cutsceneBattleComplete(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = settings.battleInfo,
                keptThings: (string | IThing)[],
                thing: string | IThing,
                i: number;

            FSP.MapScreener.blockInputs = false;

            if (battleInfo.keptThings) {
                keptThings = battleInfo.keptThings.slice();
                keptThings.push(FSP.player);

                for (i = 0; i < keptThings.length; i += 1) {
                    thing = keptThings[i];

                    if (thing.constructor === String) {
                        thing = FSP.getThingById(<string>thing);
                    }

                    FSP.GroupHolder.switchObjectGroup(
                        thing,
                        "Text",
                        (<IThing>thing).groupType);
                }
            }

            FSP.ItemsHolder.setItem("PokemonInParty", battleInfo.player.actors);

            if (settings.nextCutscene) {
                FSP.ScenePlayer.startCutscene(
                    settings.nextCutscene, settings.nextCutsceneSettings);
            }
        }

        /**
         * 
         */
        cutsceneBattleTransitionLineSpiral(FSP: FullScreenPokemon, settings: any): void {
            var unitsize: number = FSP.unitsize,
                divisor: number = settings.divisor || 15,
                screenWidth: number = FSP.MapScreener.width,
                screenHeight: number = FSP.MapScreener.height,
                width: number = Math.ceil(screenWidth / divisor),
                height: number = Math.ceil(screenHeight / divisor),
                numTimes: number = 0,
                direction: number = 2,
                things: IThing[] = [],
                keptThings: (string | IThing)[] = settings.keptThings,
                thing: IThing,
                difference: number,
                destination: number,
                i: number;

            if (keptThings) {
                keptThings = keptThings.slice();

                for (i = 0; i < keptThings.length; i += 1) {
                    if (keptThings[i].constructor === String) {
                        keptThings[i] = FSP.getThingById(<string>keptThings[i]);
                    }
                    FSP.GroupHolder.switchObjectGroup(
                        keptThings[i],
                        (<IThing>keptThings[i]).groupType,
                        "Text");
                }
            }

            /**
             * Yes, an inline Function. It makes things easier by calling itself
             * a bunch of times.
             */
            function addThing(): void {
                if (numTimes >= ((divisor / 2) | 0)) {
                    if (settings.callback) {
                        settings.callback();
                        things.forEach(FSP.killNormal);
                    }
                    return;
                }

                switch (thing.direction) {
                    case 0:
                        thing = FSP.ObjectMaker.make("BlackSquare", {
                            "width": width / unitsize,
                            "height": screenHeight / unitsize
                        });
                        FSP.addThing(
                            thing,
                            screenWidth - ((numTimes + 1) * width),
                            screenHeight - ((numTimes + 1) * divisor)
                        );
                        difference = -height;
                        destination = numTimes * height;
                        break;

                    case 1:
                        thing = FSP.ObjectMaker.make("BlackSquare", {
                            "width": screenWidth / unitsize,
                            "height": height / unitsize
                        });
                        FSP.addThing(
                            thing,
                            numTimes * divisor - screenWidth,
                            screenHeight - (numTimes + 1) * height
                        );
                        difference = width;
                        destination = screenWidth - numTimes * width;
                        break;

                    case 2:
                        thing = FSP.ObjectMaker.make("BlackSquare", {
                            "width": width / unitsize,
                            "height": screenHeight / unitsize
                        });
                        FSP.addThing(
                            thing,
                            numTimes * width,
                            numTimes * height - screenHeight
                        );
                        difference = height;
                        destination = screenHeight - numTimes * height;
                        break;

                    case 3:
                        thing = FSP.ObjectMaker.make("BlackSquare", {
                            "width": screenWidth / unitsize,
                            "height": height / unitsize
                        });
                        FSP.addThing(
                            thing,
                            screenWidth - numTimes * divisor,
                            numTimes * height
                        );
                        difference = -width;
                        destination = numTimes * width;
                        break;

                    default:
                        throw new Error("Unknown direction: " + direction + ".");
                }

                things.push(thing);

                if (keptThings) {
                    for (i = 0; i < keptThings.length; i += 1) {
                        FSP.arrayToEnd(
                            <IThing>keptThings[i], <IThing[]>FSP.GroupHolder.getGroup("Text"));
                    }
                }

                FSP.TimeHandler.addEventInterval(
                    function (): boolean {
                        if (direction % 2 === 1) {
                            FSP.shiftHoriz(thing, difference);
                        } else {
                            FSP.shiftVert(thing, difference);
                        }

                        if (direction === 1 || direction === 2) {
                            if (thing[DirectionAliases[direction]] < destination) {
                                return false;
                            }
                        } else {
                            if (thing[DirectionAliases[direction]] > destination) {
                                return false;
                            }
                        }

                        direction = (direction + 3) % 4;
                        if (direction === 2) {
                            numTimes += 1;
                        }
                        addThing();
                        return true;
                    },
                    1,
                    Infinity);
            }

            addThing();
        }

        /**
         * 
         * 
         * @remarks Three [black, white] flashes, then the spiral
         */
        cutsceneBattleTransitionFlash(FSP: FullScreenPokemon, settings: any): void {
            var flashes: number = settings.flashes || 6,
                flashColors: string[] = settings.flashColors || ["Black", "White"],
                callback: Function = settings.callback,
                change: number = settings.change || .33,
                speed: number = settings.speed || 1,
                completed: number = 0,
                color: string,
                repeater: () => void = function (): void {
                    if (completed >= flashes) {
                        if (callback) {
                            callback();
                        }
                        return;
                    }

                    color = flashColors[completed % flashColors.length];
                    completed += 1;

                    FSP.animateFadeToColor(FSP, {
                        "color": color,
                        "change": change,
                        "speed": speed,
                        "callback": FSP.animateFadeFromColor.bind(
                            FSP,
                            FSP,
                            {
                                "color": color,
                                "change": change,
                                "speed": speed,
                                "callback": repeater
                            })
                    });
                };

            repeater();
        }

        /**
         * 
         * 
         * I think the way to do this would be to treat each quarter of the screen
         * as one section. Divide each section into 10 parts. On each interval
         * increase the maximum the parts can be, while each part is a fraction of
         * the maximum, rounded to a large amount to appear pixellated (perhaps,
         * unitsize * 32?).
         */
        cutsceneBattleTransitionTwist(FSP: FullScreenPokemon, settings: any): void {
            throw new Error("Not yet implemented.");
        }

        /**
         * 
         */
        cutsceneBattleTransitionFlashTwist(FSP: FullScreenPokemon, settings: any): void {
            FSP.cutsceneBattleTransitionFlash(
                FSP,
                {
                    "callback": FSP.cutsceneBattleTransitionTwist.bind(FSP, FSP, settings)
                });
        }

        /**
         * 
         */
        cutsceneBattleChangeStatistic(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = settings.battleInfo,
                routineArguments: any = settings.routineArguments,
                defenderName: string = routineArguments.defenderName,
                defender: BattleMovr.IActor = battleInfo[defenderName].selectedActor,
                defenderLabel: string = defenderName === "opponent"
                    ? "Enemy " : "",
                statistic: string = routineArguments.statistic,
                amount: number = routineArguments.amount,
                amountLabel: string;

            defender[statistic] -= amount;

            switch (amount) {
                case 2:
                    amountLabel = "sharply rose";
                    break;
                case 1:
                    amountLabel = "rose";
                    break;
                case -1:
                    amountLabel = "fell";
                    break;
                case -2:
                    amountLabel = "sharply fell";
                    break;
                default:
                    break;
            }

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    [
                        defenderLabel + defender.nickname + "'s",
                        statistic.toUpperCase(),
                        amountLabel + "!"
                    ].join(" ")
                ],
                routineArguments.callback
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /* Battle attack animations
        */

        /**
         * 
         */
        cutsceneBattleAttackGrowl(FSP: FullScreenPokemon, settings: any): void {
            var battleInfo: IBattleInfo = settings.battleInfo,
                routineArguments: any = settings.routineArguments,
                attackerName: string = routineArguments.attackerName,
                defenderName: string = routineArguments.defenderName,
                attacker: IThing = <IThing>FSP.BattleMover.getThing(attackerName),
                defender: IThing = <IThing>FSP.BattleMover.getThing(defenderName),
                direction: number = attackerName === "player" ? 1 : -1,
                notes: IThing[] = [
                    FSP.ObjectMaker.make("Note"),
                    FSP.ObjectMaker.make("Note")
                ];

            console.log("Should do something with", notes, direction, defender, attacker, battleInfo);

            FSP.ScenePlayer.playRoutine(
                "ChangeStatistic",
                FSP.proliferate(
                    {
                        "callback": routineArguments.callback,
                        "defenderName": defenderName,
                        "statistic": "Attack",
                        "amount": -1
                    },
                    routineArguments));
        }

        /**
         * 
         */
        cutsceneBattleAttackTackle(FSP: FullScreenPokemon, settings: any): void {
            var routineArguments: any = settings.routineArguments,
                attackerName: string = routineArguments.attackerName,
                defenderName: string = routineArguments.defenderName,
                attacker: IThing = <IThing>FSP.BattleMover.getThing(attackerName),
                defender: IThing = <IThing>FSP.BattleMover.getThing(defenderName),
                direction: number = attackerName === "player" ? 1 : -1,
                xvel: number = 7 * direction,
                dt: number = 7,
                movement: TimeHandlr.IEvent = FSP.TimeHandler.addEventInterval(
                    function (): void {
                        FSP.shiftHoriz(attacker, xvel);
                    },
                    1,
                    Infinity);

            FSP.TimeHandler.addEvent(
                function (): void {
                    xvel *= -1;
                },
                dt);

            FSP.TimeHandler.addEvent(FSP.TimeHandler.cancelEvent, dt * 2 - 1, movement);

            if (attackerName === "player") {
                FSP.TimeHandler.addEvent(
                    FSP.animateFlicker,
                    dt * 2,
                    defender,
                    14,
                    5,
                    routineArguments.callback);
            } else {
                FSP.TimeHandler.addEvent(
                    FSP.animateScreenShake,
                    dt * 2,
                    FSP,
                    0,
                    undefined,
                    undefined,
                    undefined,
                    FSP.animateFlicker.bind(
                        FSP,
                        defender,
                        14,
                        5,
                        routineArguments.callback)
                );
            }
        }

        /**
         * 
         */
        cutsceneBattleAttackTailWhip(FSP: FullScreenPokemon, settings: any): void {
            var routineArguments: any = settings.routineArguments,
                attackerName: string = routineArguments.attackerName,
                defenderName: string = routineArguments.defenderName,
                attacker: IThing = <IThing>FSP.BattleMover.getThing(attackerName),
                direction: number = attackerName === "player" ? 1 : -1,
                dt: number = 11,
                dx: number = FSP.unitsize * 4;

            FSP.shiftHoriz(attacker, dx * direction);

            FSP.TimeHandler.addEvent(
                FSP.shiftHoriz,
                dt,
                attacker,
                -dx * direction);

            FSP.TimeHandler.addEvent(
                FSP.shiftHoriz,
                dt * 2,
                attacker,
                dx * direction);

            FSP.TimeHandler.addEvent(
                FSP.shiftHoriz,
                dt * 3,
                attacker,
                -dx * direction);

            FSP.TimeHandler.addEvent(
                FSP.animateScreenShake,
                (dt * 3.5) | 0,
                FSP,
                3,
                0,
                6,
                undefined,
                FSP.ScenePlayer.bindRoutine(
                    "ChangeStatistic",
                    [
                        {
                            "callback": routineArguments.callback,
                            "defenderName": defenderName,
                            "statistic": "Defense",
                            "amount": -1
                        }
                    ]));
        }

        /**
         * 
         */
        cutsceneTrainerSpottedExclamation(FSP: FullScreenPokemon, settings: any): void {
            FSP.animateCharacterPreventWalking(FSP.player);
            FSP.animateExclamation(
                settings.triggerer,
                70,
                FSP.ScenePlayer.bindRoutine("Approach"));
        }

        /**
         * 
         */
        cutsceneTrainerSpottedApproach(FSP: FullScreenPokemon, settings: any): void {
            var player: IPlayer = settings.player,
                triggerer: ICharacter = settings.triggerer,
                direction: Direction = triggerer.direction,
                directionName: string = Direction[direction],
                distance: number = Math.abs(triggerer[directionName] - player[directionName]),
                blocks: number = Math.max(0, distance / FSP.unitsize / 8 - 1);

            if (blocks) {
                FSP.animateCharacterStartWalking(
                    triggerer,
                    direction,
                    [
                        blocks,
                        FSP.ScenePlayer.bindRoutine("Dialog")
                    ]
                );
            } else {
                FSP.ScenePlayer.playRoutine("Dialog");
            }
        }

        /**
         * 
         */
        cutsceneTrainerSpottedDialog(FSP: FullScreenPokemon, settings: any): void {
            FSP.collideCharacterDialog(settings.player, settings.triggerer);
            FSP.MapScreener.blockInputs = false;
        }

        /**
         * 
         */
        cutscenePokeCenterWelcome(FSP: FullScreenPokemon, settings: any): void {
            settings.nurse = FSP.getThingById(settings.nurseId || "Nurse");
            settings.machine = FSP.getThingById(settings.machineId || "HealingMachine");

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Welcome to our %%%%%%%POKEMON%%%%%%% CENTER!",
                    "We heal your %%%%%%%POKEMON%%%%%%% back to perfect health!",
                    "Shall we heal your %%%%%%%POKEMON%%%%%%%?"
                ],
                FSP.ScenePlayer.bindRoutine("Choose")
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutscenePokeCenterChoose(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("Heal/Cancel");
            FSP.MenuGrapher.addMenuList(
                "Heal/Cancel",
                {
                    "options": [
                        {
                            "text": "HEAL",
                            "callback": FSP.ScenePlayer.bindRoutine("ChooseHeal")
                        },
                        {
                            "text": "CANCEL",
                            "callback": FSP.ScenePlayer.bindRoutine("ChooseCancel")
                        }
                    ]
                }
            );
            FSP.MenuGrapher.setActiveMenu("Heal/Cancel");
        }

        /**
         * 
         */
        cutscenePokeCenterChooseHeal(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.deleteMenu("Heal/Cancel");

            FSP.MenuGrapher.createMenu("GeneralText", {
                "ignoreA": true,
                "finishAutomatically": true
            });
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Ok. We'll need your Pokemon."
                ],
                FSP.ScenePlayer.bindRoutine("Healing")
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutscenePokeCenterHealing(FSP: FullScreenPokemon, settings: any): void {
            var party: BattleMovr.IActor[] = FSP.ItemsHolder.getItem("PokemonInParty"),
                balls: IThing[] = [],
                dt: number = 35,
                left: number = settings.machine.left + 5 * FSP.unitsize,
                top: number = settings.machine.top + 7 * FSP.unitsize,
                i: number = 0;

            settings.balls = balls;
            FSP.animateCharacterSetDirection(settings.nurse, 3);

            FSP.TimeHandler.addEventInterval(
                function (): void {
                    balls.push(
                        FSP.addThing(
                            "HealingMachineBall",
                            left + (i % 2) * 3 * FSP.unitsize,
                            top + Math.floor(i / 2) * 2.5 * FSP.unitsize
                        )
                    );
                    i += 1;
                },
                dt,
                party.length);

            FSP.TimeHandler.addEvent(
                FSP.ScenePlayer.playRoutine,
                dt * (party.length + 1),
                "HealingAction",
                {
                    "balls": balls
                });
        }

        /**
         * 
         */
        cutscenePokeCenterHealingAction(FSP: FullScreenPokemon, settings: any): void {
            var routineArguments: any = settings.routineArguments,
                balls: IThing[] = routineArguments.balls,
                numFlashes: number = 8,
                i: number = 0,
                changer: Function,
                j: number;

            FSP.TimeHandler.addEventInterval(
                function (): void {
                    changer = i % 2 === 0
                        ? FSP.addClass
                        : FSP.removeClass;

                    for (j = 0; j < balls.length; j += 1) {
                        changer(balls[j], "lit");
                    }

                    changer(settings.machine, "lit");

                    i += 1;
                },
                21,
                numFlashes);

            FSP.TimeHandler.addEvent(
                FSP.ScenePlayer.playRoutine,
                (numFlashes + 2) * 21,
                "HealingComplete",
                {
                    "balls": balls
                }
            );
        }

        /**
         * 
         */
        cutscenePokeCenterHealingComplete(FSP: FullScreenPokemon, settings: any): void {
            var routineArguments: any = settings.routineArguments,
                balls: IThing[] = routineArguments.balls,
                party: BattleMovr.IActor[] = FSP.ItemsHolder.getItem("PokemonInParty");

            // rekt
            balls.forEach(FSP.killNormal);

            party.forEach(FSP.healPokemon.bind(FSP));

            FSP.animateCharacterSetDirection(settings.nurse, 2);

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Thank you! \n Your %%%%%%%POKEMON%%%%%%% are fighting fit!",
                    "We hope to see you again!"
                ],
                function (): void {
                    FSP.MenuGrapher.deleteMenu("GeneralText");
                    FSP.ScenePlayer.stopCutscene();
                });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutscenePokeCenterChooseCancel(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.deleteMenu("Heal/Cancel");

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "We hope to see you again!"
                ],
                function (): void {
                    FSP.MenuGrapher.deleteMenu("GeneralText");
                    FSP.ScenePlayer.stopCutscene();
                });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutscenePokeMartGreeting(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": true,
                "ignoreA": true,
                "ignoreB": true
            });
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Hi there! \n May I help you?"
                ],
                FSP.ScenePlayer.bindRoutine("Options"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutscenePokeMartOptions(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("Money");

            FSP.MenuGrapher.createMenu("Buy/Sell", {
                "killOnB": ["Money", "GeneralText"],
                "onMenuDelete": FSP.ScenePlayer.bindRoutine("Exit")
            });
            FSP.MenuGrapher.addMenuList("Buy/Sell", {
                "options": [{
                    "text": "BUY",
                    "callback": FSP.ScenePlayer.bindRoutine("BuyMenu")
                }, {
                        "text": "SELL",
                        "callback": undefined
                    }, {
                        "text": "QUIT",
                        "callback": FSP.MenuGrapher.registerB
                    }]
            });
            FSP.MenuGrapher.setActiveMenu("Buy/Sell");
        }

        /**
         * 
         * 
         * @todo Add constants for all items, for display names
         */
        cutscenePokeMartBuyMenu(FSP: FullScreenPokemon, settings: any): void {
            var options: any[] = settings.triggerer.items.map(
                function (reference: any): any {
                    var text: string = reference.item.toUpperCase(),
                        cost: number = reference.cost;

                    return {
                        "text": text,
                        "textsFloating": [{
                            "text": "$" + cost,
                            "x": 42 - String(cost).length * 3.5,
                            "y": 4
                        }],
                        "callback": FSP.ScenePlayer.bindRoutine(
                            "SelectAmount",
                            [
                                {
                                    "reference": reference,
                                    "amount": 1,
                                    "cost": cost
                                }
                            ]),
                        "reference": reference
                    };
                });

            options.push({
                "text": "CANCEL",
                "callback": FSP.MenuGrapher.registerB
            });

            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": true
            });
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Take your time."
                ],
                function (): void {
                    FSP.MenuGrapher.createMenu("ShopItems", {
                        "backMenu": "Buy/Sell"
                    });
                    FSP.MenuGrapher.addMenuList("ShopItems", {
                        "options": options
                    });
                    FSP.MenuGrapher.setActiveMenu("ShopItems");
                }
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutscenePokeMartSelectAmount(FSP: FullScreenPokemon, settings: any): void {
            var routineArguments: any = settings.routineArguments,
                reference: any = routineArguments.reference,
                amount: number = routineArguments.amount,
                cost: number = routineArguments.cost,
                costTotal: number = cost * amount,
                text: string = FSP.makeDigit(amount, 2) + FSP.makeDigit("$" + costTotal, 8, " ");

            FSP.MenuGrapher.createMenu("ShopItemsAmount", {
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": [["Times"]],
                        "position": {
                            "offset": {
                                "left": 4,
                                "top": 4.25
                            }
                        }
                    }, {
                        "type": "text",
                        "words": [text],
                        "position": {
                            "offset": {
                                "left": 8,
                                "top": 3.75
                            }
                        }
                    }],
                "onUp": FSP.ScenePlayer.bindRoutine(
                    "SelectAmount",
                    [
                        {
                            "amount": (amount === 99) ? 1 : amount + 1,
                            "cost": cost,
                            "reference": reference
                        }
                    ]),
                "onDown": FSP.ScenePlayer.bindRoutine(
                    "SelectAmount",
                    [
                        {
                            "amount": (amount === 1) ? 99 : amount - 1,
                            "cost": cost,
                            "reference": reference
                        }
                    ]),
                "callback": FSP.ScenePlayer.bindRoutine("ConfirmPurchase", routineArguments)
            });
            FSP.MenuGrapher.setActiveMenu("ShopItemsAmount");
        }

        /**
         * 
         */
        cutscenePokeMartConfirmPurchase(FSP: FullScreenPokemon, settings: any): void {
            var routineArguments: any = settings.routineArguments,
                reference: any = routineArguments.reference,
                cost: number = routineArguments.cost,
                amount: number = routineArguments.amount,
                costTotal: number = routineArguments.costTotal = cost * amount;

            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": true
            });
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    reference.item.toUpperCase() + "? \n That will be $" + costTotal + ". OK?"
                ],
                function (): void {
                    FSP.MenuGrapher.createMenu("Yes/No", {
                        "position": {
                            "horizontal": "right",
                            "vertical": "bottom",
                            "offset": {
                                "top": 0,
                                "left": 0
                            }
                        },
                        "onMenuDelete": FSP.ScenePlayer.bindRoutine(
                            "CancelPurchase"
                        ),
                        "container": "ShopItemsAmount"
                    });
                    FSP.MenuGrapher.addMenuList("Yes/No", {
                        "options": [
                            {
                                "text": "YES",
                                "callback": FSP.ScenePlayer.bindRoutine(
                                    "TryPurchase", routineArguments)
                            }, {
                                "text": "NO",
                                "callback": FSP.ScenePlayer.bindRoutine(
                                    "CancelPurchase")
                            }]
                    });
                    FSP.MenuGrapher.setActiveMenu("Yes/No");
                });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         * 
         * @todo Why is the BuyMenu text appearing twice?
         */
        cutscenePokeMartCancelPurchase(FSP: FullScreenPokemon, settings: any): void {
            FSP.ScenePlayer.playRoutine("BuyMenu");
        }

        /**
         * 
         */
        cutscenePokeMartTryPurchase(FSP: FullScreenPokemon, settings: any): void {
            var routineArguments: any = settings.routineArguments,
                costTotal: number = routineArguments.costTotal;

            if (FSP.ItemsHolder.getItem("money") < costTotal) {
                FSP.ScenePlayer.playRoutine("FailPurchase", routineArguments);
                return;
            }

            FSP.ItemsHolder.decrease("money", routineArguments.costTotal);
            FSP.MenuGrapher.createMenu("Money");
            FSP.ItemsHolder.getItem("items").push({
                "item": routineArguments.reference.item,
                "amount": routineArguments.amount
            });

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Here you are! \n Thank you!"
                ],
                FSP.ScenePlayer.bindRoutine("ContinueShopping"));

            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutscenePokeMartFailPurchase(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "You don't have enough money."
                ],
                FSP.ScenePlayer.bindRoutine("ContinueShopping")
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutscenePokeMartContinueShopping(FSP: FullScreenPokemon, settings: any): void {
            if (FSP.MenuGrapher.getMenu("Yes/No")) {
                delete FSP.MenuGrapher.getMenu("Yes/No").onMenuDelete;
            }

            FSP.MenuGrapher.deleteMenu("ShopItems");
            FSP.MenuGrapher.deleteMenu("ShopItemsAmount");
            FSP.MenuGrapher.deleteMenu("Yes/No");

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Is there anything else I can do?"
                ]);

            FSP.MenuGrapher.setActiveMenu("Buy/Sell");
        }

        /**
         * 
         */
        cutscenePokeMartExit(FSP: FullScreenPokemon, settings: any): void {
            FSP.ScenePlayer.stopCutscene();

            FSP.MenuGrapher.deleteMenu("Buy/Sell");
            FSP.MenuGrapher.deleteMenu("Money");

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Thank you!"
                ],
                FSP.MenuGrapher.deleteActiveMenu
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneIntroFadeIn(FSP: FullScreenPokemon, settings: any): void {
            var oak: IThing = FSP.ObjectMaker.make("OakPortrait", {
                "opacity": 0
            });

            settings.oak = oak;

            console.warn("Cannot find Introduction audio theme!");
            // FSP.AudioPlayer.play("Introduction");
            FSP.ModAttacher.fireEvent("onIntroFadeIn", oak);

            FSP.setMap("Blank", "White");
            FSP.MenuGrapher.deleteActiveMenu();

            FSP.addThing(oak);
            FSP.setMidX(oak, FSP.MapScreener.middleX | 0);
            FSP.setMidY(oak, FSP.MapScreener.middleY | 0);

            FSP.TimeHandler.addEvent(
                FSP.animateFadeAttribute,
                70,
                oak,
                "opacity",
                .15,
                1,
                14,
                FSP.ScenePlayer.bindRoutine("FirstDialog"));
        }

        /**
         * 
         */
        cutsceneIntroFirstDialog(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Hello there! \n Welcome to the world of %%%%%%%POKEMON%%%%%%%!",
                    "My name is OAK! People call me the %%%%%%%POKEMON%%%%%%% PROF!"
                ],
                FSP.ScenePlayer.bindRoutine("FirstDialogFade")
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneIntroFirstDialogFade(FSP: FullScreenPokemon, settings: any): void {
            var blank: IThing = FSP.ObjectMaker.make("WhiteSquare", {
                "width": FSP.MapScreener.width,
                "height": FSP.MapScreener.height,
                "opacity": 0
            });

            FSP.addThing(blank, 0, 0);

            FSP.TimeHandler.addEvent(
                FSP.animateFadeAttribute,
                35,
                blank,
                "opacity",
                .15,
                1,
                7,
                FSP.ScenePlayer.bindRoutine("PokemonExpo"));
        }

        /**
         * 
         */
        cutsceneIntroPokemonExpo(FSP: FullScreenPokemon, settings: any): void {
            var pokemon: IThing = FSP.ObjectMaker.make("NidorinoFront", {
                "flipHoriz": true,
                "opacity": .01
            });

            FSP.GroupHolder.applyOnAll(FSP, FSP.killNormal);

            FSP.addThing(
                pokemon,
                (FSP.MapScreener.middleX + 24 * FSP.unitsize) | 0,
                0);

            FSP.setMidY(pokemon, FSP.MapScreener.middleY);

            FSP.animateFadeAttribute(
                pokemon,
                "opacity",
                .15,
                1,
                3);

            FSP.animateFadeHorizontal(
                pokemon,
                -FSP.unitsize * 2,
                FSP.MapScreener.middleX | 0,
                1,
                FSP.ScenePlayer.bindRoutine("PokemonExplanation"));
        }

        /**
         * 
         */
        cutsceneIntroPokemonExplanation(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "This world is inhabited by creatures called %%%%%%%POKEMON%%%%%%%!",
                    "For some people, %%%%%%%POKEMON%%%%%%% are pets. Others use them for fights.",
                    "Myself...",
                    "I study %%%%%%%POKEMON%%%%%%% as a profession."
                ],
                FSP.ScenePlayer.bindRoutine("PlayerAppear")
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneIntroPlayerAppear(FSP: FullScreenPokemon, settings: any): void {
            var middleX: number = FSP.MapScreener.middleX | 0,
                player: IPlayer = FSP.ObjectMaker.make("PlayerPortrait", {
                    "flipHoriz": true,
                    "opacity": .01
                });

            settings.player = player;

            FSP.GroupHolder.applyOnAll(FSP, FSP.killNormal);

            FSP.addThing(player, FSP.MapScreener.middleX + 24 * FSP.unitsize, 0);

            FSP.setMidY(player, FSP.MapScreener.middleY);

            FSP.animateFadeAttribute(player, "opacity", .15, 1, 3);

            FSP.animateFadeHorizontal(
                player,
                -FSP.unitsize * 2,
                middleX - player.width * FSP.unitsize / 2,
                1,
                FSP.ScenePlayer.bindRoutine("PlayerName"));
        }

        /**
         * 
         */
        cutsceneIntroPlayerName(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "First, what is your name?"
                ],
                FSP.ScenePlayer.bindRoutine("PlayerSlide"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneIntroPlayerSlide(FSP: FullScreenPokemon, settings: any): void {
            FSP.animateFadeHorizontal(
                settings.player,
                FSP.unitsize,
                (FSP.MapScreener.middleX + 16 * FSP.unitsize) | 0,
                1,
                FSP.ScenePlayer.bindRoutine("PlayerNameOptions"));
        }

        /**
         * 
         */
        cutsceneIntroPlayerNameOptions(FSP: FullScreenPokemon, settings: any): void {
            var fromMenu: Function = FSP.ScenePlayer.bindRoutine("PlayerNameFromMenu"),
                fromKeyboard: Function = FSP.ScenePlayer.bindRoutine("PlayerNameFromKeyboard");

            FSP.MenuGrapher.createMenu("NameOptions");
            FSP.MenuGrapher.addMenuList("NameOptions", {
                "options": [
                    {
                        "text": "NEW NAME",
                        "callback": FSP.openKeyboardMenu.bind(FSP, {
                            "title": "YOUR NAME?",
                            "callback": fromKeyboard
                        })
                    }, {
                        "text": "BLUE",
                        "callback": fromMenu
                    }, {
                        "text": "GARY",
                        "callback": fromMenu
                    }, {
                        "text": "JOHN",
                        "callback": fromMenu
                    }]
            });
            FSP.MenuGrapher.setActiveMenu("NameOptions");
        }

        /**
         * 
         */
        cutsceneIntroPlayerNameFromMenu(FSP: FullScreenPokemon, settings: any): void {
            settings.name = FSP.MenuGrapher.getMenuSelectedOption("NameOptions").text;

            FSP.MenuGrapher.deleteMenu("NameOptions");

            FSP.animateFadeHorizontal(
                settings.player,
                -FSP.unitsize,
                FSP.MapScreener.middleX | 0,
                1,
                FSP.ScenePlayer.bindRoutine("PlayerNameConfirm"));
        }

        /**
         * 
         */
        cutsceneIntroPlayerNameFromKeyboard(FSP: FullScreenPokemon, settings: any): void {
            settings.name = (<IKeyboardResultsMenu>FSP.MenuGrapher.getMenu("KeyboardResult")).completeValue;

            FSP.MenuGrapher.deleteMenu("Keyboard");
            FSP.MenuGrapher.deleteMenu("NameOptions");

            FSP.animateFadeHorizontal(
                settings.player,
                -FSP.unitsize,
                FSP.MapScreener.middleX | 0,
                1,
                FSP.ScenePlayer.bindRoutine("PlayerNameConfirm"));
        }

        /**
         * 
         */
        cutsceneIntroPlayerNameConfirm(FSP: FullScreenPokemon, settings: any): void {
            var message: (string | string[])[] = "Right! So your name is".split(" "),
                name: string[] = settings.name.constructor === String
                    ? settings.name.split("")
                    : settings.name;

            FSP.ItemsHolder.setItem("name", name);
            name.push("!");
            message.push(name);

            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": true
            });
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    message
                ],
                FSP.ScenePlayer.bindRoutine("PlayerNameComplete"));
        }

        /**
         * 
         */
        cutsceneIntroPlayerNameComplete(FSP: FullScreenPokemon, settings: any): void {
            var blank: IThing = FSP.ObjectMaker.make("WhiteSquare", {
                "width": FSP.MapScreener.width,
                "height": FSP.MapScreener.height,
                "opacity": 0
            });

            FSP.addThing(blank, 0, 0);

            FSP.TimeHandler.addEvent(
                FSP.animateFadeAttribute,
                35,
                blank,
                "opacity",
                .2,
                1,
                7,
                FSP.ScenePlayer.bindRoutine("RivalAppear"));
        }

        /**
         * 
         */
        cutsceneIntroRivalAppear(FSP: FullScreenPokemon, settings: any): void {
            var rival: IThing = FSP.ObjectMaker.make("RivalPortrait", {
                "opacity": 0
            });

            settings.rival = rival;

            FSP.GroupHolder.applyOnAll(FSP, FSP.killNormal);

            FSP.addThing(rival, 0, 0);
            FSP.setMidX(rival, FSP.MapScreener.middleX | 0);
            FSP.setMidY(rival, FSP.MapScreener.middleY | 0);
            FSP.animateFadeAttribute(
                rival,
                "opacity",
                .1,
                1,
                1,
                FSP.ScenePlayer.bindRoutine("RivalName"));
        }

        /**
         * 
         */
        cutsceneIntroRivalName(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "This is my grand-son. He's been your rival since you were a baby.",
                    "...Erm, what is his name again?"
                ],
                FSP.ScenePlayer.bindRoutine("RivalSlide")
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneIntroRivalSlide(FSP: FullScreenPokemon, settings: any): void {
            FSP.animateFadeHorizontal(
                settings.rival,
                FSP.unitsize,
                (FSP.MapScreener.middleX + 16 * FSP.unitsize) | 0,
                1,
                FSP.ScenePlayer.bindRoutine("RivalNameOptions"));
        }

        /**
         * 
         */
        cutsceneIntroRivalNameOptions(FSP: FullScreenPokemon, settings: any): void {
            var fromMenu: Function = FSP.ScenePlayer.bindRoutine("RivalNameFromMenu"),
                fromKeyboard: Function = FSP.ScenePlayer.bindRoutine("RivalNameFromKeyboard");

            FSP.MenuGrapher.createMenu("NameOptions");
            FSP.MenuGrapher.addMenuList("NameOptions", {
                "options": [
                    {
                        "text": "NEW NAME",
                        "callback": FSP.openKeyboardMenu.bind(FSP, {
                            "title": "RIVAL's NAME?",
                            "callback": fromKeyboard
                        })
                    }, {
                        "text": "RED",
                        "callback": fromMenu
                    }, {
                        "text": "ASH",
                        "callback": fromMenu
                    }, {
                        "text": "JACK",
                        "callback": fromMenu
                    }]
            });
            FSP.MenuGrapher.setActiveMenu("NameOptions");
        }

        /**
         * 
         */
        cutsceneIntroRivalNameFromMenu(FSP: FullScreenPokemon, settings: any): void {
            settings.name = FSP.MenuGrapher.getMenuSelectedOption("NameOptions").text;

            FSP.MenuGrapher.deleteMenu("NameOptions");

            FSP.animateFadeHorizontal(
                settings.rival,
                -FSP.unitsize,
                FSP.MapScreener.middleX | 0,
                1,
                FSP.ScenePlayer.bindRoutine("RivalNameConfirm"));
        }

        /**
         * 
         */
        cutsceneIntroRivalNameFromKeyboard(FSP: FullScreenPokemon, settings: any): void {
            settings.name = (<IKeyboardResultsMenu>FSP.MenuGrapher.getMenu("KeyboardResult")).completeValue;

            FSP.MenuGrapher.deleteMenu("Keyboard");
            FSP.MenuGrapher.deleteMenu("NameOptions");

            FSP.animateFadeHorizontal(
                settings.rival,
                -FSP.unitsize,
                FSP.MapScreener.middleX | 0,
                1,
                FSP.ScenePlayer.bindRoutine("RivalNameConfirm"));
        }

        /**
         * 
         */
        cutsceneIntroRivalNameConfirm(FSP: FullScreenPokemon, settings: any): void {
            var message: (string | string[])[] = "That's right! I remember now! His name is".split(" "),
                name: string[] = settings.name.constructor === String
                    ? settings.name.split("")
                    : settings.name;

            FSP.ItemsHolder.setItem("nameRival", name);
            name.push("!");
            message.push(name);

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    message
                ],
                FSP.ScenePlayer.bindRoutine("RivalNameComplete"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneIntroRivalNameComplete(FSP: FullScreenPokemon, settings: any): void {
            var blank: IThing = FSP.ObjectMaker.make("WhiteSquare", {
                "width": FSP.MapScreener.width,
                "height": FSP.MapScreener.height,
                "opacity": 0
            });

            FSP.addThing(blank, 0, 0);

            FSP.TimeHandler.addEvent(
                FSP.animateFadeAttribute,
                35,
                blank,
                "opacity",
                .2,
                1,
                7,
                FSP.ScenePlayer.bindRoutine("LastDialogAppear"));
        }

        /**
         * 
         */
        cutsceneIntroLastDialogAppear(FSP: FullScreenPokemon, settings: any): void {
            var portrait: IThing = FSP.ObjectMaker.make("PlayerPortrait", {
                "flipHoriz": true,
                "opacity": 0
            });

            settings.portrait = portrait;

            FSP.GroupHolder.applyOnAll(FSP, FSP.killNormal);

            FSP.addThing(portrait, 0, 0);
            FSP.setMidX(portrait, FSP.MapScreener.middleX | 0);
            FSP.setMidY(portrait, FSP.MapScreener.middleY | 0);

            FSP.animateFadeAttribute(
                portrait,
                "opacity",
                .1,
                1,
                1,
                FSP.ScenePlayer.bindRoutine("LastDialog"));
        }

        /**
         * 
         */
        cutsceneIntroLastDialog(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%PLAYER%%%%%%%!",
                    "Your very own %%%%%%%POKEMON%%%%%%% legend is about to unfold!",
                    "A world of dreams and adventures with %%%%%%%POKEMON%%%%%%% awaits! Let's go!"
                ],
                FSP.ScenePlayer.bindRoutine("ShrinkPlayer"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneIntroShrinkPlayer(FSP: FullScreenPokemon, settings: any): void {
            var silhouetteLarge: IThing = FSP.ObjectMaker.make("PlayerSilhouetteLarge"),
                silhouetteSmall: IThing = FSP.ObjectMaker.make("PlayerSilhouetteSmall"),
                player: IPlayer = FSP.ObjectMaker.make("Player"),
                timeDelay: number = 49;

            FSP.TimeHandler.addEvent(
                FSP.addThing, timeDelay, silhouetteLarge);
            FSP.TimeHandler.addEvent(
                FSP.setMidObj, timeDelay, silhouetteLarge, settings.portrait);
            FSP.TimeHandler.addEvent(
                FSP.killNormal, timeDelay, settings.portrait);

            FSP.TimeHandler.addEvent(
                FSP.addThing, timeDelay * 2, silhouetteSmall);
            FSP.TimeHandler.addEvent(
                FSP.setMidObj, timeDelay * 2, silhouetteSmall, silhouetteLarge);
            FSP.TimeHandler.addEvent(
                FSP.killNormal, timeDelay * 2, silhouetteLarge);

            FSP.TimeHandler.addEvent(
                FSP.addThing, timeDelay * 3, player);
            FSP.TimeHandler.addEvent(
                FSP.setMidObj, timeDelay * 3, player, silhouetteSmall);
            FSP.TimeHandler.addEvent(
                FSP.killNormal, timeDelay * 3, silhouetteSmall);

            FSP.TimeHandler.addEvent(
                FSP.ScenePlayer.bindRoutine("FadeOut"), timeDelay * 4);
        }

        /**
         * 
         */
        cutsceneIntroFadeOut(FSP: FullScreenPokemon, settings: any): void {
            var blank: IThing = FSP.ObjectMaker.make("WhiteSquare", {
                "width": FSP.MapScreener.width,
                "height": FSP.MapScreener.height,
                "opacity": 0
            });

            FSP.addThing(blank, 0, 0);

            FSP.TimeHandler.addEvent(
                FSP.animateFadeAttribute,
                35,
                blank,
                "opacity",
                .2,
                1,
                7,
                FSP.ScenePlayer.bindRoutine("Finish"));
        }

        /**
         * 
         */
        cutsceneIntroFinish(FSP: FullScreenPokemon, settings: any): void {
            delete FSP.MapScreener.cutscene;

            FSP.MenuGrapher.deleteActiveMenu();
            FSP.ScenePlayer.stopCutscene();
            FSP.ItemsHolder.setItem("gameStarted", true);

            FSP.setMap("Pallet Town", "Start Game");
        }

        /**
         * 
         */
        cutsceneOakIntroFirstDialog(FSP: FullScreenPokemon, settings: any): void {
            var triggered: boolean = false;

            settings.triggerer.alive = false;
            FSP.StateHolder.addChange(settings.triggerer.id, "alive", false);

            if (FSP.ItemsHolder.getItem("starter")) {
                return;
            }

            FSP.animatePlayerDialogFreeze(settings.player);
            FSP.animateCharacterSetDirection(settings.player, 2);

            FSP.AudioPlayer.play("Professor Oak");
            FSP.MapScreener.blockInputs = true;

            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": true,
                "finishAutomaticSpeed": 28
            });
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "OAK: Hey! Wait! Don't go out!"
                ],
                function (): void {
                    if (!triggered) {
                        triggered = true;
                        FSP.ScenePlayer.playRoutine("Exclamation");
                    }
                });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakIntroExclamation(FSP: FullScreenPokemon, settings: any): void {
            var timeout: number = 49;

            FSP.animateExclamation(settings.player, timeout);

            FSP.TimeHandler.addEvent(
                FSP.MenuGrapher.hideMenu.bind(FSP.MenuGrapher),
                timeout,
                "GeneralText");

            FSP.TimeHandler.addEvent(
                FSP.ScenePlayer.bindRoutine("Catchup"),
                timeout);
        }

        /**
         * 
         */
        cutsceneOakIntroCatchup(FSP: FullScreenPokemon, settings: any): void {
            var door: IThing = FSP.getThingById("Oak's Lab Door"),
                oak: ICharacter = FSP.ObjectMaker.make("Oak", {
                    "outerok": true,
                    "nocollide": true
                });

            settings.oak = oak;

            FSP.addThing(oak, door.left, door.top);
            FSP.animateCharacterStartTurning(
                oak,
                2,
                [
                    1, "left", 3, "top", 10, "right", 1, "top", 0,
                    FSP.ScenePlayer.bindRoutine("GrassWarning")
                ]);
        }

        /**
         * 
         */
        cutsceneOakIntroGrassWarning(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "It's unsafe! Wild %%%%%%%POKEMON%%%%%%% live in tall grass!",
                    "You need your own %%%%%%%POKEMON%%%%%%% for your protection. \n I know!",
                    "Here, come with me."
                ],
                FSP.ScenePlayer.bindRoutine("FollowToLab"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakIntroFollowToLab(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.deleteMenu("GeneralText");
            FSP.animateCharacterFollow(settings.player, settings.oak);
            FSP.animateCharacterStartTurning(
                settings.oak,
                2,
                [
                    5, "left", 1, "bottom", 5, "right", 3, "top", 1,
                    FSP.ScenePlayer.bindRoutine("EnterLab")
                ]);
        }

        /**
         * 
         */
        cutsceneOakIntroEnterLab(FSP: FullScreenPokemon, settings: any): void {
            FSP.StateHolder.addChange("Pallet Town::Oak's Lab::Oak", "alive", true);
            FSP.TimeHandler.addEvent(
                FSP.animateCharacterStartTurning,
                FSP.getCharacterWalkingInterval(FSP.player),
                FSP.player,
                0,
                [
                    1,
                    function (): void {
                        FSP.setMap("Pallet Town", "Oak's Lab Floor 1 Door", false);

                        FSP.ScenePlayer.playRoutine("WalkToTable");
                    }
                ]);
        }

        /**
         * 
         */
        cutsceneOakIntroWalkToTable(FSP: FullScreenPokemon, settings: any): void {
            var oak: ICharacter = <ICharacter>FSP.getThingById("Oak");

            settings.oak = oak;
            settings.player = FSP.player;

            oak.dialog = "OAK: Now, %%%%%%%PLAYER%%%%%%%, which %%%%%%%POKEMON%%%%%%% do you want?";
            oak.hidden = false;
            oak.nocollide = true;
            FSP.setMidXObj(oak, settings.player);
            FSP.setBottom(oak, settings.player.top);

            FSP.StateHolder.addChange(oak.id, "hidden", false);
            FSP.StateHolder.addChange(oak.id, "nocollide", false);
            FSP.StateHolder.addChange(oak.id, "dialog", oak.dialog);

            FSP.animateCharacterStartWalking(oak, 0, [
                8, "bottom", 0
            ]);

            FSP.TimeHandler.addEvent(
                FSP.animateCharacterStartWalking,
                84,
                settings.player,
                0,
                [8, FSP.ScenePlayer.bindRoutine("RivalComplain")]);
        }

        /**
         * 
         */
        cutsceneOakIntroRivalComplain(FSP: FullScreenPokemon, settings: any): void {
            settings.oak.nocollide = false;
            settings.player.nocollide = false;
            FSP.StateHolder.addChange(settings.oak.id, "nocollide", false);

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: Gramps! I'm fed up with waiting!"
                ],
                FSP.ScenePlayer.bindRoutine("OakThinksToRival"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakIntroOakThinksToRival(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "OAK: %%%%%%%RIVAL%%%%%%%? Let me think...",
                    "Oh, that's right, I told you to come! Just wait!",
                    "Here, %%%%%%%PLAYER%%%%%%%!",
                    "There are 3 %%%%%%%POKEMON%%%%%%% here!",
                    "Haha!",
                    "They are inside the %%%%%%%POKE%%%%%%% BALLs.",
                    "When I was young, I was a serious %%%%%%%POKEMON%%%%%%% trainer!",
                    "In my old age, I have only 3 left, but you can have one! Choose!"
                ],
                FSP.ScenePlayer.bindRoutine("RivalProtests"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakIntroRivalProtests(FSP: FullScreenPokemon, settings: any): void {
            var timeout: number = 21;

            FSP.MenuGrapher.deleteMenu("GeneralText");

            FSP.TimeHandler.addEvent(
                FSP.MenuGrapher.createMenu.bind(FSP.MenuGrapher),
                timeout,
                "GeneralText");

            FSP.TimeHandler.addEvent(
                FSP.MenuGrapher.addMenuDialog.bind(FSP.MenuGrapher),
                timeout,
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: Hey! Gramps! What about me?"
                ],
                FSP.ScenePlayer.bindRoutine("OakRespondsToProtest"));

            FSP.TimeHandler.addEvent(
                FSP.MenuGrapher.setActiveMenu.bind(FSP.MenuGrapher),
                timeout,
                "GeneralText");
        }

        /**
         * 
         */
        cutsceneOakIntroOakRespondsToProtest(FSP: FullScreenPokemon, settings: any): void {
            var blocker: IThing = FSP.getThingById("OakBlocker"),
                timeout: number = 21;

            settings.player.nocollide = false;
            settings.oak.nocollide = false;

            blocker.nocollide = false;
            FSP.StateHolder.addChange(blocker.id, "nocollide", false);

            FSP.MapScreener.blockInputs = false;

            FSP.MenuGrapher.deleteMenu("GeneralText");

            FSP.TimeHandler.addEvent(
                FSP.MenuGrapher.createMenu.bind(FSP.MenuGrapher),
                timeout,
                "GeneralText");

            FSP.TimeHandler.addEvent(
                FSP.MenuGrapher.addMenuDialog.bind(FSP.MenuGrapher),
                timeout,
                "GeneralText",
                [
                    "Oak: Be patient! %%%%%%%RIVAL%%%%%%%, you can have one too!"
                ]);

            FSP.TimeHandler.addEvent(
                FSP.MenuGrapher.setActiveMenu.bind(FSP.MenuGrapher),
                timeout,
                "GeneralText");
        }

        /**
         * 
         */
        cutsceneOakIntroPokemonChoicePlayerChecksPokeball(FSP: FullScreenPokemon, settings: any): void {
            var pokeball: IPokeball = settings.triggerer;

            // If Oak is hidden, this cutscene shouldn't be starting (too early)
            if (FSP.getThingById("Oak").hidden) {
                FSP.ScenePlayer.stopCutscene();

                FSP.MenuGrapher.createMenu("GeneralText");
                FSP.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        "Those are %%%%%%%POKE%%%%%%% Balls. They contain %%%%%%%POKEMON%%%%%%%!"
                    ]);
                FSP.MenuGrapher.setActiveMenu("GeneralText");

                return;
            }

            // If there's already a starter, ignore this sad last ball...
            if (FSP.ItemsHolder.getItem("starter")) {
                return;
            }

            settings.chosen = pokeball.pokemon;

            FSP.openPokedexListing(
                pokeball.pokemon,
                FSP.ScenePlayer.bindRoutine("PlayerDecidesPokemon"),
                {
                    "position": {
                        "vertical": "center",
                        "offset": {
                            "left": 0
                        }
                    }
                });
        }

        /**
         * 
         */
        cutsceneOakIntroPokemonChoicePlayerDecidesPokemon(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "So! You want the " + settings.triggerer.description + " %%%%%%%POKEMON%%%%%%%, " + settings.chosen.toUpperCase() + "?"
                ],
                function (): void {
                    FSP.MenuGrapher.createMenu("Yes/No", {
                        "killOnB": ["GeneralText"]
                    });
                    FSP.MenuGrapher.addMenuList("Yes/No", {
                        "options": [
                            {
                                "text": "YES",
                                "callback": FSP.ScenePlayer.bindRoutine("PlayerTakesPokemon")
                            }, {
                                "text": "NO",
                                "callback": FSP.MenuGrapher.registerB
                            }]
                    });
                    FSP.MenuGrapher.setActiveMenu("Yes/No");
                });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakIntroPokemonChoicePlayerTakesPokemon(FSP: FullScreenPokemon, settings: any): void {
            var oak: ICharacter = <ICharacter>FSP.getThingById("Oak"),
                rival: ICharacter = <ICharacter>FSP.getThingById("Rival"),
                dialogOak: string = "Oak: If a wild %%%%%%%POKEMON%%%%%%% appears, your %%%%%%%POKEMON%%%%%%% can fight against it!",
                dialogRival: string = "%%%%%%%RIVAL%%%%%%%: My %%%%%%%POKEMON%%%%%%% looks a lot stronger.";

            settings.oak = oak;
            oak.dialog = dialogOak;
            FSP.StateHolder.addChange(oak.id, "dialog", dialogOak);

            settings.rival = rival;
            rival.dialog = dialogRival;
            FSP.StateHolder.addChange(rival.id, "dialog", dialogRival);

            FSP.ItemsHolder.setItem("starter", settings.chosen);
            settings.triggerer.hidden = true;
            FSP.StateHolder.addChange(settings.triggerer.id, "hidden", true);
            FSP.StateHolder.addChange(settings.triggerer.id, "nocollide", true);

            FSP.MenuGrapher.deleteMenu("Yes/No");
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%PLAYER%%%%%%% received a " + settings.chosen.toUpperCase() + "!",
                    "This %%%%%%%POKEMON%%%%%%% is really energetic!",
                    "Do you want to give a nickname to " + settings.chosen.toUpperCase() + "?"
                ],
                FSP.ScenePlayer.bindRoutine("PlayerChoosesNickname"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");

            FSP.ItemsHolder.setItem("starter", settings.chosen);
            FSP.ItemsHolder.setItem("PokemonInParty", [
                FSP.MathDecider.compute("newPokemon", settings.chosen, 5)
            ]);
        }

        /**
         * 
         */
        cutsceneOakIntroPokemonChoicePlayerChoosesNickname(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("Yes/No", {
                "ignoreB": true,
                "killOnB": ["GeneralText"]
            });
            FSP.MenuGrapher.addMenuList("Yes/No", {
                "options": [
                    {
                        "text": "YES",
                        "callback": FSP.openKeyboardMenu.bind(FSP, {
                            "position": {
                                "vertical": "center",
                                "offset": {
                                    "top": -12
                                }
                            },
                            "title": settings.chosen.toUpperCase(),
                            "callback": FSP.ScenePlayer.bindRoutine("PlayerSetsNickname")
                        })
                    }, {
                        "text": "NO",
                        "callback": FSP.ScenePlayer.bindRoutine("RivalWalksToPokemon")
                    }]
            });
            FSP.MenuGrapher.setActiveMenu("Yes/No");
        }

        /**
         * 
         */
        cutsceneOakIntroPokemonChoicePlayerSetsNickname(FSP: FullScreenPokemon, settings: any): void {
            var party: BattleMovr.IActor[] = FSP.ItemsHolder.getItem("PokemonInParty"),
                menu: IKeyboardResultsMenu = <IKeyboardResultsMenu>FSP.MenuGrapher.getMenu("KeyboardResult"),
                result: string[] = menu.completeValue;

            party[0].nickname = result;

            FSP.ScenePlayer.playRoutine("RivalWalksToPokemon");
        }

        /**
         * 
         */
        cutsceneOakIntroPokemonChoiceRivalWalksToPokemon(FSP: FullScreenPokemon, settings: any): void {
            var rival: ICharacter = <ICharacter>FSP.getThingById("Rival"),
                other: string,
                steps: number,
                pokeball: IPokeball;

            FSP.MenuGrapher.deleteMenu("Keyboard");
            FSP.MenuGrapher.deleteMenu("GeneralText");
            FSP.MenuGrapher.deleteMenu("Yes/No");

            switch (settings.chosen) {
                case "Squirtle":
                    steps = 4;
                    other = "Bulbasaur";
                    break;
                case "Charmander":
                    steps = 3;
                    other = "Squirtle";
                    break;
                case "Bulbasaur":
                    steps = 5;
                    other = "Charmander";
                    break;
                default:
                    throw new Error("Unknown first Pokemon.");
            }

            settings.rivalPokemon = other;
            settings.rivalSteps = steps;
            FSP.ItemsHolder.setItem("starterRival", other);

            pokeball = <IPokeball>FSP.getThingById("Pokeball" + other);
            settings.rivalPokeball = pokeball;

            FSP.animateCharacterStartTurning(
                rival,
                2,
                [
                    2, "right", steps, "top", 1,
                    FSP.ScenePlayer.bindRoutine("RivalTakesPokemon")
                ]);
        }

        /**
         * 
         */
        cutsceneOakIntroPokemonChoiceRivalTakesPokemon(FSP: FullScreenPokemon, settings: any): void {
            var oakblocker: IThing = FSP.getThingById("OakBlocker"),
                rivalblocker: IThing = FSP.getThingById("RivalBlocker");

            FSP.MenuGrapher.deleteMenu("Yes/No");

            oakblocker.nocollide = true;
            FSP.StateHolder.addChange(oakblocker.id, "nocollide", true);

            rivalblocker.nocollide = false;
            FSP.StateHolder.addChange(rivalblocker.id, "nocollide", false);

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: I'll take this one, then!",
                    "%%%%%%%RIVAL%%%%%%% received a " + settings.rivalPokemon.toUpperCase() + "!"
                ],
                function (): void {
                    settings.rivalPokeball.hidden = true;
                    FSP.StateHolder.addChange(settings.rivalPokeball.id, "hidden", true);
                    FSP.MenuGrapher.deleteActiveMenu();
                });
            FSP.MenuGrapher.setActiveMenu("GeneralText");

        }

        /**
         * 
         */
        cutsceneOakIntroRivalBattleApproach(FSP: FullScreenPokemon, settings: any): void {
            var rival: ICharacter = <ICharacter>FSP.getThingById("Rival"),
                dx: number = Math.abs(settings.triggerer.left - settings.player.left),
                further: boolean = dx < FSP.unitsize;

            FSP.AudioPlayer.play("Rival Appears");

            settings.rival = rival;
            FSP.animateCharacterSetDirection(rival, 2);
            FSP.animateCharacterSetDirection(settings.player, 0);

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: Wait, %%%%%%%PLAYER%%%%%%%! Let's check out our %%%%%%%POKEMON%%%%%%%!",
                    "Come on, I'll take you on!"
                ],
                FSP.ScenePlayer.bindRoutine(
                    "Challenge",
                    [
                        {
                            "further": further
                        }
                    ]));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakIntroRivalLeavesAfterBattle(FSP: FullScreenPokemon, settings: any): void {
            // var rivalblocker = EightBitter.getThingById("RivalBlocker");

            // rivalblocker.nocollide = true;
            // EightBitter.StateHolder.addChange(rivalblocker.id, "nocollide", true);

            FSP.ItemsHolder.getItem("PokemonInParty").forEach(FSP.healPokemon.bind(FSP));

            FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine("Complaint"), 49);
        }

        /**
         * 
         */
        cutsceneOakIntroRivalLeavesComplaint(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: Okay! I'll make my %%%%%%%POKEMON%%%%%%% fight to toughen it up!"
                ],
                function (): void {
                    FSP.MenuGrapher.deleteActiveMenu();
                    FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine("Goodbye"), 21);
                }
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakIntroRivalLeavesGoodbye(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%PLAYER%%%%%%%! Gramps! Smell ya later!"
                ],
                FSP.ScenePlayer.bindRoutine("Walking"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakIntroRivalLeavesWalking(FSP: FullScreenPokemon, settings: any): void {
            var oak: ICharacter = <ICharacter>FSP.getThingById("Oak"),
                rival: ICharacter = <ICharacter>FSP.getThingById("Rival"),
                isRight: boolean = Math.abs(oak.left - rival.left) < FSP.unitsize,
                steps: any[] = [
                    1,
                    "bottom",
                    6,
                    function (): void {
                        FSP.killNormal(rival);
                        FSP.StateHolder.addChange(rival.id, "alive", false);
                    }
                ],
                dialog: string[] = [
                    "OAK: %%%%%%%PLAYER%%%%%%%, raise your young %%%%%%%POKEMON%%%%%%% by making it fight!"
                ];

            console.log("Shouldn't this say the dialog?", dialog);

            FSP.ScenePlayer.stopCutscene();
            FSP.MenuGrapher.deleteMenu("GeneralText");

            FSP.animateCharacterStartTurning(rival, isRight ? 3 : 1, steps);
        }

        /**
         * 
         */
        cutsceneOakIntroRivalBattleChallenge(FSP: FullScreenPokemon, settings: any): void {
            var steps: number,
                battleInfo: IBattleInfo = {
                    "opponent": {
                        "sprite": "RivalPortrait",
                        "name": FSP.ItemsHolder.getItem("nameRival"),
                        "category": "Trainer",
                        "hasActors": true,
                        "reward": 175,
                        "actors": [
                            FSP.MathDecider.compute(
                                "newPokemon",
                                FSP.ItemsHolder.getItem("starterRival"),
                                5)
                        ]
                    },
                    "textStart": ["", " wants to fight!"],
                    "textDefeat": ["SHOULD FILL THIS OUT YES"],
                    "textVictory": [
                        [
                            "%%%%%%%RIVAL%%%%%%%: WHAT?",
                            "Unbelievable!",
                            "I picked the wrong %%%%%%%POKEMON%%%%%%%!"
                        ].join(" ")
                    ],
                    // "animation": "LineSpiral",
                    "theme": "Trainer Battle",
                    "noBlackout": true,
                    "keptThings": ["player", "Rival"],
                    "nextCutscene": "OakIntroRivalLeaves"
                };

            switch (FSP.ItemsHolder.getItem("starterRival")) {
                case "Squirtle":
                    steps = 2;
                    break;
                case "Bulbasaur":
                    steps = 3;
                    break;
                case "Charmander":
                    steps = 1;
                    break;
                default:
                    throw new Error("Unknown starterRival.");
            }

            if (settings.routineArguments.further) {
                steps += 1;
            }

            FSP.animateCharacterStartTurning(
                settings.rival,
                3,
                [
                    steps,
                    "bottom",
                    1,
                    FSP.startBattle.bind(FSP, battleInfo)
                ]);
        }

        /**
         * 
         */
        cutsceneOakParcelPickupGreeting(FSP: FullScreenPokemon, settings: any): void {
            settings.triggerer.alive = false;
            FSP.StateHolder.addChange(settings.triggerer.id, "alive", false);

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Hey! You came from PALLET TOWN?"
                ],
                FSP.ScenePlayer.bindRoutine("WalkToCounter"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakParcelPickupWalkToCounter(FSP: FullScreenPokemon, settings: any): void {
            FSP.animateCharacterStartTurning(
                settings.player,
                0,
                [
                    2,
                    "left",
                    1,
                    FSP.ScenePlayer.bindRoutine("CounterDialog")
                ]);
        }

        /**
         * 
         */
        cutsceneOakParcelPickupCounterDialog(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "You know PROF. Oak, right?",
                    "His order came in. Will you take it to him?",
                    "%%%%%%%PLAYER%%%%%%% got OAK's PARCEL!"
                ],
                function (): void {
                    FSP.MenuGrapher.deleteMenu("GeneralText");
                    FSP.ScenePlayer.stopCutscene();
                });
            FSP.MenuGrapher.setActiveMenu("GeneralText");

            FSP.StateHolder.addCollectionChange(
                "Pallet Town::Oak's Lab", "Oak", "cutscene", "OakParcelDelivery"
            );
        }

        /**
         * 
         */
        cutsceneOakParcelDeliveryGreeting(FSP: FullScreenPokemon, settings: any): void {
            settings.oak = settings.triggerer;

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "OAK: Oh, %%%%%%%PLAYER%%%%%%%!",
                    "How is my old %%%%%%%POKEMON%%%%%%%?",
                    "Well, it seems to like you a lot.",
                    "You must be talented as a %%%%%%%POKEMON%%%%%%% trainer!",
                    "What? You have something for me?",
                    "%%%%%%%PLAYER%%%%%%% delivered OAK's PARCEL.",
                    "Ah! This is the custom %%%%%%%POKE%%%%%%% BALL I ordered! Thank you!"
                ],
                FSP.TimeHandler.addEvent.bind(
                    FSP.TimeHandler,
                    FSP.ScenePlayer.bindRoutine("RivalInterrupts"),
                    14)
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");

            FSP.StateHolder.addCollectionChange(
                "Viridian City::PokeMart", "CashierDetector", "dialog", false);

            FSP.StateHolder.addCollectionChange(
                "Viridian City::Land", "CrankyGrandpa", "alive", false);
            FSP.StateHolder.addCollectionChange(
                "Viridian City::Land", "CrankyGrandpaBlocker", "alive", false);
            FSP.StateHolder.addCollectionChange(
                "Viridian City::Land", "CrankyGranddaughter", "alive", false);

            FSP.StateHolder.addCollectionChange(
                "Viridian City::Land", "HappyGrandpa", "alive", true);
            FSP.StateHolder.addCollectionChange(
                "Viridian City::Land", "HappyGranddaughter", "alive", true);
        }

        /**
         * 
         */
        cutsceneOakParcelDeliveryRivalInterrupts(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: Gramps!"
                ],
                FSP.ScenePlayer.bindRoutine("RivalWalksUp")
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakParcelDeliveryRivalWalksUp(FSP: FullScreenPokemon, settings: any): void {
            var doormat: IThing = FSP.getThingById("DoormatLeft"),
                rival: ICharacter = <ICharacter>FSP.addThing("Rival", doormat.left, doormat.top);

            settings.rival = rival;

            FSP.MenuGrapher.deleteMenu("GeneralText");

            FSP.animateCharacterStartTurning(
                rival,
                0,
                [
                    8,
                    FSP.ScenePlayer.bindRoutine("RivalInquires")
                ]);
        }

        /**
         * pause, oh right i have a request
         */
        cutsceneOakParcelDeliveryRivalInquires(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: What did you call me for?"
                ],
                FSP.TimeHandler.addEvent.bind(
                    FSP.TimeHandler,
                    FSP.ScenePlayer.bindRoutine("OakRequests"),
                    14)
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakParcelDeliveryOakRequests(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Oak: Oh right! I have a request of you two."
                ],
                FSP.TimeHandler.addEvent.bind(
                    FSP.TimeHandler,
                    FSP.ScenePlayer.bindRoutine("OakDescribesPokedex"),
                    14)
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakParcelDeliveryOakDescribesPokedex(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "On the desk there is my invention, %%%%%%%POKEDEX%%%%%%%!",
                    "It automatically records data on %%%%%%%POKEMON%%%%%%% you've seen or caught!",
                    "It's a hi-tech encyclopedia!"
                ],
                FSP.TimeHandler.addEvent.bind(
                    FSP.TimeHandler,
                    FSP.ScenePlayer.bindRoutine("OakGivesPokedex"),
                    14)
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakParcelDeliveryOakGivesPokedex(FSP: FullScreenPokemon, settings: any): void {
            var bookLeft: IThing = FSP.getThingById("BookLeft"),
                bookRight: IThing = FSP.getThingById("BookRight");

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "OAK: %%%%%%%PLAYER%%%%%%% and %%%%%%%RIVAL%%%%%%%! Take these with you!",
                    "%%%%%%%PLAYER%%%%%%% got %%%%%%%POKEDEX%%%%%%% from OAK!"
                ],
                function (): void {
                    FSP.TimeHandler.addEvent(
                        FSP.ScenePlayer.playRoutine, 14, "OakDescribesGoal");

                    FSP.killNormal(bookLeft);
                    FSP.killNormal(bookRight);

                    FSP.StateHolder.addChange(bookLeft.id, "alive", false);
                    FSP.StateHolder.addChange(bookRight.id, "alive", false);
                }
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakParcelDeliveryOakDescribesGoal(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "To make a complete guide on all the %%%%%%%POKEMON%%%%%%% in the world...",
                    "That was my dream!",
                    "But, I'm too old! I can't do it!",
                    "So, I want you two to fulfill my dream for me!",
                    "Get moving, you two!",
                    "This is a great undertaking in %%%%%%%POKEMON%%%%%%% history!"
                ],
                FSP.TimeHandler.addEvent.bind(
                    FSP.TimeHandler,
                    FSP.ScenePlayer.bindRoutine("RivalAccepts"),
                    14)
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneOakParcelDeliveryRivalAccepts(FSP: FullScreenPokemon, settings: any): void {
            FSP.animateCharacterSetDirection(settings.rival, 1);

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: Alright Gramps! Leave it all to me!",
                    "%%%%%%%PLAYER%%%%%%%, I hate to say it, but I don't need you!",
                    "I know! I'll borrow a TOWN MAP from my sis!",
                    "I'll tell her not to lend you one, %%%%%%%PLAYER%%%%%%%! Hahaha!"
                ],
                function (): void {
                    FSP.ScenePlayer.stopCutscene();
                    FSP.MenuGrapher.deleteMenu("GeneralText");
                    FSP.animateCharacterStartTurning(
                        settings.rival,
                        2,
                        [
                            8,
                            FSP.killNormal.bind(
                                FSP, settings.rival
                            )
                        ]);

                    delete settings.oak.cutscene;
                    settings.oak.dialog = [
                        "%%%%%%%POKEMON%%%%%%% around the world wait for you, %%%%%%%PLAYER%%%%%%%!"
                    ];

                    FSP.StateHolder.addChange(
                        settings.oak.id, "dialog", settings.oak.dialog
                    );
                    FSP.StateHolder.addChange(
                        settings.oak.id, "cutscene", undefined
                    );
                }
            );
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneDaisyTownMapGreeting(FSP: FullScreenPokemon, settings: any): void {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Grandpa asked you to run an errand? Here, this will help you!"
                ],
                FSP.ScenePlayer.bindRoutine("ReceiveMap"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }

        /**
         * 
         */
        cutsceneDaisyTownMapReceiveMap(FSP: FullScreenPokemon, settings: any): void {
            var book: IThing = FSP.getThingById("Book"),
                daisy: ICharacter = settings.triggerer;

            FSP.killNormal(book);
            FSP.StateHolder.addChange(book.id, "alive", false);

            delete daisy.cutscene;
            FSP.StateHolder.addChange(daisy.id, "cutscene", undefined);

            daisy.dialog = [
                "Use the TOWN MAP to find out where you are."
            ];
            FSP.StateHolder.addChange(daisy.id, "dialog", daisy.dialog);

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%PLAYER%%%%%%% got a TOWN MAP!"
                ],
                function (): void {
                    FSP.ScenePlayer.stopCutscene();
                    FSP.MenuGrapher.deleteMenu("GeneralText");
                });
            FSP.MenuGrapher.setActiveMenu("GeneralText");

            console.warn("Player does not actually get a Town Map...");
        }

        /**
         * 
         */
        cutsceneElderTrainingStartBattle(FSP: FullScreenPokemon, settings: any): void {
            FSP.MapScreener.blockInputs = true;
            FSP.startBattle(<IBattleInfo>{
                "keptThings": [settings.player, settings.triggerer],
                "player": {
                    "name": "OLD MAN",
                    "sprite": "ElderBack",
                    "category": "Wild",
                    "actors": []
                },
                "opponent": {
                    "name": "WEEDLE",
                    "sprite": "WeedleFront",
                    "category": "Wild",
                    "actors": [
                        FSP.MathDecider.compute("newPokemon", "Weedle", 5)
                    ]
                },
                "items": [{
                    "item": "Pokeball",
                    "amount": 50
                }],
                "automaticMenus": true,
                "onShowPlayerMenu": function (): void {
                    var timeout: number = 70;

                    FSP.TimeHandler.addEvent(FSP.MenuGrapher.registerDown.bind(FSP.MenuGrapher), timeout);
                    FSP.TimeHandler.addEvent(FSP.MenuGrapher.registerA.bind(FSP.MenuGrapher), timeout * 2);
                    FSP.TimeHandler.addEvent(FSP.MenuGrapher.registerA.bind(FSP.MenuGrapher), timeout * 3);
                }
            });
        }

        /**
         * 
         */
        cutsceneRivalRoute22RivalEmerges(FSP: FullScreenPokemon, settings: any): void {
            var player: IPlayer = settings.player,
                triggerer: ICharacter = settings.triggerer,
                playerUpper: number = Number(Math.abs(player.top - triggerer.top) < FSP.unitsize),
                steps: any[] = [
                    2,
                    "right",
                    3 + playerUpper,
                ],
                rival: ICharacter = FSP.ObjectMaker.make("Rival", {
                    "direction": 0,
                    "nocollide": true,
                    "opacity": 0
                });

            if (playerUpper) {
                steps.push("top");
                steps.push(0);
            }

            settings.rival = rival;

            steps.push(FSP.ScenePlayer.bindRoutine("RivalTalks"));

            // thing, attribute, change, goal, speed, onCompletion
            FSP.animateFadeAttribute(rival, "opacity", .2, 1, 3);

            FSP.addThing(
                rival,
                triggerer.left - FSP.unitsize * 28,
                triggerer.top + FSP.unitsize * 24);

            FSP.animateCharacterStartTurning(rival, 0, steps);
        }

        /**
         * 
         */
        cutsceneRivalRoute22RivalTalks(FSP: FullScreenPokemon, settings: any): void {
            FSP.animateCharacterSetDirection(
                settings.player,
                FSP.getDirectionBordering(settings.player, settings.rival));

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: Hey! %%%%%%%PLAYER%%%%%%%!",
                    "You're going to %%%%%%%POKEMON%%%%%%% LEAGUE?",
                    "Forget it! You probably don't have any BADGES!",
                    "The guard won't let you through!",
                    "By the way did your %%%%%%%POKEMON%%%%%%% get any stronger?"
                ],
                FSP.startBattle.bind(FSP, {
                    "opponent": {
                        "sprite": "RivalPortrait",
                        "name": FSP.ItemsHolder.getItem("nameRival"),
                        "category": "Trainer",
                        "hasActors": true,
                        "reward": 280,
                        "actors": [
                            FSP.MathDecider.compute(
                                "newPokemon",
                                FSP.ItemsHolder.getItem("starterRival"),
                                8),
                            FSP.MathDecider.compute("newPokemon", "Pidgey", 9)
                        ]
                    },
                    "textStart": ["", " wants to fight!"],
                    "textDefeat": ["Yeah! Am I great or what?"],
                    "textVictory": ["Awww! You just lucked out!"],
                    "keptThings": ["player", "Rival"]
                }));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        }


        /* Memory
        */

        /**
         * 
         */
        saveCharacterPositions(FSP: FullScreenPokemon): void {
            var characters: ICharacter[] = <ICharacter[]>FSP.GroupHolder.getGroup("Character"),
                character: ICharacter,
                id: string,
                i: number;

            for (i = 0; i < characters.length; i += 1) {
                character = characters[i];
                id = character.id;

                FSP.saveCharacterPosition(FSP, character, id);
            }
        }

        /**
         * 
         */
        saveCharacterPosition(FSP: FullScreenPokemon, character: ICharacter, id: string): void {
            FSP.StateHolder.addChange(
                id,
                "xloc",
                (character.left + FSP.MapScreener.left) / FSP.unitsize);
            FSP.StateHolder.addChange(
                id,
                "yloc",
                (character.top + FSP.MapScreener.top) / FSP.unitsize);
            FSP.StateHolder.addChange(
                id,
                "direction",
                character.direction);
        }

        /**
         * 
         */
        saveGame(): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this);

            FSP.ItemsHolder.setItem("map", FSP.MapsHandler.getMapName());
            FSP.ItemsHolder.setItem("area", FSP.MapsHandler.getAreaName());
            FSP.ItemsHolder.setItem("location", FSP.MapsHandler.getLocationEntered().name);

            FSP.saveCharacterPositions(FSP);
            FSP.ItemsHolder.saveAll();
            FSP.StateHolder.saveCollection();

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText", [
                    "Now saving..."
                ]);

            FSP.TimeHandler.addEvent(FSP.MenuGrapher.registerB.bind(FSP.MenuGrapher), 49);
        }

        /**
         * 
         */
        downloadSaveGame(): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                link: HTMLAnchorElement = document.createElement("a");

            FSP.saveGame();

            link.setAttribute(
                "download",
                FSP.ItemsHolder.getItem("filename") + " " + Date.now() + ".json");
            link.setAttribute(
                "href",
                "data:text/json;charset=utf-8," + encodeURIComponent(
                    FSP.LevelEditor.beautify(JSON.stringify(FSP.ItemsHolder.exportItems()))));

            FSP.container.appendChild(link);
            link.click();
            FSP.container.removeChild(link);
        }

        /**
         * 
         */
        addItemToBag(FSP: FullScreenPokemon, item: string, amount: number = 1): void {
            FSP.combineArrayMembers(
                FSP.ItemsHolder.getItem("items"),
                item,
                amount,
                "item",
                "amount");
        }


        /* Map sets
        */

        /**
         * 
         */
        setMap(name: string, location?: string, noEntrance?: boolean): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                map: IMap;

            if (typeof name === "undefined" || name.constructor === FullScreenPokemon) {
                name = FSP.MapsHandler.getMapName();
            }

            map = <IMap>FSP.MapsHandler.setMap(name);

            FSP.ModAttacher.fireEvent("onPreSetMap", map);

            FSP.NumberMaker.resetFromSeed(map.seed);
            FSP.InputWriter.restartHistory();

            FSP.ModAttacher.fireEvent("onSetMap", map);

            FSP.setLocation(
                location
                || map.locationDefault
                || FSP.settings.maps.locationDefault,
                noEntrance);
        }

        /**
         * 
         */
        setLocation(name: string, noEntrance?: boolean): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                location: ILocation,
                theme: string;

            name = name || "0";

            FSP.AudioPlayer.clearAll();
            FSP.GroupHolder.clearArrays();
            FSP.MapScreener.clearScreen();
            FSP.MapScreener.thingsById = {};
            FSP.MenuGrapher.setActiveMenu(undefined);
            FSP.TimeHandler.cancelAllEvents();

            FSP.MapsHandler.setLocation(name);
            FSP.MapScreener.setVariables();
            location = <ILocation>FSP.MapsHandler.getLocation(name);
            location.area.spawnedBy = {
                "name": name,
                "timestamp": new Date().getTime()
            };

            FSP.ModAttacher.fireEvent("onPreSetLocation", location);

            FSP.PixelDrawer.setBackground((<IArea>FSP.MapsHandler.getArea()).background);

            FSP.StateHolder.setCollection(location.area.map.name + "::" + location.area.name);

            FSP.QuadsKeeper.resetQuadrants();

            theme = location.theme || location.area.theme || location.area.map.theme;
            FSP.MapScreener.theme = theme;
            if (theme && FSP.AudioPlayer.getThemeName() !== theme) {
                FSP.AudioPlayer.play(theme);
            }

            if (!noEntrance) {
                location.entry(FSP, location);
            }

            FSP.ModAttacher.fireEvent("onSetLocation", location);

            FSP.GamesRunner.play();

            FSP.animateFadeFromColor(FSP, {
                "color": "Black"
            });

            if (location.push) {
                FSP.animateCharacterStartWalking(FSP.player, FSP.player.direction);
            }
        }

        /**
         * 
         */
        getAreaBoundariesReal(FSP: FullScreenPokemon): IAreaBoundaries {
            var area: IArea = <IArea>FSP.MapsHandler.getArea();

            if (!area) {
                return {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0,
                    "width": 0,
                    "height": 0
                };
            }

            return {
                "top": area.boundaries.top * FSP.unitsize,
                "right": area.boundaries.right * FSP.unitsize,
                "bottom": area.boundaries.bottom * FSP.unitsize,
                "left": area.boundaries.left * FSP.unitsize,
                "width": (area.boundaries.right - area.boundaries.left) * FSP.unitsize,
                "height": (area.boundaries.bottom - area.boundaries.top) * FSP.unitsize
            };
        }

        /**
         * 
         */
        getScreenScrollability(FSP: FullScreenPokemon): string {
            var area: IArea = <IArea>FSP.MapsHandler.getArea(),
                boundaries: IAreaBoundaries,
                width: number,
                height: number;

            if (!area) {
                return "none";
            }

            boundaries = area.boundaries;
            width = (boundaries.right - boundaries.left) * FSP.unitsize;
            height = (boundaries.bottom - boundaries.top) * FSP.unitsize;

            if (width > FSP.MapScreener.width) {
                if (height > FSP.MapScreener.height) {
                    return "both";
                } else {
                    return "horizontal";
                }
            } else if (height > FSP.MapScreener.height) {
                return "vertical";
            } else {
                return "none";
            }
        }

        /**
         * 
         */
        generateThingsByIdContainer(): {} {
            return {};
        }

        /**
         * 
         * 
         * @remarks Direction is taken in by the .forEach call as the index. Clever.
         */
        mapAddAfter(prething: IPreThing, direction: Direction): void {
            var FSP: FullScreenPokemon = FullScreenPokemon.prototype.ensureCorrectCaller(this),
                MapsCreator: MapsCreatr.IMapsCreatr = FSP.MapsCreator,
                MapsHandler: MapsHandlr.IMapsHandlr = FSP.MapsHandler,
                prethings: any = MapsHandler.getPreThings(),
                area: IArea = <IArea>MapsHandler.getArea(),
                map: IMap = <IMap>MapsHandler.getMap(),
                boundaries: IAreaBoundaries = <IAreaBoundaries>FSP.MapsHandler.getArea().boundaries;

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

            MapsCreator.analyzePreSwitch(prething, prethings, area, map);
        }


        /* Map entrances
        */

        /**
         * 
         */
        centerMapScreen(FSP: FullScreenPokemon): void {
            switch (FSP.MapScreener.scrollability) {
                case "none":
                    FSP.centerMapScreenHorizontally(FSP);
                    FSP.centerMapScreenVertically(FSP);
                    return;
                case "vertical":
                    FSP.centerMapScreenHorizontally(FSP);
                    FSP.centerMapScreenVerticallyOnPlayer(FSP);
                    return;
                case "horizontal":
                    FSP.centerMapScreenHorizontallyOnPlayer(FSP);
                    FSP.centerMapScreenVertically(FSP);
                    return;
                case "both":
                    FSP.centerMapScreenHorizontallyOnPlayer(FSP);
                    FSP.centerMapScreenVerticallyOnPlayer(FSP);
                    return;
                default:
                    throw new Error(
                        "Unknown MapScreenr scrollability: "
                        + FSP.MapScreener.scrollability + ".");
            }
        }

        /**
         * 
         */
        centerMapScreenHorizontally(FSP: FullScreenPokemon): void {
            var boundaries: IAreaBoundaries = FSP.MapScreener.boundaries,
                difference: number = FSP.MapScreener.width - boundaries.width;

            if (difference > 0) {
                FSP.scrollWindow(difference / -2);
            }
        }

        /**
         * 
         */
        centerMapScreenVertically(FSP: FullScreenPokemon): void {
            var boundaries: IAreaBoundaries = FSP.MapScreener.boundaries,
                difference: number = FSP.MapScreener.height - boundaries.height;

            FSP.scrollWindow(0, difference / -2);
        }

        /**
         * 
         */
        centerMapScreenHorizontallyOnPlayer(FSP: FullScreenPokemon): void {
            var difference: number = (FSP.getMidX(FSP.player) - FSP.MapScreener.middleX) | 0;

            if (Math.abs(difference) > 0) {
                FSP.scrollWindow(difference);
            }
        }

        /**
         * 
         */
        centerMapScreenVerticallyOnPlayer(FSP: FullScreenPokemon): void {
            var difference: number = (FSP.getMidY(FSP.player) - FSP.MapScreener.middleY) | 0;

            if (Math.abs(difference) > 0) {
                FSP.scrollWindow(0, difference);
            }
        }

        /**
         * 
         */
        mapEntranceBlank(FSP: FullScreenPokemon, location: ILocation): void {
            FSP.addPlayer(0, 0);
            FSP.player.hidden = true;
        }


        /**
         * 
         */
        mapEntranceNormal(FSP: FullScreenPokemon, location: ILocation): void {
            FSP.addPlayer(
                location.xloc ? location.xloc * FSP.unitsize : 0,
                location.yloc ? location.yloc * FSP.unitsize : 0);

            FSP.animateCharacterSetDirection(
                FSP.player,
                (typeof location.direction === "undefined"
                    ? FSP.MapScreener.playerDirection
                    : location.direction)
                || 0);

            FSP.centerMapScreen(FSP);

            if (location.cutscene) {
                FSP.ScenePlayer.startCutscene(location.cutscene, {
                    "player": FSP.player
                });
            }

            if (location.routine && FSP.ScenePlayer.getCutsceneName()) {
                FSP.ScenePlayer.playRoutine(location.routine);
            }
        }

        /**
         * 
         */
        mapEntranceResume(FSP: FullScreenPokemon): void {
            var savedInfo: any = FSP.StateHolder.getChanges("player") || {};

            FSP.addPlayer(savedInfo.xloc || 0, savedInfo.yloc || 0, true);

            FSP.animateCharacterSetDirection(FSP.player, savedInfo.direction || 0);

            FSP.centerMapScreen(FSP);
        }


        /* Map macros
        */

        /**
         * 
         */
        macroCheckered(reference: any): any[] {
            var xStart: number = reference.x || 0,
                yStart: number = reference.y || 0,
                xnum: number = reference.xnum || 1,
                ynum: number = reference.ynum || 1,
                xwidth: number = reference.xwidth || 8,
                yheight: number = reference.yheight || 8,
                offset: number = reference.offset || 0,
                things: string[] = reference.things,
                mod: number = things.length,
                output: any[] = [],
                thing: string,
                x: number,
                y: number,
                i: number,
                j: number;

            y = yStart;
            for (i = 0; i < ynum; i += 1) {
                x = xStart;
                for (j = 0; j < xnum; j += 1) {
                    thing = reference.things[(i + j + offset) % mod];
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
         * 
         */
        macroWater(reference: any): any[] {
            var x: number = reference.x || 0,
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
         * 
         */
        macroHouse(reference: any): any[] {
            var x: number = reference.x || 0,
                y: number = reference.y || 0,
                width: number = reference.width || 32,
                stories: number = reference.stories || 1,
                output: any[] = [],
                door: any,
                i: number;

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
            for (i = 1; i < stories; i += 1) {
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
                door = {
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
         * 
         */
        macroHouseLarge(reference: any): any[] {
            var x: number = reference.x || 0,
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
                    }],
                door: any,
                i: number;

            y += 20;
            for (i = 2; i < stories; i += 1) {
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

                door = {
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
         * 
         */
        macroGym(reference: any): any[] {
            var x: number = reference.x || 0,
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
         * 
         */
        macroBuilding(reference: any): any[] {
            var x: number = reference.x || 0,
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
                    }],
                door: any,
                i: number;

            y += 16;

            for (i = 0; i < stories; i += 1) {
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
                door = {
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
                    "width": width - doorOffset - 8
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
         * 
         */
        macroMountain(reference: any): any[] {
            var x: number = reference.x || 0,
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
         * 
         */
        macroPokeCenter(reference: any): any[] {
            var x: number = reference.x || 0,
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
         * 
         */
        macroPokeMart(reference: any): any[] {
            var x: number = reference.x || 0,
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


        /* Miscellaneous utilities
        */

        /**
         * Creates a new String equivalent to an old String repeated any number of
         * times. If times is 0, a blank String is returned.
         * 
         * @param {String} string   The characters to repeat.
         * @param {Number} [times]   How many times to repeat (by default, 1).
         */
        stringOf(str: string, times: number = 1): string {
            return (times === 0) ? "" : new Array(1 + (times || 1)).join(str);
        }

        /**
         * Turns a Number into a String with a prefix added to pad it to a certain
         * number of digits.
         * 
         * @param {Mixed} number   The original Number being padded.
         * @param {Number} size   How many digits the output must contain.
         * @param {Mixed} [prefix]   A prefix to repeat for padding (by default, "0").
         * @return {String}
         * @example 
         * makeDigit(7, 3); // '007'
         * makeDigit(7, 3, 1); // '117'
         */
        makeDigit(num: number | string, size: number, prefix?: any): string {
            return FullScreenPokemon.prototype.stringOf(
                prefix ? prefix.toString() : "0",
                Math.max(0, size - String(num).length)
            ) + num;
        }

        /**
         * 
         */
        checkArrayMembersIndex(array: any[], index: string): boolean {
            var i: number;

            for (i = 0; i < array.length; i += 1) {
                if (array[i][index]) {
                    return true;
                }
            }

            return false;
        }

        /**
         * 
         */
        combineArrayMembers(array: any[], title: string, count: number, keyTitle: string, keyCount: string): boolean {
            var object: any,
                i: number;

            for (i = 0; i < array.length; i += 1) {
                object = array[i];
                if (array[i][keyTitle] === title) {
                    array[i][keyCount] += count;
                    return false;
                }
            }

            object = {};
            object[keyTitle] = title;
            object[keyCount] = count;
            array.push(object);

            return true;
        }

        /**
         * Ensures the current object is a GameStartr by throwing an error if it 
         * is not. This should be used for functions in any GameStartr descendants
         * that have to call 'this' to ensure their caller is what the programmer
         * expected it to be.
         * 
         * @param {Mixed} current   
         */
        ensureCorrectCaller(current: any): FullScreenPokemon {
            if (!(current instanceof FullScreenPokemon)) {
                throw new Error("A function requires the scope ('this') to be the "
                    + "manipulated FullScreenPokemon object. Unfortunately, 'this' is a "
                    + typeof (this) + ".");
            }
            return current;
        }
    }
}
