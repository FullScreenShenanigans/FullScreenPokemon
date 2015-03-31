/**
 * FullScreenPokemon.js
 * 
 * A free HTML5 remake of Pokemon generations I & II,
 * expanded for modern browsing.
 * 
 * @example 
 * // Creating a 15 x 14.5 blocks sized FullScreenPokemon object.
 * var FSP = new FullScreenPokemon({
 *     "width": 480, 
 *     "height": 464
 * });
 * 
 * @example 
 * // Creating a 15 x 14.5 blocks sized FullScreenPokemon object and
 * // logging the amount of time each reset function took.
 * var FSP = new FullScreenPokemon({
 *     "width": 480, 
 *     "height": 464,
 *     "resetTimed": true
 * });
 * console.log(FSP.resetTimes);
 * 
 * @example 
 * // Binding the FullScreenPokemon object controls to the body's mouse
 * // and key events, and starting the game.
 * window.FSP = new FullScreenPokemon({
 *    "width": window.innerWidth,
 *    "height": window.innerHeight
 * });
 * 
 * document.body.appendChild(FSP.container);
 * 
 * FSP.proliferate(document.body, {
 *     "onkeydown": FSP.InputWriter.makePipe("onkeydown", "keyCode", true),
 *     "onkeyup": FSP.InputWriter.makePipe("onkeyup", "keyCode", true),
 *     "onmousedown": FSP.InputWriter.makePipe("onmousedown", "which", true)
 * });
 * 
 * FSP.gameStart();
 */
var FullScreenPokemon = (function (GameStartr) {
    "use strict";

    // Use an GameStartr as the class parent, with GameStartr's constructor
    var GameStartrProto = new GameStartr(),

        // Used for combining arrays from the prototype to this
        proliferate = GameStartrProto.proliferate,
        proliferateHard = GameStartrProto.proliferateHard;

    /**
     * Constructor for a new FullScreenPokemon game object.
     * Static game settings are stored in the appropriate settings/*.js object
     * as members of the FullScreenPokemon.prototype object.
     * Dynamic game settings may be given as members of the "customs" argument.
     * On typical machines, game startup time is approximately 500-700ms.
     * 
     * @constructor
     * @param {Number} width   Width of the game viewport: at least 480.
     * @param {Number} height   Height of the game viewport: at least 464.
     * @param {Boolean} [resetTimes]   Whether the amount of time in of each
     *                               reset function (in millseconds) should be 
     *                               stored as a member .resetTimes (by default,
     *                               false).
     * @param {Object} [style]   Additional CSS styles to be given to the
     *                           game's container <div> element.
     * @return {FullScreenPokemon}
     */
    function FullScreenPokemon(customs) {
        // Call the parent GameStartr constructor to set the base settings and
        // verify the prototype requirements
        GameStartr.call(this, {
            "customs": customs,
            "constructor": FullScreenPokemon,
            "requirements": {
                "settings": {
                    "audio": "settings/audio.js",
                    "collisions": "settings/collisions.js",
                    "editor": "settings/editor.js",
                    "events": "settings/events.js",
                    "generator": "settings/generator.js",
                    "input": "settings/inpug.js",
                    "maps": "settings/maps.js",
                    "mods": "settings/mods.js",
                    "numbers": "settings/number.js",
                    "objects": "settings/objetcs.js",
                    "quadrants": "settings/quadrants.js",
                    "renderer": "settings/renderer.js",
                    "runner": "settings/runner.js",
                    "sprites": "settings/sprites.js",
                    "statistics": "settings/statistics.js",
                    "ui": "settings/ui.js",
                }
            },
            "constants": [
                "unitsize",
                "scale",
                "directionNames",
                "directionNumbers",
                "statisticNames",
                "inputTimeTolerance",
                "keysUppercase",
                "keysLowercase"
            ],
            "extraResets": ["resetMenuGrapher", "resetBattleMover", "resetScenePlayer", "resetStateHolder", "resetMathDecider"]
        });

        if (customs.resetTimed) {
            this.resetTimes = this.resetTimed(this, customs);
        } else {
            this.reset(this, customs);
        }

        setTimeout(this.MARATHON.bind(this), 300000);
        setTimeout(this.DURANDAL.bind(this), 350000);
        setTimeout(this.downloadSaveGame.bind(this), 280000);
    }
    FullScreenPokemon.prototype = GameStartrProto;

    // For the sake of reset functions, store constants as members of the actual
    // FullScreenPokemon Function itself - this allows prototype setters to use 
    // them regardless of whether the prototype has been instantiated yet.
    FullScreenPokemon.unitsize = 4;
    FullScreenPokemon.scale = FullScreenPokemon.unitsize / 2;
    FullScreenPokemon.directionNames = ["top", "right", "bottom", "left"];
    FullScreenPokemon.directionNumbers = {
        "top": 0,
        "right": 1,
        "bottom": 2,
        "left": 3
    };
    FullScreenPokemon.statisticNames = [
        "HP", "Attack", "Defense", "Speed", "Special"
    ];

    // Quickly tapping direction keys means to look in a direction, not walk
    FullScreenPokemon.inputTimeTolerance = 4;

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


    /* Resets
    */

    /**
     * Sets self.container via the parent GameStartr resetContaienr.
     * 
     * The container is given the "Press Start" font, the PixelRender is told
     * to draw the scenery, solid, character, and text groups, and the container
     * width is set to the custom's width.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     */
    function resetContainer(self, customs) {
        GameStartr.prototype.resetContainer(self, customs);

        self.container.style.fontFamily = "Press Start";

        self.PixelDrawer.setThingArrays([
            self.GroupHolder.getTerrainGroup(),
            self.GroupHolder.getSolidGroup(),
            self.GroupHolder.getSceneryGroup(),
            self.GroupHolder.getCharacterGroup(),
            self.GroupHolder.getTextGroup()
        ]);
    }

    /**
     * Sets self.MapsHandler.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): MapsHandlr (src/MapsHandlr/MapsHandlr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapsHandler(EightBitter, customs) {
        EightBitter.MapsHandler = new MapsHandlr({
            "MapsCreator": EightBitter.MapsCreator,
            "MapScreener": EightBitter.MapScreener,
            "screenAttributes": EightBitter.settings.maps.screenAttributes,
            "onSpawn": EightBitter.settings.maps.onSpawn,
            "afterAdd": EightBitter.mapAddAfter.bind(EightBitter)
        });
    }

    /**
     * Sets self.MenuGraphr.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): MenuGraphr (src/MenuGraphr/MenuGraphr.js)
     *                          menus.js (settings/menus.js)
     */
    function resetMenuGrapher(EightBitter, customs) {
        EightBitter.MenuGrapher = new MenuGraphr(EightBitter.proliferate({
            "EightBitter": EightBitter,
        }, EightBitter.settings.menus));
    }

    /**
     * Sets self.BattleMovr.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): BattleMovr (src/BattleMovr/BattleMovr.js)
     *                          battles.js (settings/battles.js)
     */
    function resetBattleMover(EightBitter, customs) {
        EightBitter.BattleMover = new BattleMovr(EightBitter.proliferate({
            "EightBitter": EightBitter
        }, EightBitter.settings.battles));
    }

    /**
     * Sets self.BattleMovr.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): ScenePlayr (src/ScenePlayr/ScenePlayr.js)
     *                          scenes.js (settings/scenes.js)
     */
    function resetScenePlayer(EightBitter, customs) {
        EightBitter.ScenePlayer = new ScenePlayr(EightBitter.proliferate({
            "cutsceneArguments": [EightBitter]
        }, EightBitter.settings.scenes));
    }

    /**
     * Sets self.StateHoldr.
     * 
     * 
     * 
     * 
     * 
     */
    function resetStateHolder(EightBitter, customs) {
        EightBitter.StateHolder = new StateHoldr(EightBitter.proliferate({
            "StatsHolder": EightBitter.StatsHolder
        }, EightBitter.settings.states));
    }

    /**
     * 
     */
    function resetMathDecider(EightBitter, customs) {
        EightBitter.MathDecider = new MathDecidr(EightBitter.proliferate({
            "NumberMaker": EightBitter.NumberMaker,
            "constants": {
                "statisticNames": EightBitter.statisticNames
            }
        }, EightBitter.settings.math));
    }


    /* Global manipulations
    */

    /**
     * 
     */
    function gameStart(EightBitter) {
        //if (EightBitter.StatsHolder.get("gameStarted")) {
        //    EightBitter.gameStartPlay(EightBitter);
        //} else {
        EightBitter.gameStartOptions(EightBitter);
        //}

        EightBitter.ModAttacher.fireEvent("onGameStart");
    }

    /**
     * 
     */
    function gameStartOptions(EightBitter) {
        var options = [{
            "text": "NEW GAME",
            "callback": EightBitter.gameStartIntro.bind(EightBitter, EightBitter)
        }, {
            "text": "LOAD FILE",
            "callback": EightBitter.gameLoadFile.bind(EightBitter, EightBitter)
            //}, {
            //    "text": "OPTION"
        }];

        if (EightBitter.StatsHolder.get("gameStarted")) {
            options.unshift({
                "text": "CONTINUE",
                "callback": EightBitter.gameStartPlay.bind(EightBitter, EightBitter)
            });
        }

        EightBitter.setMap("Blank");
        EightBitter.MenuGrapher.createMenu("StartOptions");
        EightBitter.MenuGrapher.addMenuList("StartOptions", {
            "options": options
        });
        EightBitter.MenuGrapher.setActiveMenu("StartOptions");
    }

    /**
     * 
     */
    function gameStartPlay(EightBitter) {
        EightBitter.MenuGrapher.deleteActiveMenu();
        EightBitter.setMap(
            EightBitter.StatsHolder.get("map") || EightBitter.settings.maps.mapDefault,
            EightBitter.StatsHolder.get("location"),
            true
        );
        EightBitter.mapEntranceResume(EightBitter);

        EightBitter.ModAttacher.fireEvent("onGameStartPlay");
    }

    /**
     * 
     * 
     */
    function gameStartIntro(EightBitter) {
        EightBitter.StatsHolder.clear();
        EightBitter.ScenePlayer.startCutscene("Intro");

        EightBitter.ModAttacher.fireEvent("onGameStartIntro");

    }

    /**
     * 
     */
    function gameLoadFile(EightBitter) {
        var dummy = EightBitter.createElement("input", {
            "type": "file",
            "onchange": function (event) {
                var file = (dummy.files || event.dataTransfer.files)[0],
                    reader;

                event.preventDefault();
                event.stopPropagation();

                if (!file) {
                    return;
                }

                reader = new FileReader();
                reader.onloadend = function (event) {
                    var result = event.currentTarget.result;

                    EightBitter.gameLoadData(EightBitter, result);
                };
                reader.readAsText(file);
            }
        });

        dummy.click();

        EightBitter.ModAttacher.fireEvent("onGameStartIntro");
    }

    /**
     * 
     */
    function gameLoadData(EightBitter, dataRaw) {
        var data = JSON.parse(dataRaw),
            key, split;

        for (key in data) {
            if (key.slice(0, 13) === "StateHolder::") {
                split = key.split("::");

                EightBitter.StateHolder.setCollection(
                    split[1] + "::" + split[2],
                    data[key]
                );

                continue;
            }

            EightBitter.StatsHolder.set(key, data[key]);
        }

        EightBitter.MenuGrapher.deleteActiveMenu()
        EightBitter.gameStartPlay(EightBitter);
        EightBitter.StatsHolder.set("gameStarted", true);
    }

    /**
     * Slight addition to the GameStartr thingProcess Function. The Thing's hit
     * check type is cached immediately, and a default id is assigned if an id
     * isn't already present.
     * 
     * @see GameStartr::thingProcess
     */
    function thingProcess(thing, type, settings, defaults) {
        GameStartr.prototype.thingProcess(thing, type, settings, defaults);

        // ThingHittr becomes very non-performant if functions aren't generated
        // for each Thing constructor (optimization does not respect prototypal 
        // inheritance, sadly).
        thing.EightBitter.ThingHitter.cacheHitCheckType(
            thing.title,
            thing.groupType
        );

        thing.bordering = [undefined, undefined, undefined, undefined];

        if (typeof thing.id === "undefined") {
            thing.id = (
                thing.EightBitter.MapsHandler.getMapName()
                + "::"
                + thing.EightBitter.MapsHandler.getAreaName()
                + "::"
                + thing.title
                + "::"
                + (thing.name || "Anonymous")
            );
        }
    }

    /**
     * 
     */
    function onGamePlay(EightBitter) {
        console.log("Playing!");
    }

    /**
     * 
     */
    function onGamePause(EightBitter) {
        console.log("Paused.");
    }

    /**
     * Overriden Function to adds a new Thing to the game at a given position,
     * relative to the top left corner of the screen. The Thing is also 
     * added to the MapScreener.thingsById container.
     * 
     * @param {Mixed} thing   What type of Thing to add. This may be a String of
     *                        the class title, an Array containing the String
     *                        and an Object of settings, or an actual Thing.
     * @param {Number} [left]   Defaults to 0.
     * @param {Number} [top]   Defaults to 0.
     * @param {Boolean} [useSavedInfo]   Whether an Area's saved info in 
     *                                   StateHolder should be applied to the
     *                                   Thing's position (by default, false).
     */
    function addThing(thing, left, top, useSavedInfo) {
        left = left || 0;
        top = top || 0;
        thing = GameStartr.prototype.addThing.call(this, thing, left, top);

        if (useSavedInfo) {
            var savedInfo = thing.EightBitter.StateHolder.getChanges(thing.id);

            if (savedInfo) {
                if (savedInfo.xloc) {
                    thing.EightBitter.setLeft(
                        thing,
                        thing.EightBitter.MapScreener.left + savedInfo.xloc * thing.EightBitter.unitsize
                    );
                }
                if (savedInfo.yloc) {
                    thing.EightBitter.setTop(
                        thing,
                        thing.EightBitter.MapScreener.top + savedInfo.yloc * thing.EightBitter.unitsize
                    );
                }
            }
        }

        if (thing.id) {
            thing.EightBitter.StateHolder.applyChanges(thing.id, thing);
            thing.EightBitter.MapScreener.thingsById[thing.id] = thing;
        }

        if (typeof thing.direction !== "undefined") {
            thing.EightBitter.animateCharacterSetDirection(thing, thing.direction);
        }

        return thing;
    }

    /**
     * Adds a Thing via addPreThing based on the specifications in a PreThing.
     * This is done relative to MapScreener.left and MapScreener.top.
     * 
     * @param {PreThing} prething
     */
    function addPreThing(prething) {
        var thing = prething.thing,
            position = prething.position || thing.position;

        if (thing.spawned) {
            return;
        }
        thing.spawned = true;

        thing.areaName = thing.areaName || thing.EightBitter.MapsHandler.getAreaName();
        thing.mapName = thing.mapName || thing.EightBitter.MapsHandler.getMapName();

        thing.EightBitter.addThing(
            thing,
            prething.left * thing.EightBitter.unitsize - thing.EightBitter.MapScreener.left,
            prething.top * thing.EightBitter.unitsize - thing.EightBitter.MapScreener.top,
            true
        );

        // Either the prething or thing, in that order, may request to be in the
        // front or back of the container
        if (position) {
            thing.EightBitter.TimeHandler.addEvent(function () {
                switch (position) {
                    case "beginning":
                        thing.EightBitter.arrayToBeginning(thing, thing.EightBitter.GroupHolder.getGroup(thing.groupType));
                        break;
                    case "end":
                        thing.EightBitter.arrayToEnd(thing, thing.EightBitter.GroupHolder.getGroup(thing.groupType));
                        break;
                }
            });
        }

        thing.EightBitter.ModAttacher.fireEvent("onAddPreThing", prething);
    }

    /**
     * 
     */
    function addPlayer(left, top, useSavedInfo) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            player;

        left = left || 0;
        top = top || 0;

        player = EightBitter.player = EightBitter.ObjectMaker.make("Player");
        player.keys = player.getKeys();

        EightBitter.InputWriter.setEventInformation(player);

        EightBitter.addThing(player, left, top, useSavedInfo);

        EightBitter.ModAttacher.fireEvent("onAddPlayer", player);

        return player;
    }

    /**
     * 
     */
    function getThingById(id) {
        return EightBittr.ensureCorrectCaller(this).MapScreener.thingsById[id];
    }


    /* Inputs
    */

    /**
     * 
     */
    function canInputsTrigger(EightBitter) {
        return true;
    }

    /**
     * 
     */
    function canDirectionsTrigger(EightBitter) {
        if (EightBitter.GamesRunner.getPaused()) {
            return false;
        }

        if (EightBitter.MenuGrapher.getActiveMenu()) {
            return true;
        }

        return !EightBitter.MapScreener.blockInputs;
    }

    /**
     * 
     */
    function keyDownGeneric(player, direction, event) {
        switch (direction) {
            case 0:
                return player.EightBitter.keyDownUp(player, event);
            case 1:
                return player.EightBitter.keyDownRight(player, event);
            case 2:
                return player.EightBitter.keyDownDown(player, event);
            case 3:
                return player.EightBitter.keyDownLeft(player, event);
        }
    }

    /**
     * 
     * @param {Player} player
     */
    function keyDownLeft(player, event) {
        if (!player.EightBitter.canDirectionsTrigger(player.EightBitter)) {
            return;
        }

        player.keys[3] = true;

        player.EightBitter.TimeHandler.addEvent(
            player.EightBitter.keyDownDirectionReal,
            player.EightBitter.inputTimeTolerance,
            player,
            3
        );


        player.EightBitter.ModAttacher.fireEvent("onKeyDownLeft");
    }

    /**
     * 
     * @param {Player} player
     */
    function keyDownRight(player, event) {
        if (!player.EightBitter.canDirectionsTrigger(player.EightBitter)) {
            return;
        }

        player.keys[1] = true;

        player.EightBitter.TimeHandler.addEvent(
            player.EightBitter.keyDownDirectionReal,
            player.EightBitter.inputTimeTolerance,
            player,
            1
        );

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     * @param {Player} player
     */
    function keyDownUp(player, event) {
        if (!player.EightBitter.canDirectionsTrigger(player.EightBitter)) {
            return;
        }

        player.keys[0] = true;

        player.EightBitter.TimeHandler.addEvent(
            player.EightBitter.keyDownDirectionReal,
            player.EightBitter.inputTimeTolerance,
            player,
            0
        );

        player.EightBitter.ModAttacher.fireEvent("onKeyDownUpReal");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     * @param {Player} player
     */
    function keyDownDown(player, event) {
        if (!player.EightBitter.canDirectionsTrigger(player.EightBitter)) {
            return;
        }

        player.keys[2] = true;

        player.EightBitter.TimeHandler.addEvent(
            player.EightBitter.keyDownDirectionReal,
            player.EightBitter.inputTimeTolerance,
            player,
            2
        );

        player.EightBitter.ModAttacher.fireEvent("onKeyDownDown");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     */
    function keyDownDirectionReal(player, direction) {
        if (!player.keys[direction]) {
            return;
        }

        if (player.EightBitter.MenuGrapher.getActiveMenu()) {
            player.EightBitter.MenuGrapher.registerDirection(direction);
        } else if (!player.EightBitter.MenuGrapher.getActiveMenu()) {
            if (player.direction !== direction) {
                player.turning = direction;
            }

            if (player.canKeyWalking) {
                player.EightBitter.setPlayerDirection(player, direction);
            } else {
                player.nextDirection = direction;
            }
        }

        player.EightBitter.ModAttacher.fireEvent(
            "onKeyDownDirectionReal", direction
        );
    }

    /**
     * 
     */
    function keyDownA(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }

        if (player.EightBitter.MenuGrapher.getActiveMenu()) {
            player.EightBitter.MenuGrapher.registerA();
        } else if (player.bordering[player.direction]) {
            if (player.bordering[player.direction].activate) {
                player.bordering[player.direction].activate(
                    player,
                    player.bordering[player.direction]
                );
            }

            player.keys.a = true;
        }

        player.EightBitter.ModAttacher.fireEvent("onKeyDownA");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     */
    function keyDownB(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }

        if (player.EightBitter.MenuGrapher.getActiveMenu()) {
            player.EightBitter.MenuGrapher.registerB();
        } else {
            player.keys.b = true;
        }

        player.EightBitter.ModAttacher.fireEvent("onKeyDownB");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     * @param {Player} player
     */
    function keyDownPause(player, event) {
        if (!player.EightBitter.GamesRunner.getPaused()) {
            player.EightBitter.TimeHandler.addEvent(
                player.EightBitter.GamesRunner.pause, 7, true
            );
        }

        player.EightBitter.ModAttacher.fireEvent("onKeyDownPause");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     * @param {Player} player
     */
    function keyDownMute(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }

        player.EightBitter.GBSEmulator.toggleMuted();
        player.EightBitter.ModAttacher.fireEvent("onKeyDownMute");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     */
    function keyUpGeneric(player, direction, event) {
        switch (direction) {
            case 0:
                return player.EightBitter.keyUpUp(player, event);
            case 1:
                return player.EightBitter.keyUpRight(player, event);
            case 2:
                return player.EightBitter.keyUpDown(player, event);
            case 3:
                return player.EightBitter.keyUpLeft(player, event);
        }
    }

    /**
     * 
     * @param {Player} player
     */
    function keyUpLeft(player, event) {
        player.EightBitter.ModAttacher.fireEvent("onKeyUpLeft");

        player.keys[3] = false;
        if (player.nextDirection === 3) {
            delete player.nextDirection;
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     * @param {Player} player
     */
    function keyUpRight(player, event) {
        player.EightBitter.ModAttacher.fireEvent("onKeyUpRight");

        player.keys[1] = false;
        if (player.nextDirection === 1) {
            delete player.nextDirection;
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     * @param {Player} player
     */
    function keyUpUp(player, event) {
        player.EightBitter.ModAttacher.fireEvent("onKeyUpUp");

        player.keys[0] = false;
        if (player.nextDirection === 0) {
            delete player.nextDirection;
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     * @param {Player} player
     */
    function keyUpDown(player, event) {
        player.EightBitter.ModAttacher.fireEvent("onKeyUpDown");

        player.keys[2] = false;
        if (player.nextDirection === 2) {
            delete player.nextDirection;
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /*
     * 
     */
    function keyUpA(player, event) {
        player.EightBitter.ModAttacher.fireEvent("onKeyUpA");

        player.keys.a = false;

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     */
    function keyUpB(player, event) {
        player.EightBitter.ModAttacher.fireEvent("onKeyUpB");

        player.keys.b = false;

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     * @param {Player} player
     */
    function keyUpPause(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            player.EightBitter.GamesRunner.play();
        }
        player.EightBitter.ModAttacher.fireEvent("onKeyUpPause");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * 
     * @param {Player} player
     */
    function mouseDownRight(player, event) {
        player.EightBitter.togglePauseMenu(player);

        player.EightBitter.ModAttacher.fireEvent("onMouseDownRight");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }


    /* Upkeep maintenance
    */

    /**
     * 
     */
    function maintainGeneric(EightBitter, things) {
        var thing, i;

        for (i = 0; i < things.length; i += 1) {
            thing = things[i];

            if (!thing.alive) {
                EightBitter.arrayDeleteThing(thing, things, i);
                i -= 1;
            }
        }
    }

    /**
     * 
     */
    function maintainCharacters(EightBitter, characters) {
        var character, i;

        for (i = 0; i < characters.length; i += 1) {
            character = characters[i];
            character.EightBitter.shiftCharacter(character);

            if (character.isMoving) {
                EightBitter.shiftBoth(character, character.xvel, character.yvel);
            } else if (character.shouldWalk && !EightBitter.MenuGrapher.getActiveMenu()) {
                character.onWalkingStart(character, character.direction);
                character.shouldWalk = false;
            }

            if (character.grass) {
                EightBitter.maintainCharacterGrass(
                    EightBitter, character, character.grass
                );
            }

            if (!character.alive && !character.outerOk) {
                EightBitter.arrayDeleteThing(character, characters, i);
                i -= 1;
                continue;
            }

            EightBitter.QuadsKeeper.determineThingQuadrants(character);
            EightBitter.ThingHitter.checkHitsOf[character.title](character);
        }
    }

    /**
     * 
     */
    function maintainCharacterGrass(EightBitter, thing, other) {
        if (thing.EightBitter.isThingWithinGrass(thing, other)) {
            thing.EightBitter.setLeft(thing.shadow, thing.left);
            thing.EightBitter.setTop(thing.shadow, thing.top);
            if (thing.shadow.className !== thing.className) {
                thing.EightBitter.setClass(thing.shadow, thing.className);
            }
        } else {
            thing.EightBitter.killNormal(thing.shadow);
            thing.canvas.height = thing.height * thing.EightBitter.unitsize;
            thing.EightBitter.PixelDrawer.setThingSprite(thing);
            delete thing.shadow;
            delete thing.grass;
        }
    }

    /**
     * 
     */
    function maintainPlayer(EightBitter, player) {
        if (!player || !player.alive) {
            return;
        }

        switch (EightBitter.MapScreener.scrollability) {
            case "none":
                return;
            case "horizontal":
                EightBitter.scrollWindow(
                    EightBitter.getHorizontalScrollAmount(EightBitter)
                );
                return;
            case "vertical":
                EightBitter.scrollWindow(
                    0,
                    EightBitter.getVerticalScrollAmount(EightBitter)
                );
                return;
            case "both":
                EightBitter.scrollWindow(
                    EightBitter.getHorizontalScrollAmount(EightBitter),
                    EightBitter.getVerticalScrollAmount(EightBitter)
                );
                return;
        }
    }

    function getHorizontalScrollAmount(EightBitter) {
        if (!EightBitter.player.xvel) {
            return 0;
        }

        if (EightBitter.player.xvel > 0) {
            return EightBitter.player.bordering[1] ? 0 : EightBitter.player.xvel;
        } else {
            return EightBitter.player.bordering[3] ? 0 : EightBitter.player.xvel;
        }
    }

    function getVerticalScrollAmount(EightBitter) {
        if (!EightBitter.player.yvel) {
            return 0;
        }

        if (EightBitter.player.yvel > 0) {
            return EightBitter.player.bordering[2] ? 0 : EightBitter.player.yvel;
        } else {
            return EightBitter.player.bordering[0] ? 0 : EightBitter.player.yvel;
        }
    }


    /* General animations
    */

    /**
     * 
     */
    function animateSnapToGrid(thing) {
        var grid = thing.EightBitter.unitsize * 8,
            x = (thing.EightBitter.MapScreener.left + thing.left) / grid,
            y = (thing.EightBitter.MapScreener.top + thing.top) / grid;

        thing.EightBitter.setLeft(thing, Math.round(x) * grid - thing.EightBitter.MapScreener.left);
        thing.EightBitter.setTop(thing, Math.round(y) * grid - thing.EightBitter.MapScreener.top);
    }

    /**
     * 
     */
    function animatePlayerDialogFreeze(thing) {
        thing.EightBitter.animateCharacterPreventWalking(thing);

        thing.EightBitter.TimeHandler.cancelClassCycle(thing, "walking");
        if (thing.walkingFlipping) {
            thing.EightBitter.TimeHandler.cancelEvent(thing.walkingFlipping);
        }
    }

    /**
     * 
     */
    function animateFadeAttribute(thing, attribute, change, goal, speed, onCompletion) {
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

        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.animateFadeAttribute, speed, thing, attribute, change, goal, speed, onCompletion
        );
    }

    /**
     * 
     */
    function animateFadeHorizontal(thing, change, goal, speed, onCompletion) {
        thing.EightBitter.shiftHoriz(thing, change);

        if (change > 0) {
            if (thing.EightBitter.getMidX(thing) >= goal) {
                thing.EightBitter.setMidX(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        } else {
            if (thing.EightBitter.getMidX(thing) <= goal) {
                thing.EightBitter.setMidX(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        }

        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.animateFadeHorizontal, speed, thing, change, goal, speed, onCompletion
        );
    }

    /**
     * 
     */
    function animateFadeVertical(thing, change, goal, speed, onCompletion) {
        thing.EightBitter.shiftVert(thing, change);

        if (change > 0) {
            if (thing.EightBitter.getMidY(thing) >= goal) {
                thing.EightBitter.setMidY(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        } else {
            if (thing.EightBitter.getMidY(thing) <= goal) {
                thing.EightBitter.setMidY(thing, goal);
                if (onCompletion) {
                    onCompletion(thing);
                }
                return;
            }
        }

        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.animateFadeVertical,
            speed,
            thing,
            change,
            goal,
            speed,
            onCompletion
        );
    }

    /**
     * 
     */
    function animateGrassBattleStart(thing, grass) {
        var grassMap = thing.EightBitter.MapsHandler.getMap(grass.mapName),
            grassArea = grassMap.areas[grass.areaName],
            options = grassArea.wildPokemon.grass,
            chosen = thing.EightBitter.chooseRandomWildPokemon(
                thing.EightBitter, options
            ),
            chosenPokemon = thing.EightBitter.createPokemon(chosen);

        thing.EightBitter.removeClass(thing, "walking");
        if (thing.shadow) {
            thing.EightBitter.removeClass(thing.shadow, "walking");
        }

        thing.EightBitter.animateCharacterPreventWalking(thing);

        thing.EightBitter.startBattle({
            "opponent": {
                "name": chosen.title,
                "sprite": chosen.title + "Front",
                "category": "Wild",
                "actors": [chosenPokemon]
            }
        })
    }

    /**
     * 
     */
    function animateTrainerBattleStart(thing, other) {
        var battleName = other.battleName || other.title,
            battleSprite = other.battleSprite || battleName;

        thing.EightBitter.startBattle({
            "opponent": {
                "name": battleName,
                "sprite": battleSprite + "Front",
                "category": "Trainer",
                "hasActors": true,
                "reward": other.reward,
                "actors": other.actors.map(
                    thing.EightBitter.createPokemon.bind(thing.EightBitter)
                )
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
    function animatePlayerLeaveLeft(thing, callback) {
        var width = thing.width,
            dt = 3,
            dx = -thing.EightBitter.unitsize * 4;

        thing.EightBitter.TimeHandler.addEventInterval(
            thing.EightBitter.shiftHoriz, dt, width, thing, dx
        );

        console.log("Should implement collapseLeft...");
        //thing.EightBitter.TimeHandler.addEventInterval(
        //    thing.EightBitter.collapseLeft, speed, width, thing, dx
        //);

        if (callback) {
            thing.EightBitter.TimeHandler.addEvent(
                callback, (width * (dt + 2)), thing
            );
        }
    }

    /**
     * 
     */
    function animateThingCorners(EightBitter, x, y, type, settings, groupType) {
        var things = [],
            i;

        for (i = 0; i < 4; i += 1) {
            things.push(EightBitter.addThing([type, settings]));
        }

        if (groupType) {
            for (i = 0; i < things.length; i += 1) {
                things[0].EightBitter.GroupHolder.switchObjectGroup(
                    things[i], things[i].groupType, groupType
                );
            }
        }

        EightBitter.setLeft(things[0], x);
        EightBitter.setLeft(things[1], x);

        EightBitter.setRight(things[2], x);
        EightBitter.setRight(things[3], x);

        EightBitter.setBottom(things[0], y);
        EightBitter.setBottom(things[3], y);

        EightBitter.setTop(things[1], y);
        EightBitter.setTop(things[2], y);

        EightBitter.flipHoriz(things[0]);
        EightBitter.flipHoriz(things[1]);

        EightBitter.flipVert(things[1]);
        EightBitter.flipVert(things[2]);

        return things;
    }

    /**
     * 
     */
    function animateExpandCorners(things, amount, groupType) {
        var EightBitter = things[0].EightBitter,
            i;
        EightBitter.shiftHoriz(things[0], amount);
        EightBitter.shiftHoriz(things[1], amount);
        EightBitter.shiftHoriz(things[2], -amount);
        EightBitter.shiftHoriz(things[3], -amount);

        EightBitter.shiftVert(things[0], -amount);
        EightBitter.shiftVert(things[1], amount);
        EightBitter.shiftVert(things[2], amount);
        EightBitter.shiftVert(things[3], -amount);
    }

    /**
     * 
     */
    function animateSmokeSmall(EightBitter, x, y, callback) {
        var things = EightBitter.animateThingCorners(
                EightBitter, x, y, "SmokeSmall", undefined, "Text"
            );

        EightBitter.TimeHandler.addEvent(
            things.forEach.bind(things), 7, EightBitter.killNormal
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateSmokeMedium, 7, EightBitter, x, y, callback
        );
    }

    /**
     * 
     */
    function animateSmokeMedium(EightBitter, x, y, callback) {
        var things = EightBitter.animateThingCorners(
                EightBitter, x, y, "SmokeMedium", undefined, "Text"
            );

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateExpandCorners,
            7,
            things,
            EightBitter.unitsize
        );

        EightBitter.TimeHandler.addEvent(
            things.forEach.bind(things), 14, EightBitter.killNormal
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateSmokeLarge, 14, EightBitter, x, y, callback
        );
    }

    /**
     * 
     */
    function animateSmokeLarge(EightBitter, x, y, callback) {
        var things = EightBitter.animateThingCorners(
                EightBitter, x, y, "SmokeLarge", undefined, "Text"
            );

        EightBitter.animateExpandCorners(things, EightBitter.unitsize * 2.5);

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateExpandCorners,
            7,
            things,
            EightBitter.unitsize * 2
        );

        EightBitter.TimeHandler.addEvent(
            things.forEach.bind(things), 21, EightBitter.killNormal
        );

        if (callback) {
            EightBitter.TimeHandler.addEvent(callback, 21);
        }
    }

    /**
     * 
     */
    function animateExclamation(thing, timeout, callback) {
        var exclamation = thing.EightBitter.addThing("Exclamation");

        timeout = timeout || 140;

        thing.EightBitter.setMidXObj(exclamation, thing);
        thing.EightBitter.setBottom(exclamation, thing.top);

        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.killNormal, timeout, exclamation
        );

        if (callback) {
            thing.EightBitter.TimeHandler.addEvent(callback, timeout);
        }

        return exclamation;
    }

    /**
     * 
     */
    function animateFadeToColor(EightBitter, settings) {
        var color = settings.color,
            callback = settings.callback,
            change = settings.change || .33,
            speed = settings.speed || 4,
            blank = EightBitter.ObjectMaker.make(color + "Square", {
                "width": EightBitter.MapScreener.width,
                "height": EightBitter.MapScreener.height,
                "opacity": 0
            }),
            args = arguments;

        EightBitter.addThing(blank);

        EightBitter.animateFadeAttribute(
            blank,
            "opacity",
            change,
            1,
            4,
            function () {
                EightBitter.killNormal(blank);
                if (callback) {
                    callback.apply(this, args);
                }
            }
        );

        return blank;
    }

    /**
     * 
     */
    function animateFadeFromColor(EightBitter, settings) {
        var color = settings.color,
            callback = settings.callback,
            change = settings.change || .33,
            speed = settings.speed || 4,
            blank = EightBitter.ObjectMaker.make(color + "Square", {
                "width": EightBitter.MapScreener.width,
                "height": EightBitter.MapScreener.height,
                "opacity": 1,
            }),
            args = arguments;

        EightBitter.addThing(blank);

        EightBitter.animateFadeAttribute(
            blank,
            "opacity",
            -change,
            0,
            speed,
            function () {
                EightBitter.killNormal(blank);
                if (callback) {
                    callback.apply(this, args);
                }
            }
        );

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
    function animateFlicker(thing, cleartime, interval, callback) {
        cleartime = cleartime | 0 || 49;
        interval = interval | 0 || 2;

        thing.flickering = true;

        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.hidden = !thing.hidden;
            if (!thing.hidden) {
                thing.EightBitter.PixelDrawer.setThingSprite(thing);
            }
        }, interval, cleartime);

        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.flickering = thing.hidden = false;
            thing.EightBitter.PixelDrawer.setThingSprite(thing);

            if (callback) {
                callback(thing);
            }
        }, cleartime * interval + 1);
    }

    /**
     * 
     */
    function animateScreenShake(EightBitter, dx, dy, cleartime, interval, callback) {
        dx = dx | 0;
        dy = dy | 0;

        cleartime = cleartime | 0 || 8;
        interval = interval | 0 || 8;

        EightBitter.TimeHandler.addEventInterval(function () {
            EightBitter.GroupHolder.callOnAll(
                EightBitter, EightBitter.shiftHoriz, dx
            );
            EightBitter.GroupHolder.callOnAll(
                EightBitter, EightBitter.shiftVert, dy
            );
        }, 1, cleartime * interval);

        EightBitter.TimeHandler.addEvent(function () {
            dx *= -1;
            dy *= -1;

            EightBitter.TimeHandler.addEventInterval(function () {
                dx *= -1;
                dy *= -1;
            }, interval, cleartime);

            if (callback) {
                EightBitter.TimeHandler.addEvent(
                    callback, interval * cleartime, EightBitter
                );
            }
        }, (interval / 2) | 0);
    }


    /* Character movement animations
    */

    /**
     * 
     */
    function animateCharacterSetDistanceVelocity(thing, distance) {
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
        }
    }

    /**
     * 
     */
    function animateCharacterStartTurning(thing, direction, onStop) {
        if (onStop.length === 0) {
            return;
        }

        if (onStop[0] === 0) {
            if (onStop.length > 1) {
                if (onStop[1] instanceof Function) {
                    onStop[1](thing);
                    return;
                }
                thing.EightBitter.animateCharacterSetDirection(
                    thing, thing.EightBitter.directionNumbers[onStop[1]]
                );
                thing.EightBitter.animateCharacterStartTurning(
                    thing,
                    thing.EightBitter.directionNumbers[onStop[1]],
                    onStop.slice(2)
                );
            }
            return;
        }

        if (thing.follower) {
            thing.walkingCommands.push(direction);
        }

        thing.EightBitter.animateCharacterStartWalking(thing, direction, onStop);

        thing.EightBitter.shiftBoth(thing, -thing.xvel, -thing.yvel);
    }

    /**
     * 
     */
    function animateCharacterStartWalking(thing, direction, onStop) {
        var repeats = thing.EightBitter.getCharacterWalkingInterval(thing),
            distance = repeats * thing.speed;

        direction = direction || 0;
        thing.EightBitter.animateCharacterSetDirection(thing, direction);
        thing.EightBitter.animateCharacterSetDistanceVelocity(thing, distance);

        if (!thing.cycles || !thing.cycles.walking) {
            thing.EightBitter.TimeHandler.addClassCycle(
                thing, ["walking", "standing"], "walking", repeats / 2
            );
        }

        if (!thing.walkingFlipping) {
            thing.walkingFlipping = thing.EightBitter.TimeHandler.addEventInterval(
                thing.EightBitter.animateSwitchFlipOnDirection, repeats, Infinity, thing
            );
        }

        if (thing.sight) {
            thing.sightDetector.nocollide = true;
        }

        thing.EightBitter.TimeHandler.addEventInterval(
            thing.onWalkingStop, repeats, Infinity, thing, onStop
        );

        thing.EightBitter.shiftBoth(thing, thing.xvel, thing.yvel);
    }

    /**
     * 
     */
    function animateCharacterStartWalkingRandom(thing) {
        var totalAllowed = 0,
            direction, i;

        for (i = 0; i < 4; i += 1) {
            if (!thing.bordering[i]) {
                totalAllowed += 1;
            }
        }

        if (totalAllowed === 0) {
            return;
        }

        direction = thing.EightBitter.NumberMaker.randomInt(totalAllowed);

        for (i = 0; i <= direction; i += 1) {
            if (thing.bordering[i]) {
                direction += 1;
            }
        }

        if (thing.roamingDirections.indexOf(direction) === -1) {
            thing.EightBitter.animateCharacterSetDirection(thing, direction);
        } else {
            thing.EightBitter.animateCharacterStartWalking(thing, direction);
        }
    }

    /**
     * 
     */
    function animatePlayerStartWalking(thing) {
        if (typeof thing.turning !== "undefined") {
            if (!thing.keys[thing.turning]) {
                thing.EightBitter.animateCharacterSetDirection(
                    thing, thing.turning
                );
                thing.turning = undefined;
                return;
            }
            thing.turning = undefined;
        }

        thing.canKeyWalking = false;
        thing.EightBitter.animateCharacterStartWalking(thing, thing.direction);
    }

    /**
     * 
     */
    function animateCharacterSetDirection(thing, direction) {
        thing.direction = direction;

        if (direction !== 1) {
            thing.EightBitter.unflipHoriz(thing);
        } else {
            thing.EightBitter.flipHoriz(thing);
        }

        thing.EightBitter.removeClasses(thing, "up left down");

        switch (direction) {
            case 0:
                thing.EightBitter.addClass(thing, "up");
                break;
            case 1:
                thing.EightBitter.addClass(thing, "left");
                break;
            case 2:
                thing.EightBitter.addClass(thing, "down");
                break;
            case 3:
                thing.EightBitter.addClass(thing, "left");
                break;
        }
    }

    /**
     * 
     */
    function animateCharacterSetDirectionRandom(thing) {
        thing.EightBitter.animateCharacterSetDirection(
            thing, thing.EightBitter.NumberMaker.randomIntWithin(0, 3)
        )
    }

    /**
     * 
     */
    function animateCharacterStopWalking(thing, onStop) {
        thing.xvel = 0;
        thing.yvel = 0;

        thing.EightBitter.removeClass(thing, "walking");
        thing.EightBitter.TimeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            thing.EightBitter.TimeHandler.cancelEvent(thing.walkingFlipping);
            thing.walkingFlipping = undefined;
        }

        thing.EightBitter.animateSnapToGrid(thing);

        if (thing.sight) {
            thing.sightDetector.nocollide = false;
            thing.EightBitter.animatePositionSightDetector(thing);
        }

        if (!onStop) {
            return true;
        }

        switch (onStop.constructor) {
            case Number:
                thing.EightBitter.animatePlayerStartWalking(thing, thing.direction, onStop - 1);
                return true;
            case Array:
                if (onStop[0] > 0) {
                    onStop[0] -= 1;
                    thing.EightBitter.animateCharacterStartTurning(thing, thing.direction, onStop);
                } else if (onStop.length === 0) {
                    return true;
                } else {
                    if (onStop[1] instanceof Function) {
                        return onStop[1](thing);
                    }
                    thing.EightBitter.animateCharacterStartTurning(
                        thing,
                        thing.EightBitter.directionNumbers[onStop[1]],
                        onStop.slice(2)
                    );
                }
                return true;
            case Function:
                return onStop(thing);
        }
    }

    /**
     * 
     */
    function animatePlayerStopWalking(thing, onStop) {
        if (thing.EightBitter.checkPlayerGrassBattle(thing)) {
            return;
        }

        if (thing.following) {
            return thing.EightBitter.animateCharacterStopWalking(thing, onStop);
        }

        if (
            !thing.EightBitter.MenuGrapher.getActiveMenu()
            && thing.keys[thing.direction]
        ) {
            thing.EightBitter.animateCharacterSetDistanceVelocity(
                thing, thing.distance
            );
            return false;
        } else {
            if (typeof thing.nextDirection !== "undefined") {
                if (thing.nextDirection !== thing.direction) {
                    thing.EightBitter.setPlayerDirection(
                        thing,
                        thing.nextDirection
                    );
                }
                delete thing.nextDirection;
            }
        }

        thing.canKeyWalking = true;
        return thing.EightBitter.animateCharacterStopWalking(thing, onStop);
    }

    /**
     * 
     */
    function animateCharacterPreventWalking(thing) {
        thing.isMoving = thing.shouldWalk = false;
        thing.xvel = thing.yvel = 0;

        if (thing.getKeys) {
            thing.keys = thing.getKeys();
        }

        thing.EightBitter.MapScreener.blockInputs = true;
    }

    /**
     * 
     */
    function animateFlipOnDirection(thing) {
        if (thing.direction % 2 === 0) {
            thing.EightBitter.flipHoriz(thing);
        }
    }

    /**
     * 
     */
    function animateUnflipOnDirection(thing) {
        if (thing.direction % 2 === 0) {
            thing.EightBitter.unflipHoriz(thing);
        }
    }

    /**
     * 
     */
    function animateSwitchFlipOnDirection(thing) {
        if (thing.direction % 2 !== 0) {
            return;
        }

        if (thing.flipHoriz) {
            thing.EightBitter.unflipHoriz(thing);
        } else {
            thing.EightBitter.flipHoriz(thing);
        }
    }

    /**
     * 
     */
    function animatePositionSightDetector(thing) {
        var detector = thing.sightDetector,
            direction = thing.direction,
            sight = thing.sight;

        if (detector.direction !== direction) {
            if (thing.direction % 2 === 0) {
                thing.EightBitter.setWidth(detector, thing.width);
                thing.EightBitter.setHeight(detector, sight * 8);
            } else {
                thing.EightBitter.setWidth(detector, sight * 8);
                thing.EightBitter.setHeight(detector, thing.height);
            }
            detector.direction = direction;
        }

        switch (direction) {
            case 0:
                thing.EightBitter.setBottom(detector, thing.top);
                thing.EightBitter.setMidXObj(detector, thing);
                break;
            case 1:
                thing.EightBitter.setLeft(detector, thing.right);
                thing.EightBitter.setMidYObj(detector, thing);
                break;
            case 2:
                thing.EightBitter.setTop(detector, thing.bottom);
                thing.EightBitter.setMidXObj(detector, thing);
                break;
            case 3:
                thing.EightBitter.setRight(detector, thing.left);
                thing.EightBitter.setMidYObj(detector, thing);
                break;
        }
    }

    /**
     * 
     */
    function animateCharacterDialogFinish(thing, other) {
        var onStop;

        if (other.pushSteps) {
            onStop = other.pushSteps;
        }

        thing.talking = false;
        other.talking = false;
        thing.canKeyWalking = true;

        if (other.directionPreferred) {
            thing.EightBitter.animateCharacterSetDirection(
                other, other.directionPreferred
            );
        }

        if (other.transport) {
            other.active = true;
            thing.EightBitter.activateTransporter(thing, other);
            return;
        }

        if (typeof other.pushDirection !== "undefined") {
            thing.EightBitter.animateCharacterStartTurning(
                thing, other.pushDirection, onStop
            );
        }

        if (other.gift) {
            thing.EightBitter.MenuGrapher.createMenu("GeneralText");
            thing.EightBitter.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%PLAYER%%%%%%% got " + other.gift.toUpperCase() + "!"
                ],
                thing.EightBitter.animateCharacterDialogFinish.bind(
                    thing, other
                )
            );
            thing.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

            thing.EightBitter.addItemToBag(thing.EightBitter, other.gift);

            other.gift = undefined;
            thing.EightBitter.StateHolder.addChange(other.id, "gift", undefined);

            return;
        }

        if (other.dialogNext) {
            other.dialog = other.dialogNext;
            other.dialogNext = undefined;
            thing.EightBitter.StateHolder.addChange(
                other.id, "dialog", other.dialog
            );
            thing.EightBitter.StateHolder.addChange(
                other.id, "dialogNext", undefined
            );
        }

        if (other.trainer) {
            other.trainer = false;
            thing.EightBitter.StateHolder.addChange(
                other.id, "trainer", false
            );

            if (other.sight) {
                other.sight = undefined;
                thing.EightBitter.StateHolder.addChange(
                    other.id, "sight", undefined
                );
            }
        }

        if (other.dialogOptions) {
            thing.EightBitter.animateCharacterDialogOptions(
                thing, other, other.dialogOptions
            );
        } else if (other.trainer) {
            thing.EightBitter.animateTrainerBattleStart(thing, other);
        }
    }

    /**
     * 
     */
    function animateCharacterDialogOptions(thing, other, dialogOptions) {
        var options = dialogOptions.options,
            generateCallback = function (dialog) {
                var callback, words;

                if (!dialog) {
                    return undefined;
                }

                if (dialog.constructor === Object && dialog.options) {
                    words = dialog.words;
                    callback = animateCharacterDialogOptions.bind(
                        thing.EightBitter, thing, other, dialog
                    );
                } else {
                    words = dialog.words || dialog;
                    if (dialog.cutscene) {
                        callback = thing.EightBitter.ScenePlayer.bindCutscene(
                            dialog.cutscene, {
                                "player": thing,
                                "tirggerer": other
                            }
                        );
                    }
                }

                return function () {
                    thing.EightBitter.MenuGrapher.deleteMenu("Yes/No");
                    thing.EightBitter.MenuGrapher.createMenu("GeneralText", {
                        //"deleteOnFinish": true
                    });
                    thing.EightBitter.MenuGrapher.addMenuDialog(
                        "GeneralText", words, callback
                    );
                    thing.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
                };
            };

        console.warn("DialogOptions assumes type = Yes/No for now...");

        thing.EightBitter.MenuGrapher.createMenu("Yes/No", {
            "position": {
                "offset": {
                    "left": 28
                }
            }
        });
        thing.EightBitter.MenuGrapher.addMenuList("Yes/No", {
            "options": [{
                "text": "YES",
                "callback": generateCallback(options.Yes)
            }, {
                "text": "NO",
                "callback": generateCallback(options.No)
            }]
        });
        thing.EightBitter.MenuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * 
     */
    function animateCharacterFollow(thing, other) {
        var direction = thing.EightBitter.getDirectionBordering(thing, other);

        thing.nocollide = true;
        thing.allowDirectionAsKeys = true;

        thing.following = other;
        other.follower = thing;

        thing.speedOld = thing.speed;
        thing.speed = other.speed;

        other.walkingCommands = [direction];

        thing.EightBitter.animateCharacterSetDirection(thing, direction);

        switch (direction) {
            case 0:
                thing.EightBitter.setTop(thing, other.bottom);
                break;
            case 1:
                thing.EightBitter.setRight(thing, other.left);
                break;
            case 2:
                thing.EightBitter.setBottom(thing, other.top);
                break;
            case 3:
                thing.EightBitter.setLeft(thing, other.right);
                break;
        }

        thing.followingLoop = thing.EightBitter.TimeHandler.addEventInterval(
            thing.EightBitter.animateCharacterFollowContinue,
            thing.EightBitter.getCharacterWalkingInterval(thing),
            Infinity,
            thing,
            other
        );
    }

    /**
     * 
     */
    function animateCharacterFollowContinue(thing, other) {
        if (other.walkingCommands.length <= 1) {
            return;
        }

        var direction = other.walkingCommands.shift();

        thing.EightBitter.animateCharacterStartWalking(thing, direction, 0);
    }

    /**
     * 
     */
    function animateCharacterFollowStop(thing, other) {
        var other = thing.following;
        if (!other) {
            return true;
        }

        thing.nocollide = false;
        delete thing.following;
        delete thing.followingDirection;
        delete other.follower;

        thing.EightBitter.animateCharacterStopWalking(thing);
        thing.EightBitter.TimeHandler.cancelEvent(thing.followingLoop);
    }

    /**
     * 
     */
    function getCharacterWalkingInterval(thing) {
        return Math.round(8 * thing.EightBitter.unitsize / thing.speed);
    }

    /**
     * 
     */
    function animateCharacterHopLedge(thing, other) {
        var shadow = thing.shadow = thing.EightBitter.addThing("Shadow"),
            dy = -thing.EightBitter.unitsize,
            xvelOld = thing.xvel,
            yvelOld = thing.yvel,
            speed = 2,
            steps = 14,
            changed = 0,
            hesitant = thing.keys && !thing.keys[thing.direction];

        thing.ledge = other;

        if (hesitant) {
            thing.EightBitter.keyDownGeneric(thing, thing.direction);
        }

        thing.EightBitter.setMidXObj(shadow, thing);
        thing.EightBitter.setBottom(shadow, thing.bottom);

        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.setBottom(shadow, thing.bottom);

            if (changed % speed === 0) {
                thing.offsetY += dy;
            }

            changed += 1;
        }, 1, steps * speed);

        thing.EightBitter.TimeHandler.addEvent(function () {
            dy *= -1;
        }, speed * (steps / 2) | 0);

        thing.EightBitter.TimeHandler.addEvent(function () {
            delete thing.ledge;
            thing.EightBitter.killNormal(shadow);

            if (hesitant) {
                thing.EightBitter.keyUpGeneric(thing, thing.direction);
            }
        }, steps * speed);
    }


    /* Collision detection
    */

    /**
     * 
     */
    function generateCanThingCollide() {
        return function (thing) {
            return thing.alive;
        }
    }

    /**
     * 
     */
    function generateIsCharacterTouchingCharacter() {
        return function isCharacterTouchingCharacter(thing, other) {
            //if (other.xvel || other.yvel) {
            //    // check destination...
            //}
            return (
                !thing.nocollide && !other.nocollide
                && thing.right >= (other.left + other.tolLeft)
                && thing.left <= (other.right - other.tolRight)
                && thing.bottom >= (other.top + other.tolTop)
                && thing.top <= (other.bottom - other.tolBottom)
            );
        }
    }

    /**
     * 
     */
    function generateIsCharacterTouchingSolid() {
        return function isCharacterTouchingSolid(thing, other) {
            return (
                !thing.nocollide && !other.nocollide
                && thing.right >= (other.left + other.tolLeft)
                && thing.left <= (other.right - other.tolRight)
                && thing.bottom >= (other.top + other.tolTop)
                && thing.top <= (other.bottom - other.tolBottom)
            );
        }
    }

    /**
     * 
     */
    function generateHitCharacterThing() {
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
            switch (thing.EightBitter.getDirectionBordering(thing, other)) {
                case 0:
                    if (
                        thing.left !== other.right - other.tolRight
                        && thing.right !== other.left + other.tolLeft
                    ) {
                        thing.bordering[0] = other;
                        other.bordering[2] = thing;
                        thing.EightBitter.setTop(
                            thing, other.bottom - other.tolBottom
                        );
                    }
                    break;

                case 1:
                    if (
                        thing.top !== other.bottom - other.tolBottom
                        && thing.bottom !== other.top + other.tolTop
                    ) {
                        thing.bordering[1] = other;
                        other.bordering[3] = thing;
                        thing.EightBitter.setRight(
                            thing, other.left + other.tolLeft
                        );
                    }
                    break;

                case 2:
                    if (
                        thing.left !== other.right - other.tolRight
                        && thing.right !== other.left + other.tolLeft
                    ) {
                        thing.bordering[2] = other;
                        other.bordering[0] = thing;
                        thing.EightBitter.setBottom(
                            thing, other.top + other.tolTop
                        );
                    }
                    break;

                case 3:
                    if (
                        thing.top !== other.bottom - other.tolBottom
                        && thing.bottom !== other.top + other.tolTop
                    ) {
                        thing.bordering[3] = other;
                        other.bordering[1] = thing;
                        thing.EightBitter.setLeft(
                            thing, other.right - other.tolRight
                        );
                    }
                    break;
            }
        }
    }

    /**
     * 
     */
    function collideCollisionDetector(thing, other) {
        if (!thing.player) {
            return;
        }

        if (other.active) {
            if (
                (!other.requireOverlap && !thing.isWalking)
                || thing.EightBitter.isThingWithinOther(thing, other)
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
                other.activate(thing, other)
            }
            return true;
        }

        // Find direction of movement using xvel, yvel
        // if towards other, transport
        var directionMovement = thing.direction,
            directionActual = thing.EightBitter.getDirectionBordering(thing, other);

        if (directionMovement === directionActual) {
            other.active = true;
            return true;
        }
    }

    /**
     * 
     */
    function collideCharacterDialog(thing, other) {
        var dialog = other.dialog,
            direction;

        if (other.cutscene) {
            thing.EightBitter.ScenePlayer.startCutscene(other.cutscene, {
                "thing": thing,
                "triggerer": other
            });
        }

        if (!dialog) {
            return;
        }

        direction = thing.EightBitter.getDirectionBordering(other, thing);

        if (other.dialogDirections) {
            dialog = dialog[direction];
            if (!dialog) {
                return;
            }
        }

        thing.talking = true;
        other.talking = true;
        thing.canKeyWalking = false;

        if (!thing.EightBitter.MenuGrapher.getActiveMenu()) {
            thing.EightBitter.MenuGrapher.createMenu("GeneralText", {
                "deleteOnFinish": !other.dialogOptions
            });
            thing.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
            thing.EightBitter.MenuGrapher.addMenuDialog(
                "GeneralText",
                dialog,
                animateCharacterDialogFinish.bind(undefined, thing, other)
            );
        }

        if (other.switchDirectionOnDialog) {
            thing.EightBitter.animateCharacterSetDirection(other, direction);
        }
    }

    /**
     * 
     */
    function collidePokeball(thing, other) {
        switch (other.action) {
            case "item":
                thing.EightBitter.MenuGrapher.createMenu("GeneralText");
                thing.EightBitter.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        "%%%%%%%PLAYER%%%%%%% found " + other.item + "!"
                    ],
                    function () {
                        thing.EightBitter.MenuGrapher.deleteActiveMenu();
                        thing.EightBitter.killNormal(other);
                        thing.EightBitter.StateHolder.addChange(
                            other.id, "alive", false
                        );
                    }
                );
                thing.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

                thing.EightBitter.addItemToBag(
                    thing.EightBitter, other.item, other.amount
                );
                break;

            case "cutscene":
                thing.EightBitter.ScenePlayer.startCutscene(other.cutscene, {
                    "player": thing,
                    "triggerer": other
                });
                if (other.routine) {
                    thing.EightBitter.ScenePlayer.playRoutine(other.routine);
                }
                break;

            case "pokedex":
                thing.EightBitter.openPokedexListing(other.pokemon);
                break;

            case "dialog":
                thing.EightBitter.MenuGrapher.createMenu("GeneralText");
                thing.EightBitter.MenuGrapher.addMenuDialog(
                    "GeneralText", other.dialog
                );
                thing.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
                break;

            case "yes/no":
                thing.EightBitter.MenuGrapher.createMenu("Yes/No", {
                    "killOnB": ["GeneralText"],
                });
                thing.EightBitter.MenuGrapher.addMenuList("Yes/No", {
                    "options": [{
                        "text": "YES",
                        "callback": console.log.bind(console, "What do, yes?")
                    }, {
                        "text": "NO",
                        "callback": console.log.bind(console, "What do, no?")
                    }]
                });
                thing.EightBitter.MenuGrapher.setActiveMenu("Yes/No");
                break;
        }
    }

    /**
     * 
     */
    function collideCharacterGrass(thing, other) {
        if (
            thing.grass
            || !thing.EightBitter.isThingWithinGrass(thing, other)
        ) {
            return true;
        }

        thing.grass = other;
        thing.heightOld = thing.height;

        thing.canvas.height = thing.heightGrass * thing.EightBitter.unitsize;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);

        thing.shadow = thing.EightBitter.ObjectMaker.make(thing.title, {
            "nocollide": true
        });

        if (thing.shadow.className !== thing.className) {
            thing.EightBitter.setClass(thing.shadow, thing.className);
        }

        delete thing.shadow.id;
        thing.EightBitter.addThing(thing.shadow, thing.left, thing.top);

        thing.EightBitter.GroupHolder.switchObjectGroup(
            thing.shadow, thing.shadow.groupType, "Terrain"
        );

        thing.EightBitter.arrayToEnd(
            thing.shadow, thing.EightBitter.GroupHolder.getTerrainGroup()
        );

        return true;
    }

    /**
     * 
     */
    function collideLedge(thing, other) {
        if (thing.ledge) {
            return true;
        }

        if (thing.direction !== other.direction) {
            return false;
        }

        switch (thing.direction % 2) {
            case 0:
                if (thing.left === other.right || thing.right === other.left) {
                    return true;
                }
                break;
            case 1:
                if (thing.top === other.bottom || thing.bottom === other.top) {
                    return true;
                }
                break;
        }

        thing.EightBitter.animateCharacterHopLedge(thing, other);

        return true;
    }


    /* Death
    */

    /**
     * Standard Function to kill a Thing, which means marking it as dead and
     * clearing its numquads, resting, movement, and cycles. It will later be
     * marked as gone by its maintain* Function (Solids or Characters).
     * 
     * @param {Thing} thing
     */
    function killNormal(thing) {
        if (!thing) {
            return;
        }
        if (thing.title === "RivalBlocker") {
            console.log("Aha!");
            debugger;
        }

        thing.nocollide = thing.hidden = thing.dead = true;
        thing.alive = false;
        thing.numquads = 0;
        thing.movement = undefined;

        if (thing.EightBitter) {
            thing.EightBitter.TimeHandler.cancelAllCycles(thing);
            thing.EightBitter.ModAttacher.fireEvent("onKillNormal", thing);

            if (thing.id) {
                delete thing.EightBitter.MapScreener.thingsById[thing.id];
            }
        }
    }


    /* Activations
    */

    /**
     * 
     */
    function activateCutsceneTriggerer(thing, other) {
        if (!other.alive || thing.collidedTrigger == other) {
            return;
        }

        thing.collidedTrigger = other;
        thing.EightBitter.animatePlayerDialogFreeze(thing);

        if (!other.keepAlive) {
            other.alive = false;
            thing.EightBitter.killNormal(other);
        }

        if (other.cutscene) {
            thing.EightBitter.ScenePlayer.startCutscene(other.cutscene, {
                "player": thing,
                "triggerer": other
            });
        }

        if (other.routine) {
            thing.EightBitter.ScenePlayer.playRoutine(other.routine);
        }
    }

    /**
     * 
     */
    function activateThemePlayer(thing, other) {
        if (thing.EightBitter.GBSEmulator.getTheme() === other.theme) {
            return;
        }

        thing.EightBitter.GBSEmulator.play(other.theme);
    }

    /**
     * 
     */
    function activateCutsceneResponder(thing, other) {
        if (!thing.player || !other.alive) {
            return;
        }

        if (other.dialog) {
            thing.EightBitter.activateMenuTriggerer(thing, other);
            return;
        }

        thing.EightBitter.ScenePlayer.startCutscene(other.cutscene, {
            "player": thing,
            "triggerer": other
        });
    }

    /**
     * 
     */
    function activateMenuTriggerer(thing, other) {
        if (!other.alive || thing.collidedTrigger == other) {
            return;
        }

        var name = other.menu || "GeneralText",
            menu = thing.EightBitter.MenuGrapher.createMenu(name),
            dialog = other.dialog;

        thing.collidedTrigger = other;
        thing.EightBitter.animateCharacterPreventWalking(thing);

        if (!other.keepAlive) {
            other.alive = false;
            thing.EightBitter.killNormal(other);
        }

        if (dialog) {
            thing.EightBitter.MenuGrapher.addMenuDialog(
                name,
                dialog,
                function () {
                    var onStop;

                    if (other.pushSteps) {
                        onStop = other.pushSteps.slice();
                    }

                    thing.EightBitter.MenuGrapher.deleteMenu("GeneralText");

                    if (typeof other.pushDirection !== "undefined") {
                        onStop.push(function () {
                            delete thing.collidedTrigger;
                        });
                        thing.EightBitter.animateCharacterStartTurning(
                            thing, other.pushDirection, onStop
                        )
                    } else {
                        delete thing.collidedTrigger;
                    }
                }
            );
        }

        thing.EightBitter.MenuGrapher.setActiveMenu(name);
    }

    /**
     * 
     */
    function activateSightDetector(thing, other) {
        if (other.viewer.talking) {
            return;
        }
        other.viewer.talking = true;
        other.active = false;

        thing.EightBitter.MapScreener.blockInputs = true;

        thing.EightBitter.ScenePlayer.startCutscene("TrainerSpotted", {
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
    function activateTransporter(thing, other) {
        if (!thing.player || !other.active) {
            return;
        }

        var transport = other.transport,
            callback, args;

        if (typeof transport === "undefined") {
            throw new Error("No transport given to activateTransporter");
        }

        if (transport.constructor === String) {
            callback = thing.EightBitter.setLocation;
            args = [transport];
        } else if (typeof transport.map !== "undefined") {
            callback = thing.EightBitter.setMap;
            args = [transport.map, transport.location];
        } else if (typeof transport.location !== "undefined") {
            callback = thing.EightBitter.setLocation;
            args = [transport.location];
        } else {
            throw new Error("Unknown transport type:" + transport);
        }

        other.active = false;

        thing.EightBitter.animateFadeToColor(thing.EightBitter, {
            "color": "Black",
            "callback": callback.apply.bind(callback, thing.EightBitter, args)
        });
    }

    /**
     * 
     */
    function activateGymStatue(thing, other) {
        if (thing.direction !== 0) {
            return;
        }

        var gym = other.gym,
            leader = other.leader,
            dialog = [
                gym.toUpperCase() + " \n %%%%%%%POKEMON%%%%%%% GYM \n LEADER: " + leader.toUpperCase(),
                "WINNING TRAINERS: %%%%%%%RIVAL%%%%%%%"
            ];

        if (thing.EightBitter.StatsHolder.get("badges")[leader]) {
            dialog[1] += " \n %%%%%%%PLAYER%%%%%%%";
        }

        thing.EightBitter.MenuGrapher.createMenu("GeneralText");
        thing.EightBitter.MenuGrapher.addMenuDialog("GeneralText", dialog);
        thing.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }


    /* Physics
    */

    /**
     * 
     * 
     * @todo I would like this to be more elegant. 
     */
    function getDirectionBordering(thing, other) {
        if (
            Math.abs((thing.top) - (other.bottom - other.tolBottom))
            < thing.EightBitter.unitsize
        ) {
            return 0;
        }

        if (
            Math.abs(thing.right - other.left)
            < thing.EightBitter.unitsize
        ) {
            return 1;
        }

        if (
            Math.abs(thing.bottom - other.top)
            < thing.EightBitter.unitsize
        ) {
            return 2;
        }

        if (
            Math.abs(thing.left - other.right)
            < thing.EightBitter.unitsize
        ) {
            return 3;
        }
    }

    /**
     * 
     */
    function isThingWithinOther(thing, other) {
        return (
            thing.top >= other.top - thing.EightBitter.unitsize
            && thing.right <= other.right + thing.EightBitter.unitsize
            && thing.bottom <= other.bottom + thing.EightBitter.unitsize
            && thing.left >= other.left - thing.EightBitter.unitsize
        );
    }

    /**
     * 
     */
    function isThingWithinGrass(thing, other) {
        if (thing.right <= other.left) {
            return false;
        }

        if (thing.left >= other.right) {
            return false;
        }

        if (other.top > (
            thing.top + thing.heightGrass * thing.EightBitter.unitsize
        )) {
            return false;
        }

        if (other.bottom < (
            thing.top + thing.heightGrass * thing.EightBitter.unitsize
        )) {
            return false;
        }

        return true;
    }

    /**
     * 
     */
    function shiftCharacter(thing) {
        if (thing.xvel !== 0) {
            thing.bordering[1] = thing.bordering[3] = undefined;
        } else if (thing.yvel !== 0) {
            thing.bordering[0] = thing.bordering[2] = undefined;
        } else {
            return;
        }

        thing.EightBitter.shiftBoth(thing, thing.xvel, thing.yvel);
    }

    /**
     * 
     */
    function setPlayerDirection(thing, direction) {
        thing.direction = direction;
        thing.EightBitter.MapScreener.playerDirection = direction;
        thing.shouldWalk = true;
    }


    /* Spawning
    */

    /**
     * 
     * 
     * @remarks Should be the line after snaptogrid...
     */
    function spawnCharacter(thing) {
        if (thing.sight) {
            thing.sightDetector = thing.EightBitter.addThing("SightDetector", {
                "direction": thing.direction
            });
            thing.sightDetector.viewer = thing;
            thing.EightBitter.animatePositionSightDetector(thing);
        }

        if (thing.roaming) {
            thing.EightBitter.TimeHandler.addEvent(
                thing.EightBitter.activateCharacterRoaming,
                thing.EightBitter.NumberMaker.randomInt(70),
                thing
            );
        }
    }

    /**
     * 
     */
    function activateCharacterRoaming(thing) {
        if (!thing.alive) {
            return true;
        }

        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.activateCharacterRoaming,
            70 + thing.EightBitter.NumberMaker.randomInt(210),
            thing
        );

        if (thing.talking || thing.EightBitter.MenuGrapher.getActiveMenu()) {
            return;
        }

        thing.EightBitter.animateCharacterStartWalkingRandom(thing);
    }

    /**
     * 
     */
    function activateSpawner(thing) {
        thing.activate(thing);
    }

    /**
     * 
     */
    function spawnWindowDetector(thing) {
        if (!thing.EightBitter.checkWindowDetector(thing)) {
            thing.EightBitter.TimeHandler.addEventInterval(
                thing.EightBitter.checkWindowDetector, 7, Infinity, thing
            );
        }
    }

    /**
     * 
     */
    function checkWindowDetector(thing) {
        if (
            thing.bottom < 0
            || thing.left > thing.EightBitter.MapScreener.width
            || thing.top > thing.EightBitter.MapScreener.height
            || thing.right < 0
        ) {
            return false;
        }

        thing.activate(thing);
        thing.EightBitter.killNormal(thing);
        return true;
    }

    /**
     * 
     */
    function spawnAreaSpawner(thing) {
        var map = thing.EightBitter.MapsHandler.getMap(thing.map),
            area = map.areas[thing.area];

        if (area === thing.EightBitter.MapsHandler.getArea()) {
            thing.EightBitter.killNormal(thing);
            return;
        }

        if (
            area.spawnedBy
            && area.spawnedBy === thing.EightBitter.MapsHandler.getArea().spawnedBy
        ) {
            thing.EightBitter.killNormal(thing);
            return;
        }

        area.spawnedBy = thing.EightBitter.MapsHandler.getArea().spawnedBy;

        thing.EightBitter.activateAreaSpawner(thing, area);
    }

    /**
     * 
     */
    function activateAreaSpawner(thing, area) {
        var creation = area.creation,
            EightBitter = thing.EightBitter,
            MapsCreator = EightBitter.MapsCreator,
            MapScreener = EightBitter.MapScreener,
            MapsHandler = EightBitter.MapsHandler,
            QuadsKeeper = EightBitter.QuadsKeeper,
            areaCurrent = MapsHandler.getArea(),
            mapCurrent = MapsHandler.getMap(),
            prethingsCurrent = MapsHandler.getPreThings(),
            left = thing.left + thing.EightBitter.MapScreener.left,
            top = thing.top + thing.EightBitter.MapScreener.top,
            x, y, command, i;

        switch (thing.direction) {
            case 0:
                top -= area.height * thing.EightBitter.unitsize;
                break;
            case 1:
                left += thing.width * thing.EightBitter.unitsize;
                break;
            case 2:
                top += thing.height * thing.EightBitter.unitsize;
                break;
            case 3:
                left -= area.width * thing.EightBitter.unitsize;
                break;
        }

        x = left / EightBitter.unitsize + (thing.offsetX || 0);
        y = top / EightBitter.unitsize + (thing.offsetY || 0);

        EightBitter.expandMapBoundaries(EightBitter, area, x, y);

        for (i = 0; i < creation.length; i += 1) {
            // A copy of the command must be used to not modify the original 
            command = EightBitter.proliferate({
                "noBoundaryStretch": true,
                "areaName": area.name,
                "mapName": area.map.name
            }, creation[i]);

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
            QuadsKeeper.top / EightBitter.unitsize,
            QuadsKeeper.right / EightBitter.unitsize,
            QuadsKeeper.bottom / EightBitter.unitsize,
            QuadsKeeper.left / EightBitter.unitsize
        );

        area.spawned = true;
        EightBitter.killNormal(thing);

        //MapScreener.setVariables();
    }

    /**
     * 
     * 
     * @todo It would be nice to intelligently do this based on boundaries, but
     *       this works and that doesn't (easily / yet / without bugs).
     */
    function expandMapBoundaries(EightBitter, area, x, y) {
        EightBitter.MapScreener.scrollability = "both";
    }


    /* Menus
    */

    /**
     * 
     */
    function openPauseMenu() {
        var EightBitter = EightBittr.ensureCorrectCaller(this);

        EightBitter.MenuGrapher.createMenu("Pause");
        EightBitter.MenuGrapher.setActiveMenu("Pause");
        EightBitter.MenuGrapher.addMenuList("Pause", {
            "options": [{
                "text": "%%%%%%%POKEDEX%%%%%%%",
                "callback": EightBitter.openPokedexMenu.bind(EightBitter)
            }, {
                "text": "%%%%%%%POKEMON%%%%%%%",
                "callback": EightBitter.openPokemonMenu.bind(EightBitter)
            }, {
                "text": "ITEM",
                "callback": EightBitter.openItemsMenu.bind(EightBitter)
            }, {
                "text": "%%%%%%%PLAYER%%%%%%%",
                "callback": EightBitter.openPlayerMenu.bind(EightBitter)
            }, {
                "text": "SAVE",
                "callback": EightBitter.openSaveMenu.bind(EightBitter)
            }, {
                "text": "OPTION"
            }, {
                "text": "Exit",
                "callback": EightBitter.closePauseMenu.bind(EightBitter)
            }]
        });
    };

    /**
     * 
     */
    function closePauseMenu() {
        var EightBitter = EightBittr.ensureCorrectCaller(this);

        EightBitter.MenuGrapher.deleteMenu("Pause");
    };

    /**
     * 
     */
    function togglePauseMenu(player) {
        if (player.EightBitter.MenuGrapher.getActiveMenu()) {
            player.EightBitter.MenuGrapher.registerStart();
        } else if (player.EightBitter.MenuGrapher.getActiveMenu()) {
            player.EightBitter.closePauseMenu();
        } else {
            player.EightBitter.openPauseMenu();
        }
    }

    /**
     * 
     */
    function openPokedexMenu() {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            listings = EightBitter.StatsHolder.get("Pokedex");

        EightBitter.MenuGrapher.createMenu("Pokedex");
        EightBitter.MenuGrapher.setActiveMenu("Pokedex");
        EightBitter.MenuGrapher.addMenuList("Pokedex", {
            "options": listings.map(function (listing, i) {
                var characters = EightBitter.makeDigit(i + 1, 3, 0).split("");

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

        EightBitter.MenuGrapher.createMenu("PokedexOptions");
        EightBitter.MenuGrapher.addMenuList("PokedexOptions", {
            "options": [{
                "text": "DATA"
            }, {
                "text": "CRY"
            }, {
                "text": "AREA"
            }, {
                "text": "QUIT",
                "callback": EightBitter.MenuGrapher.registerB
            }]
        });
    };

    /**
     * 
     */
    function openPokedexListing(title, callback, settings) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            pokemon = EightBitter.MathDecider.getConstant("pokemon")[title],
            height = pokemon.height,
            feet = [].slice.call(height[0]).reverse().join(""),
            inches = [].slice.call(height[1]).reverse().join("");

        EightBitter.MenuGrapher.createMenu("PokedexListing", settings);
        EightBitter.MenuGrapher.createMenuThing("PokedexListingSprite", {
            "thing": title + "Front",
            "args": {
                "flipHoriz": true
            }
        });
        EightBitter.MenuGrapher.addMenuDialog(
            "PokedexListingName", title.toUpperCase()
        );
        EightBitter.MenuGrapher.addMenuDialog(
            "PokedexListingLabel", pokemon.label
        );
        EightBitter.MenuGrapher.addMenuDialog(
            "PokedexListingHeightFeet", feet
        );
        EightBitter.MenuGrapher.addMenuDialog(
            "PokedexListingHeightInches", inches
        );
        EightBitter.MenuGrapher.addMenuDialog(
            "PokedexListingWeight", pokemon.weight
        );
        EightBitter.MenuGrapher.addMenuDialog(
            "PokedexListingNumber",
            EightBitter.makeDigit(pokemon.number, 3, '0')
        );
        EightBitter.MenuGrapher.addMenuDialog(
            "PokedexListingInfo",
            pokemon.info[0],
            function () {
                EightBitter.MenuGrapher.createMenu("PokedexListingInfo");
                EightBitter.MenuGrapher.addMenuDialog(
                    "PokedexListingInfo",
                    pokemon.info[1],
                    function () {
                        EightBitter.MenuGrapher.deleteMenu("PokedexListing");
                        if (callback) {
                            callback();
                        }
                    }
                );
                EightBitter.MenuGrapher.setActiveMenu("PokedexListingInfo");
            }
        );

        EightBitter.MenuGrapher.setActiveMenu("PokedexListingInfo");
    }

    /**
     * 
     */
    function openPokemonMenu(backMenu, container) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            listings = EightBitter.StatsHolder.get("PokemonInParty"),
            references = EightBitter.MathDecider.getConstant("pokemon");

        EightBitter.MenuGrapher.createMenu("Pokemon", {
            "container": container,
            "backMenu": backMenu,
        });
        EightBitter.MenuGrapher.setActiveMenu("Pokemon");
        EightBitter.MenuGrapher.addMenuList("Pokemon", {
            "options": listings.map(function (listing, i) {
                var sprite = references[listing.title].sprite + "Pokemon",
                    barWidth = 25,
                    health = EightBitter.MathDecider.compute(
                        "widthHealthBar", barWidth, listing.HP, listing.HPNormal
                    );

                return {
                    "text": listing.title.split(""),
                    "things": [{
                        "thing": sprite,
                        "position": {
                            "offset": {
                                "left": 7.5,
                                "top": .5
                            }
                        }
                    }, {
                        "thing": "CharLevel",
                        "position": {
                            "offset": {
                                "left": 56,
                                "top": 1.5
                            }
                        }
                    }, {
                        "thing": "CharHP",
                        "position": {
                            "offset": {
                                "left": 20,
                                "top": 5.5
                            }
                        }
                    }, {
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
                    }, {
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
                    "textsFloating": [{
                        "text": String(listing.level),
                        "x": 44.25,
                        "y": 0
                    }, {
                        "text": listing.HP + "/ " + listing.HPNormal,
                        "x": 43.75,
                        "y": 4
                    }],
                };
            })
        });
    };

    /**
     * 
     */
    function openItemsMenu(settings) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            items = settings.items || EightBitter.StatsHolder.get("items");

        EightBitter.MenuGrapher.createMenu("Items", settings);
        EightBitter.MenuGrapher.addMenuList("Items", {
            "options": items.map(function (schema) {
                return {
                    "text": schema.item,
                    "textsFloating": [{
                        "text": [["Times"]],
                        "x": 32,
                        "y": 4.5
                    }, {
                        "text": makeDigit(schema.amount, 2, " "),
                        "x": 36.5,
                        "y": 4
                    }]
                };
            })
        });
        EightBitter.MenuGrapher.setActiveMenu("Items");

        console.warn("Once math.js contains item info, react to non-stackable items...");
    }

    /**
     * 
     */
    function openPlayerMenu() {
        var EightBitter = EightBittr.ensureCorrectCaller(this);

        EightBitter.MenuGrapher.createMenu("Player");
        EightBitter.MenuGrapher.setActiveMenu("Player");
    };

    /**
     * 
     */
    function openSaveMenu() {
        var EightBitter = EightBittr.ensureCorrectCaller(this);

        EightBitter.MenuGrapher.createMenu("Save");

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText", [
                "Would you like to SAVE the game?"
            ]
        );

        EightBitter.MenuGrapher.createMenu("Yes/No", {
            "backMenu": "Pause",
            "killOnB": ["GeneralText", "Save"]
        });
        EightBitter.MenuGrapher.addMenuList("Yes/No", {
            "options": [{
                "text": "YES",
                "callback": EightBitter.downloadSaveGame.bind(EightBitter)
            }, {
                "text": "NO",
                "callback": EightBitter.MenuGrapher.registerB
            }]
        });
        EightBitter.MenuGrapher.setActiveMenu("Yes/No");
    };

    /**
     * 
     */
    function openKeyboardMenu(settings) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            value = [
                settings.value || ["_", "_", "_", "_", "_", "_", "_"]
            ],
            onKeyPress = EightBitter.addKeyboardMenuValue.bind(EightBitter),
            onComplete = (settings.callback || onKeyPress).bind(EightBitter),
            menuKeyboard = EightBitter.MenuGrapher.createMenu("Keyboard", {
                "settings": settings,
                "onKeyPress": onKeyPress,
                "onComplete": onComplete,
                "ignoreB": true
            }),
            menuResults = EightBitter.MenuGrapher.getMenu("KeyboardResult"),
            lowercase = settings.lowercase,
            letters = lowercase
                ? EightBitter.keysLowercase
                : EightBitter.keysUppercase,
            options = letters.map(function (letter) {
                return {
                    "text": [letter],
                    "callback": letter !== "ED"
                        ? onKeyPress
                        : onComplete
                };
            });

        EightBitter.MenuGrapher.addMenuDialog("KeyboardTitle", [[
            settings.title || "",
        ]]);

        EightBitter.MenuGrapher.addMenuDialog("KeyboardResult", value);

        EightBitter.MenuGrapher.addMenuList("KeyboardKeys", {
            "options": options,
            "selectedIndex": settings.selectedIndex,
            "bottom": {
                "text": lowercase ? "UPPER CASE" : "lower case",
                "callback": EightBitter.switchKeyboardCase.bind(EightBitter),
                "position": {
                    "top": 40,
                    "left": 0
                }
            }
        });
        EightBitter.MenuGrapher.setActiveMenu("KeyboardKeys");

        menuResults.displayedValue = value.slice()[0];

        menuResults.completeValue = settings.completeValue || "";
        menuResults.selectedChild = settings.selectedChild || 0;
        menuResults.blinker = EightBitter.addThing(
            "CharMDash",
            menuResults.children[menuResults.selectedChild].left,
            menuResults.children[menuResults.selectedChild].top
        );
        menuResults.children.push(menuResults.blinker);
        menuResults.children[menuResults.selectedChild].hidden = true;
    }

    /**
     * 
     */
    function addKeyboardMenuValue() {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            menuKeys = EightBitter.MenuGrapher.getMenu("KeyboardKeys"),
            menuResult = EightBitter.MenuGrapher.getMenu("KeyboardResult"),
            child = menuResult.children[menuResult.selectedChild],
            selected = EightBitter.MenuGrapher.getMenuSelectedOption("KeyboardKeys");

        if (!child) {
            return;
        }

        EightBitter.killNormal(child);
        menuResult.children[menuResult.selectedChild] = EightBitter.addThing(
            selected.title,
            child.left,
            child.top
        );

        menuResult.displayedValue[menuResult.selectedChild] = selected.text[0];
        menuResult.completeValue += selected.text[0];
        menuResult.selectedChild += 1;

        if (menuResult.selectedChild < menuResult.children.length) {
            child = menuResult.children[menuResult.selectedChild];
            child.hidden = true;
        } else {
            menuResult.blinker.hidden = true;
            if (menuResult.selectedIndexOnFull) {
                console.log("something with menuKeys");
            }
        }

        EightBitter.setLeft(menuResult.blinker, child.left, child.top);
    }

    /**
     * 
     */
    function switchKeyboardCase() {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            keyboard = EightBitter.MenuGrapher.getMenu("Keyboard"),
            keyboardKeys = EightBitter.MenuGrapher.getMenu("KeyboardKeys"),
            keyboardResult = EightBitter.MenuGrapher.getMenu("KeyboardResult"),
            settings = keyboard.settings,
            i;

        settings.lowercase = !settings.lowercase;
        settings.value = keyboardResult.displayedValue;
        settings.selectedChild = keyboardResult.selectedChild;
        settings.selectedIndex = keyboardKeys.selectedIndex;

        EightBitter.openKeyboardMenu(settings);
    }


    /* Battles
    */

    /**
     * 
     */
    function startBattle(battleInfo) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            animations = battleInfo.animations || [
                "LineSpiral", "Flash"
            ],
            animation = EightBitter.NumberMaker.randomArrayMember(animations),
            player = battleInfo.player;

        if (!player) {
            battleInfo.player = player = {};
        }

        player.name = player.name || "%%%%%%%PLAYER%%%%%%%";
        player.sprite = player.sprite || "PlayerBack";
        player.category = player.category || "Trainer";
        player.actors = player.actors || EightBitter.StatsHolder.get("PokemonInParty");
        player.hasActors = typeof player.hasActors === "undefined"
            ? true : player.hasActors;

        EightBitter.GBSEmulator.play(battleInfo.theme || "Trainer Battle");

        EightBitter["cutsceneBattleTransition" + animation](EightBitter, {
            "callback": EightBitter.BattleMover.startBattle.bind(
                EightBitter.BattleMover, battleInfo
            )
        });
    }

    /**
     * 
     */
    function createPokemon(schema) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            level = typeof schema.levels !== "undefined"
                ? EightBitter.NumberMaker.randomArrayMember(schema.levels)
                : schema.level,
            pokemon = EightBitter.MathDecider.compute(
                "newPokemon", schema.title, level
            );

        if (schema.moves) {
            pokemon.moves = schema.moves;
        }

        return pokemon;
    }

    /**
     * 
     */
    function checkPlayerGrassBattle(thing) {
        if (!thing.grass || thing.EightBitter.MenuGrapher.getActiveMenu()) {
            return;
        }

        if (!thing.EightBitter.ThingHitter.checkHit(
            thing, thing.grass, thing.title, thing.grass.groupType
        )) {
            delete thing.grass;
            return;
        }

        if (!thing.EightBitter.MathDecider.compute(
            "doesGrassEncounterHappen", thing.grass
        )) {
            return;
        }

        thing.keys = thing.getKeys();
        thing.EightBitter.animateGrassBattleStart(thing, thing.grass);
    }

    /**
     * 
     */
    function chooseRandomWildPokemon(EightBitter, options) {
        var choice = EightBitter.NumberMaker.random(),
            sum = 0,
            i;

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
    function addBattleDisplayPokeballs(EightBitter, menu, battler, opposite) {
        var text = [],
            i;

        for (i = 0; i < battler.actors.length; i += 1) {
            text.push("Ball");
        }

        for (; i < 6; i += 1) {
            text.push("BallEmpty");
        }

        if (opposite) {
            text.reverse();
        }

        EightBitter.MenuGrapher.addMenuDialog(menu.name, [[text]]);
    }

    /**
     * 
     */
    function addBattleDisplayPokemonHealth(EightBitter, battlerName) {
        var battleInfo = EightBitter.BattleMover.getBattleInfo(),
            pokemon = battleInfo[battlerName].selectedActor,
            menu = [
                "Battle",
                battlerName[0].toUpperCase(),
                battlerName.slice(1),
                "Health"
            ].join("");

        EightBitter.MenuGrapher.createMenu(menu);
        EightBitter.MenuGrapher.createMenu(menu + "Title");
        EightBitter.MenuGrapher.createMenu(menu + "Level");
        EightBitter.MenuGrapher.createMenu(menu + "Amount");

        EightBitter.setBattleDisplayPokemonHealthBar(
            EightBitter,
            battlerName,
            pokemon.HP,
            pokemon.HPNormal
        );

        EightBitter.MenuGrapher.addMenuDialog(
            menu + "Title",
            pokemon.nickname
        );

        EightBitter.MenuGrapher.addMenuDialog(
            menu + "Level",
            String(pokemon.level)
        );
    }

    /**
     * 
     * 
     * @param {String} actor
     */
    function setBattleDisplayPokemonHealthBar(EightBitter, battlerName, hp, hpNormal) {
        var bar = EightBitter.getThingById(
                "HPBarFill" + battlerName[0].toUpperCase() + battlerName.slice(1)
            ),
            health = EightBitter.MathDecider.compute(
                "widthHealthBar", 25, hp, hpNormal
            );

        EightBitter.setWidth(bar, health);
        bar.hidden = health === 0;
    }

    /**
     * 
     */
    function animateBattleDisplayPokemonHealthBar(EightBitter, actorName, hpStart, hpEnd, hpNormal, callback) {
        var direction = hpStart > hpEnd ? -1 : 1,
            hpNew = Math.round(hpStart + direction);

        EightBitter.setBattleDisplayPokemonHealthBar(
            EightBitter, actorName, hpNew, hpNormal
        );

        if (hpNew === hpEnd) {
            if (callback) {
                callback();
            }
            return;
        }

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateBattleDisplayPokemonHealthBar,
            2,
            EightBitter,
            actorName,
            hpNew,
            hpEnd,
            hpNormal,
            callback
        );
    }

    /* Cutscenes
    */

    /**
     * 
     */
    function cutsceneBattleEntrance(EightBitter, settings) {
        var things = settings.things,
            battleInfo = settings.battleInfo,
            player = things.player,
            opponent = things.opponent,
            menu = EightBitter.MenuGrapher.getMenu("BattleDisplayInitial"),
            playerX, opponentX, playerGoal, opponentGoal,
            timeout = 70;

        battleInfo.player.selectedIndex = 0;
        battleInfo.player.selectedActor = battleInfo.player.actors[0];
        battleInfo.opponent.selectedIndex = 0;
        battleInfo.opponent.selectedActor = battleInfo.opponent.actors[0];

        player.opacity = 0;
        opponent.opacity = 0;

        EightBitter.setLeft(player, menu.right + player.width * EightBitter.unitsize);
        EightBitter.setRight(opponent, menu.left);
        EightBitter.setTop(opponent, menu.top);

        // They should be visible halfway through (2 * (1 / timeout))
        EightBitter.animateFadeAttribute(player, "opacity", 2 / timeout, 1, 1);
        EightBitter.animateFadeAttribute(opponent, "opacity", 2 / timeout, 1, 1);

        playerX = EightBitter.getMidX(player);
        opponentX = EightBitter.getMidX(opponent);
        playerGoal = menu.left + player.width * EightBitter.unitsize / 2;
        opponentGoal = menu.right - opponent.width * EightBitter.unitsize / 2;

        EightBitter.animateFadeHorizontal(
            player, (playerGoal - playerX) / timeout, playerGoal, 1
        );

        EightBitter.animateFadeHorizontal(
            opponent, (opponentGoal - opponentX) / timeout, opponentGoal, 1
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.ScenePlayer.bindRoutine("OpeningText"),
            timeout
        );

        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneBattleOpeningText(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            textStart = battleInfo.textStart,
            nextRoutine, callback;

        if (settings.battleInfo.opponent.hasActors) {
            nextRoutine = "EnemyIntro";
        } else {
            nextRoutine = "PlayerIntro";
        }

        if (battleInfo.automaticMenus) {
            callback = EightBitter.TimeHandler.addEvent.bind(
                EightBitter.TimeHandler,
                EightBitter.ScenePlayer.playRoutine,
                70,
                nextRoutine
            );
        } else {
            callback = EightBitter.ScenePlayer.bindRoutine(nextRoutine);
        }

        EightBitter.MenuGrapher.createMenu("BattlePlayerHealth");
        EightBitter.addBattleDisplayPokeballs(
            EightBitter,
            EightBitter.MenuGrapher.getMenu("BattlePlayerHealth"),
            battleInfo.player
        );

        if (battleInfo.opponent.hasActors) {
            EightBitter.MenuGrapher.createMenu("BattleOpponentHealth");
            EightBitter.addBattleDisplayPokeballs(
                EightBitter,
                EightBitter.MenuGrapher.getMenu("BattleOpponentHealth"),
                battleInfo.player,
                true
            );
        } else {
            EightBitter.addBattleDisplayPokemonHealth(EightBitter, "opponent")
        }

        EightBitter.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": battleInfo.automaticMenus
        });
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            textStart[0] + battleInfo.opponent.name.toUpperCase() + textStart[1],
            callback
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneBattleEnemyIntro(EightBitter, settings) {
        var things = settings.things,
            opponent = things.opponent,
            menu = EightBitter.MenuGrapher.getMenu("GeneralText"),
            opponentX = EightBitter.getMidX(opponent),
            opponentGoal = menu.right + opponent.width * EightBitter.unitsize / 2,
            battleInfo = settings.battleInfo,
            callback = battleInfo.opponent.hasActors
                ? "OpponentSendOut"
                : "PlayerIntro",
            timeout = 49;

        EightBitter.animateFadeHorizontal(
            opponent, (opponentGoal - opponentX) / timeout, opponentGoal, 1
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateFadeAttribute,
            (timeout / 2) | 0,
            opponent,
            "opacity",
            -2 / timeout,
            0,
            1
        );

        EightBitter.MenuGrapher.deleteMenu("BattleOpponentHealth");
        EightBitter.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true
        });
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                battleInfo.textOpponentSendOut[0]
                + battleInfo.opponent.name
                + battleInfo.textOpponentSendOut[1]
                + battleInfo.opponent.actors[0].nickname
                + battleInfo.textOpponentSendOut[2]
            ]
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        EightBitter.TimeHandler.addEvent(
            EightBitter.ScenePlayer.bindRoutine(callback, {
                "nextRoutine": "PlayerIntro",
            }),
            timeout
        );
    }

    /**
     * 
     */
    function cutsceneBattlePlayerIntro(EightBitter, settings) {
        var things = settings.things,
            player = things.player,
            menu = EightBitter.MenuGrapher.getMenu("GeneralText"),
            playerX = EightBitter.getMidX(player),
            playerGoal = menu.left - player.width * EightBitter.unitsize / 2,
            battleInfo = settings.battleInfo,
            timeout = 24;

        EightBitter.MenuGrapher.deleteMenu("BattlePlayerHealth");

        if (!battleInfo.player.hasActors) {
            EightBitter.ScenePlayer.playRoutine("ShowPlayerMenu");
            return;
        }

        EightBitter.animateFadeHorizontal(
            player, (playerGoal - playerX) / timeout, playerGoal, 1
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateFadeAttribute,
            (timeout / 2) | 0,
            player,
            "opacity",
            -2 / timeout,
            0,
            1
        );

        EightBitter.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true
        });
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                battleInfo.textPlayerSendOut[0]
                + battleInfo.player.actors[0].title
                + battleInfo.textPlayerSendOut[1]
            ]
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        EightBitter.TimeHandler.addEvent(
            EightBitter.ScenePlayer.bindRoutine(
                "PlayerSendOut",
                {
                    "nextRoutine": "ShowPlayerMenu"
                }
            ),
            timeout
        );
    }

    /**
     * 
     */
    function cutsceneBattleShowPlayerMenu(EightBitter, settings) {
        EightBitter.MenuGrapher.deleteMenu("Yes/No");

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.BattleMover.showPlayerMenu();

        if (settings.battleInfo.onShowPlayerMenu) {
            settings.battleInfo.onShowPlayerMenu(EightBitter);
        }
    }

    /**
     * 
     */
    function cutsceneBattleOpponentSendOut(EightBitter, settings) {
        var menu = settings.things.menu,
            left = menu.right - EightBitter.unitsize * 8,
            top = menu.top + EightBitter.unitsize * 32;

        console.warn("Should reset *Normal statistics for opponent Pokemon.");

        settings.opponentLeft = left;
        settings.opponentTop = top;

        EightBitter.MenuGrapher.setActiveMenu(undefined);

        EightBitter.animateSmokeSmall(
            EightBitter,
            left,
            top,
            EightBitter.ScenePlayer.bindRoutine(
                "OpponentSendOutAppear",
                settings.routineArguments
            )
        );
    }

    /**
     * 
     */
    function cutsceneBattleOpponentSendOutAppear(EightBitter, settings) {
        var opponentInfo = settings.battleInfo.opponent,
            pokemonInfo = opponentInfo.actors[opponentInfo.selectedIndex],
            pokemon = EightBitter.BattleMover.setThing(
                "opponent", pokemonInfo.title + "Front"
            );

        console.log("Should make the zoom-in animation for appearing Pokemon...");

        EightBitter.addBattleDisplayPokemonHealth(EightBitter, "opponent");

        EightBitter.ScenePlayer.playRoutine(
            settings.routineArguments.nextRoutine
        );
    }

    /**
     * 
     */
    function cutsceneBattlePlayerSendOut(EightBitter, settings) {
        var menu = settings.things.menu,
            left = menu.left + EightBitter.unitsize * 8,
            top = menu.bottom - EightBitter.unitsize * 8;

        console.warn("Should reset *Normal statistics for player Pokemon.");

        settings.playerLeft = left;
        settings.playerTop = top;

        EightBitter.MenuGrapher.setActiveMenu(undefined);

        EightBitter.animateSmokeSmall(
            EightBitter,
            left,
            top,
            EightBitter.ScenePlayer.bindRoutine(
                "PlayerSendOutAppear",
                settings.routineArguments
            )
        );
    }

    /**
     * 
     */
    function cutsceneBattlePlayerSendOutAppear(EightBitter, settings) {
        var playerInfo = settings.battleInfo.player,
            pokemonInfo = playerInfo.selectedActor,
            pokemon = EightBitter.BattleMover.setThing(
                "player", pokemonInfo.title + "Back"
            );

        console.log("Should make the zoom-in animation for appearing Pokemon...");

        EightBitter.addBattleDisplayPokemonHealth(
            EightBitter, "player", playerInfo.selectedActor
        );

        EightBitter.MenuGrapher.createMenu("BattlePlayerHealthNumbers");
        EightBitter.MenuGrapher.addMenuDialog(
            "BattlePlayerHealthNumbers",
            [
                String(pokemonInfo.HP).split("").reverse().join(""),
                String(pokemonInfo.HPNormal + "/").split("").reverse().join("")
            ].join(" ")
        );

        EightBitter.ScenePlayer.playRoutine(settings.routineArguments.nextRoutine);
    }

    /**
     * 
     */
    function cutsceneBattleMovePlayer(EightBitter, settings) {
        var player = settings.battleInfo.player,
            playerActor = player.selectedActor,
            opponent = settings.battleInfo.opponent,
            opponentActor = opponent.selectedActor,
            routineArguments = settings.routineArguments,
            choice = routineArguments.choicePlayer;

        routineArguments.damage = EightBitter.MathDecider.compute(
            "damage", choice, playerActor, opponentActor
        );

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                playerActor.nickname + " used " + choice + "!"
            ],
            EightBitter.ScenePlayer.bindRoutine(
                "MovePlayerAnimate", routineArguments
            )
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneBattleMovePlayerAnimate(EightBitter, settings) {
        var routineArguments = settings.routineArguments,
            choice = routineArguments.choicePlayer,
            move = EightBitter.MathDecider.getConstant("moves")[choice];

        routineArguments.attackerName = "player";
        routineArguments.defenderName = "opponent";

        routineArguments.callback = function () {
            var callback;

            routineArguments.movePlayerDone = true;

            if (routineArguments.moveOpponentDone) {
                callback = function () {
                    routineArguments.movePlayerDone = false;
                    routineArguments.moveOpponentDone = false;
                    EightBitter.MenuGrapher.createMenu("GeneralText");
                    EightBitter.BattleMover.showPlayerMenu();
                };
            } else {
                callback = EightBitter.TimeHandler.addEvent.bind(
                    EightBitter.TimeHandler,
                    EightBitter.ScenePlayer.bindRoutine(
                        "MoveOpponent", settings.routineArguments
                    ),
                    7
                );
            }

            EightBitter.ScenePlayer.playRoutine("Damage", {
                "battlerName": "opponent",
                "damage": routineArguments.damage,
                "callback": callback
            });
        };

        // @todo: When all moves have been implemented, this will be simplified.
        if (!EightBitter.ScenePlayer.getOtherRoutine("Attack" + choice)) {
            console.warn(choice + " attack animation not implemented...");
            routineArguments.callback();
        } else {
            EightBitter.ScenePlayer.playRoutine(
                "Attack" + choice.replace(" ", ""), routineArguments
            );
        }
    }

    /**
     * 
     */
    function cutsceneBattleMoveOpponent(EightBitter, settings) {
        var opponent = settings.battleInfo.opponent,
            opponentActor = opponent.selectedActor,
            player = settings.battleInfo.player,
            playerActor = player.selectedActor,
            routineArguments = settings.routineArguments,
            choice = routineArguments.choiceOpponent;

        routineArguments.damage = EightBitter.MathDecider.compute(
            "damage", choice, opponentActor, playerActor
        );

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [opponent.selectedActor.nickname + " used " + choice + "!"],
            EightBitter.ScenePlayer.bindRoutine(
                "MoveOpponentAnimate", routineArguments
            )
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneBattleMoveOpponentAnimate(EightBitter, settings) {
        var routineArguments = settings.routineArguments,
            choice = routineArguments.choiceOpponent,
            move = EightBitter.MathDecider.getConstant("moves")[choice];

        routineArguments.attackerName = "opponent";
        routineArguments.defenderName = "player";

        routineArguments.callback = function () {
            var callback;

            routineArguments.moveOpponentDone = true;

            if (routineArguments.movePlayerDone) {
                callback = function () {
                    routineArguments.movePlayerDone = false;
                    routineArguments.moveOpponentDone = false;
                    EightBitter.MenuGrapher.createMenu("GeneralText");
                    EightBitter.BattleMover.showPlayerMenu();
                };
            } else {
                callback = EightBitter.TimeHandler.addEvent.bind(
                    EightBitter.TimeHandler,
                    EightBitter.ScenePlayer.bindRoutine(
                        "MovePlayer", settings.routineArguments
                    ),
                    7
                );
            }

            EightBitter.ScenePlayer.playRoutine("Damage", {
                "battlerName": "player",
                "damage": routineArguments.damage,
                "callback": callback
            });
        };

        // @todo: When all moves have been implemented, this will be simplified.
        if (!EightBitter.ScenePlayer.getOtherRoutine("Attack" + choice)) {
            console.warn(choice + " attack animation not implemented...");
            routineArguments.callback();
        } else {
            EightBitter.ScenePlayer.playRoutine(
                "Attack" + choice.replace(" ", ""), routineArguments
            );
        }
    }

    /**
     * 
     */
    function cutsceneBattleDamage(EightBitter, settings) {
        var battlerName = settings.routineArguments.battlerName,
            damage = settings.routineArguments.damage,
            battleInfo = EightBitter.BattleMover.getBattleInfo(),
            battler = battleInfo[battlerName],
            actor = battler.selectedActor,
            hpStart = actor.HP,
            hpEnd = Math.max(hpStart - damage, 0),
            callback = hpEnd === 0
                ? EightBitter.TimeHandler.addEvent.bind(
                    EightBitter.TimeHandler,
                    EightBitter.ScenePlayer.bindRoutine("PokemonFaints", {
                        "battlerName": battlerName
                    }),
                    49
                )
                : settings.routineArguments.callback;

        if (damage !== 0) {
            EightBitter.animateBattleDisplayPokemonHealthBar(
                EightBitter,
                battlerName,
                hpStart,
                hpEnd,
                actor.HPNormal,
                callback
            );

            actor.HP = hpEnd;
        } else {
            callback(EightBitter);
        }
    }

    /**
     * 
     */
    function cutsceneBattlePokemonFaints(EightBitter, settings) {
        var routineArguments = settings.routineArguments,
            battlerName = routineArguments.battlerName,
            battleInfo = EightBitter.BattleMover.getBattleInfo(),
            actor = battleInfo[battlerName].selectedActor,
            thing = settings.things[battlerName],
            blank = EightBitter.ObjectMaker.make("WhiteSquare", {
                "width": thing.width * thing.scale,
                "height": thing.height * thing.scale
            }),
            texts = EightBitter.GroupHolder.getGroup("Text"),
            background = EightBitter.BattleMover.getBackgroundThing(),
            backgroundIndex = texts.indexOf(background),
            nextRoutine = battlerName === "player"
                ? "AfterPlayerPokemonFaints" : "AfterOpponentPokemonFaints"

        EightBitter.addThing(
            blank,
            thing.left,
            thing.top + thing.height * thing.scale * thing.EightBitter.unitsize
        );

        EightBitter.arrayToIndex(blank, texts, backgroundIndex + 1);
        EightBitter.arrayToIndex(thing, texts, backgroundIndex + 1);

        EightBitter.animateFadeVertical(
            thing,
            EightBitter.unitsize * 2,
            EightBitter.getMidY(thing) + thing.height * thing.scale * EightBitter.unitsize,
            1,
            function () {
                EightBitter.killNormal(thing);
                EightBitter.killNormal(blank);
                EightBitter.MenuGrapher.createMenu("GeneralText");
                EightBitter.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        actor.nickname + " fainted!"
                    ],
                    EightBitter.ScenePlayer.bindRoutine(
                        nextRoutine, routineArguments
                    )
                );
                EightBitter.MenuGrapher.setActiveMenu("GeneralText");
            }
        );
    }

    /**
     * 
     */
    function cutsceneBattleAfterPlayerPokemonFaints(EightBitter, settings) {
        var actors = EightBitter.BattleMover.getBattleInfo(),
            actorAvailable = EightBitter.checkArrayMembersIndex(actors, "HP");

        if (actorAvailable) {
            EightBitter.ScenePlayer.playRoutine("PlayerChoosesPokemon");
        } else {
            EightBitter.ScenePlayer.playRoutine("Defeat");
        }
    }

    /**
     * 
     */
    function cutsceneBattleAfterOpponentPokemonFaints(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            opponent = battleInfo.opponent,
            actorAvailable = EightBitter.checkArrayMembersIndex(
                opponent.actors, "HP"
            ),
            experienceGained = EightBitter.MathDecider.compute(
                "experienceGained", battleInfo.player, battleInfo.opponent
            ),
            callback;

        if (actorAvailable) {
            callback = EightBitter.ScenePlayer.bindRoutine(
                "OpponentSwitchesPokemon"
            )
        } else {
            callback = EightBitter.ScenePlayer.bindRoutine("Victory");
        }

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    battleInfo.player.selectedActor.nickname,
                    "gained",
                    experienceGained,
                    "EXP. points!"
                ].join(" ")
            ],
            EightBitter.ScenePlayer.bindRoutine("ExperienceGain", {
                "experienceGained": experienceGained,
                "callback": callback
            })
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneBattleOpponentSwitchesPokemon(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            opponent = battleInfo.opponent;

        opponent.selectedIndex += 1;
        opponent.selectedActor = opponent.actors[opponent.selectedIndex];

        EightBitter.MenuGrapher.createMenu("GeneralText", {
            "deleteOnFinish": false
        })
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                opponent.name + " is \n about to use " + opponent.selectedActor.nickname + "!",
                "Will %%%%%%%PLAYER%%%%%%% change %%%%%%%POKEMON%%%%%%%?"
            ],
            function () {
                EightBitter.MenuGrapher.createMenu("Yes/No");
                EightBitter.MenuGrapher.addMenuList("Yes/No", {
                    "options": [{
                        "text": "Yes",
                        "callback": EightBitter.ScenePlayer.bindRoutine(
                            "PlayerSwitchesPokemon", {
                                "nextRoutine": "OpponentSendOut"
                            }
                        )
                    }, {
                        "text": "No",
                        "callback": EightBitter.ScenePlayer.bindRoutine(
                            "OpponentSendOut", {
                                "nextRoutine": "ShowPlayerMenu"
                            }
                        )
                    }]
                });
                EightBitter.MenuGrapher.setActiveMenu("Yes/No");
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText")

    }

    /**
     * 
     */
    function cutsceneBattleExperienceGain(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            routineArguments = settings.routineArguments,
            gains = routineArguments.experienceGained,
            actor = battleInfo.player.selectedActor,
            experience = actor.experience;

        console.warn("Experience gain is hardcoded to the current actor...");

        experience.current += gains;
        experience.remaining -= gains;

        if (experience.remaining < 0) {
            gains -= experience.remaining;
            EightBitter.ScenePlayer.playRoutine("LevelUp", {
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
    function cutsceneBattleLevelUp(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            routineArguments = settings.routineArguments,
            gains = routineArguments.experienceGained,
            actor = battleInfo.player.selectedActor;

        actor.level += 1;
        actor.experience = EightBitter.MathDecider.compute(
            "newPokemonExperience", actor.title, actor.level
        );

        console.warn("Leveling up does not yet increase stats...");

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                actor.nickname + " grew to level " + actor.level + "!"
            ],
            EightBitter.ScenePlayer.bindRoutine(
                "LevelUpStats", routineArguments
            )
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneBattleLevelUpStats(EightBitter, settings) {
        var routineArguments = settings.routineArguments,
            statistics = EightBitter.MathDecider.getConstant("statisticNames")
                .filter(function (statistic) {
                    return statistic !== "HP";
                }),
            actor = settings.battleInfo.player.selectedActor,
            numStatistics = statistics.length,
            top, left, i;

        for (i = 0; i < numStatistics; i += 1) {
            statistics.push(EightBitter.makeDigit(actor[statistics[i]], 3, " "));
            statistics[i] = statistics[i].toUpperCase();
        }

        EightBitter.MenuGrapher.createMenu("LevelUpStats", {
            "container": "BattleDisplayInitial",
            "position": {
                "horizontal": "right",
                "vertical": "bottom",
                "offset": {
                    "left": 4
                }
            },
            "onMenuDelete": routineArguments.callback,
            "childrenSchemas": statistics.map(function (string, i) {
                if (i < numStatistics) {
                    top = i * 8 + 4;
                    left = 8;
                } else {
                    top = (i - numStatistics + 1) * 8;
                    left = 24;
                }

                return {
                    "type": "text",
                    "words": [string],
                    "position": {
                        "offset": {
                            "top": top - .5,
                            "left": left
                        }
                    }
                };
            })
        });
        EightBitter.MenuGrapher.addMenuDialog("LevelUpStats");
        EightBitter.MenuGrapher.setActiveMenu("LevelUpStats");

        console.warn("For stones, LevelUpStats should be taken out of battles.");
    }

    /**
     * 
     */
    function cutsceneBattlePlayerChoosesPokemon(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("Pokemon", {
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
    function cutsceneBattleExitFail(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            "No! There's no running from a trainer battle!",
            EightBitter.ScenePlayer.bindRoutine("BattleExitFailReturn")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneBattleExitFailReturn(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.BattleMover.showPlayerMenu();
    }

    /**
     * 
     */
    function cutsceneBattleVictory(EightBitter, settings) {
        var battleInfo = EightBitter.BattleMover.getBattleInfo(),
            opponent = battleInfo.opponent;

        EightBitter.GBSEmulator.play(EightBitter.MapScreener.theme);

        if (!opponent.hasActors) {
            EightBitter.BattleMover.closeBattle(
                EightBitter.animateFadeFromColor.bind(
                    EightBitter, EightBitter, {
                        "color": "White"
                    }
                )
            );
            return;
        }

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% defeated " + opponent.name + "!"
            ],
            EightBitter.ScenePlayer.bindRoutine("VictorySpeech")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneBattleVictorySpeech(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            menu = EightBitter.MenuGrapher.getMenu("BattleDisplayInitial"),
            timeout = 35,
            opponent = EightBitter.BattleMover.setThing(
                "opponent", battleInfo.opponent.sprite
            ),
            opponentX, opponentGoal;

        opponent.opacity = 0;

        EightBitter.setTop(opponent, menu.top)
        EightBitter.setLeft(opponent, menu.right);
        opponentX = EightBitter.getMidX(opponent);
        opponentGoal = menu.right - opponent.width * EightBitter.unitsize / 2;

        EightBitter.animateFadeAttribute(
            opponent, "opacity", 4 / timeout, 1, 1
        );
        EightBitter.animateFadeHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1,
            function () {
                EightBitter.MenuGrapher.createMenu("GeneralText");
                EightBitter.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    battleInfo.textVictory,
                    EightBitter.ScenePlayer.bindRoutine("VictoryWinnings")
                );
                EightBitter.MenuGrapher.setActiveMenu("GeneralText");
            }
        );
    }

    /**
     * 
     */
    function cutsceneBattleVictoryWinnings(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            reward = settings.battleInfo.opponent.reward,
            animationSettings = {
                "color": "White"
            },
            callback = EightBitter.BattleMover.closeBattle.bind(
                EightBitter.BattleMover,
                EightBitter.animateFadeFromColor.bind(
                    EightBitter, EightBitter, animationSettings
                )
            );

        if (battleInfo.giftAfterBattle) {
            EightBitter.addItemToBag(EightBitter, battleInfo.giftAfterBattle);
        }

        if (battleInfo.badge) {
            EightBitter.StatsHolder.get("badges")[battleInfo.badge] = true;
        }

        if (battleInfo.textAfterBattle) {
            animationSettings.callback = function () {
                EightBitter.MenuGrapher.createMenu("GeneralText");
                EightBitter.MenuGrapher.addMenuDialog(
                    "GeneralText", battleInfo.textAfterBattle
                );
                EightBitter.MenuGrapher.setActiveMenu("GeneralText");
            };
        }

        if (!reward) {
            callback();
            return;
        }

        EightBitter.StatsHolder.increase("money", reward);

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got $" + reward + " for winning!"
            ],
            callback
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneBattleDefeat(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            message = [
                "%%%%%%%PLAYER%%%%%%% is out of useable %%%%%%%POKEMON%%%%%%%!"
            ],
            transport, callback;

        if (!battleInfo.noBlackout) {
            message.push("%%%%%%%PLAYER%%%%%%% blacked out!");
            transport = EightBitter.StatsHolder.get("lastPokecenter");
            callback = EightBitter.setMap.bind(
                EightBitter, transport.map, transport.location
            )
        } else {
            callback = EightBitter.BattleMover.closeBattle;
        }

        EightBitter.GBSEmulator.playTheme(EightBitter.MenuScreener.theme);

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            message,
            EightBitter.animateFadeToColor.bind(EightBitter, EightBitter, {
                "color": "Black",
                "callback": callback
            })
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        EightBitter.ScenePlayer.stopCutscene();
    }

    /**
     * 
     */
    function cutsceneBattleComplete(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            keptThings, thing, i;

        EightBitter.MapScreener.blockInputs = false;

        if (battleInfo.keptThings) {
            keptThings = battleInfo.keptThings.slice(),
            keptThings.push(EightBitter.player);

            for (i = 0; i < keptThings.length; i += 1) {
                if (keptThings[i].constructor === String) {
                    keptThings[i] = EightBitter.getThingById(keptThings[i]);
                }
                EightBitter.GroupHolder.switchObjectGroup(
                    keptThings[i], "Text", keptThings[i].groupType
                );
            }
        }

        EightBitter.StatsHolder.set("PokemonInParty", battleInfo.player.actors);

        if (settings.nextCutscene) {
            EightBitter.ScenePlayer.startCutscene(
                settings.nextCutscene, settings.nextCutsceneSettings
            );
        }
    }

    /**
     * 
     */
    function cutsceneBattleTransitionLineSpiral(EightBitter, settings) {
        var unitsize = EightBitter.unitsize,
            divisor = settings.divisor || 15,
            screenWidth = EightBitter.MapScreener.width,
            screenHeight = EightBitter.MapScreener.height,
            width = Math.ceil(screenWidth / divisor),
            height = Math.ceil(screenHeight / divisor),
            numTimes = 0,
            direction = 2,
            things = [],
            keptThings = settings.keptThings,
            thing, difference, destination,
            i;

        if (keptThings) {
            keptThings = keptThings.slice();

            for (i = 0; i < keptThings.length; i += 1) {
                if (keptThings[i].constructor === String) {
                    keptThings[i] = EightBitter.getThingById(keptThings[i]);
                }
                EightBitter.GroupHolder.switchObjectGroup(
                    keptThings[i], keptThings[i].groupType, "Text"
                );
            }
        }

        function addThing() {
            if (numTimes >= (divisor / 2) | 0) {
                if (settings.callback) {
                    settings.callback();
                    things.forEach(EightBitter.killNormal);
                }
                return;
            }

            switch (direction) {
                case 0:
                    thing = EightBitter.ObjectMaker.make("BlackSquare", {
                        "width": width / unitsize,
                        "height": screenHeight / unitsize,
                    });
                    EightBitter.addThing(
                        thing,
                        screenWidth - ((numTimes + 1) * width),
                        screenHeight - ((numTimes + 1) * divisor)
                    );
                    difference = -height;
                    destination = numTimes * height;
                    break;

                case 1:
                    thing = EightBitter.ObjectMaker.make("BlackSquare", {
                        "width": screenWidth / unitsize,
                        "height": height / unitsize
                    });
                    EightBitter.addThing(
                        thing,
                        numTimes * divisor - screenWidth,
                        screenHeight - (numTimes + 1) * height
                    );
                    difference = width;
                    destination = screenWidth - numTimes * width;
                    break;

                case 2:
                    thing = EightBitter.ObjectMaker.make("BlackSquare", {
                        "width": width / unitsize,
                        "height": screenHeight / unitsize
                    });
                    EightBitter.addThing(
                        thing,
                        numTimes * width,
                        numTimes * height - screenHeight
                    );
                    difference = height;
                    destination = screenHeight - numTimes * height;
                    break;

                case 3:
                    thing = EightBitter.ObjectMaker.make("BlackSquare", {
                        "width": screenWidth / unitsize,
                        "height": height / unitsize
                    });
                    EightBitter.addThing(
                        thing,
                        screenWidth - numTimes * divisor,
                        numTimes * height
                    );
                    difference = -width;
                    destination = numTimes * width;
                    break;
            }

            things.push(thing);

            if (keptThings) {
                for (i = 0; i < keptThings.length; i += 1) {
                    EightBitter.arrayToEnd(
                        keptThings[i], EightBitter.GroupHolder.getTextGroup()
                    );
                }
            }

            EightBitter.TimeHandler.addEventInterval(function () {
                if (direction % 2 === 1) {
                    EightBitter.shiftHoriz(thing, difference);
                } else {
                    EightBitter.shiftVert(thing, difference);
                }

                if (direction === 1 || direction === 2) {
                    if (thing[EightBitter.directionNames[direction]] < destination) {
                        return;
                    }
                } else {
                    if (thing[EightBitter.directionNames[direction]] > destination) {
                        return;
                    }
                }

                direction = (direction + 3) % 4;
                if (direction === 2) {
                    numTimes += 1;
                }
                addThing();
                return true;
            }, 1, Infinity);
        }

        addThing();
    }

    /**
     * 
     * 
     * @remarks Three [black, white] flashes, then the spiral
     */
    function cutsceneBattleTransitionFlash(EightBitter, settings) {
        var flashes = settings.flashes || 6,
            flashColors = settings.flashColors || ["Black", "White"],
            callback = settings.callback,
            change = settings.change || .33,
            speed = settings.speed || 1,
            repeater = function () {
                if (completed >= flashes) {
                    if (callback) {
                        callback();
                    }
                    return;
                }

                color = flashColors[completed % flashColors.length];
                completed += 1;

                EightBitter.animateFadeToColor(EightBitter, {
                    "color": color,
                    "change": change,
                    "speed": speed,
                    "callback": EightBitter.animateFadeFromColor.bind(
                        EightBitter, EightBitter, {
                            "color": color,
                            "change": change,
                            "speed": speed,
                            "callback": repeater
                        }
                    )
                });
            },
            completed = 0,
            color;

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
    function cutsceneBattleTransitionTwist(EightBitter, settings) {

    }

    /**
     * 
     */
    function cutsceneBattleTransitionFlashTwist(EightBitter, settings) {
        EightBitter.cutsceneBattleTransitionFlash(EightBitter, {
            "callback": EightBitter.cutsceneBattleTransitionTwist.bind(
                EightBitter, settings
            )
        });
    }

    /**
     * 
     */
    function cutsceneBattleChangeStatistic(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            routineArguments = settings.routineArguments,
            defenderName = routineArguments.defenderName,
            defender = battleInfo[defenderName].selectedActor,
            defenderLabel = defenderName === "opponent"
                ? "Enemy " : "",
            statistic = routineArguments.statistic,
            amount = routineArguments.amount,
            amountLabel;

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
        }

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
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
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /* Battle attack animations
    */

    /**
     * 
     */
    function cutsceneBattleAttackGrowl(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            routineArguments = settings.routineArguments,
            attackerName = routineArguments.attackerName,
            defenderName = routineArguments.defenderName,
            attacker = EightBitter.BattleMover.getThing(attackerName),
            defender = EightBitter.BattleMover.getThing(defenderName),
            direction = attackerName === "player" ? 1 : -1,
            notes = [
                EightBitter.ObjectMaker.make("Note"),
                EightBitter.ObjectMaker.make("Note")
            ];

        EightBitter.ScenePlayer.playRoutine(
            "ChangeStatistic",
            EightBitter.proliferate({
                "callback": routineArguments.callback,
                "defenderName": defenderName,
                "statistic": "Attack",
                "amount": -1
            }, routineArguments)
        );
    }

    /**
     * 
     */
    function cutsceneBattleAttackTackle(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            routineArguments = settings.routineArguments,
            attackerName = routineArguments.attackerName,
            defenderName = routineArguments.defenderName,
            attacker = EightBitter.BattleMover.getThing(attackerName),
            defender = EightBitter.BattleMover.getThing(defenderName),
            direction = attackerName === "player" ? 1 : -1,
            xvel = 7 * direction,
            dt = 7,
            movement = EightBitter.TimeHandler.addEventInterval(function () {
                EightBitter.shiftHoriz(attacker, xvel);
            }, 1, Infinity);

        EightBitter.TimeHandler.addEvent(function () {
            xvel *= -1;
        }, dt);

        EightBitter.TimeHandler.addEvent(
            EightBitter.TimeHandler.cancelEvent, dt * 2 - 1, movement
        );

        if (attackerName === "player") {
            EightBitter.TimeHandler.addEvent(
                EightBitter.animateFlicker,
                dt * 2,
                defender,
                14,
                5,
                routineArguments.callback
            )
        } else {
            EightBitter.TimeHandler.addEvent(
                EightBitter.animateScreenShake,
                dt * 2,
                EightBitter,
                0,
                undefined,
                undefined,
                undefined,
                EightBitter.animateFlicker.bind(
                    EightBitter,
                    defender,
                    14,
                    5,
                    routineArguments.callback
                )
            );
        }
    }

    /**
     * 
     */
    function cutsceneBattleAttackTailWhip(EightBitter, settings) {
        var battleInfo = settings.battleInfo,
            routineArguments = settings.routineArguments,
            attackerName = routineArguments.attackerName,
            defenderName = routineArguments.defenderName,
            attacker = EightBitter.BattleMover.getThing(attackerName),
            defender = EightBitter.BattleMover.getThing(defenderName),
            direction = attackerName === "player" ? 1 : -1,
            dt = 11,
            dx = EightBitter.unitsize * 4;

        EightBitter.shiftHoriz(attacker, dx * direction);

        EightBitter.TimeHandler.addEvent(
            EightBitter.shiftHoriz,
            dt,
            attacker,
            -dx * direction
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.shiftHoriz,
            dt * 2,
            attacker,
            dx * direction
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.shiftHoriz,
            dt * 3,
            attacker,
            -dx * direction
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateScreenShake,
            (dt * 3.5) | 0,
            EightBitter,
            3,
            0,
            6,
            undefined,
            EightBitter.ScenePlayer.bindRoutine("ChangeStatistic", {
                "callback": routineArguments.callback,
                "defenderName": defenderName,
                "statistic": "Defense",
                "amount": -1
            })
        );
    }

    /**
     * 
     */
    function cutsceneTrainerSpottedExclamation(EightBitter, settings) {
        EightBitter.animateCharacterPreventWalking(EightBitter.player);
        EightBitter.animateExclamation(
            settings.triggerer,
            70,
            EightBitter.ScenePlayer.bindRoutine("Approach")
        );
    }

    /**
     * 
     */
    function cutsceneTrainerSpottedApproach(EightBitter, settings) {
        var player = settings.player,
            triggerer = settings.triggerer,
            direction = triggerer.direction,
            directionName = EightBitter.directionNames[direction],
            distance = Math.abs(triggerer[directionName] - player[directionName]),
            blocks = Math.max(0, distance / EightBitter.unitsize / 8 - 1);

        if (blocks) {
            EightBitter.animateCharacterStartWalking(
                triggerer,
                direction,
                [
                    blocks,
                    EightBitter.ScenePlayer.bindRoutine("Dialog")
                ]
            );
        } else {
            EightBitter.ScenePlayer.playRoutine("Dialog");
        }
    }

    /**
     * 
     */
    function cutsceneTrainerSpottedDialog(EightBitter, settings) {
        EightBitter.collideCharacterDialog(settings.player, settings.triggerer);
        EightBitter.MapScreener.blockInputs = false;
    }

    /**
     * 
     */
    function cutscenePokeCenterWelcome(EightBitter, settings) {
        settings.nurse = EightBitter.getThingById(
            settings.nurseId || "Nurse"
        );
        settings.machine = EightBitter.getThingById(
            settings.machineId || "HealingMachine"
        );

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Welcome to our %%%%%%%POKEMON%%%%%%% CENTER!",
                "We heal your %%%%%%%POKEMON%%%%%%% back to perfect health!",
                "Shall we heal your %%%%%%%POKEMON%%%%%%%?"
            ],
            EightBitter.ScenePlayer.bindRoutine("Choose")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutscenePokeCenterChoose(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("Heal/Cancel");
        EightBitter.MenuGrapher.addMenuList(
            "Heal/Cancel",
             {
                 "options": [
                     {
                         "text": "HEAL",
                         "callback": EightBitter.ScenePlayer.bindRoutine(
                             "ChooseHeal"
                         )
                     },
                     {
                         "text": "CANCEL",
                         "callback": EightBitter.ScenePlayer.bindRoutine(
                             "ChooseCancel"
                         )
                     }
                 ]
             }
        );
        EightBitter.MenuGrapher.setActiveMenu("Heal/Cancel");
    }

    /**
     * 
     */
    function cutscenePokeCenterChooseHeal(EightBitter, settings) {
        EightBitter.MenuGrapher.deleteMenu("Heal/Cancel");

        EightBitter.MenuGrapher.createMenu("GeneralText", {
            "ignoreA": true,
            "finishAutomatically": true
        });
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Ok. We'll need your Pokemon."
            ],
            EightBitter.ScenePlayer.bindRoutine("Healing")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText")
    }

    /**
     * 
     */
    function cutscenePokeCenterHealing(EightBitter, settings) {
        var party = EightBitter.StatsHolder.get("PokemonInParty"),
            balls = settings.balls = [],
            dt = 35,
            left = settings.machine.left + 5 * EightBitter.unitsize,
            top = settings.machine.top + 7 * EightBitter.unitsize,
            i = 0;

        party.length = 6;

        EightBitter.animateCharacterSetDirection(settings.nurse, 3);

        EightBitter.TimeHandler.addEventInterval(function () {
            balls.push(
                EightBitter.addThing(
                    "HealingMachineBall",
                    left + (i % 2) * 3 * EightBitter.unitsize,
                    top + Math.floor(i / 2) * 2.5 * EightBitter.unitsize
                )
            );
            i += 1;
        }, dt, party.length);

        EightBitter.TimeHandler.addEvent(
            EightBitter.ScenePlayer.playRoutine,
            dt * (party.length + 1),
            "HealingAction",
            {
                "balls": balls
            }
        );
    }

    /**
     * 
     */
    function cutscenePokeCenterHealingAction(EightBitter, settings) {
        var routineArguments = settings.routineArguments,
            balls = routineArguments.balls,
            numFlashes = 8,
            i = 0,
            changer, j;

        EightBitter.TimeHandler.addEventInterval(function () {
            changer = i % 2 === 0
                ? EightBitter.addClass
                : EightBitter.removeClass;

            for (j = 0; j < balls.length; j += 1) {
                changer(balls[j], "lit");
            }

            changer(settings.machine, "lit");

            i += 1;
        }, 21, numFlashes);

        EightBitter.TimeHandler.addEvent(
            EightBitter.ScenePlayer.playRoutine,
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
    function cutscenePokeCenterHealingComplete(EightBitter, settings) {
        var routineArguments = settings.routineArguments,
            balls = routineArguments.balls;

        balls.forEach(EightBitter.killNormal);

        EightBitter.animateCharacterSetDirection(settings.nurse, 2);

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you! \n Your %%%%%%%POKEMON%%%%%%% are fighting fit!",
                "We hope to see you again!"
            ],
            function () {
                EightBitter.MenuGrapher.deleteMenu("GeneralText");
                EightBitter.ScenePlayer.stopCutscene();
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutscenePokeCenterChooseCancel(EightBitter, settings) {
        EightBitter.MenuGrapher.deleteMenu("Heal/Cancel");

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "We hope to see you again!"
            ],
            function () {
                EightBitter.MenuGrapher.deleteMenu("GeneralText");
                EightBitter.ScenePlayer.stopCutscene();
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutscenePokeMartGreeting(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true,
            "ignoreA": true,
            "ignoreB": true
        });
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hi there! \n May I help you?"
            ],
            EightBitter.ScenePlayer.bindRoutine("Options")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutscenePokeMartOptions(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("Money");

        EightBitter.MenuGrapher.createMenu("Buy/Sell", {
            "killOnB": ["Money", "GeneralText"],
            "onMenuDelete": EightBitter.ScenePlayer.bindRoutine("Exit")
        });
        EightBitter.MenuGrapher.addMenuList("Buy/Sell", {
            "options": [{
                "text": "BUY",
                "callback": EightBitter.ScenePlayer.bindRoutine("BuyMenu")
            }, {
                "text": "SELL",
                "callback": undefined
            }, {
                "text": "QUIT",
                "callback": EightBitter.MenuGrapher.registerB
            }]
        });
        EightBitter.MenuGrapher.setActiveMenu("Buy/Sell");
    }

    /**
     * 
     * 
     * @todo Add constants for all items, for display names
     */
    function cutscenePokeMartBuyMenu(EightBitter, settings) {
        var options = settings.triggerer.items.map(function (reference) {
            var text = reference.item.toUpperCase(),
                cost = reference.cost;

            return {
                "text": text,
                "textsFloating": [{
                    "text": "$" + cost,
                    "x": 42 - String(cost).length * 3.5,
                    "y": 4
                }],
                "callback": EightBitter.ScenePlayer.bindRoutine(
                    "SelectAmount",
                    {
                        "reference": reference,
                        "amount": 1,
                        "cost": cost
                    }
                ),
                "reference": reference
            }
        });

        options.push({
            "text": "CANCEL",
            "callback": EightBitter.MenuGrapher.registerB
        })

        EightBitter.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true
        });
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Take your time."
            ],
            function () {
                EightBitter.MenuGrapher.createMenu("ShopItems", {
                    "backMenu": "Buy/Sell"
                });
                EightBitter.MenuGrapher.addMenuList("ShopItems", {
                    "options": options
                });
                EightBitter.MenuGrapher.setActiveMenu("ShopItems");
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutscenePokeMartSelectAmount(EightBitter, settings) {
        var routineArguments = settings.routineArguments,
            reference = routineArguments.reference,
            amount = routineArguments.amount,
            cost = routineArguments.cost,
            costTotal = cost * amount,
            text = makeDigit(amount, 2) + makeDigit("$" + costTotal, 8, " ");

        EightBitter.MenuGrapher.createMenu("ShopItemsAmount", {
            "childrenSchemas": [{
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
            "onUp": EightBitter.ScenePlayer.bindRoutine("SelectAmount", {
                "amount": (amount === 99) ? 1 : amount + 1,
                "cost": cost,
                "reference": reference
            }),
            "onDown": EightBitter.ScenePlayer.bindRoutine("SelectAmount", {
                "amount": (amount === 1) ? 99 : amount - 1,
                "cost": cost,
                "reference": reference
            }),
            "callback": EightBitter.ScenePlayer.bindRoutine(
                "ConfirmPurchase", routineArguments
            )
        });
        EightBitter.MenuGrapher.setActiveMenu("ShopItemsAmount");
    }

    /**
     * 
     */
    function cutscenePokeMartConfirmPurchase(EightBitter, settings) {
        var routineArguments = settings.routineArguments,
            reference = routineArguments.reference,
            cost = routineArguments.cost,
            amount = routineArguments.amount,
            costTotal = routineArguments.costTotal = cost * amount;

        EightBitter.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true
        });
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                reference.item.toUpperCase() + "? \n That will be $" + costTotal + ". OK?"
            ],
            function () {
                EightBitter.MenuGrapher.createMenu("Yes/No", {
                    "position": {
                        "horizontal": "right",
                        "vertical": "bottom",
                        "offset": {
                            "top": 0,
                            "left": 0
                        }
                    },
                    "onMenuDelete": EightBitter.ScenePlayer.bindRoutine(
                        "CancelPurchase"
                    ),
                    "container": "ShopItemsAmount"
                });
                EightBitter.MenuGrapher.addMenuList("Yes/No", {
                    "options": [{
                        "text": "YES",
                        "callback": EightBitter.ScenePlayer.bindRoutine(
                            "TryPurchase", routineArguments
                        )
                    }, {
                        "text": "NO",
                        "callback": EightBitter.ScenePlayer.bindRoutine(
                            "CancelPurchase"
                        )
                    }]
                });
                EightBitter.MenuGrapher.setActiveMenu("Yes/No");
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     * 
     * @todo Why is the BuyMenu text appearing twice?
     */
    function cutscenePokeMartCancelPurchase(EightBitter, settings) {
        EightBitter.ScenePlayer.playRoutine("BuyMenu");
    }

    /**
     * 
     */
    function cutscenePokeMartTryPurchase(EightBitter, settings) {
        var routineArguments = settings.routineArguments,
            costTotal = routineArguments.costTotal;

        if (EightBitter.StatsHolder.get("money") < costTotal) {
            EightBitter.ScenePlayer.playRoutine("FailPurchase", routineArguments);
            return;
        }

        EightBitter.StatsHolder.decrease("money", routineArguments.costTotal);
        EightBitter.MenuGrapher.createMenu("Money");
        EightBitter.StatsHolder.get("items").push({
            "item": routineArguments.reference.item,
            "amount": routineArguments.amount
        });

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Here you are! \n Thank you!"
            ],
            EightBitter.ScenePlayer.bindRoutine("ContinueShopping")
        );

        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutscenePokeMartFailPurchase(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You don't have enough money."
            ],
            EightBitter.ScenePlayer.bindRoutine("ContinueShopping")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutscenePokeMartContinueShopping(EightBitter, settings) {
        if (EightBitter.MenuGrapher.getMenu("Yes/No")) {
            delete EightBitter.MenuGrapher.getMenu("Yes/No").onMenuDelete;
        }

        EightBitter.MenuGrapher.deleteMenu("ShopItems");
        EightBitter.MenuGrapher.deleteMenu("ShopItemsAmount");
        EightBitter.MenuGrapher.deleteMenu("Yes/No");

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Is there anything else I can do?"
            ]
        );

        EightBitter.MenuGrapher.setActiveMenu("Buy/Sell");
    }

    /**
     * 
     */
    function cutscenePokeMartExit(EightBitter, settings) {
        EightBitter.ScenePlayer.stopCutscene();

        EightBitter.MenuGrapher.deleteMenu("Buy/Sell");
        EightBitter.MenuGrapher.deleteMenu("Money");

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you!"
            ],
            EightBitter.MenuGrapher.deleteActiveMenu
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneIntroFadeIn(EightBitter, settings) {
        var oak = EightBitter.ObjectMaker.make("OakPortrait", {
            "opacity": 0
        });

        settings.oak = oak;

        EightBitter.GBSEmulator.play("Introduction");
        EightBitter.ModAttacher.fireEvent("onIntroFadeIn", oak);

        // GET THIS STUFF OUTTA HERE

        EightBitter.setMap("Blank", "White");
        EightBitter.MenuGrapher.deleteActiveMenu();

        EightBitter.addThing(oak);
        EightBitter.setMidX(oak, EightBitter.MapScreener.middleX);
        EightBitter.setMidY(oak, EightBitter.MapScreener.middleY);

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateFadeAttribute,
            70,
            oak,
            "opacity",
            .15,
            1,
            14,
            EightBitter.ScenePlayer.bindRoutine("FirstDialog")
        );
    }

    /**
     * 
     */
    function cutsceneIntroFirstDialog(EightBitter, settings) {

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hello there! \n Welcome to the world of %%%%%%%POKEMON%%%%%%%!",
                "My name is OAK! People call me the %%%%%%%POKEMON%%%%%%% PROF!"
            ],
            EightBitter.ScenePlayer.bindRoutine("FirstDialogFade")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneIntroFirstDialogFade(EightBitter, settings) {
        var blank = EightBitter.ObjectMaker.make("WhiteSquare", {
            "width": EightBitter.MapScreener.width,
            "height": EightBitter.MapScreener.height,
            "opacity": 0
        });

        EightBitter.addThing(blank, 0, 0);

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateFadeAttribute,
            35,
            blank,
            "opacity",
            .15,
            1,
            7,
            EightBitter.ScenePlayer.bindRoutine("PokemonExpo")
        );
    }

    /**
     * 
     */
    function cutsceneIntroPokemonExpo(EightBitter, settings) {
        var pokemon = EightBitter.ObjectMaker.make("NidorinoFront", {
            "flipHoriz": true,
            "opacity": .01
        });

        EightBitter.GroupHolder.applyOnAll(EightBitter, EightBitter.killNormal);

        EightBitter.addThing(
            pokemon,
            EightBitter.MapScreener.middleX + 24 * EightBitter.unitsize,
            0
        );

        EightBitter.setMidY(pokemon, EightBitter.MapScreener.middleY);

        EightBitter.animateFadeAttribute(
            pokemon,
            "opacity",
            .15,
            1,
            3
        );

        EightBitter.animateFadeHorizontal(
            pokemon,
            -EightBitter.unitsize * 2,
            EightBitter.MapScreener.middleX,
            1,
            EightBitter.ScenePlayer.bindRoutine("PokemonExplanation")
        );
    }

    /**
     * 
     */
    function cutsceneIntroPokemonExplanation(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This world is inhabited by creatures called %%%%%%%POKEMON%%%%%%%!",
                "For some people, %%%%%%%POKEMON%%%%%%% are pets. Others use them for fights.",
                "Myself...",
                "I study %%%%%%%POKEMON%%%%%%% as a profession."
            ],
            EightBitter.ScenePlayer.bindRoutine("PlayerAppear")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneIntroPlayerAppear(EightBitter, settings) {
        var middleX = EightBitter.MapScreener.middleX,
                player = EightBitter.ObjectMaker.make("PlayerPortrait", {
                    "flipHoriz": true,
                    "opacity": .01
                });

        settings.player = player;

        EightBitter.GroupHolder.applyOnAll(EightBitter, EightBitter.killNormal);

        EightBitter.addThing(
            player,
            EightBitter.MapScreener.middleX + 24 * EightBitter.unitsize,
            0
        );

        EightBitter.setMidY(player, EightBitter.MapScreener.middleY);

        EightBitter.animateFadeAttribute(
            player,
            "opacity",
            .15,
            1,
            3
        );

        EightBitter.animateFadeHorizontal(
            player,
            -EightBitter.unitsize * 2,
            middleX - player.width * EightBitter.unitsize / 2,
            1,
            EightBitter.ScenePlayer.bindRoutine("PlayerName")
        );
    }

    /**
     * 
     */
    function cutsceneIntroPlayerName(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "First, what is your name?"
            ],
            EightBitter.ScenePlayer.bindRoutine("PlayerSlide")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneIntroPlayerSlide(EightBitter, settings) {
        EightBitter.animateFadeHorizontal(
            settings.player,
            EightBitter.unitsize,
            EightBitter.MapScreener.middleX + 16 * EightBitter.unitsize,
            1,
            EightBitter.ScenePlayer.bindRoutine("PlayerNameOptions")
        );
    }

    /**
     * 
     */
    function cutsceneIntroPlayerNameOptions(EightBitter, settings) {
        var fromMenu = EightBitter.ScenePlayer.bindRoutine("PlayerNameFromMenu"),
            fromKeyboard = EightBitter.ScenePlayer.bindRoutine("PlayerNameFromKeyboard");

        EightBitter.MenuGrapher.createMenu("NameOptions");

        EightBitter.MenuGrapher.addMenuList("NameOptions", {
            "options": [{
                "text": "NEW NAME",
                "callback": EightBitter.openKeyboardMenu.bind(EightBitter, {
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
        EightBitter.MenuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * 
     */
    function cutsceneIntroPlayerNameFromMenu(EightBitter, settings) {
        settings.name = EightBitter.MenuGrapher.getMenuSelectedOption("NameOptions").text;

        EightBitter.MenuGrapher.deleteMenu("NameOptions");

        EightBitter.animateFadeHorizontal(
            settings.player,
            -EightBitter.unitsize,
            EightBitter.MapScreener.middleX,
            1,
            EightBitter.ScenePlayer.bindRoutine("PlayerNameConfirm")
        );
    }

    /**
     * 
     */
    function cutsceneIntroPlayerNameFromKeyboard(EightBitter, settings) {
        settings.name = EightBitter.MenuGrapher.getMenu("KeyboardResult").completeValue;

        EightBitter.MenuGrapher.deleteMenu("Keyboard");
        EightBitter.MenuGrapher.deleteMenu("NameOptions");

        EightBitter.animateFadeHorizontal(
            settings.player,
            -EightBitter.unitsize,
            EightBitter.MapScreener.middleX,
            1,
            EightBitter.ScenePlayer.bindRoutine("PlayerNameConfirm")
        );
    }

    /**
     * 
     */
    function cutsceneIntroPlayerNameConfirm(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true
        });
        EightBitter.MenuGrapher.addMenuDialog("GeneralText", [
            "Right! So your name is " + settings.name + "!"
        ], EightBitter.ScenePlayer.bindRoutine("PlayerNameComplete"));

        EightBitter.StatsHolder.set("name", settings.name);
    };

    /**
     * 
     */
    function cutsceneIntroPlayerNameComplete(EightBitter, settings) {
        var blank = EightBitter.ObjectMaker.make("WhiteSquare", {
            "width": EightBitter.MapScreener.width,
            "height": EightBitter.MapScreener.height,
            "opacity": 0
        });

        EightBitter.addThing(blank, 0, 0);

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateFadeAttribute,
            35,
            blank,
            "opacity",
            .2,
            1,
            7,
            EightBitter.ScenePlayer.bindRoutine("RivalAppear")
        );
    }

    /**
     * 
     */
    function cutsceneIntroRivalAppear(EightBitter, settings) {
        var rival = EightBitter.ObjectMaker.make("RivalPortrait", {
            "opacity": 0
        });

        settings.rival = rival;

        EightBitter.GroupHolder.applyOnAll(EightBitter, EightBitter.killNormal);

        EightBitter.addThing(rival, 0, 0);
        EightBitter.setMidX(rival, EightBitter.MapScreener.middleX);
        EightBitter.setMidY(rival, EightBitter.MapScreener.middleY);
        EightBitter.animateFadeAttribute(
            rival,
            "opacity",
            .1,
            1,
            1,
            EightBitter.ScenePlayer.bindRoutine("RivalName")
        );
    }

    /**
     * 
     */
    function cutsceneIntroRivalName(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This is my grand-son. He's been your rival since you were a baby.",
                "...Erm, what is his name again?"
            ],
            EightBitter.ScenePlayer.bindRoutine("RivalSlide")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneIntroRivalSlide(EightBitter, settings) {
        EightBitter.animateFadeHorizontal(
            settings.rival,
            EightBitter.unitsize,
            EightBitter.MapScreener.middleX + 16 * EightBitter.unitsize,
            1,
            EightBitter.ScenePlayer.bindRoutine("RivalNameOptions")
        );
    }

    /**
     * 
     */
    function cutsceneIntroRivalNameOptions(EightBitter, settings) {
        var fromMenu = EightBitter.ScenePlayer.bindRoutine("RivalNameFromMenu"),
            fromKeyboard = EightBitter.ScenePlayer.bindRoutine("RivalNameFromKeyboard");

        EightBitter.MenuGrapher.createMenu("NameOptions");

        EightBitter.MenuGrapher.addMenuList("NameOptions", {
            "options": [{
                "text": "NEW NAME",
                "callback": EightBitter.openKeyboardMenu.bind(EightBitter, {
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
        EightBitter.MenuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * 
     */
    function cutsceneIntroRivalNameFromMenu(EightBitter, settings) {
        settings.name = EightBitter.MenuGrapher.getMenuSelectedOption("NameOptions").text;

        EightBitter.MenuGrapher.deleteMenu("NameOptions");

        EightBitter.animateFadeHorizontal(
            settings.rival,
            -EightBitter.unitsize,
            EightBitter.MapScreener.middleX,
            1,
            EightBitter.ScenePlayer.bindRoutine("RivalNameConfirm")
        );
    }

    /**
     * 
     */
    function cutsceneIntroRivalNameFromKeyboard(EightBitter, settings) {
        settings.name = EightBitter.MenuGrapher.getMenu("KeyboardResult").completeValue;

        EightBitter.MenuGrapher.deleteMenu("Keyboard");
        EightBitter.MenuGrapher.deleteMenu("NameOptions");

        EightBitter.animateFadeHorizontal(
            settings.rival,
            -EightBitter.unitsize,
            EightBitter.MapScreener.middleX,
            1,
            EightBitter.ScenePlayer.bindRoutine("RivalNameConfirm")
        );
    }

    /**
     * 
     */
    function cutsceneIntroRivalNameConfirm(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog("GeneralText", [
            "That's right! I remember now! His name is " + settings.name + "!"
        ], EightBitter.ScenePlayer.bindRoutine("RivalNameComplete"));
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        EightBitter.StatsHolder.set("nameRival", settings.name);
    }

    /**
     * 
     */
    function cutsceneIntroRivalNameComplete(EightBitter, settings) {
        var blank = EightBitter.ObjectMaker.make("WhiteSquare", {
            "width": EightBitter.MapScreener.width,
            "height": EightBitter.MapScreener.height,
            "opacity": 0
        });

        EightBitter.addThing(blank, 0, 0);

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateFadeAttribute,
            35,
            blank,
            "opacity",
            .2,
            1,
            7,
            EightBitter.ScenePlayer.bindRoutine("LastDialogAppear")
        );
    }

    /**
     * 
     */
    function cutsceneIntroLastDialogAppear(EightBitter, settings) {
        var portrait = EightBitter.ObjectMaker.make("PlayerPortrait", {
            "flipHoriz": true,
            "opacity": 0
        });

        settings.portrait = portrait;

        EightBitter.GroupHolder.applyOnAll(EightBitter, EightBitter.killNormal);

        EightBitter.addThing(portrait, 0, 0);
        EightBitter.setMidX(portrait, EightBitter.MapScreener.middleX);
        EightBitter.setMidY(portrait, EightBitter.MapScreener.middleY);

        EightBitter.animateFadeAttribute(
            portrait,
            "opacity",
            .1,
            1,
            1,
            EightBitter.ScenePlayer.bindRoutine("LastDialog")
        );
    }

    /**
     * 
     */
    function cutsceneIntroLastDialog(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%!",
                "Your very own %%%%%%%POKEMON%%%%%%% legend is about to unfold!",
                "A world of dreams and adventures with %%%%%%%POKEMON%%%%%%% awaits! Let's go!"
            ],
            EightBitter.ScenePlayer.bindRoutine("ShrinkPlayer")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneIntroShrinkPlayer(EightBitter, settings) {
        var silhouetteLarge = EightBitter.ObjectMaker.make("PlayerSilhouetteLarge"),
            silhouetteSmall = EightBitter.ObjectMaker.make("PlayerSilhouetteSmall"),
            player = EightBitter.ObjectMaker.make("Player"),
            timeDelay = 49;

        EightBitter.TimeHandler.addEvent(
            EightBitter.addThing, timeDelay, silhouetteLarge
        );
        EightBitter.TimeHandler.addEvent(
            EightBitter.setMidObj, timeDelay, silhouetteLarge, settings.portrait
        );
        EightBitter.TimeHandler.addEvent(
            EightBitter.killNormal, timeDelay, settings.portrait
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.addThing, timeDelay * 2, silhouetteSmall
        );
        EightBitter.TimeHandler.addEvent(
            EightBitter.setMidObj, timeDelay * 2, silhouetteSmall, silhouetteLarge
        );
        EightBitter.TimeHandler.addEvent(
            EightBitter.killNormal, timeDelay * 2, silhouetteLarge
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.addThing, timeDelay * 3, player
        );
        EightBitter.TimeHandler.addEvent(
            EightBitter.setMidObj, timeDelay * 3, player, silhouetteSmall
        );
        EightBitter.TimeHandler.addEvent(
            EightBitter.killNormal, timeDelay * 3, silhouetteSmall
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.ScenePlayer.bindRoutine("FadeOut"), timeDelay * 4
        );
    }

    /**
     * 
     */
    function cutsceneIntroFadeOut(EightBitter, settings) {
        var blank = EightBitter.ObjectMaker.make("WhiteSquare", {
            "width": EightBitter.MapScreener.width,
            "height": EightBitter.MapScreener.height,
            "opacity": 0
        });

        EightBitter.addThing(blank, 0, 0);

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateFadeAttribute,
            35,
            blank,
            "opacity",
            .2,
            1,
            7,
            EightBitter.ScenePlayer.bindRoutine("Finish")
        );
    }

    /**
     * 
     */
    function cutsceneIntroFinish(EightBitter, settings) {
        delete EightBitter.MapScreener.cutscene;

        EightBitter.MenuGrapher.deleteActiveMenu();
        EightBitter.ScenePlayer.stopCutscene();
        EightBitter.StatsHolder.set("gameStarted", true);

        EightBitter.setMap("Pallet Town", "Start Game");
    }

    /**
     * 
     */
    function cutsceneOakIntroFirstDialog(EightBitter, settings) {
        var triggered = false;

        settings.triggerer.alive = false;
        EightBitter.StateHolder.addChange(settings.triggerer.id, "alive", false);

        if (EightBitter.StatsHolder.get("starter")) {
            return;
        }

        EightBitter.animatePlayerDialogFreeze(settings.player);
        EightBitter.animateCharacterSetDirection(settings.player, 2);

        EightBitter.GBSEmulator.play("Professor Oak");
        EightBitter.MapScreener.blockInputs = true;

        EightBitter.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true,
            "finishAutomaticSpeed": 28
        });
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: Hey! Wait! Don't go out!"
            ],
            function () {
                if (!triggered) {
                    triggered = true;
                    EightBitter.ScenePlayer.playRoutine("Exclamation");
                }
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakIntroExclamation(EightBitter, settings) {
        var timeout = 49;

        EightBitter.animateExclamation(settings.player, timeout);

        EightBitter.TimeHandler.addEvent(
            EightBitter.MenuGrapher.hideMenu, timeout, "GeneralText"
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.ScenePlayer.bindRoutine("Catchup"), timeout
        )
    }

    /**
     * 
     */
    function cutsceneOakIntroCatchup(EightBitter, settings) {
        var door = EightBitter.getThingById("Oak's Lab Door"),
            oak = EightBitter.ObjectMaker.make("Oak", {
                "outerok": true
            });

        settings.oak = oak;

        EightBitter.addThing(oak, door.left, door.top);
        EightBitter.animateCharacterStartTurning(
            oak,
            2,
            [
                1, "left", 3, "top", 10, "right", 1, "top", 0,
                EightBitter.ScenePlayer.bindRoutine("GrassWarning")
            ]
        );
    }

    /**
     * 
     */
    function cutsceneOakIntroGrassWarning(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "It's unsafe! Wild %%%%%%%POKEMON%%%%%%% live in tall grass!",
                "You need your own %%%%%%%POKEMON%%%%%%% for your protection. \n I know!",
                "Here, come with me."
            ],
            EightBitter.ScenePlayer.bindRoutine("FollowToLab")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakIntroFollowToLab(EightBitter, settings) {
        EightBitter.MenuGrapher.deleteMenu("GeneralText");
        EightBitter.animateCharacterFollow(settings.player, settings.oak);
        EightBitter.animateCharacterStartTurning(
            settings.oak,
            2,
            [
                5, "left", 1, "bottom", 5, "right", 3, "top", 1,
                EightBitter.ScenePlayer.bindRoutine("EnterLab")
            ]
        );
    }

    /**
     * 
     */
    function cutsceneOakIntroEnterLab(EightBitter, settings) {
        EightBitter.StateHolder.addChange(
            "Pallet Town::Oak's Lab::Oak", "alive", true
        );
        EightBitter.TimeHandler.addEvent(
            EightBitter.animateCharacterStartTurning,
            EightBitter.getCharacterWalkingInterval(EightBitter.player),
            EightBitter.player,
            0,
            [
                1,
                function () {
                    EightBitter.setMap(
                        "Pallet Town", "Oak's Lab Floor 1 Door", false
                    );

                    EightBitter.ScenePlayer.playRoutine("WalkToTable");
                }
            ]
        );
    }

    /**
     * 
     */
    function cutsceneOakIntroWalkToTable(EightBitter, settings) {
        var oak = EightBitter.getThingById("Oak");

        settings.oak = oak;
        settings.player = EightBitter.player;

        oak.dialog = "OAK: Now, %%%%%%%PLAYER%%%%%%%, which %%%%%%%POKEMON%%%%%%% do you want?";
        oak.hidden = false;
        oak.nocollide = true;
        EightBitter.setMidXObj(oak, settings.player);
        EightBitter.setBottom(oak, settings.player.top);

        EightBitter.StateHolder.addChange(oak.id, "hidden", false);
        EightBitter.StateHolder.addChange(oak.id, "nocollide", false);
        EightBitter.StateHolder.addChange(oak.id, "dialog", oak.dialog);

        EightBitter.animateCharacterStartWalking(oak, 0, [
            8, "bottom", 0
        ]);

        EightBitter.TimeHandler.addEvent(
            EightBitter.animateCharacterStartWalking,
            84,
            settings.player,
            0,
            [8, EightBitter.ScenePlayer.bindRoutine("RivalComplain")]
        );
    }

    /**
     * 
     */
    function cutsceneOakIntroRivalComplain(EightBitter, settings) {
        settings.oak.nocollide = false;
        settings.player.nocollide = false;
        EightBitter.StateHolder.addChange(settings.oak.id, "nocollide", false);

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Gramps! I'm fed up with waiting!"
            ],
            EightBitter.ScenePlayer.bindRoutine("OakThinksToRival")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakIntroOakThinksToRival(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
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
            EightBitter.ScenePlayer.bindRoutine("RivalProtests")
        )
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakIntroRivalProtests(EightBitter, settings) {
        var timeout = 21;

        EightBitter.MenuGrapher.deleteMenu("GeneralText");

        EightBitter.TimeHandler.addEvent(
            EightBitter.MenuGrapher.createMenu,
            timeout,
            "GeneralText"
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.MenuGrapher.addMenuDialog,
            timeout,
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Hey! Gramps! What about me?"
            ],
            EightBitter.ScenePlayer.bindRoutine("OakRespondsToProtest")
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.MenuGrapher.setActiveMenu,
            timeout,
            "GeneralText"
        );
    }

    /**
     * 
     */
    function cutsceneOakIntroOakRespondsToProtest(EightBitter, settings) {
        var blocker = EightBitter.getThingById("OakBlocker"),
            timeout = 21;

        settings.player.nocollide = false;
        settings.oak.nocollide = false;

        blocker.nocollide = false;
        EightBitter.StateHolder.addChange(blocker.id, "nocollide", false);

        EightBitter.MapScreener.blockInputs = false;

        EightBitter.MenuGrapher.deleteMenu("GeneralText");

        EightBitter.TimeHandler.addEvent(
            EightBitter.MenuGrapher.createMenu,
            timeout,
            "GeneralText"
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.MenuGrapher.addMenuDialog,
            timeout,
            "GeneralText",
            [
                "Oak: Be patient! %%%%%%%RIVAL%%%%%%%, you can have one too!"
            ]
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.MenuGrapher.setActiveMenu,
            timeout,
            "GeneralText"
        );
    }

    /**
     * 
     */
    function cutsceneOakIntroPokemonChoicePlayerChecksPokeball(EightBitter, settings) {
        var pokeball = settings.triggerer;

        // If Oak is hidden, this cutscene shouldn't be starting (too early)
        if (EightBitter.getThingById("Oak").hidden) {
            EightBitter.ScenePlayer.stopCutscene();

            EightBitter.MenuGrapher.createMenu("GeneralText");
            EightBitter.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Those are %%%%%%%POKE%%%%%%% Balls. They contain %%%%%%%POKEMON%%%%%%%!"
                ]
            );
            EightBitter.MenuGrapher.setActiveMenu("GeneralText");

            return;
        }

        // If there's already a starter, ignore this sad last ball...
        if (EightBitter.StatsHolder.get("starter")) {
            return;
        }

        settings.chosen = pokeball.pokemon;

        EightBitter.openPokedexListing(
            pokeball.pokemon,
            EightBitter.ScenePlayer.bindRoutine("PlayerDecidesPokemon"),
            {
                "position": {
                    "vertical": "center",
                    "offset": {
                        "left": 0
                    }
                }
            }
        );
    }

    /**
     * 
     */
    function cutsceneOakIntroPokemonChoicePlayerDecidesPokemon(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "So! You want the " + settings.triggerer.description + " %%%%%%%POKEMON%%%%%%%, " + settings.chosen.toUpperCase() + "?"
            ],
            function () {
                EightBitter.MenuGrapher.createMenu("Yes/No", {
                    "killOnB": ["GeneralText"]
                });
                EightBitter.MenuGrapher.addMenuList("Yes/No", {
                    "options": [{
                        "text": "YES",
                        "callback": EightBitter.ScenePlayer.bindRoutine("PlayerTakesPokemon")
                    }, {
                        "text": "NO",
                        "callback": EightBitter.MenuGrapher.registerB
                    }]
                });
                EightBitter.MenuGrapher.setActiveMenu("Yes/No");
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakIntroPokemonChoicePlayerTakesPokemon(EightBitter, settings) {
        var oak = EightBitter.getThingById("Oak"),
            rival = EightBitter.getThingById("Rival"),
            dialogOak = "Oak: If a wild %%%%%%%POKEMON%%%%%%% appears, your %%%%%%%POKEMON%%%%%%% can fight against it!",
            dialogRival = "%%%%%%%RIVAL%%%%%%%: My %%%%%%%POKEMON%%%%%%% looks a lot stronger.";

        settings.oak = oak;
        oak.dialog = dialogOak;
        EightBitter.StateHolder.addChange(oak.id, "dialog", dialogOak);

        settings.rival = rival;
        rival.dialog = dialogRival;
        EightBitter.StateHolder.addChange(rival.id, "dialog", dialogRival)

        EightBitter.StatsHolder.set("starter", settings.chosen);
        settings.triggerer.hidden = true;
        EightBitter.StateHolder.addChange(settings.triggerer.id, "hidden", true);
        EightBitter.StateHolder.addChange(settings.triggerer.id, "nocollide", true);

        EightBitter.MenuGrapher.deleteMenu("Yes/No");
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% received a " + settings.chosen.toUpperCase() + "!",
                "This %%%%%%%POKEMON%%%%%%% is really energetic!",
                "Do you want to give a nickname to " + settings.chosen.toUpperCase() + "?"
            ],
            EightBitter.ScenePlayer.bindRoutine("PlayerChoosesNickname")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        EightBitter.StatsHolder.set("starter", settings.chosen);
        EightBitter.StatsHolder.set("PokemonInParty", [
            EightBitter.MathDecider.compute("newPokemon", settings.chosen, 5)
        ]);
    }

    /**
     * 
     */
    function cutsceneOakIntroPokemonChoicePlayerChoosesNickname(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("Yes/No", {
            "ignoreB": true,
            "killOnB": ["GeneralText"]
        });
        EightBitter.MenuGrapher.addMenuList("Yes/No", {
            "options": [{
                "text": "YES",
                "callback": EightBitter.openKeyboardMenu.bind(EightBitter, {
                    "position": {
                        "vertical": "center",
                        "offset": {
                            "top": -12
                        }
                    },
                    "title": settings.chosen.toUpperCase(),
                    "callback": EightBitter.ScenePlayer.bindRoutine("PlayerSetsNickname"),
                })
            }, {
                "text": "NO",
                "callback": EightBitter.ScenePlayer.bindRoutine("RivalWalksToPokemon")
            }]
        });
        EightBitter.MenuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * 
     */
    function cutsceneOakIntroPokemonChoicePlayerSetsNickname(EightBitter, settings) {
        var party = EightBitter.StatsHolder.get("PokemonInParty"),
            menu = EightBitter.MenuGrapher.getMenu("KeyboardResult"),
            result = menu.completeValue;

        party[0].nickname = result;

        EightBitter.ScenePlayer.playRoutine("RivalWalksToPokemon");
    }

    /**
     * 
     */
    function cutsceneOakIntroPokemonChoiceRivalWalksToPokemon(EightBitter, settings) {
        var rival = EightBitter.getThingById("Rival"),
            other, steps, pokeball;

        EightBitter.MenuGrapher.deleteMenu("Keyboard");
        EightBitter.MenuGrapher.deleteMenu("GeneralText");
        EightBitter.MenuGrapher.deleteMenu("Yes/No");

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
        }

        settings.rivalPokemon = other;
        settings.rivalSteps = steps;
        EightBitter.StatsHolder.set("starterRival", other);

        pokeball = EightBitter.getThingById("Pokeball" + other);
        settings.rivalPokeball = pokeball;

        EightBitter.animateCharacterStartTurning(
            rival,
            2,
            [
                2, "right", steps, "up", 1,
                EightBitter.ScenePlayer.bindRoutine("RivalTakesPokemon")
            ]
        );
    }

    /**
     * 
     */
    function cutsceneOakIntroPokemonChoiceRivalTakesPokemon(EightBitter, settings) {
        var oakblocker = EightBitter.getThingById("OakBlocker"),
            rivalblocker = EightBitter.getThingById("RivalBlocker");

        EightBitter.MenuGrapher.deleteMenu("Yes/No");

        oakblocker.nocollide = true;
        EightBitter.StateHolder.addChange(oakblocker.id, "nocollide", true);

        rivalblocker.nocollide = false;
        EightBitter.StateHolder.addChange(rivalblocker.id, "nocollide", false);

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: I'll take this one, then!",
                "%%%%%%%RIVAL%%%%%%% received a " + settings.rivalPokemon.toUpperCase() + "!"
            ],
            function () {
                settings.rivalPokeball.hidden = true;
                EightBitter.StateHolder.addChange(settings.rivalPokeball.id, "hidden", true);
                EightBitter.MenuGrapher.deleteActiveMenu();
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");

    }

    /**
     * 
     */
    function cutsceneOakIntroRivalBattleApproach(EightBitter, settings) {
        var rival = EightBitter.getThingById("Rival"),
            dx = Math.abs(settings.triggerer.left - settings.player.left),
            further = dx < EightBitter.unitsize;

        EightBitter.GBSEmulator.play("Rival Appears");

        settings.rival = rival;
        EightBitter.animateCharacterSetDirection(rival, 2);
        EightBitter.animateCharacterSetDirection(settings.player, 0);

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Wait, %%%%%%%PLAYER%%%%%%%! Let's check out our %%%%%%%POKEMON%%%%%%%!",
                "Come on, I'll take you on!"
            ],
            EightBitter.ScenePlayer.bindRoutine("Challenge", {
                "further": further
            })
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakIntroRivalLeavesAfterBattle(EightBitter, settings) {
        //var rivalblocker = EightBitter.getThingById("RivalBlocker");

        //rivalblocker.nocollide = true;
        //EightBitter.StateHolder.addChange(rivalblocker.id, "nocollide", true);

        EightBitter.TimeHandler.addEvent(
            EightBitter.ScenePlayer.bindRoutine("Complaint"), 49
        );
    }

    /**
     * 
     */
    function cutsceneOakIntroRivalLeavesComplaint(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Okay! I'll make my %%%%%%%POKEMON%%%%%%% fight to toughen it up!"
            ],
            function () {
                EightBitter.MenuGrapher.deleteActiveMenu();
                EightBitter.TimeHandler.addEvent(
                    EightBitter.ScenePlayer.bindRoutine("Goodbye"), 21
                );
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakIntroRivalLeavesGoodbye(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%! Gramps! Smell ya later!"
            ],
            EightBitter.ScenePlayer.bindRoutine("Walking")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakIntroRivalLeavesWalking(EightBitter, settings) {
        var oak = EightBitter.getThingById("Oak"),
            rival = EightBitter.getThingById("Rival"),
            isRight = Math.abs(oak.left - rival.left) < EightBitter.unitsize,
            steps = [
                1,
                "bottom",
                6,
                function () {
                    EightBitter.killNormal(rival);
                    EightBitter.StateHolder.addChange(rival.id, "alive", false);
                }
            ],
            dialog = [
                "OAK: %%%%%%%PLAYER%%%%%%%, raise your young %%%%%%%POKEMON%%%%%%% by making it fight!"
            ];

        EightBitter.ScenePlayer.stopCutscene();
        EightBitter.MenuGrapher.deleteMenu("GeneralText");

        EightBitter.animateCharacterStartTurning(rival, isRight ? 3 : 1, steps);
    }

    /**
     * 
     */
    function cutsceneOakIntroRivalBattleChallenge(EightBitter, settings) {
        var keptThings = [settings.player, settings.rival],
            battleInfo = {
                "opponent": {
                    "sprite": "RivalPortrait",
                    "name": EightBitter.StatsHolder.get("nameRival"),
                    "category": "Trainer",
                    "hasActors": true,
                    "reward": 175,
                    "actors": [
                        EightBitter.MathDecider.compute(
                            "newPokemon",
                            EightBitter.StatsHolder.get("starterRival"),
                            5
                        )
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
                "animation": "LineSpiral",
                "theme": "Trainer Battle",
                "noBlackout": true,
                "keptThings": ["player", "Rival"],
                "nextCutscene": "OakIntroRivalLeaves",
            },
            steps;

        switch (EightBitter.StatsHolder.get("starterRival")) {
            case "Squirtle":
                steps = 2;
                break;
            case "Bulbasaur":
                steps = 3;
                break;
            case "Charmander":
                steps = 1;
                break;
        }

        if (settings.routineArguments.further) {
            steps += 1;
        }

        EightBitter.animateCharacterStartTurning(
            settings.rival,
            3,
            [
                steps,
                "bottom",
                1,
                EightBitter.startBattle.bind(EightBitter, battleInfo)
            ]
        );
    }

    /**
     * 
     */
    function cutsceneOakParcelPickupGreeting(EightBitter, settings) {
        settings.triggerer.alive = false;
        EightBitter.StateHolder.addChange(
            settings.triggerer.id, "alive", false
        );

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hey! You came from PALLET TOWN?"
            ],
            EightBitter.ScenePlayer.bindRoutine("WalkToCounter")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakParcelPickupWalkToCounter(EightBitter, settings) {
        EightBitter.animateCharacterStartTurning(
            settings.player,
            0,
            [
                2,
                "left",
                1,
                EightBitter.ScenePlayer.bindRoutine("CounterDialog")
            ]
        );
    }

    /**
     * 
     */
    function cutsceneOakParcelPickupCounterDialog(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You know PROF. Oak, right?",
                "His order came in. Will you take it to him?",
                "%%%%%%%PLAYER%%%%%%% got OAK's PARCEL!"
            ],
            function () {
                EightBitter.MenuGrapher.deleteMenu("GeneralText");
                EightBitter.ScenePlayer.stopCutscene();
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        EightBitter.StateHolder.addCollectionChange(
            "Pallet Town::Oak's Lab", "Oak", "cutscene", "OakParcelDelivery"
        );
    }

    /**
     * 
     */
    function cutsceneOakParcelDeliveryGreeting(EightBitter, settings) {
        settings.oak = settings.triggerer;

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
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
            EightBitter.TimeHandler.addEvent.bind(
                EightBitter.TimeHandler,
                EightBitter.ScenePlayer.bindRoutine("RivalInterrupts"),
                14
            )
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        EightBitter.StateHolder.addCollectionChange(
            "Viridian City::PokeMart", "CashierDetector", "dialog", false
        );

        EightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGrandpa", "alive", false
        );
        EightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGrandpaBlocker", "alive", false
        );
        EightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGranddaughter", "alive", false
        );

        EightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "HappyGrandpa", "alive", true
        );
        EightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "HappyGranddaughter", "alive", true
        );
    }

    /**
     * 
     */
    function cutsceneOakParcelDeliveryRivalInterrupts(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Gramps!"
            ],
            EightBitter.ScenePlayer.bindRoutine("RivalWalksUp")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakParcelDeliveryRivalWalksUp(EightBitter, settings) {
        var doormat = EightBitter.getThingById("DoormatLeft"),
            rival = settings.rival = EightBitter.addThing(
                "Rival", doormat.left, doormat.top
            );

        EightBitter.MenuGrapher.deleteMenu("GeneralText");

        EightBitter.animateCharacterStartTurning(
            rival,
            0,
            [
                8,
                EightBitter.ScenePlayer.bindRoutine("RivalInquires")
            ]
        )
    }

    /**
     * pause, oh right i have a request
     */
    function cutsceneOakParcelDeliveryRivalInquires(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: What did you call me for?"
            ],
            EightBitter.TimeHandler.addEvent.bind(
                EightBitter.TimeHandler,
                EightBitter.ScenePlayer.bindRoutine("OakRequests"),
                14
            )
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakParcelDeliveryOakRequests(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Oak: Oh right! I have a request of you two."
            ],
            EightBitter.TimeHandler.addEvent.bind(
                EightBitter.TimeHandler,
                EightBitter.ScenePlayer.bindRoutine("OakDescribesPokedex"),
                14
            )
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakParcelDeliveryOakDescribesPokedex(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "On the desk there is my invention, %%%%%%%POKEDEX%%%%%%%!",
                "It automatically records data on %%%%%%%POKEMON%%%%%%% you've seen or caught!",
                "It's a hi-tech encyclopedia!"
            ],
            EightBitter.TimeHandler.addEvent.bind(
                EightBitter.TimeHandler,
                EightBitter.ScenePlayer.bindRoutine("OakGivesPokedex"),
                14
            )
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakParcelDeliveryOakGivesPokedex(EightBitter, settings) {
        var bookLeft = EightBitter.getThingById("BookLeft"),
            bookRight = EightBitter.getThingById("BookRight");

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: %%%%%%%PLAYER%%%%%%% and %%%%%%%RIVAL%%%%%%%! Take these with you!",
                "%%%%%%%PLAYER%%%%%%% got %%%%%%%POKEDEX%%%%%%% from OAK!"
            ],
            function () {
                EightBitter.TimeHandler.addEvent(
                    EightBitter.ScenePlayer.playRoutine, 14, "OakDescribesGoal"
                );

                EightBitter.killNormal(bookLeft);
                EightBitter.killNormal(bookRight);

                EightBitter.StateHolder.addChange(bookLeft.id, "alive", false);
                EightBitter.StateHolder.addChange(bookRight.id, "alive", false);
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakParcelDeliveryOakDescribesGoal(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "To make a complete guide on all the %%%%%%%POKEMON%%%%%%% in the world...",
                "That was my dream!",
                "But, I'm too old! I can't do it!",
                "So, I want you two to fulfill my dream for me!",
                "Get moving, you two!",
                "This is a great undertaking in %%%%%%%POKEMON%%%%%%% history!"
            ],
            EightBitter.TimeHandler.addEvent.bind(
                EightBitter.TimeHandler,
                EightBitter.ScenePlayer.bindRoutine("RivalAccepts"),
                14
            )
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneOakParcelDeliveryRivalAccepts(EightBitter, settings) {
        EightBitter.animateCharacterSetDirection(settings.rival, 1);

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Alright Gramps! Leave it all to me!",
                "%%%%%%%PLAYER%%%%%%%, I hate to say it, but I don't need you!",
                "I know! I'll borrow a TOWN MAP from my sis!",
                "I'll tell her not to lend you one, %%%%%%%PLAYER%%%%%%%! Hahaha!"
            ],
            function () {
                EightBitter.ScenePlayer.stopCutscene();
                EightBitter.MenuGrapher.deleteMenu("GeneralText");
                EightBitter.animateCharacterStartTurning(
                    settings.rival,
                    2,
                    [
                        8,
                        EightBitter.killNormal.bind(
                            EightBitter, settings.rival
                        )
                    ]
                );

                delete settings.oak.cutscene;
                settings.oak.dialog = [
                    "%%%%%%%POKEMON%%%%%%% around the world wait for you, %%%%%%%PLAYER%%%%%%%!"
                ];

                EightBitter.StateHolder.addChange(
                    settings.oak.id, "dialog", settings.oak.dialog
                );
                EightBitter.StateHolder.addChange(
                    settings.oak.id, "cutscene", undefined
                );
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneDaisyTownMapGreeting(EightBitter, settings) {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Grandpa asked you to run an errand? Here, this will help you!"
            ],
            EightBitter.ScenePlayer.bindRoutine("ReceiveMap")
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function cutsceneDaisyTownMapReceiveMap(EightBitter, settings) {
        var book = EightBitter.getThingById("Book"),
            daisy = settings.triggerer;

        EightBitter.killNormal(book);
        EightBitter.StateHolder.addChange(book.id, "alive", false);

        delete daisy.cutscene;
        EightBitter.StateHolder.addChange(daisy.id, "cutscene", undefined);

        daisy.dialog = [
            "Use the TOWN MAP to find out where you are."
        ];
        EightBitter.StateHolder.addChange(daisy.id, "dialog", daisy.dialog);

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got a TOWN MAP!"
            ],
            function () {
                EightBitter.ScenePlayer.stopCutscene();
                EightBitter.MenuGrapher.deleteMenu("GeneralText");
            }
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        console.warn("Player does not actually get a Town Map...");
    }

    /**
     * 
     */
    function cutsceneElderTrainingStartBattle(EightBitter, settings) {
        EightBitter.MapScreener.blockInputs = true;
        EightBitter.startBattle({
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
                    EightBitter.MathDecider.compute(
                        "newPokemon", "Weedle", 5
                    )
                ]
            },
            "items": [{
                "item": "Pokeball",
                "amount": 50
            }],
            "automaticMenus": true,
            "onShowPlayerMenu": function () {
                var timeout = 70;

                EightBitter.TimeHandler.addEvent(
                    EightBitter.MenuGrapher.registerDown, timeout
                );

                EightBitter.TimeHandler.addEvent(
                    EightBitter.MenuGrapher.registerA, timeout * 2
                );

                EightBitter.TimeHandler.addEvent(
                    EightBitter.MenuGrapher.registerA, timeout * 3
                );
            }
        });
    }

    /**
     * 
     */
    function cutsceneRivalRoute22RivalEmerges(EightBitter, settings) {
        var player = settings.player,
            triggerer = settings.triggerer,
            playerUpper = Number(
                Math.abs(player.top - triggerer.top) < EightBitter.unitsize
            ),
            steps = [
                2,
                "right",
                3 + playerUpper,
            ],
            rival = settings.rival = EightBitter.ObjectMaker.make("Rival", {
                "direction": 0,
                "nocollide": true,
                "opacity": 0
            });

        if (playerUpper) {
            steps.push("top");
            steps.push(0);
        }

        steps.push(EightBitter.ScenePlayer.bindRoutine("RivalTalks"));

        // thing, attribute, change, goal, speed, onCompletion
        EightBitter.animateFadeAttribute(rival, "opacity", .2, 1, 3);

        EightBitter.addThing(
            rival,
            triggerer.left - EightBitter.unitsize * 28,
            triggerer.top + EightBitter.unitsize * 24
        );

        EightBitter.animateCharacterStartTurning(rival, 0, steps);
    }

    /**
     * 
     */
    function cutsceneRivalRoute22RivalTalks(EightBitter, settings) {
        EightBitter.animateCharacterSetDirection(
            settings.player,
            EightBitter.getDirectionBordering(settings.player, settings.rival)
        );

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Hey! %%%%%%%PLAYER%%%%%%%!",
                "You're going to %%%%%%%POKEMON%%%%%%% LEAGUE?",
                "Forget it! You probably don't have any BADGES!",
                "The guard won't let you through!",
                "By the way did your %%%%%%%POKEMON%%%%%%% get any stronger?"
            ],
            EightBitter.startBattle.bind(EightBitter, {
                "opponent": {
                    "sprite": "RivalPortrait",
                    "name": EightBitter.StatsHolder.get("nameRival"),
                    "category": "Trainer",
                    "hasActors": true,
                    "reward": 280,
                    "actors": [
                        EightBitter.MathDecider.compute(
                            "newPokemon",
                            EightBitter.StatsHolder.get("starterRival"),
                            8
                        ),
                        EightBitter.MathDecider.compute(
                            "newPokemon", "Pidgey", 9
                        )
                    ]
                },
                "textStart": ["", " wants to fight!"],
                "textDefeat": ["Yeah! Am I great or what?"],
                "textVictory": ["Awww! You just lucked out!"],
                "keptThings": ["player", "Rival"]
            })
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }


    /* Memory
    */

    /**
     * 
     */
    function saveCharacterPositions(EightBitter) {
        var characters = EightBitter.GroupHolder.getCharacterGroup(),
            character, id, i;

        for (i = 0; i < characters.length; i += 1) {
            character = characters[i];
            id = character.id;

            EightBitter.saveCharacterPosition(EightBitter, character, id);
        }
    };

    /**
     * 
     */
    function saveCharacterPosition(EightBitter, character, id) {
        EightBitter.StateHolder.addChange(
            id,
            "xloc",
            (character.left + EightBitter.MapScreener.left) / EightBitter.unitsize
        );
        EightBitter.StateHolder.addChange(
            id,
            "yloc",
            (character.top + EightBitter.MapScreener.top) / EightBitter.unitsize
        );
        EightBitter.StateHolder.addChange(
            id,
            "direction",
            character.direction
        );
    }

    /**
     * 
     */
    function saveGame() {
        var EightBitter = EightBittr.ensureCorrectCaller(this);

        EightBitter.StatsHolder.set(
            "map", EightBitter.MapsHandler.getMapName()
        );
        EightBitter.StatsHolder.set(
            "area", EightBitter.MapsHandler.getAreaName()
        );
        EightBitter.StatsHolder.set(
            "location", EightBitter.MapsHandler.getLocationCurrentName()
        );

        EightBitter.saveCharacterPositions(EightBitter);
        EightBitter.StatsHolder.saveAll();
        EightBitter.StateHolder.saveCollection();

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText", [
                "Now saving..."
            ]
        );

        EightBitter.TimeHandler.addEvent(
            EightBitter.MenuGrapher.registerB, 49
        );
    };

    /**
     * 
     */
    function downloadSaveGame() {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            link = document.createElement("a");

        EightBitter.saveGame();

        link.setAttribute(
            "download",
            EightBitter.StatsHolder.get("filename") + " " + Date.now() + ".json"
        );
        link.setAttribute(
            "href",
            "data:text/json;charset=utf-8," + encodeURIComponent(
                EightBitter.LevelEditor.beautify(
                    JSON.stringify(EightBitter.StatsHolder.export())
                )
            )
        );

        EightBitter.container.appendChild(link);
        link.click();
        EightBitter.container.removeChild(link);
    };

    /**
     * 
     */
    function addItemToBag(EightBitter, item, amount) {
        EightBitter.combineArrayMembers(
            EightBitter.StatsHolder.get("items"),
            item,
            amount || 1,
            "item",
            "amount"
        );
    }

    /**
     * 
     */
    function MARATHON() {
        var EightBitter = EightBittr.ensureCorrectCaller(this);

        EightBitter.MenuGrapher.createMenu("GeneralText", {
            "position": {
                "horizontal": "center",
                "vertical": "center",
                "offset": {
                    "left": 0,
                    "top": 0
                }
            }
        });
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "FULL SCREEN POKEMON",
                "Coming April 1st, 2016!",
                "We promise!"
            ],
            EightBitter.MARATHON.bind(EightBitter)
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * 
     */
    function DURANDAL() {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            vidder = document.createElement("video"),
            types = ["mp4", "flv"],
            source, i;

        for (i = 0; i < types.length; i += 1) {
            source = document.createElement("source");
            source.src = "Theme/Video." + types[i];
            source.type = "video/" + types[i];
            vidder.appendChild(source);
        }

        vidder.style.width = "100%";
        vidder.style.height = "100%";
        vidder.style.zIndex = 49;
        vidder.style.position = "fixed";

        vidder.volume = 1;
        vidder.autoplay = true;
        vidder.play();
        vidder.oncanplay = function () {
            document.body.insertBefore(
                vidder, document.body.firstChild
            );
        };
    }


    /* Map sets
    */

    /**
     * 
     */
    function setMap(name, location, noEntrance) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            map;

        if (typeof name === "undefined" || name instanceof EightBittr) {
            name = EightBitter.MapsHandler.getMapName();
        }

        map = EightBitter.MapsHandler.setMap(name);

        EightBitter.ModAttacher.fireEvent("onPreSetMap", map);

        EightBitter.NumberMaker.resetFromSeed(map.seed);
        EightBitter.InputWriter.restartHistory();

        EightBitter.ModAttacher.fireEvent("onSetMap", map);

        EightBitter.setLocation(
            location
            || map.locationDefault
            || EightBitter.settings.maps.locationDefault,
            noEntrance
        );
    }

    /**
     * 
     */
    function setLocation(name, noEntrance) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            location, theme;

        name = name || 0;

        EightBitter.GBSEmulator.clearAll();
        EightBitter.GroupHolder.clearArrays();
        EightBitter.MapScreener.clearScreen();
        EightBitter.MapScreener.thingsById = {};
        EightBitter.MenuGrapher.setActiveMenu(undefined);
        EightBitter.TimeHandler.cancelAllEvents();

        EightBitter.MapsHandler.setLocation(name);
        EightBitter.MapScreener.setVariables();
        location = EightBitter.MapsHandler.getLocation(name);
        location.area.spawnedBy = {
            "name": name,
            "timestamp": new Date().getTime()
        };

        EightBitter.ModAttacher.fireEvent("onPreSetLocation", location);

        EightBitter.PixelDrawer.setBackground(
            EightBitter.MapsHandler.getArea().background
        );

        EightBitter.StateHolder.setCollection(
            location.area.map.name + "::" + location.area.name
        );

        EightBitter.QuadsKeeper.resetQuadrants();

        theme = location.theme || location.area.theme || location.area.map.theme;
        EightBitter.MapScreener.theme = theme;
        if (theme && theme !== EightBitter.GBSEmulator.getTheme()) {
            EightBitter.GBSEmulator.play(theme);
        }

        if (!noEntrance) {
            location.entry(EightBitter, location);
        }

        EightBitter.ModAttacher.fireEvent("onSetLocation", location);

        EightBitter.GamesRunner.play();

        EightBitter.animateFadeFromColor(EightBitter, {
            "color": "Black"
        });
    }

    /**
     * 
     */
    function getAreaBoundariesReal(EightBitter) {
        var area = EightBitter.MapsHandler.getArea();

        if (!area) {
            return {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0,
                "width": 0,
                "height": 0
            }
        };

        return {
            "top": area.boundaries.top * EightBitter.unitsize,
            "right": area.boundaries.right * EightBitter.unitsize,
            "bottom": area.boundaries.bottom * EightBitter.unitsize,
            "left": area.boundaries.left * EightBitter.unitsize,
            "width": (area.boundaries.right - area.boundaries.left) * EightBitter.unitsize,
            "height": (area.boundaries.bottom - area.boundaries.top) * EightBitter.unitsize
        }
    }

    /**
     * 
     */
    function getScreenScrollability(EightBitter) {
        var area = EightBitter.MapsHandler.getArea(),
            boundaries, width, height;

        if (!area) {
            return "none";
        }

        boundaries = area.boundaries;
        width = (boundaries.right - boundaries.left) * EightBitter.unitsize;
        height = (boundaries.bottom - boundaries.top) * EightBitter.unitsize;

        if (width > EightBitter.MapScreener.width) {
            if (height > EightBitter.MapScreener.height) {
                return "both";
            } else {
                return "horizontal";
            }
        } else if (height > EightBitter.MapScreener.height) {
            return "vertical";
        } else {
            return "none";
        }
    }

    /**
     * 
     */
    function generateThingsByIdContainer() {
        return {};
    }

    /**
     * 
     * 
     * @remarks Direction is taken in by the .forEach call as the index. Clever.
     */
    function mapAddAfter(prething, direction) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            MapsCreator = EightBitter.MapsCreator,
            MapsHandler = EightBitter.MapsHandler,
            prethings = MapsHandler.getPreThings(),
            area = MapsHandler.getArea(),
            map = MapsHandler.getMap(),
            boundaries = EightBitter.MapsHandler.getArea().boundaries;

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
        }

        MapsCreator.analyzePreSwitch(prething, prethings, area, map);
    }


    /* Map entrances
    */

    /**
     * 
     */
    function centerMapScreen(EightBitter) {
        switch (EightBitter.MapScreener.scrollability) {
            case "none":
                EightBitter.centerMapScreenHorizontally(EightBitter);
                EightBitter.centerMapScreenVertically(EightBitter);
                return;
            case "vertical":
                EightBitter.centerMapScreenHorizontally(EightBitter);
                EightBitter.centerMapScreenVerticallyOnPlayer(EightBitter);
                return;
            case "horizontal":
                EightBitter.centerMapScreenHorizontallyOnPlayer(EightBitter);
                EightBitter.centerMapScreenVertically(EightBitter);
                return;
            case "both":
                EightBitter.centerMapScreenHorizontallyOnPlayer(EightBitter);
                EightBitter.centerMapScreenVerticallyOnPlayer(EightBitter);
                return;
        }
    }

    /**
     * 
     */
    function centerMapScreenHorizontally(EightBitter) {
        var boundaries = EightBitter.MapScreener.boundaries,
            difference = EightBitter.MapScreener.width - boundaries.width;

        if (difference > 0) {
            EightBitter.scrollWindow(difference / -2);
        }
    }

    /**
     * 
     */
    function centerMapScreenVertically(EightBitter) {
        var boundaries = EightBitter.MapScreener.boundaries,
            difference = EightBitter.MapScreener.height - boundaries.height;

        EightBitter.scrollWindow(0, difference / -2);
    }

    /**
     * 
     */
    function centerMapScreenHorizontallyOnPlayer(EightBitter) {
        var boundaries = EightBitter.MapScreener.boundaries,
            difference = EightBitter.getMidX(EightBitter.player) - EightBitter.MapScreener.middleX;

        if (Math.abs(difference) > 0) {
            EightBitter.scrollWindow(difference);
        }
    }

    /**
     * 
     */
    function centerMapScreenVerticallyOnPlayer(EightBitter) {
        var boundaries = EightBitter.MapScreener.boundaries,
            difference = EightBitter.getMidY(EightBitter.player) - EightBitter.MapScreener.middleY;

        if (Math.abs(difference) > 0) {
            EightBitter.scrollWindow(0, difference);
        }
    }

    /**
     * 
     */
    function mapEntranceBlank(EightBitter, location) {
        EightBitter.addPlayer(0, 0);
        EightBitter.player.hidden = true;
    }


    /**
     * 
     */
    function mapEntranceNormal(EightBitter, location) {
        EightBitter.addPlayer(
            location.xloc ? location.xloc * EightBitter.unitsize : 0,
            location.yloc ? location.yloc * EightBitter.unitsize : 0
        );

        EightBitter.animateCharacterSetDirection(
            EightBitter.player,
            typeof location.direction === "undefined"
                ? EightBitter.MapScreener.playerDirection
                : location.direction
        );

        EightBitter.centerMapScreen(EightBitter);

        if (location.cutscene) {
            EightBitter.ScenePlayer.startCutscene(location.cutscene, {
                "player": player
            });
        }

        if (location.routine && EightBitter.ScenePlayer.getCutsceneName()) {
            EightBitter.ScenePlayer.playRoutine(location.routine);
        }
    }

    /**
     * 
     */
    function mapEntranceResume(EightBitter) {
        var savedInfo = EightBitter.StateHolder.getChanges("player") || {};

        EightBitter.addPlayer(
            (savedInfo.xloc || 0),
            (savedInfo.yloc || 0),
            true
        );

        EightBitter.animateCharacterSetDirection(
            EightBitter.player, savedInfo.direction
        );

        EightBitter.centerMapScreen(EightBitter);
    }


    /* Map macros
    */

    /**
     * 
     */
    function macroCheckered(reference) {
        var xStart = reference.x || 0,
            yStart = reference.y || 0,
            xnum = reference.xnum || 1,
            ynum = reference.ynum || 1,
            xwidth = reference.xwidth || 8,
            yheight = reference.yheight || 8,
            offset = reference.offset || 0,
            things = reference.things,
            mod = things.length,
            output = [],
            thing, x, y, i, j;

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
                    })
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
    function macroWater(reference) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = reference.width || 8,
            height = reference.height || 8,
            open = reference.open,
            output = [{
                "thing": "Water",
                "x": x,
                "y": y,
                "width": width,
                "height": height,
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
    function macroHouse(reference) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = reference.width || 32,
            stories = reference.stories || 1,
            output = [],
            door, i;

        if (stories === 1) {
            output.push({
                "thing": "HouseTopRoofLeft",
                "x": x,
                "y": y,
            });
            output.push({
                "thing": "HouseTopRoof",
                "x": x + 8,
                "y": y,
                "width": width - 16
            })
            output.push({
                "thing": "HouseTopRoofRight",
                "x": x + width - 8,
                "y": y,
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
            })
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
            }
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
    function macroHouseLarge(reference) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = reference.width || 48,
            stories = reference.stories || 1,
            doorOffset = reference.doorOffset || 16,
            output = [{
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
                "y": y,
            }],
            door, i;

        y += 20;
        for (i = 2; i < stories; i += 1) {
            output.push({
                "thing": "HouseLargeCenter",
                "x": x,
                "y": y,
                "width": width
            })

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
    };

    /**
     * 
     */
    function macroGym(reference) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = reference.width || 48,
            stories = reference.stories || 2,
            output = [{
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
    function macroBuilding(reference) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = reference.width || 32,
            stories = reference.stories || 1,
            doorOffset = reference.doorOffset || 8,
            output = [{
                "thing": "BuildingTopLeft",
                "x": x,
                "y": y,
            }, {
                "thing": "BuildingTopMiddle",
                "x": x + 4,
                "y": y,
                "width": width - 8
            }, {
                "thing": "BuildingTopRight",
                "x": x + width - 4,
                "y": y,
            }],
            door, i;

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
                "width": doorOffset - 4,
            });
            output.push(door);
            output.push({
                "thing": "BuildingMiddleMiddle",
                "x": x + doorOffset + 8,
                "y": y,
                "height": 4,
                "width": width - doorOffset - 8,
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
    function macroMountain(reference) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = reference.width || 8,
            height = reference.height || 8,
            openingOffset = reference.openingOffset || 8,
            output = [];

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
                "width": width,
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
                    })
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
    function macroPokeCenter(reference) {
        var x = reference.x || 0,
            y = reference.y || 0,
            output = [{
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
            })
        }

        return output;
    }

    /**
     * 
     */
    function macroPokeMart(reference) {
        var x = reference.x || 0,
            y = reference.y || 0,
            output = [{
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
                "height": 24,
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
                "y": y + 40,
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
                "y": y + 56,
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
    function stringOf(string, times) {
        return (times === 0) ? '' : new Array(1 + (times || 1)).join(string);
    }

    /**
     * Turns a Number into a String with a prefix added to pad it to a certain
     * number of digits.
     * 
     * @param {Number} number   The original Number being padded.
     * @param {Number} size   How many digits the output must contain.
     * @param {String} [prefix]   A prefix to repeat for padding (by default,
     *                            "0").
     * @return {String}
     * @example 
     * makeDigit(7, 3); // '007'
     * makeDigit(7, 3, 1); // '117'
     */
    function makeDigit(number, size, prefix) {
        return stringOf(
            prefix || "0",
            Math.max(0, size - String(number).length)
        ) + number;
    }

    /**
     * 
     */
    function checkArrayMembersIndex(array, index) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][index]) {
                return true;
            }
        }

        return false;
    }

    /**
     * 
     */
    function combineArrayMembers(array, title, count, keyTitle, keyCount) {
        var object;

        for (var i = 0; i < array.length; i += 1) {
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


    proliferateHard(FullScreenPokemon.prototype, {
        // Resets
        "resetContainer": resetContainer,
        "resetMapsHandler": resetMapsHandler,
        "resetMenuGrapher": resetMenuGrapher,
        "resetBattleMover": resetBattleMover,
        "resetScenePlayer": resetScenePlayer,
        "resetStateHolder": resetStateHolder,
        "resetMathDecider": resetMathDecider,
        // Global manipulations
        "gameStart": gameStart,
        "gameStartOptions": gameStartOptions,
        "gameStartPlay": gameStartPlay,
        "gameStartIntro": gameStartIntro,
        "gameLoadFile": gameLoadFile,
        "gameLoadData": gameLoadData,
        "thingProcess": thingProcess,
        "onGamePlay": onGamePlay,
        "onGamePause": onGamePause,
        "addThing": addThing,
        "addPreThing": addPreThing,
        "addPlayer": addPlayer,
        "getThingById": getThingById,
        // Inputs
        "canInputsTrigger": canInputsTrigger,
        "canDirectionsTrigger": canDirectionsTrigger,
        "keyDownGeneric": keyDownGeneric,
        "keyDownLeft": keyDownLeft,
        "keyDownRight": keyDownRight,
        "keyDownUp": keyDownUp,
        "keyDownDown": keyDownDown,
        "keyDownDirectionReal": keyDownDirectionReal,
        "keyDownA": keyDownA,
        "keyDownB": keyDownB,
        "keyDownPause": keyDownPause,
        "keyDownMute": keyDownMute,
        "keyUpGeneric": keyUpGeneric,
        "keyUpLeft": keyUpLeft,
        "keyUpRight": keyUpRight,
        "keyUpUp": keyUpUp,
        "keyUpDown": keyUpDown,
        "keyUpA": keyUpA,
        "keyUpB": keyUpB,
        "keyUpPause": keyUpPause,
        "mouseDownRight": mouseDownRight,
        // Upkeep maintenance
        "maintainGeneric": maintainGeneric,
        "maintainCharacters": maintainCharacters,
        "maintainCharacterGrass": maintainCharacterGrass,
        "maintainPlayer": maintainPlayer,
        "getHorizontalScrollAmount": getHorizontalScrollAmount,
        "getVerticalScrollAmount": getVerticalScrollAmount,
        // General animations
        "animateSnapToGrid": animateSnapToGrid,
        "animatePlayerDialogFreeze": animatePlayerDialogFreeze,
        "animateFadeAttribute": animateFadeAttribute,
        "animateFadeHorizontal": animateFadeHorizontal,
        "animateFadeVertical": animateFadeVertical,
        "animateGrassBattleStart": animateGrassBattleStart,
        "animateTrainerBattleStart": animateTrainerBattleStart,
        "animatePlayerLeaveLeft": animatePlayerLeaveLeft,
        "animateThingCorners": animateThingCorners,
        "animateExpandCorners": animateExpandCorners,
        "animateSmokeSmall": animateSmokeSmall,
        "animateSmokeMedium": animateSmokeMedium,
        "animateSmokeLarge": animateSmokeLarge,
        "animateExclamation": animateExclamation,
        "animateFadeToColor": animateFadeToColor,
        "animateFadeFromColor": animateFadeFromColor,
        "animateFlicker": animateFlicker,
        "animateScreenShake": animateScreenShake,
        // Character movement animations
        "animateCharacterSetDistanceVelocity": animateCharacterSetDistanceVelocity,
        "animateCharacterStartTurning": animateCharacterStartTurning,
        "animateCharacterStartWalking": animateCharacterStartWalking,
        "animateCharacterStartWalkingRandom": animateCharacterStartWalkingRandom,
        "animatePlayerStartWalking": animatePlayerStartWalking,
        "animateCharacterSetDirection": animateCharacterSetDirection,
        "animateCharacterStopWalking": animateCharacterStopWalking,
        "animatePlayerStopWalking": animatePlayerStopWalking,
        "animateCharacterPreventWalking": animateCharacterPreventWalking,
        "animateFlipOnDirection": animateFlipOnDirection,
        "animateUnflipOnDirection": animateUnflipOnDirection,
        "animateSwitchFlipOnDirection": animateSwitchFlipOnDirection,
        "animatePositionSightDetector": animatePositionSightDetector,
        "animateCharacterDialogFinish": animateCharacterDialogFinish,
        "animateCharacterDialogOptions": animateCharacterDialogOptions,
        "animateCharacterFollow": animateCharacterFollow,
        "animateCharacterFollowContinue": animateCharacterFollowContinue,
        "animateCharacterFollowStop": animateCharacterFollowStop,
        "getCharacterWalkingInterval": getCharacterWalkingInterval,
        "animateCharacterHopLedge": animateCharacterHopLedge,
        // Collisions
        "generateCanThingCollide": generateCanThingCollide,
        "generateIsCharacterTouchingCharacter": generateIsCharacterTouchingCharacter,
        "generateIsCharacterTouchingSolid": generateIsCharacterTouchingSolid,
        "generateHitCharacterThing": generateHitCharacterThing,
        "collideCollisionDetector": collideCollisionDetector,
        "collideCharacterDialog": collideCharacterDialog,
        "collidePokeball": collidePokeball,
        "collideCharacterGrass": collideCharacterGrass,
        "collideLedge": collideLedge,
        // Death
        "killNormal": killNormal,
        // Activations
        "activateThemePlayer": activateThemePlayer,
        "activateCutsceneTriggerer": activateCutsceneTriggerer,
        "activateCutsceneResponder": activateCutsceneResponder,
        "activateMenuTriggerer": activateMenuTriggerer,
        "activateSightDetector": activateSightDetector,
        "activateTransporter": activateTransporter,
        "activateGymStatue": activateGymStatue,
        // Physics
        "getDirectionBordering": getDirectionBordering,
        "isThingWithinOther": isThingWithinOther,
        "isThingWithinGrass": isThingWithinGrass,
        "shiftCharacter": shiftCharacter,
        "setPlayerDirection": setPlayerDirection,
        // Spawning
        "spawnCharacter": spawnCharacter,
        "activateCharacterRoaming": activateCharacterRoaming,
        "activateSpawner": activateSpawner,
        "spawnWindowDetector": spawnWindowDetector,
        "checkWindowDetector": checkWindowDetector,
        "spawnAreaSpawner": spawnAreaSpawner,
        "activateAreaSpawner": activateAreaSpawner,
        "expandMapBoundaries": expandMapBoundaries,
        // Menus
        "openPauseMenu": openPauseMenu,
        "closePauseMenu": closePauseMenu,
        "togglePauseMenu": togglePauseMenu,
        "openPokedexMenu": openPokedexMenu,
        "openPokedexListing": openPokedexListing,
        "openPokemonMenu": openPokemonMenu,
        "openItemsMenu": openItemsMenu,
        "openPlayerMenu": openPlayerMenu,
        "openSaveMenu": openSaveMenu,
        "openKeyboardMenu": openKeyboardMenu,
        "addKeyboardMenuValue": addKeyboardMenuValue,
        "switchKeyboardCase": switchKeyboardCase,
        // Battles and battle animations
        "startBattle": startBattle,
        "createPokemon": createPokemon,
        "checkPlayerGrassBattle": checkPlayerGrassBattle,
        "chooseRandomWildPokemon": chooseRandomWildPokemon,
        "addBattleDisplayPokeballs": addBattleDisplayPokeballs,
        "addBattleDisplayPokemonHealth": addBattleDisplayPokemonHealth,
        "setBattleDisplayPokemonHealthBar": setBattleDisplayPokemonHealthBar,
        "animateBattleDisplayPokemonHealthBar": animateBattleDisplayPokemonHealthBar,
        // Cutscenes
        "cutsceneBattleEntrance": cutsceneBattleEntrance,
        "cutsceneBattleOpeningText": cutsceneBattleOpeningText,
        "cutsceneBattleEnemyIntro": cutsceneBattleEnemyIntro,
        "cutsceneBattlePlayerIntro": cutsceneBattlePlayerIntro,
        "cutsceneBattleShowPlayerMenu": cutsceneBattleShowPlayerMenu,
        "cutsceneBattleOpponentSendOut": cutsceneBattleOpponentSendOut,
        "cutsceneBattlePlayerSendOut": cutsceneBattlePlayerSendOut,
        "cutsceneBattleOpponentSendOutAppear": cutsceneBattleOpponentSendOutAppear,
        "cutsceneBattlePlayerSendOutAppear": cutsceneBattlePlayerSendOutAppear,
        "cutsceneBattleMovePlayer": cutsceneBattleMovePlayer,
        "cutsceneBattleMovePlayerAnimate": cutsceneBattleMovePlayerAnimate,
        "cutsceneBattleMoveOpponent": cutsceneBattleMoveOpponent,
        "cutsceneBattleMoveOpponentAnimate": cutsceneBattleMoveOpponentAnimate,
        "cutsceneBattleDamage": cutsceneBattleDamage,
        "cutsceneBattlePokemonFaints": cutsceneBattlePokemonFaints,
        "cutsceneBattleAfterPlayerPokemonFaints": cutsceneBattleAfterPlayerPokemonFaints,
        "cutsceneBattleAfterOpponentPokemonFaints": cutsceneBattleAfterOpponentPokemonFaints,
        "cutsceneBattleOpponentSwitchesPokemon": cutsceneBattleOpponentSwitchesPokemon,
        "cutsceneBattleExperienceGain": cutsceneBattleExperienceGain,
        "cutsceneBattleLevelUp": cutsceneBattleLevelUp,
        "cutsceneBattleLevelUpStats": cutsceneBattleLevelUpStats,
        "cutsceneBattlePlayerChoosesPokemon": cutsceneBattlePlayerChoosesPokemon,
        "cutsceneBattleExitFail": cutsceneBattleExitFail,
        "cutsceneBattleExitFailReturn": cutsceneBattleExitFailReturn,
        "cutsceneBattleVictory": cutsceneBattleVictory,
        "cutsceneBattleVictorySpeech": cutsceneBattleVictorySpeech,
        "cutsceneBattleVictoryWinnings": cutsceneBattleVictoryWinnings,
        "cutsceneBattleDefeat": cutsceneBattleDefeat,
        "cutsceneBattleComplete": cutsceneBattleComplete,
        // Battle transitions
        "cutsceneBattleTransitionLineSpiral": cutsceneBattleTransitionLineSpiral,
        "cutsceneBattleTransitionFlash": cutsceneBattleTransitionFlash,
        "cutsceneBattleTransitionTwist": cutsceneBattleTransitionTwist,
        "cutsceneBattleTransitionFlashTwist": cutsceneBattleTransitionFlashTwist,
        // Battle attack utilities
        "cutsceneBattleChangeStatistic": cutsceneBattleChangeStatistic,
        // Battle attack animations
        "cutsceneBattleAttackGrowl": cutsceneBattleAttackGrowl,
        "cutsceneBattleAttackTackle": cutsceneBattleAttackTackle,
        "cutsceneBattleAttackTailWhip": cutsceneBattleAttackTailWhip,
        "cutsceneTrainerSpottedExclamation": cutsceneTrainerSpottedExclamation,
        "cutsceneTrainerSpottedApproach": cutsceneTrainerSpottedApproach,
        "cutsceneTrainerSpottedDialog": cutsceneTrainerSpottedDialog,
        "cutscenePokeCenterWelcome": cutscenePokeCenterWelcome,
        "cutscenePokeCenterChoose": cutscenePokeCenterChoose,
        "cutscenePokeCenterChooseHeal": cutscenePokeCenterChooseHeal,
        "cutscenePokeCenterHealing": cutscenePokeCenterHealing,
        "cutscenePokeCenterHealingAction": cutscenePokeCenterHealingAction,
        "cutscenePokeCenterHealingComplete": cutscenePokeCenterHealingComplete,
        "cutscenePokeCenterChooseCancel": cutscenePokeCenterChooseCancel,
        "cutscenePokeMartGreeting": cutscenePokeMartGreeting,
        "cutscenePokeMartOptions": cutscenePokeMartOptions,
        "cutscenePokeMartBuyMenu": cutscenePokeMartBuyMenu,
        "cutscenePokeMartSelectAmount": cutscenePokeMartSelectAmount,
        "cutscenePokeMartExit": cutscenePokeMartExit,
        "cutscenePokeMartConfirmPurchase": cutscenePokeMartConfirmPurchase,
        "cutscenePokeMartCancelPurchase": cutscenePokeMartCancelPurchase,
        "cutscenePokeMartTryPurchase": cutscenePokeMartTryPurchase,
        "cutscenePokeMartFailPurchase": cutscenePokeMartFailPurchase,
        "cutscenePokeMartContinueShopping": cutscenePokeMartContinueShopping,
        "cutsceneIntroFadeIn": cutsceneIntroFadeIn,
        "cutsceneIntroFirstDialog": cutsceneIntroFirstDialog,
        "cutsceneIntroFirstDialogFade": cutsceneIntroFirstDialogFade,
        "cutsceneIntroPokemonExpo": cutsceneIntroPokemonExpo,
        "cutsceneIntroPokemonExplanation": cutsceneIntroPokemonExplanation,
        "cutsceneIntroPlayerAppear": cutsceneIntroPlayerAppear,
        "cutsceneIntroPlayerName": cutsceneIntroPlayerName,
        "cutsceneIntroPlayerSlide": cutsceneIntroPlayerSlide,
        "cutsceneIntroPlayerNameOptions": cutsceneIntroPlayerNameOptions,
        "cutsceneIntroPlayerNameFromMenu": cutsceneIntroPlayerNameFromMenu,
        "cutsceneIntroPlayerNameFromKeyboard": cutsceneIntroPlayerNameFromKeyboard,
        "cutsceneIntroPlayerNameConfirm": cutsceneIntroPlayerNameConfirm,
        "cutsceneIntroPlayerNameComplete": cutsceneIntroPlayerNameComplete,
        "cutsceneIntroRivalAppear": cutsceneIntroRivalAppear,
        "cutsceneIntroRivalName": cutsceneIntroRivalName,
        "cutsceneIntroRivalSlide": cutsceneIntroRivalSlide,
        "cutsceneIntroRivalNameOptions": cutsceneIntroRivalNameOptions,
        "cutsceneIntroRivalNameFromMenu": cutsceneIntroRivalNameFromMenu,
        "cutsceneIntroRivalNameFromKeyboard": cutsceneIntroRivalNameFromKeyboard,
        "cutsceneIntroRivalNameConfirm": cutsceneIntroRivalNameConfirm,
        "cutsceneIntroRivalNameComplete": cutsceneIntroRivalNameComplete,
        "cutsceneIntroLastDialogAppear": cutsceneIntroLastDialogAppear,
        "cutsceneIntroLastDialog": cutsceneIntroLastDialog,
        "cutsceneIntroShrinkPlayer": cutsceneIntroShrinkPlayer,
        "cutsceneIntroFadeOut": cutsceneIntroFadeOut,
        "cutsceneIntroFinish": cutsceneIntroFinish,
        "cutsceneOakIntroFirstDialog": cutsceneOakIntroFirstDialog,
        "cutsceneOakIntroExclamation": cutsceneOakIntroExclamation,
        "cutsceneOakIntroCatchup": cutsceneOakIntroCatchup,
        "cutsceneOakIntroGrassWarning": cutsceneOakIntroGrassWarning,
        "cutsceneOakIntroFollowToLab": cutsceneOakIntroFollowToLab,
        "cutsceneOakIntroEnterLab": cutsceneOakIntroEnterLab,
        "cutsceneOakIntroWalkToTable": cutsceneOakIntroWalkToTable,
        "cutsceneOakIntroRivalComplain": cutsceneOakIntroRivalComplain,
        "cutsceneOakIntroOakThinksToRival": cutsceneOakIntroOakThinksToRival,
        "cutsceneOakIntroRivalProtests": cutsceneOakIntroRivalProtests,
        "cutsceneOakIntroOakRespondsToProtest": cutsceneOakIntroOakRespondsToProtest,
        "cutsceneOakIntroPokemonChoicePlayerChecksPokeball": cutsceneOakIntroPokemonChoicePlayerChecksPokeball,
        "cutsceneOakIntroPokemonChoicePlayerDecidesPokemon": cutsceneOakIntroPokemonChoicePlayerDecidesPokemon,
        "cutsceneOakIntroPokemonChoicePlayerTakesPokemon": cutsceneOakIntroPokemonChoicePlayerTakesPokemon,
        "cutsceneOakIntroPokemonChoicePlayerChoosesNickname": cutsceneOakIntroPokemonChoicePlayerChoosesNickname,
        "cutsceneOakIntroPokemonChoicePlayerSetsNickname": cutsceneOakIntroPokemonChoicePlayerSetsNickname,
        "cutsceneOakIntroPokemonChoiceRivalWalksToPokemon": cutsceneOakIntroPokemonChoiceRivalWalksToPokemon,
        "cutsceneOakIntroPokemonChoiceRivalTakesPokemon": cutsceneOakIntroPokemonChoiceRivalTakesPokemon,
        "cutsceneOakIntroRivalBattleChallenge": cutsceneOakIntroRivalBattleChallenge,
        "cutsceneOakIntroRivalBattleApproach": cutsceneOakIntroRivalBattleApproach,
        "cutsceneOakIntroRivalLeavesAfterBattle": cutsceneOakIntroRivalLeavesAfterBattle,
        "cutsceneOakIntroRivalLeavesComplaint": cutsceneOakIntroRivalLeavesComplaint,
        "cutsceneOakIntroRivalLeavesGoodbye": cutsceneOakIntroRivalLeavesGoodbye,
        "cutsceneOakIntroRivalLeavesWalking": cutsceneOakIntroRivalLeavesWalking,
        "cutsceneOakParcelPickupGreeting": cutsceneOakParcelPickupGreeting,
        "cutsceneOakParcelPickupWalkToCounter": cutsceneOakParcelPickupWalkToCounter,
        "cutsceneOakParcelPickupCounterDialog": cutsceneOakParcelPickupCounterDialog,
        "cutsceneOakParcelDeliveryGreeting": cutsceneOakParcelDeliveryGreeting,
        "cutsceneOakParcelDeliveryRivalInterrupts": cutsceneOakParcelDeliveryRivalInterrupts,
        "cutsceneOakParcelDeliveryRivalWalksUp": cutsceneOakParcelDeliveryRivalWalksUp,
        "cutsceneOakParcelDeliveryRivalInquires": cutsceneOakParcelDeliveryRivalInquires,
        "cutsceneOakParcelDeliveryOakRequests": cutsceneOakParcelDeliveryOakRequests,
        "cutsceneOakParcelDeliveryOakDescribesPokedex": cutsceneOakParcelDeliveryOakDescribesPokedex,
        "cutsceneOakParcelDeliveryOakGivesPokedex": cutsceneOakParcelDeliveryOakGivesPokedex,
        "cutsceneOakParcelDeliveryOakDescribesGoal": cutsceneOakParcelDeliveryOakDescribesGoal,
        "cutsceneOakParcelDeliveryRivalAccepts": cutsceneOakParcelDeliveryRivalAccepts,
        "cutsceneDaisyTownMapGreeting": cutsceneDaisyTownMapGreeting,
        "cutsceneDaisyTownMapReceiveMap": cutsceneDaisyTownMapReceiveMap,
        "cutsceneElderTrainingStartBattle": cutsceneElderTrainingStartBattle,
        "cutsceneRivalRoute22RivalEmerges": cutsceneRivalRoute22RivalEmerges,
        "cutsceneRivalRoute22RivalTalks": cutsceneRivalRoute22RivalTalks,
        // Memory
        "saveGame": saveGame,
        "saveCharacterPositions": saveCharacterPositions,
        "saveCharacterPosition": saveCharacterPosition,
        "downloadSaveGame": downloadSaveGame,
        "addItemToBag": addItemToBag,
        "MARATHON": MARATHON,
        "DURANDAL": DURANDAL,
        // Map sets
        "setMap": setMap,
        "setLocation": setLocation,
        "getAreaBoundariesReal": getAreaBoundariesReal,
        "getScreenScrollability": getScreenScrollability,
        "generateThingsByIdContainer": generateThingsByIdContainer,
        "mapAddAfter": mapAddAfter,
        // Map entrances
        "centerMapScreen": centerMapScreen,
        "centerMapScreenHorizontally": centerMapScreenHorizontally,
        "centerMapScreenVertically": centerMapScreenVertically,
        "centerMapScreenHorizontallyOnPlayer": centerMapScreenHorizontallyOnPlayer,
        "centerMapScreenVerticallyOnPlayer": centerMapScreenVerticallyOnPlayer,
        "mapEntranceBlank": mapEntranceBlank,
        "mapEntranceNormal": mapEntranceNormal,
        "mapEntranceResume": mapEntranceResume,
        // Map macros
        "macroCheckered": macroCheckered,
        "macroWater": macroWater,
        "macroHouse": macroHouse,
        "macroHouseLarge": macroHouseLarge,
        "macroBuilding": macroBuilding,
        "macroGym": macroGym,
        "macroMountain": macroMountain,
        "macroPokeCenter": macroPokeCenter,
        "macroPokeMart": macroPokeMart,
        // Miscellaneous utilities
        "stringOf": stringOf,
        "makeDigit": makeDigit,
        "checkArrayMembersIndex": checkArrayMembersIndex,
        "combineArrayMembers": combineArrayMembers
    });

    return FullScreenPokemon;
})(GameStartr);