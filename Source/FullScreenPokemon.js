// @echo '/// <reference path="BattleMovr-0.2.0.ts" />'
// @echo '/// <reference path="GameStartr-0.2.0.ts" />'
// @echo '/// <reference path="MenuGraphr-0.2.0.ts" />'
// @echo '/// <reference path="StateHoldr-0.2.0.ts" />'
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/BattleMovr-0.2.0.ts" />
/// <reference path="References/GameStartr-0.2.0.ts" />
/// <reference path="References/MenuGraphr-0.2.0.ts" />
/// <reference path="References/StateHoldr-0.2.0.ts" />
/// <reference path="FullScreenPokemon.d.ts" />
// @endif
// @include ../Source/FullScreenPokemon.d.ts
var FullScreenPokemon;
(function (FullScreenPokemon_1) {
    "use strict";
    /**
     * Whether a Pokemon is unknown, has been caught, or has been seen.
     */
    (function (PokedexListingStatus) {
        PokedexListingStatus[PokedexListingStatus["Unknown"] = 0] = "Unknown";
        PokedexListingStatus[PokedexListingStatus["Caught"] = 1] = "Caught";
        PokedexListingStatus[PokedexListingStatus["Seen"] = 2] = "Seen";
    })(FullScreenPokemon_1.PokedexListingStatus || (FullScreenPokemon_1.PokedexListingStatus = {}));
    var PokedexListingStatus = FullScreenPokemon_1.PokedexListingStatus;
    ;
    /**
     * Cardinal directions a Thing may face in-game.
     */
    (function (Direction) {
        Direction[Direction["Top"] = 0] = "Top";
        Direction[Direction["Right"] = 1] = "Right";
        Direction[Direction["Bottom"] = 2] = "Bottom";
        Direction[Direction["Left"] = 3] = "Left";
    })(FullScreenPokemon_1.Direction || (FullScreenPokemon_1.Direction = {}));
    var Direction = FullScreenPokemon_1.Direction;
    ;
    /**
     * String aliases of directions, keyed by the direction.
     */
    FullScreenPokemon_1.DirectionsToAliases = [
        "top",
        "right",
        "bottom",
        "left"
    ];
    /**
     * Directions, keyed by their string aliases.
     */
    FullScreenPokemon_1.DirectionAliases = {
        top: Direction.Top,
        right: Direction.Right,
        bottom: Direction.Bottom,
        left: Direction.Left
    };
    /**
     * Direction names, mapped to their opposites.
     */
    FullScreenPokemon_1.DirectionOpposites = {
        "Top": "Bottom",
        "top": "bottom",
        "Right": "Left",
        "right": "left",
        "Bottom": "Top",
        "bottom": "top",
        "Left": "Right",
        "left": "right"
    };
    var FullScreenPokemon = (function (_super) {
        __extends(FullScreenPokemon, _super);
        /**
         * Constructor for a new FullScreenPokemon game object.
         * Static game settings are stored in the appropriate settings/*.js object
         * as members of the FullScreenPokemon.prototype object.
         * Dynamic game settings may be given as members of the "customs" argument.
         */
        function FullScreenPokemon(settings) {
            this.settings = FullScreenPokemon.settings;
            this.ticksElapsed = 0;
            _super.call(this, this.proliferate({
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
            }, settings));
        }
        /* Resets
        */
        /**
         * Sets this.ObjectMaker.
         *
         * @param {FullScreenPokemon} FSP
         * @param {Object} customs
         */
        FullScreenPokemon.prototype.resetObjectMaker = function (FSP, settings) {
            FSP.ObjectMaker = new ObjectMakr.ObjectMakr(FSP.proliferate({
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
            }, FSP.settings.objects));
        };
        /**
         * Sets this.MathDecider.
         *
         * @param {FullScreenPokemon} FSP
         * @param {Object} customs
         */
        FullScreenPokemon.prototype.resetMathDecider = function (FSP, settings) {
            FSP.MathDecider = new MathDecidr.MathDecidr(FSP.proliferate({
                "constants": {
                    "NumberMaker": FSP.NumberMaker,
                }
            }, FSP.settings.math));
        };
        /**
         * Sets this.StateHolder.
         *
         * @param {FullScreenPokemon} FSP
         * @param {Object} customs
         */
        FullScreenPokemon.prototype.resetStateHolder = function (FSP, settings) {
            FSP.StateHolder = new StateHoldr.StateHoldr(FSP.proliferate({
                "ItemsHolder": FSP.ItemsHolder
            }, FSP.settings.states));
        };
        /**
         * Sets this.MenuGrapher.
         *
         * @param {FullScreenPokemon} FSP
         * @param {Object} customs
         */
        FullScreenPokemon.prototype.resetMenuGrapher = function (FSP, settings) {
            FSP.MenuGrapher = new MenuGraphr.MenuGraphr(FSP.proliferate({
                "GameStarter": FSP
            }, FSP.settings.menus));
        };
        /**
         * Sets this.BattleMover.
         *
         * @param {FullScreenPokemon} FSP
         * @param {Object} customs
         */
        FullScreenPokemon.prototype.resetBattleMover = function (FSP, settings) {
            FSP.BattleMover = new BattleMovr.BattleMovr(FSP.proliferate({
                "GameStarter": FSP,
                "MenuGrapher": FSP.MenuGrapher,
                "openItemsMenuCallback": FSP.openItemsMenu.bind(FSP),
                "openActorsMenuCallback": FSP.openPokemonMenu.bind(FSP)
            }, FSP.settings.battles));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.resetContainer = function (FSP, settings) {
            _super.prototype.resetContainer.call(this, FSP, settings);
            FSP.container.style.fontFamily = "Press Start";
            FSP.container.className += " FullScreenPokemon";
            FSP.PixelDrawer.setThingArrays([
                FSP.GroupHolder.getGroup("Terrain"),
                FSP.GroupHolder.getGroup("Solid"),
                FSP.GroupHolder.getGroup("Scenery"),
                FSP.GroupHolder.getGroup("Character"),
                FSP.GroupHolder.getGroup("Text")
            ]);
        };
        /* Global manipulations
        */
        /**
         *
         */
        FullScreenPokemon.prototype.gameStart = function () {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this);
            // if (EightBitter.ItemsHolder.getItem("gameStarted")) {
            //     EightBitter.gameStartPlay(EightBitter);
            // } else {
            FSP.gameStartOptions(FSP);
            // }
            FSP.ModAttacher.fireEvent("onGameStart");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.gameStartOptions = function (FSP) {
            var options = [
                {
                    "text": "NEW GAME",
                    "callback": FSP.gameStartIntro.bind(FSP, FSP)
                }, {
                    "text": "LOAD FILE",
                    "callback": FSP.gameLoadFile.bind(FSP, FSP)
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.gameStartPlay = function (FSP) {
            FSP.MenuGrapher.deleteActiveMenu();
            FSP.setMap(FSP.ItemsHolder.getItem("map") || FSP.settings.maps.mapDefault, FSP.ItemsHolder.getItem("location"), true);
            FSP.mapEntranceResume(FSP);
            FSP.ModAttacher.fireEvent("onGameStartPlay");
        };
        /**
         *
         *
         */
        FullScreenPokemon.prototype.gameStartIntro = function (FSP) {
            FSP.ItemsHolder.clear();
            FSP.ScenePlayer.startCutscene("Intro", {
                "disablePauseMenu": true
            });
            FSP.ModAttacher.fireEvent("onGameStartIntro");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.gameLoadFile = function (FSP) {
            var dummy = FSP.createElement("input", {
                "type": "file",
                "onchange": function (event) {
                    var file = (dummy.files || event.dataTransfer.files)[0], reader;
                    event.preventDefault();
                    event.stopPropagation();
                    if (!file) {
                        return;
                    }
                    reader = new FileReader();
                    reader.onloadend = function (event) {
                        FSP.gameLoadData(FSP, event.currentTarget.result);
                    };
                    reader.readAsText(file);
                }
            });
            dummy.click();
            FSP.ModAttacher.fireEvent("onGameStartIntro");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.gameLoadData = function (FSP, dataRaw) {
            var data = JSON.parse(dataRaw), key, keyStart = "StateHolder::", split;
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
        };
        /**
         * Slight addition to the parent thingProcess Function. The Thing's hit
         * check type is cached immediately, and a default id is assigned if an id
         * isn't already present.
         */
        FullScreenPokemon.prototype.thingProcess = function (thing, title, settings, defaults) {
            _super.prototype.thingProcess.call(this, thing, title, settings, defaults);
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
        };
        /**
         * Processes additional Thing attributes. For each attribute the Area's
         * class says it may have, if it has it, the attribute value proliferated
         * onto the Area.
         *
         * @param area
         */
        FullScreenPokemon.prototype.areaProcess = function (area) {
            var attributes = area.attributes, attribute;
            for (attribute in attributes) {
                if (area[attribute]) {
                    FullScreenPokemon.prototype.proliferate(area, attributes[attribute]);
                }
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.onGamePlay = function (FSP) {
            console.log("Playing!");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.onGamePause = function (FSP) {
            console.log("Paused.");
        };
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
        FullScreenPokemon.prototype.addThing = function (thingRaw, left, top, useSavedInfo) {
            if (left === void 0) { left = 0; }
            if (top === void 0) { top = 0; }
            var thing = _super.prototype.addThing.call(this, thingRaw, left, top);
            if (useSavedInfo) {
                var savedInfo = thing.FSP.StateHolder.getChanges(thing.id);
                if (savedInfo) {
                    if (savedInfo.xloc) {
                        thing.FSP.setLeft(thing, thing.FSP.MapScreener.left + savedInfo.xloc * thing.FSP.unitsize);
                    }
                    if (savedInfo.yloc) {
                        thing.FSP.setTop(thing, thing.FSP.MapScreener.top + savedInfo.yloc * thing.FSP.unitsize);
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
        };
        /**
         * Adds a Thing via addPreThing based on the specifications in a PreThing.
         * This is done relative to MapScreener.left and MapScreener.top.
         *
         * @param {PreThing} prething
         */
        FullScreenPokemon.prototype.addPreThing = function (prething) {
            var thing = prething.thing, position = prething.position || thing.position;
            if (thing.spawned) {
                return;
            }
            thing.spawned = true;
            thing.areaName = thing.areaName || thing.FSP.MapsHandler.getAreaName();
            thing.mapName = thing.mapName || thing.FSP.MapsHandler.getMapName();
            thing.FSP.addThing(thing, prething.left * thing.FSP.unitsize - thing.FSP.MapScreener.left, prething.top * thing.FSP.unitsize - thing.FSP.MapScreener.top, true);
            // Either the prething or thing, in that order, may request to be in the
            // front or back of the container
            if (position) {
                thing.FSP.TimeHandler.addEvent(function () {
                    switch (position) {
                        case "beginning":
                            thing.FSP.arrayToBeginning(thing, thing.FSP.GroupHolder.getGroup(thing.groupType));
                            break;
                        case "end":
                            thing.FSP.arrayToEnd(thing, thing.FSP.GroupHolder.getGroup(thing.groupType));
                            break;
                        default:
                            throw new Error("Unknown position: " + position + ".");
                    }
                });
            }
            thing.FSP.ModAttacher.fireEvent("onAddPreThing", prething);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.addPlayer = function (left, top, useSavedInfo) {
            if (left === void 0) { left = 0; }
            if (top === void 0) { top = 0; }
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), player;
            left = left || 0;
            top = top || 0;
            player = FSP.player = FSP.ObjectMaker.make("Player");
            player.keys = player.getKeys();
            FSP.InputWriter.setEventInformation(player);
            FSP.addThing(player, left, top, useSavedInfo);
            FSP.ModAttacher.fireEvent("onAddPlayer", player);
            return player;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.getThingById = function (id) {
            return FullScreenPokemon.prototype.ensureCorrectCaller(this).MapScreener.thingsById[id];
        };
        /* Inputs
        */
        /**
         *
         */
        FullScreenPokemon.prototype.canInputsTrigger = function (FSP, player, code, event) {
            if (event) {
                event.preventDefault();
            }
            return true;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.canDirectionsTrigger = function (FSP) {
            if (FSP.GamesRunner.getPaused()) {
                return false;
            }
            if (FSP.MenuGrapher.getActiveMenu()) {
                return true;
            }
            return !FSP.MapScreener.blockInputs;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.keyDownGeneric = function (thing, direction, event) {
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
        };
        /**
         *
         * @param {Player} player
         */
        FullScreenPokemon.prototype.keyDownLeft = function (thing, event) {
            if (!thing.FSP.canDirectionsTrigger(thing.FSP)) {
                return;
            }
            if (thing.player) {
                thing.keys[Direction.Left] = true;
            }
            thing.FSP.TimeHandler.addEvent(thing.FSP.keyDownDirectionReal, FullScreenPokemon.inputTimeTolerance, thing, 3);
            thing.FSP.ModAttacher.fireEvent("onKeyDownLeft");
        };
        /**
         *
         * @param {Player} player
         */
        FullScreenPokemon.prototype.keyDownRight = function (thing, event) {
            if (!thing.FSP.canDirectionsTrigger(thing.FSP)) {
                return;
            }
            if (thing.player) {
                thing.keys[Direction.Right] = true;
            }
            thing.FSP.TimeHandler.addEvent(thing.FSP.keyDownDirectionReal, FullScreenPokemon.inputTimeTolerance, thing, 1);
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         * @param {Player} player
         */
        FullScreenPokemon.prototype.keyDownUp = function (thing, event) {
            if (!thing.FSP.canDirectionsTrigger(thing.FSP)) {
                return;
            }
            if (thing.player) {
                thing.keys[Direction.Top] = true;
            }
            thing.FSP.TimeHandler.addEvent(thing.FSP.keyDownDirectionReal, FullScreenPokemon.inputTimeTolerance, thing, 0);
            thing.FSP.ModAttacher.fireEvent("onKeyDownUpReal");
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         * @param {Player} player
         */
        FullScreenPokemon.prototype.keyDownDown = function (thing, event) {
            if (!thing.FSP.canDirectionsTrigger(thing.FSP)) {
                return;
            }
            if (thing.player) {
                thing.keys[Direction.Bottom] = true;
            }
            thing.FSP.TimeHandler.addEvent(thing.FSP.keyDownDirectionReal, FullScreenPokemon.inputTimeTolerance, thing, 2);
            thing.FSP.ModAttacher.fireEvent("onKeyDownDown");
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.keyDownDirectionReal = function (thing, direction) {
            if (!thing.player || !thing.keys[direction]) {
                return;
            }
            if (thing.FSP.MenuGrapher.getActiveMenu()) {
                thing.FSP.MenuGrapher.registerDirection(direction);
            }
            else {
                if (thing.direction !== direction) {
                    thing.turning = direction;
                }
                if (thing.player) {
                    if (thing.canKeyWalking) {
                        thing.FSP.setPlayerDirection(thing, direction);
                    }
                    else {
                        thing.nextDirection = direction;
                    }
                }
            }
            thing.FSP.ModAttacher.fireEvent("onKeyDownDirectionReal", direction);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.keyDownA = function (thing, event) {
            if (thing.FSP.GamesRunner.getPaused()) {
                return;
            }
            if (thing.FSP.MenuGrapher.getActiveMenu()) {
                thing.FSP.MenuGrapher.registerA();
            }
            else if (thing.bordering[thing.direction]) {
                if (thing.bordering[thing.direction].activate) {
                    thing.bordering[thing.direction].activate(thing, thing.bordering[thing.direction]);
                }
                if (thing.keys) {
                    thing.keys.a = true;
                }
            }
            thing.FSP.ModAttacher.fireEvent("onKeyDownA");
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.keyDownB = function (thing, event) {
            if (thing.FSP.GamesRunner.getPaused()) {
                return;
            }
            if (thing.FSP.MenuGrapher.getActiveMenu()) {
                thing.FSP.MenuGrapher.registerB();
            }
            else if (thing.keys) {
                thing.keys.b = true;
            }
            thing.FSP.ModAttacher.fireEvent("onKeyDownB");
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         * @param {Player} player
         */
        FullScreenPokemon.prototype.keyDownPause = function (thing, event) {
            if (!thing.FSP.GamesRunner.getPaused()) {
                thing.FSP.TimeHandler.addEvent(thing.FSP.GamesRunner.pause, 7, true);
            }
            thing.FSP.ModAttacher.fireEvent("onKeyDownPause");
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         * @param {Player} player
         */
        FullScreenPokemon.prototype.keyDownMute = function (thing, event) {
            if (thing.FSP.GamesRunner.getPaused()) {
                return;
            }
            thing.FSP.AudioPlayer.toggleMuted();
            thing.FSP.ModAttacher.fireEvent("onKeyDownMute");
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.keyUpGeneric = function (thing, direction, event) {
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
        };
        /**
         *
         * @param {Player} player
         */
        FullScreenPokemon.prototype.keyUpLeft = function (thing, event) {
            thing.FSP.ModAttacher.fireEvent("onKeyUpLeft");
            if (thing.player) {
                thing.keys[3] = false;
                if (thing.nextDirection === 3) {
                    delete thing.nextDirection;
                }
            }
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         * @param {Player} player
         */
        FullScreenPokemon.prototype.keyUpRight = function (thing, event) {
            thing.FSP.ModAttacher.fireEvent("onKeyUpRight");
            if (thing.player) {
                thing.keys[1] = false;
                if (thing.nextDirection === 1) {
                    delete thing.nextDirection;
                }
            }
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         * @param {Player} player
         */
        FullScreenPokemon.prototype.keyUpUp = function (thing, event) {
            thing.FSP.ModAttacher.fireEvent("onKeyUpUp");
            if (thing.player) {
                thing.keys[0] = false;
                if (thing.nextDirection === 0) {
                    delete thing.nextDirection;
                }
            }
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         * @param {Player} player
         */
        FullScreenPokemon.prototype.keyUpDown = function (thing, event) {
            thing.FSP.ModAttacher.fireEvent("onKeyUpDown");
            if (thing.player) {
                thing.keys[2] = false;
                if (thing.nextDirection === 2) {
                    delete thing.nextDirection;
                }
            }
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /*
         *
         */
        FullScreenPokemon.prototype.keyUpA = function (thing, event) {
            thing.FSP.ModAttacher.fireEvent("onKeyUpA");
            if (thing.player) {
                thing.keys.a = false;
            }
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.keyUpB = function (thing, event) {
            thing.FSP.ModAttacher.fireEvent("onKeyUpB");
            if (thing.player) {
                thing.keys.b = false;
            }
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         * @param {Player} player
         */
        FullScreenPokemon.prototype.keyUpPause = function (thing, event) {
            if (thing.FSP.GamesRunner.getPaused()) {
                thing.FSP.GamesRunner.play();
            }
            thing.FSP.ModAttacher.fireEvent("onKeyUpPause");
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /**
         *
         * @param {Player} player
         */
        FullScreenPokemon.prototype.mouseDownRight = function (thing, event) {
            thing.FSP.togglePauseMenu(thing);
            thing.FSP.ModAttacher.fireEvent("onMouseDownRight");
            if (event && event.preventDefault) {
                event.preventDefault();
            }
        };
        /* Upkeep maintenance
        */
        /**
         *
         */
        FullScreenPokemon.prototype.maintainGeneric = function (FSP, things) {
            var thing, i;
            for (i = 0; i < things.length; i += 1) {
                thing = things[i];
                if (!thing.alive) {
                    FSP.arrayDeleteThing(thing, things, i);
                    i -= 1;
                }
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.maintainCharacters = function (FSP, characters) {
            var character, i;
            for (i = 0; i < characters.length; i += 1) {
                character = characters[i];
                FSP.shiftCharacter(character);
                if (character.shouldWalk && !FSP.MenuGrapher.getActiveMenu()) {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.maintainCharacterGrass = function (FSP, thing, other) {
            if (thing.FSP.isThingWithinGrass(thing, other)) {
                thing.FSP.setLeft(thing.shadow, thing.left);
                thing.FSP.setTop(thing.shadow, thing.top);
                if (thing.shadow.className !== thing.className) {
                    thing.FSP.setClass(thing.shadow, thing.className);
                }
            }
            else {
                thing.FSP.killNormal(thing.shadow);
                thing.canvas.height = thing.height * thing.FSP.unitsize;
                thing.FSP.PixelDrawer.setThingSprite(thing);
                delete thing.shadow;
                delete thing.grass;
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.maintainPlayer = function (FSP, player) {
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
                    FSP.scrollWindow(FSP.getHorizontalScrollAmount(FSP), FSP.getVerticalScrollAmount(FSP));
                    return;
                default:
                    return;
            }
        };
        FullScreenPokemon.prototype.getHorizontalScrollAmount = function (FSP) {
            if (!FSP.player.xvel) {
                return 0;
            }
            if (FSP.player.xvel > 0) {
                return FSP.player.bordering[1] ? 0 : FSP.player.xvel;
            }
            else {
                return FSP.player.bordering[3] ? 0 : FSP.player.xvel;
            }
        };
        FullScreenPokemon.prototype.getVerticalScrollAmount = function (FSP) {
            if (!FSP.player.yvel) {
                return 0;
            }
            if (FSP.player.yvel > 0) {
                return FSP.player.bordering[2] ? 0 : FSP.player.yvel;
            }
            else {
                return FSP.player.bordering[0] ? 0 : FSP.player.yvel;
            }
        };
        /* General animations
        */
        /**
         *
         */
        FullScreenPokemon.prototype.animateSnapToGrid = function (thing) {
            var grid = thing.FSP.unitsize * 8, x = (thing.FSP.MapScreener.left + thing.left) / grid, y = (thing.FSP.MapScreener.top + thing.top) / grid;
            thing.FSP.setLeft(thing, Math.round(x) * grid - thing.FSP.MapScreener.left);
            thing.FSP.setTop(thing, Math.round(y) * grid - thing.FSP.MapScreener.top);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animatePlayerDialogFreeze = function (thing) {
            thing.FSP.animateCharacterPreventWalking(thing);
            thing.FSP.TimeHandler.cancelClassCycle(thing, "walking");
            if (thing.walkingFlipping) {
                thing.FSP.TimeHandler.cancelEvent(thing.walkingFlipping);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateFadeAttribute = function (thing, attribute, change, goal, speed, onCompletion) {
            thing[attribute] += change;
            if (change > 0) {
                if (thing[attribute] >= goal) {
                    thing[attribute] = goal;
                    if (typeof onCompletion === "function") {
                        onCompletion(thing);
                    }
                    return;
                }
            }
            else {
                if (thing[attribute] <= goal) {
                    thing[attribute] = goal;
                    if (typeof onCompletion === "function") {
                        onCompletion(thing);
                    }
                    return;
                }
            }
            thing.FSP.TimeHandler.addEvent(thing.FSP.animateFadeAttribute, speed, thing, attribute, change, goal, speed, onCompletion);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateFadeHorizontal = function (thing, change, goal, speed, onCompletion) {
            thing.FSP.shiftHoriz(thing, change);
            if (change > 0) {
                if (thing.FSP.getMidX(thing) >= goal) {
                    thing.FSP.setMidX(thing, goal);
                    if (onCompletion) {
                        onCompletion(thing);
                    }
                    return;
                }
            }
            else {
                if (thing.FSP.getMidX(thing) <= goal) {
                    thing.FSP.setMidX(thing, goal);
                    if (onCompletion) {
                        onCompletion(thing);
                    }
                    return;
                }
            }
            thing.FSP.TimeHandler.addEvent(thing.FSP.animateFadeHorizontal, speed, thing, change, goal, speed, onCompletion);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateFadeVertical = function (thing, change, goal, speed, onCompletion) {
            thing.FSP.shiftVert(thing, change);
            if (change > 0) {
                if (thing.FSP.getMidY(thing) >= goal) {
                    thing.FSP.setMidY(thing, goal);
                    if (onCompletion) {
                        onCompletion(thing);
                    }
                    return;
                }
            }
            else {
                if (thing.FSP.getMidY(thing) <= goal) {
                    thing.FSP.setMidY(thing, goal);
                    if (onCompletion) {
                        onCompletion(thing);
                    }
                    return;
                }
            }
            thing.FSP.TimeHandler.addEvent(thing.FSP.animateFadeVertical, speed, thing, change, goal, speed, onCompletion);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateGrassBattleStart = function (thing, grass) {
            var grassMap = thing.FSP.MapsHandler.getMap(grass.mapName), grassArea = grassMap.areas[grass.areaName], options = grassArea.wildPokemon.grass, chosen = thing.FSP.chooseRandomWildPokemon(thing.FSP, options), chosenPokemon = thing.FSP.createPokemon(chosen);
            thing.FSP.removeClass(thing, "walking");
            if (thing.shadow) {
                thing.FSP.removeClass(thing.shadow, "walking");
            }
            thing.FSP.animateCharacterPreventWalking(thing);
            thing.FSP.startBattle({
                "opponent": {
                    "name": chosen.title,
                    "actors": [chosenPokemon],
                    "category": "Wild",
                    "sprite": chosen.title.join("") + "Front"
                }
            });
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateTrainerBattleStart = function (thing, other) {
            var battleName = other.battleName || other.title, battleSprite = other.battleSprite || battleName;
            thing.FSP.startBattle({
                "opponent": {
                    "name": battleName.split(""),
                    "sprite": battleSprite + "Front",
                    "category": "Trainer",
                    "hasActors": true,
                    "reward": other.reward,
                    "actors": other.actors.map(thing.FSP.createPokemon.bind(thing.FSP))
                },
                "textStart": ["", " wants to fight!"],
                "textDefeat": other.textDefeat,
                "textAfterBattle": other.textAfterBattle,
                "giftAfterBattle": other.giftAfterBattle,
                "badge": other.badge,
                "textVictory": other.textVictory,
                "nextCutscene": other.nextCutscene
            });
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animatePlayerLeaveLeft = function (thing, callback) {
            var width = thing.width, dt = 3, dx = -thing.FSP.unitsize * 4;
            thing.FSP.TimeHandler.addEventInterval(thing.FSP.shiftHoriz, dt, width, thing, dx);
            console.log("Should implement collapseLeft...");
            // thing.FSP.TimeHandler.addEventInterval(
            //     thing.FSP.collapseLeft, speed, width, thing, dx
            // );
            if (callback) {
                thing.FSP.TimeHandler.addEvent(callback, (width * (dt + 2)), thing);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateThingCorners = function (FSP, x, y, title, settings, groupType) {
            var things = [], i;
            for (i = 0; i < 4; i += 1) {
                things.push(FSP.addThing([title, settings]));
            }
            if (groupType) {
                for (i = 0; i < things.length; i += 1) {
                    things[0].FSP.GroupHolder.switchMemberGroup(things[i], things[i].groupType, groupType);
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateExpandCorners = function (things, amount) {
            var FSP = things[0].FSP;
            FSP.shiftHoriz(things[0], amount);
            FSP.shiftHoriz(things[1], amount);
            FSP.shiftHoriz(things[2], -amount);
            FSP.shiftHoriz(things[3], -amount);
            FSP.shiftVert(things[0], -amount);
            FSP.shiftVert(things[1], amount);
            FSP.shiftVert(things[2], amount);
            FSP.shiftVert(things[3], -amount);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateSmokeSmall = function (FSP, x, y, callback) {
            var things = FSP.animateThingCorners(FSP, x, y, "SmokeSmall", undefined, "Text");
            FSP.TimeHandler.addEvent(things.forEach.bind(things), 7, FSP.killNormal);
            FSP.TimeHandler.addEvent(FSP.animateSmokeMedium, 7, FSP, x, y, callback);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateSmokeMedium = function (FSP, x, y, callback) {
            var things = FSP.animateThingCorners(FSP, x, y, "SmokeMedium", undefined, "Text");
            FSP.TimeHandler.addEvent(FSP.animateExpandCorners, 7, things, FSP.unitsize);
            FSP.TimeHandler.addEvent(things.forEach.bind(things), 14, FSP.killNormal);
            FSP.TimeHandler.addEvent(FSP.animateSmokeLarge, 14, FSP, x, y, callback);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateSmokeLarge = function (FSP, x, y, callback) {
            var things = FSP.animateThingCorners(FSP, x, y, "SmokeLarge", undefined, "Text");
            FSP.animateExpandCorners(things, FSP.unitsize * 2.5);
            FSP.TimeHandler.addEvent(FSP.animateExpandCorners, 7, things, FSP.unitsize * 2);
            FSP.TimeHandler.addEvent(things.forEach.bind(things), 21, FSP.killNormal);
            if (callback) {
                FSP.TimeHandler.addEvent(callback, 21);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateExclamation = function (thing, timeout, callback) {
            if (timeout === void 0) { timeout = 140; }
            var exclamation = thing.FSP.addThing("Exclamation");
            timeout = timeout || 140;
            thing.FSP.setMidXObj(exclamation, thing);
            thing.FSP.setBottom(exclamation, thing.top);
            thing.FSP.TimeHandler.addEvent(thing.FSP.killNormal, timeout, exclamation);
            if (callback) {
                thing.FSP.TimeHandler.addEvent(callback, timeout);
            }
            return exclamation;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateFadeToColor = function (FSP, settings) {
            if (settings === void 0) { settings = {}; }
            var color = settings.color || "White", callback = settings.callback, change = settings.change || .33, blank = FSP.ObjectMaker.make(color + "Square", {
                "width": FSP.MapScreener.width,
                "height": FSP.MapScreener.height,
                "opacity": 0
            }), args = arguments;
            FSP.addThing(blank);
            FSP.animateFadeAttribute(blank, "opacity", change, 1, 4, function () {
                FSP.killNormal(blank);
                if (callback) {
                    callback.apply(this, args);
                }
            });
            return blank;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateFadeFromColor = function (FSP, settings) {
            var color = settings.color || "White", callback = settings.callback, change = settings.change || .33, speed = settings.speed || 4, blank = FSP.ObjectMaker.make(color + "Square", {
                "width": FSP.MapScreener.width,
                "height": FSP.MapScreener.height,
                "opacity": 1
            }), args = arguments;
            FSP.addThing(blank);
            FSP.animateFadeAttribute(blank, "opacity", -change, 0, speed, function () {
                FSP.killNormal(blank);
                if (callback) {
                    callback.apply(this, args);
                }
            });
            return blank;
        };
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
        FullScreenPokemon.prototype.animateFlicker = function (thing, cleartime, interval, callback) {
            if (cleartime === void 0) { cleartime = 49; }
            if (interval === void 0) { interval = 2; }
            var timeTotal = ((cleartime * interval) | 0) + 1;
            thing.flickering = true;
            thing.FSP.TimeHandler.addEventInterval(function () {
                thing.hidden = !thing.hidden;
                if (!thing.hidden) {
                    thing.FSP.PixelDrawer.setThingSprite(thing);
                }
            }, interval | 0, cleartime | 0);
            thing.FSP.TimeHandler.addEvent(function () {
                thing.flickering = thing.hidden = false;
                thing.FSP.PixelDrawer.setThingSprite(thing);
                if (callback) {
                    callback(thing);
                }
            }, timeTotal);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateScreenShake = function (FSP, dx, dy, cleartime, interval, callback) {
            if (dx === void 0) { dx = 0; }
            if (dy === void 0) { dy = 0; }
            if (cleartime === void 0) { cleartime = 8; }
            if (interval === void 0) { interval = 8; }
            var intervalEnd = (interval / 2) | 0;
            FSP.TimeHandler.addEventInterval(function () {
                FSP.GroupHolder.callOnAll(FSP, FSP.shiftHoriz, dx);
                FSP.GroupHolder.callOnAll(FSP, FSP.shiftVert, dy);
            }, 1, cleartime * interval);
            FSP.TimeHandler.addEvent(function () {
                dx *= -1;
                dy *= -1;
                FSP.TimeHandler.addEventInterval(function () {
                    dx *= -1;
                    dy *= -1;
                }, interval, cleartime);
                if (callback) {
                    FSP.TimeHandler.addEvent(callback, interval * cleartime, FSP);
                }
            }, intervalEnd);
        };
        /* Character movement animations
        */
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterSetDistanceVelocity = function (thing, distance) {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterStartTurning = function (thing, direction, onStop) {
            if (onStop.length === 0) {
                return;
            }
            if (onStop[0] === 0) {
                if (onStop.length > 1) {
                    if (typeof onStop[1] === "function") {
                        onStop[1](thing);
                        return;
                    }
                    thing.FSP.animateCharacterSetDirection(thing, FullScreenPokemon_1.DirectionAliases[onStop[1]]);
                    thing.FSP.animateCharacterStartTurning(thing, FullScreenPokemon_1.DirectionAliases[onStop[1]], onStop.slice(2));
                }
                return;
            }
            if (thing.follower) {
                thing.walkingCommands.push(direction);
            }
            thing.FSP.animateCharacterStartWalking(thing, direction, onStop);
            thing.FSP.shiftBoth(thing, -thing.xvel, -thing.yvel);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterStartWalking = function (thing, direction, onStop) {
            var repeats = thing.FSP.getCharacterWalkingInterval(thing), distance = repeats * thing.speed;
            direction = direction || 0;
            thing.walking = true;
            thing.FSP.animateCharacterSetDirection(thing, direction);
            thing.FSP.animateCharacterSetDistanceVelocity(thing, distance);
            if (!thing.cycles || !thing.cycles.walking) {
                thing.FSP.TimeHandler.addClassCycle(thing, ["walking", "standing"], "walking", repeats / 2);
            }
            if (!thing.walkingFlipping) {
                thing.walkingFlipping = thing.FSP.TimeHandler.addEventInterval(thing.FSP.animateSwitchFlipOnDirection, repeats, Infinity, thing);
            }
            if (thing.sight) {
                thing.sightDetector.nocollide = true;
            }
            thing.FSP.TimeHandler.addEventInterval(thing.onWalkingStop, repeats, Infinity, thing, onStop);
            thing.FSP.shiftBoth(thing, thing.xvel, thing.yvel);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterStartWalkingRandom = function (thing) {
            var totalAllowed = 0, direction, i;
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
            }
            else {
                thing.FSP.animateCharacterStartWalking(thing, direction);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animatePlayerStartWalking = function (thing) {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterSetDirection = function (thing, direction) {
            thing.direction = direction;
            if (direction !== 1) {
                thing.FSP.unflipHoriz(thing);
            }
            else {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterSetDirectionRandom = function (thing) {
            thing.FSP.animateCharacterSetDirection(thing, thing.FSP.NumberMaker.randomIntWithin(0, 3));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterStopWalking = function (thing, onStop) {
            thing.xvel = 0;
            thing.yvel = 0;
            thing.walking = false;
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
                    thing.FSP.animatePlayerStartWalking(thing);
                    return true;
                case Array:
                    if (onStop[0] > 0) {
                        onStop[0] -= 1;
                        thing.FSP.animateCharacterStartTurning(thing, thing.direction, onStop);
                    }
                    else if (onStop.length === 0) {
                        return true;
                    }
                    else {
                        if (onStop[1] instanceof Function) {
                            return onStop[1](thing);
                        }
                        thing.FSP.animateCharacterStartTurning(thing, FullScreenPokemon_1.DirectionAliases[onStop[1]], onStop.slice(2));
                    }
                    return true;
                case Function:
                    return onStop(thing);
                default:
                    throw new Error("Unknown onStop: " + onStop + ".");
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animatePlayerStopWalking = function (thing, onStop) {
            if (thing.FSP.checkPlayerGrassBattle(thing)) {
                return;
            }
            if (thing.following) {
                return thing.FSP.animateCharacterStopWalking(thing, onStop);
            }
            if (!thing.FSP.MenuGrapher.getActiveMenu()
                && thing.keys[thing.direction]) {
                thing.FSP.animateCharacterSetDistanceVelocity(thing, thing.distance);
                return false;
            }
            else {
                if (typeof thing.nextDirection !== "undefined") {
                    if (thing.nextDirection !== thing.direction && !thing.ledge) {
                        thing.FSP.setPlayerDirection(thing, thing.nextDirection);
                    }
                    delete thing.nextDirection;
                }
            }
            thing.canKeyWalking = true;
            return thing.FSP.animateCharacterStopWalking(thing, onStop);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterPreventWalking = function (thing) {
            thing.shouldWalk = false;
            thing.xvel = thing.yvel = 0;
            if (thing.player) {
                thing.keys = thing.getKeys();
            }
            thing.FSP.MapScreener.blockInputs = true;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateFlipOnDirection = function (thing) {
            if (thing.direction % 2 === 0) {
                thing.FSP.flipHoriz(thing);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateUnflipOnDirection = function (thing) {
            if (thing.direction % 2 === 0) {
                thing.FSP.unflipHoriz(thing);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateSwitchFlipOnDirection = function (thing) {
            if (thing.direction % 2 !== 0) {
                return;
            }
            if (thing.flipHoriz) {
                thing.FSP.unflipHoriz(thing);
            }
            else {
                thing.FSP.flipHoriz(thing);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animatePositionSightDetector = function (thing) {
            var detector = thing.sightDetector, direction = thing.direction, sight = Number(thing.sight);
            if (detector.direction !== direction) {
                if (thing.direction % 2 === 0) {
                    thing.FSP.setWidth(detector, thing.width);
                    thing.FSP.setHeight(detector, sight * 8);
                }
                else {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterDialogFinish = function (thing, other) {
            var onStop;
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
                thing.FSP.activateTransporter(thing, other);
                return;
            }
            if (typeof other.pushDirection !== "undefined") {
                thing.FSP.animateCharacterStartTurning(thing, other.pushDirection, onStop);
            }
            if (other.gift) {
                thing.FSP.MenuGrapher.createMenu("GeneralText", {
                    "deleteOnFinish": true
                });
                thing.FSP.MenuGrapher.addMenuDialog("GeneralText", "%%%%%%%PLAYER%%%%%%% got " + other.gift.toUpperCase() + "!", thing.FSP.animateCharacterDialogFinish.bind(thing.FSP, thing, other));
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
            if (other.dialogOptions) {
                thing.FSP.animateCharacterDialogOptions(thing, other, other.dialogOptions);
            }
            else if (other.trainer) {
                thing.FSP.animateTrainerBattleStart(thing, other);
            }
            if (other.trainer) {
                other.trainer = false;
                thing.FSP.StateHolder.addChange(other.id, "trainer", false);
                if (other.sight) {
                    other.sight = undefined;
                    thing.FSP.StateHolder.addChange(other.id, "sight", undefined);
                }
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterDialogOptions = function (thing, other, dialog) {
            var options = dialog.options, generateCallback = function (dialog) {
                var callback, words;
                if (!dialog) {
                    return undefined;
                }
                if (dialog.constructor === Object && dialog.options) {
                    words = dialog.words;
                    callback = thing.FSP.animateCharacterDialogOptions.bind(thing.FSP, thing, other, dialog);
                }
                else {
                    words = dialog.words || dialog;
                    if (dialog.cutscene) {
                        callback = thing.FSP.ScenePlayer.bindCutscene(dialog.cutscene, {
                            "player": thing,
                            "tirggerer": other
                        });
                    }
                }
                return function () {
                    thing.FSP.MenuGrapher.deleteMenu("Yes/No");
                    thing.FSP.MenuGrapher.createMenu("GeneralText", {});
                    thing.FSP.MenuGrapher.addMenuDialog("GeneralText", words, callback);
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterFollow = function (thing, other) {
            var direction = thing.FSP.getDirectionBordering(thing, other);
            thing.nocollide = true;
            if (thing.player) {
                thing.allowDirectionAsKeys = true;
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
            // Manually start the walking process without giving a 0 onStop,
            // so that it continues smoothly in the walking interval
            thing.FSP.animateCharacterStartWalking(thing, direction);
            other.walkingCommands.shift();
            thing.followingLoop = thing.FSP.TimeHandler.addEventInterval(thing.FSP.animateCharacterFollowContinue, thing.FSP.getCharacterWalkingInterval(thing), Infinity, thing, other);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterFollowContinue = function (thing, other) {
            if (other.walkingCommands.length === 0) {
                return;
            }
            var direction = other.walkingCommands.shift();
            thing.FSP.animateCharacterStartWalking(thing, direction, 0);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterFollowStop = function (thing) {
            var other = thing.following;
            if (!other) {
                return true;
            }
            thing.nocollide = false;
            delete thing.following;
            delete other.follower;
            thing.FSP.animateCharacterStopWalking(thing);
            thing.FSP.TimeHandler.cancelEvent(thing.followingLoop);
            return true;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.getCharacterWalkingInterval = function (thing) {
            return Math.round(8 * thing.FSP.unitsize / thing.speed);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateCharacterHopLedge = function (thing, other) {
            var shadow = thing.FSP.addThing("Shadow"), dy = -thing.FSP.unitsize, speed = 2, steps = 14, changed = 0;
            thing.shadow = shadow;
            thing.ledge = other;
            // Center the shadow below the Thing
            thing.FSP.setMidXObj(shadow, thing);
            thing.FSP.setBottom(shadow, thing.bottom);
            // Continuously ensure The Thing still moves off the ledge if not walking
            thing.FSP.TimeHandler.addEventInterval(function () {
                if (thing.walking) {
                    return false;
                }
                thing.FSP.animateCharacterSetDistanceVelocity(thing, thing.distance);
                return true;
            }, 1, steps * speed - 1);
            // Keep the shadow below the Thing, and move the Thing's offsetY
            thing.FSP.TimeHandler.addEventInterval(function () {
                thing.FSP.setBottom(shadow, thing.bottom);
                if (changed % speed === 0) {
                    thing.offsetY += dy;
                }
                changed += 1;
            }, 1, steps * speed);
            // Inverse the Thing's offsetY changes halfway through the hop
            thing.FSP.TimeHandler.addEvent(function () {
                dy *= -1;
            }, speed * (steps / 2) | 0);
            // Delete the shadow after the jump is done
            thing.FSP.TimeHandler.addEvent(function () {
                delete thing.ledge;
                thing.FSP.killNormal(shadow);
                if (!thing.walking) {
                    thing.FSP.animateCharacterStopWalking(thing);
                }
            }, steps * speed);
        };
        /* Collision detection
        */
        /**
         *
         */
        FullScreenPokemon.prototype.generateCanThingCollide = function () {
            return function (thing) {
                return thing.alive;
            };
        };
        /**
         *
         */
        FullScreenPokemon.prototype.generateIsCharacterTouchingCharacter = function () {
            return function isCharacterTouchingCharacter(thing, other) {
                // if (other.xvel || other.yvel) {
                //     // check destination...
                // }
                return (!thing.nocollide && !other.nocollide
                    && thing.right >= (other.left + other.tolLeft)
                    && thing.left <= (other.right - other.tolRight)
                    && thing.bottom >= (other.top + other.tolTop)
                    && thing.top <= (other.bottom - other.tolBottom));
            };
        };
        /**
         *
         */
        FullScreenPokemon.prototype.generateIsCharacterTouchingSolid = function () {
            return function isCharacterTouchingSolid(thing, other) {
                return (!thing.nocollide && !other.nocollide
                    && thing.right >= (other.left + other.tolLeft)
                    && thing.left <= (other.right - other.tolRight)
                    && thing.bottom >= (other.top + other.tolTop)
                    && thing.top <= (other.bottom - other.tolBottom));
            };
        };
        /**
         *
         */
        FullScreenPokemon.prototype.generateHitCharacterThing = function () {
            return function hitCharacterSolid(thing, other) {
                // If either Thing is the player, it should be the first
                if (other.player && !thing.player) {
                    var temp = other;
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
                        if (thing.left !== other.right - other.tolRight
                            && thing.right !== other.left + other.tolLeft) {
                            thing.bordering[0] = other;
                            other.bordering[2] = thing;
                            thing.FSP.setTop(thing, other.bottom - other.tolBottom);
                        }
                        break;
                    case 1:
                        if (thing.top !== other.bottom - other.tolBottom
                            && thing.bottom !== other.top + other.tolTop) {
                            thing.bordering[1] = other;
                            other.bordering[3] = thing;
                            thing.FSP.setRight(thing, other.left + other.tolLeft);
                        }
                        break;
                    case 2:
                        if (thing.left !== other.right - other.tolRight
                            && thing.right !== other.left + other.tolLeft) {
                            thing.bordering[2] = other;
                            other.bordering[0] = thing;
                            thing.FSP.setBottom(thing, other.top + other.tolTop);
                        }
                        break;
                    case 3:
                        if (thing.top !== other.bottom - other.tolBottom
                            && thing.bottom !== other.top + other.tolTop) {
                            thing.bordering[3] = other;
                            other.bordering[1] = thing;
                            thing.FSP.setLeft(thing, other.right - other.tolRight);
                        }
                        break;
                    default:
                        break;
                }
            };
        };
        /**
         *
         */
        FullScreenPokemon.prototype.collideCollisionDetector = function (thing, other) {
            if (!thing.player) {
                return;
            }
            if (other.active) {
                if ((!other.requireOverlap && !thing.walking)
                    || thing.FSP.isThingWithinOther(thing, other)) {
                    if (typeof other.requireDirection !== "undefined"
                        && !thing.keys[other.requireDirection]
                        && !thing.allowDirectionAsKeys
                        && thing.direction !== other.requireDirection) {
                        return;
                    }
                    if (other.singleUse) {
                        other.active = false;
                    }
                    other.activate(thing, other);
                }
                return true;
            }
            // If the thing is moving towards the triggerer, it's now active
            if (thing.direction === thing.FSP.getDirectionBordering(thing, other)) {
                other.active = true;
                return true;
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.collideCharacterDialog = function (thing, other) {
            var dialog = other.dialog, direction;
            if (other.cutscene) {
                thing.FSP.ScenePlayer.startCutscene(other.cutscene, {
                    "thing": thing,
                    "triggerer": other
                });
            }
            if (!dialog) {
                return;
            }
            direction = thing.FSP.getDirectionBetween(other, thing);
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
                thing.FSP.MenuGrapher.addMenuDialog("GeneralText", dialog, thing.FSP.animateCharacterDialogFinish.bind(thing.FSP, thing, other));
            }
            if (other.switchDirectionOnDialog) {
                thing.FSP.animateCharacterSetDirection(other, direction);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.collidePokeball = function (thing, other) {
            switch (other.action) {
                case "item":
                    thing.FSP.MenuGrapher.createMenu("GeneralText");
                    thing.FSP.MenuGrapher.addMenuDialog("GeneralText", [
                        "%%%%%%%PLAYER%%%%%%% found " + other.item + "!"
                    ], function () {
                        thing.FSP.MenuGrapher.deleteActiveMenu();
                        thing.FSP.killNormal(other);
                        thing.FSP.StateHolder.addChange(other.id, "alive", false);
                    });
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.collideCharacterGrass = function (thing, other) {
            if (thing.grass
                || !thing.FSP.isThingWithinGrass(thing, other)) {
                return true;
            }
            thing.grass = other;
            thing.heightOld = thing.height;
            thing.canvas.height = thing.heightGrass * thing.FSP.unitsize;
            thing.FSP.PixelDrawer.setThingSprite(thing);
            thing.shadow = thing.FSP.ObjectMaker.make(thing.title, {
                "nocollide": true,
                "id": thing.id + " shadow"
            });
            if (thing.shadow.className !== thing.className) {
                thing.FSP.setClass(thing.shadow, thing.className);
            }
            thing.FSP.addThing(thing.shadow, thing.left, thing.top);
            thing.FSP.GroupHolder.switchMemberGroup(thing.shadow, thing.shadow.groupType, "Terrain");
            thing.FSP.arrayToEnd(thing.shadow, thing.FSP.GroupHolder.getGroup("Terrain"));
            return true;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.collideLedge = function (thing, other) {
            if (thing.ledge || !thing.walking) {
                return true;
            }
            if (thing.direction !== other.direction) {
                return false;
            }
            if (thing.direction % 2 === 0) {
                if (thing.left === other.right || thing.right === other.left) {
                    return true;
                }
            }
            else {
                if (thing.top === other.bottom || thing.bottom === other.top) {
                    return true;
                }
            }
            thing.FSP.animateCharacterHopLedge(thing, other);
            return true;
        };
        /* Death
        */
        /**
         * Standard Function to kill a Thing, which means marking it as dead and
         * clearing its numquads, resting, movement, and cycles. It will later be
         * removed by its maintain* Function.
         *
         * @param {Thing} thing
         */
        FullScreenPokemon.prototype.killNormal = function (thing) {
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
        };
        /* Activations
        */
        /**
         *
         */
        FullScreenPokemon.prototype.activateCutsceneTriggerer = function (thing, other) {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.activateThemePlayer = function (thing, other) {
            if (thing.FSP.AudioPlayer.getThemeName() === other.theme) {
                return;
            }
            thing.FSP.AudioPlayer.play(other.theme);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.activateCutsceneResponder = function (thing, other) {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.activateMenuTriggerer = function (thing, other) {
            if (!other.alive || thing.collidedTrigger === other) {
                return;
            }
            var name = other.menu || "GeneralText", dialog = other.dialog;
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
                thing.FSP.MenuGrapher.addMenuDialog(name, dialog, function () {
                    var onStop;
                    if (other.pushSteps) {
                        onStop = other.pushSteps.slice();
                    }
                    thing.FSP.MenuGrapher.deleteMenu("GeneralText");
                    if (typeof other.pushDirection !== "undefined") {
                        onStop.push(function () {
                            thing.FSP.MapScreener.blockInputs = false;
                            delete thing.collidedTrigger;
                        });
                        thing.FSP.animateCharacterStartTurning(thing, other.pushDirection, onStop);
                    }
                    else {
                        thing.FSP.MapScreener.blockInputs = false;
                        delete thing.collidedTrigger;
                    }
                });
            }
            thing.FSP.MenuGrapher.setActiveMenu(name);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.activateSightDetector = function (thing, other) {
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
        };
        /**
         * Activation callback for level transports (any Thing with a .transport
         * attribute). Depending on the transport, either the map or location are
         * shifted to it.
         *
         * @param {Player} thing
         * @param {Thing} other
         */
        FullScreenPokemon.prototype.activateTransporter = function (thing, other) {
            if (!thing.player || !other.active) {
                return;
            }
            if (typeof other.transport === "undefined") {
                throw new Error("No transport given to activateTransporter");
            }
            var transport = other.transport, callback, args;
            if (transport.constructor === String) {
                callback = thing.FSP.setLocation.bind(thing.FSP);
                args = [transport];
            }
            else if (typeof transport.map !== "undefined") {
                callback = thing.FSP.setMap.bind(thing.FSP);
                args = [transport.map, transport.location];
            }
            else if (typeof transport.location !== "undefined") {
                callback = thing.FSP.setLocation.bind(thing.FSP);
                args = [transport.location];
            }
            else {
                throw new Error("Unknown transport type:" + transport);
            }
            other.active = false;
            thing.FSP.animateFadeToColor(thing.FSP, {
                "color": "Black",
                "callback": callback.apply.bind(callback, thing.FSP, args)
            });
        };
        /**
         *
         */
        FullScreenPokemon.prototype.activateGymStatue = function (thing, other) {
            if (thing.direction !== 0) {
                return;
            }
            var gym = other.gym, leader = other.leader, dialog = [
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
        };
        /* Physics
        */
        /**
         *
         *
         * @todo I would like this to be more elegant.
         */
        FullScreenPokemon.prototype.getDirectionBordering = function (thing, other) {
            if (Math.abs((thing.top) - (other.bottom - other.tolBottom)) < thing.FSP.unitsize) {
                return Direction.Top;
            }
            if (Math.abs(thing.right - other.left) < thing.FSP.unitsize) {
                return Direction.Right;
            }
            if (Math.abs(thing.bottom - other.top) < thing.FSP.unitsize) {
                return Direction.Bottom;
            }
            if (Math.abs(thing.left - other.right) < thing.FSP.unitsize) {
                return Direction.Left;
            }
            return undefined;
        };
        /**
         *
         *
         * @remarks Like getDirectionBordering, but for cases where the two Things
         *          aren't necessarily touching.
         */
        FullScreenPokemon.prototype.getDirectionBetween = function (thing, other) {
            var directionAttempt = thing.FSP.getDirectionBordering(thing, other);
            if (typeof directionAttempt !== "undefined") {
                return directionAttempt;
            }
            if (thing.top > other.bottom + thing.FSP.unitsize) {
                return Direction.Top;
            }
            if (thing.right < other.left - thing.FSP.unitsize) {
                return Direction.Right;
            }
            if (thing.bottom < other.top - thing.FSP.unitsize) {
                return Direction.Bottom;
            }
            if (thing.left > other.right + thing.FSP.unitsize) {
                return Direction.Left;
            }
            return undefined;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.isThingWithinOther = function (thing, other) {
            return (thing.top >= other.top - thing.FSP.unitsize
                && thing.right <= other.right + thing.FSP.unitsize
                && thing.bottom <= other.bottom + thing.FSP.unitsize
                && thing.left >= other.left - thing.FSP.unitsize);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.isThingWithinGrass = function (thing, other) {
            if (thing.right <= other.left) {
                return false;
            }
            if (thing.left >= other.right) {
                return false;
            }
            if (other.top > (thing.top + thing.heightGrass * thing.FSP.unitsize)) {
                return false;
            }
            if (other.bottom < (thing.top + thing.heightGrass * thing.FSP.unitsize)) {
                return false;
            }
            return true;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.shiftCharacter = function (thing) {
            if (thing.xvel !== 0) {
                thing.bordering[1] = thing.bordering[3] = undefined;
            }
            else if (thing.yvel !== 0) {
                thing.bordering[0] = thing.bordering[2] = undefined;
            }
            else {
                return;
            }
            thing.FSP.shiftBoth(thing, thing.xvel, thing.yvel);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.setPlayerDirection = function (thing, direction) {
            thing.direction = direction;
            thing.FSP.MapScreener.playerDirection = direction;
            thing.shouldWalk = true;
        };
        /* Spawning
        */
        /**
         *
         *
         * @remarks Should be the line after snaptogrid...
         */
        FullScreenPokemon.prototype.spawnCharacter = function (thing) {
            if (thing.sight) {
                thing.sightDetector = thing.FSP.addThing([
                    "SightDetector",
                    {
                        "direction": thing.direction,
                        "width": thing.sight * 8
                    }
                ]);
                thing.sightDetector.viewer = thing;
                thing.FSP.animatePositionSightDetector(thing);
            }
            if (thing.roaming) {
                thing.FSP.TimeHandler.addEvent(thing.FSP.activateCharacterRoaming, thing.FSP.NumberMaker.randomInt(70), thing);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.activateCharacterRoaming = function (thing) {
            if (!thing.alive) {
                return true;
            }
            thing.FSP.TimeHandler.addEvent(thing.FSP.activateCharacterRoaming, 70 + thing.FSP.NumberMaker.randomInt(210), thing);
            if (!thing.talking && !thing.FSP.MenuGrapher.getActiveMenu()) {
                thing.FSP.animateCharacterStartWalkingRandom(thing);
            }
            return false;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.activateSpawner = function (thing) {
            thing.activate(thing);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.spawnWindowDetector = function (thing) {
            if (!thing.FSP.checkWindowDetector(thing)) {
                thing.FSP.TimeHandler.addEventInterval(thing.FSP.checkWindowDetector, 7, Infinity, thing);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.checkWindowDetector = function (thing) {
            if (thing.bottom < 0
                || thing.left > thing.FSP.MapScreener.width
                || thing.top > thing.FSP.MapScreener.height
                || thing.right < 0) {
                return false;
            }
            thing.activate(thing);
            thing.FSP.killNormal(thing);
            return true;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.spawnAreaSpawner = function (thing) {
            var map = thing.FSP.MapsHandler.getMap(thing.map), area = map.areas[thing.area];
            if (area === thing.FSP.MapsHandler.getArea()) {
                thing.FSP.killNormal(thing);
                return;
            }
            if (area.spawnedBy
                && area.spawnedBy === thing.FSP.MapsHandler.getArea().spawnedBy) {
                thing.FSP.killNormal(thing);
                return;
            }
            area.spawnedBy = thing.FSP.MapsHandler.getArea().spawnedBy;
            thing.FSP.activateAreaSpawner(thing, area);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.activateAreaSpawner = function (thing, area) {
            var creation = area.creation, FSP = thing.FSP, MapsCreator = FSP.MapsCreator, MapsHandler = FSP.MapsHandler, QuadsKeeper = FSP.QuadsKeeper, areaCurrent = MapsHandler.getArea(), mapCurrent = MapsHandler.getMap(), prethingsCurrent = MapsHandler.getPreThings(), left = thing.left + thing.FSP.MapScreener.left, top = thing.top + thing.FSP.MapScreener.top, x, y, command, i;
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
                command = FSP.proliferate({
                    "noBoundaryStretch": true,
                    "areaName": area.name,
                    "mapName": area.map.name
                }, creation[i]);
                if (!command.x) {
                    command.x = x;
                }
                else {
                    command.x += x;
                }
                if (!command.y) {
                    command.y = y;
                }
                else {
                    command.y += y;
                }
                // Having an entrance might conflict with previously set Locations
                if (command.hasOwnProperty("entrance")) {
                    delete command.entrance;
                }
                MapsCreator.analyzePreSwitch(command, prethingsCurrent, areaCurrent, mapCurrent);
            }
            MapsHandler.spawnMap("xInc", QuadsKeeper.top / FSP.unitsize, QuadsKeeper.right / FSP.unitsize, QuadsKeeper.bottom / FSP.unitsize, QuadsKeeper.left / FSP.unitsize);
            area.spawned = true;
            FSP.killNormal(thing);
            // MapScreener.setVariables();
        };
        /**
         *
         *
         * @todo It would be nice to intelligently do this based on boundaries, but
         *       this works and that doesn't (easily / yet / without bugs).
         */
        FullScreenPokemon.prototype.expandMapBoundaries = function (FSP, area, x, y) {
            FSP.MapScreener.scrollability = "both";
        };
        /* Pokedex storage
        */
        /**
         *
         */
        FullScreenPokemon.prototype.addPokemonToPokedex = function (FSP, titleRaw, status) {
            var pokedex = FSP.ItemsHolder.getItem("Pokedex"), title = titleRaw.join(""), information = pokedex[title], caught = status === PokedexListingStatus.Caught, seen = caught || (status === PokedexListingStatus.Seen);
            if (information) {
                // Skip potentially expensive storage operations if they're unnecessary
                if (information.caught || (information.seen && status >= PokedexListingStatus.Seen)) {
                    return;
                }
                information.caught = information.caught || (status >= PokedexListingStatus.Caught);
                information.seen = information.seen || (status >= PokedexListingStatus.Seen);
            }
            else {
                pokedex[title] = information = {
                    caught: caught,
                    seen: seen,
                    title: titleRaw
                };
            }
            FSP.ItemsHolder.setItem("Pokedex", pokedex);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.getPokedexListingsOrdered = function (FSP) {
            var pokedex = FSP.ItemsHolder.getItem("Pokedex"), pokemon = FSP.MathDecider.getConstant("pokemon"), titlesSorted = Object.keys(pokedex)
                .sort(function (a, b) {
                return pokemon[a].number - pokemon[b].number;
            }), ordered = [], i, j;
            if (!titlesSorted.length) {
                return [];
            }
            for (i = 0; i < pokemon[titlesSorted[0]].number - 1; i += 1) {
                ordered.push(null);
            }
            for (i = 0; i < titlesSorted.length - 1; i += 1) {
                ordered.push(pokedex[titlesSorted[i]]);
                for (j = pokemon[titlesSorted[i]].number - 1; j < pokemon[titlesSorted[i + 1]].number - 2; j += 1) {
                    ordered.push(null);
                }
            }
            ordered.push(pokedex[titlesSorted[i]]);
            return ordered;
        };
        /* Menus
        */
        /**
         *
         */
        FullScreenPokemon.prototype.openPauseMenu = function () {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), options = [
                {
                    "text": "%%%%%%%POKEMON%%%%%%%",
                    "callback": FSP.openPokemonMenu.bind(FSP, {})
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
                }];
            // The Pokedex option is only shown if the Player has one
            if (FSP.ItemsHolder.getItem("hasPokedex") === true) {
                options.unshift({
                    "text": "%%%%%%%POKEDEX%%%%%%%",
                    "callback": FSP.openPokedexMenu.bind(FSP)
                });
            }
            FSP.MenuGrapher.createMenu("Pause");
            FSP.MenuGrapher.addMenuList("Pause", {
                "options": options
            });
            FSP.MenuGrapher.setActiveMenu("Pause");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.closePauseMenu = function () {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this);
            FSP.MenuGrapher.deleteMenu("Pause");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.togglePauseMenu = function (thing) {
            if (thing.FSP.MenuGrapher.getActiveMenu()) {
                thing.FSP.MenuGrapher.registerStart();
                return;
            }
            var cutsceneSettings = thing.FSP.ScenePlayer.getCutsceneSettings();
            if (cutsceneSettings && cutsceneSettings.disablePauseMenu) {
                return;
            }
            thing.FSP.MenuGrapher.getMenu("Pause")
                ? thing.FSP.closePauseMenu()
                : thing.FSP.openPauseMenu();
        };
        /**
         *
         */
        FullScreenPokemon.prototype.openPokedexMenu = function () {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), listings = FSP.getPokedexListingsOrdered(FSP), currentListing;
            FSP.MenuGrapher.createMenu("Pokedex");
            FSP.MenuGrapher.addMenuList("Pokedex", {
                "options": listings.map(function (listing, i) {
                    var characters = FSP.makeDigit(i + 1, 3, 0).split(""), output = {
                        "text": characters,
                        "callback": function () {
                            currentListing = listing;
                            FSP.MenuGrapher.setActiveMenu("PokedexOptions");
                        }
                    };
                    characters.push({
                        "command": true,
                        "y": 4
                    });
                    if (listing) {
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
                        characters.push.apply(characters, listing.title);
                    }
                    else {
                        characters.push.apply(characters, "----------".split(""));
                    }
                    characters.push({
                        "command": true,
                        "y": -4
                    });
                    return output;
                })
            });
            FSP.MenuGrapher.setActiveMenu("Pokedex");
            FSP.MenuGrapher.createMenu("PokedexOptions");
            FSP.MenuGrapher.addMenuList("PokedexOptions", {
                "options": [
                    {
                        "text": "DATA",
                        "callback": function () {
                            FSP.openPokedexListing(currentListing.title, FSP.MenuGrapher.setActiveMenu.bind(FSP.MenuGrapher, "PokedexOptions"));
                        }
                    }, {
                        "text": "CRY"
                    }, {
                        "text": "AREA",
                        "callback": function () {
                            FSP.openTownMapMenu({
                                "backMenu": "PokedexOptions"
                            });
                            FSP.showTownMapPokemonLocations(currentListing.title);
                        }
                    }, {
                        "text": "QUIT",
                        "callback": FSP.MenuGrapher.registerB
                    }
                ]
            });
        };
        /**
         *
         */
        FullScreenPokemon.prototype.openPokemonMenuContext = function (settings) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this);
            FSP.MenuGrapher.createMenu("PokemonMenuContext", {
                "backMenu": "Pokemon"
            });
            FSP.MenuGrapher.addMenuList("PokemonMenuContext", {
                "options": [
                    {
                        "text": "STATS",
                        "callback": FSP.openPokemonMenuStats.bind(FSP, {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.openPokemonMenuStats = function (settings) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), pokemon = settings.pokemon, schemas = FSP.MathDecider.getConstant("pokemon"), schema = schemas[pokemon.title.join("")], barWidth = 25, health = FSP.MathDecider.compute("widthHealthBar", barWidth, pokemon.HP, pokemon.HPNormal);
            FSP.MenuGrapher.createMenu("PokemonMenuStats", {
                "backMenu": "PokemonMenuContext",
                "callback": FSP.openPokemonMenuStatsSecondary.bind(FSP, pokemon),
                "container": "Pokemon"
            });
            FSP.openPokemonStats({
                "pokemon": pokemon,
                "container": "PokemonMenuStats",
                "size": {
                    "width": 40,
                    "height": 40
                },
                "position": {
                    "vertical": "bottom",
                    "horizontal": "left",
                    "offset": {
                        "left": 3,
                        "top": -3
                    }
                },
                "textXOffset": 4
            });
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsTitle", [pokemon.nickname]);
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsLevel", pokemon.level.toString());
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsHP", pokemon.HP + "/ " + pokemon.HPNormal);
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsNumber", FSP.makeDigit(schema.number, 3, 0));
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsStatus", "OK");
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsType1", pokemon.types[0]);
            if (pokemon.types.length >= 2) {
                FSP.MenuGrapher.createMenu("PokemonMenuStatsType2");
                FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsType2", pokemon.types[1]);
            }
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsID", "31425");
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsOT", [
                "%%%%%%%PLAYER%%%%%%%"
            ]);
            FSP.MenuGrapher.createMenuThing("PokemonMenuStatsHPBar", {
                "type": "thing",
                "thing": "LightGraySquare",
                "position": {
                    "horizontal": "left",
                    "offset": {
                        "top": 0.5,
                        "left": 8.5
                    }
                },
                "args": {
                    "width": Math.max(health, 1),
                    "height": 1,
                    "hidden": health === 0
                },
            });
            FSP.MenuGrapher.createMenuThing("PokemonMenuStats", {
                "type": "thing",
                "thing": pokemon.title.join("") + "Front",
                "args": {
                    "flipHoriz": true
                },
                "position": {
                    "vertical": "bottom",
                    "offset": {
                        "left": 9,
                        "top": -48
                    }
                }
            });
            FSP.MenuGrapher.setActiveMenu("PokemonMenuStats");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.openPokemonStats = function (settings) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), pokemon = settings.pokemon, statistics = FSP.MathDecider.getConstant("statisticNamesDisplayed"), numStatistics = statistics.length, textXOffset = settings.textXOffset || 8, top, left, i;
            // A copy of statistics is used to not modify the original constant
            statistics = [].slice.call(statistics);
            for (i = 0; i < numStatistics; i += 1) {
                statistics.push(FSP.makeDigit(pokemon[statistics[i] + "Normal"], 3, "\t"));
                statistics[i] = statistics[i].toUpperCase();
            }
            FSP.MenuGrapher.createMenu("LevelUpStats", {
                "container": settings.container,
                "size": settings.size,
                "position": settings.position || {
                    "horizontal": "center",
                    "vertical": "center"
                },
                "callback": FSP.MenuGrapher.deleteMenu.bind(FSP.MenuGrapher, "LevelUpStats"),
                "onMenuDelete": settings.onMenuDelete,
                "childrenSchemas": statistics.map(function (text, i) {
                    if (i < numStatistics) {
                        top = i * 8 + 4;
                        left = textXOffset;
                    }
                    else {
                        top = (i - numStatistics + 1) * 8;
                        left = textXOffset + 20;
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.openPokemonMenuStatsSecondary = function (pokemon) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), options = pokemon.moves.map(function (move) {
                var characters = [" "], output = {
                    "text": characters
                };
                characters.push({
                    "command": true,
                    "x": 40,
                    "y": 4
                });
                characters.push({
                    "command": true,
                    "y": .5
                });
                characters.push("PP", " ");
                characters.push({
                    "command": true,
                    "y": -.5
                });
                characters.push.apply(characters, FSP.makeDigit(move.remaining, 2, " ").split(""));
                characters.push("/");
                characters.push.apply(characters, FSP.makeDigit(FSP.MathDecider.getConstant("moves")[move.title].PP, 2, " ").split(""));
                characters.push({
                    "command": true,
                    "x": -75,
                    "y": -4
                });
                // TODO: Moves should always be uppercase...
                characters.push.apply(characters, move.title.toUpperCase().split(""));
                return output;
            }), i;
            // Fill any remaining options with "-" and "--" for move and PP, respectively
            for (i = options.length; i < 4; i += 1) {
                options.push({
                    "text": [
                        "-",
                        {
                            "command": true,
                            "x": 40,
                            "y": 4
                        },
                        "-",
                        "-"
                    ]
                });
            }
            FSP.MenuGrapher.createMenu("PokemonMenuStatsExperience");
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsExperience", FSP.makeDigit(pokemon.experience.current, 10, "\t"));
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsExperienceFrom", FSP.makeDigit(pokemon.experience.remaining, 3, "\t"));
            FSP.MenuGrapher.addMenuDialog("PokemonMenuStatsExperienceNext", pokemon.level === 99 ? "" : (pokemon.level + 1).toString());
            FSP.MenuGrapher.createMenu("PokemonMenuStatsMoves");
            FSP.MenuGrapher.addMenuList("PokemonMenuStatsMoves", {
                "options": options
            });
            FSP.MenuGrapher.getMenu("PokemonMenuStats").callback = FSP.MenuGrapher.deleteMenu.bind(FSP.MenuGrapher);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.openPokedexListing = function (title, callback, menuSettings) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), pokemon = FSP.MathDecider.getConstant("pokemon")[title.join("")], height = pokemon.height, feet = [].slice.call(height[0]).reverse().join(""), inches = [].slice.call(height[1]).reverse().join("");
            FSP.MenuGrapher.createMenu("PokedexListing", menuSettings);
            FSP.MenuGrapher.createMenuThing("PokedexListingSprite", {
                "thing": title.join("") + "Front",
                "type": "thing",
                "args": {
                    "flipHoriz": true
                }
            });
            FSP.MenuGrapher.addMenuDialog("PokedexListingName", [[title]]);
            FSP.MenuGrapher.addMenuDialog("PokedexListingLabel", pokemon.label);
            FSP.MenuGrapher.addMenuDialog("PokedexListingHeightFeet", feet);
            FSP.MenuGrapher.addMenuDialog("PokedexListingHeightInches", inches);
            FSP.MenuGrapher.addMenuDialog("PokedexListingWeight", pokemon.weight.toString());
            FSP.MenuGrapher.addMenuDialog("PokedexListingNumber", FSP.makeDigit(pokemon.number, 3, "0"));
            FSP.MenuGrapher.addMenuDialog("PokedexListingInfo", pokemon.info[0], function () {
                FSP.MenuGrapher.createMenu("PokedexListingInfo");
                FSP.MenuGrapher.addMenuDialog("PokedexListingInfo", pokemon.info[1], function () {
                    FSP.MenuGrapher.deleteMenu("PokedexListing");
                    if (callback) {
                        callback();
                    }
                });
                FSP.MenuGrapher.setActiveMenu("PokedexListingInfo");
            });
            FSP.MenuGrapher.setActiveMenu("PokedexListingInfo");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.openPokemonMenu = function (settings) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), listings = FSP.ItemsHolder.getItem("PokemonInParty"), references = FSP.MathDecider.getConstant("pokemon");
            if (!listings || !listings.length) {
                return;
            }
            FSP.MenuGrapher.createMenu("Pokemon", settings);
            FSP.MenuGrapher.addMenuList("Pokemon", {
                "options": listings.map(function (listing, i) {
                    var sprite = references[listing.title.join("")].sprite + "Pokemon", barWidth = 25, health = FSP.MathDecider.compute("widthHealthBar", barWidth, listing.HP, listing.HPNormal);
                    return {
                        "text": listing.title,
                        "callback": FSP.openPokemonMenuContext.bind(FSP, {
                            "pokemon": listing
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.openItemsMenu = function (settings) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), items = settings.items || FSP.ItemsHolder.getItem("items");
            FSP.MenuGrapher.createMenu("Items", settings);
            FSP.MenuGrapher.addMenuList("Items", {
                "options": items.map(function (schema) {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.openPlayerMenu = function () {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this);
            FSP.MenuGrapher.createMenu("Player", {
                "callback": FSP.MenuGrapher.registerB.bind(FSP.MenuGrapher)
            });
            FSP.MenuGrapher.setActiveMenu("Player");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.openSaveMenu = function () {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this);
            FSP.MenuGrapher.createMenu("Save");
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", "Would you like to SAVE the game?");
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.openKeyboardMenu = function (settings) {
            if (settings === void 0) { settings = {}; }
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), value = [
                settings.value || ["_", "_", "_", "_", "_", "_", "_"]
            ], onKeyPress = FSP.addKeyboardMenuValue.bind(FSP), onBPress = FSP.removeKeyboardMenuValue.bind(FSP), onComplete = (settings.callback || onKeyPress).bind(FSP), lowercase = settings.lowercase, letters = lowercase
                ? FullScreenPokemon.keysLowercase
                : FullScreenPokemon.keysUppercase, options = letters.map(function (letter) {
                return {
                    "text": [letter],
                    "value": letter,
                    "callback": letter !== "ED"
                        ? onKeyPress
                        : onComplete
                };
            }), menuResults;
            FSP.MenuGrapher.createMenu("Keyboard", {
                "settings": settings,
                "onKeyPress": onKeyPress,
                "onComplete": onComplete,
                "ignoreB": false
            });
            menuResults = FSP.MenuGrapher.getMenu("KeyboardResult");
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
            menuResults.blinker = FSP.addThing("CharMDash", menuResults.children[menuResults.selectedChild].left, menuResults.children[menuResults.selectedChild].top);
            menuResults.children.push(menuResults.blinker);
            menuResults.children[menuResults.selectedChild].hidden = true;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.addKeyboardMenuValue = function () {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), menuKeys = FSP.MenuGrapher.getMenu("KeyboardKeys"), menuResult = FSP.MenuGrapher.getMenu("KeyboardResult"), child = menuResult.children[menuResult.selectedChild], selected = FSP.MenuGrapher.getMenuSelectedOption("KeyboardKeys");
            if (!child) {
                return;
            }
            FSP.killNormal(child);
            menuResult.children[menuResult.selectedChild] = FSP.addThing(selected.title, child.left, child.top);
            menuResult.displayedValue[menuResult.selectedChild] = selected.text[0];
            menuResult.completeValue.push(selected.value);
            menuResult.selectedChild += 1;
            if (menuResult.selectedChild < menuResult.children.length - 1) {
                child = menuResult.children[menuResult.selectedChild];
                child.hidden = true;
            }
            else {
                menuResult.blinker.hidden = true;
                FSP.MenuGrapher.setSelectedIndex("KeyboardKeys", menuKeys.gridColumns - 1, menuKeys.gridRows - 2); // assume there's a bottom option
            }
            FSP.setLeft(menuResult.blinker, child.left);
            FSP.setTop(menuResult.blinker, child.top);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.removeKeyboardMenuValue = function () {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), menuResult = FSP.MenuGrapher.getMenu("KeyboardResult"), child = menuResult.children[menuResult.selectedChild - 1];
            if (menuResult.selectedChild <= 0) {
                return;
            }
            menuResult.selectedChild -= 1;
            menuResult.completeValue = menuResult.completeValue.slice(0, menuResult.completeValue.length - 1);
            menuResult.displayedValue[menuResult.selectedChild] = "_";
            FSP.killNormal(child);
            child = menuResult.children[menuResult.selectedChild];
            menuResult.children[menuResult.selectedChild + 1] = FSP.addThing("CharUnderscore", child.right, child.top);
            FSP.setLeft(menuResult.blinker, child.left);
            FSP.setTop(menuResult.blinker, child.top);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.switchKeyboardCase = function () {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), keyboard = FSP.MenuGrapher.getMenu("Keyboard"), keyboardKeys = FSP.MenuGrapher.getMenu("KeyboardKeys"), keyboardResult = FSP.MenuGrapher.getMenu("KeyboardResult"), settings = keyboard.settings;
            settings.lowercase = !settings.lowercase;
            settings.value = keyboardResult.displayedValue;
            settings.selectedChild = keyboardResult.selectedChild;
            settings.displayedValue = keyboardResult.displayedValue;
            settings.completeValue = keyboardResult.completeValue;
            settings.selectedIndex = keyboardKeys.selectedIndex;
            FSP.openKeyboardMenu(settings);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.openTownMapMenu = function (settings) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), playerPosition = FSP.MathDecider.getConstant("townMapLocations")["Pallet Town"], playerSize = FSP.ObjectMaker.getFullPropertiesOf("Player");
            FSP.MenuGrapher.createMenu("Town Map", settings);
            FSP.MenuGrapher.createMenuThing("Town Map Inside", {
                "type": "thing",
                "thing": "Player",
                "args": {
                    "nocollide": true
                },
                "position": {
                    "offset": {
                        "left": playerPosition[0] - (playerSize.width / 2),
                        "top": playerPosition[1] - (playerSize.height / 2)
                    }
                }
            });
            FSP.MenuGrapher.setActiveMenu("Town Map");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.showTownMapFlyLocations = function () {
            console.warn("Map fly locations not implemented.");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.showTownMapPokemonLocations = function (title) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), dialog = [].slice.call(title);
            dialog.push.apply(dialog, "'s NEST".split(""));
            FSP.MenuGrapher.addMenuDialog("Town Map", [dialog]);
            console.warn("Pokemon map locations not implemented.");
        };
        /* Battles
        */
        /**
         *
         */
        FullScreenPokemon.prototype.startBattle = function (battleInfo) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), animations = battleInfo.animations || [
                // "LineSpiral", "Flash"
                "Flash"
            ], animation = FSP.NumberMaker.randomArrayMember(animations), player = battleInfo.player;
            if (!player) {
                battleInfo.player = player = {};
            }
            player.name = player.name || "%%%%%%%PLAYER%%%%%%%";
            player.sprite = player.sprite || "PlayerBack";
            player.category = player.category || "Trainer";
            player.actors = player.actors || FSP.ItemsHolder.getItem("PokemonInParty");
            player.hasActors = typeof player.hasActors === "undefined"
                ? true : player.hasActors;
            FSP.AudioPlayer.play(battleInfo.theme || "Battle Trainer");
            FSP["cutsceneBattleTransition" + animation](FSP, {
                "battleInfo": battleInfo,
                "callback": FSP.BattleMover.startBattle.bind(FSP.BattleMover, battleInfo)
            });
            FSP.moveBattleKeptThingsToText(FSP, battleInfo);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.collectBattleKeptThings = function (FSP, thingsRaw) {
            var things = [FSP.player], used = (_a = {},
                _a[FSP.player.title] = FSP.player,
                _a
            ), thing, i;
            for (i = 0; i < thingsRaw.length; i += 1) {
                thing = thingsRaw[i].constructor === String
                    ? FSP.getThingById(thingsRaw[i])
                    : thingsRaw[i];
                if (!used[thing.title]) {
                    used[thing.title] = thing;
                    things.push(thing);
                }
            }
            return things;
            var _a;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.moveBattleKeptThingsToText = function (FSP, battleInfo) {
            var keptThings = battleInfo.keptThings, i;
            if (!keptThings) {
                return;
            }
            for (i = 0; i < keptThings.length; i += 1) {
                FSP.GroupHolder.switchMemberGroup(keptThings[i], keptThings[i].groupType, "Text");
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.moveBattleKeptThingsBack = function (FSP, battleInfo) {
            var keptThings = battleInfo.keptThings, i;
            if (!keptThings) {
                return;
            }
            for (i = 0; i < keptThings.length; i += 1) {
                FSP.GroupHolder.switchMemberGroup(keptThings[i], "Text", keptThings[i].groupType);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.createPokemon = function (schema) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), level = typeof schema.levels !== "undefined"
                ? FSP.NumberMaker.randomArrayMember(schema.levels)
                : schema.level, pokemon = FSP.MathDecider.compute("newPokemon", schema.title, level);
            return pokemon;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.healPokemon = function (pokemon) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), moves = FSP.MathDecider.getConstant("moves"), statisticNames = FSP.MathDecider.getConstant("statisticNames"), i;
            for (i = 0; i < statisticNames.length; i += 1) {
                pokemon[statisticNames[i]] = pokemon[statisticNames[i] + "Normal"];
            }
            for (i = 0; i < pokemon.moves.length; i += 1) {
                pokemon.moves[i].remaining = moves[pokemon.moves[i].title].PP;
            }
            pokemon.status = "";
        };
        /**
         *
         */
        FullScreenPokemon.prototype.checkPlayerGrassBattle = function (thing) {
            if (!thing.grass || thing.FSP.MenuGrapher.getActiveMenu()) {
                return;
            }
            if (!thing.FSP.ThingHitter.checkHit(thing, thing.grass, thing.title, thing.grass.groupType)) {
                delete thing.grass;
                return;
            }
            if (!thing.FSP.MathDecider.compute("doesGrassEncounterHappen", thing.grass)) {
                return;
            }
            thing.keys = thing.getKeys();
            thing.FSP.animateGrassBattleStart(thing, thing.grass);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.chooseRandomWildPokemon = function (FSP, options) {
            var choice = FSP.NumberMaker.random(), sum = 0, i;
            for (i = 0; i < options.length; i += 1) {
                sum += options[i].rate;
                if (sum >= choice) {
                    return options[i];
                }
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.addBattleDisplayPokeballs = function (FSP, menu, battler, opposite) {
            var text = [], i;
            for (i = 0; i < battler.actors.length; i += 1) {
                text.push(["Ball"]);
            }
            for (; i < 6; i += 1) {
                text.push(["BallEmpty"]);
            }
            if (opposite) {
                text.reverse();
            }
            FSP.MenuGrapher.addMenuDialog(menu.name, [text]);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.addBattleDisplayPokemonHealth = function (FSP, battlerName) {
            var battleInfo = FSP.BattleMover.getBattleInfo(), pokemon = battleInfo[battlerName].selectedActor, menu = [
                "Battle",
                battlerName[0].toUpperCase(),
                battlerName.slice(1),
                "Health"
            ].join("");
            FSP.MenuGrapher.createMenu(menu);
            FSP.MenuGrapher.createMenu(menu + "Title");
            FSP.MenuGrapher.createMenu(menu + "Level");
            FSP.MenuGrapher.createMenu(menu + "Amount");
            FSP.setBattleDisplayPokemonHealthBar(FSP, battlerName, pokemon.HP, pokemon.HPNormal);
            FSP.MenuGrapher.addMenuDialog(menu + "Title", [[pokemon.nickname]]);
            FSP.MenuGrapher.addMenuDialog(menu + "Level", String(pokemon.level));
        };
        /**
         *
         *
         * @param {String} actor
         */
        FullScreenPokemon.prototype.setBattleDisplayPokemonHealthBar = function (FSP, battlerName, hp, hpNormal) {
            var nameUpper = battlerName[0].toUpperCase() + battlerName.slice(1), menuNumbers = "Battle" + nameUpper + "HealthNumbers", bar = FSP.getThingById("HPBarFill" + nameUpper), barWidth = FSP.MathDecider.compute("widthHealthBar", 25, hp, hpNormal), healthDialog = FSP.makeDigit(hp, 3, "\t") + "/" + FSP.makeDigit(hpNormal, 3, "\t");
            if (FSP.MenuGrapher.getMenu(menuNumbers)) {
                FSP.MenuGrapher.getMenu(menuNumbers).children.forEach(FSP.killNormal);
                FSP.MenuGrapher.addMenuDialog(menuNumbers, healthDialog);
            }
            FSP.setWidth(bar, barWidth);
            bar.hidden = barWidth === 0;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.animateBattleDisplayPokemonHealthBar = function (FSP, actorName, hpStart, hpEnd, hpNormal, callback) {
            var direction = hpStart > hpEnd ? -1 : 1, hpNew = Math.round(hpStart + direction);
            FSP.setBattleDisplayPokemonHealthBar(FSP, actorName, hpNew, hpNormal);
            if (hpNew === hpEnd) {
                if (callback) {
                    callback();
                }
                return;
            }
            FSP.TimeHandler.addEvent(FSP.animateBattleDisplayPokemonHealthBar, 2, FSP, actorName, hpNew, hpEnd, hpNormal, callback);
        };
        /* Cutscenes
        */
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleEntrance = function (FSP, settings) {
            var things = settings.things, battleInfo = settings.battleInfo, player = things.player, opponent = things.opponent, menu = FSP.MenuGrapher.getMenu("BattleDisplayInitial"), playerX, opponentX, playerGoal, opponentGoal, timeout = 70;
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
            FSP.animateFadeHorizontal(player, (playerGoal - playerX) / timeout, playerGoal, 1);
            FSP.animateFadeHorizontal(opponent, (opponentGoal - opponentX) / timeout, opponentGoal, 1);
            FSP.addPokemonToPokedex(FSP, battleInfo.opponent.actors[0].title, PokedexListingStatus.Seen);
            FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine("OpeningText"), timeout);
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleOpeningText = function (FSP, settings) {
            var battleInfo = settings.battleInfo, textStart = battleInfo.textStart, nextRoutine, callback;
            if (settings.battleInfo.opponent.hasActors) {
                nextRoutine = "EnemyIntro";
            }
            else {
                nextRoutine = "PlayerIntro";
            }
            if (battleInfo.automaticMenus) {
                callback = FSP.TimeHandler.addEvent.bind(FSP.TimeHandler, FSP.ScenePlayer.playRoutine.bind(FSP.ScenePlayer), 70, nextRoutine);
            }
            else {
                callback = FSP.ScenePlayer.bindRoutine(nextRoutine);
            }
            FSP.MenuGrapher.createMenu("BattlePlayerHealth");
            FSP.addBattleDisplayPokeballs(FSP, FSP.MenuGrapher.getMenu("BattlePlayerHealth"), battleInfo.player);
            if (battleInfo.opponent.hasActors) {
                FSP.MenuGrapher.createMenu("BattleOpponentHealth");
                FSP.addBattleDisplayPokeballs(FSP, FSP.MenuGrapher.getMenu("BattleOpponentHealth"), battleInfo.player, true);
            }
            else {
                FSP.addBattleDisplayPokemonHealth(FSP, "opponent");
            }
            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": battleInfo.automaticMenus
            });
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    textStart[0], battleInfo.opponent.name, textStart[1]
                ]
            ], callback);
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleEnemyIntro = function (FSP, settings) {
            var things = settings.things, opponent = things.opponent, menu = FSP.MenuGrapher.getMenu("GeneralText"), opponentX = FSP.getMidX(opponent), opponentGoal = menu.right + opponent.width * FSP.unitsize / 2, battleInfo = settings.battleInfo, callback = battleInfo.opponent.hasActors
                ? "OpponentSendOut"
                : "PlayerIntro", timeout = 49;
            FSP.animateFadeHorizontal(opponent, (opponentGoal - opponentX) / timeout, opponentGoal, 1);
            FSP.TimeHandler.addEvent(FSP.animateFadeAttribute, (timeout / 2) | 0, opponent, "opacity", -2 / timeout, 0, 1);
            FSP.MenuGrapher.deleteMenu("BattleOpponentHealth");
            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": true
            });
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    battleInfo.textOpponentSendOut[0],
                    battleInfo.opponent.name,
                    battleInfo.textOpponentSendOut[1],
                    battleInfo.opponent.actors[0].nickname,
                    battleInfo.textOpponentSendOut[2]
                ]
            ]);
            FSP.MenuGrapher.setActiveMenu("GeneralText");
            FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine(callback, {
                "nextRoutine": "PlayerIntro"
            }), timeout);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattlePlayerIntro = function (FSP, settings) {
            var things = settings.things, player = things.player, menu = FSP.MenuGrapher.getMenu("GeneralText"), playerX = FSP.getMidX(player), playerGoal = menu.left - player.width * FSP.unitsize / 2, battleInfo = settings.battleInfo, timeout = 24;
            FSP.MenuGrapher.deleteMenu("BattlePlayerHealth");
            if (!battleInfo.player.hasActors) {
                FSP.ScenePlayer.playRoutine("ShowPlayerMenu");
                return;
            }
            FSP.animateFadeHorizontal(player, (playerGoal - playerX) / timeout, playerGoal, 1);
            FSP.TimeHandler.addEvent(FSP.animateFadeAttribute, (timeout / 2) | 0, player, "opacity", -2 / timeout, 0, 1);
            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": true
            });
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    battleInfo.textPlayerSendOut[0],
                    battleInfo.player.actors[0].nickname,
                    battleInfo.textPlayerSendOut[1]
                ]
            ]);
            FSP.MenuGrapher.setActiveMenu("GeneralText");
            FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine("PlayerSendOut", {
                "nextRoutine": "ShowPlayerMenu"
            }), timeout);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleShowPlayerMenu = function (FSP, settings) {
            FSP.MenuGrapher.deleteMenu("Yes/No");
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.BattleMover.showPlayerMenu();
            if (settings.battleInfo.onShowPlayerMenu) {
                settings.battleInfo.onShowPlayerMenu(FSP);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleOpponentSendOut = function (FSP, settings, args) {
            var menu = settings.things.menu, left = menu.right - FSP.unitsize * 8, top = menu.top + FSP.unitsize * 32;
            console.warn("Should reset *Normal statistics for opponent Pokemon.");
            settings.opponentLeft = left;
            settings.opponentTop = top;
            FSP.MenuGrapher.setActiveMenu(undefined);
            FSP.animateSmokeSmall(FSP, left, top, FSP.ScenePlayer.bindRoutine("OpponentSendOutAppear", args));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleOpponentSendOutAppear = function (FSP, settings, args) {
            var opponentInfo = settings.battleInfo.opponent, pokemonInfo = opponentInfo.actors[opponentInfo.selectedIndex], pokemon = FSP.BattleMover.setThing("opponent", pokemonInfo.title.join("") + "Front");
            console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);
            FSP.addBattleDisplayPokemonHealth(FSP, "opponent");
            FSP.addPokemonToPokedex(FSP, pokemonInfo.title, PokedexListingStatus.Seen);
            FSP.ScenePlayer.playRoutine(args.nextRoutine);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattlePlayerSendOut = function (FSP, settings, args) {
            var menu = settings.things.menu, left = menu.left + FSP.unitsize * 8, top = menu.bottom - FSP.unitsize * 8;
            console.warn("Should reset *Normal statistics for player Pokemon.");
            settings.playerLeft = left;
            settings.playerTop = top;
            FSP.MenuGrapher.setActiveMenu(undefined);
            FSP.animateSmokeSmall(FSP, left, top, FSP.ScenePlayer.bindRoutine("PlayerSendOutAppear", args));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattlePlayerSendOutAppear = function (FSP, settings, args) {
            var playerInfo = settings.battleInfo.player, pokemonInfo = playerInfo.selectedActor, pokemon = FSP.BattleMover.setThing("player", pokemonInfo.title.join("") + "Back");
            console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);
            FSP.addBattleDisplayPokemonHealth(FSP, "player");
            FSP.MenuGrapher.createMenu("BattlePlayerHealthNumbers");
            FSP.setBattleDisplayPokemonHealthBar(FSP, "Player", pokemonInfo.HP, pokemonInfo.HPNormal);
            FSP.ScenePlayer.playRoutine(args.nextRoutine);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattlePlayerSwitchesSamePokemon = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText", {
                "backMenu": "PokemonMenuContext"
            });
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                settings.battleInfo.player.selectedActor.nickname, " is already out!"
            ]);
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleMovePlayer = function (FSP, settings, args) {
            var player = settings.battleInfo.player, playerActor = player.selectedActor, opponent = settings.battleInfo.opponent, opponentActor = opponent.selectedActor, choice = args.choicePlayer;
            args.damage = FSP.MathDecider.compute("damage", choice, playerActor, opponentActor);
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    playerActor.nickname, " used ", choice + "!"
                ]
            ], FSP.ScenePlayer.bindRoutine("MovePlayerAnimate", args));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleMovePlayerAnimate = function (FPS, settings, args) {
            var choice = args.choicePlayer, move = FPS.MathDecider.getConstant("moves")[choice];
            console.log("Should do something with", move);
            args.attackerName = "player";
            args.defenderName = "opponent";
            args.callback = function () {
                var callback;
                args.movePlayerDone = true;
                if (args.moveOpponentDone) {
                    callback = function () {
                        args.movePlayerDone = false;
                        args.moveOpponentDone = false;
                        FPS.MenuGrapher.createMenu("GeneralText");
                        FPS.BattleMover.showPlayerMenu();
                    };
                }
                else {
                    callback = FPS.TimeHandler.addEvent.bind(FPS.TimeHandler, FPS.ScenePlayer.bindRoutine("MoveOpponent", args), 7);
                }
                FPS.ScenePlayer.playRoutine("Damage", {
                    "battlerName": "opponent",
                    "damage": args.damage,
                    "callback": callback
                });
            };
            // @todo: When all moves have been implemented, this will be simplified.
            if (!FPS.ScenePlayer.getOtherRoutine("Attack" + choice)) {
                console.warn(choice + " attack animation not implemented...");
                args.callback();
            }
            else {
                FPS.ScenePlayer.playRoutine("Attack" + choice.replace(" ", ""), args);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleMoveOpponent = function (FSP, settings, args) {
            var opponent = settings.battleInfo.opponent, opponentActor = opponent.selectedActor, player = settings.battleInfo.player, playerActor = player.selectedActor, choice = args.choiceOpponent;
            args.damage = FSP.MathDecider.compute("damage", choice, opponentActor, playerActor);
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    opponent.selectedActor.nickname, " used ", choice + "!"
                ]
            ], FSP.ScenePlayer.bindRoutine("MoveOpponentAnimate", args));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleMoveOpponentAnimate = function (FSP, settings, args) {
            var choice = args.choiceOpponent, move = FSP.MathDecider.getConstant("moves")[choice];
            console.log("Should do something with", move);
            args.attackerName = "opponent";
            args.defenderName = "player";
            args.callback = function () {
                var callback;
                args.moveOpponentDone = true;
                if (args.movePlayerDone) {
                    callback = function () {
                        args.movePlayerDone = false;
                        args.moveOpponentDone = false;
                        FSP.MenuGrapher.createMenu("GeneralText");
                        FSP.BattleMover.showPlayerMenu();
                    };
                }
                else {
                    callback = FSP.TimeHandler.addEvent.bind(FSP.TimeHandler, FSP.ScenePlayer.bindRoutine("MovePlayer", args), 7);
                }
                FSP.ScenePlayer.playRoutine("Damage", {
                    "battlerName": "player",
                    "damage": args.damage,
                    "callback": callback
                });
            };
            // @todo: When all moves have been implemented, this will be simplified.
            if (!FSP.ScenePlayer.getOtherRoutine("Attack" + choice)) {
                console.warn(choice + " attack animation not implemented...");
                args.callback();
            }
            else {
                FSP.ScenePlayer.playRoutine("Attack" + choice.replace(" ", ""), args);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleDamage = function (FSP, settings, args) {
            var battlerName = args.battlerName, damage = args.damage, battleInfo = FSP.BattleMover.getBattleInfo(), battler = battleInfo[battlerName], actor = battler.selectedActor, hpStart = actor.HP, hpEnd = Math.max(hpStart - damage, 0), callback = hpEnd === 0
                ? FSP.TimeHandler.addEvent.bind(FSP.TimeHandler, FSP.ScenePlayer.bindRoutine("PokemonFaints", {
                    "battlerName": battlerName
                }), 49)
                : args.callback;
            if (damage !== 0) {
                FSP.animateBattleDisplayPokemonHealthBar(FSP, battlerName, hpStart, hpEnd, actor.HPNormal, callback);
                actor.HP = hpEnd;
            }
            else {
                callback(FSP);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattlePokemonFaints = function (FSP, settings, args) {
            var battlerName = args.battlerName, battleInfo = FSP.BattleMover.getBattleInfo(), actor = battleInfo[battlerName].selectedActor, thing = settings.things[battlerName], blank = FSP.ObjectMaker.make("WhiteSquare", {
                "width": thing.width * thing.scale,
                "height": thing.height * thing.scale
            }), texts = FSP.GroupHolder.getGroup("Text"), background = FSP.BattleMover.getBackgroundThing(), backgroundIndex = texts.indexOf(background), nextRoutine = battlerName === "player"
                ? "AfterPlayerPokemonFaints" : "AfterOpponentPokemonFaints";
            FSP.addThing(blank, thing.left, thing.top + thing.height * thing.scale * thing.FSP.unitsize);
            FSP.arrayToIndex(blank, texts, backgroundIndex + 1);
            FSP.arrayToIndex(thing, texts, backgroundIndex + 1);
            FSP.animateFadeVertical(thing, FSP.unitsize * 2, FSP.getMidY(thing) + thing.height * thing.scale * FSP.unitsize, 1, function () {
                FSP.killNormal(thing);
                FSP.killNormal(blank);
                FSP.MenuGrapher.createMenu("GeneralText");
                FSP.MenuGrapher.addMenuDialog("GeneralText", [
                    [
                        actor.nickname, " fainted!"
                    ]
                ], FSP.ScenePlayer.bindRoutine(nextRoutine, args));
                FSP.MenuGrapher.setActiveMenu("GeneralText");
            });
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleAfterPlayerPokemonFaints = function (FSP, settings) {
            var battleInfo = FSP.BattleMover.getBattleInfo(), actorAvailable = FSP.checkArrayMembersIndex(battleInfo.player.actors, "HP");
            if (actorAvailable) {
                FSP.ScenePlayer.playRoutine("PlayerChoosesPokemon");
            }
            else {
                FSP.ScenePlayer.playRoutine("Defeat");
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleAfterOpponentPokemonFaints = function (FSP, settings) {
            var battleInfo = settings.battleInfo, opponent = battleInfo.opponent, actorAvailable = FSP.checkArrayMembersIndex(opponent.actors, "HP"), experienceGained = FSP.MathDecider.compute("experienceGained", battleInfo.player, battleInfo.opponent), callback;
            if (actorAvailable) {
                callback = FSP.ScenePlayer.bindRoutine("OpponentSwitchesPokemon");
            }
            else {
                callback = FSP.ScenePlayer.bindRoutine("Victory");
            }
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    battleInfo.player.selectedActor.nickname,
                    " gained ",
                    experienceGained.toString(),
                    " EXP. points!"
                ]
            ], FSP.ScenePlayer.bindRoutine("ExperienceGain", {
                "experienceGained": experienceGained,
                "callback": callback
            }));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleOpponentSwitchesPokemon = function (FSP, settings) {
            var battleInfo = settings.battleInfo, opponent = battleInfo.opponent, nicknameExclaim = opponent.selectedActor.nickname.slice();
            nicknameExclaim.push("!");
            FSP.BattleMover.switchActor("opponent", opponent.selectedIndex + 1);
            opponent.selectedIndex += 1;
            opponent.selectedActor = opponent.actors[opponent.selectedIndex];
            FSP.MenuGrapher.createMenu("GeneralText", {
                "deleteOnFinish": false
            });
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                opponent.name,
                "is about to use",
                nicknameExclaim,
                "Will %%%%%%%PLAYER%%%%%%% change %%%%%%%POKEMON%%%%%%%?"
            ], function () {
                FSP.MenuGrapher.createMenu("Yes/No");
                FSP.MenuGrapher.addMenuList("Yes/No", {
                    "options": [
                        {
                            "text": "Yes",
                            "callback": FSP.ScenePlayer.bindRoutine("PlayerSwitchesPokemon", {
                                "nextRoutine": "OpponentSendOut"
                            })
                        }, {
                            "text": "No",
                            "callback": FSP.ScenePlayer.bindRoutine("OpponentSendOut", {
                                "nextRoutine": "ShowPlayerMenu"
                            })
                        }]
                });
                FSP.MenuGrapher.setActiveMenu("Yes/No");
            });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleExperienceGain = function (FSP, settings, args) {
            var battleInfo = settings.battleInfo, gains = args.experienceGained, actor = battleInfo.player.selectedActor, experience = actor.experience;
            console.warn("Experience gain is hardcoded to the current actor...");
            experience.current += gains;
            experience.remaining -= gains;
            if (experience.remaining < 0) {
                gains -= experience.remaining;
                FSP.ScenePlayer.playRoutine("LevelUp", {
                    "experienceGained": gains,
                    "callback": args.callback
                });
            }
            else {
                args.callback();
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleLevelUp = function (FSP, settings, args) {
            var battleInfo = settings.battleInfo, 
            // gains: number = args.experienceGained,
            actor = battleInfo.player.selectedActor;
            actor.level += 1;
            actor.experience = FSP.MathDecider.compute("newPokemonExperience", actor.title, actor.level);
            console.warn("Leveling up does not yet increase stats...");
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    actor.nickname,
                    " grew to level ",
                    actor.level.toString(),
                    "!"
                ]
            ], FSP.ScenePlayer.bindRoutine("LevelUpStats", args));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleLevelUpStats = function (FSP, settings, args) {
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
                "onMenuDelete": args.callback
            });
            FSP.MenuGrapher.setActiveMenu("LevelUpStats");
            console.warn("For stones, LevelUpStats should be taken out of battles.");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattlePlayerChoosesPokemon = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("Pokemon", {
                "position": {
                    "vertical": "center",
                    "offset": {
                        "left": 0
                    }
                }
            });
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleExitFail = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", "No! There's no running from a trainer battle!", FSP.ScenePlayer.bindRoutine("BattleExitFailReturn"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleExitFailReturn = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.BattleMover.showPlayerMenu();
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleVictory = function (FSP, settings) {
            var battleInfo = FSP.BattleMover.getBattleInfo(), opponent = battleInfo.opponent;
            if (FSP.MapScreener.theme) {
                FSP.AudioPlayer.play(FSP.MapScreener.theme);
            }
            if (!opponent.hasActors) {
                FSP.BattleMover.closeBattle(function () {
                    FSP.animateFadeFromColor(FSP, {
                        "color": "White"
                    });
                });
                return;
            }
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    "%%%%%%%PLAYER%%%%%%% defeated ",
                    opponent.name,
                    "!"
                ]
            ], FSP.ScenePlayer.bindRoutine("VictorySpeech"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleVictorySpeech = function (FSP, settings) {
            var battleInfo = settings.battleInfo, menu = FSP.MenuGrapher.getMenu("BattleDisplayInitial"), opponent = FSP.BattleMover.setThing("opponent", battleInfo.opponent.sprite), timeout = 35, opponentX, opponentGoal;
            opponent.opacity = 0;
            FSP.setTop(opponent, menu.top);
            FSP.setLeft(opponent, menu.right);
            opponentX = FSP.getMidX(opponent);
            opponentGoal = menu.right - opponent.width * FSP.unitsize / 2;
            FSP.animateFadeAttribute(opponent, "opacity", 4 / timeout, 1, 1);
            FSP.animateFadeHorizontal(opponent, (opponentGoal - opponentX) / timeout, opponentGoal, 1, function () {
                FSP.MenuGrapher.createMenu("GeneralText");
                FSP.MenuGrapher.addMenuDialog("GeneralText", battleInfo.textVictory, FSP.ScenePlayer.bindRoutine("VictoryWinnings"));
                FSP.MenuGrapher.setActiveMenu("GeneralText");
            });
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleVictoryWinnings = function (FSP, settings) {
            var battleInfo = settings.battleInfo, reward = settings.battleInfo.opponent.reward, animationSettings = {
                "color": "White"
            }, callback = function () {
                FSP.BattleMover.closeBattle(function () {
                    FSP.animateFadeFromColor(FSP, animationSettings);
                });
            };
            if (battleInfo.giftAfterBattle) {
                FSP.addItemToBag(FSP, battleInfo.giftAfterBattle, battleInfo.giftAfterBattleAmount || 1);
            }
            if (battleInfo.badge) {
                FSP.ItemsHolder.getItem("badges")[battleInfo.badge] = true;
            }
            if (battleInfo.textAfterBattle) {
                animationSettings.callback = function () {
                    FSP.MenuGrapher.createMenu("GeneralText");
                    FSP.MenuGrapher.addMenuDialog("GeneralText", battleInfo.textAfterBattle);
                    FSP.MenuGrapher.setActiveMenu("GeneralText");
                };
            }
            if (!reward) {
                callback();
                return;
            }
            FSP.ItemsHolder.increase("money", reward);
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "%%%%%%%PLAYER%%%%%%% got $" + reward + " for winning!"
            ], callback);
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleDefeat = function (FSP, settings) {
            var battleInfo = settings.battleInfo, message = [
                "%%%%%%%PLAYER%%%%%%% is out of useable %%%%%%%POKEMON%%%%%%%!"
            ], callback;
            if (!battleInfo.noBlackout) {
                message.push("%%%%%%%PLAYER%%%%%%% blacked out!");
                callback = function () {
                    var transport = FSP.ItemsHolder.getItem("lastPokecenter");
                    FSP.BattleMover.closeBattle();
                    FSP.setMap(transport.map, transport.location);
                    FSP.ItemsHolder.getItem("PokemonInParty").forEach(FSP.healPokemon.bind(FSP));
                };
            }
            else {
                callback = function () {
                    FSP.BattleMover.closeBattle();
                };
            }
            if (FSP.MapScreener.theme) {
                FSP.AudioPlayer.play(FSP.MapScreener.theme);
            }
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", message, FSP.animateFadeToColor.bind(FSP, FSP, {
                "color": "Black",
                "callback": function () {
                    callback();
                }
            }));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleComplete = function (FSP, settings) {
            FSP.MapScreener.blockInputs = false;
            FSP.moveBattleKeptThingsBack(FSP, settings.battleInfo);
            FSP.ItemsHolder.setItem("PokemonInParty", settings.battleInfo.player.actors);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleTransitionLineSpiral = function (FSP, settings) {
            var unitsize = FSP.unitsize, divisor = settings.divisor || 15, screenWidth = FSP.MapScreener.width, screenHeight = FSP.MapScreener.height, width = Math.ceil(screenWidth / divisor), height = Math.ceil(screenHeight / divisor), numTimes = 0, direction = 2, things = [], thing, difference, destination;
            /**
             * Yes, an inline Function. It makes things easier by calling itself
             * a bunch of times.
             */
            function addLineSpiralThing() {
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
                        FSP.addThing(thing, screenWidth - ((numTimes + 1) * width), screenHeight - ((numTimes + 1) * divisor));
                        difference = -height;
                        destination = numTimes * height;
                        break;
                    case 1:
                        thing = FSP.ObjectMaker.make("BlackSquare", {
                            "width": screenWidth / unitsize,
                            "height": height / unitsize
                        });
                        FSP.addThing(thing, numTimes * divisor - screenWidth, screenHeight - (numTimes + 1) * height);
                        difference = width;
                        destination = screenWidth - numTimes * width;
                        break;
                    case 2:
                        thing = FSP.ObjectMaker.make("BlackSquare", {
                            "width": width / unitsize,
                            "height": screenHeight / unitsize
                        });
                        FSP.addThing(thing, numTimes * width, numTimes * height - screenHeight);
                        difference = height;
                        destination = screenHeight - numTimes * height;
                        break;
                    case 3:
                        thing = FSP.ObjectMaker.make("BlackSquare", {
                            "width": screenWidth / unitsize,
                            "height": height / unitsize
                        });
                        FSP.addThing(thing, screenWidth - numTimes * divisor, numTimes * height);
                        difference = -width;
                        destination = numTimes * width;
                        break;
                    default:
                        throw new Error("Unknown direction: " + direction + ".");
                }
                things.push(thing);
                FSP.moveBattleKeptThingsToText(FSP, settings.battleInfo);
                FSP.TimeHandler.addEventInterval(function () {
                    if (direction % 2 === 1) {
                        FSP.shiftHoriz(thing, difference);
                    }
                    else {
                        FSP.shiftVert(thing, difference);
                    }
                    if (direction === 1 || direction === 2) {
                        if (thing[FullScreenPokemon_1.DirectionAliases[direction]] < destination) {
                            return false;
                        }
                    }
                    else {
                        if (thing[FullScreenPokemon_1.DirectionAliases[direction]] > destination) {
                            return false;
                        }
                    }
                    direction = (direction + 3) % 4;
                    if (direction === 2) {
                        numTimes += 1;
                    }
                    addLineSpiralThing();
                    FSP.moveBattleKeptThingsToText(FSP, settings);
                    return true;
                }, 1, Infinity);
            }
            addLineSpiralThing();
        };
        /**
         *
         *
         * @remarks Three [black, white] flashes, then the spiral
         */
        FullScreenPokemon.prototype.cutsceneBattleTransitionFlash = function (FSP, settings) {
            var flashes = settings.flashes || 6, flashColors = settings.flashColors || ["Black", "White"], callback = settings.callback, change = settings.change || .33, speed = settings.speed || 1, completed = 0, color, repeater = function () {
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
                    "callback": FSP.animateFadeFromColor.bind(FSP, FSP, {
                        "color": color,
                        "change": change,
                        "speed": speed,
                        "callback": repeater
                    })
                });
                FSP.moveBattleKeptThingsToText(FSP, settings.battleInfo);
            };
            repeater();
        };
        /**
         *
         *
         * I think the way to do this would be to treat each quarter of the screen
         * as one section. Divide each section into 10 parts. On each interval
         * increase the maximum the parts can be, while each part is a fraction of
         * the maximum, rounded to a large amount to appear pixellated (perhaps,
         * unitsize * 32?).
         */
        FullScreenPokemon.prototype.cutsceneBattleTransitionTwist = function (FSP, settings) {
            throw new Error("Not yet implemented.");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleTransitionFlashTwist = function (FSP, settings) {
            FSP.cutsceneBattleTransitionFlash(FSP, {
                "callback": FSP.cutsceneBattleTransitionTwist.bind(FSP, FSP, settings)
            });
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleChangeStatistic = function (FSP, settings, args) {
            var battleInfo = settings.battleInfo, defenderName = args.defenderName, defender = battleInfo[defenderName].selectedActor, defenderLabel = defenderName === "opponent"
                ? "Enemy " : "", statistic = args.statistic, amount = args.amount, amountLabel;
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
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    defenderLabel,
                    defender.nickname,
                    "'s ",
                    statistic.toUpperCase(),
                    " " + amountLabel + "!"
                ]
            ], args.callback);
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /* Battle attack animations
        */
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleAttackGrowl = function (FSP, settings, args) {
            var battleInfo = settings.battleInfo, attackerName = args.attackerName, defenderName = args.defenderName, attacker = FSP.BattleMover.getThing(attackerName), defender = FSP.BattleMover.getThing(defenderName), direction = attackerName === "player" ? 1 : -1, notes = [
                FSP.ObjectMaker.make("Note"),
                FSP.ObjectMaker.make("Note")
            ];
            console.log("Should do something with", notes, direction, defender, attacker, battleInfo);
            FSP.ScenePlayer.playRoutine("ChangeStatistic", FSP.proliferate({
                "callback": args.callback,
                "defenderName": defenderName,
                "statistic": "Attack",
                "amount": -1
            }, args));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleAttackTackle = function (FSP, settings, args) {
            var attackerName = args.attackerName, defenderName = args.defenderName, attacker = FSP.BattleMover.getThing(attackerName), defender = FSP.BattleMover.getThing(defenderName), direction = attackerName === "player" ? 1 : -1, xvel = 7 * direction, dt = 7, movement = FSP.TimeHandler.addEventInterval(function () {
                FSP.shiftHoriz(attacker, xvel);
            }, 1, Infinity);
            FSP.TimeHandler.addEvent(function () {
                xvel *= -1;
            }, dt);
            FSP.TimeHandler.addEvent(FSP.TimeHandler.cancelEvent, dt * 2 - 1, movement);
            if (attackerName === "player") {
                FSP.TimeHandler.addEvent(FSP.animateFlicker, dt * 2, defender, 14, 5, args.callback);
            }
            else {
                FSP.TimeHandler.addEvent(FSP.animateScreenShake, dt * 2, FSP, 0, undefined, undefined, undefined, FSP.animateFlicker.bind(FSP, defender, 14, 5, args.callback));
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneBattleAttackTailWhip = function (FSP, settings, args) {
            var attackerName = args.attackerName, defenderName = args.defenderName, attacker = FSP.BattleMover.getThing(attackerName), direction = attackerName === "player" ? 1 : -1, dt = 11, dx = FSP.unitsize * 4;
            FSP.shiftHoriz(attacker, dx * direction);
            FSP.TimeHandler.addEvent(FSP.shiftHoriz, dt, attacker, -dx * direction);
            FSP.TimeHandler.addEvent(FSP.shiftHoriz, dt * 2, attacker, dx * direction);
            FSP.TimeHandler.addEvent(FSP.shiftHoriz, dt * 3, attacker, -dx * direction);
            FSP.TimeHandler.addEvent(FSP.animateScreenShake, (dt * 3.5) | 0, FSP, 3, 0, 6, undefined, FSP.ScenePlayer.bindRoutine("ChangeStatistic", {
                "callback": args.callback,
                "defenderName": defenderName,
                "statistic": "Defense",
                "amount": -1
            }));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneTrainerSpottedExclamation = function (FSP, settings) {
            FSP.animateCharacterPreventWalking(FSP.player);
            FSP.animateExclamation(settings.triggerer, 70, FSP.ScenePlayer.bindRoutine("Approach"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneTrainerSpottedApproach = function (FSP, settings) {
            var player = settings.player, triggerer = settings.triggerer, direction = triggerer.direction, directionName = Direction[direction].toLowerCase(), locationTriggerer = triggerer[directionName], locationPlayer = player[FullScreenPokemon_1.DirectionOpposites[directionName]], distance = Math.abs(locationTriggerer - locationPlayer), blocks = Math.max(0, distance / FSP.unitsize / 8);
            if (blocks) {
                FSP.animateCharacterStartWalking(triggerer, direction, [
                    blocks,
                    FSP.ScenePlayer.bindRoutine("Dialog")
                ]);
            }
            else {
                FSP.ScenePlayer.playRoutine("Dialog");
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneTrainerSpottedDialog = function (FSP, settings) {
            FSP.collideCharacterDialog(settings.player, settings.triggerer);
            FSP.MapScreener.blockInputs = false;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeCenterWelcome = function (FSP, settings) {
            settings.nurse = FSP.getThingById(settings.nurseId || "Nurse");
            settings.machine = FSP.getThingById(settings.machineId || "HealingMachine");
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Welcome to our %%%%%%%POKEMON%%%%%%% CENTER!",
                "We heal your %%%%%%%POKEMON%%%%%%% back to perfect health!",
                "Shall we heal your %%%%%%%POKEMON%%%%%%%?"
            ], FSP.ScenePlayer.bindRoutine("Choose"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeCenterChoose = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("Heal/Cancel");
            FSP.MenuGrapher.addMenuList("Heal/Cancel", {
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
            });
            FSP.MenuGrapher.setActiveMenu("Heal/Cancel");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeCenterChooseHeal = function (FSP, settings) {
            FSP.MenuGrapher.deleteMenu("Heal/Cancel");
            FSP.MenuGrapher.createMenu("GeneralText", {
                "ignoreA": true,
                "finishAutomatically": true
            });
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Ok. We'll need your %%%%%%%POKEMON%%%%%%%."
            ], FSP.ScenePlayer.bindRoutine("Healing"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeCenterHealing = function (FSP, settings) {
            var party = FSP.ItemsHolder.getItem("PokemonInParty"), balls = [], dt = 35, left = settings.machine.left + 5 * FSP.unitsize, top = settings.machine.top + 7 * FSP.unitsize, i = 0;
            settings.balls = balls;
            FSP.animateCharacterSetDirection(settings.nurse, 3);
            FSP.TimeHandler.addEventInterval(function () {
                balls.push(FSP.addThing("HealingMachineBall", left + (i % 2) * 3 * FSP.unitsize, top + Math.floor(i / 2) * 2.5 * FSP.unitsize));
                i += 1;
            }, dt, party.length);
            FSP.TimeHandler.addEvent(FSP.ScenePlayer.playRoutine.bind(FSP.ScenePlayer), dt * (party.length + 1), "HealingAction", {
                "balls": balls
            });
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeCenterHealingAction = function (FSP, settings, args) {
            var balls = args.balls, numFlashes = 8, i = 0, changer, j;
            FSP.TimeHandler.addEventInterval(function () {
                changer = i % 2 === 0
                    ? FSP.addClass
                    : FSP.removeClass;
                for (j = 0; j < balls.length; j += 1) {
                    changer(balls[j], "lit");
                }
                changer(settings.machine, "lit");
                i += 1;
            }, 21, numFlashes);
            FSP.TimeHandler.addEvent(FSP.ScenePlayer.playRoutine.bind(FSP.ScenePlayer), (numFlashes + 2) * 21, "HealingComplete", {
                "balls": balls
            });
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeCenterHealingComplete = function (FSP, settings, args) {
            var balls = args.balls, party = FSP.ItemsHolder.getItem("PokemonInParty");
            balls.forEach(FSP.killNormal.bind(FSP));
            party.forEach(FSP.healPokemon.bind(FSP));
            FSP.animateCharacterSetDirection(settings.nurse, 2);
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Thank you! \n Your %%%%%%%POKEMON%%%%%%% are fighting fit!",
                "We hope to see you again!"
            ], function () {
                FSP.MenuGrapher.deleteMenu("GeneralText");
                FSP.ScenePlayer.stopCutscene();
            });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeCenterChooseCancel = function (FSP, settings) {
            FSP.MenuGrapher.deleteMenu("Heal/Cancel");
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "We hope to see you again!"
            ], function () {
                FSP.MenuGrapher.deleteMenu("GeneralText");
                FSP.ScenePlayer.stopCutscene();
            });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeMartGreeting = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": true,
                "ignoreA": true,
                "ignoreB": true
            });
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Hi there! \n May I help you?"
            ], FSP.ScenePlayer.bindRoutine("Options"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeMartOptions = function (FSP, settings) {
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
        };
        /**
         *
         *
         * @todo Add constants for all items, for display names
         */
        FullScreenPokemon.prototype.cutscenePokeMartBuyMenu = function (FSP, settings) {
            var options = settings.triggerer.items.map(function (reference) {
                var text = reference.item.toUpperCase(), cost = reference.cost;
                return {
                    "text": text,
                    "textsFloating": [{
                            "text": "$" + cost,
                            "x": 42 - String(cost).length * 3.5,
                            "y": 4
                        }],
                    "callback": FSP.ScenePlayer.bindRoutine("SelectAmount", {
                        "reference": reference,
                        "amount": 1,
                        "cost": cost
                    }),
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
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Take your time."
            ], function () {
                FSP.MenuGrapher.createMenu("ShopItems", {
                    "backMenu": "Buy/Sell"
                });
                FSP.MenuGrapher.addMenuList("ShopItems", {
                    "options": options
                });
                FSP.MenuGrapher.setActiveMenu("ShopItems");
            });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeMartSelectAmount = function (FSP, settings, args) {
            var reference = args.reference, amount = args.amount, cost = args.cost, costTotal = cost * amount, text = FSP.makeDigit(amount, 2) + FSP.makeDigit("$" + costTotal, 8, " ");
            FSP.MenuGrapher.createMenu("ShopItemsAmount", {
                "childrenSchemas": [
                    {
                        "type": "text",
                        "words": ["Times"],
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
                "onUp": FSP.ScenePlayer.bindRoutine("SelectAmount", {
                    "amount": (amount === 99) ? 1 : amount + 1,
                    "cost": cost,
                    "reference": reference
                }),
                "onDown": FSP.ScenePlayer.bindRoutine("SelectAmount", {
                    "amount": (amount === 1) ? 99 : amount - 1,
                    "cost": cost,
                    "reference": reference
                }),
                "callback": FSP.ScenePlayer.bindRoutine("ConfirmPurchase", args)
            });
            FSP.MenuGrapher.setActiveMenu("ShopItemsAmount");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeMartConfirmPurchase = function (FSP, settings, args) {
            var reference = args.reference, cost = args.cost, amount = args.amount, costTotal = args.costTotal = cost * amount;
            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": true
            });
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                reference.item.toUpperCase() + "? \n That will be $" + costTotal + ". OK?"
            ], function () {
                FSP.MenuGrapher.createMenu("Yes/No", {
                    "position": {
                        "horizontal": "right",
                        "vertical": "bottom",
                        "offset": {
                            "top": 0,
                            "left": 0
                        }
                    },
                    "onMenuDelete": FSP.ScenePlayer.bindRoutine("CancelPurchase"),
                    "container": "ShopItemsAmount"
                });
                FSP.MenuGrapher.addMenuList("Yes/No", {
                    "options": [
                        {
                            "text": "YES",
                            "callback": FSP.ScenePlayer.bindRoutine("TryPurchase", args)
                        }, {
                            "text": "NO",
                            "callback": FSP.ScenePlayer.bindRoutine("CancelPurchase")
                        }]
                });
                FSP.MenuGrapher.setActiveMenu("Yes/No");
            });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         *
         * @todo Why is the BuyMenu text appearing twice?
         */
        FullScreenPokemon.prototype.cutscenePokeMartCancelPurchase = function (FSP, settings) {
            FSP.ScenePlayer.playRoutine("BuyMenu");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeMartTryPurchase = function (FSP, settings, args) {
            var costTotal = args.costTotal;
            if (FSP.ItemsHolder.getItem("money") < costTotal) {
                FSP.ScenePlayer.playRoutine("FailPurchase", args);
                return;
            }
            FSP.ItemsHolder.decrease("money", args.costTotal);
            FSP.MenuGrapher.createMenu("Money");
            FSP.ItemsHolder.getItem("items").push({
                "item": args.reference.item,
                "amount": args.amount
            });
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Here you are! \n Thank you!"
            ], FSP.ScenePlayer.bindRoutine("ContinueShopping"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeMartFailPurchase = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "You don't have enough money."
            ], FSP.ScenePlayer.bindRoutine("ContinueShopping"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeMartContinueShopping = function (FSP, settings) {
            if (FSP.MenuGrapher.getMenu("Yes/No")) {
                delete FSP.MenuGrapher.getMenu("Yes/No").onMenuDelete;
            }
            FSP.MenuGrapher.deleteMenu("ShopItems");
            FSP.MenuGrapher.deleteMenu("ShopItemsAmount");
            FSP.MenuGrapher.deleteMenu("Yes/No");
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Is there anything else I can do?"
            ]);
            FSP.MenuGrapher.setActiveMenu("Buy/Sell");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutscenePokeMartExit = function (FSP, settings) {
            FSP.ScenePlayer.stopCutscene();
            FSP.MenuGrapher.deleteMenu("Buy/Sell");
            FSP.MenuGrapher.deleteMenu("Money");
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Thank you!"
            ], FSP.MenuGrapher.deleteActiveMenu);
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroFadeIn = function (FSP, settings) {
            var oak = FSP.ObjectMaker.make("OakPortrait", {
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
            FSP.TimeHandler.addEvent(FSP.animateFadeAttribute, 70, oak, "opacity", .15, 1, 14, FSP.ScenePlayer.bindRoutine("FirstDialog"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroFirstDialog = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Hello there! \n Welcome to the world of %%%%%%%POKEMON%%%%%%%!",
                "My name is OAK! People call me the %%%%%%%POKEMON%%%%%%% PROF!"
            ], FSP.ScenePlayer.bindRoutine("FirstDialogFade"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroFirstDialogFade = function (FSP, settings) {
            var blank = FSP.ObjectMaker.make("WhiteSquare", {
                "width": FSP.MapScreener.width,
                "height": FSP.MapScreener.height,
                "opacity": 0
            });
            FSP.addThing(blank, 0, 0);
            FSP.TimeHandler.addEvent(FSP.animateFadeAttribute, 35, blank, "opacity", .15, 1, 7, FSP.ScenePlayer.bindRoutine("PokemonExpo"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroPokemonExpo = function (FSP, settings) {
            var pokemon = FSP.ObjectMaker.make("NIDORINOFront", {
                "flipHoriz": true,
                "opacity": .01
            });
            FSP.GroupHolder.applyOnAll(FSP, FSP.killNormal);
            FSP.addThing(pokemon, (FSP.MapScreener.middleX + 24 * FSP.unitsize) | 0, 0);
            FSP.setMidY(pokemon, FSP.MapScreener.middleY);
            FSP.animateFadeAttribute(pokemon, "opacity", .15, 1, 3);
            FSP.animateFadeHorizontal(pokemon, -FSP.unitsize * 2, FSP.MapScreener.middleX | 0, 1, FSP.ScenePlayer.bindRoutine("PokemonExplanation"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroPokemonExplanation = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "This world is inhabited by creatures called %%%%%%%POKEMON%%%%%%%!",
                "For some people, %%%%%%%POKEMON%%%%%%% are pets. Others use them for fights.",
                "Myself...",
                "I study %%%%%%%POKEMON%%%%%%% as a profession."
            ], FSP.ScenePlayer.bindRoutine("PlayerAppear"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroPlayerAppear = function (FSP, settings) {
            var middleX = FSP.MapScreener.middleX | 0, player = FSP.ObjectMaker.make("PlayerPortrait", {
                "flipHoriz": true,
                "opacity": .01
            });
            settings.player = player;
            FSP.GroupHolder.applyOnAll(FSP, FSP.killNormal);
            FSP.addThing(player, FSP.MapScreener.middleX + 24 * FSP.unitsize, 0);
            FSP.setMidY(player, FSP.MapScreener.middleY);
            FSP.animateFadeAttribute(player, "opacity", .15, 1, 3);
            FSP.animateFadeHorizontal(player, -FSP.unitsize * 2, middleX - player.width * FSP.unitsize / 2, 1, FSP.ScenePlayer.bindRoutine("PlayerName"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroPlayerName = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "First, what is your name?"
            ], FSP.ScenePlayer.bindRoutine("PlayerSlide"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroPlayerSlide = function (FSP, settings) {
            FSP.animateFadeHorizontal(settings.player, FSP.unitsize, (FSP.MapScreener.middleX + 16 * FSP.unitsize) | 0, 1, FSP.ScenePlayer.bindRoutine("PlayerNameOptions"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroPlayerNameOptions = function (FSP, settings) {
            var fromMenu = FSP.ScenePlayer.bindRoutine("PlayerNameFromMenu"), fromKeyboard = FSP.ScenePlayer.bindRoutine("PlayerNameFromKeyboard");
            FSP.MenuGrapher.createMenu("NameOptions");
            FSP.MenuGrapher.addMenuList("NameOptions", {
                "options": [
                    {
                        "text": "NEW NAME".split(""),
                        "callback": FSP.openKeyboardMenu.bind(FSP, {
                            "title": "YOUR NAME?",
                            "callback": fromKeyboard
                        })
                    }, {
                        "text": "BLUE".split(""),
                        "callback": fromMenu
                    }, {
                        "text": "GARY".split(""),
                        "callback": fromMenu
                    }, {
                        "text": "JOHN".split(""),
                        "callback": fromMenu
                    }]
            });
            FSP.MenuGrapher.setActiveMenu("NameOptions");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroPlayerNameFromMenu = function (FSP, settings) {
            settings.name = FSP.MenuGrapher.getMenuSelectedOption("NameOptions").text;
            FSP.MenuGrapher.deleteMenu("NameOptions");
            FSP.animateFadeHorizontal(settings.player, -FSP.unitsize, FSP.MapScreener.middleX | 0, 1, FSP.ScenePlayer.bindRoutine("PlayerNameConfirm"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroPlayerNameFromKeyboard = function (FSP, settings) {
            settings.name = FSP.MenuGrapher.getMenu("KeyboardResult").completeValue;
            FSP.MenuGrapher.deleteMenu("Keyboard");
            FSP.MenuGrapher.deleteMenu("NameOptions");
            FSP.animateFadeHorizontal(settings.player, -FSP.unitsize, FSP.MapScreener.middleX | 0, 1, FSP.ScenePlayer.bindRoutine("PlayerNameConfirm"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroPlayerNameConfirm = function (FSP, settings) {
            FSP.ItemsHolder.setItem("name", settings.name);
            FSP.MenuGrapher.createMenu("GeneralText", {
                "finishAutomatically": true
            });
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    "Right! So your name is ".split(""),
                    settings.name,
                    "!".split("")
                ]
            ], FSP.ScenePlayer.bindRoutine("PlayerNameComplete"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroPlayerNameComplete = function (FSP, settings) {
            var blank = FSP.ObjectMaker.make("WhiteSquare", {
                "width": FSP.MapScreener.width,
                "height": FSP.MapScreener.height,
                "opacity": 0
            });
            FSP.addThing(blank, 0, 0);
            FSP.TimeHandler.addEvent(FSP.animateFadeAttribute, 35, blank, "opacity", .2, 1, 7, FSP.ScenePlayer.bindRoutine("RivalAppear"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroRivalAppear = function (FSP, settings) {
            var rival = FSP.ObjectMaker.make("RivalPortrait", {
                "opacity": 0
            });
            settings.rival = rival;
            FSP.GroupHolder.applyOnAll(FSP, FSP.killNormal);
            FSP.addThing(rival, 0, 0);
            FSP.setMidX(rival, FSP.MapScreener.middleX | 0);
            FSP.setMidY(rival, FSP.MapScreener.middleY | 0);
            FSP.animateFadeAttribute(rival, "opacity", .1, 1, 1, FSP.ScenePlayer.bindRoutine("RivalName"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroRivalName = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "This is my grand-son. He's been your rival since you were a baby.",
                "...Erm, what is his name again?"
            ], FSP.ScenePlayer.bindRoutine("RivalSlide"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroRivalSlide = function (FSP, settings) {
            FSP.animateFadeHorizontal(settings.rival, FSP.unitsize, (FSP.MapScreener.middleX + 16 * FSP.unitsize) | 0, 1, FSP.ScenePlayer.bindRoutine("RivalNameOptions"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroRivalNameOptions = function (FSP, settings) {
            var fromMenu = FSP.ScenePlayer.bindRoutine("RivalNameFromMenu"), fromKeyboard = FSP.ScenePlayer.bindRoutine("RivalNameFromKeyboard");
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
                        "text": "RED".split(""),
                        "callback": fromMenu
                    }, {
                        "text": "ASH".split(""),
                        "callback": fromMenu
                    }, {
                        "text": "JACK".split(""),
                        "callback": fromMenu
                    }]
            });
            FSP.MenuGrapher.setActiveMenu("NameOptions");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroRivalNameFromMenu = function (FSP, settings) {
            settings.name = FSP.MenuGrapher.getMenuSelectedOption("NameOptions").text;
            FSP.MenuGrapher.deleteMenu("NameOptions");
            FSP.animateFadeHorizontal(settings.rival, -FSP.unitsize, FSP.MapScreener.middleX | 0, 1, FSP.ScenePlayer.bindRoutine("RivalNameConfirm"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroRivalNameFromKeyboard = function (FSP, settings) {
            settings.name = FSP.MenuGrapher.getMenu("KeyboardResult").completeValue;
            FSP.MenuGrapher.deleteMenu("Keyboard");
            FSP.MenuGrapher.deleteMenu("NameOptions");
            FSP.animateFadeHorizontal(settings.rival, -FSP.unitsize, FSP.MapScreener.middleX | 0, 1, FSP.ScenePlayer.bindRoutine("RivalNameConfirm"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroRivalNameConfirm = function (FSP, settings) {
            FSP.ItemsHolder.setItem("nameRival", settings.name);
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    "That's right! I remember now! His name is ", settings.name, "!"
                ]
            ], FSP.ScenePlayer.bindRoutine("RivalNameComplete"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroRivalNameComplete = function (FSP, settings) {
            var blank = FSP.ObjectMaker.make("WhiteSquare", {
                "width": FSP.MapScreener.width,
                "height": FSP.MapScreener.height,
                "opacity": 0
            });
            FSP.addThing(blank, 0, 0);
            FSP.TimeHandler.addEvent(FSP.animateFadeAttribute, 35, blank, "opacity", .2, 1, 7, FSP.ScenePlayer.bindRoutine("LastDialogAppear"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroLastDialogAppear = function (FSP, settings) {
            var portrait = FSP.ObjectMaker.make("PlayerPortrait", {
                "flipHoriz": true,
                "opacity": 0
            });
            settings.portrait = portrait;
            FSP.GroupHolder.applyOnAll(FSP, FSP.killNormal);
            FSP.addThing(portrait, 0, 0);
            FSP.setMidX(portrait, FSP.MapScreener.middleX | 0);
            FSP.setMidY(portrait, FSP.MapScreener.middleY | 0);
            FSP.animateFadeAttribute(portrait, "opacity", .1, 1, 1, FSP.ScenePlayer.bindRoutine("LastDialog"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroLastDialog = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "%%%%%%%PLAYER%%%%%%%!",
                "Your very own %%%%%%%POKEMON%%%%%%% legend is about to unfold!",
                "A world of dreams and adventures with %%%%%%%POKEMON%%%%%%% awaits! Let's go!"
            ], FSP.ScenePlayer.bindRoutine("ShrinkPlayer"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroShrinkPlayer = function (FSP, settings) {
            var silhouetteLarge = FSP.ObjectMaker.make("PlayerSilhouetteLarge"), silhouetteSmall = FSP.ObjectMaker.make("PlayerSilhouetteSmall"), player = FSP.ObjectMaker.make("Player"), timeDelay = 49;
            FSP.TimeHandler.addEvent(FSP.addThing, timeDelay, silhouetteLarge);
            FSP.TimeHandler.addEvent(FSP.setMidObj, timeDelay, silhouetteLarge, settings.portrait);
            FSP.TimeHandler.addEvent(FSP.killNormal, timeDelay, settings.portrait);
            FSP.TimeHandler.addEvent(FSP.addThing, timeDelay * 2, silhouetteSmall);
            FSP.TimeHandler.addEvent(FSP.setMidObj, timeDelay * 2, silhouetteSmall, silhouetteLarge);
            FSP.TimeHandler.addEvent(FSP.killNormal, timeDelay * 2, silhouetteLarge);
            FSP.TimeHandler.addEvent(FSP.addThing, timeDelay * 3, player);
            FSP.TimeHandler.addEvent(FSP.setMidObj, timeDelay * 3, player, silhouetteSmall);
            FSP.TimeHandler.addEvent(FSP.killNormal, timeDelay * 3, silhouetteSmall);
            FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine("FadeOut"), timeDelay * 4);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroFadeOut = function (FSP, settings) {
            var blank = FSP.ObjectMaker.make("WhiteSquare", {
                "width": FSP.MapScreener.width,
                "height": FSP.MapScreener.height,
                "opacity": 0
            });
            FSP.addThing(blank, 0, 0);
            FSP.TimeHandler.addEvent(FSP.animateFadeAttribute, 35, blank, "opacity", .2, 1, 7, FSP.ScenePlayer.bindRoutine("Finish"));
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneIntroFinish = function (FSP, settings) {
            delete FSP.MapScreener.cutscene;
            FSP.MenuGrapher.deleteActiveMenu();
            FSP.ScenePlayer.stopCutscene();
            FSP.ItemsHolder.setItem("gameStarted", true);
            FSP.setMap("Pallet Town", "Start Game");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroFirstDialog = function (FSP, settings) {
            var triggered = false;
            settings.triggerer.alive = false;
            FSP.StateHolder.addChange(settings.triggerer.id, "alive", false);
            if (FSP.ItemsHolder.getItem("starter")) {
                FSP.MapScreener.blockInputs = false;
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
            FSP.MenuGrapher.addMenuDialog("GeneralText", "OAK: Hey! Wait! Don't go out!", function () {
                if (!triggered) {
                    triggered = true;
                    FSP.ScenePlayer.playRoutine("Exclamation");
                }
            });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroExclamation = function (FSP, settings) {
            var timeout = 49;
            FSP.animateExclamation(settings.player, timeout);
            FSP.TimeHandler.addEvent(FSP.MenuGrapher.hideMenu.bind(FSP.MenuGrapher), timeout, "GeneralText");
            FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine("Catchup"), timeout);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroCatchup = function (FSP, settings) {
            var door = FSP.getThingById("Oak's Lab Door"), oak = FSP.ObjectMaker.make("Oak", {
                "outerok": true,
                "nocollide": true
            }), isToLeft = FSP.player.bordering[Direction.Left] !== undefined, walkingSteps = [
                1, "left", 4, "top", 8, "right", 1, "top", 1, "right", 1, "top", 1
            ];
            if (!isToLeft) {
                walkingSteps.push("right", 1, "top", 0);
            }
            walkingSteps.push(FSP.ScenePlayer.bindRoutine("GrassWarning"));
            settings.oak = oak;
            settings.isToLeft = isToLeft;
            FSP.addThing(oak, door.left, door.top);
            FSP.animateCharacterStartTurning(oak, 2, walkingSteps);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroGrassWarning = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "It's unsafe! Wild %%%%%%%POKEMON%%%%%%% live in tall grass!",
                "You need your own %%%%%%%POKEMON%%%%%%% for your protection. \n I know!",
                "Here, come with me."
            ], FSP.ScenePlayer.bindRoutine("FollowToLab"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroFollowToLab = function (FSP, settings) {
            var startingDirection, walkingSteps;
            if (settings.isToLeft) {
                startingDirection = Direction.Bottom;
                walkingSteps = [5, "left", 1, "bottom", 5, "right", 3, "top", 1];
            }
            else {
                startingDirection = Direction.Left;
                walkingSteps = [1, "bottom", 5, "left", 1, "bottom", 5, "right", 3, "top", 1];
            }
            walkingSteps.push(FSP.ScenePlayer.bindRoutine("EnterLab"));
            FSP.MenuGrapher.deleteMenu("GeneralText");
            FSP.animateCharacterFollow(settings.player, settings.oak);
            FSP.animateCharacterStartTurning(settings.oak, startingDirection, walkingSteps);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroEnterLab = function (FSP, settings) {
            FSP.StateHolder.addChange("Pallet Town::Oak's Lab::Oak", "alive", true);
            settings.oak.hidden = true;
            FSP.TimeHandler.addEvent(FSP.animateCharacterStartTurning, FSP.getCharacterWalkingInterval(FSP.player), FSP.player, 0, [
                0,
                function () {
                    FSP.setMap("Pallet Town", "Oak's Lab Floor 1 Door", false);
                    FSP.player.hidden = true;
                    FSP.ScenePlayer.playRoutine("WalkToTable");
                }
            ]);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroWalkToTable = function (FSP, settings) {
            var oak = FSP.getThingById("Oak"), rival = FSP.getThingById("Rival");
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
            rival.dialog = [
                "%%%%%%%RIVAL%%%%%%%: Heh, I don't need to be greedy like you!",
                "Go ahead and choose, %%%%%%%PLAYER%%%%%%%!"
            ];
            FSP.StateHolder.addChange(rival.id, "dialog", rival.dialog);
            FSP.animateCharacterStartWalking(oak, 0, [
                8, "bottom", 0
            ]);
            FSP.TimeHandler.addEvent(function () {
                FSP.player.hidden = false;
            }, 112 - FSP.getCharacterWalkingInterval(settings.player));
            FSP.TimeHandler.addEvent(function () {
                FSP.animateCharacterStartWalking(settings.player, 0, [8, FSP.ScenePlayer.bindRoutine("RivalComplain")]);
            }, 112);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroRivalComplain = function (FSP, settings) {
            settings.oak.nocollide = false;
            settings.player.nocollide = false;
            FSP.StateHolder.addChange(settings.oak.id, "nocollide", false);
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", "%%%%%%%RIVAL%%%%%%%: Gramps! I'm fed up with waiting!", FSP.ScenePlayer.bindRoutine("OakThinksToRival"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroOakThinksToRival = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "OAK: %%%%%%%RIVAL%%%%%%%? Let me think...",
                "Oh, that's right, I told you to come! Just wait!",
                "Here, %%%%%%%PLAYER%%%%%%%!",
                "There are 3 %%%%%%%POKEMON%%%%%%% here!",
                "Haha!",
                "They are inside the %%%%%%%POKE%%%%%%% BALLs.",
                "When I was young, I was a serious %%%%%%%POKEMON%%%%%%% trainer!",
                "In my old age, I have only 3 left, but you can have one! Choose!"
            ], FSP.ScenePlayer.bindRoutine("RivalProtests"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroRivalProtests = function (FSP, settings) {
            var timeout = 21;
            FSP.MenuGrapher.deleteMenu("GeneralText");
            FSP.TimeHandler.addEvent(FSP.MenuGrapher.createMenu.bind(FSP.MenuGrapher), timeout, "GeneralText");
            FSP.TimeHandler.addEvent(FSP.MenuGrapher.addMenuDialog.bind(FSP.MenuGrapher), timeout, "GeneralText", [
                "%%%%%%%RIVAL%%%%%%%: Hey! Gramps! What about me?"
            ], FSP.ScenePlayer.bindRoutine("OakRespondsToProtest"));
            FSP.TimeHandler.addEvent(FSP.MenuGrapher.setActiveMenu.bind(FSP.MenuGrapher), timeout, "GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroOakRespondsToProtest = function (FSP, settings) {
            var blocker = FSP.getThingById("OakBlocker"), timeout = 21;
            settings.player.nocollide = false;
            settings.oak.nocollide = false;
            blocker.nocollide = false;
            FSP.StateHolder.addChange(blocker.id, "nocollide", false);
            FSP.MapScreener.blockInputs = false;
            FSP.MenuGrapher.deleteMenu("GeneralText");
            FSP.TimeHandler.addEvent(FSP.MenuGrapher.createMenu.bind(FSP.MenuGrapher), timeout, "GeneralText", {
                "deleteOnFinish": true
            });
            FSP.TimeHandler.addEvent(FSP.MenuGrapher.addMenuDialog.bind(FSP.MenuGrapher), timeout, "GeneralText", "Oak: Be patient! %%%%%%%RIVAL%%%%%%%, you can have one too!");
            FSP.TimeHandler.addEvent(FSP.MenuGrapher.setActiveMenu.bind(FSP.MenuGrapher), timeout, "GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerChecksPokeball = function (FSP, settings) {
            var pokeball = settings.triggerer;
            // If Oak is hidden, this cutscene shouldn't be starting (too early)
            if (FSP.getThingById("Oak").hidden) {
                FSP.ScenePlayer.stopCutscene();
                FSP.MenuGrapher.createMenu("GeneralText");
                FSP.MenuGrapher.addMenuDialog("GeneralText", [
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
            FSP.openPokedexListing(pokeball.pokemon, FSP.ScenePlayer.bindRoutine("PlayerDecidesPokemon"), {
                "position": {
                    "vertical": "center",
                    "offset": {
                        "left": 0
                    }
                }
            });
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerDecidesPokemon = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    "So! You want the " + settings.triggerer.description + " %%%%%%%POKEMON%%%%%%%, ", settings.chosen, "?"
                ]
            ], function () {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerTakesPokemon = function (FSP, settings) {
            var oak = FSP.getThingById("Oak"), rival = FSP.getThingById("Rival"), dialogOak = "Oak: If a wild %%%%%%%POKEMON%%%%%%% appears, your %%%%%%%POKEMON%%%%%%% can fight against it!", dialogRival = "%%%%%%%RIVAL%%%%%%%: My %%%%%%%POKEMON%%%%%%% looks a lot stronger.";
            settings.oak = oak;
            oak.dialog = dialogOak;
            FSP.StateHolder.addChange(oak.id, "dialog", dialogOak);
            settings.rival = rival;
            rival.dialog = dialogRival;
            FSP.StateHolder.addChange(rival.id, "dialog", dialogRival);
            FSP.ItemsHolder.setItem("starter", settings.chosen.join(""));
            settings.triggerer.hidden = true;
            FSP.StateHolder.addChange(settings.triggerer.id, "hidden", true);
            FSP.StateHolder.addChange(settings.triggerer.id, "nocollide", true);
            FSP.MenuGrapher.deleteMenu("Yes/No");
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                [
                    "%%%%%%%PLAYER%%%%%%% received a ", settings.chosen, "!"
                ],
                "This %%%%%%%POKEMON%%%%%%% is really energetic!",
                [
                    "Do you want to give a nickname to ", settings.chosen, "?"
                ]
            ], FSP.ScenePlayer.bindRoutine("PlayerChoosesNickname"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
            FSP.ItemsHolder.setItem("starter", settings.chosen);
            FSP.ItemsHolder.setItem("PokemonInParty", [
                FSP.MathDecider.compute("newPokemon", settings.chosen, 5)
            ]);
            FSP.addPokemonToPokedex(FSP, settings.chosen, PokedexListingStatus.Caught);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerChoosesNickname = function (FSP, settings) {
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
                            "title": settings.chosen,
                            "callback": FSP.ScenePlayer.bindRoutine("PlayerSetsNickname")
                        })
                    }, {
                        "text": "NO",
                        "callback": FSP.ScenePlayer.bindRoutine("RivalWalksToPokemon")
                    }]
            });
            FSP.MenuGrapher.setActiveMenu("Yes/No");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoicePlayerSetsNickname = function (FSP, settings) {
            var party = FSP.ItemsHolder.getItem("PokemonInParty"), menu = FSP.MenuGrapher.getMenu("KeyboardResult"), result = menu.completeValue;
            party[0].nickname = result;
            FSP.ScenePlayer.playRoutine("RivalWalksToPokemon");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoiceRivalWalksToPokemon = function (FSP, settings) {
            var rival = FSP.getThingById("Rival"), starterRival, steps, pokeball;
            FSP.MenuGrapher.deleteMenu("Keyboard");
            FSP.MenuGrapher.deleteMenu("GeneralText");
            FSP.MenuGrapher.deleteMenu("Yes/No");
            switch (settings.chosen.join("")) {
                case "SQUIRTLE":
                    steps = 4;
                    starterRival = "BULBASAUR".split("");
                    break;
                case "CHARMANDER":
                    steps = 3;
                    starterRival = "SQUIRTLE".split("");
                    break;
                case "BULBASAUR":
                    steps = 2;
                    starterRival = "CHARMANDER".split("");
                    break;
                default:
                    throw new Error("Unknown first Pokemon.");
            }
            settings.rivalPokemon = starterRival;
            settings.rivalSteps = steps;
            FSP.ItemsHolder.setItem("starterRival", starterRival);
            FSP.addPokemonToPokedex(FSP, starterRival, PokedexListingStatus.Caught);
            pokeball = FSP.getThingById("Pokeball" + starterRival.join(""));
            settings.rivalPokeball = pokeball;
            FSP.animateCharacterStartTurning(rival, 2, [
                2, "right", steps, "top", 1,
                FSP.ScenePlayer.bindRoutine("RivalTakesPokemon")
            ]);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroPokemonChoiceRivalTakesPokemon = function (FSP, settings) {
            var oakblocker = FSP.getThingById("OakBlocker"), rivalblocker = FSP.getThingById("RivalBlocker");
            FSP.MenuGrapher.deleteMenu("Yes/No");
            oakblocker.nocollide = true;
            FSP.StateHolder.addChange(oakblocker.id, "nocollide", true);
            rivalblocker.nocollide = false;
            FSP.StateHolder.addChange(rivalblocker.id, "nocollide", false);
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "%%%%%%%RIVAL%%%%%%%: I'll take this one, then!",
                [
                    "%%%%%%%RIVAL%%%%%%% received a ", settings.rivalPokemon, "!"
                ]
            ], function () {
                settings.rivalPokeball.hidden = true;
                FSP.StateHolder.addChange(settings.rivalPokeball.id, "hidden", true);
                FSP.MenuGrapher.deleteActiveMenu();
            });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroRivalBattleApproach = function (FSP, settings) {
            var rival = FSP.getThingById("Rival"), dx = Math.abs(settings.triggerer.left - settings.player.left), further = dx < FSP.unitsize;
            FSP.AudioPlayer.play("Rival Appears");
            settings.rival = rival;
            FSP.animateCharacterSetDirection(rival, Direction.Bottom);
            FSP.animateCharacterSetDirection(settings.player, Direction.Top);
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "%%%%%%%RIVAL%%%%%%%: Wait, %%%%%%%PLAYER%%%%%%%! Let's check out our %%%%%%%POKEMON%%%%%%%!",
                "Come on, I'll take you on!"
            ], FSP.ScenePlayer.bindRoutine("Challenge", {
                "further": further
            }));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroRivalLeavesAfterBattle = function (FSP, settings) {
            FSP.MapScreener.blockInputs = true;
            FSP.ItemsHolder.getItem("PokemonInParty").forEach(FSP.healPokemon.bind(FSP));
            FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine("Complaint"), 49);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroRivalLeavesComplaint = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "%%%%%%%RIVAL%%%%%%%: Okay! I'll make my %%%%%%%POKEMON%%%%%%% fight to toughen it up!"
            ], function () {
                FSP.MenuGrapher.deleteActiveMenu();
                FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine("Goodbye"), 21);
            });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroRivalLeavesGoodbye = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "%%%%%%%PLAYER%%%%%%%! Gramps! Smell ya later!"
            ], FSP.ScenePlayer.bindRoutine("Walking"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroRivalLeavesWalking = function (FSP, settings) {
            var oak = FSP.getThingById("Oak"), rival = FSP.getThingById("Rival"), isRight = Math.abs(oak.left - rival.left) < FSP.unitsize, steps = [
                1,
                "bottom",
                6,
                function () {
                    FSP.killNormal(rival);
                    FSP.StateHolder.addChange(rival.id, "alive", false);
                    FSP.MapScreener.blockInputs = false;
                }
            ], dialog = [
                "OAK: %%%%%%%PLAYER%%%%%%%, raise your young %%%%%%%POKEMON%%%%%%% by making it fight!"
            ];
            console.log("Shouldn't this say the dialog?", dialog);
            FSP.ScenePlayer.stopCutscene();
            FSP.MenuGrapher.deleteMenu("GeneralText");
            rival.nocollide = true;
            FSP.animateCharacterStartTurning(rival, isRight ? Direction.Left : Direction.Right, steps);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakIntroRivalBattleChallenge = function (FSP, settings, args) {
            var steps, starterRival = FSP.ItemsHolder.getItem("starterRival"), battleInfo = {
                "opponent": {
                    "sprite": "RivalPortrait",
                    "name": FSP.ItemsHolder.getItem("nameRival"),
                    "category": "Trainer",
                    "hasActors": true,
                    "reward": 175,
                    "actors": [
                        FSP.MathDecider.compute("newPokemon", starterRival, 5)
                    ]
                },
                "textStart": ["", " wants to fight!"],
                "textDefeat": ["%%%%%%%RIVAL%%%%%%% Yeah! Am I great or what?"],
                "textVictory": [
                    [
                        "%%%%%%%RIVAL%%%%%%%: WHAT?",
                        "Unbelievable!",
                        "I picked the wrong %%%%%%%POKEMON%%%%%%%!"
                    ].join(" ")
                ],
                // "animation": "LineSpiral",
                "noBlackout": true,
                "keptThings": FSP.collectBattleKeptThings(FSP, ["player", "Rival"]),
                "nextCutscene": "OakIntroRivalLeaves"
            };
            switch (FSP.ItemsHolder.getItem("starterRival").join("")) {
                case "SQUIRTLE":
                    steps = 2;
                    break;
                case "BULBASAUR":
                    steps = 3;
                    break;
                case "CHARMANDER":
                    steps = 1;
                    break;
                default:
                    throw new Error("Unknown starterRival.");
            }
            if (args.further) {
                steps += 1;
            }
            FSP.animateCharacterStartTurning(settings.rival, 3, [
                steps,
                "bottom",
                1,
                FSP.startBattle.bind(FSP, battleInfo)
            ]);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakParcelPickupGreeting = function (FSP, settings) {
            settings.triggerer.alive = false;
            FSP.StateHolder.addChange(settings.triggerer.id, "alive", false);
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Hey! You came from PALLET TOWN?"
            ], FSP.ScenePlayer.bindRoutine("WalkToCounter"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakParcelPickupWalkToCounter = function (FSP, settings) {
            FSP.animateCharacterStartTurning(settings.player, 0, [
                2,
                "left",
                1,
                FSP.ScenePlayer.bindRoutine("CounterDialog")
            ]);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakParcelPickupCounterDialog = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "You know PROF. Oak, right?",
                "His order came in. Will you take it to him?",
                "%%%%%%%PLAYER%%%%%%% got OAK's PARCEL!"
            ], function () {
                FSP.MenuGrapher.deleteMenu("GeneralText");
                FSP.ScenePlayer.stopCutscene();
                FSP.MapScreener.blockInputs = false;
            });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
            FSP.StateHolder.addCollectionChange("Pallet Town::Oak's Lab", "Oak", "cutscene", "OakParcelDelivery");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakParcelDeliveryGreeting = function (FSP, settings) {
            settings.rival = FSP.getThingById("Rival");
            settings.oak = settings.triggerer;
            delete settings.oak.cutscene;
            delete settings.oak.dialog;
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "OAK: Oh, %%%%%%%PLAYER%%%%%%%!",
                "How is my old %%%%%%%POKEMON%%%%%%%?",
                "Well, it seems to like you a lot.",
                "You must be talented as a %%%%%%%POKEMON%%%%%%% trainer!",
                "What? You have something for me?",
                "%%%%%%%PLAYER%%%%%%% delivered OAK's PARCEL.",
                "Ah! This is the custom %%%%%%%POKE%%%%%%% BALL I ordered! Thank you!"
            ], FSP.TimeHandler.addEvent.bind(FSP.TimeHandler, FSP.ScenePlayer.bindRoutine("RivalInterrupts"), 14));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
            FSP.StateHolder.addCollectionChange("Viridian City::PokeMart", "CashierDetector", "dialog", false);
            FSP.StateHolder.addCollectionChange("Viridian City::Land", "CrankyGrandpa", "alive", false);
            FSP.StateHolder.addCollectionChange("Viridian City::Land", "CrankyGrandpaBlocker", "alive", false);
            FSP.StateHolder.addCollectionChange("Viridian City::Land", "CrankyGranddaughter", "alive", false);
            FSP.StateHolder.addCollectionChange("Viridian City::Land", "HappyGrandpa", "alive", true);
            FSP.StateHolder.addCollectionChange("Viridian City::Land", "HappyGranddaughter", "alive", true);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakParcelDeliveryRivalInterrupts = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "%%%%%%%RIVAL%%%%%%%: Gramps!"
            ], FSP.ScenePlayer.bindRoutine("RivalWalksUp"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakParcelDeliveryRivalWalksUp = function (FSP, settings) {
            var doormat = FSP.getThingById("DoormatLeft"), rival = FSP.addThing("Rival", doormat.left, doormat.top);
            rival.alive = true;
            settings.rival = rival;
            FSP.MenuGrapher.deleteMenu("GeneralText");
            FSP.animateCharacterStartTurning(rival, 0, [
                8,
                FSP.ScenePlayer.bindRoutine("RivalInquires")
            ]);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakParcelDeliveryRivalInquires = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "%%%%%%%RIVAL%%%%%%%: What did you call me for?"
            ], FSP.TimeHandler.addEvent.bind(FSP.TimeHandler, FSP.ScenePlayer.bindRoutine("OakRequests"), 14));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakParcelDeliveryOakRequests = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Oak: Oh right! I have a request of you two."
            ], FSP.TimeHandler.addEvent.bind(FSP.TimeHandler, FSP.ScenePlayer.bindRoutine("OakDescribesPokedex"), 14));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakParcelDeliveryOakDescribesPokedex = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "On the desk there is my invention, %%%%%%%POKEDEX%%%%%%%!",
                "It automatically records data on %%%%%%%POKEMON%%%%%%% you've seen or caught!",
                "It's a hi-tech encyclopedia!"
            ], FSP.TimeHandler.addEvent.bind(FSP.TimeHandler, FSP.ScenePlayer.bindRoutine("OakGivesPokedex"), 14));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakParcelDeliveryOakGivesPokedex = function (FSP, settings) {
            var bookLeft = FSP.getThingById("BookLeft"), bookRight = FSP.getThingById("BookRight");
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "OAK: %%%%%%%PLAYER%%%%%%% and %%%%%%%RIVAL%%%%%%%! Take these with you!",
                "%%%%%%%PLAYER%%%%%%% got %%%%%%%POKEDEX%%%%%%% from OAK!"
            ], function () {
                FSP.TimeHandler.addEvent(FSP.ScenePlayer.playRoutine.bind(FSP.ScenePlayer), 14, "OakDescribesGoal");
                FSP.killNormal(bookLeft);
                FSP.killNormal(bookRight);
                FSP.StateHolder.addChange(bookLeft.id, "alive", false);
                FSP.StateHolder.addChange(bookRight.id, "alive", false);
                FSP.ItemsHolder.setItem("hasPokedex", true);
            });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakParcelDeliveryOakDescribesGoal = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "To make a complete guide on all the %%%%%%%POKEMON%%%%%%% in the world...",
                "That was my dream!",
                "But, I'm too old! I can't do it!",
                "So, I want you two to fulfill my dream for me!",
                "Get moving, you two!",
                "This is a great undertaking in %%%%%%%POKEMON%%%%%%% history!"
            ], FSP.TimeHandler.addEvent.bind(FSP.TimeHandler, FSP.ScenePlayer.bindRoutine("RivalAccepts"), 14));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneOakParcelDeliveryRivalAccepts = function (FSP, settings) {
            FSP.animateCharacterSetDirection(settings.rival, 1);
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "%%%%%%%RIVAL%%%%%%%: Alright Gramps! Leave it all to me!",
                "%%%%%%%PLAYER%%%%%%%, I hate to say it, but I don't need you!",
                "I know! I'll borrow a TOWN MAP from my sis!",
                "I'll tell her not to lend you one, %%%%%%%PLAYER%%%%%%%! Hahaha!"
            ], function () {
                FSP.ScenePlayer.stopCutscene();
                FSP.MenuGrapher.deleteMenu("GeneralText");
                delete settings.oak.activate;
                settings.rival.nocollide = true;
                FSP.animateCharacterStartTurning(settings.rival, 2, [
                    8,
                    function () {
                        FSP.killNormal(settings.rival);
                        FSP.player.canKeyWalking = true;
                    }
                ]);
                delete settings.oak.cutscene;
                settings.oak.dialog = [
                    "%%%%%%%POKEMON%%%%%%% around the world wait for you, %%%%%%%PLAYER%%%%%%%!"
                ];
                FSP.StateHolder.addChange(settings.oak.id, "dialog", settings.oak.dialog);
                FSP.StateHolder.addChange(settings.oak.id, "cutscene", undefined);
            });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneDaisyTownMapGreeting = function (FSP, settings) {
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Grandpa asked you to run an errand? Here, this will help you!"
            ], FSP.ScenePlayer.bindRoutine("ReceiveMap"));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneDaisyTownMapReceiveMap = function (FSP, settings) {
            var book = FSP.getThingById("Book"), daisy = settings.triggerer;
            FSP.killNormal(book);
            FSP.StateHolder.addChange(book.id, "alive", false);
            delete daisy.cutscene;
            FSP.StateHolder.addChange(daisy.id, "cutscene", undefined);
            daisy.dialog = [
                "Use the TOWN MAP to find out where you are."
            ];
            FSP.StateHolder.addChange(daisy.id, "dialog", daisy.dialog);
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "%%%%%%%PLAYER%%%%%%% got a TOWN MAP!"
            ], function () {
                FSP.ScenePlayer.stopCutscene();
                FSP.MenuGrapher.deleteMenu("GeneralText");
            });
            FSP.MenuGrapher.setActiveMenu("GeneralText");
            console.warn("Player does not actually get a Town Map...");
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneElderTrainingStartBattle = function (FSP, settings) {
            FSP.MapScreener.blockInputs = true;
            FSP.startBattle({
                "keptThings": FSP.collectBattleKeptThings(FSP, [settings.player, settings.triggerer]),
                "player": {
                    "name": "OLD MAN".split(""),
                    "sprite": "ElderBack",
                    "category": "Wild",
                    "actors": []
                },
                "opponent": {
                    "name": "WEEDLE".split(""),
                    "sprite": "WeedleFront",
                    "category": "Wild",
                    "actors": [
                        FSP.MathDecider.compute("newPokemon", "WEEDLE".split(""), 5)
                    ]
                },
                "items": [{
                        "item": "Pokeball",
                        "amount": 50
                    }],
                "automaticMenus": true,
                "onShowPlayerMenu": function () {
                    var timeout = 70;
                    FSP.TimeHandler.addEvent(FSP.MenuGrapher.registerDown.bind(FSP.MenuGrapher), timeout);
                    FSP.TimeHandler.addEvent(FSP.MenuGrapher.registerA.bind(FSP.MenuGrapher), timeout * 2);
                    FSP.TimeHandler.addEvent(FSP.MenuGrapher.registerA.bind(FSP.MenuGrapher), timeout * 3);
                }
            });
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneRivalRoute22RivalEmerges = function (FSP, settings) {
            var player = settings.player, triggerer = settings.triggerer, playerUpper = Number(Math.abs(player.top - triggerer.top) < FSP.unitsize), steps = [
                2,
                "right",
                3 + playerUpper,
            ], rival = FSP.ObjectMaker.make("Rival", {
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
            FSP.addThing(rival, triggerer.left - FSP.unitsize * 28, triggerer.top + FSP.unitsize * 24);
            FSP.animateCharacterStartTurning(rival, 0, steps);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.cutsceneRivalRoute22RivalTalks = function (FSP, settings) {
            var rivalTitle = FSP.ItemsHolder.getItem("starterRival");
            FSP.animateCharacterSetDirection(settings.player, FSP.getDirectionBordering(settings.player, settings.rival));
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "%%%%%%%RIVAL%%%%%%%: Hey! %%%%%%%PLAYER%%%%%%%!",
                "You're going to %%%%%%%POKEMON%%%%%%% LEAGUE?",
                "Forget it! You probably don't have any BADGES!",
                "The guard won't let you through!",
                "By the way did your %%%%%%%POKEMON%%%%%%% get any stronger?"
            ], FSP.startBattle.bind(FSP, {
                "opponent": {
                    "sprite": "RivalPortrait",
                    "name": FSP.ItemsHolder.getItem("nameRival"),
                    "category": "Trainer",
                    "hasActors": true,
                    "reward": 280,
                    "actors": [
                        FSP.MathDecider.compute("newPokemon", rivalTitle, 8),
                        FSP.MathDecider.compute("newPokemon", "PIDGEY".split(""), 9)
                    ]
                },
                "textStart": [
                    "".split(""),
                    " wants to fight!".split("")
                ],
                "textDefeat": [
                    "Yeah! Am I great or what?".split("")
                ],
                "textVictory": [
                    "Awww! You just lucked out!".split("")
                ],
                "keptThings": FSP.collectBattleKeptThings(FSP, ["player", "Rival"])
            }));
            FSP.MenuGrapher.setActiveMenu("GeneralText");
        };
        /* Memory
        */
        /**
         *
         */
        FullScreenPokemon.prototype.saveCharacterPositions = function (FSP) {
            var characters = FSP.GroupHolder.getGroup("Character"), character, id, i;
            for (i = 0; i < characters.length; i += 1) {
                character = characters[i];
                id = character.id;
                FSP.saveCharacterPosition(FSP, character, id);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.saveCharacterPosition = function (FSP, character, id) {
            FSP.StateHolder.addChange(id, "xloc", (character.left + FSP.MapScreener.left) / FSP.unitsize);
            FSP.StateHolder.addChange(id, "yloc", (character.top + FSP.MapScreener.top) / FSP.unitsize);
            FSP.StateHolder.addChange(id, "direction", character.direction);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.saveGame = function () {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), ticksRecorded = FSP.FPSAnalyzer.getNumRecorded();
            FSP.ItemsHolder.setItem("map", FSP.MapsHandler.getMapName());
            FSP.ItemsHolder.setItem("area", FSP.MapsHandler.getAreaName());
            FSP.ItemsHolder.setItem("location", FSP.MapsHandler.getLocationEntered().name);
            FSP.ItemsHolder.increase("time", ticksRecorded - FSP.ticksElapsed);
            FSP.ticksElapsed = ticksRecorded;
            FSP.saveCharacterPositions(FSP);
            FSP.ItemsHolder.saveAll();
            FSP.StateHolder.saveCollection();
            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog("GeneralText", [
                "Now saving..."
            ]);
            FSP.TimeHandler.addEvent(FSP.MenuGrapher.registerB.bind(FSP.MenuGrapher), 49);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.downloadSaveGame = function () {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), link = document.createElement("a");
            FSP.saveGame();
            link.setAttribute("download", "FullScreenPokemon Save " + Date.now() + ".json");
            link.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(FSP.LevelEditor.beautify(JSON.stringify(FSP.ItemsHolder.exportItems()))));
            FSP.container.appendChild(link);
            link.click();
            FSP.container.removeChild(link);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.addItemToBag = function (FSP, item, amount) {
            if (amount === void 0) { amount = 1; }
            FSP.combineArrayMembers(FSP.ItemsHolder.getItem("items"), item, amount, "item", "amount");
        };
        /* Map sets
        */
        /**
         *
         */
        FullScreenPokemon.prototype.setMap = function (name, location, noEntrance) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), map;
            if (typeof name === "undefined" || name.constructor === FullScreenPokemon) {
                name = FSP.MapsHandler.getMapName();
            }
            map = FSP.MapsHandler.setMap(name);
            FSP.ModAttacher.fireEvent("onPreSetMap", map);
            FSP.NumberMaker.resetFromSeed(map.seed);
            FSP.InputWriter.restartHistory();
            FSP.ModAttacher.fireEvent("onSetMap", map);
            FSP.setLocation(location
                || map.locationDefault
                || FSP.settings.maps.locationDefault, noEntrance);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.setLocation = function (name, noEntrance) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), location, theme;
            name = name || "0";
            FSP.AudioPlayer.clearAll();
            FSP.GroupHolder.clearArrays();
            FSP.MapScreener.clearScreen();
            FSP.MapScreener.thingsById = FSP.generateThingsByIdContainer();
            FSP.MenuGrapher.setActiveMenu(undefined);
            FSP.TimeHandler.cancelAllEvents();
            FSP.MapsHandler.setLocation(name);
            FSP.MapScreener.setVariables();
            location = FSP.MapsHandler.getLocation(name);
            location.area.spawnedBy = {
                "name": name,
                "timestamp": new Date().getTime()
            };
            FSP.ModAttacher.fireEvent("onPreSetLocation", location);
            FSP.PixelDrawer.setBackground(FSP.MapsHandler.getArea().background);
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.getAreaBoundariesReal = function (FSP) {
            var area = FSP.MapsHandler.getArea();
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.getScreenScrollability = function (FSP) {
            var area = FSP.MapsHandler.getArea(), boundaries, width, height;
            if (!area) {
                return "none";
            }
            boundaries = area.boundaries;
            width = (boundaries.right - boundaries.left) * FSP.unitsize;
            height = (boundaries.bottom - boundaries.top) * FSP.unitsize;
            if (width > FSP.MapScreener.width) {
                if (height > FSP.MapScreener.height) {
                    return "both";
                }
                else {
                    return "horizontal";
                }
            }
            else if (height > FSP.MapScreener.height) {
                return "vertical";
            }
            else {
                return "none";
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.generateThingsByIdContainer = function () {
            return {};
        };
        /**
         *
         *
         * @remarks Direction is taken in by the .forEach call as the index. Clever.
         */
        FullScreenPokemon.prototype.mapAddAfter = function (prething, direction) {
            var FSP = FullScreenPokemon.prototype.ensureCorrectCaller(this), MapsCreator = FSP.MapsCreator, MapsHandler = FSP.MapsHandler, prethings = MapsHandler.getPreThings(), area = MapsHandler.getArea(), map = MapsHandler.getMap(), boundaries = FSP.MapsHandler.getArea().boundaries;
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
        };
        /* Map entrances
        */
        /**
         *
         */
        FullScreenPokemon.prototype.centerMapScreen = function (FSP) {
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
                    throw new Error("Unknown MapScreenr scrollability: "
                        + FSP.MapScreener.scrollability + ".");
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.centerMapScreenHorizontally = function (FSP) {
            var boundaries = FSP.MapScreener.boundaries, difference = FSP.MapScreener.width - boundaries.width;
            if (difference > 0) {
                FSP.scrollWindow(difference / -2);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.centerMapScreenVertically = function (FSP) {
            var boundaries = FSP.MapScreener.boundaries, difference = FSP.MapScreener.height - boundaries.height;
            FSP.scrollWindow(0, difference / -2);
        };
        /**
         *
         */
        FullScreenPokemon.prototype.centerMapScreenHorizontallyOnPlayer = function (FSP) {
            var difference = (FSP.getMidX(FSP.player) - FSP.MapScreener.middleX) | 0;
            if (Math.abs(difference) > 0) {
                FSP.scrollWindow(difference);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.centerMapScreenVerticallyOnPlayer = function (FSP) {
            var difference = (FSP.getMidY(FSP.player) - FSP.MapScreener.middleY) | 0;
            if (Math.abs(difference) > 0) {
                FSP.scrollWindow(0, difference);
            }
        };
        /**
         *
         */
        FullScreenPokemon.prototype.mapEntranceBlank = function (FSP, location) {
            FSP.addPlayer(0, 0);
            FSP.player.hidden = true;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.mapEntranceNormal = function (FSP, location) {
            FSP.addPlayer(location.xloc ? location.xloc * FSP.unitsize : 0, location.yloc ? location.yloc * FSP.unitsize : 0);
            FSP.animateCharacterSetDirection(FSP.player, (typeof location.direction === "undefined"
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.mapEntranceResume = function (FSP) {
            var savedInfo = FSP.StateHolder.getChanges("player") || {};
            FSP.addPlayer(savedInfo.xloc || 0, savedInfo.yloc || 0, true);
            FSP.animateCharacterSetDirection(FSP.player, savedInfo.direction || 0);
            FSP.centerMapScreen(FSP);
        };
        /* Map macros
        */
        /**
         *
         */
        FullScreenPokemon.prototype.macroCheckered = function (reference) {
            var xStart = reference.x || 0, yStart = reference.y || 0, xnum = reference.xnum || 1, ynum = reference.ynum || 1, xwidth = reference.xwidth || 8, yheight = reference.yheight || 8, offset = reference.offset || 0, things = reference.things, mod = things.length, output = [], thing, x, y, i, j;
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.macroWater = function (reference) {
            var x = reference.x || 0, y = reference.y || 0, width = reference.width || 8, height = reference.height || 8, open = reference.open || [true, true, true, true], output = [{
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.macroHouse = function (reference) {
            var x = reference.x || 0, y = reference.y || 0, width = reference.width || 32, stories = reference.stories || 1, output = [], door, i;
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
                }
                else {
                    output.push({
                        "thing": "HouseMiddle",
                        "x": x + 8,
                        "y": y + 8,
                        "width": width - 16
                    });
                }
            }
            else {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.macroHouseLarge = function (reference) {
            var x = reference.x || 0, y = reference.y || 0, width = reference.width || 48, stories = reference.stories || 1, doorOffset = reference.doorOffset || 16, output = [
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
                }], door, i;
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
            }
            else {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.macroGym = function (reference) {
            var x = reference.x || 0, y = reference.y || 0, width = reference.width || 48, stories = reference.stories || 2, output = [
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.macroBuilding = function (reference) {
            var x = reference.x || 0, y = reference.y || 0, width = reference.width || 32, stories = reference.stories || 1, doorOffset = reference.doorOffset || 8, output = [
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
                }], door, i;
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
            }
            else {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.macroMountain = function (reference) {
            var x = reference.x || 0, y = reference.y || 0, width = reference.width || 8, height = reference.height || 8, openingOffset = reference.openingOffset || 8, output = [];
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
                }
                else {
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
                }
                else {
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
                }
                else {
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
                }
                else {
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
                }
                else {
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.macroPokeCenter = function (reference) {
            var x = reference.x || 0, y = reference.y || 0, output = [
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
        };
        /**
         *
         */
        FullScreenPokemon.prototype.macroPokeMart = function (reference) {
            var x = reference.x || 0, y = reference.y || 0, output = [
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
        };
        /* Miscellaneous utilities
        */
        /**
         * Creates a new String equivalent to an old String repeated any number of
         * times. If times is 0, a blank String is returned.
         *
         * @param {String} string   The characters to repeat.
         * @param {Number} [times]   How many times to repeat (by default, 1).
         */
        FullScreenPokemon.prototype.stringOf = function (str, times) {
            if (times === void 0) { times = 1; }
            return (times === 0) ? "" : new Array(1 + (times || 1)).join(str);
        };
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
        FullScreenPokemon.prototype.makeDigit = function (num, size, prefix) {
            return FullScreenPokemon.prototype.stringOf(prefix ? prefix.toString() : "0", Math.max(0, size - String(num).length)) + num;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.checkArrayMembersIndex = function (array, index) {
            var i;
            for (i = 0; i < array.length; i += 1) {
                if (array[i][index]) {
                    return true;
                }
            }
            return false;
        };
        /**
         *
         */
        FullScreenPokemon.prototype.combineArrayMembers = function (array, title, count, keyTitle, keyCount) {
            var object, i;
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
        };
        /**
         * Ensures the current object is a GameStartr by throwing an error if it
         * is not. This should be used for functions in any GameStartr descendants
         * that have to call 'this' to ensure their caller is what the programmer
         * expected it to be.
         *
         * @param {Mixed} current
         */
        FullScreenPokemon.prototype.ensureCorrectCaller = function (current) {
            if (!(current instanceof FullScreenPokemon)) {
                throw new Error("A function requires the scope ('this') to be the "
                    + "manipulated FullScreenPokemon object. Unfortunately, 'this' is a "
                    + typeof (this) + ".");
            }
            return current;
        };
        // For the sake of reset functions, constants are stored as members of the 
        // FullScreenPokemon Function itself - this allows prototype setters to use 
        // them regardless of whether the prototype has been instantiated yet.
        /**
         * Static settings passed to individual reset Functions. Each of these
         * should be filled out separately, after the FullScreenPokemon class
         * has been declared but before an instance has been instantiated.
         */
        FullScreenPokemon.settings = {
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
        FullScreenPokemon.unitsize = 4;
        /**
         * Static scale of 2, to exand to two pixels per one game pixel.
         */
        FullScreenPokemon.scale = 2;
        /**
         * Quickly tapping direction keys means to look in a direction, not walk.
         */
        FullScreenPokemon.inputTimeTolerance = 4;
        /**
         * The allowed uppercase keys to be shown in a keyboard.
         */
        FullScreenPokemon.keysUppercase = [
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
        FullScreenPokemon.keysLowercase = [
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
        return FullScreenPokemon;
    })(GameStartr.GameStartr);
    FullScreenPokemon_1.FullScreenPokemon = FullScreenPokemon;
})(FullScreenPokemon || (FullScreenPokemon = {}));
