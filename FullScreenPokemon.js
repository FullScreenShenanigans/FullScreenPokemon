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
 * // Creating a 15 x 14.5 blocks sized FullScreenPokemon object and logging the
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

    // Subsequent settings will be stored in FullScreenPokemon.prototype.settings
    GameStartrProto.settings = {};

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
                "directionNumbers"
            ],
            "extraResets": ["resetMenuGrapher", "resetStateHolder"]
        });

        if (customs.resetTimed) {
            this.resetTimes = this.resetTimed(this, customs);
        } else {
            this.reset(this, customs);
        }
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
            "EightBitter": EightBitter
        }, EightBitter.settings.menus));
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


    /* Global manipulations
    */

    /**
     * 
     */
    function gameStart(EightBitter) {
        var EightBitter = EightBittr.ensureCorrectCaller(this);

        EightBitter.setMap(
            EightBitter.settings.maps.mapDefault,
            EightBitter.settings.maps.locationDefault
        );

        EightBitter.ModAttacher.fireEvent("onGameStart");
    }

    /**
     * Slight addition to the GameStartr thingProcess Function. The Thing's hit
     * check type is cached immediately.
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

        if (typeof thing.direction !== "undefined") {
            thing.EightBitter.animateCharacterSetDirection(thing, thing.direction);
        }

        thing.bordering = new Array(4);
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
     */
    function addThing(thing, left, top) {
        GameStartr.prototype.addThing.call(this, thing, left, top);

        if (typeof thing.id !== "undefined") {
            thing.EightBitter.MapScreener.thingsById[thing.id] = thing;
            thing.EightBitter.StateHolder.applyChanges(thing.id, thing);
        }
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

        thing.EightBitter.addThing(
            thing,
            prething.left * thing.EightBitter.unitsize - thing.EightBitter.MapScreener.left,
            prething.top * thing.EightBitter.unitsize - thing.EightBitter.MapScreener.top
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
    function addPlayer(left, top) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            player;

        left = left || 0;
        top = top || 0;

        player = EightBitter.player = EightBitter.ObjectMaker.make("Player");
        player.keys = player.getKeys();

        EightBitter.InputWriter.setEventInformation(player);

        EightBitter.addThing(player, left, top);

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
     * @param {Player} player
     */
    function keyDownLeft(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }

        if (player.EightBitter.MenuGrapher.getActiveMenu()) {
            player.EightBitter.MenuGrapher.registerLeft();
        } else if (player.canKeyWalking) {
            player.EightBitter.setPlayerDirection(player, 3);
        }


        player.EightBitter.ModAttacher.fireEvent("onKeyDownLeft");
    }

    /**
     * 
     * @param {Player} player
     */
    function keyDownRight(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }

        if (player.EightBitter.MenuGrapher.getActiveMenu()) {
            player.EightBitter.MenuGrapher.registerRight();
        } else if (player.canKeyWalking) {
            player.EightBitter.setPlayerDirection(player, 1);
        }


        event.preventDefault();
    }

    /**
     * 
     * @param {Player} player
     */
    function keyDownUp(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }

        if (player.EightBitter.MenuGrapher.getActiveMenu()) {
            player.EightBitter.MenuGrapher.registerUp();
        } else if (player.canKeyWalking) {
            player.EightBitter.setPlayerDirection(player, 0);
        }

        player.EightBitter.ModAttacher.fireEvent("onKeyDownUp");

        event.preventDefault();
    }

    /**
     * 
     * @param {Player} player
     */
    function keyDownDown(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }

        if (player.EightBitter.MenuGrapher.getActiveMenu()) {
            player.EightBitter.MenuGrapher.registerDown();
        } else if (player.canKeyWalking) {
            player.EightBitter.setPlayerDirection(player, 2);
        }

        player.EightBitter.ModAttacher.fireEvent("onKeyDownDown");

        event.preventDefault();
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
            player.EightBitter.collidePlayerBordering(
                player,
                player.bordering[player.direction]
            );
        }

        player.EightBitter.ModAttacher.fireEvent("onKeyDownA");

        event.preventDefault();
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
        }

        player.EightBitter.ModAttacher.fireEvent("onKeyDownB");

        event.preventDefault();
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

        event.preventDefault();
    }

    /**
     * 
     * @param {Player} player
     */
    function keyDownMute(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }

        player.EightBitter.AudioPlayer.toggleMuted();
        player.EightBitter.ModAttacher.fireEvent("onKeyDownMute");

        event.preventDefault();
    }

    /**
     * 
     * @param {Player} player
     */
    function keyUpLeft(player, event) {
        player.EightBitter.ModAttacher.fireEvent("onKeyUpLeft");

        player.keys[3] = false;

        event.preventDefault();
    }

    /**
     * 
     * @param {Player} player
     */
    function keyUpRight(player, event) {
        player.EightBitter.ModAttacher.fireEvent("onKeyUpRight");

        player.keys[1] = false;

        event.preventDefault();
    }

    /**
     * 
     * @param {Player} player
     */
    function keyUpUp(player, event) {
        player.EightBitter.ModAttacher.fireEvent("onKeyUpUp");

        player.keys[0] = false;

        event.preventDefault();
    }

    /**
     * 
     * @param {Player} player
     */
    function keyUpDown(player, event) {
        player.EightBitter.ModAttacher.fireEvent("onKeyUpDown");

        player.keys[2] = false;

        event.preventDefault();
    }

    /*
     * 
     */
    function keyUpA(player, event) {
        player.EightBitter.ModAttacher.fireEvent("onKeyUpA");

        player.keys.a = false;

        event.preventDefault();
    }

    /**
     * 
     */
    function keyUpB(player, event) {
        player.EightBitter.ModAttacher.fireEvent("onKeyUpB");

        player.keys.b = false;

        event.preventDefault();
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

        event.preventDefault();
    }

    /**
     * 
     * @param {Player} player
     */
    function mouseDownRight(player, event) {
        player.EightBitter.togglePauseMenu(player);

        player.EightBitter.ModAttacher.fireEvent("onMouseDownRight");

        event.preventDefault();
    }


    /* Upkeep maintenance
    */

    /**
     * 
     */
    function maintainSolids(EightBitter, solids) {
        var solid, i;

        for (i = 0; i < solids.length; i += 1) {
            solid = solids[i];

            if (!solid.alive) {
                EightBitter.arrayDeleteThing(solid, solids, i);
                i -= 1;
                continue;
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
                EightBitter.TimeHandler.addEvent(
                    character.onWalkingStart, 3, character, character.direction
                );
                character.shouldWalk = false;
            }

            if (!character.alive) {
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
    function maintainPlayer(EightBitter, player) {
        if (!player || !player.alive) {
            return;
        }

        var scrollability = EightBitter.MapScreener.scrollability;

        switch (scrollability) {
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


    /* Character movement
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
    function animateCharacterStartWalking(thing, direction) {
        var repeats = (8 * thing.EightBitter.unitsize / thing.speed) | 0,
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

        thing.EightBitter.TimeHandler.addEventInterval(
            thing.onWalkingStop, repeats, Infinity, thing
        );

        thing.isWalking = true;
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

        direction = thing.EightBitter.NumberMaker.randomInt(totalAllowed);

        for (i = 0; i < direction; i += 1) {
            if (thing.bordering[i]) {
                direction += 1;
            }
        }

        thing.EightBitter.animateCharacterStartWalking(thing, direction);
    }

    /**
     * 
     */
    function animatePlayerStartWalking(thing) {
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
    function animateCharacterStopWalking(thing) {
        thing.isWalking = false;
        thing.xvel = 0;
        thing.yvel = 0;

        thing.EightBitter.removeClass(thing, "walking");
        thing.EightBitter.TimeHandler.cancelClassCycle(thing, "walking");

        if (thing.walkingFlipping) {
            thing.EightBitter.TimeHandler.cancelEvent(thing.walkingFlipping);
            thing.walkingFlipping = undefined;
        }

        return true;
    }

    /**
     * 
     */
    function animatePlayerStopWalking(thing) {
        if (thing.keys[thing.direction]) {
            thing.EightBitter.animateCharacterSetDistanceVelocity(
                thing, thing.distance
            );
            return false;
        }

        thing.canKeyWalking = true;
        return thing.EightBitter.animateCharacterStopWalking(thing);
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
    function animateCharacterDialogFinish(thing, other) {
        thing.talking = false;
        other.talking = false;
        thing.canKeyWalking = true;
        if (other.directionPreferred) {
            thing.EightBitter.animateCharacterSetDirection(
                other, other.directionPreferred
            );
        }
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
                && thing.right >= other.left
                && thing.left <= other.right
                && thing.bottom >= other.top
                && thing.top <= other.bottom
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
                && thing.right >= other.left
                && thing.left <= other.right
                && thing.bottom >= other.top
                && thing.top <= other.bottom
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

            switch (thing.EightBitter.getDirectionBordering(thing, other)) {
                case 0:
                    if (thing.left !== other.right && other.left !== thing.right) {
                        thing.bordering[0] = other;
                        thing.EightBitter.setTop(thing, other.bottom);
                    }
                    break;
                case 1:
                    if (thing.top !== other.bottom && thing.bottom !== other.top) {
                        thing.bordering[1] = other;
                        thing.EightBitter.setRight(thing, other.left);
                    }
                    break;
                case 2:
                    if (thing.left !== other.right && other.left !== thing.right) {
                        thing.bordering[2] = other;
                        thing.EightBitter.setBottom(thing, other.top);
                    }
                    break;
                case 3:
                    if (thing.top !== other.bottom && thing.bottom !== other.top) {
                        thing.bordering[3] = other;
                        thing.EightBitter.setLeft(thing, other.right);
                    }
                    break;
            }
        }
    }

    /**
     * 
     */
    function collideTransporter(thing, other) {
        if (!thing.player) {
            return;
        }

        if (other.activated) {
            if (thing.EightBitter.isThingOverlappingOther(thing, other)) {
                if (
                    typeof other.requireDirection !== "undefined"
                    && !thing.keys[other.requireDirection]
                ) {
                    return;
                }
                thing.EightBitter.activateTransporter(thing, other)
            }
            return true;
        }

        // Find direction of movement using xvel, yvel
        // if towards other, transport
        var directionMovement = thing.direction,
            directionActual = thing.EightBitter.getDirectionBordering(thing, other);

        if (directionMovement === directionActual) {
            other.activated = true;
            return true;
        }
    }

    /**
     * 
     */
    function collidePlayerBordering(thing, other) {
        var dialog = other.dialog,
            direction;

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
            thing.EightBitter.MenuGrapher.createMenu("GeneralText");
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

        thing.hidden = thing.dead = true;
        thing.alive = false;
        thing.numquads = 0;
        thing.movement = undefined;

        if (thing.EightBitter) {
            thing.EightBitter.TimeHandler.cancelAllCycles(thing);
        }

        thing.EightBitter.ModAttacher.fireEvent("onKillNormal", thing);
    }


    /* Activations
    */

    /**
     * Activation callback for level transports (any Thing with a .transport 
     * attribute). Depending on the transport, either the map or location are 
     * shifted to it.
     * 
     * @param {Player} thing
     * @param {Thing} other
     */
    function activateTransporter(thing, other) {
        var transport = other.transport;

        if (!thing.player) {
            return;
        }

        if (typeof transport === "undefined") {
            throw new Error("No transport given to activateTransporter");
        }

        if (transport.constructor === String) {
            thing.EightBitter.setLocation(transport);
        } else if (typeof transport.map !== "undefined") {
            thing.EightBitter.setMap(transport.map, transport.location);
        } else if (typeof transport.location !== "undefined") {
            thing.EightBitter.setLocation(transport.location);
        } else {
            throw new Error("Unknown transport type:" + transport);
        }
    }

    /**
     * 
     */
    function activateTransporterAnimated(thing, other) {
        thing.EightBitter.activateTransporter(thing, other);
    }


    /* Physics
    */

    /**
     * 
     * 
     * I would like this to be more elegant. 
     */
    function getDirectionBordering(thing, other) {
        if (Math.abs(thing.top - other.bottom) < thing.EightBitter.unitsize) {
            return 0;
        }

        if (Math.abs(thing.right - other.left) < thing.EightBitter.unitsize) {
            return 1;
        }

        if (Math.abs(thing.bottom - other.top) < thing.EightBitter.unitsize) {
            return 2;
        }

        if (Math.abs(thing.left - other.right) < thing.EightBitter.unitsize) {
            return 3;
        }
    }

    /**
     * 
     */
    function isThingOverlappingOther(thing, other) {
        if (
            thing.direction % 2 === 0
            && Math.abs(thing.top - other.top) < thing.EightBitter.unitsize
            && Math.abs(thing.bottom - other.bottom) < thing.EightBitter.unitsize
        ) {
            return true;
        }

        if (
            thing.direction % 2 === 1
            && Math.abs(thing.left - other.left) < thing.EightBitter.unitsize
            && Math.abs(thing.right - other.right) < thing.EightBitter.unitsize
        ) {
            return true;
        }
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
        thing.keys[direction] = true;
    }


    /* Spawning
    */

    /**
     * 
     */
    function spawnCharacterRoaming(thing) {
        thing.EightBitter.TimeHandler.addEventInterval(
            thing.EightBitter.activateCharacterRoaming, 140, Infinity, thing
        );
    }

    /**
     * 
     */
    function activateCharacterRoaming(thing) {
        if (!thing.alive || thing.talking || thing.EightBitter.MenuGrapher.getActiveMenu()) {
            return true;
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
            return;
        }

        if (
            area.spawnedBy
            && area.spawnedBy === thing.EightBitter.MapsHandler.getArea().spawnedBy
        ) {
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

        for (i = 0; i < creation.length; i += 1) {
            // A copy of the command must be used to not modify the original 
            command = EightBitter.proliferate({
                "noBoundaryStretch": true
            }, creation[i]);

            // The command's x and y must be shifted by the thing's placement
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

        MapScreener.setVariables();
    }


    /* Menus
    */

    /**
     * 
     */
    self.openPauseMenu = function () {
        var EightBitter = EightBittr.ensureCorrectCaller(this);

        EightBitter.MapScreener.inPauseMenu = true;
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
                "text": "SAVE"
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
    self.closePauseMenu = function () {
        var EightBitter = EightBittr.ensureCorrectCaller(this);

        EightBitter.MapScreener.inPauseMenu = false;
        EightBitter.MenuGrapher.deleteMenu("Pause");
    };

    /**
     * 
     */
    self.togglePauseMenu = function (player) {
        if (player.EightBitter.MenuGrapher.getActiveMenu()) {
            player.EightBitter.MenuGrapher.registerStart();
        } else if (player.EightBitter.MapScreener.inPauseMenu) {
            player.EightBitter.closePauseMenu();
        } else {
            player.EightBitter.openPauseMenu();
        }
    }

    /**
     * 
     */
    self.openPokedexMenu = function () {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            listings = EightBitter.StatsHolder.getItem("Pokedex");

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
    self.openPokemonMenu = function () {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            listings = EightBitter.StatsHolder.getItem("PokemonInParty");

        EightBitter.MenuGrapher.createMenu("Pokemon");
        EightBitter.MenuGrapher.setActiveMenu("Pokemon");
        EightBitter.MenuGrapher.addMenuList("Pokemon", {
            "options": listings.map(function (listing, i) {
                var text = listing.title.split(""),
                    hpFill = 31.5 * listing.hp / listing.hpMax;

                return {
                    "text": text,
                    "things": [{
                        "thing": listing.sprite,
                        "position": {
                            "offset": {
                                "left": 8
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
                            "width": 32
                        },
                        "position": {
                            "offset": {
                                "left": 27,
                                "top": 5.5
                            }
                        }
                    }, {
                        "thing": "HPBarFill",
                        "args": {
                            "width": Math.max(hpFill, 1),
                            "height": 1,
                            "hidden": hpFill === 0
                        },
                        "position": {
                            "offset": {
                                "left": 27.25,
                                "top": 6
                            }
                        }
                    }]
                };
            })
        });
    };

    /**
     * 
     */
    self.openItemsMenu = function () {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            items = EightBitter.StatsHolder.getItem("items");

        EightBitter.MenuGrapher.createMenu("Items");
        EightBitter.MenuGrapher.setActiveMenu("Items");
        EightBitter.MenuGrapher.addMenuList("Items", {
            "options": items.map(function (item) {
                return {
                    "text": item.title
                };
            })
        });
    }

    /**
     * 
     */
    self.openPlayerMenu = function () {
        var EightBitter = EightBittr.ensureCorrectCaller(this);
        
        EightBitter.MenuGrapher.createMenu("Player");
        EightBitter.MenuGrapher.setActiveMenu("Player");
    };

    /**
     * 
     */
    self.retrieveItemsList = function () {
        var EightBitter = EightBittr.ensureCorrectCaller(this);

        return [{
            "title": "Potion",
            "amount": 2
        }, {
            "title": "Pokemanz",
            "amount": 9001
        }];
    };


    /* Map sets
    */

    /**
     * 
     */
    function setMap(name, location) {
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
            || EightBitter.settings.maps.locationDefault
        );
    }

    /**
     * 
     */
    function setLocation(name) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            location;

        name = name || 0;

        EightBitter.MapScreener.clearScreen();
        EightBitter.MapScreener.thingsById = {};
        EightBitter.GroupHolder.clearArrays();
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

        EightBitter.AudioPlayer.clearAll();
        EightBitter.QuadsKeeper.resetQuadrants();

        location.entry(EightBitter, location);

        EightBitter.ModAttacher.fireEvent("onSetLocation", location);

        EightBitter.GamesRunner.play();
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
    function mapEntranceNormal(EightBitter, location) {
        EightBitter.addPlayer(
            location.xloc ? location.xloc * EightBitter.unitsize : 0,
            location.yloc ? location.yloc * EightBitter.unitsize : 0
        );

        EightBitter.animateCharacterSetDirection(
            EightBitter.player,
            EightBitter.MapScreener.playerDirection
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

        if (!open) {
            return output;
        }

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
            output = [{
                "thing": "HouseTop",
                "x": x,
                "y": y,
                "width": width
            }],
            door, i;

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
            i;

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
            output.push({
                "thing": "BuildingMiddleMiddle",
                "x": x + 4,
                "y": y,
                "height": 4,
                "width": doorOffset - 4,
            });
            output.push({
                "thing": "Door",
                "x": x + doorOffset,
                "y": y
            });
            output.push({
                "thing": "BuildingMiddleMiddle",
                "x": x + doorOffset + 8,
                "y": y,
                "height": 4,
                "width": width - doorOffset - 8,
            });
        } else {
            output.push({
                "thing": "BuildingMiddleMiddle",
                "x": x + 4,
                "y": y,
                "width": width - 8,
                "height": 4
            });
        }

        if (reference.label) {
            output.push({
                "thing": reference.label + "Label",
                "x": x + 16,
                "y": y
            });
        }

        y += 4;

        output.push({
            "thing": "BuildingBottom",
            "x": x,
            "y": y,
            "width": width
        });

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

            output.push({
                "thing": "MountainRight",
                "x": x + width - 8,
                "y": y + 8,
                "width": 8,
                "height": height - 16
            });

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

            output.push({
                "thing": "MountainLeft",
                "x": x,
                "y": y + 8,
                "width": 8,
                "height": height - 16
            });

            width -= 8;
            x += 8;
        }

        if (reference.top) {
            output.push({
                "thing": "MountainTop",
                "x": x,
                "y": y,
                "width": width,
            });
            y += 5;
            height -= 5;
        }

        if (reference.bottom) {
            output.push({
                "thing": "MountainBottom",
                "x": x,
                "y": y + height - 8,
                "width": width,
                "height": 8
            });
            height -= 8;
        }

        output.push({
            "thing": "Mountain",
            "x": x,
            "y": y,
            "width": width,
            "height": height
        });

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
     *                            '0').
     * @return {String}
     * @example 
     * makeDigit(7, 3); // '007'
     * makeDigit(7, 3, 1); // '117'
     */
    function makeDigit(number, size, prefix) {
        return stringOf(
            prefix || '0',
            Math.max(0, size - String(number).length)
        ) + number;
    }


    proliferateHard(FullScreenPokemon.prototype, {
        // Resets
        "resetContainer": resetContainer,
        "resetMapsHandler": resetMapsHandler,
        "resetMenuGrapher": resetMenuGrapher,
        "resetStateHolder": resetStateHolder,
        // Global manipulations
        "gameStart": gameStart,
        "thingProcess": thingProcess,
        "onGamePlay": onGamePlay,
        "onGamePause": onGamePause,
        "addThing": addThing,
        "addPreThing": addPreThing,
        "addPlayer": addPlayer,
        "getThingById": getThingById,
        // Inputs
        "canInputsTrigger": canInputsTrigger,
        "keyDownLeft": keyDownLeft,
        "keyDownRight": keyDownRight,
        "keyDownUp": keyDownUp,
        "keyDownDown": keyDownDown,
        "keyDownA": keyDownA,
        "keyDownB": keyDownB,
        "keyDownPause": keyDownPause,
        "keyDownMute": keyDownMute,
        "keyUpLeft": keyUpLeft,
        "keyUpRight": keyUpRight,
        "keyUpUp": keyUpUp,
        "keyUpDown": keyUpDown,
        "keyUpA": keyUpA,
        "keyUpB": keyUpB,
        "keyUpPause": keyUpPause,
        "mouseDownRight": mouseDownRight,
        // Upkeep maintenance
        "maintainSolids": maintainSolids,
        "maintainCharacters": maintainCharacters,
        "maintainPlayer": maintainPlayer,
        "getHorizontalScrollAmount": getHorizontalScrollAmount,
        "getVerticalScrollAmount": getVerticalScrollAmount,
        // Character movement
        "animateCharacterSetDistanceVelocity": animateCharacterSetDistanceVelocity,
        "animateCharacterStartWalking": animateCharacterStartWalking,
        "animateCharacterStartWalkingRandom": animateCharacterStartWalkingRandom,
        "animatePlayerStartWalking": animatePlayerStartWalking,
        "animateCharacterSetDirection": animateCharacterSetDirection,
        "animateCharacterStopWalking": animateCharacterStopWalking,
        "animatePlayerStopWalking": animatePlayerStopWalking,
        "animateFlipOnDirection": animateFlipOnDirection,
        "animateUnflipOnDirection": animateUnflipOnDirection,
        "animateSwitchFlipOnDirection": animateSwitchFlipOnDirection,
        "animateCharacterDialogFinish": animateCharacterDialogFinish,
        // Collisions
        "generateCanThingCollide": generateCanThingCollide,
        "generateIsCharacterTouchingCharacter": generateIsCharacterTouchingCharacter,
        "generateIsCharacterTouchingSolid": generateIsCharacterTouchingSolid,
        "generateHitCharacterThing": generateHitCharacterThing,
        "collideTransporter": collideTransporter,
        "collidePlayerBordering": collidePlayerBordering,
        // Death
        "killNormal": killNormal,
        // Activations
        "activateTransporter": activateTransporter,
        "activateTransporterAnimated": activateTransporterAnimated,
        // Physics
        "getDirectionBordering": getDirectionBordering,
        "isThingOverlappingOther": isThingOverlappingOther,
        "shiftCharacter": shiftCharacter,
        "setPlayerDirection": setPlayerDirection,
        // Spawning
        "spawnCharacterRoaming": spawnCharacterRoaming,
        "activateCharacterRoaming": activateCharacterRoaming,
        "activateSpawner": activateSpawner,
        "spawnWindowDetector": spawnWindowDetector,
        "checkWindowDetector": checkWindowDetector,
        "spawnAreaSpawner": spawnAreaSpawner,
        "activateAreaSpawner": activateAreaSpawner,
        // Menus
        "openPauseMenu": openPauseMenu,
        "closePauseMenu": closePauseMenu,
        "togglePauseMenu": togglePauseMenu,
        "openPokedexMenu": openPokedexMenu,
        "openPokemonMenu": openPokemonMenu,
        "openItemsMenu": openItemsMenu,
        "openPlayerMenu": openPlayerMenu,
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
        "mapEntranceNormal": mapEntranceNormal,
        // Map macros
        "macroCheckered": macroCheckered,
        "macroWater": macroWater,
        "macroHouse": macroHouse,
        "macroHouseLarge": macroHouseLarge,
        "macroBuilding": macroBuilding,
        "macroGym": macroGym,
        "macroMountain": macroMountain,
        // Miscellaneous utilities
        "stringOf": stringOf,
        "makeDigit": makeDigit
    });

    return FullScreenPokemon;
})(GameStartr);